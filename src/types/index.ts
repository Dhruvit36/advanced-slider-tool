export interface Layer {
  id: string;
  type: 'text' | 'image' | 'button' | 'shape';
  content: string;
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'star';
  style: {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    borderRadius?: number;
    opacity: number;
    rotation: number;
    zIndex: number;
  };
  animation: {
    entrance: string;
    exit: string;
    duration: number;
    delay: number;
    easing: string;
  };
}

export interface Slide {
  id: string;
  name: string;
  background: {
    type: 'color' | 'image' | 'gradient';
    value: string;
  };
  layers: Layer[];
  duration: number;
}

export interface SliderProject {
  id: string;
  name: string;
  slides: Slide[];
  settings: {
    autoplay: boolean;
    loop: boolean;
    navigation: boolean;
    pagination: boolean;
    transitionType: string;
    transitionDuration: number;
  };
}

export interface AnimationPreset {
  name: string;
  type: 'entrance' | 'exit';
  keyframes: string;
  duration: number;
  easing: string;
}
