import { IIntervalEquation, IBeam } from '../sfd-bmd/types';
import { IEISegment } from './types';

export function calculateEI(E: number, I: number): number {
  return Math.max(1e-3, E * I);
}

export interface IMergedInterval {
  startX: number;
  endX: number;
  vCoeffs: [number, number, number];
  mCoeffs: [number, number, number, number];
  latexV: string;
  latexM: string;
  E: number;
  I: number;
  EI: number; // in kN.m^2
}

// Combine boundaries from moment intervals and EI segments
export function getMergedIntervals(
  momentIntervals: IIntervalEquation[],
  eiSegments: IEISegment[],
  beamLength: number
): IMergedInterval[] {
  const coordsSet = new Set<number>();
  coordsSet.add(0);
  coordsSet.add(beamLength);

  momentIntervals.forEach(inv => {
    coordsSet.add(inv.startX);
    coordsSet.add(inv.endX);
  });

  eiSegments.forEach(seg => {
    coordsSet.add(seg.startPosition);
    coordsSet.add(seg.endPosition);
  });

  // Filter coordinates within [0, beamLength]
  const coords = Array.from(coordsSet)
    .filter(x => x >= 0 && x <= beamLength)
    .sort((a, b) => a - b);

  // Filter out coordinates that are extremely close to each other
  const uniqueCoords: number[] = [];
  coords.forEach(x => {
    if (uniqueCoords.length === 0) {
      uniqueCoords.push(x);
    } else {
      const last = uniqueCoords[uniqueCoords.length - 1]!;
      if (Math.abs(x - last) > 1e-4) {
        uniqueCoords.push(x);
      }
    }
  });

  const merged: IMergedInterval[] = [];
  for (let i = 0; i < uniqueCoords.length - 1; i++) {
    const sX = uniqueCoords[i]!;
    const eX = uniqueCoords[i + 1]!;
    const mid = (sX + eX) / 2;

    // Find matching moment interval
    const mInv = momentIntervals.find(inv => mid >= inv.startX && mid <= inv.endX) ?? momentIntervals[0]!;
    
    // Find matching EI segment
    const eiSeg = eiSegments.find(seg => mid >= seg.startPosition && mid <= seg.endPosition) ?? {
      id: 'default',
      E: 200,
      I: 100,
      startPosition: 0,
      endPosition: beamLength
    };

    const E = eiSeg.E;
    const I = eiSeg.I;
    const EI = calculateEI(E, I);

    merged.push({
      startX: sX,
      endX: eX,
      vCoeffs: mInv.vCoeffs,
      mCoeffs: mInv.mCoeffs,
      latexV: mInv.latexV,
      latexM: mInv.latexM,
      E,
      I,
      EI,
    });
  }

  return merged;
}

// Evaluate a polynomial represented by coefficients at coordinate x using Horner's method
export function evalPoly(coeffs: number[], x: number): number {
  let val = 0;
  for (let i = 0; i < coeffs.length; i++) {
    const c = coeffs[i];
    if (c !== undefined) {
      val = val * x + c;
    }
  }
  return val;
}

// Integrates coeffs [a, b, c, d] once to [a/4, b/3, c/2, d, 0]
export function integratePolyOnce(coeffs: number[]): number[] {
  const n = coeffs.length;
  const integrated = new Array(n + 1).fill(0) as number[];
  for (let i = 0; i < n; i++) {
    const c = coeffs[i];
    if (c !== undefined) {
      integrated[i] = c / (n - i);
    }
  }
  return integrated; // Last element is 0 (constant term C)
}

// Integrates coeffs [a, b, c, d] twice to [a/20, b/12, c/6, d/2, 0, 0]
export function integratePolyTwice(coeffs: number[]): number[] {
  const once = integratePolyOnce(coeffs);
  return integratePolyOnce(once);
}

// Generates coordinates of all key points on the beam
export function getCriticalCoords(
  beam: IBeam,
  customInspectX: number | null,
  eiSegments: IEISegment[],
  maxDeflX: number
): number[] {
  const N = beam.length;
  const criticalCoords = new Set<number>();
  criticalCoords.add(0);
  criticalCoords.add(N);
  
  beam.supports.forEach(s => {
    if (s.position >= 0 && s.position <= N) {
      criticalCoords.add(s.position);
    }
  });
  
  beam.loads.forEach(l => {
    if (l.position !== undefined && l.position >= 0 && l.position <= N) {
      criticalCoords.add(l.position);
    }
    if (l.startPosition !== undefined && l.startPosition >= 0 && l.startPosition <= N) {
      criticalCoords.add(l.startPosition);
    }
    if (l.endPosition !== undefined && l.endPosition >= 0 && l.endPosition <= N) {
      criticalCoords.add(l.endPosition);
    }
  });
  
  if (customInspectX !== null) {
    const clampedX = Math.max(0, Math.min(N, customInspectX));
    criticalCoords.add(clampedX);
  }
  
  eiSegments.forEach(seg => {
    if (seg.startPosition >= 0 && seg.startPosition <= N) {
      criticalCoords.add(seg.startPosition);
    }
    if (seg.endPosition >= 0 && seg.endPosition <= N) {
      criticalCoords.add(seg.endPosition);
    }
  });
  
  criticalCoords.add(maxDeflX);
  
  return Array.from(criticalCoords).sort((a, b) => a - b);
}

// Determines the label for a critical point coordinate
export function getCriticalLabel(
  x: number,
  N: number,
  maxDeflX: number,
  supports: { position: number }[],
  eiSegments: IEISegment[]
): string {
  if (x === 0) return 'Left End';
  if (x === N) return 'Right End';
  if (Math.abs(x - maxDeflX) < 1e-4) return 'Max Deflection';
  if (supports.some(s => Math.abs(s.position - x) < 1e-4)) return 'Support';
  if (eiSegments.some(seg => Math.abs(seg.startPosition - x) < 1e-4 || Math.abs(seg.endPosition - x) < 1e-4)) return 'Stiffness Joint';
  return 'Point';
}
