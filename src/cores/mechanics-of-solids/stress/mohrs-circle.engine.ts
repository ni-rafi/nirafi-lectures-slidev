import { IStressState } from './stress.interface';
import { StressTransformationEngine } from './stress-transformation.engine';

export class MohrsCircleEngine {
  static solveCircle(
    state: IStressState,
    thetaRad: number
  ): {
    center: number; // Center on normal stress axis (Pa)
    radius: number; // Radius (Pa)
    pointA: { x: number; y: number }; // Original state point A (sigma_x, -tau_xy)
    pointB: { x: number; y: number }; // Original state point B (sigma_y, tau_xy)
    pointAPrime: { x: number; y: number }; // Rotated point A' (sigma_x', -tau_x'y')
    pointBPrime: { x: number; y: number }; // Rotated point B' (sigma_y', tau_x'y')
    steps: string[];
  } {
    const { sigmaX, sigmaY, tauXY } = state;
    const principal = StressTransformationEngine.calculatePrincipal(state);
    const transformed = StressTransformationEngine.transform(state, thetaRad);

    const center = (sigmaX + sigmaY) / 2;
    const radius = principal.tauMax;

    // Reference point A is (sigma_x, -tau_xy), point B is (sigma_y, tau_xy)
    const pointA = { x: sigmaX, y: -tauXY };
    const pointB = { x: sigmaY, y: tauXY };

    // Rotated point A' is (sigma_x', -tau_x'y'), point B' is (sigma_y', tau_x'y')
    const pointAPrime = { x: transformed.sigmaX, y: -transformed.tauXY };
    const pointBPrime = { x: transformed.sigmaY, y: transformed.tauXY };

    const format = (val: number) => (val / 1e6).toFixed(3);
    const radToDeg = (r: number) => (r * 180 / Math.PI).toFixed(1);

    const steps: string[] = [];
    steps.push(`### Mohr's Circle Method Construction Steps`);
    steps.push(`Mohr's Circle graphically represents 2D stress transformations as a circle in the $\\sigma$-$\\tau$ coordinate system:`);

    steps.push(`#### Step 1: Locate the Center of the circle`);
    steps.push(`The center $C$ is on the normal stress axis (horizontal) at the average stress:`);
    steps.push(`$C = \\left(\\sigma_{\\text{avg}}, 0\\right) = \\left(\\frac{\\sigma_x + \\sigma_y}{2}, 0\\right) = \\left(${format(center)}, 0\\right)\\text{ MPa}$`);

    steps.push(`#### Step 2: Plot reference points A and B`);
    steps.push(`- Reference point $A$ (represents the x-face stress state): $A(\\sigma_x, -\\tau_{xy}) = A(${format(sigmaX)}, ${format(-tauXY)})\\text{ MPa}$`);
    steps.push(`- Reference point $B$ (represents the y-face stress state): $B(\\sigma_y, \\tau_{xy}) = B(${format(sigmaY)}, ${format(tauXY)})\\text{ MPa}$`);

    steps.push(`#### Step 3: Calculate the Radius (Max Shear Stress)`);
    steps.push(`The radius $R$ is the distance from Center $C$ to point $A$:`);
    steps.push(`$R = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2} = \\sqrt{${format((sigmaX - sigmaY) / 2)}^2 + ${format(tauXY)}^2} = ${format(radius)}\\text{ MPa}$`);

    steps.push(`#### Step 4: Draw the circle and identify principal stresses`);
    steps.push(`Drawing the circle centered at $C$ with radius $R$, the intersection points with the horizontal $\\sigma$-axis represent the principal stresses (where shear stress $\\tau = 0$):`);
    steps.push(`- Max principal stress: $\\sigma_1 = C + R = ${format(center + radius)}\\text{ MPa}$`);
    steps.push(`- Min principal stress: $\\sigma_2 = C - R = ${format(center - radius)}\\text{ MPa}$`);

    steps.push(`#### Step 5: Rotate coordinates by $2\\theta = ${radToDeg(2 * thetaRad)}^\\circ$`);
    steps.push(`In Mohr's Circle, physical rotations of angle $\\theta$ correspond to double angle $2\\theta$ rotations in the opposite direction. Rotating the diameter line $AB$ about Center $C$ by $2\\theta = ${radToDeg(2 * thetaRad)}^\\circ$ yields the new transformed coordinates:`);
    steps.push(`- Point $A'(\\sigma_{x'}, -\\tau_{x'y'}) = A'(${format(transformed.sigmaX)}, ${format(-transformed.tauXY)})\\text{ MPa}$`);
    steps.push(`- Point $B'(\\sigma_{y'}, \\tau_{x'y'}) = B'(${format(transformed.sigmaY)}, ${format(transformed.tauXY)})\\text{ MPa}$`);

    return {
      center,
      radius,
      pointA,
      pointB,
      pointAPrime,
      pointBPrime,
      steps,
    };
  }
}
