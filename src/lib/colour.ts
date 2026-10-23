import type { WingId } from './schema';

export interface WingPalette {
  id: WingId;
  accent: string;
  accentSoft: string;
  spinePalette: string[];
  woodOrStone: string;
  metal: string;
  ambientHex: number;
  lightHex: number;
}

/**
 * Colour-blind-safe semantic & wing palettes (Okabe-Ito inspired).
 */
export const SEMANTIC_COLOURS = {
  positive: '#009E73', // Bluish green
  negative: '#D55E00', // Vermilion
  neutral: '#8A8478',
  highlight: '#E69F00',
  secondary: '#56B4E9',
} as const;

export const WING_PALETTES: Record<WingId, WingPalette> = {
  mechanics: {
    id: 'mechanics',
    accent: '#D98A2B',
    accentSoft: 'rgba(217, 138, 43, 0.16)',
    spinePalette: ['#6E3B23', '#8B4A2B', '#513426', '#7A542E', '#4A2C22'],
    woodOrStone: '#3D261A',
    metal: '#C59B48',
    ambientHex: 0x3b2a1e,
    lightHex: 0xffc987,
  },
  electromagnetism: {
    id: 'electromagnetism',
    accent: '#3898EC',
    accentSoft: 'rgba(56, 152, 236, 0.16)',
    spinePalette: ['#1D3557', '#264653', '#1B263B', '#2C4A6E', '#1F3A52'],
    woodOrStone: '#1F242D',
    metal: '#9EB3C2',
    ambientHex: 0x1a2436,
    lightHex: 0x8cc8ff,
  },
  thermal: {
    id: 'thermal',
    accent: '#E0643A',
    accentSoft: 'rgba(224, 100, 58, 0.16)',
    spinePalette: ['#7C2D12', '#9A3412', '#5C2418', '#854D27', '#682819'],
    woodOrStone: '#331F19',
    metal: '#CD7F52',
    ambientHex: 0x382018,
    lightHex: 0xffa673,
  },
  relativity: {
    id: 'relativity',
    accent: '#9A8CFF',
    accentSoft: 'rgba(154, 140, 255, 0.16)',
    spinePalette: ['#2B2D42', '#312E59', '#232946', '#3D3B68', '#1F2235'],
    woodOrStone: '#1E202B',
    metal: '#C4C9D8',
    ambientHex: 0x1e2036,
    lightHex: 0xc8ceff,
  },
  quantum: {
    id: 'quantum',
    accent: '#2BB8A8',
    accentSoft: 'rgba(43, 184, 168, 0.16)',
    spinePalette: ['#134E4A', '#115E59', '#164E63', '#1E4D5C', '#0F3D3E'],
    woodOrStone: '#1B2D33',
    metal: '#99D5CF',
    ambientHex: 0x183036,
    lightHex: 0xa6f4ec,
  },
  frontiers: {
    id: 'frontiers',
    accent: '#CC66A8',
    accentSoft: 'rgba(204, 102, 168, 0.16)',
    spinePalette: ['#4A1D3F', '#581C4F', '#3B1E47', '#662856', '#331A38'],
    woodOrStone: '#271B2E',
    metal: '#D4A5C9',
    ambientHex: 0x2b1d34,
    lightHex: 0xf0b3e0,
  },
};

/**
 * Maps complex amplitude psi = re + i*im to CSS rgb string:
 * Brightness encodes probability density |psi|^2 (normalized by maxProb),
 * Hue encodes quantum phase arg(psi) in [-pi, pi].
 */
export function complexToCssColor(re: number, im: number, maxProb = 1): string {
  const prob = Math.min(1, (re * re + im * im) / Math.max(1e-12, maxProb));
  const phase = Math.atan2(im, re); // [-pi, pi]
  const hue = (((phase * 180) / Math.PI) + 360) % 360;
  const lightness = Math.min(68, 8 + Math.pow(prob, 0.62) * 58);
  return `hsl(${hue.toFixed(1)}, 86%, ${lightness.toFixed(1)}%)`;
}

export function wavelengthNmToRgb(nm: number): string {
  let r = 0;
  let g = 0;
  let b = 0;
  if (nm >= 380 && nm < 440) {
    r = -(nm - 440) / 60;
    b = 1;
  } else if (nm >= 440 && nm < 490) {
    g = (nm - 440) / 50;
    b = 1;
  } else if (nm >= 490 && nm < 510) {
    g = 1;
    b = -(nm - 510) / 20;
  } else if (nm >= 510 && nm < 580) {
    r = (nm - 510) / 70;
    g = 1;
  } else if (nm >= 580 && nm < 645) {
    r = 1;
    g = -(nm - 645) / 65;
  } else if (nm >= 645 && nm <= 750) {
    r = 1;
  }
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}
