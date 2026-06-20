import React from 'react';
import { IInternalRelease, ReleaseType } from '@/cores/mechanics-of-solids/sfd-bmd/types';

interface ReleaseConfigProps {
  activeRelease: IInternalRelease;
  length: number;
  updateRelease: (id: string, updates: Partial<IInternalRelease>) => void;
  deleteRelease: (id: string) => void;
}

export const ReleaseConfig: React.FC<ReleaseConfigProps> = ({
  activeRelease,
  length,
  updateRelease,
  deleteRelease,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary font-bold">Internal Release Properties</h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Release Type</label>
        <select
          value={activeRelease.type}
          onChange={(e) => updateRelease(activeRelease.id, { type: e.target.value as ReleaseType })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="hinge">Internal Hinge (Moment Release)</option>
          <option value="roller">Internal Roller (Moment & Shear Release)</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Position (meters from left)</label>
        <input
          type="number"
          min={0}
          max={length}
          step={0.1}
          value={activeRelease.position}
          onChange={(e) => updateRelease(activeRelease.id, { position: parseFloat(e.target.value) || 0 })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <button
        onClick={() => deleteRelease(activeRelease.id)}
        className="mt-2 w-full rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-[0.98]"
      >
        Delete Release
      </button>
    </div>
  );
};
