export type CrossSectionType =
  | 'custom'
  | 'rectangular'
  | 'circular'
  | 'i-beam'
  | 't-beam'
  | 'channel';

export interface ICrossSection {
  type: CrossSectionType;
  // Dimensions in meters (SI base units)
  width?: number;                 // b for rectangular, bf for i-beam/t-beam/channel (top flange)
  height?: number;                // h for rectangular, total depth d for i-beam/t-beam/channel
  thicknessWeb?: number;          // tw for i-beam/t-beam/channel
  thicknessFlange?: number;       // tf for i-beam/t-beam/channel (top flange)
  diameter?: number;              // d for circular
  widthBottom?: number;           // bf_bottom for asymmetric i-beam/channel
  thicknessFlangeBottom?: number; // tf_bottom for asymmetric i-beam/channel
}

export interface IStressState {
  sigmaX: number; // Normal stress in x-direction (Pa)
  sigmaY: number; // Normal stress in y-direction (Pa)
  tauXY: number;  // Shear stress on xy-plane (Pa)
}

export interface IStressPoint {
  y: number;     // Position relative to neutral axis (m)
  sigma: number; // Bending stress (Pa)
  tau: number;   // Shear stress (Pa)
}

export interface IPrincipalResult {
  sigma1: number;  // Max principal stress (Pa)
  sigma2: number;  // Min principal stress (Pa)
  tauMax: number;  // Max in-plane shear stress (Pa)
  thetaP: number;  // Principal angle (rad)
  thetaS: number;  // Max shear angle (rad)
}

export interface ITransformedState extends IStressState {
  theta: number;   // Rotation angle (rad)
}

export interface IStressTransformationResult {
  originalState: IStressState;
  transformedState: ITransformedState;
  principal: IPrincipalResult;
  analyticalSteps: string[];
  mohrsCircle: {
    center: number; // Center coordinate on sigma axis (Pa)
    radius: number; // Radius of Mohr's circle (Pa)
    steps: string[];
  };
}
