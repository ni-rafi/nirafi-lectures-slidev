import { IBeam, IReaction, IIntervalEquation } from './types';

export function calculateGraphicalMethod(
  beam: IBeam,
  reactions: IReaction[],
  intervals: IIntervalEquation[]
): { steps: string[] } {
  const steps: string[] = [];

  steps.push(`### Graphical Method Calculation Steps`);
  steps.push(`The Graphical Method utilizes the integral relationships between Load, Shear Force, and Bending Moment.`);
  steps.push(`- **Shear Force:** $V(x_2) = V(x_1) - \\int_{x_1}^{x_2} w(x) \\, dx$ (Shear changes by the negative area of the load diagram).`);
  steps.push(`- **Bending Moment:** $M(x_2) = M(x_1) + \\int_{x_1}^{x_2} V(x) \\, dx$ (Moment changes by the area under the Shear Force Diagram).`);

  // Track values at boundaries
  let currentV = 0;
  let currentM = 0;

  steps.push(`\n#### 1. Shear Force Diagram (SFD) Steps`);
  steps.push(`- **Start ($x = 0$):** $V(0^-) = 0$`);

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
          steps.push(`- **Segment $x \\in [${prevX.toFixed(2)}, ${x.toFixed(2)}]$:** UDL/UVL Load Area = $${loadArea.toFixed(2)}\\text{ kN}$.`);
          steps.push(`  $$V(${x.toFixed(2)}^-) = V(${prevX.toFixed(2)}^+) - \\text{Load Area} = ${currentV.toFixed(2)} - ${loadArea.toFixed(2)} = ${nextV.toFixed(2)}\\text{ kN}$$`);
          currentV = nextV;
        } else {
          steps.push(`- **Segment $x \\in [${prevX.toFixed(2)}, ${x.toFixed(2)}]$:** No distributed load. $V(${x.toFixed(2)}^-) = V(${prevX.toFixed(2)}^+) = ${currentV.toFixed(2)}\\text{ kN}$.`);
        }
      }
    }

    // 2. Point forces / reactions at current x
    let pointForce = 0;
    let desc = '';

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
        }
      }
    });

    if (pointForce !== 0) {
      const nextV = currentV + pointForce;
      steps.push(`- **At $x = ${x.toFixed(2)}\\text{ m}$:** Concentrated force jump: ${desc}.`);
      steps.push(`  $$V(${x.toFixed(2)}^+) = V(${x.toFixed(2)}^-) + \\Delta V = ${currentV.toFixed(2)} + (${pointForce.toFixed(2)}) = ${nextV.toFixed(2)}\\text{ kN}$$`);
      currentV = nextV;
    }
  });

  steps.push(`\n#### 2. Bending Moment Diagram (BMD) Steps`);
  steps.push(`- **Start ($x = 0$):** $M(0^-) = 0$`);

  // Reset variables for BMD
  currentV = 0;
  currentM = 0;

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

          steps.push(`- **Segment $x \\in [${prevX.toFixed(2)}, ${x.toFixed(2)}]$:** Shear diagram area = $${shearArea.toFixed(2)}\\text{ kNm}$.`);
          steps.push(`  $$M(${x.toFixed(2)}^-) = M(${prevX.toFixed(2)}^+) + \\text{Shear Area} = ${currentM.toFixed(2)} + (${shearArea.toFixed(2)}) = ${nextM.toFixed(2)}\\text{ kNm}$$`);
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
      steps.push(`- **At $x = ${x.toFixed(2)}\\text{ m}$:** Concentrated moment jump: ${desc}.`);
      steps.push(`  $$M(${x.toFixed(2)}^+) = M(${x.toFixed(2)}^-) + \\Delta M = ${currentM.toFixed(2)} + (${jumpMoment.toFixed(2)}) = ${nextM.toFixed(2)}\\text{ kNm}$$`);
      currentM = nextM;
    }
  });

  return { steps };
}
