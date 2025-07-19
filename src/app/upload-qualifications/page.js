// app/upload-qualifications/page.js
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { UploadCloud } from 'lucide-react';

export default function UploadQualifications() {
  const router = useRouter();
  const { user, updateUser } = useUser();
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) return;

    setIsUploading(true);
    
    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setUploadProgress(i);
      }

      // Prepare documents for upload
      const documents = files.map(file => ({
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        // In a real app, you would upload the file to storage and get a URL
        fileUrl: URL.createObjectURL(file)
      }));

      // Update user with documents
      await updateUser({
        documents,
        profileComplete: true
      });

      // Redirect to job board
      router.push('/jobs');
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Upload Your Qualifications</h1>
          <p className="text-gray-600">
            Please upload your certificates, diplomas, or any other relevant documents to verify your qualifications.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="qualifications">Qualification Documents</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="flex flex-col items-center justify-center space-y-3">
                <UploadCloud className="h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select files
                </p>
                <Input 
                  id="qualifications" 
                  type="file" 
                  multiple 
                  onChange={handleFileChange}
                  className="hidden" 
                />
                <Button 
                  variant="outline" 
                  type="button"
                  onClick={() => document.getElementById('qualifications').click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Selected files:</p>
                <ul className="space-y-1">
                  {files.map((file, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {file.name} ({Math.round(file.size / 1024)} KB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {isUploading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-gray-600 text-center">
                Uploading {uploadProgress}%
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              type="button"
              onClick={() => router.push('/jobs')}
              disabled={isUploading}
            >
              Skip for Now
            </Button>
            <Button 
              type="submit"
              disabled={files.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Submit Documents'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}