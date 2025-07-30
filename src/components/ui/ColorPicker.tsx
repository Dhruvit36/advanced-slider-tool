import React, { useState, useRef, useEffect } from 'react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

export function ColorPicker({ value, onChange, className = '' }: ColorPickerProps) {
  const [hexInput, setHexInput] = useState(value);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [mode, setMode] = useState<'HEX' | 'RGB' | 'HSV'>('HEX');
  const [isDragging, setIsDragging] = useState(false);
  const [isHueDragging, setIsHueDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hueCanvasRef = useRef<HTMLCanvasElement>(null);

  // Convert hex to HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number) => {
    const hNorm = h / 360;
    const sNorm = s / 100;
    const lNorm = l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (sNorm === 0) {
      r = g = b = lNorm;
    } else {
      const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
      const p = 2 * lNorm - q;
      r = hue2rgb(p, q, hNorm + 1/3);
      g = hue2rgb(p, q, hNorm);
      b = hue2rgb(p, q, hNorm - 1/3);
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  };

  // Quick color palette
  const quickColors = [
    ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
    ['#DDA0DD', '#98D8E8', '#F7DC6F', '#BB8FCE', '#F8C471'],
    ['#85C1E9', '#8E44AD', '#27AE60', '#E91E63', '#FF9800'],
    ['#000000', '#424242', '#9E9E9E', '#BDBDBD', '#FFFFFF']
  ];

  // Draw saturation/lightness canvas
  const drawSaturationCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Create gradient for saturation (left to right) and lightness (top to bottom)
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100;
        const l = 100 - (y / height) * 100;
        const color = hslToHex(hue, s, l);
        
        ctx.fillStyle = color;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  };

  // Draw hue slider
  const drawHueSlider = () => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      const h = (x / width) * 360;
      const color = hslToHex(h, 100, 50);
      
      ctx.fillStyle = color;
      ctx.fillRect(x, 0, 1, height);
    }
  };

  // Handle canvas click for saturation/lightness
  const updateSaturationLightness = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Use CSS dimensions for better accuracy
    const canvasWidth = rect.width;
    const canvasHeight = rect.height;
    
    // Clamp values to canvas bounds
    const clampedX = Math.max(0, Math.min(x, canvasWidth));
    const clampedY = Math.max(0, Math.min(y, canvasHeight));

    const newSaturation = (clampedX / canvasWidth) * 100;
    const newLightness = 100 - (clampedY / canvasHeight) * 100;

    setSaturation(newSaturation);
    setLightness(newLightness);

    const newColor = hslToHex(hue, newSaturation, newLightness);
    onChange(newColor);
    setHexInput(newColor);
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    updateSaturationLightness(e);
  };

  // Handle hue slider interactions
  const updateHue = (e: React.MouseEvent<HTMLCanvasElement | HTMLDivElement> | MouseEvent) => {
    const canvas = hueCanvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Use CSS width instead of canvas width for better accuracy
    const canvasWidth = rect.width;
    const clampedX = Math.max(0, Math.min(x, canvasWidth));

    const newHue = (clampedX / canvasWidth) * 360;
    setHue(newHue);

    const newColor = hslToHex(newHue, saturation, lightness);
    onChange(newColor);
    setHexInput(newColor);
  };

  const handleHueMouseDown = (e: React.MouseEvent<HTMLCanvasElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHueDragging(true);
    updateHue(e);
  };

  // Global mouse move and mouse up handlers for smooth dragging
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        updateSaturationLightness(e);
      }
      if (isHueDragging) {
        updateHue(e);
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setIsHueDragging(false);
    };

    if (isDragging || isHueDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isHueDragging, hue, saturation, lightness]);

  // Update when value changes externally
  useEffect(() => {
    setHexInput(value);
    const hsl = hexToHsl(value);
    setHue(hsl.h);
    setSaturation(hsl.s);
    setLightness(hsl.l);
  }, [value]);

  // Redraw canvases when hue changes
  useEffect(() => {
    drawSaturationCanvas();
  }, [hue]);

  // Initial draw
  useEffect(() => {
    drawSaturationCanvas();
    drawHueSlider();
  }, []);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHex = e.target.value;
    setHexInput(newHex);
    
    if (/^#[0-9A-Fa-f]{6}$/.test(newHex)) {
      onChange(newHex);
    }
  };

  const rgb = hexToRgb(value);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Color Display */}
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div 
          className="w-12 h-12 rounded-lg border-2 border-white shadow-lg"
          style={{ backgroundColor: value }}
        />
        <div className="flex-1">
          <div className="text-xs font-medium text-gray-600 mb-1"># HEX CODE</div>
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            className="w-full px-3 py-2 text-sm font-mono bg-white border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#FFFFFF"
          />
        </div>
      </div>

      {/* Main Color Picker Canvas */}
      <div className="space-y-3">
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={280}
            height={160}
            onMouseDown={handleCanvasMouseDown}
            className={`w-full h-40 rounded-lg border border-gray-300 select-none transition-all duration-75 ${
              isDragging ? 'cursor-grabbing border-blue-400' : 'cursor-crosshair hover:border-gray-400'
            }`}
          />
          {/* Position indicator */}
          <div
            className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${(saturation / 100) * 100}%`,
              top: `${100 - (lightness / 100) * 100}%`
            }}
          >
            <div className="relative">
              {/* Outer ring */}
              <div className={`w-4 h-4 border-2 border-white rounded-full shadow-lg bg-black bg-opacity-20 transition-all duration-75 ${
                isDragging ? 'scale-125' : ''
              }`}></div>
              {/* Inner dot */}
              <div 
                className={`absolute top-1/2 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2 -translate-y-1/2 border border-white shadow-sm transition-all duration-75 ${
                  isDragging ? 'scale-125' : ''
                }`}
                style={{ backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Hue Slider */}
        <div className="relative">
          <div className="text-xs font-medium text-gray-600 mb-2">Hue</div>
          <canvas
            ref={hueCanvasRef}
            width={280}
            height={20}
            onMouseDown={handleHueMouseDown}
            className={`w-full h-5 rounded border border-gray-300 select-none transition-all duration-75 ${
              isHueDragging ? 'cursor-grabbing border-blue-400' : 'cursor-grab hover:border-gray-400'
            }`}
          />
          {/* Hue indicator */}
          <div
            className="absolute transform -translate-x-1/2 cursor-grab"
            style={{
              left: `${(hue / 360) * 100}%`,
              top: '-2px'
            }}
            onMouseDown={handleHueMouseDown}
          >
            <div className="relative">
              {/* Interaction area - larger invisible area for easier grabbing */}
              <div className="absolute -inset-2 cursor-grab"></div>
              
              {/* Main slider handle */}
              <div className={`w-5 h-6 bg-white border-2 rounded-sm shadow-lg flex items-center justify-center transition-all duration-75 cursor-grab ${
                isHueDragging ? 'border-blue-400 scale-110 cursor-grabbing' : 'border-gray-300 hover:border-gray-400 hover:scale-105'
              }`}>
                <div className="w-3 h-4 rounded-sm border border-gray-200 pointer-events-none" style={{ backgroundColor: `hsl(${hue}, 100%, 50%)` }}></div>
              </div>
              
              {/* Arrow pointer */}
              <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent transition-all duration-75 pointer-events-none ${
                isHueDragging ? 'border-t-blue-400' : 'border-t-white'
              } drop-shadow-sm`}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {(['HEX', 'RGB', 'HSV'] as const).map((modeOption) => (
          <button
            key={modeOption}
            onClick={() => setMode(modeOption)}
            className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${
              mode === modeOption
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {modeOption}
          </button>
        ))}
      </div>

      {/* Color Value Input */}
      <div>
        {mode === 'HEX' && (
          <input
            type="text"
            value={hexInput}
            onChange={handleHexChange}
            className="w-full px-3 py-2 text-center font-mono bg-gray-50 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="#FFFFFF"
          />
        )}
        {mode === 'RGB' && (
          <div className="text-center py-2 px-3 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm">
            {rgb.r}, {rgb.g}, {rgb.b}
          </div>
        )}
        {mode === 'HSV' && (
          <div className="text-center py-2 px-3 bg-gray-50 border border-gray-300 rounded-md font-mono text-sm">
            {Math.round(hue)}°, {Math.round(saturation)}%, {Math.round(lightness)}%
          </div>
        )}
      </div>

      {/* Quick Colors */}
      <div>
        <div className="text-xs font-medium text-gray-600 mb-2">Quick Colors</div>
        <div className="space-y-1">
          {quickColors.map((row, rowIndex) => (
            <div key={rowIndex} className="flex space-x-1">
              {row.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onChange(color);
                    setHexInput(color);
                  }}
                  className={`flex-1 h-8 rounded border-2 hover:scale-105 transition-all ${
                    value === color 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}