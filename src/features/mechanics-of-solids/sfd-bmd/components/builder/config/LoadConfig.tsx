import React from 'react';
import { ILoad } from '@/cores/mechanics-of-solids/sfd-bmd/types';

interface LoadConfigProps {
  activeLoad: ILoad;
  length: number;
  updateLoad: (id: string, updates: Partial<ILoad>) => void;
  deleteLoad: (id: string) => void;
}

export const LoadConfig: React.FC<LoadConfigProps> = ({
  activeLoad,
  length,
  updateLoad,
  deleteLoad,
}) => {
  const isPointOrMoment = activeLoad.type === 'point' || activeLoad.type === 'moment';

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary font-bold">{activeLoad.type.toUpperCase()} Load Properties</h3>
      
      {isPointOrMoment ? (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Position (meters)</label>
          <input
            type="number"
            min={0}
            max={length}
            step={0.1}
            value={activeLoad.position ?? 0}
            onChange={(e) => updateLoad(activeLoad.id, { position: parseFloat(e.target.value) || 0 })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Start Position (meters)</label>
            <input
              type="number"
              min={0}
              max={activeLoad.endPosition ?? length}
              step={0.1}
              value={activeLoad.startPosition ?? 0}
              onChange={(e) => updateLoad(activeLoad.id, { startPosition: parseFloat(e.target.value) || 0 })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">End Position (meters)</label>
            <input
              type="number"
              min={activeLoad.startPosition ?? 0}
              max={length}
              step={0.1}
              value={activeLoad.endPosition ?? length}
              onChange={(e) => updateLoad(activeLoad.id, { endPosition: parseFloat(e.target.value) || length })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </>
      )}

      {activeLoad.type === 'point' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Magnitude (kN, positive downward, negative upward)</label>
          <input
            type="number"
            step={1}
            value={activeLoad.magnitude ?? 10}
            onChange={(e) => updateLoad(activeLoad.id, { magnitude: parseFloat(e.target.value) || 0 })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {activeLoad.type === 'moment' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Magnitude (kNm, positive clockwise, negative CCW)</label>
          <input
            type="number"
            step={1}
            value={activeLoad.magnitude ?? 5}
            onChange={(e) => updateLoad(activeLoad.id, { magnitude: parseFloat(e.target.value) || 0 })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {activeLoad.type === 'udl' && (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Magnitude (kN/m, positive downward)</label>
          <input
            type="number"
            step={1}
            value={activeLoad.magnitude ?? 4}
            onChange={(e) => updateLoad(activeLoad.id, { magnitude: parseFloat(e.target.value) || 0 })}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      )}

      {activeLoad.type === 'uvl' && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">Start Magnitude (kN/m, positive downward)</label>
            <input
              type="number"
              step={1}
              value={activeLoad.startMagnitude ?? 0}
              onChange={(e) => updateLoad(activeLoad.id, { startMagnitude: parseFloat(e.target.value) || 0 })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-muted-foreground">End Magnitude (kN/m, positive downward)</label>
            <input
              type="number"
              step={1}
              value={activeLoad.endMagnitude ?? 6}
              onChange={(e) => updateLoad(activeLoad.id, { endMagnitude: parseFloat(e.target.value) || 0 })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
            />
          </div>
        </>
      )}

      <button
        onClick={() => deleteLoad(activeLoad.id)}
        className="mt-2 w-full rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-[0.98]"
      >
        Delete Load
      </button>
    </div>
  );
};
