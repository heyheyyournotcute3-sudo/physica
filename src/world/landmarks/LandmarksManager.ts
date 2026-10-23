import * as THREE from 'three';
import { WINGS } from '@/content';
import { rk4Step } from '@/sims/integrators/ode';
import { doublePendulumDeriv, EARTH_OMEGA_RAD_S } from '@/sims/physicsBenchmarks';
import { WING_BASES } from '../player/collision';

export interface LandmarkHitTarget {
  mesh: THREE.Object3D;
  bookId: string;
  title: string;
  subtitle: string;
}

const BLACK_HOLE_FRAG = /* glsl */ `
  uniform float uTime;
  varying vec2 vUv;

  float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }

  float starField(vec2 uv) {
    vec2 gv = fract(uv * 26.0) - 0.5;
    vec2 id = floor(uv * 26.0);
    float n = hash21(id);
    float sz = fract(n * 345.32);
    float d = length(gv - (vec2(n, fract(n * 42.1)) - 0.5) * 0.55);
    return smoothstep(0.08 * sz, 0.0, d) * step(0.76, n);
  }

  void main() {
    // Normalised impact parameter in units of M: map [-1, 1] to [-12M, +12M]
    vec2 p = (vUv - 0.5) * 24.0;
    float b = length(p);
    // Exact Schwarzschild critical shadow radius b_crit = sqrt(27) M ≈ 5.19615 M
    float bCrit = 5.1961524;

    if (b > 11.8) discard;

    if (b < bCrit) {
      // Inside black hole shadow; add subtle sub-ring photon-sphere glow near boundary
      float edgeGlow = exp(-6.5 * (bCrit - b));
      gl_FragColor = vec4(vec3(0.95, 0.68, 0.32) * edgeGlow * 0.45, 0.96);
      return;
    }

    // Relativistic gravitational deflection: alpha(b) = 4M/b + 15*pi*M^2 / (4 b^2) + strong-field divergence near bCrit
    float defl = 4.0 / b + 11.78 / (b * b) + 1.15 / max(0.06, b - bCrit);
    vec2 dir = p / b;
    vec2 srcUv = 0.5 + (p - dir * defl) / 28.0 + vec2(uTime * 0.008, 0.0);

    float stars = starField(srcUv) + 0.55 * starField(srcUv * 1.9 + 3.1);

    // Relativistic Doppler-boosted equatorial accretion ring + photon ring at b_crit
    float photonRing = exp(-4.8 * abs(b - bCrit * 1.03));
    float diskTilt = abs(p.y + 0.22 * sin(p.x * 0.25)) / max(1.0, b * 0.26);
    float doppler = 1.0 + 0.48 * (p.x / max(1.0, b));
    float disk = exp(-2.8 * diskTilt) * smoothstep(11.2, 5.2, b) * doppler;

    vec3 col = vec3(0.03, 0.04, 0.09) + vec3(0.85, 0.90, 1.0) * stars;
    col += vec3(1.0, 0.72, 0.34) * photonRing * 1.35;
    col += vec3(0.65, 0.56, 1.0) * disk * 0.65;

    float alpha = smoothstep(11.8, 10.6, b);
    gl_FragColor = vec4(col, alpha);
  }
`;

const BLACK_HOLE_VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export class LandmarksManager {
  public readonly hitTargets: LandmarkHitTarget[] = [];

  // Foucault state (latitude phi = 59.86 deg N, time speedup = 3600x)
  private foucaultArm!: THREE.Group;
  private foucaultBob!: THREE.Mesh;
  private foucaultPhase = 0;
  private foucaultAzimuth = 0;

  // Wing I Double Pendulum
  private dpState: Float64Array = new Float64Array([2.25, 1.75, 0, 0]);
  private dpRod1!: THREE.Mesh;
  private dpRod2!: THREE.Mesh;
  private dpBob1!: THREE.Mesh;
  private dpBob2!: THREE.Mesh;
  private dpTrailGeo!: THREE.BufferGeometry;
  private dpTrailPositions = new Float32Array(180 * 3);
  private dpPivotLocal = new THREE.Vector3(0, 3.05, 0);

  // Wing II Tesla arcs
  private teslaArcLines: THREE.Line[] = [];
  private teslaTimer = 0;

  // Wing III Gas spheres
  private gasMeshes: THREE.Mesh[] = [];
  private gasPos: THREE.Vector3[] = [];
  private gasVel: THREE.Vector3[] = [];

  // Wing IV Black Hole Lensing
  private bhMesh!: THREE.Mesh;
  private bhUniforms = { uTime: { value: 0 } };

  // Wing V Double-Slit Particle Detections
  private slitPointsGeo!: THREE.BufferGeometry;
  private slitPointPositions = new Float32Array(360 * 3);
  private slitCursor = 0;

  // Wing VI Crystal Lattice Phonons
  private phononSpheres: Array<{ mesh: THREE.Mesh; base: THREE.Vector3; gx: number; gy: number; gz: number }> = [];

  private elapsed = 0;

  constructor(scene: THREE.Scene) {
    this.buildFoucaultRotunda(scene);
    this.buildSixWingLandmarks(scene);
  }

  private buildFoucaultRotunda(scene: THREE.Scene): void {
    const root = new THREE.Group();
    scene.add(root);

    // Marble compass plinth
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(2.35, 2.55, 0.36, 48),
      new THREE.MeshStandardMaterial({ color: 0x26221e, roughness: 0.35, metalness: 0.15 })
    );
    plinth.position.y = 0.18;
    root.add(plinth);

    const brassRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.15, 0.045, 12, 64),
      new THREE.MeshStandardMaterial({ color: 0xd4a64a, roughness: 0.28, metalness: 0.85 })
    );
    brassRing.rotation.x = Math.PI / 2;
    brassRing.position.y = 0.37;
    root.add(brassRing);

    // 24 azimuth degree pegs around compass circle
    const pegGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.16, 8);
    const pegMat = new THREE.MeshStandardMaterial({ color: 0xe4bd6b, metalness: 0.8, roughness: 0.25 });
    for (let i = 0; i < 24; i++) {
      const ang = (i / 24) * Math.PI * 2;
      const peg = new THREE.Mesh(pegGeo, pegMat);
      peg.position.set(Math.cos(ang) * 1.98, 0.44, Math.sin(ang) * 1.98);
      root.add(peg);
    }

    this.foucaultArm = new THREE.Group();
    this.foucaultArm.position.set(0, 16.5, 0);
    root.add(this.foucaultArm);

    const wire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 15.6, 8),
      new THREE.MeshBasicMaterial({ color: 0xd6d3d1 })
    );
    wire.position.y = -7.8;
    this.foucaultArm.add(wire);

    this.foucaultBob = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 28, 20),
      new THREE.MeshStandardMaterial({ color: 0xd9a84e, metalness: 0.88, roughness: 0.18 })
    );
    this.foucaultBob.position.y = -15.6;
    this.foucaultArm.add(this.foucaultBob);

    this.hitTargets.push({
      mesh: plinth,
      bookId: 'lagrangian-mechanics',
      title: 'Foucault Pendulum (φ = 59.86° N)',
      subtitle: 'Precession rate Ω = ω_⊕ sin φ (3600× speed-up) · Click to open Lagrangian Mechanics',
    });
  }

  private buildSixWingLandmarks(scene: THREE.Scene): void {
    for (const wing of WINGS) {
      const basis = WING_BASES[wing.id];
      const group = new THREE.Group();
      group.position
        .set(0, 0, 0)
        .addScaledVector(basis.forward, 46.8);
      // Orient local +Z back toward rotunda (-forward) so exhibit faces approaching reader!
      const faceBack = basis.forward.clone().negate();
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(up, faceBack).normalize();
      group.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right, up, faceBack));
      scene.add(group);

      // Pedestal
      const pedestal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.45, 1.62, 0.72, 32),
        new THREE.MeshStandardMaterial({ color: 0x222026, roughness: 0.4, metalness: 0.3 })
      );
      pedestal.position.y = 0.36;
      group.add(pedestal);

      this.hitTargets.push({
        mesh: pedestal,
        bookId: wing.landmarkBookId,
        title: `Landmark · ${wing.landmarkTitle}`,
        subtitle: `${wing.landmarkSummary} · Click to open monograph`,
      });

      if (wing.id === 'mechanics') {
        const frame = new THREE.Mesh(
          new THREE.TorusGeometry(1.35, 0.04, 10, 48, Math.PI),
          new THREE.MeshStandardMaterial({ color: 0xc59b48, metalness: 0.85, roughness: 0.25 })
        );
        frame.position.set(0, 1.85, 0);
        group.add(frame);

        const rodMat = new THREE.MeshStandardMaterial({ color: 0xe3b857, metalness: 0.85, roughness: 0.2 });
        this.dpRod1 = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.95, 10), rodMat);
        this.dpRod2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.95, 10), rodMat);
        this.dpBob1 = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 16), rodMat);
        this.dpBob2 = new THREE.Mesh(
          new THREE.SphereGeometry(0.1, 16, 16),
          new THREE.MeshStandardMaterial({ color: 0xff9f1c, emissive: 0x804000, roughness: 0.2 })
        );
        group.add(this.dpRod1, this.dpRod2, this.dpBob1, this.dpBob2);

        this.dpTrailGeo = new THREE.BufferGeometry();
        this.dpTrailGeo.setAttribute('position', new THREE.BufferAttribute(this.dpTrailPositions, 3));
        const trailLine = new THREE.Line(
          this.dpTrailGeo,
          new THREE.LineBasicMaterial({ color: 0xffb703 })
        );
        group.add(trailLine);
      } else if (wing.id === 'electromagnetism') {
        // Tesla copper resonator + dispersive glass prism
        const coil = new THREE.Mesh(
          new THREE.CylinderGeometry(0.24, 0.3, 1.5, 24),
          new THREE.MeshStandardMaterial({ color: 0xb87333, metalness: 0.8, roughness: 0.3 })
        );
        coil.position.set(-0.45, 1.45, 0);
        const toroid = new THREE.Mesh(
          new THREE.TorusGeometry(0.38, 0.11, 16, 36),
          new THREE.MeshStandardMaterial({ color: 0xd4dbe2, metalness: 0.92, roughness: 0.12 })
        );
        toroid.rotation.x = Math.PI / 2;
        toroid.position.set(-0.45, 2.25, 0);
        group.add(coil, toroid);

        for (let a = 0; a < 4; a++) {
          const pts = Array.from({ length: 8 }, () => new THREE.Vector3(-0.45, 2.25, 0));
          const geo = new THREE.BufferGeometry().setFromPoints(pts);
          const ln = new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0x7dd3fc }));
          group.add(ln);
          this.teslaArcLines.push(ln);
        }

        // Triangular dispersive prism + 5 rainbow beams
        const prism = new THREE.Mesh(
          new THREE.CylinderGeometry(0.38, 0.38, 0.65, 3),
          new THREE.MeshStandardMaterial({
            color: 0xe0f2fe,
            transparent: true,
            opacity: 0.68,
            roughness: 0.08,
            metalness: 0.1,
          })
        );
        prism.position.set(0.55, 1.25, 0);
        group.add(prism);

        const rainbow = [0xef4444, 0xf97316, 0xeab308, 0x22c55e, 0x3b82f6, 0x8b5cf6];
        rainbow.forEach((hex, idx) => {
          const ray = new THREE.Mesh(
            new THREE.CylinderGeometry(0.015, 0.03, 1.35, 8),
            new THREE.MeshBasicMaterial({ color: hex, transparent: true, opacity: 0.72 })
          );
          ray.position.set(1.12, 1.15 - idx * 0.07, 0);
          ray.rotation.z = Math.PI / 2 + 0.12 + idx * 0.055;
          group.add(ray);
        });
      } else if (wing.id === 'thermal') {
        // Glass Maxwell-Boltzmann kinetic gas chamber
        const glass = new THREE.Mesh(
          new THREE.CylinderGeometry(0.95, 0.95, 1.9, 28),
          new THREE.MeshStandardMaterial({
            color: 0xfef3c7,
            transparent: true,
            opacity: 0.22,
            roughness: 0.1,
          })
        );
        glass.position.y = 1.72;
        group.add(glass);

        const sphereGeo = new THREE.SphereGeometry(0.055, 10, 10);
        for (let i = 0; i < 36; i++) {
          const m = new THREE.Mesh(
            sphereGeo,
            new THREE.MeshStandardMaterial({
              color: i % 3 === 0 ? 0xf97316 : 0x38bdf8,
              emissive: i % 3 === 0 ? 0x5c1d06 : 0x082f49,
              roughness: 0.25,
            })
          );
          const ang = (i / 36) * Math.PI * 2;
          const p = new THREE.Vector3(
            Math.cos(ang) * 0.45,
            1.1 + (i % 6) * 0.22,
            Math.sin(ang) * 0.45
          );
          const v = new THREE.Vector3(
            Math.cos(i * 1.7) * 1.3,
            Math.sin(i * 2.3) * 1.1,
            Math.sin(i * 1.1) * 1.3
          );
          m.position.copy(p);
          group.add(m);
          this.gasMeshes.push(m);
          this.gasPos.push(p);
          this.gasVel.push(v);
        }
      } else if (wing.id === 'relativity') {
        // Real-time Schwarzschild black-hole gravitational lensing billboard
        const bhMat = new THREE.ShaderMaterial({
          vertexShader: BLACK_HOLE_VERT,
          fragmentShader: BLACK_HOLE_FRAG,
          uniforms: this.bhUniforms,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        });
        this.bhMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 3.2), bhMat);
        this.bhMesh.position.set(0, 2.35, 0);
        group.add(this.bhMesh);
        this.hitTargets.push({
          mesh: this.bhMesh,
          bookId: wing.landmarkBookId,
          title: 'Schwarzschild Black Hole Lensing',
          subtitle: 'Photon ring r = 3GM/c², shadow b_c = √27 GM/c² · Click to open Relativity',
        });
      } else if (wing.id === 'quantum') {
        // Double-slit single-quanta buildup screen
        const barrier = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 1.3, 0.05),
          new THREE.MeshStandardMaterial({ color: 0x164e63, transparent: true, opacity: 0.7 })
        );
        barrier.position.set(0, 1.55, 0.35);
        const detector = new THREE.Mesh(
          new THREE.PlaneGeometry(2.1, 1.45),
          new THREE.MeshStandardMaterial({ color: 0x09151a, roughness: 0.8 })
        );
        detector.position.set(0, 1.55, -0.45);
        group.add(barrier, detector);

        this.slitPointsGeo = new THREE.BufferGeometry();
        this.slitPointsGeo.setAttribute(
          'position',
          new THREE.BufferAttribute(this.slitPointPositions, 3)
        );
        const ptsMesh = new THREE.Points(
          this.slitPointsGeo,
          new THREE.PointsMaterial({ color: 0x5eead4, size: 0.045 })
        );
        group.add(ptsMesh);
      } else if (wing.id === 'frontiers') {
        // 3D Crystal Lattice with travelling phonon modes
        const atomGeo = new THREE.SphereGeometry(0.068, 12, 12);
        for (let gx = 0; gx < 4; gx++) {
          for (let gy = 0; gy < 4; gy++) {
            for (let gz = 0; gz < 4; gz++) {
              const isSubB = (gx + gy + gz) % 2 === 1;
              const mesh = new THREE.Mesh(
                atomGeo,
                new THREE.MeshStandardMaterial({
                  color: isSubB ? 0xe879f9 : 0x38bdf8,
                  emissive: isSubB ? 0x4a044e : 0x0c4a6e,
                  metalness: 0.5,
                  roughness: 0.2,
                })
              );
              const base = new THREE.Vector3(
                (gx - 1.5) * 0.42,
                1.18 + gy * 0.42,
                (gz - 1.5) * 0.42
              );
              mesh.position.copy(base);
              group.add(mesh);
              this.phononSpheres.push({ mesh, base, gx, gy, gz });
            }
          }
        }
      }
    }
  }

  public update(dt: number, cameraWorldPos: THREE.Vector3): void {
    const clampedDt = Math.min(0.04, dt);
    this.elapsed += clampedDt;

    // 1. Foucault Pendulum (latitude = 59.86 deg N, 3600x visual speed-up)
    const phiLat = (59.86 * Math.PI) / 180;
    const omegaP = EARTH_OMEGA_RAD_S * Math.sin(phiLat) * 3600;
    this.foucaultAzimuth += omegaP * clampedDt;
    this.foucaultPhase += Math.sqrt(9.81 / 15.6) * clampedDt;
    const swingAngle = 0.115 * Math.cos(this.foucaultPhase);
    this.foucaultArm.rotation.set(0, this.foucaultAzimuth, swingAngle);

    // 2. Wing I Double Pendulum
    for (let s = 0; s < 4; s++) {
      this.dpState = rk4Step(
        this.dpState,
        (t, y, out) => doublePendulumDeriv(t, y, out, 1, 1, 0.95, 0.95, 9.81),
        0,
        clampedDt * 0.25
      );
    }
    if (this.dpRod1) {
      const L = 0.95;
      const th1 = this.dpState[0];
      const th2 = this.dpState[1];
      const p0 = this.dpPivotLocal;
      const x1 = L * Math.sin(th1);
      const y1 = p0.y - L * Math.cos(th1);
      const x2 = x1 + L * Math.sin(th2);
      const y2 = y1 - L * Math.cos(th2);

      this.dpRod1.position.set(x1 * 0.5, (p0.y + y1) * 0.5, 0.12);
      this.dpRod1.rotation.z = th1;
      this.dpBob1.position.set(x1, y1, 0.12);

      this.dpRod2.position.set((x1 + x2) * 0.5, (y1 + y2) * 0.5, 0.15);
      this.dpRod2.rotation.z = th2;
      this.dpBob2.position.set(x2, y2, 0.15);

      this.dpTrailPositions.copyWithin(0, 3);
      const end = (180 - 1) * 3;
      this.dpTrailPositions[end] = x2;
      this.dpTrailPositions[end + 1] = y2;
      this.dpTrailPositions[end + 2] = 0.15;
      this.dpTrailGeo.attributes.position.needsUpdate = true;
    }

    // 3. Wing II Procedural Tesla Arcs
    this.teslaTimer += clampedDt;
    if (this.teslaTimer > 0.065) {
      this.teslaTimer = 0;
      this.teslaArcLines.forEach((line, idx) => {
        const attr = line.geometry.getAttribute('position') as THREE.BufferAttribute;
        const baseAng = (idx / this.teslaArcLines.length) * Math.PI * 2 + this.elapsed * 1.9;
        for (let k = 0; k < attr.count; k++) {
          const u = k / (attr.count - 1);
          const r = 0.35 + u * 0.72;
          const jitterY = k === 0 ? 0 : (Math.random() - 0.5) * 0.18;
          const jitterA = k === 0 ? 0 : (Math.random() - 0.5) * 0.25;
          attr.setXYZ(
            k,
            -0.45 + Math.cos(baseAng + jitterA) * r,
            2.25 - u * 0.45 + jitterY,
            Math.sin(baseAng + jitterA) * r
          );
        }
        attr.needsUpdate = true;
      });
    }

    // 4. Wing III Gas Spheres inside cylinder
    for (let i = 0; i < this.gasPos.length; i++) {
      const p = this.gasPos[i];
      const v = this.gasVel[i];
      p.addScaledVector(v, clampedDt);
      const rXZ = Math.hypot(p.x, p.z);
      if (rXZ > 0.84) {
        const nx = p.x / rXZ;
        const nz = p.z / rXZ;
        const dot = v.x * nx + v.z * nz;
        if (dot > 0) {
          v.x -= 2 * dot * nx;
          v.z -= 2 * dot * nz;
        }
        p.x = nx * 0.84;
        p.z = nz * 0.84;
      }
      if (p.y < 0.86 || p.y > 2.55) {
        v.y = -v.y;
        p.y = Math.max(0.86, Math.min(2.55, p.y));
      }
      this.gasMeshes[i].position.copy(p);
    }

    // 5. Wing IV Black Hole Lensing Billboard faces player smoothly
    if (this.bhMesh) {
      this.bhUniforms.uTime.value = this.elapsed;
      this.bhMesh.lookAt(cameraWorldPos);
    }

    // 6. Wing V Double-Slit Single-Quanta Buildup (rejection sample cos^2 * Gaussian envelope)
    if (this.slitPointsGeo) {
      for (let emit = 0; emit < 2; emit++) {
        let acceptedX = 0;
        for (let tries = 0; tries < 12; tries++) {
          const candX = (Math.random() * 2 - 1) * 0.92;
          const env = Math.exp(-2.2 * candX * candX) * Math.pow(Math.cos(13.5 * candX), 2);
          if (Math.random() < env) {
            acceptedX = candX;
            break;
          }
        }
        const candY = 1.55 + (Math.random() * 2 - 1) * 0.52;
        const base = (this.slitCursor % 360) * 3;
        this.slitPointPositions[base] = acceptedX;
        this.slitPointPositions[base + 1] = candY;
        this.slitPointPositions[base + 2] = -0.43;
        this.slitCursor++;
      }
      this.slitPointsGeo.attributes.position.needsUpdate = true;
    }

    // 7. Wing VI Phonon Waves
    for (const atom of this.phononSpheres) {
      const phase = 0.85 * atom.gx + 0.55 * atom.gz - this.elapsed * 3.4;
      const opticalSign = (atom.gx + atom.gy + atom.gz) % 2 === 0 ? 1 : -0.65;
      atom.mesh.position.set(
        atom.base.x + 0.045 * Math.sin(phase) * opticalSign,
        atom.base.y + 0.065 * Math.cos(phase),
        atom.base.z
      );
    }
  }
}
