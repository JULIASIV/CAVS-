import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon, XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const CameraCapture = ({ onCapture, onClose, studentId = null, courseId = null }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please grant camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      canvas.toBlob((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        setCapturedImage({ blob, url: imageUrl });
      }, 'image/jpeg', 0.95);
    }
  };

  const retakePhoto = () => {
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
    retakePhoto();
  };

  const handleConfirm = async () => {
    if (capturedImage && onCapture) {
      setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('image', capturedImage.blob, 'capture.jpg');
        if (studentId) formData.append('student_id', studentId);
        if (courseId) formData.append('course_id', courseId);
        
        await onCapture(formData);
        handleClose();
      } catch (err) {
        setError('Failed to upload image. Please try again.');
        console.error('Upload error:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleClose = () => {
    stopCamera();
    if (capturedImage?.url) {
      URL.revokeObjectURL(capturedImage.url);
    }
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {capturedImage ? 'Review Photo' : 'Capture Photo'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Camera/Preview Area */}
        <div className="p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="relative bg-black rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%' }}>
            {!capturedImage ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Face Detection Overlay (placeholder for future ML integration) */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-blue-500 rounded-lg opacity-50"></div>
                </div>
              </>
            ) : (
              <img
                src={capturedImage.url}
                alt="Captured"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-center gap-4">
            {!capturedImage ? (
              <>
                <button
                  onClick={switchCamera}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Switch Camera
                </button>
                
                <button
                  onClick={capturePhoto}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-lg font-medium"
                  disabled={isLoading || !stream}
                >
                  <CameraIcon className="h-6 w-6" />
                  Capture
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={retakePhoto}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                  disabled={isLoading}
                >
                  <ArrowPathIcon className="h-5 w-5" />
                  Retake
                </button>
                
                <button
                  onClick={handleConfirm}
                  className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 text-lg font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-6 w-6" />
                      Confirm
                    </>
                  )}
                </button>
              </>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-4 text-center text-sm text-gray-500">
            {!capturedImage ? (
              <p>Position your face within the frame and click capture</p>
            ) : (
              <p>Review the photo and confirm to upload</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

