import React from 'react';
import { useFrameWorkspace, WorkspaceMode } from '../../context/FrameWorkspaceContext';
import { FrameSupportType } from '../../types/frame';
import { MousePointer, PenTool, Trash2, HelpCircle } from 'lucide-react';

export const ToolBar: React.FC = () => {
  const {
    activeMode,
    selectedSupportType,
    selectedLoadType,
    selectedLoadDirection,
    gridSpacing,
    snapToGrid,
    setActiveMode,
    setSelectedSupportType,
    setSelectedLoadType,
    setSelectedLoadDirection,
    setGridSpacing,
    setSnapToGrid,
    clearWorkspace
  } = useFrameWorkspace();

  const handleModeChange = (mode: WorkspaceMode) => {
    setActiveMode(mode);
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-md">
      <div className="text-xs font-bold uppercase tracking-wider text-primary">Toolbar Controls</div>
      
      {/* Modes Selection */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => handleModeChange('select')}
          className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            activeMode === 'select'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          title="Select and Drag Elements"
        >
          <MousePointer className="h-4 w-4" />
          <span>Select</span>
        </button>

        <button
          onClick={() => handleModeChange('draw-member')}
          className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            activeMode === 'draw-member'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
          title="Draw Frame Members"
        >
          <PenTool className="h-4 w-4" />
          <span>Draw Member</span>
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Boundary Conditions</label>
        <button
          onClick={() => handleModeChange('add-support')}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            activeMode === 'add-support'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span>Add Support</span>
          <select
            value={selectedSupportType}
            onChange={(e) => {
              setSelectedSupportType(e.target.value as FrameSupportType);
              setActiveMode('add-support');
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none"
          >
            <option value="hinge">Hinge</option>
            <option value="roller">Roller</option>
            <option value="fixed">Fixed</option>
          </select>
        </button>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Force Configurations</label>
        
        <button
          onClick={() => handleModeChange('add-load')}
          className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
            activeMode === 'add-load'
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border bg-background/50 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          <span>Add Load</span>
          <select
            value={selectedLoadType}
            onChange={(e) => {
              setSelectedLoadType(e.target.value as any);
              setActiveMode('add-load');
            }}
            onClick={(e) => e.stopPropagation()}
            className="rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px] text-foreground focus:outline-none"
          >
            <option value="point">Point Force</option>
            <option value="moment">Moment</option>
            <option value="udl">UDL</option>
          </select>
        </button>

        {selectedLoadType !== 'moment' && activeMode === 'add-load' && (
          <div className="flex flex-col gap-1.5 bg-muted/40 p-2 rounded-lg border border-border/40">
            <span className="text-[9px] font-bold text-muted-foreground">Load Direction</span>
            <div className="flex flex-col gap-1">
              <label className="flex items-center gap-1.5 text-[10px] text-foreground">
                <input
                  type="radio"
                  name="load-direction"
                  value="global-vertical"
                  checked={selectedLoadDirection === 'global-vertical'}
                  onChange={() => setSelectedLoadDirection('global-vertical')}
                  className="accent-primary"
                />
                Global Vertical (Gravity)
              </label>
              <label className="flex items-center gap-1.5 text-[10px] text-foreground">
                <input
                  type="radio"
                  name="load-direction"
                  value="global-horizontal"
                  checked={selectedLoadDirection === 'global-horizontal'}
                  onChange={() => setSelectedLoadDirection('global-horizontal')}
                  className="accent-primary"
                />
                Global Horizontal
              </label>
              {selectedLoadType !== 'udl' && (
                <label className="flex items-center gap-1.5 text-[10px] text-foreground">
                  <input
                    type="radio"
                    name="load-direction"
                    value="local-transverse"
                    checked={selectedLoadDirection === 'local-transverse'}
                    onChange={() => setSelectedLoadDirection('local-transverse')}
                    className="accent-primary"
                  />
                  Perpendicular to Member
                </label>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Workspace settings</label>
        
        <div className="flex items-center justify-between text-xs text-foreground">
          <span>Snap to Grid</span>
          <input
            type="checkbox"
            checked={snapToGrid}
            onChange={(e) => setSnapToGrid(e.target.checked)}
            className="accent-primary h-4 w-4 rounded"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-foreground">
          <span>Grid Spacing</span>
          <select
            value={gridSpacing}
            onChange={(e) => setGridSpacing(parseFloat(e.target.value))}
            className="rounded border border-border bg-background px-1 py-0.5 text-[10px] text-foreground focus:outline-none"
          >
            <option value="0.25">0.25m</option>
            <option value="0.5">0.5m</option>
            <option value="1.0">1.0m</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/40 pt-3">
        <button
          onClick={clearWorkspace}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-destructive/20 bg-destructive/5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/10 transition-all"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear Canvas</span>
        </button>
      </div>

      {/* Info Help Tip */}
      <div className="flex gap-2 rounded-lg bg-primary/5 p-3.5 text-[10px] text-primary/80 border border-primary/10 leading-relaxed mt-auto">
        <HelpCircle className="h-4 w-4 shrink-0" />
        <div className="flex flex-col gap-0.5">
          <span className="font-bold">Instructions:</span>
          {activeMode === 'select' && <span>Click elements to select and edit their coordinates. Drag nodes to move frame members.</span>}
          {activeMode === 'draw-member' && <span>Click and drag on the grid to create members. Snap to nodes to create connections.</span>}
          {activeMode === 'add-support' && <span>Click any node joint on the canvas to place a {selectedSupportType} support.</span>}
          {activeMode === 'add-load' && <span>Click any node or member to attach a {selectedLoadType} load.</span>}
        </div>
      </div>
    </div>
  );
};
export default ToolBar;
