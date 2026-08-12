export type Builder = {
  name: string;
  role: string;
  stack: string;
  vibe: string;
};

export type CropState = {
  zoom: number;
  x: number;
  y: number;
};

export type Step =
  | 'intro'
  | 'upload'
  | 'edit'
  | 'details'
  | 'generating'
  | 'result';

export type LoadedPhoto = {
  url: string;
  width: number;
  height: number;
  fileName: string;
};

export const emptyBuilder: Builder = {
  name: '',
  role: '',
  stack: '',
  vibe: '',
};

export const sampleBuilder: Builder = {
  name: 'Prasanna Mate',
  role: 'Full Stack Developer',
  stack: 'React • Node • AI',
  vibe: 'Ship it',
};

export const vibeOptions = [
  'AI',
  'Frontend',
  'Backend',
  'Product',
  'Design',
  'Open Source',
] as const;
