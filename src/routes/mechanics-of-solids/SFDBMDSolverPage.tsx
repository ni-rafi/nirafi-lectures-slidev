import React from 'react';
import { BeamWorkspaceProvider } from '@/features/mechanics-of-solids/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '@/features/mechanics-of-solids/sfd-bmd/hooks/useBeamEngine';
import { BeamCanvas } from '@/features/mechanics-of-solids/sfd-bmd/components/builder/BeamCanvas';
import { ToolBar } from '@/features/mechanics-of-solids/sfd-bmd/components/builder/ToolBar';
import { ElementConfigurator } from '@/features/mechanics-of-solids/sfd-bmd/components/builder/ElementConfigurator';
import { ShearForceChart } from '@/features/mechanics-of-solids/sfd-bmd/components/diagrams/ShearForceChart';
import { BendingMomentChart } from '@/features/mechanics-of-solids/sfd-bmd/components/diagrams/BendingMomentChart';
import { SlopeChart } from '@/features/mechanics-of-solids/sfd-bmd/components/diagrams/SlopeChart';
import { DeflectionChart } from '@/features/mechanics-of-solids/sfd-bmd/components/diagrams/DeflectionChart';
import { CalculationBreakdowns } from '@/features/mechanics-of-solids/sfd-bmd/components/breakdowns/CalculationBreakdowns';
import { MathTextRenderer } from '@/features/mechanics-of-solids/sfd-bmd/components/breakdowns/MathTextRenderer';
import { ArrowLeft, RefreshCw, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBeamWorkspace } from '@/features/mechanics-of-solids/sfd-bmd/context/BeamWorkspaceContext';
import { BendingStressEnvelopeChart } from '@/features/mechanics-of-solids/stress/components/diagrams/BendingStressEnvelopeChart';
import { MaxShearStressChart } from '@/features/mechanics-of-solids/stress/components/diagrams/MaxShearStressChart';
import { StressGradientProfile } from '@/features/mechanics-of-solids/stress/components/diagrams/StressGradientProfile';
import { InteractiveStressTransformation } from '@/features/mechanics-of-solids/stress/components/diagrams/InteractiveStressTransformation';
import { CrossSectionBuilder } from '@/features/mechanics-of-solids/stress/components/builder/CrossSectionBuilder';
import { InteractiveProfileCanvas } from '@/features/mechanics-of-solids/stress/components/builder/InteractiveProfileCanvas';
import { CrossSectionEngine } from '@/cores/mechanics-of-solids/stress/cross-section.engine';

const SFDBMDSolverInternal: React.FC = () => {
  const { solverResult } = useBeamEngine();
  const {
    isSectionBuilderOpen,
    setIsSectionBuilderOpen,
    selectedId,
    eiSegments,
    updateEISegment,
  } = useBeamWorkspace();
  const navigate = useNavigate();

  const activeEISegment = eiSegments.find(s => s.id === selectedId);

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
          <div>
            <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">Shear & Bending Moment Solver</h1>
            <p className="text-xs text-muted-foreground">Build determinate beams, calculate reactions, and view step-by-step calculations</p>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Reset Solver</span>
        </button>
      </div>

      {/* Main Builder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`flex flex-col gap-6 ${isSectionBuilderOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <BeamCanvas />
          
          {/* Diagrams Output */}
          {solverResult.success ? (
            <div className="flex flex-col gap-6">
              <ShearForceChart />
              <BendingMomentChart />
              <SlopeChart />
              <DeflectionChart />
              <BendingStressEnvelopeChart />
              <MaxShearStressChart />
              <StressGradientProfile />
              <InteractiveStressTransformation />
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Solving Halted</p>
                <div className="mt-1 text-muted-foreground text-destructive">
                  <MathTextRenderer text="Diagrams and detailed equations are only solved for statically determinate structures ($\text{DOI} = 0$). Please adjust supports or internal hinges to resolve." />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={`flex flex-col gap-6 ${isSectionBuilderOpen ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
          {isSectionBuilderOpen ? (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ElementConfigurator />
                {activeEISegment && (
                  <CrossSectionBuilder
                    activeEISegment={activeEISegment}
                    updateEISegment={updateEISegment}
                    onClose={() => setIsSectionBuilderOpen(false)}
                  />
                )}
              </div>

              {/* Separate Canvas Container for Interactive profile builder */}
              {activeEISegment && activeEISegment.shape && activeEISegment.shape.type !== 'custom' && (
                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-border/40 pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">Interactive Profile Dimensions Editor</span>
                    <span className="text-[10px] text-muted-foreground">Click labels on the diagram to edit dimensions in millimeters</span>
                  </div>
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/75 text-center">
                      Click dimensions to edit (mm)
                    </label>
                    <InteractiveProfileCanvas
                      shape={activeEISegment.shape}
                      onChange={(updates) => {
                        const updatedShape = { ...activeEISegment.shape!, ...updates };
                        const props = CrossSectionEngine.calculateProperties(updatedShape);
                        updateEISegment(activeEISegment.id, {
                          shape: updatedShape,
                          I: parseFloat((props.I * 1e6).toFixed(3)), // Sync calculated I in 10^6 mm^4
                        });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ElementConfigurator />
          )}
          <ToolBar />
        </div>
      </div>

      {/* Unified Mathematical Explanations & Deflection Breakdowns */}
      <div className="mt-2">
        <CalculationBreakdowns />
      </div>
    </div>
  );
};

export const SFDBMDSolverPage: React.FC = () => {
  return (
    <BeamWorkspaceProvider>
      <SFDBMDSolverInternal />
    </BeamWorkspaceProvider>
  );
};

export default SFDBMDSolverPage;
