import React, { useState, useRef, useEffect } from 'react';

interface EnhancedDropdownOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
  color?: string;
  badge?: string;
}

interface EnhancedDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: EnhancedDropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'elegant';
}

export function EnhancedDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  variant = 'default'
}: EnhancedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev < options.length - 1 ? prev + 1 : 0
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setHighlightedIndex(prev => 
            prev > 0 ? prev - 1 : options.length - 1
          );
          break;
        case 'Enter':
          event.preventDefault();
          if (highlightedIndex >= 0) {
            handleSelect(options[highlightedIndex]);
          }
          break;
        case 'Escape':
          event.preventDefault();
          setIsOpen(false);
          setHighlightedIndex(-1);
          break;
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, highlightedIndex, options]);

  const handleSelect = (option: EnhancedDropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const variantStyles = {
    default: {
      trigger: 'min-w-[120px] px-3 py-2 text-sm',
      dropdown: 'mt-1 shadow-xl border-gray-200',
      option: 'px-3 py-2.5'
    },
    compact: {
      trigger: 'min-w-[80px] px-2.5 py-1.5 text-xs',
      dropdown: 'mt-1 shadow-lg border-gray-300',
      option: 'px-2.5 py-2'
    },
    elegant: {
      trigger: 'min-w-[140px] px-4 py-3 text-sm',
      dropdown: 'mt-2 shadow-2xl border-gray-100',
      option: 'px-4 py-3'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          ${styles.trigger} w-full
          bg-white border border-gray-300 rounded-lg
          flex items-center justify-between
          hover:border-gray-400 hover:shadow-md hover:bg-gradient-to-r hover:from-white hover:to-gray-50
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          transition-all duration-200
          ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'cursor-pointer'}
          ${isOpen ? 'ring-2 ring-blue-500 border-blue-500 shadow-md' : ''}
        `}
      >
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          {selectedOption?.icon && (
            <i className={`${selectedOption.icon} flex-shrink-0 text-gray-500`}></i>
          )}
          <span className={`truncate font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
            {selectedOption?.label || placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}></i>
      </button>

      {/* Enhanced Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 w-full ${styles.dropdown}
          bg-white border rounded-xl overflow-hidden
          backdrop-blur-sm bg-gradient-to-b from-white to-gray-50
          animate-in fade-in-0 zoom-in-95 duration-200
        `}>
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Select Option
            </span>
          </div>

          {/* Options List */}
          <div className="max-h-64 overflow-y-auto">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`
                  ${styles.option} w-full text-left
                  transition-all duration-150 relative
                  ${option.value === value 
                    ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-l-3 border-l-blue-500' 
                    : 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-900'
                  }
                  ${highlightedIndex === index 
                    ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700' 
                    : ''
                  }
                  group border-l-3 border-l-transparent
                `}
              >
                <div className="flex items-center space-x-3">
                  {/* Icon with background */}
                  {option.icon && (
                    <div className={`
                      w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      transition-all duration-200
                      ${option.value === value 
                        ? 'bg-blue-500 text-white shadow-md' 
                        : option.color 
                          ? `${option.color} text-white` 
                          : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
                      }
                    `}>
                      <i className={`${option.icon} text-sm`}></i>
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium truncate ${
                        option.value === value ? 'text-blue-700' : 'text-gray-900'
                      }`}>
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className={`
                          px-2 py-0.5 text-xs font-medium rounded-full
                          ${option.value === value 
                            ? 'bg-blue-200 text-blue-800' 
                            : 'bg-gray-200 text-gray-700'
                          }
                        `}>
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {option.description}
                      </p>
                    )}
                  </div>
                  
                  {/* Selection indicator */}
                  {option.value === value && (
                    <div className="flex-shrink-0">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="px-3 py-2 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {options.length} option{options.length !== 1 ? 's' : ''} available
              </span>
              <span className="text-xs text-gray-400">
                Use ↑↓ keys to navigate
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
