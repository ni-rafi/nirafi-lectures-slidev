import React from 'react';
import { useBeamWorkspace } from '../../context/BeamWorkspaceContext';
import { SupportConfig } from './config/SupportConfig';
import { ReleaseConfig } from './config/ReleaseConfig';
import { LoadConfig } from './config/LoadConfig';
import { EISegmentConfig } from './config/EISegmentConfig';

export const ElementConfigurator: React.FC = () => {
  const {
    length,
    setLength,
    supports,
    updateSupport,
    deleteSupport,
    releases,
    updateRelease,
    deleteRelease,
    loads,
    updateLoad,
    deleteLoad,
    eiSegments,
    updateEISegment,
    deleteEISegment,
    splitEISegment,
    selectedId,
  } = useBeamWorkspace();

  const activeSupport = supports.find(s => s.id === selectedId);
  const activeRelease = releases.find(r => r.id === selectedId);
  const activeLoad = loads.find(l => l.id === selectedId);
  const activeEISegment = eiSegments.find(s => s.id === selectedId);

  const renderContent = () => {
    if (activeSupport) {
      return (
        <SupportConfig
          activeSupport={activeSupport}
          length={length}
          updateSupport={updateSupport}
          deleteSupport={deleteSupport}
        />
      );
    }

    if (activeRelease) {
      return (
        <ReleaseConfig
          activeRelease={activeRelease}
          length={length}
          updateRelease={updateRelease}
          deleteRelease={deleteRelease}
        />
      );
    }

    if (activeLoad) {
      return (
        <LoadConfig
          activeLoad={activeLoad}
          length={length}
          updateLoad={updateLoad}
          deleteLoad={deleteLoad}
        />
      );
    }

    if (activeEISegment) {
      return (
        <EISegmentConfig
          activeEISegment={activeEISegment}
          eiSegments={eiSegments}
          updateEISegment={updateEISegment}
          deleteEISegment={deleteEISegment}
          splitEISegment={splitEISegment}
        />
      );
    }

    return (
      <div className="flex h-full flex-col items-center justify-center py-6 text-center text-xs text-muted-foreground">
        <p>Select a support, load, release, or stiffness segment on the canvas to configure properties</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/40 p-4 backdrop-blur-md min-h-[220px]">
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Configuration Panel</div>
      
      {/* Permanent Beam Properties */}
      <div className="flex flex-col gap-3 border-b border-border pb-2">
        <h3 className="text-sm font-semibold text-primary">Beam Properties</h3>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-muted-foreground">Beam Length (meters)</label>
          <input
            type="number"
            min={1}
            max={50}
            step={0.5}
            value={length}
            onChange={(e) => setLength(parseFloat(e.target.value) || 6)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Element Specific Configuration */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};
