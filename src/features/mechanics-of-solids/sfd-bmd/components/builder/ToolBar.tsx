import React from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';

export const ToolBar: React.FC = () => {
  const { length, addSupport, addRelease, addLoad, splitEISegment } = useBeamWorkspace();

  const toolbarSections = [
    {
      title: 'Supports',
      items: [
        { label: 'Roller Support', action: () => addSupport('roller', length / 2) },
        { label: 'Hinge Support', action: () => addSupport('hinge', length / 2) },
        { label: 'Fixed Support', action: () => addSupport('fixed', length / 2) },
      ],
    },
    {
      title: 'Internal Releases',
      items: [
        { label: 'Internal Hinge', action: () => addRelease('hinge', length / 2) },
        { label: 'Internal Roller', action: () => addRelease('roller', length / 2) },
      ],
    },
    {
      title: 'Loads',
      items: [
        { label: 'Point Load', action: () => addLoad('point', length / 2) },
        { label: 'Bending Moment', action: () => addLoad('moment', length / 2) },
        { label: 'UDL (Uniform)', action: () => addLoad('udl', length / 3) },
        { label: 'UVL (Varying)', action: () => addLoad('uvl', length / 3) },
      ],
    },
    {
      title: 'Stiffness (EI)',
      items: [
        { label: 'Split Segment', action: () => splitEISegment() },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Structural Elements</div>
      <div className="flex flex-wrap gap-4 md:flex-col">
        {toolbarSections.map(section => (
          <div key={section.title} className="flex flex-col gap-1.5 flex-1 min-w-[150px]">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{section.title}</div>
            <div className="flex flex-wrap gap-1.5 md:flex-col">
              {section.items.map(item => (
                <button
                  key={item.label}
                  onClick={item.action}
                  className="flex items-center justify-between rounded-lg border border-border bg-background/50 px-3 py-1.5 text-left text-xs font-medium text-foreground transition-all hover:border-primary hover:bg-primary/10 hover:text-primary active:scale-[0.98]"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] text-muted-foreground hover:text-primary-hover">+ Add</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
