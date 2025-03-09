'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { Card, Typography, Input, Button, Space, message } from 'antd'
import { DownloadOutlined, EditOutlined, SaveOutlined } from '@ant-design/icons'

const { Text } = Typography
const { TextArea } = Input

interface ExtractedTextProps {
    ocrResult: string
}

const ExtractedText: React.FC<ExtractedTextProps> = ({ ocrResult }) => {
    const [text, setText] = useState<string>(ocrResult)
    const [isEditing, setIsEditing] = useState<boolean>(false)

    // Update text when ocrResult prop changes
    useEffect(() => {
        setText(ocrResult)
    }, [ocrResult])

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value)
    }

    const toggleEditMode = () => {
        setIsEditing(!isEditing)
    }

    const downloadTextFile = () => {
        try {
            // Create a blob with the text content
            const blob = new Blob([text], { type: 'text/plain' })

            // Create a URL for the blob
            const url = URL.createObjectURL(blob)

            // Create a temporary anchor element
            const link = document.createElement('a')
            link.href = url
            link.download = 'extracted-text.txt'

            // Append to the document, click it, and remove it
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)

            // Clean up the URL
            URL.revokeObjectURL(url)

            message.success('Text file downloaded successfully')
        } catch (error) {
            message.error('Failed to download text file')
            console.error('Download error:', error)
        }
    }

    return (
        <Card
            style={{
                width: '60%',
                margin: '0 12px',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
            }}
            title={
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Text strong>Extracted Text:</Text>
                    <Space>
                        <Button
                            type="primary"
                            icon={
                                isEditing ? <SaveOutlined /> : <EditOutlined />
                            }
                            onClick={toggleEditMode}
                        >
                            {isEditing ? 'Save' : 'Edit'}
                        </Button>
                        <Button
                            icon={<DownloadOutlined />}
                            onClick={downloadTextFile}
                        >
                            Download
                        </Button>
                    </Space>
                </div>
            }
        >
            <TextArea
                value={text}
                onChange={handleTextChange}
                readOnly={!isEditing}
                rows={20}
                style={{
                    marginBottom: 24,
                    backgroundColor: isEditing ? '#fff' : '#f5f5f5',
                    cursor: isEditing ? 'text' : 'default',
                }}
                placeholder="OCR result will appear here..."
            />
            {isEditing && (
                <Text
                    type="secondary"
                    style={{ display: 'block', textAlign: 'right' }}
                >
                    {text.length} characters
                </Text>
            )}
        </Card>
    )
}

export default ExtractedText
