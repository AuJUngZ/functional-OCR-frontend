import { message } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'

export const isValidImageFile = (file: File): boolean =>
    file.type.startsWith('image/')

export const createFileListEntry = (file: File): UploadFile => ({
    uid: '-1',
    name: file.name,
    status: 'done',
})

export const createInitialState = () => ({
    file: null as File | null,
    previewUrl: '',
    ocrResult: '',
    isProcessing: false,
    fileList: [] as UploadFile[],
})

export type AppState = ReturnType<typeof createInitialState>
export type OCRResponse = {
    text: string
}

export const createFormData = (file: File): FormData => {
    const formData = new FormData()
    formData.append('image', file)
    return formData
}

export type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
export const createFetchOptions = (method: HttpMethods) => {
    return (formData: FormData): RequestInit => ({
        method: method,
        body: formData,
    })
}

export const callOCRApi = async (file: File): Promise<OCRResponse> => {
    try {
        const formData = createFormData(file)
        const options = createFetchOptions('POST')(formData)
        const response = await fetch('/api/ocr', options)

        if (!response.ok) {
            throw new Error('OCR processing failed')
        }

        return await response.json()
    } catch (error) {
        console.error('OCR API Error:', error)
        throw error
    }
}

export const handleFileUpload = (
    file: File,
    currentState: AppState
): Partial<AppState> => {
    if (!isValidImageFile(file)) {
        message.error('Please upload an image file!')
        return {}
    }

    if (currentState.previewUrl) {
        URL.revokeObjectURL(currentState.previewUrl)
    }

    return {
        file,
        previewUrl: URL.createObjectURL(file),
        fileList: [createFileListEntry(file)],
    }
}

export const handleFileRemoval = (
    currentState: AppState
): Partial<AppState> => {
    if (currentState.previewUrl) {
        URL.revokeObjectURL(currentState.previewUrl)
    }

    return {
        file: null,
        previewUrl: '',
        fileList: [],
    }
}
