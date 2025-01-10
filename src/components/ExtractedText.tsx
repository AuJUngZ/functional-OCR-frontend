import React from 'react'
import { Card, Typography, Input } from 'antd'

const { Text } = Typography
const { TextArea } = Input

interface ExtractedTextProps {
    ocrResult: string
}

const ExtractedText: React.FC<ExtractedTextProps> = ({ ocrResult }) => (
    <Card
        style={{
            width: '60%',
            margin: '0 12px',
            boxShadow: '0 1px 2px 0 rgba(0,0,0,0.03)',
        }}
    >
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Extracted Text:
        </Text>
        <TextArea
            value={ocrResult}
            readOnly
            rows={20}
            style={{ marginBottom: 24 }}
            placeholder="OCR result will appear here..."
        />
    </Card>
)

export default ExtractedText
