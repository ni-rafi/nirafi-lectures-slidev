import React from 'react';
import { useInfluenceWorkspace } from '../../context/InfluenceLinesWorkspaceContext';
import { IMovingVehicle, IAxleLoad } from '../../../../cores/influence-lines/influence-lines.interface';
import { Plus, Trash2, Sliders, Truck } from 'lucide-react';

const PRESETS: IMovingVehicle[] = [
    {
        name: 'AASHTO HS20-44 Truck',
        axles: [
            { id: 'Front', load: 35.6, spacingFromPrevious: 0 },
            { id: 'Middle', load: 142.4, spacingFromPrevious: 4.3 },
            { id: 'Rear', load: 142.4, spacingFromPrevious: 4.3 },
        ],
    },
    {
        name: 'AASHTO H20-44 Truck',
        axles: [
            { id: 'Front', load: 35.6, spacingFromPrevious: 0 },
            { id: 'Rear', load: 142.4, spacingFromPrevious: 4.3 },
        ],
    },
    {
        name: 'Cooper E80 Train bogey',
        axles: [
            { id: 'Axle 1', load: 178, spacingFromPrevious: 0 },
            { id: 'Axle 2', load: 356, spacingFromPrevious: 1.5 },
            { id: 'Axle 3', load: 356, spacingFromPrevious: 1.5 },
            { id: 'Axle 4', load: 356, spacingFromPrevious: 1.5 },
        ],
    },
];

export const MovingVehicleConfigurator: React.FC = () => {
    const {
        length,
        activeVehicle,
        transitPosition,
        setActiveVehicle,
        setTransitPosition,
    } = useInfluenceWorkspace();

    const getPresetValue = () => {
        if (!activeVehicle) return 'None';
        const presetExists = PRESETS.some((p) => p.name === activeVehicle.name);
        return presetExists ? activeVehicle.name : 'Custom';
    };

    const handleSelectPreset = (name: string) => {
        if (name === 'None') {
            setActiveVehicle(null);
        } else if (name === 'Custom') {
            setActiveVehicle({
                name: 'Custom Load Train',
                axles: [{ id: 'Axle 1', load: 50, spacingFromPrevious: 0 }],
            });
        } else {
            const preset = PRESETS.find((p) => p.name === name);
            if (preset) setActiveVehicle(preset);
        }
        setTransitPosition(0);
    };

    const handleUpdateAxle = (idx: number, field: keyof IAxleLoad, val: number) => {
        if (!activeVehicle) return;
        const updatedAxles = activeVehicle.axles.map((a, i) => {
            if (i === idx) {
                return { ...a, [field]: val };
            }
            return a;
        });
        setActiveVehicle({ ...activeVehicle, axles: updatedAxles });
    };

    const handleAddAxle = () => {
        if (!activeVehicle) return;
        const newAxle: IAxleLoad = {
            id: `Axle ${activeVehicle.axles.length + 1}`,
            load: 50,
            spacingFromPrevious: 3.0,
        };
        setActiveVehicle({
            ...activeVehicle,
            axles: [...activeVehicle.axles, newAxle],
        });
    };

    const handleDeleteAxle = (idx: number) => {
        if (!activeVehicle || activeVehicle.axles.length <= 1) return;
        const updatedAxles = activeVehicle.axles.filter((_, i) => i !== idx);
        // Force leading axle spacing back to 0
        if (updatedAxles[0]) {
            updatedAxles[0].spacingFromPrevious = 0;
        }
        setActiveVehicle({ ...activeVehicle, axles: updatedAxles });
    };

    // Calculate total length of active vehicle
    const getVehicleLength = () => {
        if (!activeVehicle) return 0;
        return activeVehicle.axles.reduce((sum, a) => sum + a.spacingFromPrevious, 0);
    };

    const maxTransitLimit = length + getVehicleLength();

    const currentPreset = getPresetValue();

    return (
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card/60 p-5 backdrop-blur-md">
            <div className="border-b border-border/40 pb-2 flex items-center justify-between">
                <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                        <Truck className="h-3.5 w-3.5" />
                        <span>Moving Vehicle Configurator</span>
                    </h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Select a vehicle preset or configure custom axles spacing</p>
                </div>
            </div>

            {/* Preset Selector */}
            <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Vehicle Model:
                </label>
                <select
                    value={currentPreset}
                    onChange={(e) => handleSelectPreset(e.target.value)}
                    className="w-full rounded-lg border border-border bg-background/50 px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                    <option value="None">None (Static Influence Lines Only)</option>
                    {PRESETS.map((p) => (
                        <option key={p.name} value={p.name}>
                            {p.name}
                        </option>
                    ))}
                    <option value="Custom">Custom Vehicle...</option>
                </select>
            </div>

            {/* Custom Axle Builder Table (if Custom is chosen) */}
            {activeVehicle && (
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Axle Spacing & Loads:
                        </span>
                        {currentPreset === 'Custom' && (
                            <button
                                onClick={handleAddAxle}
                                className="flex items-center gap-1 rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-[9px] font-semibold text-primary hover:bg-primary/20 transition-all"
                            >
                                <Plus className="h-3 w-3" />
                                <span>Add Axle</span>
                            </button>
                        )}
                    </div>
                    <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {activeVehicle.axles.map((a, idx) => (
                            <div key={idx} className="flex items-center gap-2 bg-background/30 p-2 rounded-lg border border-border/40">
                                <span className="text-[10px] font-bold text-muted-foreground w-12 truncate">{a.id}</span>
                                <div className="flex flex-1 items-center gap-1">
                                    <input
                                        type="number"
                                        disabled={currentPreset !== 'Custom'}
                                        value={a.load}
                                        onChange={(e) => handleUpdateAxle(idx, 'load', parseFloat(e.target.value) || 0)}
                                        className="w-14 rounded border border-border bg-background/50 px-1 py-0.5 text-[10px] text-center focus:outline-none"
                                        title="Load (kN)"
                                    />
                                    <span className="text-[9px] text-muted-foreground">kN</span>
                                </div>
                                {idx > 0 && (
                                    <div className="flex flex-1 items-center gap-1">
                                        <input
                                            type="number"
                                            disabled={currentPreset !== 'Custom'}
                                            value={a.spacingFromPrevious}
                                            onChange={(e) => handleUpdateAxle(idx, 'spacingFromPrevious', parseFloat(e.target.value) || 0)}
                                            className="w-12 rounded border border-border bg-background/50 px-1 py-0.5 text-[10px] text-center focus:outline-none"
                                            title="Spacing from previous (m)"
                                        />
                                        <span className="text-[9px] text-muted-foreground">m</span>
                                    </div>
                                )}
                                {currentPreset === 'Custom' && activeVehicle.axles.length > 1 && (
                                    <button
                                        onClick={() => handleDeleteAxle(idx)}
                                        className="text-muted-foreground hover:text-destructive transition-all"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Transit Position Slider */}
            {activeVehicle && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border/40">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                            <Sliders className="h-3 w-3" />
                            <span>Transit Leading Axle (x):</span>
                        </label>
                        <span className="text-xs font-black text-primary select-text">
                            {transitPosition.toFixed(2)} m
                        </span>
                    </div>
                    <input
                        type="range"
                        min={0}
                        max={maxTransitLimit}
                        step={0.1}
                        value={transitPosition}
                        onChange={(e) => setTransitPosition(parseFloat(e.target.value))}
                        className="h-1.5 w-full cursor-ew-resize appearance-none rounded-lg bg-secondary accent-primary"
                    />
                </div>
            )}
        </div>
    );
};
export default MovingVehicleConfigurator;
