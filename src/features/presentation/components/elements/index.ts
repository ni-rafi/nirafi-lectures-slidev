// Layout & content slide elements
export { SlideParagraph } from './SlideParagraph';
export { SlideBullet } from './SlideBullet';
export { SlideEquation } from './SlideEquation';
export { SlideList, type SlideListRevealMode } from './SlideList';
export { SlideTwoColumns, type SlideTwoColumnsRatio, type SlideTwoColumnsAlign } from './SlideTwoColumns';
export { SlideGrid, type SlideGridCols } from './SlideGrid';
export { SlideQuote } from './SlideQuote';
export { SlideImage } from './SlideImage';
export { SlideTimeline, type SlideTimelineRevealMode } from './SlideTimeline';
export { MeasurementTimelineCanvas } from './MeasurementTimelineCanvas';
export { SlideStepProgress, type SlideStepProgressVariant } from './SlideStepProgress';
export { SlideCompare, type SlideCompareHighlight } from './SlideCompare';
export { SlideBadge, type SlideBadgeVariant } from './SlideBadge';
export { SlideCallout, type SlideCalloutVariant } from './SlideCallout';
export { SlideContent, type ContentBlockType } from './SlideContent';
export { SlideTable } from './SlideTable';
export { SlideVisualCanvas } from './SlideVisualCanvas';

// Click-step reveal & highlight elements
export { ClickReveal, type SlideRevealPreset } from './ClickReveal';
export { ClickRevealGroup } from './ClickRevealGroup';
export { ClickHighlight, type HighlightVariant } from './ClickHighlight';
export { HoverTooltip } from './HoverTooltip';
export { ClickSyncedTabs, type ClickSyncedTabItem } from './ClickSyncedTabs';

// Code & formula elements
export { CodeBlock } from './CodeBlock';
export { CodePlayground } from './CodePlayground';
export { CodeMagicMove } from './CodeMagicMove';
export { LatexFormula } from './LatexFormula';
export { MermaidDiagram } from './MermaidDiagram';
export { FormulaBreakdown, type FormulaStep } from './FormulaBreakdown';

// Interactive calculation elements
export { InteractiveCard } from './InteractiveCard';
export { ParameterSlider } from './ParameterSlider';
export { ParameterInputCard } from './ParameterInputCard';
export { CalculationOutput } from './CalculationOutput';

// Visual & shape elements
export { SlideIcon } from './SlideIcon';
export { ShapeMorph } from './ShapeMorph';
export { PhysicsSandbox } from './PhysicsSandbox';
export type { ShapeMorphProps } from './ShapeMorph';

// Dimension & beam annotation elements
export { SlideDimensionLines } from './SlideDimensionLines';
export { BeamLoads } from './BeamLoads';
export { BeamSupports } from './BeamSupports';

// Pure utility helpers
export { samplePolygon, getShapePoints, getShapePath, resamplePath, type Point2D } from './shapeUtils';
export { createPhysicsBody, getConnectorPath, type ShapeData, type ConnectorData } from './physicsHelpers';
