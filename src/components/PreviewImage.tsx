import React from 'react'
import { Typography, Image } from 'antd'

const { Text } = Typography

interface PreviewImageProps {
    previewUrl: string
}

const PreviewImage: React.FC<PreviewImageProps> = ({ previewUrl }) => (
    <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Preview:
        </Text>
        <Image src={previewUrl} alt="Preview" style={{ maxHeight: '300px' }} />
    </div>
)

export default PreviewImage
