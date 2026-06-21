import React from 'react';
import { useFrameWorkspace } from '../../context/FrameWorkspaceContext';
import { INode, IMember, FrameSupportType, FrameLoadDirection } from '../../types/frame';
import { Trash2 } from 'lucide-react';

export const ElementConfigurator: React.FC = () => {
  const {
    nodes,
    members,
    supports,
    loads,
    selectedElementId,
    updateSupport,
    deleteSupport,
    updateLoad,
    deleteLoad,
    setNodes,
    setMembers,
    deleteNode,
    deleteMember
  } = useFrameWorkspace();

  if (!selectedElementId) {
    return (
      <div className="flex h-full min-h-[200px] flex-col items-center justify-center rounded-xl border border-border bg-card/40 p-4 text-center text-xs text-muted-foreground backdrop-blur-md">
        <p>Select a node, member, support, or load on the canvas to configure properties</p>
      </div>
    );
  }

  // Find the active element
  const activeNode = nodes.find(n => n.id === selectedElementId);
  const activeMember = members.find(m => m.id === selectedElementId);
  const activeSupport = supports.find(s => s.id === selectedElementId || `support_${s.nodeId}` === selectedElementId);
  const activeLoad = loads.find(l => l.id === selectedElementId);

  const handleNodeUpdate = (id: string, updates: Partial<INode>) => {
    setNodes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleMemberUpdate = (id: string, updates: Partial<IMember>) => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-md min-h-[220px]">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Properties Configurator</div>

      {activeNode && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Node Joint</h3>
            <button
              onClick={() => deleteNode(activeNode.id)}
              className="text-destructive hover:text-destructive/80"
              title="Delete Node"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Coord X (m)</label>
              <input
                type="number"
                step={0.25}
                value={activeNode.x}
                onChange={(e) => handleNodeUpdate(activeNode.id, { x: parseFloat(e.target.value) || 0 })}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Coord Y (m)</label>
              <input
                type="number"
                step={0.25}
                value={activeNode.y}
                onChange={(e) => handleNodeUpdate(activeNode.id, { y: parseFloat(e.target.value) || 0 })}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {activeMember && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Frame Member</h3>
            <button
              onClick={() => deleteMember(activeMember.id)}
              className="text-destructive hover:text-destructive/80"
              title="Delete Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Member End Releases (Hinges)</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={activeMember.releases?.start || false}
                  onChange={(e) => handleMemberUpdate(activeMember.id, {
                    releases: { ...activeMember.releases!, start: e.target.checked }
                  })}
                  className="accent-primary h-4 w-4 rounded"
                />
                Start Hinge
              </label>
              <label className="flex items-center gap-1.5 text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={activeMember.releases?.end || false}
                  onChange={(e) => handleMemberUpdate(activeMember.id, {
                    releases: { ...activeMember.releases!, end: e.target.checked }
                  })}
                  className="accent-primary h-4 w-4 rounded"
                />
                End Hinge
              </label>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-1">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase">E (GPa)</label>
              <input
                type="number"
                min={1}
                value={activeMember.E}
                onChange={(e) => handleMemberUpdate(activeMember.id, { E: parseInt(e.target.value) || 200 })}
                className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase">I (10^6 mm^4)</label>
              <input
                type="number"
                min={1}
                value={activeMember.I}
                onChange={(e) => handleMemberUpdate(activeMember.id, { I: parseInt(e.target.value) || 100 })}
                className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-muted-foreground uppercase">A (mm^2)</label>
              <input
                type="number"
                min={100}
                value={activeMember.A}
                onChange={(e) => handleMemberUpdate(activeMember.id, { A: parseInt(e.target.value) || 5000 })}
                className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {activeSupport && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Boundary Support</h3>
            <button
              onClick={() => deleteSupport(activeSupport.id)}
              className="text-destructive hover:text-destructive/80"
              title="Delete Support"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Support Type</label>
            <select
              value={activeSupport.type}
              onChange={(e) => updateSupport(activeSupport.id, { type: e.target.value as FrameSupportType })}
              className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground focus:outline-none"
            >
              <option value="hinge">Hinge (Pinned)</option>
              <option value="roller">Roller</option>
              <option value="fixed">Fixed</option>
            </select>
          </div>

          {activeSupport.type !== 'fixed' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Rotation Angle (degrees)</label>
              <input
                type="range"
                min={0}
                max={360}
                step={90}
                value={activeSupport.angle}
                onChange={(e) => updateSupport(activeSupport.id, { angle: parseInt(e.target.value) || 0 })}
                className="accent-primary w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0° (Vertical)</span>
                <span className="font-semibold text-primary">{activeSupport.angle}°</span>
                <span>360°</span>
              </div>
            </div>
          )}
        </div>
      )}

      {activeLoad && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-primary">Load Force</h3>
            <button
              onClick={() => deleteLoad(activeLoad.id)}
              className="text-destructive hover:text-destructive/80"
              title="Delete Load"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Load Type</label>
              <select
                value={activeLoad.type}
                onChange={(e) => updateLoad(activeLoad.id, { type: e.target.value as 'point' | 'moment' | 'udl' })}
                className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              >
                <option value="point">Point Force</option>
                <option value="moment">Moment</option>
                <option value="udl">UDL</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Magnitude</label>
              <input
                type="number"
                value={activeLoad.magnitude}
                onChange={(e) => updateLoad(activeLoad.id, { magnitude: parseFloat(e.target.value) || 0 })}
                className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:outline-none"
              />
            </div>
          </div>

          {activeLoad.type !== 'moment' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Direction</label>
              <select
                value={activeLoad.direction}
                onChange={(e) => updateLoad(activeLoad.id, { direction: e.target.value as FrameLoadDirection })}
                className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none"
              >
                <option value="global-vertical">Global Vertical</option>
                <option value="global-horizontal">Global Horizontal</option>
                {activeLoad.attachedTo === 'member' && <option value="local-transverse">Perpendicular to Member</option>}
              </select>
            </div>
          )}

          {activeLoad.attachedTo === 'member' && activeLoad.type !== 'udl' && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase">Relative Position (0 = start, 1 = end)</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={activeLoad.position ?? 0.5}
                onChange={(e) => updateLoad(activeLoad.id, { position: parseFloat(e.target.value) })}
                className="accent-primary w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0.0 (Start)</span>
                <span className="font-semibold text-primary">{Math.round((activeLoad.position ?? 0.5) * 100)}%</span>
                <span>1.0 (End)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default ElementConfigurator;
