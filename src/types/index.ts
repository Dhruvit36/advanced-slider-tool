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
    // Enhanced Typography Properties
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: string | number;
    fontStyle?: 'normal' | 'italic' | 'oblique';
    textDecoration?: 'none' | 'underline' | 'line-through' | 'overline';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    lineHeight?: number;
    letterSpacing?: number;
    wordSpacing?: number;
    // Character Panel Features (Photoshop-style)
    verticalScale?: number; // Vertical scaling percentage
    horizontalScale?: number; // Horizontal scaling percentage
    baseline?: number; // Baseline shift
    characterRotation?: number; // Individual character rotation
    characterSpacing?: number; // Tracking (overall character spacing)
    kerning?: 'auto' | 'optical' | 'metrics' | number; // Kerning control
    leadingType?: 'auto' | 'custom'; // Leading type
    hyphenation?: boolean; // Hyphenation on/off
    ligatures?: boolean; // OpenType ligatures
    alternates?: boolean; // Stylistic alternates
    caps?: 'none' | 'small-caps' | 'all-small-caps' | 'caps' | 'unicase'; // Capitalization styles
    position?: 'normal' | 'superscript' | 'subscript'; // Character position
    underlineOptions?: {
      style: 'none' | 'single' | 'double' | 'dotted' | 'dashed' | 'wavy';
      color: string;
      offset: number;
      thickness: number;
    };
    strikethroughOptions?: {
      style: 'none' | 'single' | 'double' | 'dotted' | 'dashed';
      color: string;
      offset: number;
      thickness: number;
    };
    textShadow?: {
      offsetX: number;
      offsetY: number;
      blurRadius: number;
      color: string;
    };
    // Colors and appearance
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
