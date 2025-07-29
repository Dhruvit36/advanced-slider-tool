import React, { useState, useRef, useEffect } from 'react';

interface CleanDropdownOption {
  value: string;
  label: string;
}

interface CleanDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: CleanDropdownOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  variant?: 'default' | 'compact' | 'elegant';
}

export function CleanDropdown({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  disabled = false,
  variant = 'default'
}: CleanDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownDirection, setDropdownDirection] = useState<'down' | 'up'>('down');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  const selectedOption = options.find(option => option.value === value);

  // Calculate dropdown position
  const calculateDropdownPosition = () => {
    if (!triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownHeight = Math.min(options.length * 44 + 20, 264); // Estimated height
    
    const spaceBelow = viewportHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    
    // Choose direction based on available space
    if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
      setDropdownDirection('down');
    } else {
      setDropdownDirection('up');
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    function handleResize() {
      if (isOpen) {
        calculateDropdownPosition();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOpen]);

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

  const handleSelect = (option: CleanDropdownOption) => {
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
      option: 'px-3 py-2'
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
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (!disabled) {
            calculateDropdownPosition();
            setIsOpen(!isOpen);
          }
        }}
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
        <span className={`truncate font-medium ${selectedOption ? 'text-gray-900' : 'text-gray-500'}`}>
          {selectedOption?.label || placeholder}
        </span>
        <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`}></i>
      </button>

      {/* Clean Enhanced Dropdown Menu */}
      {isOpen && (
        <div className={`
          absolute z-50 w-full
          ${dropdownDirection === 'down' 
            ? `${styles.dropdown}` 
            : 'bottom-full mb-1 shadow-xl border-gray-200'
          }
          bg-white border rounded-xl overflow-hidden
          backdrop-blur-sm bg-gradient-to-b from-white to-gray-50
          animate-in fade-in-0 zoom-in-95 duration-200
        `}>
          {/* Simple Options List */}
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
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    option.value === value ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {option.label}
                  </span>
                  
                  {/* Simple selection indicator */}
                  {option.value === value && (
                    <div className="flex-shrink-0">
                      <i className="fas fa-check text-blue-600 text-sm"></i>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
