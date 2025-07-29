import React from 'react';

interface CompactSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string; }>;
  icon?: string;
  className?: string;
  disabled?: boolean;
}

export function CompactSelect({ 
  value, 
  onChange, 
  options, 
  icon = 'fas fa-caret-down',
  className = '',
  disabled = false 
}: CompactSelectProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          appearance-none bg-white border border-gray-300 rounded-lg
          px-2.5 py-1.5 pr-7 text-xs font-medium text-gray-800
          hover:border-gray-400 hover:bg-gray-50 hover:shadow-md
          focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none
          transition-all duration-200 cursor-pointer shadow-sm
          min-w-[60px] max-w-[100px]
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
          
          /* Enhanced dropdown styling */
          [&>option]:bg-white [&>option]:text-gray-800 [&>option]:py-2 [&>option]:px-3
          [&>option:hover]:bg-blue-50 [&>option:hover]:text-blue-700
          [&>option:checked]:bg-blue-500 [&>option:checked]:text-white
        `}
        style={{
          backgroundImage: `
            linear-gradient(45deg, transparent 0%, rgba(59, 130, 246, 0.05) 100%),
            url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")
          `,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 6px center, right 8px center',
          backgroundSize: 'auto, 12px 12px'
        }}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
