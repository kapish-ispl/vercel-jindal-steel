import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';
import { unstable_cache } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = (process.env.NEXT_PUBLIC_API_PROXY_URL || 'https://api.jindalsteelpower.com').replace(/\/$/, '');

function buildSecureHeaders(contentType?: string | null): Record<string, string> {
    return {
        [KEYS.CONTENT_TYPE]: contentType || CONSTANTS.FORMAT,
        [KEYS.ACCEPT_TYPE]: CONSTANTS.FORMAT,
        [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
        [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
        [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
    };
}

// Module-level cached fetcher: stable function identity across requests
const getCachedProxyData = unstable_cache(
    async (pathStr: string, searchParams: string, contentType: string) => {
        const externalUrl = `${EXTERNAL_API_BASE}/${pathStr}${searchParams}`;

        // [LOG 2/5] Cache Miss — this callback executes ONLY when cache is missed/expired
        console.log(`[Proxy] [2/5] 🌐 [CACHE MISS] Fetching fresh data from external backend: ${externalUrl}`);

        const externalResponse = await fetch(externalUrl, {
            method: 'GET',
            headers: buildSecureHeaders(contentType),
            cache: 'no-store',
        });
        const data = await externalResponse.json();

        // [LOG 3/5] Fresh backend response received and saving to cache
        console.log(`[Proxy] [3/5] 💾 [CACHE STORE] Backend responded (${externalResponse.status}). Storing in unstable_cache: key=['proxy', '${pathStr}', '${searchParams}']`);

        return {
            data,
            status: externalResponse.status,
            fetchedAt: Date.now(),
        };
    },
    ['proxy'],
    {
        revalidate: 1800,
    }
);

async function handleRequest(
    req: NextRequest,
    params: Promise<{ path: string[] }>,
    method: string
): Promise<NextResponse> {
    try {
        const { path } = await params;
        const pathStr = path.join('/');
        const searchParams = req.nextUrl.search;
        const externalUrl = `${EXTERNAL_API_BASE}/${pathStr}${searchParams}`;

        // [LOG 1/5] Route entry / invocation
        console.log(`[Proxy] [1/5] 📥 Incoming Request: ${method} /${pathStr}${searchParams}`);

        if (method === 'GET') {
            const contentType = req.headers.get('content-type') || CONSTANTS.FORMAT;
            const result = await getCachedProxyData(pathStr, searchParams, contentType);

            const age = Math.max(0, Date.now() - result.fetchedAt);
            const cacheStatus = age < 1000 ? 'MISS' : 'HIT';

            // [LOG 4/5] Cache evaluation — explicitly logs HIT or MISS with elapsed age
            console.log(`[Proxy] [4/5] 🎯 [CACHE ${cacheStatus}] Served ${cacheStatus === 'HIT' ? 'from server-side cache' : 'freshly from backend'} (Age: ${age}ms) for /${pathStr}${searchParams}`);

            // [LOG 5/5] Outgoing response dispatched
            console.log(`[Proxy] [5/5] 📤 Dispatching response: status=${result.status}, X-Cache-Status=${cacheStatus}, X-Cache-Age-Ms=${age}`);

            return NextResponse.json(result.data, {
                status: result.status,
                headers: {
                    'X-Cache-Status': cacheStatus,
                    'X-Cache-Age-Ms': age.toString(),
                },
            });
        }

        // Non-GET requests bypass caching completely
        console.log(`[Proxy] ⚡ [BYPASS] Non-GET method (${method}) bypassing cache, calling external backend: ${externalUrl}`);

        const fetchOptions: RequestInit = {
            method,
            headers: buildSecureHeaders(req.headers.get('content-type')),
            cache: 'no-store',
        };

        const body = await req.text();
        if (body) fetchOptions.body = body;

        const externalResponse = await fetch(externalUrl, fetchOptions);
        const data = await externalResponse.json();

        return NextResponse.json(data, {
            status: externalResponse.status,
            headers: {
                'X-Cache-Status': 'BYPASS',
            },
        });
    } catch (error) {
        console.error('[Proxy Error]', error);
        return NextResponse.json(
            { error: true, message: 'Proxy request failed.' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, params, 'GET');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, params, 'POST');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, params, 'PUT');
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, params, 'DELETE');
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
    return handleRequest(req, params, 'PATCH');
}