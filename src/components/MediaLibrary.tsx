import React, { useRef } from 'react';
import { useSlider } from '../context/SliderContext';
import { Layer } from '../types';

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
}

export function ImageUploader({ onImageSelect }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageSelect(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-purple-500 text-white px-3 py-2 rounded text-sm hover:bg-purple-600 w-full flex items-center justify-center"
      >
        <i className="fas fa-upload mr-2"></i>
        Upload Image
      </button>
    </>
  );
}

export function MediaLibrary() {
  const { state, dispatch } = useSlider();
  const currentSlide = state.project?.slides[state.currentSlideIndex];

  const addImageLayer = (imageUrl: string) => {
    if (!currentSlide) return;
    
    const newLayer: Layer = {
      id: Date.now().toString(),
      type: 'image',
      content: imageUrl,
      style: {
        x: 100,
        y: 100,
        width: 300,
        height: 200,
        opacity: 1,
        rotation: 0,
        zIndex: currentSlide.layers.length + 1
      },
      animation: {
        entrance: 'Fade In',
        exit: 'Fade Out',
        duration: 600,
        delay: 0,
        easing: 'ease-out'
      }
    };
    
    dispatch({
      type: 'ADD_LAYER',
      payload: { slideId: currentSlide.id, layer: newLayer }
    });
  };

  // Stock images for demo purposes
  const stockImages = [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <i className="fas fa-cloud-upload-alt mr-2"></i>
          Upload Image
        </h3>
        <ImageUploader onImageSelect={addImageLayer} />
      </div>
      
      <div>
        <h3 className="text-sm font-semibold mb-2 flex items-center">
          <i className="fas fa-images mr-2"></i>
          Stock Images
        </h3>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
          {stockImages.map((imageUrl, index) => (
            <div
              key={index}
              className="relative cursor-pointer group rounded overflow-hidden"
              onClick={() => addImageLayer(imageUrl)}
            >
              <img
                src={imageUrl}
                alt={`Stock ${index + 1}`}
                className="w-full h-20 object-cover group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <span className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                  <i className="fas fa-plus mr-1"></i>
                  Add Image
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
