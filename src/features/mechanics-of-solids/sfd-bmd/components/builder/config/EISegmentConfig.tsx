import React from 'react';
import { IEISegment } from '@/cores/mechanics-of-solids/deflection/types';
import { useBeamWorkspace } from '../../../context/BeamWorkspaceContext';

interface EISegmentConfigProps {
  activeEISegment: IEISegment;
  eiSegments: IEISegment[];
  updateEISegment: (id: string, updates: Partial<IEISegment>) => void;
  deleteEISegment: (id: string) => void;
  splitEISegment: (id?: string | null) => void;
}

export const EISegmentConfig: React.FC<EISegmentConfigProps> = ({
  activeEISegment,
  eiSegments,
  updateEISegment,
  deleteEISegment,
  splitEISegment,
}) => {
  const { isSectionBuilderOpen, setIsSectionBuilderOpen } = useBeamWorkspace();
  const activeIdx = eiSegments.findIndex(s => s.id === activeEISegment.id);
  const prevSeg = activeIdx > 0 ? eiSegments[activeIdx - 1] : null;
  const nextSeg = activeIdx < eiSegments.length - 1 ? eiSegments[activeIdx + 1] : null;

  const isCalculated = activeEISegment.shape && activeEISegment.shape.type !== 'custom';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary font-bold">EI Segment Properties</h3>
      <div className="text-[10px] text-muted-foreground">
        Span range: {activeEISegment.startPosition.toFixed(2)}m to {activeEISegment.endPosition.toFixed(2)}m
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">E (Modulus of Elasticity in GPa)</label>
        <input
          type="number"
          min={1}
          max={1000}
          step={10}
          value={activeEISegment.E}
          onChange={(e) => updateEISegment(activeEISegment.id, { E: parseFloat(e.target.value) || 200 })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground flex justify-between items-center">
          <span>I (Moment of Inertia in 10^6 mm^4)</span>
          {isCalculated && (
            <span className="text-[9px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.2 rounded font-bold uppercase">
              Calculated
            </span>
          )}
        </label>
        <input
          type="number"
          min={1}
          max={10000}
          step={10}
          value={activeEISegment.I}
          disabled={!!isCalculated}
          onChange={(e) => updateEISegment(activeEISegment.id, { I: parseFloat(e.target.value) || 100 })}
          className={`rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none ${
            isCalculated ? 'opacity-65 cursor-not-allowed bg-muted/20 text-muted-foreground' : ''
          }`}
        />
      </div>

      <div className="flex flex-col gap-2 border-b border-border/20 pb-3 mt-1">
        <button
          type="button"
          onClick={() => setIsSectionBuilderOpen(!isSectionBuilderOpen)}
          className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            isSectionBuilderOpen
              ? 'border-primary bg-primary/10 text-primary hover:bg-primary/15'
              : 'border-border bg-background hover:bg-muted text-foreground'
          }`}
        >
          {isSectionBuilderOpen ? 'Close Profile Builder' : 'Configure Beam Shape Profile'}
        </button>
        {activeEISegment.shape && activeEISegment.shape.type !== 'custom' && (
          <div className="text-[10px] text-emerald-500 font-semibold text-center mt-0.5">
            Shape: {activeEISegment.shape.type.toUpperCase()} (Properties active)
          </div>
        )}
      </div>
      
      {prevSeg && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Left Boundary Position (meters)
          </label>
          <input
            type="number"
            min={prevSeg.startPosition + 0.1}
            max={activeEISegment.endPosition - 0.1}
            step={0.1}
            value={parseFloat(activeEISegment.startPosition.toFixed(2))}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                const clamped = Math.max(prevSeg.startPosition + 0.1, Math.min(activeEISegment.endPosition - 0.1, val));
                updateEISegment(activeEISegment.id, { startPosition: parseFloat(clamped.toFixed(2)) });
              }
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {nextSeg && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">
            Right Boundary Position (meters)
          </label>
          <input
            type="number"
            min={activeEISegment.startPosition + 0.1}
            max={nextSeg.endPosition - 0.1}
            step={0.1}
            value={parseFloat(activeEISegment.endPosition.toFixed(2))}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              if (!isNaN(val)) {
                const clamped = Math.max(activeEISegment.startPosition + 0.1, Math.min(nextSeg.endPosition - 0.1, val));
                updateEISegment(activeEISegment.id, { endPosition: parseFloat(clamped.toFixed(2)) });
              }
            }}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}
      <button
        onClick={() => splitEISegment(activeEISegment.id)}
        className="mt-4 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Split Segment in Half
      </button>

      {eiSegments.length > 1 && (
        <button
          onClick={() => deleteEISegment(activeEISegment.id)}
          className="mt-2 w-full rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-[0.98]"
        >
          Merge/Delete Segment
        </button>
      )}
    </div>
  );
};
