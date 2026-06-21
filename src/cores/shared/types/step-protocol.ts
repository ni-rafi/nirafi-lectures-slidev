export interface IAnalysisStep<T extends string, P> {
  stepId: string;
  type: T;
  payload: P;
  highlightNodes?: string[];
  highlightMembers?: string[];
}
