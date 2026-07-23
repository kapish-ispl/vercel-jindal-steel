import { decryptResponse } from '@/components/decryption';
import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';

const FETCH_TIMEOUT_MS = 15_000;
const MAX_RETRIES = 1;

async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWithRetry(
  url: string,
  options: RequestInit,
  retries: number = MAX_RETRIES,
  timeoutMs: number = FETCH_TIMEOUT_MS
): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fetchWithTimeout(url, options, timeoutMs);
    } catch (error) {
      const isTimeout =
        error instanceof DOMException && error.name === 'AbortError';

      if (isTimeout && attempt < retries) {
        console.warn(`[serverRequest] Timeout fetching ${url}, retrying (${attempt + 1}/${retries})...`);
        await new Promise((resolve) => setTimeout(resolve, 1_000));
        continue;
      }

      throw error;
    }
  }

  throw new Error('Unreachable');
}

export async function serverRequest(
  request: any,
  url: string,
  methodName: string,
  requestType: 'client' | 'server' = 'client'
): Promise<any> {
  try {
    let response: Response;

    if (requestType === 'server') {
      const requestHeaders = buildServerHeaders();
      const apiBase = process.env.NEXT_PUBLIC_API_PROXY_URL || '';
      const absoluteUrl = url.startsWith('http') ? url : `${apiBase}${url}`;

      if (methodName === CONSTANTS.REQUEST_GET) {
        response = await fetchWithRetry(absoluteUrl, {
          method: 'GET',
          headers: requestHeaders,
          cache: 'no-store',
        });
      } else {
        response = await fetchWithRetry(absoluteUrl, {
          method: methodName,
          headers: requestHeaders,
          body: JSON.stringify(request),
        });
      }
    } else {
      const proxyUrl = `/api/proxy${url}`;

      if (methodName === CONSTANTS.REQUEST_GET) {
        response = await fetchWithRetry(proxyUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
      } else {
        response = await fetchWithRetry(proxyUrl, {
          method: methodName,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(request),
        });
      }
    }

    const json = await response.json();

    if (json?.errors?.length > 0 && json.errors[0]?.message) {
      console.warn('API Error:', json.errors[0].message);
    }

    if (json && json.code === CONSTANTS.STATUS_SUCCESS) {
      const data = decryptResponse(json.data);
      return { ...json, data };
    }

    return json;
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      error: true,
      message: 'Something went wrong while fetching data.',
    };
  }
}

export function buildServerHeaders(): Record<string, string> {
  return {
    [KEYS.CONTENT_TYPE]: CONSTANTS.FORMAT,
    [KEYS.ACCEPT_TYPE]: CONSTANTS.FORMAT,
    [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
    [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
    [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
  };
}
