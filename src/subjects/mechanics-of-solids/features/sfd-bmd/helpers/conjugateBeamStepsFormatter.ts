import { ICalculationStep } from '../types/stepTypes';
import { IConjugateBeamDetails } from '@/subjects/mechanics-of-solids/cores/deflection/types';
import { IBeam } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';

export function generateConjugateBeamStepsUI(conjugateBeam: IConjugateBeamDetails, beam: IBeam): ICalculationStep[] {
  const steps: ICalculationStep[] = [];
  const N = beam.length;

  steps.push({
    id: 'cb-intro',
    type: 'cb-intro',
    text: `### Conjugate Beam Method Calculation Steps\n\nThe Conjugate Beam Method transforms the real beam into an auxiliary conjugate beam:\n\n- **Conjugate Load:** Loaded with the $M/EI$ diagram.\n- **Conjugate Shear ($V_{conj}$):** Equals the real slope ($\\theta = V_{conj}$).\n- **Conjugate Moment ($M_{conj}$):** Equals the real deflection ($v = M_{conj}$).`,
  });

  steps.push({
    id: 'cb-transform-header',
    type: 'cb-header',
    text: `#### Step 1: Conjugate support transformations`,
  });

  // Generate transformation descriptions dynamically
  const supportPositions = new Set<number>();
  beam.supports.forEach(s => supportPositions.add(s.position));
  const internalSupports = beam.supports.filter(s => s.position > 0 && s.position < N);

  // Left end support
  const leftSupport = beam.supports.find(s => s.position === 0);
  if (leftSupport) {
    if (leftSupport.type === 'fixed') {
      steps.push({
        id: 'cb-t-left',
        type: 'cb-transformation',
        text: `- Real **Fixed support** at $x = 0$ becomes a **Free end** on the conjugate beam.`,
        highlightX: 0,
      });
    } else {
      steps.push({
        id: 'cb-t-left',
        type: 'cb-transformation',
        text: `- Real **Hinged/Roller support** at $x = 0$ remains a **Hinged/Roller support** on the conjugate beam.`,
        highlightX: 0,
      });
    }
  } else {
    steps.push({
      id: 'cb-t-left',
      type: 'cb-transformation',
      text: `- Real **Free end** at $x = 0$ becomes a **Fixed support** on the conjugate beam.`,
      highlightX: 0,
    });
  }

  // Right end support
  const rightSupport = beam.supports.find(s => s.position === N);
  const nVal = N ?? 0;
  if (rightSupport) {
    if (rightSupport.type === 'fixed') {
      steps.push({
        id: 'cb-t-right',
        type: 'cb-transformation',
        text: `- Real **Fixed support** at $x = ${nVal.toFixed(2)}$ becomes a **Free end** on the conjugate beam.`,
        highlightX: N,
      });
    } else {
      steps.push({
        id: 'cb-t-right',
        type: 'cb-transformation',
        text: `- Real **Hinged/Roller support** at $x = ${nVal.toFixed(2)}$ remains a **Hinged/Roller support** on the conjugate beam.`,
        highlightX: N,
      });
    }
  } else {
    steps.push({
      id: 'cb-t-right',
      type: 'cb-transformation',
      text: `- Real **Free end** at $x = ${nVal.toFixed(2)}$ becomes a **Fixed support** on the conjugate beam.`,
      highlightX: N,
    });
  }

  // Internal supports and releases mapping
  internalSupports.forEach(s => {
    if (!s) return;
    const pos = s.position ?? 0;
    steps.push({
      id: `cb-t-int-${s.id}`,
      type: 'cb-transformation',
      text: `- Real **Internal support** at $x = ${pos.toFixed(2)}$ becomes an **Internal hinge** on the conjugate beam (forcing moment $M_{conj} = 0$).`,
      highlightX: pos,
    });
  });

  beam.releases.forEach(r => {
    if (!r) return;
    const pos = r.position ?? 0;
    steps.push({
      id: `cb-t-rel-${r.id}`,
      type: 'cb-transformation',
      text: `- Real **Internal hinge** at $x = ${pos.toFixed(2)}$ becomes an **Internal support** (roller/pin) on the conjugate beam (allowing shear $V_{conj}$ jump).`,
      highlightX: pos,
    });
  });

  steps.push({
    id: 'cb-reactions-header',
    type: 'cb-header',
    text: `#### Step 2: Calculate conjugate beam reactions\n\nConjugate reactions are solved directly from the solved slopes and deflections:`,
  });

  conjugateBeam.reactions.forEach((rx, idx) => {
    if (!rx) return;
    let rxText = '';
    let pos = 0;
    const rxValue = rx.value ?? 0;
    if (rx.supportId === 'conj-left-force' || rx.supportId === 'conj-left-moment') {
      pos = 0;
      rxText = rx.type === 'M'
        ? `Conjugate **Fixed support** at $x = 0$:\n  - Reaction moment: $M_{conj} = v(0) = ${rxValue.toFixed(6)}\\text{ m}$`
        : `Conjugate **Fixed support** at $x = 0$:\n  - Vertical reaction force: $R_{y, conj} = \\theta(0) = ${rxValue.toFixed(6)}\\text{ rad}$`;
    } else if (rx.supportId === 'conj-right-force' || rx.supportId === 'conj-right-moment') {
      pos = N ?? 0;
      rxText = rx.type === 'M'
        ? `Conjugate **Fixed support** at $x = ${nVal.toFixed(2)}$:\n  - Reaction moment: $M_{conj} = -v(L) = ${rxValue.toFixed(6)}\\text{ m}$`
        : `Conjugate **Fixed support** at $x = ${nVal.toFixed(2)}$:\n  - Vertical reaction force: $R_{y, conj} = -\\theta(L) = ${rxValue.toFixed(6)}\\text{ rad}$`;
    } else if (rx.supportId.startsWith('conj-internal-')) {
      const releaseIdx = parseInt(rx.supportId.replace('conj-internal-', ''), 10);
      const rel = beam.releases[releaseIdx];
      pos = rel ? (rel.position ?? 0) : 0;
      rxText = `Conjugate **Internal support** at $x = ${pos.toFixed(2)}$:\n  - Vertical reaction (slope jump): $R_{y, conj} = \\theta(${pos.toFixed(2)}) = ${rxValue.toFixed(6)}\\text{ rad}$`;
    } else {
      const realSupport = beam.supports.find(s => s.id === rx.supportId);
      pos = realSupport ? (realSupport.position ?? 0) : 0;
      rxText = `Conjugate **Hinged/Roller support** at $x = ${pos.toFixed(2)}$:\n  - Vertical reaction force: $R_{y, conj} = \\theta(${pos.toFixed(2)}) = ${rxValue.toFixed(6)}\\text{ rad}$`;
    }

    steps.push({
      id: `cb-rx-${idx}`,
      type: 'cb-reaction',
      text: `- ${rxText}`,
      highlightX: pos,
    });
  });

  steps.push({
    id: 'cb-shear-header',
    type: 'cb-header',
    text: `#### Step 3: Determine conjugate shear and moment\n\nThe shear diagram on the conjugate beam represents the slope curve $\\theta(x)$, and the bending moment diagram represents the deflection curve $v(x)$.`,
  });

  return steps;
}
