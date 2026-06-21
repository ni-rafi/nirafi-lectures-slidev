export interface ICalculationStep {
  id: string;          // Unique step identifier
  type: string;        // E.g. 'support-reactions', 'doi-summary', 'reaction-eq'
  text: string;        // Text to render (supports markdown-like bold/list parsing)
  latex?: string;      // LaTeX equation block to render under text
  highlightX?: number; // Position to highlight in SVG diagrams
  highlightSupportId?: string;
  highlightReleaseId?: string;
  metadata?: Record<string, unknown>;      // Any extra parameters needed by SVG visualizers
}
