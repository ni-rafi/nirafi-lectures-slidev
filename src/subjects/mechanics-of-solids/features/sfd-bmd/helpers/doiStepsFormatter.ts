import { ICalculationStep } from '../types/stepTypes';
import { IBeam, IDOIResult } from '@/subjects/mechanics-of-solids/cores/sfd-bmd/types';

export function generateDoiStepsUI(doiResult: IDOIResult, beam: IBeam): ICalculationStep[] {
  const steps: ICalculationStep[] = [];

  beam.supports.forEach((s) => {
    if (!s) return;
    const pos = (s.position ?? 0).toFixed(2);
    let desc = '';
    if (s.type === 'roller') {
      desc = `Support Roller at $x = ${pos}\\text{ m}$: provides $1$ vertical reaction ($R_{y}$).`;
    } else if (s.type === 'hinge') {
      desc = `Support Hinge at $x = ${pos}\\text{ m}$: provides $2$ reactions ($R_x, R_y$).`;
    } else if (s.type === 'fixed') {
      desc = `Support Fixed at $x = ${pos}\\text{ m}$: provides $3$ reactions ($R_x, R_y, M$).`;
    }
    steps.push({
      id: `doi-support-${s.id}`,
      type: 'doi-support-reaction',
      text: desc,
      highlightX: s.position ?? 0,
      highlightSupportId: s.id,
    });
  });

  beam.releases.forEach((rel) => {
    if (!rel) return;
    const pos = (rel.position ?? 0).toFixed(2);
    let desc = '';
    if (rel.type === 'hinge') {
      desc = `Internal Hinge at $x = ${pos}\\text{ m}$: releases bending moment, providing $1$ equation of condition ($M = 0$).`;
    } else if (rel.type === 'roller') {
      desc = `Internal Roller at $x = ${pos}\\text{ m}$: releases bending moment and shear force, providing $2$ equations of condition ($M = 0, V = 0$).`;
    }
    steps.push({
      id: `doi-release-${rel.id}`,
      type: 'doi-release-condition',
      text: desc,
      highlightX: rel.position ?? 0,
      highlightReleaseId: rel.id,
    });
  });

  const { doi, reactionsCount: r, conditionsCount: c, isDeterminate, isUnstable, hasHorizontalRestraint } = doiResult;

  let classificationText = '';
  if (isUnstable) {
    classificationText = `Since $\\text{DOI} < 0$ or the beam lacks proper restraints, the structure is **statically unstable**.`;
  } else if (isDeterminate) {
    classificationText = `Since $\\text{DOI} = 0$, the structure is **statically determinate** and can be solved using equations of equilibrium.`;
  } else {
    classificationText = `Since $\\text{DOI} > 0$, the structure is **statically indeterminate** of degree $d = ${doi}$.`;
  }

  if (!hasHorizontalRestraint && beam.supports.length > 0) {
    steps.push({
      id: 'doi-unstable-horiz',
      type: 'doi-warning',
      text: `**Unstable support configuration:** No support provides horizontal restraint (requires at least one Hinge or Fixed support to prevent rigid-body translation).`,
    });
  }

  if (beam.supports.length === 0) {
    steps.push({
      id: 'doi-unstable-nosupp',
      type: 'doi-warning',
      text: `**Unstable support configuration:** The beam has no supports.`,
    });
  }

  steps.push({
    id: 'doi-summary',
    type: 'doi-summary',
    text: `Total unknown support reactions, $r = ${r}$.\nTotal equations of condition from internal releases, $c = ${c}$.\nDegree of Static Indeterminacy (DOI):\n\n${classificationText}`,
    latex: `\\text{DOI} = r - 3 - c = ${r} - 3 - ${c} = ${doi}`,
  });

  return steps;
}
