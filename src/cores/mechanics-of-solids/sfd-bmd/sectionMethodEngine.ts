import { IBeam, IReaction, IIntervalEquation } from './types';

// Utility to expand terms like (x - s)^2 and (x - s)^3 into standard polynomial coefficients
// coefficients are returned as [c_k, ..., c_0] for a polynomial of degree n
export function getIntervalEquations(
  beam: IBeam,
  reactions: IReaction[],
  startX: number,
  endX: number
): IIntervalEquation {
  // We section at x inside (startX, endX) and sum reactions and loads to the left of x.
  // We represent V(x) = v2*x^2 + v1*x + v0
  // and M(x) = m3*x^3 + m2*x^2 + m1*x + m0
  let v2 = 0, v1 = 0, v0 = 0;
  let m3 = 0, m2 = 0, m1 = 0, m0 = 0;

  const latexPartsV: string[] = [];
  const latexPartsM: string[] = [];

  // Add support reactions to the left
  reactions.forEach(r => {
    const support = beam.supports.find(s => s.id === r.supportId);
    if (!support || support.position > startX + 1e-9) return;

    const pos = support.position;

    if (r.type === 'R_y') {
      v0 += r.value;
      latexPartsV.push(`${r.value >= 0 ? '+' : ''}${r.value.toFixed(2)}`);

      // M += R_y * (x - pos) = R_y * x - R_y * pos
      m1 += r.value;
      m0 -= r.value * pos;
      latexPartsM.push(`${r.value >= 0 ? '+' : ''}${r.value.toFixed(2)}(x - ${pos.toFixed(2)})`);
    } else if (r.type === 'M') {
      // M += r.value (clockwise is positive moment)
      m0 += r.value;
      latexPartsM.push(`${r.value >= 0 ? '+' : ''}${r.value.toFixed(2)}`);
    }
  });

  // Add loads to the left
  beam.loads.forEach(load => {
    if (load.type === 'point') {
      const pos = load.position ?? 0;
      const mag = load.magnitude ?? 0;
      if (pos > startX + 1e-9) return;

      // Shear: V -= mag
      v0 -= mag;
      latexPartsV.push(`${-mag >= 0 ? '+' : ''}${(-mag).toFixed(2)}`);

      // Moment: M -= mag * (x - pos) = -mag * x + mag * pos
      m1 -= mag;
      m0 += mag * pos;
      latexPartsM.push(`${-mag >= 0 ? '+' : ''}${(-mag).toFixed(2)}(x - ${pos.toFixed(2)})`);
    } else if (load.type === 'moment') {
      const pos = load.position ?? 0;
      const mag = load.magnitude ?? 0; // positive is clockwise
      if (pos > startX + 1e-9) return;

      // Moment: M += mag (clockwise is positive)
      m0 += mag;
      latexPartsM.push(`${mag >= 0 ? '+' : ''}${mag.toFixed(2)}`);
    } else if (load.type === 'udl') {
      const start = load.startPosition ?? 0;
      const end = load.endPosition ?? 0;
      const mag = load.magnitude ?? 0;

      if (start > startX + 1e-9) return;

      if (end <= startX + 1e-9) {
        // Entirely to the left: acts as a point load at cg
        const length = end - start;
        const totalLoad = mag * length;
        const cg = (start + end) / 2;

        v0 -= totalLoad;
        latexPartsV.push(`${-totalLoad >= 0 ? '+' : ''}${(-totalLoad).toFixed(2)}`);

        m1 -= totalLoad;
        m0 += totalLoad * cg;
        latexPartsM.push(`${-totalLoad >= 0 ? '+' : ''}${(-totalLoad).toFixed(2)}(x - ${cg.toFixed(2)})`);
      } else {
        // Section cuts through UDL
        // V -= mag * (x - start) = -mag * x + mag * start
        v1 -= mag;
        v0 += mag * start;
        latexPartsV.push(`${-mag >= 0 ? '+' : ''}${(-mag).toFixed(2)}(x - ${start.toFixed(2)})`);

        // M -= 0.5 * mag * (x - start)^2 = -0.5*mag*(x^2 - 2*start*x + start^2)
        m2 -= 0.5 * mag;
        m1 += mag * start;
        m0 -= 0.5 * mag * start * start;
        latexPartsM.push(`${-0.5 * mag >= 0 ? '+' : ''}${(-0.5 * mag).toFixed(2)}(x - ${start.toFixed(2)})^2`);
      }
    } else if (load.type === 'uvl') {
      const start = load.startPosition ?? 0;
      const end = load.endPosition ?? 0;
      const w1 = load.startMagnitude ?? 0;
      const w2 = load.endMagnitude ?? 0;

      if (start > startX + 1e-9) return;

      const totalL = end - start;

      if (end <= startX + 1e-9) {
        // Entirely to the left
        const fRect = w1 * totalL;
        const cgRect = (start + end) / 2;
        const fTri = 0.5 * (w2 - w1) * totalL;
        const cgTri = start + (2 / 3) * totalL;

        v0 -= (fRect + fTri);
        latexPartsV.push(`${-(fRect + fTri) >= 0 ? '+' : ''}${(-(fRect + fTri)).toFixed(2)}`);

        m1 -= (fRect + fTri);
        m0 += fRect * cgRect + fTri * cgTri;
        latexPartsM.push(
          `${-fRect >= 0 ? '+' : ''}${(-fRect).toFixed(2)}(x - ${cgRect.toFixed(2)})` +
          `${-fTri >= 0 ? '+' : ''}${(-fTri).toFixed(2)}(x - ${cgTri.toFixed(2)})`
        );
      } else {
        // Section cuts through UVL
        // Load slope: slope = (w2 - w1) / totalL
        const slope = (w2 - w1) / totalL;

        // V(x) -= w1 * (x - start) + 0.5 * slope * (x - start)^2
        // Expand (x - start) and (x - start)^2
        v1 -= w1;
        v0 += w1 * start;

        v2 -= 0.5 * slope;
        v1 += slope * start;
        v0 -= 0.5 * slope * start * start;

        latexPartsV.push(
          `${-w1 >= 0 ? '+' : ''}${(-w1).toFixed(2)}(x - ${start.toFixed(2)})` +
          `${-0.5 * slope >= 0 ? '+' : ''}${(-0.5 * slope).toFixed(3)}(x - ${start.toFixed(2)})^2`
        );

        // M(x) -= 0.5 * w1 * (x - start)^2 + (slope / 6) * (x - start)^3
        // Expand (x-start)^2: x^2 - 2*start*x + start^2
        m2 -= 0.5 * w1;
        m1 += w1 * start;
        m0 -= 0.5 * w1 * start * start;

        // Expand (x-start)^3: x^3 - 3*start*x^2 + 3*start^2*x - start^3
        m3 -= slope / 6;
        m2 += 0.5 * slope * start;
        m1 -= 0.5 * slope * start * start;
        m0 += (slope / 6) * start * start * start;

        latexPartsM.push(
          `${-0.5 * w1 >= 0 ? '+' : ''}${(-0.5 * w1).toFixed(2)}(x - ${start.toFixed(2)})^2` +
          `${-slope / 6 >= 0 ? '+' : ''}${(-slope / 6).toFixed(3)}(x - ${start.toFixed(2)})^3`
        );
      }
    }
  });

  const latexV = latexPartsV.join(' ').replace(/^\s*\+\s*/, '') || '0';
  const latexM = latexPartsM.join(' ').replace(/^\s*\+\s*/, '') || '0';

  return {
    startX,
    endX,
    vCoeffs: [v2, v1, v0],
    mCoeffs: [m3, m2, m1, m0],
    latexV: `V(x) = ${latexV}`,
    latexM: `M(x) = ${latexM}`,
  };
}

export function generateIntervals(beam: IBeam, reactions: IReaction[]): IIntervalEquation[] {
  // Collect all boundary coordinates
  const bounds = new Set<number>();
  bounds.add(0);
  bounds.add(beam.length);

  beam.supports.forEach(s => bounds.add(s.position));
  beam.releases.forEach(r => bounds.add(r.position));
  beam.loads.forEach(l => {
    if (l.position !== undefined) bounds.add(l.position);
    if (l.startPosition !== undefined) bounds.add(l.startPosition);
    if (l.endPosition !== undefined) bounds.add(l.endPosition);
  });

  const sortedBounds = Array.from(bounds)
    .filter(x => x >= 0 && x <= beam.length)
    .sort((a, b) => a - b);

  const intervals: IIntervalEquation[] = [];
  for (let i = 0; i < sortedBounds.length - 1; i++) {
    const startX = sortedBounds[i];
    const endX = sortedBounds[i + 1];
    if (startX !== undefined && endX !== undefined) {
      // Avoid zero-length intervals
      if (endX - startX > 1e-9) {
        intervals.push(getIntervalEquations(beam, reactions, startX, endX));
      }
    }
  }

  return intervals;
}
