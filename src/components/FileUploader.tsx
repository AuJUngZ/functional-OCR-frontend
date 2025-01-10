import React from 'react'
import { Upload, UploadProps } from 'antd'
import { InboxOutlined } from '@ant-design/icons'

const { Dragger } = Upload

interface FileUploaderProps {
    uploadProps: UploadProps
}

const FileUploader: React.FC<FileUploaderProps> = ({ uploadProps }) => (
    <Dragger {...uploadProps} style={{ marginBottom: 24 }}>
        <p className="ant-upload-drag-icon">
            <InboxOutlined />
        </p>
        <p className="ant-upload-text">
            Click or drag image to this area to upload
        </p>
        <p className="ant-upload-hint">Supports: JPG, PNG, GIF</p>
    </Dragger>
)

export default FileUploader
