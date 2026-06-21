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

    return {
      center,
      radius,
      pointA,
      pointB,
      pointAPrime,
      pointBPrime,
    };
  }
}

