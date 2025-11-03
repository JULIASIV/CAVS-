import React, { useRef, useState, useEffect } from 'react';
import { CameraIcon, XMarkIcon, CheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

const CameraCapture = ({ onCapture, onClose, studentId = null, courseId = null }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionCanvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' for rear camera (classroom)
  const [detectedFaces, setDetectedFaces] = useState([]);
  const [isDetecting, setIsDetecting] = useState(false);
  const detectionIntervalRef = useRef(null);
  const MAX_FACES = 50; // Maximum 50 students per capture

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [facingMode]);

  // Simple face detection using canvas analysis (placeholder for backend processing)
  const detectFaces = () => {
    if (!videoRef.current || !detectionCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = detectionCanvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = video.videoWidth / 4; // Reduce size for performance
    canvas.height = video.videoHeight / 4;
    
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // This is a placeholder. Real face detection will be done on backend
    // For now, we'll just show the detection is active
    setIsDetecting(true);
  };

  useEffect(() => {
    if (stream && !capturedImage) {
      // Start periodic face detection (every 500ms)
      detectionIntervalRef.current = setInterval(detectFaces, 500);
    } else {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
      setIsDetecting(false);
    }
    
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [stream, capturedImage]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: facingMode,
          width: { ideal: 1920 }, // Higher resolution for group photos
          height: { ideal: 1080 }
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
        formData.append('max_faces', MAX_FACES); // Tell backend to detect up to 50 faces
        formData.append('capture_type', 'group'); // Indicate this is a group capture
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
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {capturedImage ? 'Review Group Photo' : 'Capture Class Attendance'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {capturedImage ? 'Up to 50 students will be detected' : 'Position camera to capture entire classroom (up to 50 students)'}
            </p>
          </div>
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
                <canvas ref={detectionCanvasRef} className="hidden" />
                
                {/* Multi-Face Detection Indicator */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* Frame guide for classroom capture */}
                  <div className="absolute inset-4 border-2 border-green-500 rounded-lg opacity-50"></div>
                  
                  {/* Detection status */}
                  {isDetecting && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Detecting Faces...
                    </div>
                  )}
                  
                  {/* Instructions overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm text-center max-w-md">
                    <p className="font-semibold">📸 Group Capture Mode</p>
                    <p className="mt-1">Position camera to include all students (max 50 faces)</p>
                  </div>
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
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-center">
              {!capturedImage ? (
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-2">📋 Classroom Capture Tips:</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>✓ Ensure good lighting across the classroom</li>
                    <li>✓ Position camera at eye level</li>
                    <li>✓ Capture from 3-5 meters distance for best results</li>
                    <li>✓ Students should face the camera</li>
                    <li>✓ System will detect up to 50 faces automatically</li>
                  </ul>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-semibold text-blue-900 mb-1">Review Group Photo</p>
                  <p className="text-xs text-blue-700">The system will automatically detect and identify all students in this photo (up to 50 faces). Click Confirm to process.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;

