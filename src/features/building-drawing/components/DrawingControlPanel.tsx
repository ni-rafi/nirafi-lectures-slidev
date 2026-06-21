import React, { useState } from 'react';
import { PlanLayoutSchema, PlanColumn, PlanBeam } from '../types/layoutSchema';
import { CrossSectionSpec } from '../types/sectionSchema';

interface DrawingControlPanelProps {
  schema: PlanLayoutSchema;
  sections: CrossSectionSpec[];
  activeElementId: string;
  onChangeSchema: (schema: PlanLayoutSchema) => void;
  onChangeSections: (sections: CrossSectionSpec[]) => void;
}

export const DrawingControlPanel: React.FC<DrawingControlPanelProps> = ({
  schema,
  sections,
  activeElementId,
  onChangeSchema,
  onChangeSections,
}) => {
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState(JSON.stringify(schema, null, 2));

  const activeCol = schema.columns.find(c => c.id === activeElementId);
  const activeBeam = schema.beams.find(b => b.id === activeElementId);
  const activeSection = sections.find(s => s.id === activeElementId);

  const handleColChange = (updated: Partial<PlanColumn>) => {
    const columns = schema.columns.map(c => (c.id === activeElementId ? { ...c, ...updated } : c));
    const newSchema = { ...schema, columns };
    onChangeSchema(newSchema);
    setJsonText(JSON.stringify(newSchema, null, 2));

    // Keep section spec synced if we change width/depth of active column
    if (activeSection && (updated.width || updated.depth)) {
      const updatedSecs = sections.map(s => {
        if (s.id !== activeElementId) return s;
        return {
          ...s,
          width: updated.width || s.width,
          depth: updated.depth || s.depth,
        };
      });
      onChangeSections(updatedSecs);
    }
  };

  const handleBeamChange = (updated: Partial<PlanBeam>) => {
    const beams = schema.beams.map(b => (b.id === activeElementId ? { ...b, ...updated } : b));
    const newSchema = { ...schema, beams };
    onChangeSchema(newSchema);
    setJsonText(JSON.stringify(newSchema, null, 2));
  };

  const handleSectionChange = (updated: Partial<CrossSectionSpec>) => {
    const updatedSecs = sections.map(s => (s.id === activeElementId ? { ...s, ...updated } : s));
    onChangeSections(updatedSecs);
  };

  const handleJsonSubmit = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onChangeSchema(parsed);
    } catch {
      alert('Invalid JSON formatting. Please check syntax.');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-card text-card-foreground p-4 border border-border/40 rounded-xl shadow-md font-sans">
      {/* 1. Element Selector Dashboard */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Element Configurator
        </h4>
        {activeElementId ? (
          <div className="text-sm font-bold text-foreground bg-muted/30 px-3 py-2 rounded-lg border border-border/20">
            Selected: <span className="text-primary font-mono">{activeElementId}</span>
          </div>
        ) : (
          <div className="text-xs italic text-muted-foreground p-2 bg-muted/15 rounded-lg border border-dashed border-border/40">
            Select a column or beam on the canvas to configure properties.
          </div>
        )}
      </div>

      {/* 2. Column Controls */}
      {activeCol && (
        <div className="flex flex-col gap-3 border-t border-border/30 pt-3">
          <span className="text-xs font-bold text-muted-foreground">Column Size (B &times; D)</span>
          <div>
            <label className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Width (B): {activeCol.width}mm</span>
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={activeCol.width}
              onChange={e => handleColChange({ width: parseInt(e.target.value) })}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Depth (D): {activeCol.depth}mm</span>
            </label>
            <input
              type="range"
              min="200"
              max="800"
              step="50"
              value={activeCol.depth}
              onChange={e => handleColChange({ depth: parseInt(e.target.value) })}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}

      {/* 3. Beam Controls */}
      {activeBeam && (
        <div className="flex flex-col gap-3 border-t border-border/30 pt-3">
          <span className="text-xs font-bold text-muted-foreground">Beam Properties</span>
          <div>
            <label className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Thickness: {activeBeam.thickness}px</span>
            </label>
            <input
              type="range"
              min="8"
              max="40"
              step="2"
              value={activeBeam.thickness}
              onChange={e => handleBeamChange({ thickness: parseInt(e.target.value) })}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
          <div>
            <label className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Eccentricity Offset: {activeBeam.eccentricityOffset || 0}px</span>
            </label>
            <input
              type="range"
              min="-30"
              max="30"
              step="2"
              value={activeBeam.eccentricityOffset || 0}
              onChange={e => handleBeamChange({ eccentricityOffset: parseInt(e.target.value) })}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}

      {/* 4. Cross Section Config */}
      {activeSection && (
        <div className="flex flex-col gap-3 border-t border-border/30 pt-3">
          <span className="text-xs font-bold text-muted-foreground">Concrete Cover Detail</span>
          <div>
            <label className="text-[10px] text-muted-foreground flex justify-between font-mono">
              <span>Clear Cover: {activeSection.clearCover}mm</span>
            </label>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={activeSection.clearCover}
              onChange={e => handleSectionChange({ clearCover: parseInt(e.target.value) })}
              className="w-full h-1 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      )}

      {/* 5. Collapsible JSON Schema Panel */}
      <div className="border-t border-border/30 pt-3">
        <button
          onClick={() => setShowJson(!showJson)}
          className="text-xs font-semibold text-primary hover:underline flex items-center justify-between w-full"
        >
          <span>{showJson ? 'Hide' : 'Show'} Configuration Schema (JSON)</span>
          <span>{showJson ? '▲' : '▼'}</span>
        </button>
        {showJson && (
          <div className="flex flex-col gap-2 mt-2">
            <textarea
              value={jsonText}
              onChange={e => setJsonText(e.target.value)}
              className="w-full h-40 bg-muted/40 text-foreground font-mono text-[10px] p-2 border border-border/30 rounded-lg outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleJsonSubmit}
              className="w-full py-1.5 bg-primary text-primary-foreground font-mono text-xs font-bold rounded-lg hover:bg-primary/95 transition-all"
            >
              Apply JSON Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
