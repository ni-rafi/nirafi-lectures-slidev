import React from 'react';
import { ISupport, SupportType } from '@/cores/mechanics-of-solids/sfd-bmd/types';

interface SupportConfigProps {
  activeSupport: ISupport;
  length: number;
  updateSupport: (id: string, updates: Partial<ISupport>) => void;
  deleteSupport: (id: string) => void;
}

export const SupportConfig: React.FC<SupportConfigProps> = ({
  activeSupport,
  length,
  updateSupport,
  deleteSupport,
}) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-primary font-bold">Support Properties</h3>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Support Type</label>
        <select
          value={activeSupport.type}
          onChange={(e) => updateSupport(activeSupport.id, { type: e.target.value as SupportType })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        >
          <option value="roller">Roller Support</option>
          <option value="hinge">Hinge Support</option>
          <option value="fixed">Fixed Support</option>
        </select>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Position (meters from left)</label>
        <input
          type="number"
          min={0}
          max={length}
          step={0.1}
          value={activeSupport.position}
          onChange={(e) => updateSupport(activeSupport.id, { position: parseFloat(e.target.value) || 0 })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
        />
      </div>
      <button
        onClick={() => deleteSupport(activeSupport.id)}
        className="mt-2 w-full rounded-lg bg-destructive px-3 py-2 text-xs font-semibold text-destructive-foreground transition-all hover:bg-destructive/90 active:scale-[0.98]"
      >
        Delete Support
      </button>
    </div>
  );
};
