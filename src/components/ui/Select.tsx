import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  size = 'md'
}: SelectProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`
        ${sizeClasses[size]} ${className}
        w-full border border-gray-300 rounded-lg bg-white text-gray-900
        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        hover:border-gray-400 transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
        appearance-none bg-no-repeat bg-right bg-[length:16px_16px] pr-8
        bg-[url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>')]
      `}
    >
      {placeholder && !value && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
