import React from 'react';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';
import { ICrossSection, CrossSectionType } from '@/cores/mechanics-of-solids/stress/stress.interface';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';
import { X, Check } from 'lucide-react';

interface CrossSectionBuilderProps {
  activeEISegment: IEISegment;
  updateEISegment: (id: string, updates: Partial<IEISegment>) => void;
  onClose: () => void;
}

export const CrossSectionBuilder: React.FC<CrossSectionBuilderProps> = ({
  activeEISegment,
  updateEISegment,
  onClose,
}) => {
  // Retrieve or initialize shape
  const shape: ICrossSection = activeEISegment.shape ?? {
    type: 'custom',
  };

  const handleTypeChange = (type: CrossSectionType) => {
    if (type === 'custom') {
      updateEISegment(activeEISegment.id, {
        shape: { type },
      });
      return;
    }

    // Set standard default dimensions in meters based on shape type
    const defaultShape: ICrossSection = {
      type,
      width: type === 'circular' ? undefined : 0.15,
      height: type === 'circular' ? undefined : 0.2,
      thicknessFlange: type === 'rectangular' || type === 'circular' ? undefined : 0.01,
      thicknessWeb: type === 'rectangular' || type === 'circular' ? undefined : 0.006,
      diameter: type === 'circular' ? 0.15 : undefined,
    };

    const props = CrossSectionEngine.calculateProperties(defaultShape);
    updateEISegment(activeEISegment.id, {
      shape: defaultShape,
      I: parseFloat((props.I * 1e6).toFixed(3)), // Sync calculated I in 10^6 mm^4
    });
  };

  const handleDimensionChange = (field: keyof ICrossSection, valueMm: number) => {
    if (isNaN(valueMm) || valueMm <= 0) return;
    const valueMeters = valueMm / 1000;
    const updatedShape = {
      ...shape,
      [field]: valueMeters,
    };
    const props = CrossSectionEngine.calculateProperties(updatedShape);
    updateEISegment(activeEISegment.id, {
      shape: updatedShape,
      I: parseFloat((props.I * 1e6).toFixed(3)), // Sync calculated I in 10^6 mm^4
    });
  };


  const templates: { id: CrossSectionType; label: string }[] = [
    { id: 'custom', label: 'Custom (Manual I)' },
    { id: 'rectangular', label: 'Rectangular' },
    { id: 'circular', label: 'Circular' },
    { id: 'i-beam', label: 'I-Beam (W)' },
    { id: 't-beam', label: 'T-Beam' },
    { id: 'channel', label: 'Channel (C)' },
  ];

  // Calculated properties summary
  const props = CrossSectionEngine.calculateProperties(shape, activeEISegment.I * 1e-6);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-md min-w-[240px]">
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">Cross-Section Profile Builder</span>
        <button
          onClick={onClose}
          className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Shape Template Buttons Grid */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">Select Profile Shape</label>
        <div className="grid grid-cols-2 gap-1.5">
          {templates.map((t) => (
            <button
              key={t.id}
              onClick={() => handleTypeChange(t.id)}
              className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all ${
                shape.type === t.id
                  ? 'border-primary bg-primary/10 text-primary shadow-sm'
                  : 'border-border/40 bg-background/50 text-muted-foreground hover:bg-muted/10 hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shape-specific Dimension Controllers */}
      {shape.type !== 'custom' && (
        <div className="flex flex-col gap-2 border-t border-border/20 pt-3">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">Profile Dimensions (mm)</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {shape.type === 'rectangular' && (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Width (b):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.width ?? 0.15) * 1000)}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Height (h):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.height ?? 0.2) * 1000)}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {shape.type === 'circular' && (
              <div className="flex flex-col gap-1 col-span-2">
                <span className="text-[9px] text-muted-foreground font-semibold">Diameter (d):</span>
                <input
                  type="number"
                  min={1}
                  value={Math.round((shape.diameter ?? 0.1) * 1000)}
                  onChange={(e) => handleDimensionChange('diameter', parseFloat(e.target.value))}
                  className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                />
              </div>
            )}

            {shape.type === 't-beam' && (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Flange Width (bf):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.width ?? 0.15) * 1000)}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Flange Thick. (tf):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.thicknessFlange ?? 0.01) * 1000)}
                    onChange={(e) => handleDimensionChange('thicknessFlange', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Web Thick. (tw):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.thicknessWeb ?? 0.006) * 1000)}
                    onChange={(e) => handleDimensionChange('thicknessWeb', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Overall Depth (d):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.height ?? 0.2) * 1000)}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}

            {(shape.type === 'i-beam' || shape.type === 'channel') && (
              <>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Top Flange Width (bf,top):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.width ?? 0.15) * 1000)}
                    onChange={(e) => handleDimensionChange('width', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Top Flange Thick. (tf,top):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.thicknessFlange ?? 0.01) * 1000)}
                    onChange={(e) => handleDimensionChange('thicknessFlange', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Bot Flange Width (bf,bot):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.widthBottom ?? (shape.width ?? 0.15)) * 1000)}
                    onChange={(e) => handleDimensionChange('widthBottom', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Bot Flange Thick. (tf,bot):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.thicknessFlangeBottom ?? (shape.thicknessFlange ?? 0.01)) * 1000)}
                    onChange={(e) => handleDimensionChange('thicknessFlangeBottom', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Web Thick. (tw):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.thicknessWeb ?? 0.006) * 1000)}
                    onChange={(e) => handleDimensionChange('thicknessWeb', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] text-muted-foreground font-semibold">Overall Depth (d):</span>
                  <input
                    type="number"
                    min={1}
                    value={Math.round((shape.height ?? 0.2) * 1000)}
                    onChange={(e) => handleDimensionChange('height', parseFloat(e.target.value))}
                    className="w-full rounded-md border border-border bg-background px-2 py-0.5 font-mono text-xs focus:border-primary focus:outline-none"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Properties Summary Section */}
      <div className="flex flex-col gap-2 border-t border-border/20 pt-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75">Geometric Properties</label>
        <div className="rounded-lg border border-border bg-muted/10 p-2.5 text-[11px] font-mono flex flex-col gap-1.5">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Area (A):</span>
            <span className="font-semibold text-foreground">{(props.area * 1e6).toFixed(1)} mm²</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Neutral Axis (ȳ):</span>
            <span className="font-semibold text-foreground">{(props.centroid * 1000).toFixed(1)} mm</span>
          </div>
          <div className="flex justify-between border-t border-border/20 pt-1.5 mt-1.5 font-bold">
            <span className="text-primary">Stiffness (I):</span>
            <span className="text-primary font-bold">{(props.I * 1e6).toFixed(3)} 10⁶ mm⁴</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="w-full mt-2 flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/95 active:scale-[0.98]"
      >
        <Check className="h-3.5 w-3.5" />
        <span>Save and Close</span>
      </button>
    </div>
  );
};
