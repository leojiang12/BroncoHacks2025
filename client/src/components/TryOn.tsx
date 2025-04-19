import React, { useState } from 'react';
import { Upload, Button, Space, Spin, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../services/api';
import { TryOnResult } from './TryOnCanvas';

export default function TryOn() {
  const [file, setFile] = useState<File | null>(null);
  const [sessionId, setSessionId] = useState<string>('');
  const [status, setStatus] = useState<'idle'|'uploading'|'processing'|'ready'>('idle');

  // Poll for completion
  React.useEffect(() => {
    if (status !== 'processing' || !sessionId) return;
    const iv = setInterval(async () => {
      try {
        const { data } = await api.get(`/tryon/${sessionId}`);
        if (data.fitted_mesh_path) {
          setStatus('ready');
          clearInterval(iv);
        }
      } catch {
        // still processing
      }
    }, 3000);
    return () => clearInterval(iv);
  }, [status, sessionId]);

  const handleUpload = async () => {
    if (!file) return message.error('Select a video first');
    setStatus('uploading');
    const form = new FormData();
    form.append('video', file);
    try {
      const { data } = await api.post('/tryon/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setSessionId(String(data.sessionId));
      setStatus('processing');
      message.success('Video uploaded; processing started.');
    } catch (err) {
      console.error(err);
      setStatus('idle');
      message.error('Upload failed.');
    }
  };

  return (
    <div>
      {status === 'idle' && (
        <Space>
          <Upload
            accept="video/*"
            maxCount={1}
            beforeUpload={f => { setFile(f); return false; }}
            onRemove={() => setFile(null)}
            fileList={file ? [{ uid: file.name, name: file.name, status: 'done' }] : []}
          >
            <Button icon={<UploadOutlined />}>Select Video</Button>
          </Upload>
          <Button type="primary" onClick={handleUpload} disabled={!file}>
            Upload & Try‑On
          </Button>
        </Space>
      )}
      {status === 'uploading' && <Space><Spin /> Uploading…</Space>}
      {status === 'processing' && <Space><Spin /> Processing…</Space>}
      {status === 'ready' && <TryOnResult sessionId={sessionId} />}
    </div>
  );
}