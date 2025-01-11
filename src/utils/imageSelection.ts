import { message } from 'antd'
import { UploadFile } from 'antd/es/upload/interface'
import { createFetchOptions, createFormData } from './httpRequest'
import { postOcr } from '../repository/ocr'
import { composeAsync } from './funcltions'
import { AppState, OCRResponse } from '../types/ocr'

export const isValidImageFile = (file: File): boolean =>
    file.type.startsWith('image/')

export const createFileListEntry = (file: File): UploadFile => ({
    uid: '-1',
    name: file.name,
    status: 'done',
})

export const callOCRApi = async (file: File): Promise<OCRResponse> => {
    const response = await composeAsync(
        postOcr,
        createFetchOptions('POST'),
        createFormData
    )(file)

    if (!response.success) {
        throw new Error('OCR processing failed')
    }

    return response.data
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
