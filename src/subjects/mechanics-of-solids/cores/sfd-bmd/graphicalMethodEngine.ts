import { IBeam, IReaction, IIntervalEquation, IGraphicalStepData } from './types';

export function calculateGraphicalMethod(
  beam: IBeam,
  reactions: IReaction[],
  intervals: IIntervalEquation[]
): { graphicalSteps: IGraphicalStepData[] } {
  const graphicalSteps: IGraphicalStepData[] = [];

  // Track values at boundaries
  let currentV = 0;

  graphicalSteps.push({ type: 'sfd-start', x: 0, v: 0 });

  // Find all critical points in order
  const points = new Set<number>();
  points.add(0);
  points.add(beam.length);
  beam.supports.forEach(s => points.add(s.position));
  beam.releases.forEach(r => points.add(r.position));
  beam.loads.forEach(l => {
    if (l.position !== undefined) points.add(l.position);
    if (l.startPosition !== undefined) points.add(l.startPosition);
    if (l.endPosition !== undefined) points.add(l.endPosition);
  });

  const sortedPoints = Array.from(points).sort((a, b) => a - b);

  sortedPoints.forEach((x, idx) => {
    // 1. Calculate change in shear from previous point due to distributed loads
    if (idx > 0) {
      const prevX = sortedPoints[idx - 1];
      if (prevX !== undefined) {
        // Calculate distributed load on this segment
        let loadArea = 0;
        beam.loads.forEach(load => {
          if (load.type === 'udl') {
            const s = load.startPosition ?? 0;
            const e = load.endPosition ?? 0;
            const mag = load.magnitude ?? 0;
            const overlap = Math.max(0, Math.min(e, x) - Math.max(s, prevX));
            loadArea += mag * overlap;
          } else if (load.type === 'uvl') {
            const s = load.startPosition ?? 0;
            const e = load.endPosition ?? 0;
            const w1 = load.startMagnitude ?? 0;
            const w2 = load.endMagnitude ?? 0;
            if (x > s && prevX < e) {
              const startLimit = Math.max(s, prevX);
              const endLimit = Math.min(e, x);
              const l = e - s;
              const h1 = w1 + ((w2 - w1) * (startLimit - s)) / l;
              const h2 = w1 + ((w2 - w1) * (endLimit - s)) / l;
              loadArea += 0.5 * (h1 + h2) * (endLimit - startLimit);
            }
          }
        });

        if (loadArea !== 0) {
          const nextV = currentV - loadArea;
          graphicalSteps.push({
            type: 'sfd-segment',
            startX: prevX,
            endX: x,
            loadArea,
            vStart: currentV,
            vEnd: nextV,
          });
          currentV = nextV;
        } else {
          graphicalSteps.push({
            type: 'sfd-segment',
            startX: prevX,
            endX: x,
            loadArea: 0,
            vStart: currentV,
            vEnd: currentV,
          });
        }
      }
    }

    // 2. Point forces / reactions at current x
    let pointForce = 0;
    let desc = '';
    let hasSupport = false;

    // Point loads
    beam.loads.forEach(load => {
      if (load.type === 'point' && Math.abs((load.position ?? 0) - x) < 1e-9) {
        pointForce -= (load.magnitude ?? 0);
        desc += `${desc ? ' + ' : ''}Point Load (-${(load.magnitude ?? 0).toFixed(2)})`;
      }
    });

    // Support reactions
    reactions.forEach(r => {
      if (r.type === 'R_y') {
        const support = beam.supports.find(s => s.id === r.supportId);
        if (support && Math.abs(support.position - x) < 1e-9) {
          pointForce += r.value;
          desc += `${desc ? ' + ' : ''}Reaction $R_{y}$ (+${r.value.toFixed(2)})`;
          hasSupport = true;
        }
      }
    });

    if (pointForce !== 0) {
      const nextV = currentV + pointForce;
      graphicalSteps.push({
        type: 'sfd-jump',
        x,
        jump: pointForce,
        vStart: currentV,
        vEnd: nextV,
        description: desc,
        source: hasSupport ? 'support' : 'point-load',
      });
      currentV = nextV;
    }
  });

  graphicalSteps.push({ type: 'bmd-start', x: 0, m: 0 });

  // Reset variables for BMD
  let currentM = 0;

  sortedPoints.forEach((x, idx) => {
    // 1. Calculate change in moment from previous point due to area of Shear Diagram
    if (idx > 0) {
      const prevX = sortedPoints[idx - 1];
      if (prevX !== undefined) {
        const interval = intervals.find(inv => Math.abs(inv.startX - prevX) < 1e-9 && Math.abs(inv.endX - x) < 1e-9);

        if (interval) {
          // Integrate V(x) = a*x^2 + b*x + c over [prevX, x]
          const [a, b, c] = interval.vCoeffs;
          
          const F = (val: number) => (a / 3) * Math.pow(val, 3) + (b / 2) * Math.pow(val, 2) + c * val;
          const shearArea = F(x) - F(prevX);
          const nextM = currentM + shearArea;

          graphicalSteps.push({
            type: 'bmd-segment',
            startX: prevX,
            endX: x,
            shearArea,
            mStart: currentM,
            mEnd: nextM,
          });
          currentM = nextM;
        }
      }
    }

    // 2. Concentrated moments / reactions at current x
    let jumpMoment = 0;
    let desc = '';

    // Concentrated moments
    beam.loads.forEach(load => {
      if (load.type === 'moment' && Math.abs((load.position ?? 0) - x) < 1e-9) {
        const mag = load.magnitude ?? 0;
        jumpMoment += mag;
        desc += `${desc ? ' + ' : ''}Moment Load (+${mag.toFixed(2)})`;
      }
    });

    // Fixed support reaction moments
    reactions.forEach(r => {
      if (r.type === 'M') {
        const support = beam.supports.find(s => s.id === r.supportId);
        if (support && Math.abs(support.position - x) < 1e-9) {
          jumpMoment -= r.value; // jump direction is opposite to sign convention
          desc += `${desc ? ' + ' : ''}Reaction Moment $M$ (-${r.value.toFixed(2)})`;
        }
      }
    });

    if (jumpMoment !== 0) {
      const nextM = currentM + jumpMoment;
      graphicalSteps.push({
        type: 'bmd-jump',
        x,
        jump: jumpMoment,
        mStart: currentM,
        mEnd: nextM,
        description: desc,
        source: 'moment-load',
      });
      currentM = nextM;
    }
  });

  return { graphicalSteps };
}

