import { Result } from '../types/httpResponse'

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'

export const createFormData = (file: File): FormData => {
    const formData = new FormData()
    formData.append('image', file)
    return formData
}

export const createFetchOptions = (method: HttpMethods) => {
    return <T>(body: T | FormData): Partial<RequestInit> => ({
        method,
        body: body instanceof FormData ? body : JSON.stringify(body),
    })
}

export async function safeFetch<T>(
    input: RequestInfo,
    init?: RequestInit
): Promise<Result<T>> {
    try {
        const response = await fetch(input, init)

        // Handle non-OK HTTP responses as errors
        if (!response.ok) {
            return {
                success: false,
                error: new Error(`HTTP error! status: ${response.status}`),
            }
        }

        const data: T = await response.json()
        return { success: true, data }
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
        }
    }
}
