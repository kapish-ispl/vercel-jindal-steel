import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE = (process.env.NEXT_PUBLIC_API_PROXY_URL || 'https://api.jindalsteelpower.com').replace(/\/$/, '');

function buildSecureHeaders(req: NextRequest): Record<string, string> {
    const contentType = req.headers.get('content-type') || CONSTANTS.FORMAT;
    return {
        [KEYS.CONTENT_TYPE]: contentType,
        [KEYS.ACCEPT_TYPE]: CONSTANTS.FORMAT,
        [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
        [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
        [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
    };
}

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

        const fetchOptions: RequestInit = {
            method,
            headers: buildSecureHeaders(req),
            cache: 'no-store',
        };

        // Forward request body for non-GET requests
        if (method !== 'GET') {
            const body = await req.text();
            if (body) fetchOptions.body = body;
        }

        const externalResponse = await fetch(externalUrl, fetchOptions);
        const data = await externalResponse.json();

        return NextResponse.json(data, { status: externalResponse.status });
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