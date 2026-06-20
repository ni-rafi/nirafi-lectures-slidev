import { IBeam, ILoad } from '../types';

// Compute load properties (force and moment about referenceX)
export function getLoadForceAndMoment(load: ILoad, referenceX: number = 0): { force: number; moment: number } {
  let force = 0;
  let moment = 0;

  if (load.type === 'point') {
    const mag = load.magnitude ?? 0;
    const pos = load.position ?? 0;
    force = mag; // Downward is positive force
    moment = mag * (pos - referenceX);
  } else if (load.type === 'udl') {
    const mag = load.magnitude ?? 0;
    const start = load.startPosition ?? 0;
    const end = load.endPosition ?? 0;
    const length = end - start;
    const cg = (start + end) / 2;
    force = mag * length;
    moment = force * (cg - referenceX);
  } else if (load.type === 'uvl') {
    const start = load.startPosition ?? 0;
    const end = load.endPosition ?? 0;
    const length = end - start;
    const w1 = load.startMagnitude ?? 0;
    const w2 = load.endMagnitude ?? 0;
    
    // UVL is split into rectangular (w1) and triangular (w2-w1) parts
    const fRect = w1 * length;
    const cgRect = (start + end) / 2;
    const fTri = 0.5 * (w2 - w1) * length;
    const cgTri = start + (2 / 3) * length; // CG of triangle from start
    
    force = fRect + fTri;
    moment = fRect * (cgRect - referenceX) + fTri * (cgTri - referenceX);
  } else if (load.type === 'moment') {
    const mag = load.magnitude ?? 0; // kNm (positive clockwise)
    force = 0;
    moment = -mag; // clockwise moment about any point is clockwise.
  }

  return { force, moment };
}

// Compute load properties to the left of a coordinate
export function getLoadsLeftOf(beam: IBeam, xLimit: number): { force: number; moment: number } {
  let force = 0;
  let moment = 0;

  beam.loads.forEach(load => {
    if (load.type === 'point' || load.type === 'moment') {
      const pos = load.position ?? 0;
      if (pos < xLimit) {
        const res = getLoadForceAndMoment(load, xLimit);
        force += res.force;
        moment += res.moment;
      }
    } else if (load.type === 'udl' || load.type === 'uvl') {
      const start = load.startPosition ?? 0;
      const end = load.endPosition ?? 0;

      if (start >= xLimit) return; // Entirely to the right

      if (end <= xLimit) {
        // Entirely to the left
        const res = getLoadForceAndMoment(load, xLimit);
        force += res.force;
        moment += res.moment;
      } else {
        // Cut UDL/UVL at xLimit
        const length = xLimit - start;
        if (load.type === 'udl') {
          const mag = load.magnitude ?? 0;
          const partialForce = mag * length;
          const cg = start + length / 2;
          force += partialForce;
          moment += partialForce * (cg - xLimit);
        } else {
          // UVL
          const w1 = load.startMagnitude ?? 0;
          const w2 = load.endMagnitude ?? 0;
          const totalLength = end - start;
          const wx = w1 + ((w2 - w1) * length) / totalLength; // intensity at xLimit

          const fRect = w1 * length;
          const cgRect = start + length / 2;
          const fTri = 0.5 * (wx - w1) * length;
          const cgTri = start + (2 / 3) * length;

          force += fRect + fTri;
          moment += fRect * (cgRect - xLimit) + fTri * (cgTri - xLimit);
        }
      }
    }
  });

  return { force, moment };
}
