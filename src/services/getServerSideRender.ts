import { decryptResponse } from '@/components/decryption';
import { CONSTANTS } from '@/config/constant';
import { KEYS } from '@/config/key';

export async function serverRequest(request: any, url: string, methodName: string, requestType: 'client' | 'server' = 'client'): Promise<any> {
  let baseUrl = '';
  if (requestType == 'server') {
    baseUrl = 'http://localhost:3000';
  } else {
    baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  }
  try {
    const requestHeaders = await getHeader(url, request);
    let response: Response;

    if (methodName === CONSTANTS.REQUEST_GET) {
      response = await fetch(url, {
        method: methodName,
        headers: requestHeaders,
        cache: 'no-store',
      });
    } else {
      response = await fetch(url, {
        method: methodName,
        headers: requestHeaders,
        body: JSON.stringify(request),
      });
    }

    const json = await response.json();

    // Optionally handle API errors
    if (json?.errors?.length > 0 && json.errors[0]?.message) {
      console.warn('API Error:', json.errors[0].message);
    }
    if (json && json.code == 'SUC200') {
      const data = decryptResponse(json.data);
      // const res = await fetch(`${baseUrl}/api/decrypt`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     responseFromApi: json.data,
      //   }),
      // });
      //const data = await res.json();
      return {
        ...json,
        data: data
      };
    }
    //return json;
  } catch (error) {
    console.error('Fetch error:', error);
    return {
      error: true,
      message: 'Something went wrong while fetching data.',
    };
  }
}

export async function getHeader(url: string, request: any): Promise<Record<string, string>> {
  return {
    [KEYS.CONTENT_TYPE]: CONSTANTS.FORMAT,
    [KEYS.ACCEPT_TYPE]: CONSTANTS.FORMAT,
    [KEYS.ACCEPT_LANGUAGE]: CONSTANTS.LANGUAGE_ENGLISH,
    [KEYS.X_AUTHORIZATION_TOKEN]: CONSTANTS.X_AUTHORIZATION_TOKEN || '',
    [KEYS.X_NETWORK_GUID]: CONSTANTS.X_NETWORK_GUID || '',
  };
}
