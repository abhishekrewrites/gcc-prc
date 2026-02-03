const BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

class APIError extends Error {
    constructor(public status: number, public message: string, public data?: any) {
        super(message);
        this.name = 'APIError';
    }
}

type Utils = {
    headers?: Record<string, string>;
};

export const apiClient = {
    get: async <T>(endpoint: string, { headers }: Utils = {}): Promise<T> => {
        const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                ...headers,
            },
        });

        if (!res.ok) {
            let errorMessage = 'An error occurred';
            let errorData;
            try {
                errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.log(e);
            }
            throw new APIError(res.status, errorMessage, errorData);
        }

        return res.json();
    },

    post: async<T>(endpoint: string, body: any, { headers }: Utils = {}): Promise<T> => {
        const res = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            let errorMessage = 'An error occurred';
            let errorData;
            try {
                errorData = await res.json();
                errorMessage = errorData.message || errorMessage;
            } catch (e) {
                console.log(e);
            }
            throw new APIError(res.status, errorMessage, errorData);
        }

        return res.json();
    },

};
