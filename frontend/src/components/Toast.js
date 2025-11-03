import React, { useEffect } from 'react';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Toast = ({ type = 'info', message, onClose, duration = 5000 }) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          text: 'text-green-800',
          icon: <CheckCircleIcon className="h-5 w-5 text-green-500" />
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: <XCircleIcon className="h-5 w-5 text-red-500" />
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          icon: <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          icon: <InformationCircleIcon className="h-5 w-5 text-blue-500" />
        };
    }
  };

  const styles = getStyles();

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${styles.bg} ${styles.border} shadow-lg animate-slide-in`}>
      <div className="flex-shrink-0">
        {styles.icon}
      </div>
      <p className={`flex-1 text-sm font-medium ${styles.text}`}>
        {message}
      </p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 ${styles.text} opacity-70 hover:opacity-100 transition-opacity`}
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// Toast Container Component
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;

