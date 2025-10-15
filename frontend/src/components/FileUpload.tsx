import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  IconButton,
  Chip,
  Alert,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { showSuccessToast, showErrorToast } from '../utils/toast';

interface FileUploadProps {
  label: string;
  onFileUploaded: (filePath: string, originalFilename: string) => void;
  onFileRemoved?: () => void;
  acceptedTypes?: string;
  maxSizeMB?: number;
  currentFilePath?: string;
  currentFileName?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  onFileUploaded,
  onFileRemoved,
  acceptedTypes = ".pdf,.doc,.docx,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  currentFilePath,
  currentFileName,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      showErrorToast(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Validate file type
    const allowedTypes = acceptedTypes.split(',').map(type => type.trim());
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setError(`Invalid file type. Allowed types: ${acceptedTypes}`);
      showErrorToast(`Invalid file type. Allowed types: ${acceptedTypes}`);
      return;
    }

    setError('');
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = progressEvent.total
            ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
            : 0;
          setUploadProgress(progress);
        },
      });

      if (response.data.filePath) {
        onFileUploaded(response.data.filePath, response.data.originalFilename);
        showSuccessToast('File uploaded successfully');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to upload file';
      setError(errorMessage);
      showErrorToast(errorMessage);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveFile = async () => {
    if (currentFilePath) {
      try {
        await axios.delete('/api/files/delete', {
          params: { filePath: currentFilePath }
        });
        showSuccessToast('File removed successfully');
      } catch (err) {
        showErrorToast('Failed to remove file');
      }
    }
    if (onFileRemoved) {
      onFileRemoved();
    }
  };

  const handleDownloadFile = () => {
    if (currentFilePath) {
      window.open(`/api/files/download/${currentFilePath}`, '_blank');
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        {label}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {currentFilePath && currentFileName ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <FileIcon color="primary" />
          <Chip
            label={currentFileName}
            onClick={handleDownloadFile}
            sx={{ cursor: 'pointer' }}
          />
          <IconButton
            size="small"
            onClick={handleRemoveFile}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ) : (
        <Box>
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <Button
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            fullWidth
          >
            {uploading ? 'Uploading...' : `Choose ${label.toLowerCase()}`}
          </Button>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
