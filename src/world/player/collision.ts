import * as THREE from 'three';
import { WINGS } from '@/content';
import type { BookMeta, WingId } from '@/lib/schema';

export const R_ROTUNDA = 20.0;
export const WING_START_U = 19.2;
export const WING_END_U = 51.2; // 32 m long wing
export const WING_HALF_W = 6.0; // 12 m wide wing
export const PORTAL_HALF_W = 3.6;
export const EYE_HEIGHT = 1.65;
export const MEZZANINE_Y = 4.5;
export const PLAYER_RADIUS = 0.32;

export interface WingBasis {
  id: WingId;
  angleRad: number;
  forward: THREE.Vector3; // outward along wing (+u)
  right: THREE.Vector3; // perpendicular horizontal (+v)
}

export const WING_BASES: Record<WingId, WingBasis> = Object.fromEntries(
  WINGS.map((w) => {
    const rad = (w.angleDeg * Math.PI) / 180;
    const forward = new THREE.Vector3(Math.sin(rad), 0, -Math.cos(rad));
    const right = new THREE.Vector3(Math.cos(rad), 0, Math.sin(rad));
    return [w.id, { id: w.id, angleRad: rad, forward, right }];
  })
) as Record<WingId, WingBasis>;

export interface BookPlacement {
  bookId: string;
  wing: WingId;
  position: THREE.Vector3;
  quaternion: THREE.Quaternion;
  pullDirection: THREE.Vector3; // unit vector pointing out of shelf into aisle
  thickness: number;
  height: number;
  depth: number;
  vantagePos: THREE.Vector3;
  vantageLookAt: THREE.Vector3;
}

/**
 * Computes exact 3D shelf coordinates (1 unit = 1 m) for all 60 books.
 * Flagship published monographs sit at eye level (levels 2 & 3 -> 1.25 m to 1.68 m) on the ground floor!
 */
export function computeBookPlacement(book: BookMeta, indexInWing: number): BookPlacement {
  const basis = WING_BASES[book.wing];
  const isPublished = book.status === 'published';

  const sideSign = indexInWing % 2 === 0 ? -1 : 1; // -1 = left wall, +1 = right wall
  const bayIdx = isPublished ? (indexInWing === 0 ? 1 : 2) : ((indexInWing % 5) + 1);
  const mezzanine = isPublished ? false : book.shelf.mezzanine && indexInWing >= 6;
  const level = isPublished ? 2 : (indexInWing % 4) + 1; // 0..4 shelf levels
  const slotInBay = isPublished ? 5 : ((indexInWing * 3 + 2) % 9);

  // Bay center along wing radial coordinate u (between 23.5 m and 43.5 m)
  const bayU = 23.5 + (bayIdx - 1) * 4.2 + (slotInBay - 4) * 0.14;
  // Shelf face sits near |v| = 5.42 m inside 6.0 m half-width wall
  const shelfV = sideSign * 5.42;
  const baseFloorY = mezzanine ? MEZZANINE_Y : 0;
  // Five shelf levels: 0.36, 0.80, 1.26, 1.68, 2.10 m
  const levelHeights = [0.38, 0.82, 1.28, 1.68, 2.1];
  const posY = baseFloorY + levelHeights[level];

  const pos = new THREE.Vector3()
    .addScaledVector(basis.forward, bayU)
    .addScaledVector(basis.right, shelfV);
  pos.y = posY;

  // Pull direction points inward toward wing center aisle (-sideSign * right)
  const pullDir = basis.right.clone().multiplyScalar(-sideSign).normalize();

  // Orient book so its local +Z points along pullDir (spine faces aisle!) and local +Y is up
  const up = new THREE.Vector3(0, 1, 0);
  const localX = new THREE.Vector3().crossVectors(up, pullDir).normalize();
  const rotMat = new THREE.Matrix4().makeBasis(localX, up, pullDir);
  const quat = new THREE.Quaternion().setFromRotationMatrix(rotMat);

  const thickness = isPublished ? 0.048 : 0.034 + (indexInWing % 3) * 0.008;
  const height = isPublished ? 0.26 : 0.24;
  const depth = 0.22;

  const vantagePos = pos
    .clone()
    .addScaledVector(pullDir, 1.75);
  vantagePos.y = baseFloorY + EYE_HEIGHT;

  return {
    bookId: book.id,
    wing: book.wing,
    position: pos,
    quaternion: quat,
    pullDirection: pullDir,
    thickness,
    height,
    depth,
    vantagePos,
    vantageLookAt: pos.clone(),
  };
}

/**
 * Analytical capsule-vs-library collision and elevation solver.
 * Returns constrained player foot+eye position and active zone.
 */
export function resolveLibraryCollision(
  candidateXZ: THREE.Vector3,
  currentFloorY: number
): { position: THREE.Vector3; floorY: number; location: WingId | 'rotunda' } {
  let x = candidateXZ.x;
  let z = candidateXZ.z;
  let floorY = currentFloorY;

  // Check if player is inside one of the 6 radial wings
  let matchedWing: WingBasis | null = null;
  let wingU = 0;
  let wingV = 0;

  for (const w of WINGS) {
    const b = WING_BASES[w.id];
    const u = x * b.forward.x + z * b.forward.z;
    const v = x * b.right.x + z * b.right.z;
    if (u >= WING_START_U - 1.2 && Math.abs(v) <= WING_HALF_W + 0.5) {
      if (!matchedWing || Math.abs(v) < Math.abs(wingV)) {
        matchedWing = b;
        wingU = u;
        wingV = v;
      }
    }
  }

  if (matchedWing && wingU >= R_ROTUNDA - 1.4) {
    // Clamp u within wing length (leaving room before back window wall)
    const maxU = WING_END_U - 1.2;
    let clampedU = Math.min(maxU, wingU);

    // Portal throat between rotunda and wing (18.6 <= u <= 20.8): narrower archway unless on ground floor
    const inPortalThroat = clampedU < 21.0;
    const maxAbsV = inPortalThroat
      ? PORTAL_HALF_W - PLAYER_RADIUS
      : floorY > 2.2
        ? WING_HALF_W - 0.55 // Mezzanine gallery walkway
        : 4.88; // Ground floor clear of side bookshelves (shelves occupy |v| > 5.18)

    let clampedV = Math.max(-maxAbsV, Math.min(maxAbsV, wingV));

    // Mezzanine ramp on left side (u between 21.5 and 30.5 when near v < -3.7): smooth ramp option
    // Keep ground floor default stable unless player climbs spiral/side ramp at u in [38, 43], v in [-4.8, -3.5]
    if (clampedU >= 37.5 && clampedU <= 43.5 && clampedV < -3.55) {
      const rampFrac = (clampedU - 37.5) / 6.0;
      floorY = rampFrac * MEZZANINE_Y;
    } else if (floorY > 2.2) {
      // On mezzanine gallery: prevent falling into central atrium void (|v| must stay >= 3.25)
      if (clampedU < 21.2) {
        floorY = 0;
      } else if (Math.abs(clampedV) < 3.25) {
        clampedV = (clampedV >= 0 ? 1 : -1) * 3.25;
      }
    } else {
      floorY = 0;
      // Collide smoothly with central reading table (u in [31.2, 35.8], |v| < 1.05)
      if (clampedU > 31.2 && clampedU < 35.8 && Math.abs(clampedV) < 1.08) {
        clampedV = (clampedV >= 0 ? 1 : -1) * 1.08;
      }
      // Collide smoothly with far alcove landmark plinth (center u = 46.8, v = 0, radius = 1.65)
      const du = clampedU - 46.8;
      const dv = clampedV;
      const distLandmark = Math.hypot(du, dv);
      if (distLandmark < 1.75 && distLandmark > 1e-5) {
        clampedU = 46.8 + (du / distLandmark) * 1.75;
        clampedV = (dv / distLandmark) * 1.75;
      }
    }

    const out = new THREE.Vector3()
      .addScaledVector(matchedWing.forward, clampedU)
      .addScaledVector(matchedWing.right, clampedV);
    out.y = floorY + EYE_HEIGHT;
    return { position: out, floorY, location: matchedWing.id };
  }

  // Inside Rotunda!
  floorY = 0;
  const r = Math.hypot(x, z);

  // Collide with central Foucault pendulum marble plinth (radius 2.45 m)
  if (r < 2.45) {
    if (r < 1e-4) {
      z = 2.45;
    } else {
      x = (x / r) * 2.45;
      z = (z / r) * 2.45;
    }
  } else if (r > R_ROTUNDA - PLAYER_RADIUS) {
    // Allow walking smoothly into a portal if aligned with one of the 6 portals!
    let alignedPortal = false;
    for (const w of WINGS) {
      const b = WING_BASES[w.id];
      const u = x * b.forward.x + z * b.forward.z;
      const v = x * b.right.x + z * b.right.z;
      if (u > 0 && Math.abs(v) < PORTAL_HALF_W - PLAYER_RADIUS) {
        alignedPortal = true;
        break;
      }
    }
    if (!alignedPortal) {
      const maxR = R_ROTUNDA - PLAYER_RADIUS;
      x = (x / r) * maxR;
      z = (z / r) * maxR;
    }
  }

  return {
    position: new THREE.Vector3(x, EYE_HEIGHT, z),
    floorY: 0,
    location: 'rotunda',
  };
}
