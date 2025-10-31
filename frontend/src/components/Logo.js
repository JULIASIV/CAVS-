import React from 'react';

const Logo = ({ className = "h-10 w-10", textClassName = "" }) => {
  return (
    <div className="flex items-center gap-3">
      {/* ASTU Logo */}
      <div className={`${className} relative`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer Circle - ASTU Blue */}
          <circle cx="50" cy="50" r="48" fill="#007bff" />
          
          {/* Inner Shield Shape */}
          <path
            d="M50 10 L75 25 L75 55 C75 70 50 85 50 85 C50 85 25 70 25 55 L25 25 Z"
            fill="#ffffff"
            opacity="0.95"
          />
          
          {/* Letter 'A' */}
          <path
            d="M40 65 L50 35 L60 65 M43 55 L57 55"
            stroke="#007bff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          
          {/* Small Star Accent */}
          <circle cx="50" cy="30" r="3" fill="#ff9800" />
        </svg>
      </div>
      
      {/* Text Logo */}
      {textClassName && (
        <div className={textClassName}>
          <h1 className="text-lg font-bold text-gray-900 leading-tight">
            ASTU Smart Attendance
          </h1>
          <p className="text-xs text-primary-600 font-medium">
            Adama Science & Technology University
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;

