import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Color,
  DynamicDrawUsage,
  Float32BufferAttribute,
  Group,
  InstancedMesh,
  MeshBasicMaterial,
  Object3D,
  type WebGLRenderer,
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import type { SystemLayer } from "./layers";
import type { SceneSection } from "./latticeState";
import {
  VOXEL_MORPH_DURATION_MS,
  VOXEL_POINTER_RESPONSE,
  dampingFactor,
  interpolate,
  mapVoxelOrbit,
  motionSettled,
  voxelIdleDrift,
  voxelMorphProgress,
  type OrbitTarget,
} from "./sceneMotion";
import {
  VOXEL_COUNT,
  VOXEL_FORMATION_SPEC,
  VOXEL_IDENTITY_ORIENTATION,
  voxelToneAt,
  type VoxelFormationId,
  type VoxelFormationTarget,
  type VoxelTone,
} from "./voxelFormationSpec";

/**
 * Optional WebGL enhancement for the warm LA-monogram stage.
 *
 * cx20's “Test of Three.js and Tween.js” is interaction inspiration only.
 * This renderer is independently authored: one InstancedMesh, original
 * algorithmic targets, a local easing state machine, no copied voxel matrix,
 * no image/texture/model and no Tween.js. Its demand loop stays active only
 * for a visible hero's subtle idle yaw, traffic pulse, morph or pointer return.
 */

interface Palette {
  front: Color;
  side: Color;
  dust: Color;
  signal: Color;
}

function token(name: string): Color {
  if (typeof window === "undefined") return new Color(1, 1, 1);
  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  const parts = raw.split(/\s+/);
  if (parts.length < 3) return new Color(1, 1, 1);
  try {
    return new Color(`hsl(${parts[0]},${parts[1]},${parts[2]})`);
  } catch {
    return new Color(1, 1, 1);
  }
}

function readPalette(): Palette {
  return {
    front: token("--signal"),
    side: token("--muted-foreground"),
    dust: token("--voxel-dust"),
    signal: token("--signal"),
  };
}

function toneColor(tone: VoxelTone, palette: Palette): Color {
  if (tone === "side") return palette.side;
  if (tone === "dust") return palette.dust;
  return palette.front;
}

function createVoxelGeometry(): RoundedBoxGeometry {
  const geometry = new RoundedBoxGeometry(0.18, 0.18, 0.18, 2, 0.025);
  const normals = geometry.getAttribute("normal");
  const shades = new Float32Array(normals.count * 3);

  for (let index = 0; index < normals.count; index += 1) {
    const nx = normals.getX(index);
    const ny = normals.getY(index);
    const nz = normals.getZ(index);
    const shade = nz > 0.5 ? 1 : ny > 0.5 ? 0.86 : nx > 0.5 ? 0.75 : 0.62;
    const offset = index * 3;
    shades[offset] = shade;
    shades[offset + 1] = shade;
    shades[offset + 2] = shade;
  }

  geometry.setAttribute("color", new Float32BufferAttribute(shades, 3));
  return geometry;
}

interface PoseBuffers {
  position: Float32Array;
  rotation: Float32Array;
  scale: Float32Array;
  fromPosition: Float32Array;
  fromRotation: Float32Array;
  fromScale: Float32Array;
}

function createPoseBuffers(): PoseBuffers {
  return {
    position: new Float32Array(VOXEL_COUNT * 3),
    rotation: new Float32Array(VOXEL_COUNT * 3),
    scale: new Float32Array(VOXEL_COUNT),
    fromPosition: new Float32Array(VOXEL_COUNT * 3),
    fromRotation: new Float32Array(VOXEL_COUNT * 3),
    fromScale: new Float32Array(VOXEL_COUNT),
  };
}

function copyTargetToBuffers(
  target: VoxelFormationTarget,
  buffers: PoseBuffers,
): void {
  buffers.position.set(target.position);
  buffers.rotation.set(target.rotation);
  buffers.scale.set(target.scale);
}

interface FieldProps {
  section: SceneSection;
  activeLayer: SystemLayer | null;
  formation: VoxelFormationId;
  motionAllowed: boolean;
}

const VoxelField = ({
  section,
  activeLayer,
  formation,
  motionAllowed,
}: FieldProps) => {
  const { invalidate, gl } = useThree();
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<InstancedMesh>(null);
  const dummy = useMemo(() => new Object3D(), []);
  const geometry = useMemo(createVoxelGeometry, []);
  const material = useMemo(
    () =>
      new MeshBasicMaterial({
        color: 0xffffff,
        vertexColors: true,
        toneMapped: false,
      }),
    [],
  );
  const buffers = useMemo(createPoseBuffers, []);
  const initialized = useRef(false);
  const matricesDirty = useRef(true);
  const contextLost = useRef(false);
  const activeFormation = useRef<VoxelFormationId>(formation);
  const transition = useRef({ active: false, startedAt: 0, maximumDistance: 1 });
  const idleClock = useRef(0);
  const pulseClock = useRef(0);
  const orbit = useRef<{
    current: OrbitTarget;
    target: OrbitTarget;
    dragging: boolean;
    startX: number;
    startY: number;
  }>({
    current: { pitch: 0, yaw: 0 },
    target: { pitch: 0, yaw: 0 },
    dragging: false,
    startX: 0,
    startY: 0,
  });

  const palette = useRef(readPalette());

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    const target = VOXEL_FORMATION_SPEC.formations[activeFormation.current];
    VOXEL_FORMATION_SPEC.cells.forEach((cell, index) => {
      const color = toneColor(voxelToneAt(target, index), palette.current).clone();
      if (activeLayer === cell.layer) color.lerp(palette.current.signal, 0.2);
      mesh.setColorAt(index, color);
    });
    if (mesh.instanceColor) {
      mesh.instanceColor.setUsage(DynamicDrawUsage);
      mesh.instanceColor.needsUpdate = true;
    }
    invalidate();
  }, [activeLayer, invalidate]);

  useEffect(() => {
    if (typeof MutationObserver === "undefined") return;
    const observer = new MutationObserver(() => {
      const mesh = meshRef.current;
      palette.current = readPalette();
      if (!mesh) return;
      const target = VOXEL_FORMATION_SPEC.formations[activeFormation.current];
      VOXEL_FORMATION_SPEC.cells.forEach((cell, index) => {
        const color = toneColor(voxelToneAt(target, index), palette.current).clone();
        if (activeLayer === cell.layer) color.lerp(palette.current.signal, 0.2);
        mesh.setColorAt(index, color);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      invalidate();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [activeLayer, invalidate]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const target = VOXEL_FORMATION_SPEC.formations[formation];
      VOXEL_FORMATION_SPEC.cells.forEach((cell, index) => {
        const color = toneColor(voxelToneAt(target, index), palette.current).clone();
        if (activeLayer === cell.layer) color.lerp(palette.current.signal, 0.2);
        mesh.setColorAt(index, color);
      });
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    matricesDirty.current = true;
    invalidate();
  }, [activeLayer, formation, invalidate]);

  useEffect(() => {
    if (formation === activeFormation.current) return;

    buffers.fromPosition.set(buffers.position);
    buffers.fromRotation.set(buffers.rotation);
    buffers.fromScale.set(buffers.scale);
    let maximumDistance = 0;
    for (let index = 0; index < VOXEL_COUNT; index += 1) {
      const offset = index * 3;
      maximumDistance = Math.max(
        maximumDistance,
        Math.hypot(
          buffers.fromPosition[offset],
          buffers.fromPosition[offset + 1],
          buffers.fromPosition[offset + 2],
        ),
      );
    }
    activeFormation.current = formation;
    transition.current.active = true;
    transition.current.startedAt = performance.now();
    transition.current.maximumDistance = maximumDistance || 1;
    matricesDirty.current = true;
    invalidate();
  }, [buffers, formation, invalidate]);

  useEffect(() => {
    const interactive = section === "hero";
    if (!interactive) {
      orbit.current.dragging = false;
      orbit.current.target = { pitch: 0, yaw: 0 };
      invalidate();
    }

    const insideCanvas = (event: PointerEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      return (
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom
      );
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        !interactive ||
        document.hidden ||
        !insideCanvas(event) ||
        (event.target instanceof Element &&
          event.target.closest("[data-voxel-control]"))
      ) {
        return;
      }
      orbit.current.dragging = true;
      orbit.current.startX = event.clientX;
      orbit.current.startY = event.clientY;
      invalidate();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!interactive || document.hidden) return;
      const rect = gl.domElement.getBoundingClientRect();
      let nextTarget: OrbitTarget;

      if (orbit.current.dragging) {
        const normalizedX = ((event.clientX - orbit.current.startX) / rect.width) * 2;
        const normalizedY = -((event.clientY - orbit.current.startY) / rect.height) * 2;
        nextTarget = mapVoxelOrbit(normalizedX, normalizedY, true);
      } else if (insideCanvas(event)) {
        const normalizedX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const normalizedY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        nextTarget = mapVoxelOrbit(normalizedX, normalizedY);
      } else {
        nextTarget = { pitch: 0, yaw: 0 };
      }

      const unchanged =
        nextTarget.pitch === orbit.current.target.pitch &&
        nextTarget.yaw === orbit.current.target.yaw;
      if (!unchanged) {
        orbit.current.target = nextTarget;
        invalidate();
      }
    };

    const reset = () => {
      const alreadyReset =
        !orbit.current.dragging &&
        orbit.current.target.pitch === 0 &&
        orbit.current.target.yaw === 0;
      orbit.current.dragging = false;
      orbit.current.target = { pitch: 0, yaw: 0 };
      if (!alreadyReset) invalidate();
    };

    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", reset, { passive: true });
    window.addEventListener("pointercancel", reset, { passive: true });
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", reset);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, [gl, invalidate, section]);

  /*
    Context loss is survivable and must be survived in place.

    three.js already calls preventDefault() and re-initialises its own GL state
    on restore, so the work left here is to re-upload what this component owns
    — the instance matrices and colours — and to stop drawing in the window
    between the two events. The canvas is never unmounted for this; tearing it
    down is what previously turned one recoverable loss into a dead scene.
  */
  useEffect(() => {
    const canvas = gl.domElement;

    const onLost = (event: Event) => {
      event.preventDefault();
      contextLost.current = true;
    };

    const onRestored = () => {
      contextLost.current = false;
      initialized.current = false;
      matricesDirty.current = true;
      const mesh = meshRef.current;
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
      invalidate();
    };

    canvas.addEventListener("webglcontextlost", onLost);
    canvas.addEventListener("webglcontextrestored", onRestored);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [gl, invalidate]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((_state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group || document.hidden || contextLost.current) return;

    if (!initialized.current) {
      copyTargetToBuffers(
        VOXEL_FORMATION_SPEC.formations[activeFormation.current],
        buffers,
      );
      initialized.current = true;
      matricesDirty.current = true;
    }

    if (transition.current.active) {
      const elapsed = performance.now() - transition.current.startedAt;
      const target = VOXEL_FORMATION_SPEC.formations[activeFormation.current];

      for (let index = 0; index < VOXEL_COUNT; index += 1) {
        const offset = index * 3;
        const progress = voxelMorphProgress(
          elapsed,
          Math.hypot(
            buffers.fromPosition[offset],
            buffers.fromPosition[offset + 1],
            buffers.fromPosition[offset + 2],
          ),
          transition.current.maximumDistance,
        );
        buffers.position[offset] = interpolate(
          buffers.fromPosition[offset],
          target.position[offset],
          progress,
        );
        buffers.position[offset + 1] = interpolate(
          buffers.fromPosition[offset + 1],
          target.position[offset + 1],
          progress,
        );
        buffers.position[offset + 2] = interpolate(
          buffers.fromPosition[offset + 2],
          target.position[offset + 2],
          progress,
        );
        buffers.rotation[offset] = interpolate(
          buffers.fromRotation[offset],
          target.rotation[offset],
          progress,
        );
        buffers.rotation[offset + 1] = interpolate(
          buffers.fromRotation[offset + 1],
          target.rotation[offset + 1],
          progress,
        );
        buffers.rotation[offset + 2] = interpolate(
          buffers.fromRotation[offset + 2],
          target.rotation[offset + 2],
          progress,
        );
        buffers.scale[index] = interpolate(
          buffers.fromScale[index],
          target.scale[index],
          progress,
        );
      }

      matricesDirty.current = true;
      transition.current.active = elapsed < VOXEL_MORPH_DURATION_MS;
    }

    if (matricesDirty.current) {
      VOXEL_FORMATION_SPEC.cells.forEach((cell, index) => {
        const offset = index * 3;
        const selectionScale = activeLayer === cell.layer ? 1.18 : 1;
        dummy.position.set(
          buffers.position[offset],
          buffers.position[offset + 1],
          buffers.position[offset + 2],
        );
        dummy.rotation.set(
          buffers.rotation[offset],
          buffers.rotation[offset + 1],
          buffers.rotation[offset + 2],
        );
        dummy.scale.setScalar(buffers.scale[index] * selectionScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(index, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      matricesDirty.current = false;
    }

    const liveMotion = motionAllowed && section === "hero";
    // The clock only advances while the scene is live, so pausing holds the
    // current drift rather than snapping the object back to its rest pose.
    if (liveMotion) idleClock.current += delta;
    const idleDrift = voxelIdleDrift(idleClock.current);

    if (liveMotion && activeFormation.current === "architecture") {
      pulseClock.current += delta;
      const target = VOXEL_FORMATION_SPEC.formations.architecture;
      VOXEL_FORMATION_SPEC.architecturePulseIndices.forEach(
        (indices, pulseIndex) => {
          const head = (pulseClock.current / (3.8 + pulseIndex * 0.7)) % 1;
          indices.forEach((index, order) => {
            const progress = order / Math.max(1, indices.length - 1);
            const directDistance = Math.abs(progress - head);
            const wrappedDistance = Math.min(directDistance, 1 - directDistance);
            const strength = Math.max(0, 1 - wrappedDistance / 0.14) * 0.72;
            const cell = VOXEL_FORMATION_SPEC.cells[index];
            const color = toneColor(voxelToneAt(target, index), palette.current)
              .clone();
            if (activeLayer === cell.layer) {
              color.lerp(palette.current.signal, 0.2);
            }
            color.lerp(palette.current.signal, strength);
            mesh.setColorAt(index, color);
          });
        },
      );
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    const pointer = orbit.current;
    const returning = pointer.target.pitch === 0 && pointer.target.yaw === 0;
    const response = returning
      ? VOXEL_POINTER_RESPONSE.return
      : VOXEL_POINTER_RESPONSE.follow;
    const ease = dampingFactor(response, Math.min(delta, 0.05));
    pointer.current.pitch += (pointer.target.pitch - pointer.current.pitch) * ease;
    pointer.current.yaw += (pointer.target.yaw - pointer.current.yaw) * ease;

    const identity = activeFormation.current === "identity";
    const architecture = activeFormation.current === "architecture";
    const basePitch = identity
      ? VOXEL_IDENTITY_ORIENTATION.pitch
      : architecture ? -0.11 : -0.16;
    const baseYaw = identity
      ? VOXEL_IDENTITY_ORIENTATION.yaw
      : architecture ? 0.18 : 0.22;
    /*
      Every formation orbits its own rest pose by the same bounded drift. The
      monogram needs it to stay readable as an extruded LA; architecture and
      throughput need it for the same reason — a full revolution turns the
      layered diagram edge-on and destroys the left-to-right pulse reading.
    */
    group.rotation.x = basePitch + idleDrift.pitch + pointer.current.pitch;
    group.rotation.y = baseYaw + idleDrift.yaw + pointer.current.yaw;
    group.position.x = pointer.current.yaw * 0.26;
    group.position.y = -pointer.current.pitch * 0.18;

    if (
      transition.current.active ||
      liveMotion ||
      !motionSettled(pointer.current, pointer.target)
    ) {
      invalidate();
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        ref={meshRef}
        args={[geometry, material, VOXEL_COUNT]}
        frustumCulled={false}
      />
    </group>
  );
};

interface Props {
  section: SceneSection;
  activeLayer: SystemLayer | null;
  coarse: boolean;
  formation: VoxelFormationId;
  accessibleName: string;
  motionAllowed: boolean;
  onFail: () => void;
}

/**
 * How long a lost context gets to come back before the static monogram takes
 * over permanently. Browsers normally restore within a frame or two; anything
 * past this is a real GPU-side failure rather than a routine eviction.
 */
const CONTEXT_RESTORE_GRACE_MS = 4000;

const LatticeScene = ({
  section,
  activeLayer,
  coarse,
  formation,
  accessibleName,
  motionAllowed,
  onFail,
}: Props) => {
  const failed = useRef(false);

  return (
    <Canvas
      role="img"
      aria-label={accessibleName}
      frameloop="demand"
      dpr={coarse ? 1 : [1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      camera={{ fov: 40, position: [0, 0, 7.4] }}
      style={{ pointerEvents: "none" }}
      onCreated={({ gl }: { gl: WebGLRenderer }) => {
        const canvas = gl.domElement;
        gl.setClearColor(0x000000, 0);
        canvas.setAttribute("aria-hidden", "true");
        canvas.setAttribute("tabindex", "-1");
        canvas.setAttribute("data-voxel-webgl", "true");
        canvas.dataset.voxelContext = "ready";

        /*
          A lost context is not a failure. preventDefault() is what makes the
          browser willing to restore it, and VoxelField re-uploads its instance
          data when the restore lands. Falling back is now a timeout, not a
          reflex: previously the first loss unmounted the canvas immediately,
          which guaranteed the restore event could never arrive. The listeners
          are not `once`, so a second loss is handled just like the first.
        */
        let restoreTimer = 0;

        canvas.addEventListener("webglcontextlost", (event) => {
          event.preventDefault();
          canvas.dataset.voxelContext = "lost";
          window.clearTimeout(restoreTimer);
          restoreTimer = window.setTimeout(() => {
            if (!failed.current) {
              failed.current = true;
              onFail();
            }
          }, CONTEXT_RESTORE_GRACE_MS);
        });

        canvas.addEventListener("webglcontextrestored", () => {
          window.clearTimeout(restoreTimer);
          canvas.dataset.voxelContext = "ready";
        });
      }}
    >
      <VoxelField
        section={section}
        activeLayer={activeLayer}
        formation={formation}
        motionAllowed={motionAllowed}
      />
    </Canvas>
  );
};

export default LatticeScene;
