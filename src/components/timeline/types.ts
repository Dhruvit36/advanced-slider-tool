export interface Layer {
  id: string;
  type: string;
  content: string;
  animation: {
    entrance: string;
    delay: number;
    duration: number;
  };
}

export interface Slide {
  id: string;
  duration: number;
  layers: Layer[];
}
