import { IFrameLoad } from '../../../features/frame-solver/types/frame';

// Helper to calculate M0(x) for cantilever primary structure
export function getCantileverM0(
  x: number,
  loads: IFrameLoad[],
  memberMap: Map<string, { startX: number; endX: number }>
): number {
  let M = 0;
  loads.forEach(load => {
    if (load.attachedTo !== 'member' || !load.memberId) return;
    const span = memberMap.get(load.memberId);
    if (!span) return;

    // Global x-coordinate of the load
    const loadX = span.startX + (load.position ?? 0.5) * (span.endX - span.startX);
    const mag = load.magnitude;

    if (load.type === 'point') {
      // Downward point load causes hogging (negative) moment to the right
      if (x > loadX) {
        M -= mag * (x - loadX);
      }
    } else if (load.type === 'udl') {
      const u = span.startX;
      const v = span.endX;
      if (x <= u) return;
      if (x > u && x <= v) {
        M -= (mag * (x - u) * (x - u)) / 2;
      } else if (x > v) {
        M -= mag * (v - u) * (x - (u + v) / 2);
      }
    }
  });
  return M;
}

// Helper to calculate M0(x) for simple span primary structure
export function getSimpleSpanM0(
  x: number,
  V0: number,
  loads: IFrameLoad[],
  memberMap: Map<string, { startX: number; endX: number }>
): number {
  let M = V0 * x;
  loads.forEach(load => {
    if (load.attachedTo !== 'member' || !load.memberId) return;
    const span = memberMap.get(load.memberId);
    if (!span) return;

    const loadX = span.startX + (load.position ?? 0.5) * (span.endX - span.startX);
    const mag = load.magnitude;

    if (load.type === 'point') {
      if (x > loadX) {
        M -= mag * (x - loadX);
      }
    } else if (load.type === 'udl') {
      const u = span.startX;
      const v = span.endX;
      if (x <= u) return;
      if (x > u && x <= v) {
        M -= (mag * (x - u) * (x - u)) / 2;
      } else if (x > v) {
        M -= mag * (v - u) * (x - (u + v) / 2);
      }
    }
  });
  return M;
}
