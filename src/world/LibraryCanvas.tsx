import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ALL_BOOKS, BOOKS_BY_ID, BOOKS_BY_WING, WINGS } from '@/content';
import { WING_PALETTES } from '@/lib/colour';
import type { WingId } from '@/lib/schema';
import { usePhysicaStore } from '@/state/store';
import { LandmarksManager } from './landmarks/LandmarksManager';
import {
  computeBookPlacement,
  EYE_HEIGHT,
  MEZZANINE_Y,
  R_ROTUNDA,
  resolveLibraryCollision,
  WING_BASES,
  WING_END_U,
  WING_HALF_W,
  WING_START_U,
  type BookPlacement,
} from './player/collision';
import { createBookCoverTexture, createPortalSignTexture } from './shelves/spineAtlas';

const STAR_DOME_VERT = /* glsl */ `
  varying vec3 vPos;
  void main() {
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const STAR_DOME_FRAG = /* glsl */ `
  uniform float uTime;
  uniform float uDayFactor;
  varying vec3 vPos;

  float hash31(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  void main() {
    vec3 d = normalize(vPos);
    float c = cos(uTime * 0.015);
    float s = sin(uTime * 0.015);
    vec3 rd = vec3(d.x * c - d.z * s, d.y, d.x * s + d.z * c);

    vec3 cell = floor(rd * 135.0);
    float h = hash31(cell);
    float star = step(0.986, h) * pow(fract(h * 91.7), 2.0);

    // Subtle Milky Way / Ecliptic band
    float band = exp(-14.0 * pow(rd.y - 0.55 - 0.18 * rd.x, 2.0));
    float graticule = smoothstep(0.012, 0.0, abs(fract(atan(rd.z, rd.x) * 3.8197) - 0.5) - 0.492);

    vec3 nightSky = vec3(0.02, 0.03, 0.075) + vec3(0.10, 0.14, 0.25) * band + vec3(1.0, 0.96, 0.88) * star * 1.6;
    nightSky += vec3(0.28, 0.22, 0.10) * graticule * 0.35;

    vec3 daySky = vec3(0.32, 0.50, 0.74) + vec3(0.25, 0.25, 0.22) * band;
    vec3 col = mix(nightSky, daySky, uDayFactor);
    gl_FragColor = vec4(col, 1.0);
  }
`;

interface InteractiveBookRecord {
  bookId: string;
  placement: BookPlacement;
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  hoverProgress: number;
}

export const LibraryCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [landmarkTooltip, setLandmarkTooltip] = useState<{
    title: string;
    subtitle: string;
    x: number;
    y: number;
  } | null>(null);
  const [pointerLocked, setPointerLocked] = useState(false);

  // Touch joystick state ref
  const joyVecRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [joyUi, setJoyUi] = useState<{ active: boolean; dx: number; dy: number }>({
    active: false,
    dx: 0,
    dy: 0,
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Single WebGLRenderer & Scene Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b0b10);
    scene.fog = new THREE.FogExp2(0x0e0d14, 0.0135);

    const camera = new THREE.PerspectiveCamera(
      usePhysicaStore.getState().settings.fov,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.08,
      140
    );

    // Player kinematic state: start inside Rotunda facing Wing I (Mechanics) & Foucault pendulum!
    const playerPos = new THREE.Vector3(0, EYE_HEIGHT, 9.2);
    let floorY = 0;
    let yaw = 0; // 0 looks along -Z (toward Foucault pendulum & Wing I!)
    let pitch = 0.04;
    let walkTarget: THREE.Vector3 | null = null;
    let isCameraFlying = false;

    // Lighting
    const hemiLight = new THREE.HemisphereLight(0xffe9c8, 0x1e1b28, 0.92);
    scene.add(hemiLight);

    const oculusLight = new THREE.PointLight(0xffdca8, 2.4, 48, 1.4);
    oculusLight.position.set(0, 17.2, 0);
    scene.add(oculusLight);

    const playerLamp = new THREE.PointLight(0xffd296, 1.15, 11, 1.8);
    scene.add(playerLamp);

    // 2. Rotunda Architecture (20 m radius, 18 m dome + rotating astronomical oculus)
    const rotundaGroup = new THREE.Group();
    scene.add(rotundaGroup);

    const floorMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(R_ROTUNDA + 0.5, R_ROTUNDA + 0.5, 0.2, 64),
      new THREE.MeshStandardMaterial({ color: 0x241f1c, roughness: 0.42, metalness: 0.12 })
    );
    floorMesh.position.y = -0.1;
    rotundaGroup.add(floorMesh);

    // Brass radial inlay rings in Rotunda floor
    for (const rad of [4.8, 11.5, 18.4]) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(rad - 0.06, rad + 0.06, 64),
        new THREE.MeshBasicMaterial({ color: 0xb88b3a, side: THREE.DoubleSide })
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.008;
      rotundaGroup.add(ring);
    }

    // Dome shell & Star Oculus
    const domeMesh = new THREE.Mesh(
      new THREE.SphereGeometry(
        R_ROTUNDA + 0.4,
        48,
        24,
        0,
        Math.PI * 2,
        0.34,
        Math.PI * 0.36
      ),
      new THREE.MeshStandardMaterial({
        color: 0x262129,
        roughness: 0.72,
        metalness: 0.15,
        side: THREE.BackSide,
      })
    );
    domeMesh.position.y = 9.2;
    rotundaGroup.add(domeMesh);

    const starUniforms = {
      uTime: { value: 0 },
      uDayFactor: { value: usePhysicaStore.getState().settings.dayNight === 'day' ? 1 : 0 },
    };
    const oculusDome = new THREE.Mesh(
      new THREE.SphereGeometry(R_ROTUNDA + 0.2, 40, 20, 0, Math.PI * 2, 0, 0.42),
      new THREE.ShaderMaterial({
        vertexShader: STAR_DOME_VERT,
        fragmentShader: STAR_DOME_FRAG,
        uniforms: starUniforms,
        side: THREE.BackSide,
      })
    );
    oculusDome.position.y = 9.2;
    rotundaGroup.add(oculusDome);

    // Soft additive God-ray cone beneath the oculus
    const godRayCone = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 9.5, 18.2, 32, 1, true),
      new THREE.MeshBasicMaterial({
        color: 0xffe4b5,
        transparent: true,
        opacity: 0.042,
        side: THREE.DoubleSide,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );
    godRayCone.position.y = 9.1;
    rotundaGroup.add(godRayCone);

    // Rotunda perimeter wall segments between the 6 portals + classical columns
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x2a2320, roughness: 0.68 });
    const colGeo = new THREE.CylinderGeometry(0.42, 0.48, 9.2, 20);
    const colMat = new THREE.MeshStandardMaterial({ color: 0x3b332e, roughness: 0.48, metalness: 0.1 });

    for (let i = 0; i < 6; i++) {
      const aCenter = ((i * 60 + 30) * Math.PI) / 180;
      // Curved wall arc spanning 38 deg between portals
      const arcWall = new THREE.Mesh(
        new THREE.CylinderGeometry(
          R_ROTUNDA,
          R_ROTUNDA,
          9.4,
          16,
          1,
          true,
          aCenter - 0.34,
          0.68
        ),
        wallMat
      );
      arcWall.material.side = THREE.DoubleSide;
      arcWall.position.y = 4.7;
      rotundaGroup.add(arcWall);

      for (const offset of [-0.34, 0.34]) {
        const ang = aCenter + offset;
        const col = new THREE.Mesh(colGeo, colMat);
        col.position.set(Math.sin(ang) * (R_ROTUNDA - 0.35), 4.6, -Math.cos(ang) * (R_ROTUNDA - 0.35));
        rotundaGroup.add(col);
      }
    }

    // 3. Six Radiating Two-Storey Wings + Instanced Decorative Books + Interactive Catalog Books
    const walkableFloors: THREE.Object3D[] = [floorMesh];
    const decorativeTransforms: Array<{ mat: THREE.Matrix4; color: THREE.Color }> = [];
    const interactiveBooks: InteractiveBookRecord[] = [];
    const placementsByBookId: Record<string, BookPlacement> = {};
    const tableBookMeshes: Array<{ mesh: THREE.Object3D; wing: WingId }> = [];

    for (const wing of WINGS) {
      const basis = WING_BASES[wing.id];
      const palette = WING_PALETTES[wing.id];
      const wingGroup = new THREE.Group();
      // Align wingGroup local -Z with basis.forward? Even cleaner: makeBasis(right, up, forward) so local +Z is outward along wing!
      const up = new THREE.Vector3(0, 1, 0);
      wingGroup.quaternion.setFromRotationMatrix(
        new THREE.Matrix4().makeBasis(basis.right, up, basis.forward)
      );
      scene.add(wingGroup);

      const wingLen = WING_END_U - WING_START_U; // 32 m
      const midZ = (WING_START_U + WING_END_U) * 0.5;

      // Wing floor
      const wFloor = new THREE.Mesh(
        new THREE.BoxGeometry(WING_HALF_W * 2, 0.2, wingLen + 1.5),
        new THREE.MeshStandardMaterial({
          color: palette.woodOrStone,
          roughness: 0.45,
          metalness: 0.14,
        })
      );
      wFloor.position.set(0, -0.1, midZ);
      wingGroup.add(wFloor);
      walkableFloors.push(wFloor);

      // Center floor inlay runner
      const runner = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, wingLen - 2),
        new THREE.MeshBasicMaterial({ color: palette.accent, transparent: true, opacity: 0.28 })
      );
      runner.rotation.x = -Math.PI / 2;
      runner.position.set(0, 0.012, midZ);
      wingGroup.add(runner);

      // Wing side walls, ceiling & end observatory window
      const sideMat = new THREE.MeshStandardMaterial({
        color: palette.woodOrStone,
        roughness: 0.7,
      });
      for (const sx of [-WING_HALF_W, WING_HALF_W]) {
        const wall = new THREE.Mesh(new THREE.BoxGeometry(0.35, 9.2, wingLen), sideMat);
        wall.position.set(sx, 4.6, midZ);
        wingGroup.add(wall);
      }
      const ceiling = new THREE.Mesh(
        new THREE.BoxGeometry(WING_HALF_W * 2 + 0.4, 0.35, wingLen),
        sideMat
      );
      ceiling.position.set(0, 9.2, midZ);
      wingGroup.add(ceiling);

      const endWindow = new THREE.Mesh(
        new THREE.PlaneGeometry(7.2, 6.8),
        new THREE.MeshBasicMaterial({
          color: palette.lightHex,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
        })
      );
      endWindow.position.set(0, 4.6, WING_END_U - 0.15);
      wingGroup.add(endWindow);

      // Wing ambient point light
      const wLight = new THREE.PointLight(palette.lightHex, 1.55, 28, 1.4);
      wLight.position.set(0, 6.8, 34);
      wingGroup.add(wLight);

      // Brass Portal Plaque facing inward toward Rotunda!
      const signTex = createPortalSignTexture(wing);
      const signMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(4.4, 1.1),
        new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide })
      );
      signMesh.position.set(0, 4.35, WING_START_U + 0.15);
      signMesh.rotation.y = Math.PI;
      wingGroup.add(signMesh);

      // Mezzanine balconies at y = 4.5 m + left access ramp
      const mezzMat = new THREE.MeshStandardMaterial({ color: 0x26201d, roughness: 0.55 });
      for (const sx of [-4.6, 4.6]) {
        const deck = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.22, wingLen - 4), mezzMat);
        deck.position.set(sx, MEZZANINE_Y - 0.11, midZ);
        wingGroup.add(deck);

        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.95, wingLen - 4),
          new THREE.MeshStandardMaterial({ color: palette.metal, metalness: 0.75, roughness: 0.3 })
        );
        rail.position.set(sx > 0 ? 3.35 : -3.35, MEZZANINE_Y + 0.48, midZ);
        wingGroup.add(rail);
      }

      // Smooth architectural ramp on left side (u = 37.5 .. 43.5)
      const ramp = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.16, 7.6), mezzMat);
      ramp.position.set(-4.1, MEZZANINE_Y * 0.5, 40.5);
      ramp.rotation.x = -Math.atan2(MEZZANINE_Y, 6.0);
      wingGroup.add(ramp);

      // Shelving Bays (Ground & Mezzanine) + Decorative Book Matrices
      const shelfWoodMat = new THREE.MeshStandardMaterial({
        color: palette.woodOrStone,
        roughness: 0.52,
        metalness: 0.12,
      });
      const dummy = new THREE.Object3D();

      for (const floorOffset of [0, MEZZANINE_Y]) {
        for (const sideSign of [-1, 1]) {
          for (let bay = 0; bay < 5; bay++) {
            const bz = 23.5 + bay * 4.2;
            const bx = sideSign * 5.58;

            // Backboard + 5 horizontal planks
            const back = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.45, 3.6), shelfWoodMat);
            back.position.set(sideSign * 5.75, floorOffset + 1.22, bz);
            wingGroup.add(back);

            for (let lvl = 0; lvl < 5; lvl++) {
              const ly = floorOffset + 0.24 + lvl * 0.44;
              const plank = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 3.6), shelfWoodMat);
              plank.position.set(bx, ly, bz);
              wingGroup.add(plank);

              // Populate decorative filler spines along plank
              for (let s = -6; s <= 6; s += 2) {
                if (floorOffset === 0 && lvl === 2 && Math.abs(s) <= 2 && bay <= 2) {
                  // Reserve eye-level center slots for interactive catalog volumes
                  continue;
                }
                const worldP = new THREE.Vector3(sideSign * 5.46, ly + 0.13, bz + s * 0.22);
                worldP.applyQuaternion(wingGroup.quaternion);
                dummy.position.copy(worldP);
                dummy.quaternion.copy(wingGroup.quaternion);
                dummy.scale.set(0.21, 0.22 + ((bay + s + 8) % 3) * 0.015, 0.036);
                dummy.updateMatrix();
                decorativeTransforms.push({
                  mat: dummy.matrix.clone(),
                  color: new THREE.Color(
                    palette.spinePalette[Math.abs(bay * 3 + lvl + s) % palette.spinePalette.length]
                  ),
                });
              }
            }
          }
        }
      }

      // Central Wing Reading Table (u = 33.5 m) with reading lamp + open book
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.82, 4.0),
        shelfWoodMat
      );
      table.position.set(0, 0.41, 33.5);
      wingGroup.add(table);

      const openBookOnTable = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.04, 0.32),
        new THREE.MeshStandardMaterial({ color: 0xf6f0e2, roughness: 0.6 })
      );
      openBookOnTable.position.set(0, 0.85, 33.5);
      wingGroup.add(openBookOnTable);
      tableBookMeshes.push({ mesh: openBookOnTable, wing: wing.id });

      // Place this wing's 10 Catalog Books (2 Flagships + 8 Stubs)
      const wingBooks = BOOKS_BY_WING[wing.id];
      wingBooks.forEach((book, idxInWing) => {
        const placement = computeBookPlacement(book, idxInWing);
        placementsByBookId[book.id] = placement;

        const bGroup = new THREE.Group();
        bGroup.position.copy(placement.position);
        bGroup.quaternion.copy(placement.quaternion);
        scene.add(bGroup);

        const isFlagship = book.status === 'published';
        const mat = new THREE.MeshStandardMaterial({
          color: book.cover.colour,
          roughness: book.cover.material === 'leather' ? 0.36 : 0.62,
          metalness: isFlagship ? 0.22 : 0.08,
          emissive: isFlagship ? new THREE.Color(palette.accent).multiplyScalar(0.16) : new THREE.Color(0x000000),
        });

        const bodyMesh = new THREE.Mesh(
          new THREE.BoxGeometry(placement.thickness, placement.height, placement.depth),
          mat
        );
        bGroup.add(bodyMesh);

        // Gold spine band indicator on flagship monographs
        if (isFlagship) {
          const goldBand = new THREE.Mesh(
            new THREE.BoxGeometry(placement.thickness + 0.003, 0.028, 0.01),
            new THREE.MeshStandardMaterial({
              color: 0xf4c96b,
              emissive: 0x6b4c12,
              metalness: 0.9,
              roughness: 0.2,
            })
          );
          goldBand.position.set(0, 0.06, placement.depth * 0.5 + 0.002);
          bGroup.add(goldBand);
        }

        interactiveBooks.push({
          bookId: book.id,
          placement,
          group: bGroup,
          bodyMesh,
          hoverProgress: 0,
        });
      });
    }

    // Single InstancedMesh for all decorative filler books across the 6 wings!
    const decoGeo = new THREE.BoxGeometry(1, 1, 1);
    const decoMat = new THREE.MeshStandardMaterial({ roughness: 0.58, metalness: 0.08 });
    const decoInstanced = new THREE.InstancedMesh(decoGeo, decoMat, decorativeTransforms.length);
    decorativeTransforms.forEach((item, i) => {
      decoInstanced.setMatrixAt(i, item.mat);
      decoInstanced.setColorAt(i, item.color);
    });
    decoInstanced.instanceMatrix.needsUpdate = true;
    if (decoInstanced.instanceColor) decoInstanced.instanceColor.needsUpdate = true;
    scene.add(decoInstanced);

    // 4. Drifting Dust Motes in Light Shafts (1,600 particles)
    const dustCount = 1600;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const r = Math.random() * 44;
      const a = Math.random() * Math.PI * 2;
      dustPositions[i * 3] = Math.cos(a) * r;
      dustPositions[i * 3 + 1] = 0.4 + Math.random() * 12;
      dustPositions[i * 3 + 2] = Math.sin(a) * r;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustPoints = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({
        color: 0xffe8bd,
        size: 0.045,
        transparent: true,
        opacity: 0.48,
        depthWrite: false,
      })
    );
    scene.add(dustPoints);

    // 5. All 7 Physics Landmarks (Foucault + 6 Wings)
    const landmarks = new LandmarksManager(scene);

    // 6. Hero 3D Animated Book (used during `pulling`, `opening`, and `closing` transitions)
    const heroBookGroup = new THREE.Group();
    heroBookGroup.visible = false;
    scene.add(heroBookGroup);

    const heroBackCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.33, 0.012),
      new THREE.MeshStandardMaterial({ color: 0x4a2c22, roughness: 0.4 })
    );
    heroBackCover.position.set(0.12, 0, -0.014);
    heroBookGroup.add(heroBackCover);

    const heroPageBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.228, 0.316, 0.024),
      new THREE.MeshStandardMaterial({ color: 0xf8f3e6, roughness: 0.65 })
    );
    heroPageBlock.position.set(0.118, 0, 0);
    heroBookGroup.add(heroPageBlock);

    const heroCoverHinge = new THREE.Group();
    heroBookGroup.add(heroCoverHinge);
    const heroFrontMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38 });
    const heroFrontCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.33, 0.01),
      heroFrontMat
    );
    heroFrontCover.position.set(0.12, 0, 0.015);
    heroCoverHinge.add(heroFrontCover);

    let activeHeroBookId: string | null = null;
    let heroTween: gsap.core.Timeline | null = null;

    // Subscribe to bookMachine transitions for 3D pull/open/close choreography
    const unsubStore = usePhysicaStore.subscribe((state, prevState) => {
      // Update camera FOV & day/night sky
      if (state.settings.fov !== prevState.settings.fov) {
        camera.fov = state.settings.fov;
        camera.updateProjectionMatrix();
      }
      starUniforms.uDayFactor.value = state.settings.dayNight === 'day' ? 1 : 0;
      scene.background = new THREE.Color(state.settings.dayNight === 'day' ? 0x1e2533 : 0x0b0b10);

      // Fast-Travel Camera Spline
      if (state.fastTravel && state.fastTravel.nonce !== prevState.fastTravel?.nonce) {
        const ft = state.fastTravel;
        walkTarget = null;
        let destPos = new THREE.Vector3(0, EYE_HEIGHT, 9.2);
        let destYaw = 0;

        if (ft.kind === 'wing' && ft.wingId) {
          const basis = WING_BASES[ft.wingId];
          destPos = new THREE.Vector3().addScaledVector(basis.forward, 24.5);
          destPos.y = EYE_HEIGHT;
          destYaw = -basis.angleRad;
        } else if (ft.kind === 'book' && ft.bookId && placementsByBookId[ft.bookId]) {
          const pl = placementsByBookId[ft.bookId];
          destPos = pl.vantagePos.clone();
          floorY = destPos.y - EYE_HEIGHT;
          const dx = pl.position.x - destPos.x;
          const dz = pl.position.z - destPos.z;
          destYaw = Math.atan2(-dx, -dz);
        }

        if (state.settings.reducedMotion) {
          playerPos.copy(destPos);
          yaw = destYaw;
          pitch = 0;
          if (ft.openOnArrival && ft.bookId) {
            state.selectBook(ft.bookId, ft.targetPage ?? 1, true);
          }
        } else {
          isCameraFlying = true;
          const animObj = { x: playerPos.x, y: playerPos.y, z: playerPos.z, yaw, pitch };
          gsap.to(animObj, {
            x: destPos.x,
            y: destPos.y,
            z: destPos.z,
            yaw: destYaw,
            pitch: 0,
            duration: 1.45,
            ease: 'power3.inOut',
            onUpdate: () => {
              playerPos.set(animObj.x, animObj.y, animObj.z);
              yaw = animObj.yaw;
              pitch = animObj.pitch;
            },
            onComplete: () => {
              isCameraFlying = false;
              const col = resolveLibraryCollision(playerPos, destPos.y - EYE_HEIGHT);
              floorY = col.floorY;
              usePhysicaStore.getState().setCurrentLocation(col.location);
              if (ft.openOnArrival && ft.bookId) {
                usePhysicaStore.getState().selectBook(ft.bookId, ft.targetPage ?? 1, false);
              }
            },
          });
        }
      }

      // Book Interaction Choreography
      const bm = state.bookMachine;
      if (bm.phase !== prevState.bookMachine.phase) {
        if (bm.phase === 'pulling') {
          const book = BOOKS_BY_ID[bm.bookId];
          const rec = interactiveBooks.find((r) => r.bookId === bm.bookId);
          if (book && rec) {
            activeHeroBookId = book.id;
            rec.group.visible = false;
            heroTween?.kill();

            if (heroFrontMat.map) heroFrontMat.map.dispose();
            heroFrontMat.map = createBookCoverTexture(book);
            heroFrontMat.needsUpdate = true;
            (heroBackCover.material as THREE.MeshStandardMaterial).color.set(book.cover.colour);

            heroBookGroup.position.copy(rec.placement.position);
            heroBookGroup.quaternion.copy(rec.placement.quaternion);
            heroCoverHinge.rotation.set(0, 0, 0);
            heroBookGroup.visible = true;

            const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            const targetWorldPos = camera.position
              .clone()
              .addScaledVector(camForward, 0.56)
              .add(new THREE.Vector3(-0.11, -0.04, 0));
            const targetQuat = camera.quaternion.clone();

            const slideOutPos = rec.placement.position
              .clone()
              .addScaledVector(rec.placement.pullDirection, 0.28);

            const qStart = heroBookGroup.quaternion.clone();
            const slerpProxy = { t: 0, hinge: 0 };

            heroTween = gsap.timeline();
            heroTween
              .to(heroBookGroup.position, {
                x: slideOutPos.x,
                y: slideOutPos.y,
                z: slideOutPos.z,
                duration: 0.28,
                ease: 'power2.out',
              })
              .to(
                heroBookGroup.position,
                {
                  x: targetWorldPos.x,
                  y: targetWorldPos.y,
                  z: targetWorldPos.z,
                  duration: 0.52,
                  ease: 'power3.inOut',
                },
                '>-0.05'
              )
              .to(
                slerpProxy,
                {
                  t: 1,
                  duration: 0.52,
                  ease: 'power3.inOut',
                  onUpdate: () => {
                    heroBookGroup.quaternion.slerpQuaternions(qStart, targetQuat, slerpProxy.t);
                  },
                  onComplete: () => {
                    usePhysicaStore.getState().advancePullToOpen();
                  },
                },
                '<'
              )
              .to(slerpProxy, {
                hinge: -Math.PI * 0.86,
                duration: 0.42,
                ease: 'power2.inOut',
                onUpdate: () => {
                  heroCoverHinge.rotation.y = slerpProxy.hinge;
                },
                onComplete: () => {
                  heroBookGroup.visible = false;
                  usePhysicaStore.getState().completeOpenHandoff(null);
                },
              });
          } else {
            usePhysicaStore.getState().completeOpenHandoff(null);
          }
        } else if (bm.phase === 'closing') {
          const rec = interactiveBooks.find((r) => r.bookId === bm.bookId);
          if (rec) {
            heroTween?.kill();
            const camForward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
            heroBookGroup.position
              .copy(camera.position)
              .addScaledVector(camForward, 0.56)
              .add(new THREE.Vector3(-0.11, -0.04, 0));
            heroBookGroup.quaternion.copy(camera.quaternion);
            heroCoverHinge.rotation.y = -Math.PI * 0.85;
            heroBookGroup.visible = true;

            const qFrom = heroBookGroup.quaternion.clone();
            const proxy = { t: 0, hinge: -Math.PI * 0.85 };
            heroTween = gsap.timeline();
            heroTween
              .to(proxy, {
                hinge: 0,
                duration: 0.25,
                ease: 'power2.in',
                onUpdate: () => {
                  heroCoverHinge.rotation.y = proxy.hinge;
                },
              })
              .to(heroBookGroup.position, {
                x: rec.placement.position.x,
                y: rec.placement.position.y,
                z: rec.placement.position.z,
                duration: 0.42,
                ease: 'power3.inOut',
              })
              .to(
                proxy,
                {
                  t: 1,
                  duration: 0.42,
                  ease: 'power3.inOut',
                  onUpdate: () => {
                    heroBookGroup.quaternion.slerpQuaternions(
                      qFrom,
                      rec.placement.quaternion,
                      proxy.t
                    );
                  },
                  onComplete: () => {
                    heroBookGroup.visible = false;
                    rec.group.visible = true;
                    activeHeroBookId = null;
                    usePhysicaStore.getState().finishCloseBook();
                  },
                },
                '<'
              );
          } else {
            usePhysicaStore.getState().finishCloseBook();
          }
        } else if (bm.phase === 'idle') {
          if (activeHeroBookId) {
            const rec = interactiveBooks.find((r) => r.bookId === activeHeroBookId);
            if (rec) rec.group.visible = true;
            activeHeroBookId = null;
          }
          heroBookGroup.visible = false;
        }
      }
    });

    // 7. Pointer, Keyboard & Debounced Spatial Raycasting (< 3.5 m, 80 ms debounce)
    const keysDown = new Set<string>();
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(0, 0);
    let lastClientPos = { x: container.clientWidth / 2, y: container.clientHeight / 2 };
    let isDraggingLook = false;
    let dragDistance = 0;
    let prevPointer = { x: 0, y: 0 };
    let debounceTimer: number | null = null;
    let pendingHoverId: string | null = null;
    let tabCycleIndex = 0;

    const performBookAndLandmarkRaycast = (ndcX: number, ndcY: number, screenX: number, screenY: number) => {
      const store = usePhysicaStore.getState();
      if (store.viewMode !== '3d') return { hitBookId: null as string | null, hitLandmarkBookId: null as string | null };
      if (store.bookMachine.phase !== 'idle' && store.bookMachine.phase !== 'hovered') {
        return { hitBookId: null, hitLandmarkBookId: null };
      }

      raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);

      // Spatial pre-filter: ONLY test books within 3.8 m of camera!
      const nearbyMeshes: THREE.Object3D[] = [];
      const meshToBookId = new Map<THREE.Object3D, string>();
      for (const rec of interactiveBooks) {
        if (rec.group.visible && rec.placement.position.distanceToSquared(camera.position) <= 14.5) {
          nearbyMeshes.push(rec.bodyMesh);
          meshToBookId.set(rec.bodyMesh, rec.bookId);
        }
      }

      if (nearbyMeshes.length > 0) {
        const hits = raycaster.intersectObjects(nearbyMeshes, false);
        if (hits.length > 0 && hits[0].distance <= 3.65) {
          const hitId = meshToBookId.get(hits[0].object) ?? null;
          setLandmarkTooltip(null);
          return { hitBookId: hitId, hitLandmarkBookId: null };
        }
      }

      // Check reading-table open books (< 4.5 m)
      for (const tb of tableBookMeshes) {
        const assignedId = store.tableBooks[tb.wing];
        if (!assignedId) continue;
        const hits = raycaster.intersectObject(tb.mesh, false);
        if (hits.length > 0 && hits[0].distance <= 4.5) {
          setLandmarkTooltip(null);
          return { hitBookId: assignedId, hitLandmarkBookId: null };
        }
      }

      // Check 7 Physics Landmarks (< 9 m)
      const lmMeshes = landmarks.hitTargets.map((t) => t.mesh);
      const lmHits = raycaster.intersectObjects(lmMeshes, false);
      if (lmHits.length > 0 && lmHits[0].distance <= 9.5) {
        const target = landmarks.hitTargets.find((t) => t.mesh === lmHits[0].object);
        if (target) {
          setLandmarkTooltip({
            title: target.title,
            subtitle: target.subtitle,
            x: screenX,
            y: screenY,
          });
          return { hitBookId: null, hitLandmarkBookId: target.bookId };
        }
      }

      setLandmarkTooltip(null);
      return { hitBookId: null, hitLandmarkBookId: null };
    };

    const scheduleDebouncedHover = (candId: string | null, sx: number, sy: number) => {
      if (candId === pendingHoverId) return;
      pendingHoverId = candId;
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      debounceTimer = window.setTimeout(() => {
        usePhysicaStore.getState().hoverBook(candId, candId ? { x: sx, y: sy } : null);
      }, candId ? 80 : 35);
    };

    const onPointerDown = (e: PointerEvent) => {
      const store = usePhysicaStore.getState();
      if (store.viewMode !== '3d' || store.bookMachine.phase === 'reading') return;

      if (store.navMode === 'first-person' && document.pointerLockElement !== renderer.domElement) {
        renderer.domElement.requestPointerLock?.();
        return;
      }

      isDraggingLook = true;
      dragDistance = 0;
      prevPointer = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const store = usePhysicaStore.getState();
      if (store.viewMode !== '3d') return;

      if (document.pointerLockElement === renderer.domElement) {
        yaw -= e.movementX * 0.0022;
        pitch = Math.max(-1.15, Math.min(1.15, pitch - e.movementY * 0.0022));
        const res = performBookAndLandmarkRaycast(0, 0, window.innerWidth / 2, window.innerHeight / 2);
        scheduleDebouncedHover(res.hitBookId, window.innerWidth / 2 + 24, window.innerHeight / 2);
        return;
      }

      const rect = renderer.domElement.getBoundingClientRect();
      lastClientPos = { x: e.clientX, y: e.clientY };
      pointerNdc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDraggingLook) {
        const dx = e.clientX - prevPointer.x;
        const dy = e.clientY - prevPointer.y;
        dragDistance += Math.hypot(dx, dy);
        prevPointer = { x: e.clientX, y: e.clientY };
        yaw += dx * 0.0034;
        pitch = Math.max(-1.1, Math.min(1.1, pitch + dy * 0.0028));
      } else {
        const res = performBookAndLandmarkRaycast(pointerNdc.x, pointerNdc.y, e.clientX, e.clientY);
        scheduleDebouncedHover(res.hitBookId, e.clientX, e.clientY);
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      const store = usePhysicaStore.getState();
      isDraggingLook = false;
      if (store.viewMode !== '3d') return;
      if (store.bookMachine.phase !== 'idle' && store.bookMachine.phase !== 'hovered') return;
      if (dragDistance > 6) return;

      const isLocked = document.pointerLockElement === renderer.domElement;
      const ndcX = isLocked ? 0 : pointerNdc.x;
      const ndcY = isLocked ? 0 : pointerNdc.y;
      const res = performBookAndLandmarkRaycast(ndcX, ndcY, e.clientX, e.clientY);

      if (res.hitBookId) {
        walkTarget = null;
        store.selectBook(res.hitBookId, 1, false);
        return;
      }
      if (res.hitLandmarkBookId) {
        walkTarget = null;
        store.selectBook(res.hitLandmarkBookId, 1, false);
        return;
      }

      // Explore mode: click floor to walk smoothly to clicked point!
      if (!isLocked) {
        raycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
        const floorHits = raycaster.intersectObjects(walkableFloors, false);
        if (floorHits.length > 0 && floorHits[0].distance < 26) {
          walkTarget = floorHits[0].point.clone();
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      const store = usePhysicaStore.getState();
      if (store.viewMode !== '3d' || store.bookMachine.phase !== 'idle' && store.bookMachine.phase !== 'hovered') return;
      walkTarget = null;
      const step = -Math.sign(e.deltaY) * 0.85;
      const forwardXZ = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
      const cand = playerPos.clone().addScaledVector(forwardXZ, step);
      const col = resolveLibraryCollision(cand, floorY);
      playerPos.copy(col.position);
      floorY = col.floorY;
      store.setCurrentLocation(col.location);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const store = usePhysicaStore.getState();

      if (e.key === 'm' || e.key === 'M') {
        if (store.bookMachine.phase === 'idle' || store.bookMachine.phase === 'hovered') {
          e.preventDefault();
          store.setMapOpen(!store.isMapOpen);
        }
        return;
      }

      if (e.key === '/' && (store.bookMachine.phase === 'idle' || store.bookMachine.phase === 'hovered')) {
        e.preventDefault();
        store.setSearchOpen(true);
        return;
      }

      // Keyboard-only 3D accessibility: Tab cycles nearest books, Enter/E opens!
      if (
        e.key === 'Tab' &&
        store.viewMode === '3d' &&
        !store.isMapOpen &&
        !store.isSearchOpen &&
        !store.isSettingsOpen &&
        (store.bookMachine.phase === 'idle' || store.bookMachine.phase === 'hovered')
      ) {
        e.preventDefault();
        const sorted = [...interactiveBooks]
          .map((r) => ({ rec: r, dist: r.placement.position.distanceTo(playerPos) }))
          .filter((x) => x.dist < 14)
          .sort((a, b) => a.dist - b.dist);

        if (sorted.length > 0) {
          const chosen = sorted[tabCycleIndex % sorted.length].rec;
          tabCycleIndex++;
          // Smoothly orient view toward selected spine
          const dx = chosen.placement.position.x - playerPos.x;
          const dz = chosen.placement.position.z - playerPos.z;
          yaw = Math.atan2(-dx, -dz);
          store.hoverBook(chosen.bookId, {
            x: window.innerWidth * 0.55,
            y: window.innerHeight * 0.45,
          });
        }
        return;
      }

      if (
        (e.key === 'Enter' || e.key === 'e' || e.key === 'E') &&
        store.viewMode === '3d' &&
        store.bookMachine.phase === 'hovered'
      ) {
        e.preventDefault();
        store.selectBook(store.bookMachine.bookId, 1, false);
        return;
      }

      if (e.key === 'Escape' && store.bookMachine.phase === 'hovered') {
        store.hoverBook(null);
      }

      keysDown.add(e.code);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      keysDown.delete(e.code);
    };

    const onPointerLockChange = () => {
      setPointerLocked(document.pointerLockElement === renderer.domElement);
    };

    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / Math.max(1, container.clientHeight);
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    window.addEventListener('resize', onResize);

    // 8. Main 60fps Render & Simulation Loop + Adaptive Quality Monitor
    let raf = 0;
    let prevNow = performance.now();
    let fpsFrames = 0;
    let fpsAccum = 0;

    const animate = (now: number) => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(0.05, (now - prevNow) / 1000);
      prevNow = now;

      const store = usePhysicaStore.getState();

      // Measure live FPS & adapt pixel ratio if needed
      fpsFrames++;
      fpsAccum += dt;
      if (fpsAccum >= 0.75) {
        const measured = Math.round(fpsFrames / fpsAccum);
        store.setFps(measured);
        const q = store.settings.quality;
        const targetDpr =
          q === 'low' ? 1 : q === 'medium' ? Math.min(1.4, window.devicePixelRatio || 1) : Math.min(2, window.devicePixelRatio || 1);
        if (measured < 38 && renderer.getPixelRatio() > 1) {
          renderer.setPixelRatio(1);
        } else if (renderer.getPixelRatio() !== targetDpr && measured >= 50) {
          renderer.setPixelRatio(targetDpr);
        }
        fpsFrames = 0;
        fpsAccum = 0;
      }

      if (store.viewMode === 'catalog') {
        return; // Zero GPU work while browsing 2D catalog!
      }

      const controlsLocked =
        store.bookMachine.phase === 'pulling' ||
        store.bookMachine.phase === 'opening' ||
        store.bookMachine.phase === 'reading' ||
        store.bookMachine.phase === 'closing' ||
        isCameraFlying;

      // Player WASD / Arrow / Touch Joystick / Click-to-Walk movement
      if (!controlsLocked) {
        let moveForward = 0;
        let moveRight = 0;
        if (keysDown.has('KeyW') || keysDown.has('ArrowUp')) moveForward += 1;
        if (keysDown.has('KeyS') || keysDown.has('ArrowDown')) moveForward -= 1;
        if (keysDown.has('KeyD')) moveRight += 1;
        if (keysDown.has('KeyA')) moveRight -= 1;
        if (keysDown.has('ArrowLeft')) yaw += 1.45 * dt;
        if (keysDown.has('ArrowRight')) yaw -= 1.45 * dt;

        if (Math.abs(joyVecRef.current.x) > 0.05 || Math.abs(joyVecRef.current.y) > 0.05) {
          moveRight += joyVecRef.current.x;
          moveForward -= joyVecRef.current.y;
        }

        const fast = keysDown.has('ShiftLeft') || keysDown.has('ShiftRight');
        const speed = fast ? 3.5 : 1.85; // 1.85 m/s walk, 3.5 m/s sprint

        if (Math.abs(moveForward) > 0.01 || Math.abs(moveRight) > 0.01) {
          walkTarget = null;
          const fwd = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
          const rgt = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
          const dir = new THREE.Vector3()
            .addScaledVector(fwd, moveForward)
            .addScaledVector(rgt, moveRight);
          if (dir.lengthSq() > 1) dir.normalize();
          const cand = playerPos.clone().addScaledVector(dir, speed * dt);
          const col = resolveLibraryCollision(cand, floorY);
          playerPos.copy(col.position);
          floorY = col.floorY;
          if (col.location !== store.currentLocation) {
            store.setCurrentLocation(col.location);
          }
        } else if (walkTarget) {
          const toTarget = new THREE.Vector3(
            walkTarget.x - playerPos.x,
            0,
            walkTarget.z - playerPos.z
          );
          const dist = toTarget.length();
          if (dist < 0.25) {
            walkTarget = null;
          } else {
            toTarget.normalize();
            const cand = playerPos.clone().addScaledVector(toTarget, Math.min(dist, 2.35 * dt));
            const col = resolveLibraryCollision(cand, floorY);
            playerPos.copy(col.position);
            floorY = col.floorY;
            if (col.location !== store.currentLocation) {
              store.setCurrentLocation(col.location);
            }
          }
        }
      }

      // Apply camera pose
      camera.position.copy(playerPos);
      const euler = new THREE.Euler(pitch, yaw, 0, 'YXZ');
      camera.quaternion.setFromEuler(euler);
      playerLamp.position.copy(playerPos).add(new THREE.Vector3(0, 0.35, 0));

      // Animate hovered book 1.5 cm slide-out & 3 deg tilt (neighbouring books stay still!)
      const hoveredId = store.bookMachine.phase === 'hovered' ? store.bookMachine.bookId : null;
      for (const rec of interactiveBooks) {
        const targetH = rec.bookId === hoveredId ? 1 : 0;
        if (Math.abs(rec.hoverProgress - targetH) > 0.002) {
          rec.hoverProgress += (targetH - rec.hoverProgress) * Math.min(1, dt * 14);
          // 1.5 cm = 0.015 m pull out + 3 degrees = 0.05236 rad tilt
          rec.group.position
            .copy(rec.placement.position)
            .addScaledVector(rec.placement.pullDirection, 0.018 * rec.hoverProgress);
          const tiltQuat = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(1, 0, 0),
            0.055 * rec.hoverProgress
          );
          rec.group.quaternion.copy(rec.placement.quaternion).multiply(tiltQuat);
          const mat = rec.bodyMesh.material as THREE.MeshStandardMaterial;
          mat.emissiveIntensity = 1 + rec.hoverProgress * 1.8;
        }
      }

      // Show/hide open table books based on store.tableBooks
      for (const tb of tableBookMeshes) {
        tb.mesh.visible = Boolean(store.tableBooks[tb.wing]);
      }

      // Drift dust motes gently
      dustPoints.rotation.y += dt * 0.012;
      starUniforms.uTime.value += dt;

      // Step all 7 physics landmarks when not obscured by full-screen reader
      if (store.bookMachine.phase !== 'reading') {
        landmarks.update(dt, camera.position);
      }

      renderer.render(scene, camera);

      // Update tooltip screen position if hovered book moved in screen space
      if (hoveredId && !pointerLocked) {
        void lastClientPos;
      }
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      unsubStore();
      heroTween?.kill();
      if (debounceTimer !== null) window.clearTimeout(debounceTimer);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (dom.parentElement === container) {
        container.removeChild(dom);
      }
    };
  }, [pointerLocked]);

  // Unused import guard for ALL_BOOKS schema check
  void ALL_BOOKS;

  const { navMode, bookMachine, settings } = usePhysicaStore();
  const isReading = bookMachine.phase === 'reading';

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div ref={mountRef} className="h-full w-full" />

      {/* Comfort vignette & subtle darkening during reading */}
      {settings.comfortVignette && !isReading && (
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_52%,rgba(0,0,0,0.68)_100%)]" />
      )}

      {/* First-person crosshair */}
      {navMode === 'first-person' && !isReading && (
        <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
          <div className="h-2.5 w-2.5 rounded-full border border-amber-300/90 bg-amber-400/35 shadow" />
          {!pointerLocked && (
            <div className="mt-14 rounded-full bg-stone-900/85 px-3 py-1 text-[11px] text-amber-200">
              Click scene to lock pointer · Esc to release
            </div>
          )}
        </div>
      )}

      {/* Landmark hover tooltip */}
      {landmarkTooltip && !isReading && (
        <div
          style={{
            left: Math.min(window.innerWidth - 290, landmarkTooltip.x + 16),
            top: Math.max(16, landmarkTooltip.y - 28),
          }}
          className="pointer-events-none fixed z-20 w-72 rounded-xl border border-amber-400/40 bg-stone-950/92 p-3 text-xs text-stone-100 shadow-2xl backdrop-blur"
        >
          <div className="font-bold text-amber-400">{landmarkTooltip.title}</div>
          <p className="mt-1 leading-snug text-stone-300">{landmarkTooltip.subtitle}</p>
        </div>
      )}

      {/* Mobile / Touch Virtual Left-Thumb Joystick */}
      {!isReading && (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            setJoyUi({ active: true, dx: 0, dy: 0 });
          }}
          onPointerMove={(e) => {
            if (!joyUi.active) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const maxR = 32;
            let dx = e.clientX - cx;
            let dy = e.clientY - cy;
            const d = Math.hypot(dx, dy);
            if (d > maxR) {
              dx = (dx / d) * maxR;
              dy = (dy / d) * maxR;
            }
            joyVecRef.current = { x: dx / maxR, y: dy / maxR };
            setJoyUi({ active: true, dx, dy });
          }}
          onPointerUp={() => {
            joyVecRef.current = { x: 0, y: 0 };
            setJoyUi({ active: false, dx: 0, dy: 0 });
          }}
          aria-label="Virtual movement thumbstick"
          className="fixed bottom-5 left-5 z-20 flex h-20 w-20 touch-none items-center justify-center rounded-full border border-stone-600/60 bg-stone-900/55 backdrop-blur md:hidden"
        >
          <div
            style={{ transform: `translate(${joyUi.dx}px, ${joyUi.dy}px)` }}
            className="h-8 w-8 rounded-full bg-amber-500/80 shadow"
          />
        </div>
      )}
    </div>
  );
};
