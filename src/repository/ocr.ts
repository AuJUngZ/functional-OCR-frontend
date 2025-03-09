import { Result } from '../types/httpResponse'
import { OCRResponse } from '../types/ocr'
import { safeFetch } from '../utils/httpRequest'

export const postOcr = async (
    options: RequestInit
): Promise<Result<OCRResponse>> => {
    return await safeFetch<OCRResponse>('/api/ocr', options)
}
