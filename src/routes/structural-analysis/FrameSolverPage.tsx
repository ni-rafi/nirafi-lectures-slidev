import React from 'react';
import {
  FrameWorkspaceProvider,
  FrameCanvas,
  ToolBar,
  ElementConfigurator,
  useFrameWorkspace
} from '@/subjects/structural-analysis/features/frame-solver';
import { ArrowLeft, RefreshCw, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FrameSolverPageInternal: React.FC = () => {
  const { clearWorkspace } = useFrameWorkspace();
  const navigate = useNavigate();

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
        <div className="lg:col-span-3 flex flex-col gap-4">
          <FrameCanvas />
          
          {/* Future Solver Preview notice */}
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
