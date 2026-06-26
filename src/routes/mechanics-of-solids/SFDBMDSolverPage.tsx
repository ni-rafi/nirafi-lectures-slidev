import React, { useState } from 'react';
import { BeamWorkspaceProvider } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { useBeamEngine } from '@/subjects/mechanics-of-solids/features/sfd-bmd/hooks/useBeamEngine';
import { BeamCanvas } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/builder/BeamCanvas';
import { ToolBar } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/builder/ToolBar';
import { ElementConfigurator } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/builder/ElementConfigurator';
import { ShearForceChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/ShearForceChart';
import { BendingMomentChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/BendingMomentChart';
import { SlopeChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/SlopeChart';
import { DeflectionChart } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/diagrams/DeflectionChart';
import { CalculationBreakdowns } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/CalculationBreakdowns';
import { MathTextRenderer } from '@/subjects/mechanics-of-solids/features/sfd-bmd/components/breakdowns/MathTextRenderer';
import { ArrowLeft, RefreshCw, Info, FileDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBeamWorkspace } from '@/subjects/mechanics-of-solids/features/sfd-bmd/context/BeamWorkspaceContext';
import { BendingStressEnvelopeChart } from '@/subjects/mechanics-of-solids/features/stress/components/diagrams/BendingStressEnvelopeChart';
import { MaxShearStressChart } from '@/subjects/mechanics-of-solids/features/stress/components/diagrams/MaxShearStressChart';
import { StressGradientProfile } from '@/subjects/mechanics-of-solids/features/stress/components/diagrams/StressGradientProfile';
import { InteractiveStressTransformation } from '@/subjects/mechanics-of-solids/features/stress/components/diagrams/InteractiveStressTransformation';
import { CrossSectionBuilder } from '@/subjects/mechanics-of-solids/features/stress/components/builder/CrossSectionBuilder';
import { InteractiveProfileCanvas } from '@/subjects/mechanics-of-solids/features/stress/components/builder/InteractiveProfileCanvas';
import { CrossSectionEngine } from '@/subjects/mechanics-of-solids/cores/stress/cross-section.engine';
import { PDFExportModal } from '@/features/pdf-export/PDFExportModal';

const SFDBMDSolverInternal: React.FC = () => {
  const { solverResult, deflectionResult } = useBeamEngine();
  const {
    isSectionBuilderOpen,
    setIsSectionBuilderOpen,
    selectedId,
    eiSegments,
    updateEISegment,
    activeTab,
    setActiveTab,
  } = useBeamWorkspace();
  const navigate = useNavigate();
  const [isExportOpen, setIsExportOpen] = useState(false);

  const isStressUnavailable = eiSegments.every(s => !s.shape || s.shape.type === 'custom');
  const isDeflectionUnavailable = !deflectionResult.success || deflectionResult.points.length === 0;

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
        <div className="flex gap-2">
          {/* Temporarily hidden for debugging */}
          {false && (
            <button
              onClick={() => setIsExportOpen(true)}
              disabled={!solverResult.success}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <FileDown className="h-3.5 w-3.5 text-primary" />
              <span>Export Report</span>
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-muted transition-all"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset Solver</span>
          </button>
        </div>
      </div>

      {/* Main Builder Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className={`flex flex-col gap-6 ${isSectionBuilderOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <div id="beam-canvas">
            <BeamCanvas />
          </div>

          {/* Diagrams Output */}
          {solverResult.success ? (
            <div className="flex flex-col gap-6">
              <div id="chart-sfd"><ShearForceChart /></div>
              <div id="chart-bmd"><BendingMomentChart /></div>
              <div id="chart-slope"><SlopeChart /></div>
              <div id="chart-deflection"><DeflectionChart /></div>
              <div id="chart-stress-bending"><BendingStressEnvelopeChart /></div>
              <div id="chart-stress-shear"><MaxShearStressChart /></div>
              <StressGradientProfile />
              <InteractiveStressTransformation />
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-xs text-destructive">
              <Info className="h-4 w-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Solving Halted</p>
                <div className="mt-1 text-muted-foreground text-destructive">
                  <MathTextRenderer text={solverResult.error || "Diagrams and detailed equations are only solved for statically determinate structures ($\text{DOI} = 0$). Please adjust supports or internal hinges to resolve."} />
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

      {/* PDF Export Options Modal */}
      <PDFExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        documentType="sfd-bmd"
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        defaultTitle="Beam Design & Stress Analysis Report"
        availableCharts={[
          { id: 'chart-sfd', label: 'Shear Force Diagram (SFD)' },
          { id: 'chart-bmd', label: 'Bending Moment Diagram (BMD)' },
          { 
            id: 'chart-slope', 
            label: 'Slope Diagram (θ)', 
            disabled: isDeflectionUnavailable,
            disabledReason: 'Deflection solver failed'
          },
          { 
            id: 'chart-deflection', 
            label: 'Deflection Diagram (Δ)', 
            disabled: isDeflectionUnavailable,
            disabledReason: 'Deflection solver failed'
          },
          { 
            id: 'chart-stress-bending', 
            label: 'Normal Bending Stress Envelope', 
            disabled: isStressUnavailable,
            disabledReason: 'Bending stress unavailable (requires cross-section template)'
          },
          { 
            id: 'chart-stress-shear', 
            label: 'Maximum Shear Stress Envelope', 
            disabled: isStressUnavailable,
            disabledReason: 'Shear stress unavailable (requires cross-section template)'
          },
        ]}
        availableCalculations={[
          { id: 'breakdown-doi', label: 'Indeterminacy analysis (DOI)', tabToActivate: 'doi' },
          { id: 'breakdown-reactions', label: 'Support Reactions derivation', tabToActivate: 'reactions' },
          { id: 'breakdown-section', label: 'Section Method (Internal equations)', tabToActivate: 'section' },
          { id: 'breakdown-graphical', label: 'Graphical Method derivation', tabToActivate: 'graphical' },
          { 
            id: 'breakdown-deflection', 
            label: 'Deflection Method derivation', 
            tabToActivate: 'double-integration',
            disabled: isDeflectionUnavailable,
            disabledReason: 'Deflection solver failed'
          },
          { 
            id: 'breakdown-stress', 
            label: 'Stress Analysis properties', 
            tabToActivate: 'stress',
            disabled: isStressUnavailable,
            disabledReason: 'Bending/Shear stress unavailable (requires cross-section template)'
          },
        ]}
      />
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
