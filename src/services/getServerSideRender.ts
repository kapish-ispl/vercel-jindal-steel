import { decryptResponse } from '@/components/decryption';
import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';


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
        response = await fetch(absoluteUrl, {
          method: 'GET',
          headers: requestHeaders,
          cache: 'no-store',
        });
      } else {
        response = await fetch(absoluteUrl, {
          method: methodName,
          headers: requestHeaders,
          body: JSON.stringify(request),
        });
      }
    } else {
      const proxyUrl = `/api/proxy${url}`;

      if (methodName === CONSTANTS.REQUEST_GET) {
        response = await fetch(proxyUrl, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store',
        });
      } else {
        response = await fetch(proxyUrl, {
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
