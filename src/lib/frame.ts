export const FRAME = {
  // palette
  ink: '#111a15',
  inkSoft: '#18241d',
  cream: '#f2ecdf',
  creamDim: 'rgba(242, 236, 223, 0.62)',
  creamFaint: 'rgba(242, 236, 223, 0.18)',
  lime: '#c9f24b',
  coral: '#f25c3a',
  stone: '#7c877f',

  // canvas size
  width: 1080,
  height: 1350,
} as const;

export type FrameLayout = {
  headerBand: number;
  arch: { x: number; y: number; w: number; h: number };
  photoRight: number;
  nameY: number;
  dividerY: number;
  titleY: number;
  metaY: number;
  pillY: number;
  footerLineY: number;
  footerY: number;
  textMaxWidth: number;
};

// Layout expressed in px on the 1080 × 1350 canvas.
export const LAYOUT: FrameLayout = {
  headerBand: 170,
  arch: { x: 280, y: 252, w: 520, h: 548 },
  photoRight: 905,
  nameY: 1000,
  dividerY: 1040,
  titleY: 1104,
  metaY: 1160,
  pillY: 1218,
  footerLineY: 1264,
  footerY: 1308,
  textMaxWidth: 720,
};

export const SAMPLE_TITLE = 'THE PRODUCT BUILDER';
