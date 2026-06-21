import { IStressState, ITransformedState, IPrincipalResult } from './stress.interface';

export class StressTransformationEngine {
  static transform(state: IStressState, thetaRad: number): ITransformedState {
    const { sigmaX, sigmaY, tauXY } = state;
    const cos2T = Math.cos(2 * thetaRad);
    const sin2T = Math.sin(2 * thetaRad);

    const avg = (sigmaX + sigmaY) / 2;
    const diff = (sigmaX - sigmaY) / 2;

    const sigmaXprime = avg + diff * cos2T + tauXY * sin2T;
    const sigmaYprime = avg - diff * cos2T - tauXY * sin2T;
    const tauXYprime = -diff * sin2T + tauXY * cos2T;

    return {
      sigmaX: sigmaXprime,
      sigmaY: sigmaYprime,
      tauXY: tauXYprime,
      theta: thetaRad,
    };
  }

  static calculatePrincipal(state: IStressState): IPrincipalResult {
    const { sigmaX, sigmaY, tauXY } = state;
    const avg = (sigmaX + sigmaY) / 2;
    const diff = (sigmaX - sigmaY) / 2;

    const R = Math.sqrt(diff * diff + tauXY * tauXY);

    const sigma1 = avg + R;
    const sigma2 = avg - R;
    const tauMax = R;

    // Principal angle theta_p (rad)
    // tan(2*theta_p) = 2*tau_xy / (sigma_x - sigma_y)
    const thetaP = 0.5 * Math.atan2(2 * tauXY, sigmaX - sigmaY);

    // Max shear angle theta_s (rad)
    const thetaS = thetaP - Math.PI / 4;

    return {
      sigma1,
      sigma2,
      tauMax,
      thetaP,
      thetaS,
    };
  }

  public static formatMPa(val: number): string {
    // Converts Pa to MPa and rounds to 3 decimal places
    return (val / 1e6).toFixed(3);
  }
}

