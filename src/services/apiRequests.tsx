import { CONSTANTS } from "@/config/constant";
import { decryptResponse } from "@/components/decryption";

const headers = {
    "X-Token": CONSTANTS.X_AUTHORIZATION_TOKEN,
    "X-Network-Guid": CONSTANTS.X_NETWORK_GUID || '',
};

export const postUploadFileResponse = async (endPoint: string, data: any, signal?: any) => {
    try {
        const formdata = new FormData();
        formdata.append("file", data);

        const proxyUrl = `/api/proxy${endPoint}`;
        const fetchData = await fetch(proxyUrl, {
            method: "POST",
            mode: "cors",
            headers: headers,
            body: formdata,
            signal: signal,
            redirect: 'follow'
        });

        if (!fetchData.ok) {
            throw new Error(`HTTP error! status: ${fetchData.status}`);
        }

        const json = await fetchData.json();

        if (json && json.code === 'SUC200' && json.data) {
            try {
                const decryptedData = decryptResponse(json.data);
                return {
                    ...json,
                    data: decryptedData
                };
            } catch (decryptionError) {
                console.warn("Decryption failed for upload response, returning raw data:", decryptionError);
                return json;
            }
        }

        return json;
    } catch (err) {
        console.error("File upload error:", err);
        return {
            error: true,
            code: 'ERR_UPLOAD',
            message: err instanceof Error ? err.message : String(err)
        };
    }
};

export const postAPIResponse = async (endPoint: string, data: any, signal?: any) => {
    try {
        const proxyUrl = `/api/proxy${endPoint}`;
        const fetchData = await fetch(proxyUrl, {
            method: "POST",
            mode: "cors",
            headers: { ...headers, "content-type": "application/json" },
            body: JSON.stringify(data),
            signal: signal
        });

        if (!fetchData.ok) {
            throw new Error(`HTTP error! status: ${fetchData.status}`);
        }

        const json = await fetchData.json();

        if (json && json.code === 'SUC200' && json.data) {
            try {
                const decryptedData = decryptResponse(json.data);
                return {
                    ...json,
                    data: decryptedData
                };
            } catch (decryptionError) {
                console.warn("Decryption failed for API response, returning raw data:", decryptionError);
                return json;
            }
        }

        return json;
    } catch (err) {
        console.error("API request error:", err);
        return {
            error: true,
            code: 'ERR_API',
            message: err instanceof Error ? err.message : String(err)
        };
    }
};

export const postFormDataResponse = async (endPoint: string, formData: FormData, signal?: AbortSignal) => {
    try {
        const proxyUrl = `/api/proxy${endPoint}`;
        const res = await fetch(proxyUrl, {
            method: "POST",
            headers: {
                ...headers
            },
            body: formData,
            signal,
        });

        const json = await res.json();
        return json;
    } catch (err) {
        console.error("Multipart POST error:", err);
        return {
            error: true,
            code: 'ERR_MULTIPART',
            message: err instanceof Error ? err.message : String(err)
        };
    }
};