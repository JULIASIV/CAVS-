import React from 'react';

const Logo = ({ className = "h-10 w-10", textClassName = "" }) => {
  return (
    <div className="flex items-center gap-3">
      {/* ASTU Real Logo */}
      <div className={`${className} relative rounded-full overflow-hidden bg-white shadow-md`}>
        <img 
          src="/astu.jpg" 
          alt="ASTU Logo" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Text Logo */}
      {textClassName && (
        <div className={textClassName}>
          <h1 className="text-lg font-bold text-white leading-tight">
            ASTU Smart Attendance
          </h1>
          <p className="text-xs text-primary-100 font-medium">
            Adama Science & Technology University
          </p>
        </div>
      )}
    </div>
  );
};

export default Logo;

