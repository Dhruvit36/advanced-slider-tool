import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 500,
  disabled = false,
  className = ''
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef<number>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const showTooltip = () => {
    if (disabled || !content) return;
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      // Calculate position after tooltip is visible
      setTimeout(() => {
        calculatePosition();
      }, 0);
    }, delay) as unknown as number;
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const calculatePosition = () => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const rect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip would overflow and adjust position
    switch (position) {
      case 'top':
        if (rect.top - tooltipRect.height < 10) {
          newPosition = 'bottom';
        }
        break;
      case 'bottom':
        if (rect.bottom + tooltipRect.height > viewport.height - 10) {
          newPosition = 'top';
        }
        break;
      case 'left':
        if (rect.left - tooltipRect.width < 10) {
          newPosition = 'right';
        }
        break;
      case 'right':
        if (rect.right + tooltipRect.width > viewport.width - 10) {
          newPosition = 'left';
        }
        break;
    }

    setActualPosition(newPosition);
  };

  const getPositionClasses = () => {
    const baseClasses = 'absolute z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg pointer-events-none whitespace-nowrap';
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
      case 'bottom':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 mt-2`;
      case 'left':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 mr-2`;
      case 'right':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 ml-2`;
      default:
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 mb-2`;
    }
  };

  const getArrowClasses = () => {
    const baseClasses = 'absolute w-0 h-0 border-solid';
    
    switch (actualPosition) {
      case 'top':
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-gray-900 border-l-4 border-l-transparent border-r-4 border-r-transparent`;
      case 'bottom':
        return `${baseClasses} bottom-full left-1/2 transform -translate-x-1/2 border-b-4 border-b-gray-900 border-l-4 border-l-transparent border-r-4 border-r-transparent`;
      case 'left':
        return `${baseClasses} left-full top-1/2 transform -translate-y-1/2 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent`;
      case 'right':
        return `${baseClasses} right-full top-1/2 transform -translate-y-1/2 border-r-4 border-r-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent`;
      default:
        return `${baseClasses} top-full left-1/2 transform -translate-x-1/2 border-t-4 border-t-gray-900 border-l-4 border-l-transparent border-r-4 border-r-transparent`;
    }
  };

  return (
    <div
      ref={triggerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && content && (
        <div
          ref={tooltipRef}
          className={getPositionClasses()}
          role="tooltip"
        >
          {content}
          <div className={getArrowClasses()}></div>
        </div>
      )}
    </div>
  );
}
