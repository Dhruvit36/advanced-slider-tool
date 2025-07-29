import React, { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface CustomDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
}

export function CustomDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select an option...',
  className = '',
  disabled = false,
  size = 'md',
  variant = 'default'
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(option => option.value === value);
  
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: {
      border: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
      bg: 'bg-white hover:bg-gray-50'
    },
    success: {
      border: 'border-green-300 focus:border-green-500 focus:ring-green-500',
      bg: 'bg-green-50 hover:bg-green-100'
    },
    warning: {
      border: 'border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500',
      bg: 'bg-yellow-50 hover:bg-yellow-100'
    },
    error: {
      border: 'border-red-300 focus:border-red-500 focus:ring-red-500',
      bg: 'bg-red-50 hover:bg-red-100'
    },
    info: {
      border: 'border-blue-300 focus:border-blue-500 focus:ring-blue-500',
      bg: 'bg-blue-50 hover:bg-blue-100'
    }
  };

  const handleSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full ${sizeClasses[size]} ${variantClasses[variant].border} ${variantClasses[variant].bg}
          border rounded-lg shadow-sm transition-all duration-200 
          flex items-center justify-between
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
          ${isOpen ? 'ring-2 ring-opacity-20' : ''}
          focus:outline-none focus:ring-2 focus:ring-opacity-20
        `}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <i className={`${selectedOption.icon} flex-shrink-0 text-gray-500`}></i>
          )}
          <span className={`truncate ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption?.label || placeholder}
          </span>
        </div>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
          isOpen ? 'transform rotate-180' : ''
        }`}></i>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
          {/* Search Input */}
          {options.length > 5 && (
            <div className="p-2 border-b border-gray-200 bg-gray-50">
              <div className="relative">
                <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs"></i>
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times text-xs"></i>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none
                    transition-colors duration-150 border-b border-gray-100 last:border-b-0
                    ${option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'}
                  `}
                >
                  <div className="flex items-center space-x-2">
                    {option.icon && (
                      <i className={`${option.icon} flex-shrink-0 text-gray-500 ${
                        option.value === value ? 'text-blue-600' : ''
                      }`}></i>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        option.value === value ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </div>
                      {option.description && (
                        <div className="text-xs text-gray-500 truncate">
                          {option.description}
                        </div>
                      )}
                    </div>
                    {option.value === value && (
                      <i className="fas fa-check text-blue-600 text-xs"></i>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                <i className="fas fa-search text-gray-300 text-lg mb-2 block"></i>
                No options found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
