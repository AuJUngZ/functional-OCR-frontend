import { UploadFile } from 'antd'

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
