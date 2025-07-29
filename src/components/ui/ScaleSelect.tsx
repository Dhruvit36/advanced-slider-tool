import React from 'react';

interface ScaleSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ScaleSelect({ value, onChange, className = '' }: ScaleSelectProps) {
  const scales = [
    { value: '50%', label: '50%' },
    { value: '75%', label: '75%' },
    { value: '100%', label: '100%' },
    { value: '150%', label: '150%' },
    { value: '200%', label: '200%' }
  ];

  return (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none bg-white border border-gray-300 rounded-md
          px-3 py-1.5 pr-8 text-xs font-medium text-gray-700
          hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
          transition-colors duration-200 cursor-pointer
          bg-gradient-to-r from-white to-gray-50 shadow-sm
          min-w-[70px] focus:outline-none
        "
      >
        {scales.map((scale) => (
          <option key={scale.value} value={scale.value}>
            {scale.label}
          </option>
        ))}
      </select>
      
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none">
        <i className="fas fa-chevron-down text-gray-400 text-xs"></i>
      </div>
    </div>
  );
}
