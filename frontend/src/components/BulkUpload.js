import React, { useState, useRef } from 'react';
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const BulkUpload = ({ onUpload, onClose, courseId = null }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith('image/'));
    
    const newFiles = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: 'pending' // pending, uploading, success, error
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const droppedFiles = Array.from(event.dataTransfer.files);
    const imageFiles = droppedFiles.filter(file => file.type.startsWith('image/'));
    
    const newFiles = imageFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const results = [];

    for (const fileData of files) {
      setFiles(prev => prev.map(f => 
        f.id === fileData.id ? { ...f, status: 'uploading' } : f
      ));

      try {
        const formData = new FormData();
        formData.append('image', fileData.file);
        if (courseId) formData.append('course_id', courseId);

        await onUpload(formData);
        
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'success' } : f
        ));
        
        results.push({ id: fileData.id, status: 'success', name: fileData.name });
      } catch (error) {
        setFiles(prev => prev.map(f => 
          f.id === fileData.id ? { ...f, status: 'error', error: error.message } : f
        ));
        
        results.push({ id: fileData.id, status: 'error', name: fileData.name, error: error.message });
      }
    }

    setUploadResults(results);
    setUploading(false);
  };

  const handleClose = () => {
    files.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Bulk Photo Upload</h3>
            <p className="text-sm text-gray-500">Upload multiple student photos at once</p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Upload Area */}
          {files.length === 0 && (
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <CloudArrowUpIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-700 mb-2">
                Drop photos here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Supports: JPG, PNG, WebP (Max 10MB each)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  {files.length} file{files.length !== 1 ? 's' : ''} selected
                  {successCount > 0 && (
                    <span className="ml-2 text-green-600">• {successCount} uploaded</span>
                  )}
                  {errorCount > 0 && (
                    <span className="ml-2 text-red-600">• {errorCount} failed</span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  Add More
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.map((fileData) => (
                  <div
                    key={fileData.id}
                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <img
                      src={fileData.preview}
                      alt={fileData.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {fileData.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(fileData.size)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {fileData.status === 'pending' && (
                        <button
                          onClick={() => removeFile(fileData.id)}
                          disabled={uploading}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                      
                      {fileData.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                      )}
                      
                      {fileData.status === 'success' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      )}
                      
                      {fileData.status === 'error' && (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {files.length > 0 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button
              onClick={handleClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 disabled:opacity-50"
            >
              Cancel
            </button>
            
            <button
              onClick={handleUpload}
              disabled={uploading || files.every(f => f.status !== 'pending')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-5 w-5" />
                  Upload All
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;

