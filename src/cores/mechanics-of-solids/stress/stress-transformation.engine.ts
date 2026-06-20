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

  static generateSteps(state: IStressState, inspectAngleRad: number): string[] {
    const { sigmaX, sigmaY, tauXY } = state;
    const principal = this.calculatePrincipal(state);
    const transformed = this.transform(state, inspectAngleRad);

    const radToDeg = (r: number) => (r * 180 / Math.PI).toFixed(1);

    const steps: string[] = [];
    steps.push(`### Stress Transformation Analytical Steps`);

    steps.push(`#### Step 1: Identify the original stress state`);
    steps.push(`From the beam internal loading at the inspected point:`);
    steps.push(`- Normal stress in x-direction: $\\sigma_x = ${this.formatMPa(sigmaX)}\\text{ MPa}$`);
    steps.push(`- Normal stress in y-direction: $\\sigma_y = ${this.formatMPa(sigmaY)}\\text{ MPa}$`);
    steps.push(`- Shear stress in xy-plane: $\\tau_{xy} = ${this.formatMPa(tauXY)}\\text{ MPa}$`);

    steps.push(`#### Step 2: Calculate average and differential normal stresses`);
    const avg = (sigmaX + sigmaY) / 2;
    const diff = (sigmaX - sigmaY) / 2;
    steps.push(`- Average normal stress: $\\sigma_{\\text{avg}} = \\frac{\\sigma_x + \\sigma_y}{2} = \\frac{${this.formatMPa(sigmaX)} + ${this.formatMPa(sigmaY)}}{2} = ${this.formatMPa(avg)}\\text{ MPa}$`);
    steps.push(`- Differential normal stress: $\\sigma_{\\text{diff}} = \\frac{\\sigma_x - \\sigma_y}{2} = ${this.formatMPa(diff)}\\text{ MPa}$`);

    steps.push(`#### Step 3: Calculate principal stresses and max shear stress`);
    const R = Math.sqrt(diff * diff + tauXY * tauXY);
    steps.push(`- Maximum shear stress (Mohr's radius): $R = \\tau_{\\text{max}} = \\sqrt{\\left(\\frac{\\sigma_x - \\sigma_y}{2}\\right)^2 + \\tau_{xy}^2}$`);
    steps.push(`  $R = \\sqrt{${this.formatMPa(diff)}^2 + ${this.formatMPa(tauXY)}^2} = ${this.formatMPa(R)}\\text{ MPa}$`);
    steps.push(`- Maximum principal stress: $\\sigma_1 = \\sigma_{\\text{avg}} + R = ${this.formatMPa(avg)} + ${this.formatMPa(R)} = ${this.formatMPa(principal.sigma1)}\\text{ MPa}$`);
    steps.push(`- Minimum principal stress: $\\sigma_2 = \\sigma_{\\text{avg}} - R = ${this.formatMPa(avg)} - ${this.formatMPa(R)} = ${this.formatMPa(principal.sigma2)}\\text{ MPa}$`);

    steps.push(`#### Step 4: Calculate plane orientations`);
    steps.push(`- Principal plane angle: $\\theta_p = \\frac{1}{2} \\tan^{-1}\\left(\\frac{2\\tau_{xy}}{\\sigma_x - \\sigma_y}\\right) = ${radToDeg(principal.thetaP)}^\\circ$`);
    steps.push(`- Maximum shear plane angle: $\\theta_s = \\theta_p - 45^\\circ = ${radToDeg(principal.thetaS)}^\\circ$`);

    steps.push(`#### Step 5: Transformed stresses at selected angle $\\theta = ${radToDeg(inspectAngleRad)}^\\circ$`);
    steps.push(`- Transformed normal stress $\\sigma_{x'} = \\sigma_{\\text{avg}} + \\sigma_{\\text{diff}}\\cos(2\\theta) + \\tau_{xy}\\sin(2\\theta) = ${this.formatMPa(transformed.sigmaX)}\\text{ MPa}$`);
    steps.push(`- Transformed normal stress $\\sigma_{y'} = \\sigma_{\\text{avg}} - \\sigma_{\\text{diff}}\\cos(2\\theta) - \\tau_{xy}\\sin(2\\theta) = ${this.formatMPa(transformed.sigmaY)}\\text{ MPa}$`);
    steps.push(`- Transformed shear stress $\\tau_{x'y'} = -\\sigma_{\\text{diff}}\\sin(2\\theta) + \\tau_{xy}\\cos(2\\theta) = ${this.formatMPa(transformed.tauXY)}\\text{ MPa}$`);

    return steps;
  }

  private static formatMPa(val: number): string {
    // Converts Pa to MPa and rounds to 3 decimal places
    return (val / 1e6).toFixed(3);
  }
}
