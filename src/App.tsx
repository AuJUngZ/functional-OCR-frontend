import { useState, useCallback } from 'react'
import {
    Upload,
    Button,
    Input,
    Card,
    message,
    Typography,
    Image,
    UploadProps,
    UploadFile,
} from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload
const { TextArea } = Input
const { Title, Text } = Typography

const isValidImageFile = (file: File): boolean => file.type.startsWith('image/')

const createFileListEntry = (file: File): UploadFile => ({
    uid: '-1',
    name: file.name,
    status: 'done',
})

const createInitialState = () => ({
    file: null as File | null,
    previewUrl: '',
    ocrResult: '',
    isProcessing: false,
    fileList: [] as UploadFile[],
})

type AppState = ReturnType<typeof createInitialState>
type OCRResponse = {
    text: string
}

const createFormData = (file: File): FormData => {
    const formData = new FormData()
    formData.append('image', file)
    return formData
}

type HttpMethods = 'GET' | 'POST' | 'PUT' | 'DELETE'
const createFetchOptions = (method: HttpMethods) => {
    return (formData: FormData): RequestInit => ({
        method: method,
        body: formData,
    })
}

const callOCRApi = async (file: File): Promise<OCRResponse> => {
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

const handleFileUpload = (
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

const handleFileRemoval = (currentState: AppState): Partial<AppState> => {
    if (currentState.previewUrl) {
        URL.revokeObjectURL(currentState.previewUrl)
    }

    return {
        file: null,
        previewUrl: '',
        fileList: [],
    }
}

function App() {
    const [state, setState] = useState(createInitialState)

    const updateState = useCallback((newState: Partial<AppState>) => {
        setState((currentState) => ({
            ...currentState,
            ...newState,
        }))
    }, [])

    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        accept: 'image/*',
        fileList: state.fileList,
        beforeUpload: (file: File) => {
            updateState(handleFileUpload(file, state))
            return false
        },
        onRemove: () => {
            updateState(handleFileRemoval(state))
        },
    }

    const handleOcr = useCallback(async () => {
        if (!state.file) {
            message.error('Please upload an image first!')
            return
        }

        updateState({ isProcessing: true })

        try {
            const result = await callOCRApi(state.file)

            updateState({ ocrResult: result.text })
            message.success('Text extracted successfully!')
        } catch (error) {
            message.error('Failed to process image. Please try again.')
            console.error('OCR Error:', error)
        } finally {
            updateState({ isProcessing: false })
        }
    }, [state.file, updateState])

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#f0f2f5',
                padding: '24px',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Card
                    style={{
                        width: '60%',
                        margin: '0 12px',
                        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
                    }}
                >
                    <Title level={2} style={{ marginBottom: 8 }}>
                        Image OCR Tool
                    </Title>
                    <Text
                        type="secondary"
                        style={{ display: 'block', marginBottom: 24 }}
                    >
                        Upload an image to extract text using OCR technology
                    </Text>

                    <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag image to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Supports: JPG, PNG, GIF
                        </p>
                    </Dragger>

                    {state.previewUrl && (
                        <div
                            style={{
                                marginBottom: 24,
                                textAlign: 'center',
                            }}
                        >
                            <Text
                                strong
                                style={{ display: 'block', marginBottom: 8 }}
                            >
                                Preview:
                            </Text>
                            <Image
                                src={state.previewUrl}
                                alt="Preview"
                                style={{ maxHeight: '300px' }}
                            />
                        </div>
                    )}

                    <Button
                        type="primary"
                        onClick={handleOcr}
                        loading={state.isProcessing}
                        style={{ width: '100%', marginBottom: 24 }}
                        disabled={!state.file}
                    >
                        {state.isProcessing ? 'Processing...' : 'Extract Text'}
                    </Button>
                </Card>

                {state.ocrResult && (
                    <Card
                        style={{
                            width: '60%',
                            margin: '0 12px',
                            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
                        }}
                    >
                        <Text
                            strong
                            style={{ display: 'block', marginBottom: 8 }}
                        >
                            Extracted Text:
                        </Text>
                        <TextArea
                            value={state.ocrResult}
                            readOnly
                            rows={20}
                            style={{ marginBottom: 24 }}
                            placeholder="OCR result will appear here..."
                        />
                    </Card>
                )}
            </div>
        </div>
    )
}

export default App
