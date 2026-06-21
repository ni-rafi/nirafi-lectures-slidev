import React from 'react';
import { PlanLayoutSchema } from '../types/layoutSchema';
import { CrossSectionSpec } from '../types/sectionSchema';
import { useDrawingState } from '../hooks/useDrawingState';
import { PlanDrawingCanvas } from './PlanDrawingCanvas';
import { SectionDrawingCanvas } from './SectionDrawingCanvas';
import { DrawingControlPanel } from './DrawingControlPanel';

interface BuildingDrawingFeatureProps {
  initialLayout?: PlanLayoutSchema;
  initialSections?: CrossSectionSpec[];
  syncPrefix?: string;
}

// 1. High-fidelity default layout configurations
const defaultLayout: PlanLayoutSchema = {
  grid: {
    xAxes: [
      { id: 'A', offset: 100, label: 'A' },
      { id: 'B', offset: 250, label: 'B' },
      { id: 'C', offset: 400, label: 'C' },
    ],
    yAxes: [
      { id: '1', offset: 100, label: '1' },
      { id: '2', offset: 260, label: '2' },
    ],
  },
  columns: [
    { id: 'Col-A1', gridPlacement: { gridXId: 'A', gridYId: '1' }, width: 350, depth: 350, alignmentOffset: { x: 0, y: 0 } },
    { id: 'Col-B1', gridPlacement: { gridXId: 'B', gridYId: '1' }, width: 350, depth: 350, alignmentOffset: { x: 0, y: 0 } },
    { id: 'Col-C1', gridPlacement: { gridXId: 'C', gridYId: '1' }, width: 350, depth: 350, alignmentOffset: { x: 0, y: 0 } },
    { id: 'Col-B2', gridPlacement: { gridXId: 'B', gridYId: '2' }, width: 350, depth: 350, alignmentOffset: { x: 0, y: 0 } },
  ],
  beams: [
    {
      id: 'Beam-1',
      startNodeId: 'Col-A1',
      endNodeId: 'Col-B1',
      thickness: 18,
      highlights: [
        { startFraction: 0.0, endFraction: 0.5, strokeClass: 'stroke-destructive' },
      ],
    },
    { id: 'Beam-2', startNodeId: 'Col-B1', endNodeId: 'Col-C1', thickness: 18 },
    {
      id: 'Beam-3',
      startNodeId: 'Col-B1',
      endNodeId: 'Col-B2',
      thickness: 18,
      eccentricityOffset: 12, // shifted eccentric beam
      openings: [{ id: 'Door-1', relativeOffset: 0.45, clearanceWidth: 40, type: 'door' }],
    },
  ],
  slabs: [],
};

// 2. Default reinforcement cross section details matching layout components
const defaultSections: CrossSectionSpec[] = [
  {
    id: 'Col-A1',
    componentType: 'column',
    width: 350,
    depth: 350,
    clearCover: 40,
    longitudinalLayers: [
      { barDiameter: 20, count: 4, side: 'top' },
      { barDiameter: 20, count: 4, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 150 },
  },
  {
    id: 'Col-B1',
    componentType: 'column',
    width: 350,
    depth: 350,
    clearCover: 40,
    longitudinalLayers: [
      { barDiameter: 20, count: 4, side: 'top' },
      { barDiameter: 20, count: 4, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 150 },
  },
  {
    id: 'Col-C1',
    componentType: 'column',
    width: 350,
    depth: 350,
    clearCover: 40,
    longitudinalLayers: [
      { barDiameter: 20, count: 4, side: 'top' },
      { barDiameter: 20, count: 4, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 150 },
  },
  {
    id: 'Col-B2',
    componentType: 'column',
    width: 350,
    depth: 350,
    clearCover: 40,
    longitudinalLayers: [
      { barDiameter: 20, count: 4, side: 'top' },
      { barDiameter: 20, count: 4, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 150 },
  },
  {
    id: 'Beam-1',
    componentType: 'beam',
    width: 300,
    depth: 450,
    clearCover: 30,
    longitudinalLayers: [
      { barDiameter: 16, count: 2, side: 'top' },
      { barDiameter: 20, count: 3, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 200 },
  },
  {
    id: 'Beam-2',
    componentType: 'beam',
    width: 300,
    depth: 450,
    clearCover: 30,
    longitudinalLayers: [
      { barDiameter: 16, count: 2, side: 'top' },
      { barDiameter: 20, count: 3, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 200 },
  },
  {
    id: 'Beam-3',
    componentType: 'beam',
    width: 300,
    depth: 450,
    clearCover: 30,
    longitudinalLayers: [
      { barDiameter: 16, count: 2, side: 'top' },
      { barDiameter: 20, count: 3, side: 'bottom' },
    ],
    stirrups: { diameter: 8, spacing: 200 },
  },
];

export const BuildingDrawingFeature: React.FC<BuildingDrawingFeatureProps> = ({
  initialLayout = defaultLayout,
  initialSections = defaultSections,
  syncPrefix = 'building',
}) => {
  const {
    activeElementId,
    setActiveElementId,
    layoutSchema,
    setLayoutSchema,
    sectionSpecs,
    setSectionSpecs,
  } = useDrawingState(initialLayout, initialSections, syncPrefix);

  const activeSection = sectionSpecs.find(s => s.id === activeElementId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full h-full p-1 bg-background text-foreground">
      {/* Plan Workspace (60% equivalent layout) */}
      <div className="lg:col-span-7 flex flex-col h-full min-h-[380px]">
        <PlanDrawingCanvas
          schema={layoutSchema}
          activeElementId={activeElementId}
          onSelectElement={setActiveElementId}
          onChangeSchema={setLayoutSchema}
        />
      </div>

      {/* Control Panel and Section View (40% equivalent stack) */}
      <div className="lg:col-span-5 flex flex-col gap-4 overflow-y-auto max-h-[600px] lg:max-h-none">
        <DrawingControlPanel
          schema={layoutSchema}
          sections={sectionSpecs}
          activeElementId={activeElementId}
          onChangeSchema={setLayoutSchema}
          onChangeSections={setSectionSpecs}
        />

        {activeSection && (
          <div className="animate-[fadeIn_0.3s_ease-out]">
            <SectionDrawingCanvas spec={activeSection} isActive={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingDrawingFeature;
