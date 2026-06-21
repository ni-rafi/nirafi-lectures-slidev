import React, { useState, useMemo } from 'react';
import {
  FrameWorkspaceProvider,
  FrameCanvas,
  ToolBar,
  ElementConfigurator,
  useFrameWorkspace
} from '@/subjects/structural-analysis/features/frame-solver';
import { ArrowLeft, RefreshCw, Layers, Sparkles, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { ShearForceChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/ShearForceChart';
import { BendingMomentChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/BendingMomentChart';
import { DeflectionChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/DeflectionChart';
import { AxialForceChart } from '@/subjects/structural-analysis/features/frame-solver/components/diagrams/AxialForceChart';
import { FrameSolverService } from '@/subjects/structural-analysis/cores/frame-solver/FrameSolverService';

const FrameSolverPageInternal: React.FC = () => {
  const { clearWorkspace, selectedElementId, nodes, members, supports, loads } = useFrameWorkspace();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'sfd' | 'bmd' | 'afd' | 'deflection'>('sfd');
  const [hoverX, setHoverX] = useState<number | null>(null);

  const solverService = useMemo(() => new FrameSolverService(), []);

  const result = useMemo(() => {
    if (!selectedElementId || !selectedElementId.startsWith('member_')) {
      return null;
    }
    return solverService.solveMember(selectedElementId, nodes, members, supports, loads);
  }, [selectedElementId, nodes, members, supports, loads, solverService]);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                2D Frame Builder Canvas
              </h1>
              <p className="text-xs text-muted-foreground">
                Draw 2D structural frame members, place boundary support constraints, and configure point/UDL forces
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={clearWorkspace}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Canvas</span>
        </button>
      </div>

      {/* Workspace Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Canvas Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <FrameCanvas />
          
          {/* Diagrams Panel */}
          {result && result.success ? (
            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-foreground">
                      Selected Member Diagnostics: {selectedElementId}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Local 1D virtual beam solver length: {result.length.toFixed(3)} m
                    </p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 rounded-lg bg-muted p-1 text-xs font-semibold">
                  {(['sfd', 'bmd', 'afd', 'deflection'] as const).map((tab) => {
                    const label = tab.toUpperCase();
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-md px-3 py-1.5 transition-all ${
                          isActive
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Render Selected Diagram */}
              <div className="mt-6 flex flex-col gap-4">
                {activeTab === 'sfd' && (
                  <ShearForceChart
                    length={result.length}
                    hoverX={hoverX}
                    setHoverX={setHoverX}
                    solverResult={result.sfdBmdResult || undefined}
                  />
                )}
                {activeTab === 'bmd' && (
                  <BendingMomentChart
                    length={result.length}
                    hoverX={hoverX}
                    setHoverX={setHoverX}
                    solverResult={result.sfdBmdResult || undefined}
                  />
                )}
                {activeTab === 'afd' && (
                  <AxialForceChart
                    length={result.length}
                    hoverX={hoverX}
                    setHoverX={setHoverX}
                    axialResult={result.axialResult || undefined}
                  />
                )}
                {activeTab === 'deflection' && (
                  <DeflectionChart
                    length={result.length}
                    hoverX={hoverX}
                    setHoverX={setHoverX}
                    solverResult={result.sfdBmdResult || undefined}
                    deflectionResult={result.deflectionResult || undefined}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border bg-card/30 p-8 text-center">
              <div className="mx-auto rounded-full bg-muted p-3 text-muted-foreground">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground">No Member Selected</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  Click on any member in the 2D canvas above to select it and instantly plot its local Shear Force (SFD), Bending Moment (BMD), Axial Force (AFD), and Deflection profiles.
                </p>
              </div>
            </div>
          )}

          {/* Indeterminate Frame Solver Notice */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground leading-relaxed">
            <span className="font-bold text-primary mr-1">Indeterminate Frame Solver:</span>
            This workspace acts as the interactive drawing and topology builder. In the future, a matrix stiffness method core solver engine will consume this node-member list to calculate reactions, shear force diagrams (SFD), bending moment diagrams (BMD), axial force diagrams (AFD), and deflection curves for indeterminate frame structures.
          </div>
        </div>

        {/* Sidebar Controls Area */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <ToolBar />
          <ElementConfigurator />
        </div>
      </div>
    </div>
  );
};

export const FrameSolverPage: React.FC = () => {
  return (
    <FrameWorkspaceProvider>
      <FrameSolverPageInternal />
    </FrameWorkspaceProvider>
  );
};

export default FrameSolverPage;
