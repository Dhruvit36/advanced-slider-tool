import React from 'react';
import { Tooltip } from './Tooltip';

interface AnimationButtonOption {
  value: string;
  label: string;
  icon: string;
  description: string;
}

interface AnimationButtonSelectorProps {
  value: string;
  onChange: (value: string) => void;
  options: AnimationButtonOption[];
  variant?: 'success' | 'error' | 'info' | 'default';
  columns?: number;
  compact?: boolean;
}

export function AnimationButtonSelector({ 
  value, 
  onChange, 
  options, 
  variant = 'default',
  columns = 2,
  compact = false
}: AnimationButtonSelectorProps) {
  const getVariantClasses = (isSelected: boolean) => {
    if (compact) {
      const baseClasses = "w-12 h-12 rounded-lg border-2 transition-all duration-200 flex items-center justify-center hover:shadow-md";
      
      if (isSelected) {
        switch (variant) {
          case 'success':
            return `${baseClasses} bg-green-50 border-green-300 text-green-600 shadow-sm`;
          case 'error':
            return `${baseClasses} bg-red-50 border-red-300 text-red-600 shadow-sm`;
          case 'info':
            return `${baseClasses} bg-blue-50 border-blue-300 text-blue-600 shadow-sm`;
          default:
            return `${baseClasses} bg-purple-50 border-purple-300 text-purple-600 shadow-sm`;
        }
      } else {
        return `${baseClasses} bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700`;
      }
    } else {
      const baseClasses = "w-full p-3 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md";
      
      if (isSelected) {
        switch (variant) {
          case 'success':
            return `${baseClasses} bg-green-50 border-green-300 text-green-700 shadow-sm`;
          case 'error':
            return `${baseClasses} bg-red-50 border-red-300 text-red-700 shadow-sm`;
          case 'info':
            return `${baseClasses} bg-blue-50 border-blue-300 text-blue-700 shadow-sm`;
          default:
            return `${baseClasses} bg-purple-50 border-purple-300 text-purple-700 shadow-sm`;
        }
      } else {
        return `${baseClasses} bg-white border-gray-200 text-gray-700 hover:border-gray-300`;
      }
    }
  };

  const getIconColor = (isSelected: boolean) => {
    if (isSelected) {
      switch (variant) {
        case 'success': return 'text-green-600';
        case 'error': return 'text-red-600';
        case 'info': return 'text-blue-600';
        default: return 'text-purple-600';
      }
    }
    return 'text-gray-500';
  };

  return (
    <div className={`grid gap-2 ${compact ? 'grid-cols-6' : columns === 3 ? 'grid-cols-3' : columns === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {options.map((option) => {
        const isSelected = value === option.value;
        const ButtonComponent = (
          <button
            onClick={() => onChange(option.value)}
            className={getVariantClasses(isSelected)}
          >
            {compact ? (
              <div className="relative">
                <i className={`${option.icon} text-lg`}></i>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-current rounded-full opacity-75"></div>
                )}
              </div>
            ) : (
              <div className="flex items-start space-x-3">
                <div className={`flex-shrink-0 mt-0.5 ${getIconColor(isSelected)}`}>
                  <i className={`${option.icon} text-lg`}></i>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {option.label}
                  </div>
                  <div className="text-xs opacity-75 mt-1 truncate">
                    {option.description}
                  </div>
                </div>
                {isSelected && (
                  <div className={`flex-shrink-0 mt-0.5 ${getIconColor(true)}`}>
                    <i className="fas fa-check text-sm"></i>
                  </div>
                )}
              </div>
            )}
          </button>
        );

        return compact ? (
          <div key={option.value}>
            <Tooltip
              content={`${option.label} - ${option.description}`}
            >
              {ButtonComponent}
            </Tooltip>
          </div>
        ) : (
          <div key={option.value}>{ButtonComponent}</div>
        );
      })}
    </div>
  );
}

export default AnimationButtonSelector;
