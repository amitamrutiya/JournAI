'use client';

import { FileText, Loader2, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

interface PDFUploadProps {
  onUpload: (file: File) => Promise<void>;
}

export function PDFUpload({ onUpload }: PDFUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'success' | 'error'
  >('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
      return;
    }

    setIsUploading(true);
    setUploadStatus('idle');

    try {
      await onUpload(file);
      setUploadStatus('success');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadStatus('error');
      setTimeout(() => setUploadStatus('idle'), 3000);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const getButtonText = () => {
    if (isUploading) return 'Extracting text...';
    if (uploadStatus === 'success') return '✅ Text extracted successfully!';
    if (uploadStatus === 'error') return '❌ Upload failed - PDF files only';
    return '📁 Upload PDF';
  };

  const getButtonVariant = () => {
    if (uploadStatus === 'success') return 'outline' as const;
    if (uploadStatus === 'error') return 'destructive' as const;
    return 'default' as const;
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-muted-foreground text-sm">
          Have a PDF journal? Upload it to extract the text automatically.
        </p>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleButtonClick}
          disabled={isUploading}
          variant={getButtonVariant()}
          className="w-full max-w-xs"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {getButtonText()}
            </>
          ) : uploadStatus === 'success' ? (
            <>
              <FileText className="mr-2 h-4 w-4" />
              {getButtonText()}
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {getButtonText()}
            </>
          )}
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {uploadStatus === 'error' && (
        <p className="text-destructive text-center text-sm">
          Please select a valid PDF file.
        </p>
      )}
    </div>
  );
}
