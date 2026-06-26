import { IBeam, IDOIResult } from './types';

export function calculateDOI(beam: IBeam): IDOIResult {
  let r = 0;
  const steps: string[] = [];

  beam.supports.forEach(s => {
    let count = 0;
    if (s.type === 'roller') {
      count = 1;
      steps.push(`Support Roller at $x = ${s.position.toFixed(2)}\\text{ m}$: provides $1$ vertical reaction ($R_{y}$).`);
    } else if (s.type === 'hinge') {
      count = 2;
      steps.push(`Support Hinge at $x = ${s.position.toFixed(2)}\\text{ m}$: provides $2$ reactions ($R_x, R_y$).`);
    } else if (s.type === 'fixed') {
      count = 3;
      steps.push(`Support Fixed at $x = ${s.position.toFixed(2)}\\text{ m}$: provides $3$ reactions ($R_x, R_y, M$).`);
    }
    r += count;
  });

  // Calculate equations of condition from internal releases
  let c = 0;
  beam.releases.forEach(rel => {
    if (rel.type === 'hinge') {
      c += 1;
      steps.push(`Internal Hinge at $x = ${rel.position.toFixed(2)}\\text{ m}$: releases bending moment, providing $1$ equation of condition ($M = 0$).`);
    } else if (rel.type === 'roller') {
      c += 2;
      steps.push(`Internal Roller at $x = ${rel.position.toFixed(2)}\\text{ m}$: releases bending moment and shear force, providing $2$ equations of condition ($M = 0, V = 0$).`);
    }
  });

  const doi = r - 3 - c;

  steps.push(`Total unknown support reactions, $r = ${r}$.`);
  steps.push(`Total equations of condition from internal releases, $c = ${c}$.`);
  steps.push(`Degree of Static Indeterminacy (DOI):`);
  steps.push(`$$\\text{DOI} = r - 3 - c = ${r} - 3 - ${c} = ${doi}$$`);

  let isUnstable = doi < 0;
  let isDeterminate = doi === 0;
  let isIndeterminate = doi > 0;

  // Check for horizontal stability
  const hasHorizontalRestraint = beam.supports.some(s => s.type === 'hinge' || s.type === 'fixed');
  if (!hasHorizontalRestraint && beam.supports.length > 0) {
    isUnstable = true;
    isDeterminate = false;
    isIndeterminate = false;
    steps.push(`**Unstable support configuration:** No support provides horizontal restraint (requires at least one Hinge or Fixed support to prevent rigid-body translation).`);
  }

  // Check for vertical/rotational stability (mechanism detection)
  let rVert = 0;
  beam.supports.forEach(s => {
    if (s.type === 'roller' || s.type === 'hinge') {
      rVert += 1;
    } else if (s.type === 'fixed') {
      rVert += 2;
    }
  });
  const eqVert = 2 + c;
  if (rVert < eqVert && beam.supports.length > 0) {
    isUnstable = true;
    isDeterminate = false;
    isIndeterminate = false;
    steps.push(`**Unstable support/release configuration:** The structure is vertically unstable (a mechanism). It has only ${rVert} vertical/rotational reaction components to satisfy ${eqVert} equations of equilibrium and condition (e.g. flat three-hinged arch).`);
  }

  // Check if there are no supports at all
  if (beam.supports.length === 0) {
    isUnstable = true;
    isDeterminate = false;
    isIndeterminate = false;
    steps.push(`**Unstable support configuration:** The beam has no supports.`);
  }

  if (isUnstable) {
    steps.push(`Since $\\text{DOI} < 0$ or the beam lacks proper restraints, the structure is **statically unstable**.`);
  } else if (isDeterminate) {
    steps.push(`Since $\\text{DOI} = 0$, the structure is **statically determinate** and can be solved using equations of equilibrium.`);
  } else {
    steps.push(`Since $\\text{DOI} > 0$, the structure is **statically indeterminate** of degree $d = ${doi}$.`);
  }

  return {
    doi,
    reactionsCount: r,
    conditionsCount: c,
    isDeterminate,
    isIndeterminate,
    isUnstable,
    hasHorizontalRestraint,
    explanationSteps: steps,
  };
}

