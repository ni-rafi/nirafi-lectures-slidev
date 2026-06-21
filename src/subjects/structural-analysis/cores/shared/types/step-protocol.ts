import { IAnalysisStep } from '@/cores/shared/types/step-protocol';

export type StepType = 
  | 'CALCULATE_FEM' 
  | 'MATRIX_SETUP' 
  | 'MATRIX_INVERSION' 
  | 'DOI_KINEMATIC'
  | 'MEMBER_STIFFNESS_SETUP'
  | 'MDM_DF_SETUP'
  | 'MDM_CYCLE'
  | 'MDM_FINAL_MOMENTS'
  | 'SDM_EQUATIONS_SETUP'
  | 'SDM_EQUILIBRIUM_SETUP'
  | 'FORCE_PRIMARY_SETUP'
  | 'FORCE_COMPATIBILITY_SETUP';

export interface IFemPayload {
  memberId: string;
  loadType: 'POINT_CENTER' | 'POINT_ANY' | 'UDL_FULL' | 'UDL_PARTIAL' | 'SETTLEMENT';
  variables: {
    w?: number;
    P?: number;
    a?: number;
    b?: number;
    u?: number;
    v?: number;
    L: number;
    E?: number;
    I?: number;
    delta?: number;
  };
  results: {
    M_ab: number;
    M_ba: number;
  };
}

export interface IMemberStiffnessPayload {
  memberId: string;
  localMatrix: number[][];
  transformationMatrix: number[][];
  globalMatrix: number[][];
  dofMap: number[];
}

export interface IMatrixPayload {
  matrix: number[][];
  vectorF: number[];
  vectorD?: number[];
  labels?: string[];
}

export interface IDoiPayload {
  dki: number;
  nodesCount: number;
  restraintsCount: number;
  swayDegrees: number;
  rotationalDegrees: number;
  details: string[];
}

export interface IMdmDfSetupPayload {
  joints: {
    nodeId: string;
    members: {
      memberId: string;
      stiffness: number;
      df: number;
      farNodeId: string;
      farEndCondition: 'FIXED' | 'PINNED' | 'CANTILEVER' | 'CONTINUOUS';
    }[];
  }[];
}

export interface IMdmCyclePayload {
  cycleIndex: number;
  balances: {
    nodeId: string;
    unbalancedMoment: number;
    distributions: {
      memberId: string;
      distributedMoment: number;
    }[];
  }[];
  carryOvers: {
    fromMemberId: string;
    fromNodeId: string;
    toNodeId: string;
    moment: number;
  }[];
}

export interface IMdmFinalMomentsPayload {
  memberEndMoments: {
    memberId: string;
    startMoment: number;
    endMoment: number;
  }[];
}

export interface ISdmEquationsPayload {
  equations: {
    memberId: string;
    equations: {
      nearEnd: string;
      farEnd: string;
    };
  }[];
}

export interface ISdmEquilibriumPayload {
  equations: {
    nodeId: string;
    equation: string;
  }[];
}

export type ICalculateFemStep = IAnalysisStep<'CALCULATE_FEM', IFemPayload>;
export type IMemberStiffnessStep = IAnalysisStep<'MEMBER_STIFFNESS_SETUP', IMemberStiffnessPayload>;
export type IMatrixSetupStep = IAnalysisStep<'MATRIX_SETUP', IMatrixPayload>;
export type IMatrixInversionStep = IAnalysisStep<'MATRIX_INVERSION', IMatrixPayload>;
export type IDoiKinematicStep = IAnalysisStep<'DOI_KINEMATIC', IDoiPayload>;
export type IMdmDfSetupStep = IAnalysisStep<'MDM_DF_SETUP', IMdmDfSetupPayload>;
export type IMdmCycleStep = IAnalysisStep<'MDM_CYCLE', IMdmCyclePayload>;
export type IMdmFinalMomentsStep = IAnalysisStep<'MDM_FINAL_MOMENTS', IMdmFinalMomentsPayload>;
export type ISdmEquationsStep = IAnalysisStep<'SDM_EQUATIONS_SETUP', ISdmEquationsPayload>;
export type ISdmEquilibriumStep = IAnalysisStep<'SDM_EQUILIBRIUM_SETUP', ISdmEquilibriumPayload>;

export interface IForcePrimaryPayload {
  dsi: number;
  redundantReactions: {
    nodeId: string;
    reactionType: string;
  }[];
  primaryStructureDescription: string;
}

export interface IForceCompatibilityPayload {
  flexibilityMatrix: number[][];
  displacementVector0: number[];
  settlementVector?: number[];
  solvedRedundants: number[];
}

export type IForcePrimaryStep = IAnalysisStep<'FORCE_PRIMARY_SETUP', IForcePrimaryPayload>;
export type IForceCompatibilityStep = IAnalysisStep<'FORCE_COMPATIBILITY_SETUP', IForceCompatibilityPayload>;

export type IStructuralStep = 
  | ICalculateFemStep 
  | IMemberStiffnessStep
  | IMatrixSetupStep 
  | IMatrixInversionStep 
  | IDoiKinematicStep
  | IMdmDfSetupStep
  | IMdmCycleStep
  | IMdmFinalMomentsStep
  | ISdmEquationsStep
  | ISdmEquilibriumStep
  | IForcePrimaryStep
  | IForceCompatibilityStep;

