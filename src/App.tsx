import { useState, useCallback } from 'react'
import { Button, Card, Typography, message } from 'antd'
import { UploadProps } from 'antd/es/upload'
import FileUploader from './components/FileUploader'
import PreviewImage from './components/PreviewImage'
import ExtractedText from './components/ExtractedText'
import {
    handleFileUpload,
    handleFileRemoval,
    callOCRApi,
} from './utils/imageSelection'
import { AppState, createInitialState } from './types/ocr'

const { Title, Text } = Typography

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

                    <FileUploader uploadProps={uploadProps} />

                    {state.previewUrl && (
                        <PreviewImage previewUrl={state.previewUrl} />
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
                    <ExtractedText ocrResult={state.ocrResult} />
                )}
            </div>
        </div>
    )
}

export default App
