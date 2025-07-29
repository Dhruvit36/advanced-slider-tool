import React from 'react';

interface ShapeProps {
  type: 'rectangle' | 'circle' | 'triangle' | 'star';
  width: number;
  height: number;
  backgroundColor: string;
  borderRadius?: number;
}

export function Shape({ type, width, height, backgroundColor, borderRadius = 0 }: ShapeProps) {
  const baseStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor,
    borderRadius: `${borderRadius}px`
  };

  switch (type) {
    case 'rectangle':
      return <div style={baseStyle} />;
      
    case 'circle':
      return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
      
    case 'triangle':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${width / 2}px solid transparent`,
            borderRight: `${width / 2}px solid transparent`,
            borderBottom: `${height}px solid ${backgroundColor}`,
          }}
        />
      );
      
    case 'star':
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 24 24"
          fill={backgroundColor}
          style={{ display: 'block' }}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );
      
    default:
      return <div style={baseStyle} />;
  }
}

export const shapeTypes = [
  { value: 'rectangle', label: 'Rectangle', icon: <i className="fas fa-square"></i> },
  { value: 'circle', label: 'Circle', icon: <i className="fas fa-circle"></i> },
  { value: 'triangle', label: 'Triangle', icon: <i className="fas fa-caret-up"></i> },
  { value: 'star', label: 'Star', icon: <i className="fas fa-star"></i> }
] as const;
