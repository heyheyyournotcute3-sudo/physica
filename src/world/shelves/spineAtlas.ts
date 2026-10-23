import * as THREE from 'three';
import { WING_PALETTES } from '@/lib/colour';
import type { BookMeta, WingMeta } from '@/lib/schema';

/**
 * Generates crisp procedural Three.js CanvasTextures for wing portal brass plaques
 * and detailed 3D book covers/spines.
 */
export function createPortalSignTexture(wing: WingMeta): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const palette = WING_PALETTES[wing.id];

  // Brushed dark bronze plaque background
  const grad = ctx.createLinearGradient(0, 0, 512, 128);
  grad.addColorStop(0, '#1c1613');
  grad.addColorStop(0.5, '#2b221c');
  grad.addColorStop(1, '#181310');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 128);

  // Brass double border
  ctx.strokeStyle = palette.accent;
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 496, 112);
  ctx.strokeStyle = 'rgba(217, 175, 98, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(15, 15, 482, 98);

  // Wing Roman numeral & title
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText(`WING ${wing.roman}`, 256, 44);

  ctx.fillStyle = '#f6efe2';
  ctx.font = '600 25px Georgia, serif';
  ctx.fillText(wing.name, 256, 82, 460);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function createBookCoverTexture(book: BookMeta): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 720;
  const ctx = canvas.getContext('2d')!;
  const palette = WING_PALETTES[book.wing];

  ctx.fillStyle = book.cover.colour;
  ctx.fillRect(0, 0, 512, 720);

  // Subtle cloth/leather grain
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  for (let y = 0; y < 720; y += 6) {
    ctx.fillRect(0, y, 512, 2);
  }

  // Gold foil border
  ctx.strokeStyle = '#e0b863';
  ctx.lineWidth = 6;
  ctx.strokeRect(26, 26, 460, 668);
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 440, 648);

  // Wing badge
  ctx.fillStyle = palette.accent;
  ctx.textAlign = 'center';
  ctx.font = '700 20px Inter, sans-serif';
  ctx.fillText(`PHYSICA · ${book.wing.toUpperCase()}`, 256, 92);

  // Wrapped title
  ctx.fillStyle = '#fdf8ed';
  ctx.font = '700 36px Georgia, serif';
  const words = book.title.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > 380 && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  lines.forEach((ln, idx) => {
    ctx.fillText(ln, 256, 190 + idx * 46, 400);
  });

  // Geometric Physics Emblem in center
  const cx = 256;
  const cy = 430;
  ctx.strokeStyle = '#e0b863';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 74, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  for (let i = 0; i <= 100; i++) {
    const t = (i / 100) * Math.PI * 2;
    const r = 52 * Math.cos(3 * t);
    const x = cx + r * Math.cos(t);
    const y = cy + r * Math.sin(t);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Difficulty stars & conventions footer
  ctx.fillStyle = '#e0b863';
  ctx.font = '600 22px Inter, sans-serif';
  ctx.fillText(
    `${'★'.repeat(book.difficulty)}${'☆'.repeat(5 - book.difficulty)}  ·  ${
      book.status === 'published' ? 'FLAGSHIP EDITION' : 'COMING SOON'
    }`,
    256,
    610
  );

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
