import React, { useState } from 'react';
import { HelpCircle, Layers, Box, Square } from 'lucide-react';
import { InteractiveCard } from '@/features/presentation/components/elements/InteractiveCard';
import { ParameterSlider } from '@/features/presentation/components/elements/ParameterSlider';
import { CalculationOutput } from '@/features/presentation/components/elements/CalculationOutput';

/**
 * Slide 1: Substructure Layer Cross-Section Profile
 * Demonstrates: Step click sequence animations, visual shapes of sub-grade layers
 */
export function SubstructureEstimationSlide() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  
  const [trenchLength, setTrenchLength] = useState<number>(12.5);
  const [trenchWidth, setTrenchWidth] = useState<number>(1.2);
  const [trenchDepth, setTrenchDepth] = useState<number>(1.5);

  const calculatedVolume = (trenchLength * trenchWidth * trenchDepth).toFixed(2);

  const substructureSteps = [
    { id: 1, name: '1. Earth Excavation', color: 'bg-amber-800' },
    { id: 2, name: '2. Brick Flat Soling', color: 'bg-orange-600' },
    { id: 3, name: '3. Foundation Concrete (CC)', color: 'bg-slate-400' },
    { id: 4, name: '4. Brickwork Footing Steps', color: 'bg-red-700' },
    { id: 5, name: '5. Plinth Level Backfill', color: 'bg-yellow-600' },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-950 text-slate-100 rounded-xl border border-slate-800">
      <div className="flex justify-between items-center border-b border-slate-850 pb-4 mb-6">
        <div>
          <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
            CO2: Prepare BoQ
          </span>
          <h2 className="text-2xl font-extrabold mt-1 text-white tracking-tight">
            Estimation of Building Structure: <span className="text-amber-400">Substructure</span>
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-mono">CEE 0732 2224</p>
          <p className="text-xs font-bold text-slate-500">Class 2 / Sessional</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <InteractiveCard title="Sub-grade Layer Cross-Section Profile">
            <p className="text-xs text-slate-400 mb-4">
              Click through the sequence below to construct the sub-grade components up to the plinth level.
            </p>

            <div className="flex gap-1.5 mb-6 bg-slate-900 p-1.5 rounded-lg border border-slate-800">
              {substructureSteps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-1 py-2 px-1 text-[11px] font-bold rounded transition-all cursor-pointer ${
                    currentStep >= step.id
                      ? `${step.color} text-white shadow-lg shadow-black/20`
                      : 'bg-slate-800 text-slate-500 hover:bg-slate-750'
                  }`}
                >
                  {step.name}
                </button>
              ))}
            </div>

            <div className="relative h-64 bg-slate-900 rounded-lg border border-slate-800 flex flex-col justify-end p-4 overflow-hidden">
              <div className="absolute top-1/4 left-0 right-0 border-t-2 border-dashed border-emerald-500/50 z-10">
                <span className="absolute right-2 -top-2.5 bg-emerald-950 text-emerald-400 text-[9px] font-bold px-1 rounded border border-emerald-500/30">
                  NATURAL GROUND LEVEL (EGL)
                </span>
              </div>

              <div className="absolute top-12 left-0 right-0 border-t-2 border-amber-500/40 z-10">
                <span className="absolute left-2 -top-2.5 bg-amber-950 text-amber-400 text-[9px] font-bold px-1 rounded border border-amber-500/30">
                  PLINTH LEVEL (+0.6m)
                </span>
              </div>

              <div className="w-full max-w-sm mx-auto flex flex-col items-center">
                {currentStep >= 5 && (
                  <div className="w-full bg-yellow-600/30 border-x-2 border-dashed border-yellow-500 text-yellow-300 text-[10px] font-bold py-3 text-center transition-all animate-fadeIn">
                    [LAYER 5] Sand/Earth Plinth Compaction
                  </div>
                )}

                {currentStep >= 4 && (
                  <div className="flex flex-col items-center w-full transition-all animate-fadeIn">
                    <div className="w-24 bg-red-850 border border-red-700 text-red-200 text-[9px] py-1 text-center font-mono font-bold">Step 2: 250mm</div>
                    <div className="w-36 bg-red-900 border border-red-700 text-red-200 text-[9px] py-1 text-center font-mono font-bold">Step 1: 375mm</div>
                  </div>
                )}

                {currentStep >= 3 && (
                  <div className="w-56 bg-slate-500 border border-slate-400 text-slate-900 text-[10px] font-extrabold py-1.5 text-center transition-all animate-fadeIn">
                    [LAYER 3] Foundation CC Base (1:3:6)
                  </div>
                )}

                {currentStep >= 2 && (
                  <div className="w-56 bg-orange-700 border-b border-x border-orange-500 text-orange-100 text-[9px] font-mono py-1 text-center tracking-widest transition-all animate-fadeIn">
                    ▰▰▰ [LAYER 2] BRICK FLAT SOLING (BFS) ▰▰▰
                  </div>
                )}

                {currentStep >= 1 && (
                  <div className="absolute inset-x-8 bottom-0 top-1/4 bg-amber-950/20 border-x-2 border-b-2 border-amber-800/80 pointer-events-none rounded-b flex items-end justify-center">
                    <div className="mb-1 text-amber-500 text-[10px] font-mono bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                      Excavated Boundary: <span className="font-bold text-white">{trenchWidth}m W</span> × <span className="font-bold text-white">{trenchDepth}m D</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </InteractiveCard>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <InteractiveCard title="In-Ground Net Volume Formula">
            <div className="bg-slate-900 p-3 rounded border border-slate-800 mb-4 font-mono text-center">
              <span className="text-slate-400 text-xs">Net Volume ($V$) = </span>
              <span className="text-amber-400 font-bold text-sm">Length × Breadth × Depth</span>
            </div>

            <div className="space-y-4 mb-4">
              <ParameterSlider
                label="Trench Continuous Length (L)"
                min={5}
                max={50}
                step={0.5}
                value={trenchLength}
                onChange={setTrenchLength}
                unit="m"
              />
              <ParameterSlider
                label="Trench Width / Breadth (B)"
                min={0.6}
                max={2.5}
                step={0.05}
                value={trenchWidth}
                onChange={setTrenchWidth}
                unit="m"
              />
              <ParameterSlider
                label="Excavation Depth (D)"
                min={0.5}
                max={3.0}
                step={0.1}
                value={trenchDepth}
                onChange={setTrenchDepth}
                unit="m"
              />
            </div>

            <div className="border-t border-slate-850 pt-4">
              <CalculationOutput 
                label="Net Excavation Quantity (BoQ Entry)" 
                value={`${calculatedVolume} m³`} 
              />
              
              <div className="mt-3 p-2.5 bg-blue-950/40 border border-blue-900/60 rounded text-[11px] text-blue-300">
                <strong className="text-blue-400">Strict Measurement Rule:</strong> Quantities are estimated <span className="underline decoration-amber-400 font-bold text-slate-100 text-xs">net as undisturbed in-ground volumes</span>. Separate bulking factor allowances (soil expansion) are restricted to pricing/haulage analysis only.
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
}

/**
 * Slide 2: Substructure Measurement Principles
 * Demonstrates: Categorized parameter step-cards, live unit calculations
 */
export function SubstructurePrinciplesSlide() {
  const [activeRule, setActiveRule] = useState<number>(1);
  
  const [length, setLength] = useState<number>(10.0);
  const [width, setWidth] = useState<number>(1.2);
  const [depth, setDepth] = useState<number>(1.5);
  const [thickness, setThickness] = useState<number>(0.075);

  const cubicVolume = (length * width * depth).toFixed(2);
  const squareArea = (length * width).toFixed(2);

  const rulesData = [
    {
      id: 1,
      title: "1.1 The Net Core Principle",
      badge: "Strict Rule",
      desc: "Substructure works are calculated net as undisturbed in original positions. Extra working space or shoring allowances are handled strictly in pricing frameworks.",
      color: "border-amber-500 text-amber-400 bg-amber-500/10"
    },
    {
      id: 2,
      title: "1.2 Heavy Mass Items (m³)",
      badge: "Cubic Units",
      desc: "Applied where depth, length, and breadth represent distinct structural constraints. Essential for major excavation, backfill, and structural mass foundations.",
      color: "border-blue-500 text-blue-400 bg-blue-500/10"
    },
    {
      id: 3,
      title: "1.3 Shallow Surface Works (m²)",
      badge: "Square Units",
      desc: "Applied to surface treatments where thickness is a standardized constant parameter. Essential for surface dressings, brick flat soling (BFS), or damp-proof courses (DPC).",
      color: "border-emerald-500 text-emerald-400 bg-emerald-500/10"
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-slate-950 text-slate-100 border border-slate-800 rounded-xl font-sans shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 mb-6 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded">
              CO2: Prepare BoQ
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CEE 0732 2224 • Substructure
            </span>
          </div>
          <h2 className="text-xl font-extrabold mt-1 text-white tracking-tight">
            Principles of Measurement for Substructure Works
          </h2>
        </div>
        
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {rulesData.map((rule) => (
            <button
              key={rule.id}
              onClick={() => setActiveRule(rule.id)}
              className={`px-3 py-1 text-xs font-bold font-mono rounded transition-all cursor-pointer ${
                activeRule === rule.id
                  ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Step {rule.id}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            {rulesData.map((rule) => {
              const isActive = activeRule === rule.id;
              return (
                <div
                  key={rule.id}
                  onClick={() => setActiveRule(rule.id)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                    isActive 
                      ? 'bg-slate-900/90 border-slate-700 shadow-xl shadow-black/40 translate-x-1' 
                      : 'bg-slate-900/30 border-slate-900 opacity-50 hover:opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <h3 className={`text-sm font-extrabold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                      {rule.title}
                    </h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${rule.color}`}>
                      {rule.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-normal">
                    {rule.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-850 flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-[11px] text-slate-400 font-normal">
              <strong className="text-slate-200">Engineering Rule:</strong> Selecting the correct billing dimensional unit prevents geometric structural compounding errors when converting take-offs to formal Bills of Quantities (BoQ).
            </p>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900/60 rounded-xl border border-slate-850 p-4">
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Dynamic Cross-Section Configurator</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">Simulated Sandbox</span>
            </div>
            
            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Continuous Foundation Length (L)</span>
                <span className="font-bold text-white text-xs">{length.toFixed(1)} m</span>
              </div>
              <input
                type="range" min="2" max="30" step="0.5" value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                className="w-full accent-amber-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-ew-resize"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Trench Structural Width (B)</span>
                <span className="font-bold text-white text-xs">{width.toFixed(2)} m</span>
              </div>
              <input
                type="range" min="0.4" max="2.5" step="0.05" value={width}
                onChange={(e) => setWidth(parseFloat(e.target.value))}
                className="w-full accent-blue-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-ew-resize"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                <span>Trench Depth / Surface Constant (D/t)</span>
                <span className="font-bold text-white text-xs">{activeRule === 3 ? `${(thickness * 1000).toFixed(0)} mm` : `${depth.toFixed(2)} m`}</span>
              </div>
              <input
                type="range" 
                min={activeRule === 3 ? "0.05" : "0.3"} 
                max={activeRule === 3 ? "0.15" : "3.0"} 
                step="0.01" 
                value={activeRule === 3 ? thickness : depth}
                onChange={(e) => activeRule === 3 ? setThickness(parseFloat(e.target.value)) : setDepth(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none h-1.5 cursor-ew-resize"
              />
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-850 flex flex-col justify-between space-y-4">
            <div className="relative h-28 bg-slate-900 rounded border border-slate-850 flex items-center justify-center p-2 overflow-hidden">
              {activeRule === 1 && (
                <div className="flex flex-col items-center space-y-1 text-center animate-fadeIn">
                  <div className="relative w-40 h-16 bg-amber-500/20 border-2 border-amber-500 rounded flex items-center justify-center">
                    <span className="text-[10px] font-mono font-extrabold text-amber-300 bg-slate-950 px-2 py-0.5 rounded border border-amber-500/30">
                      NET FIELD BOUNDARY
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">Extra Working Space Disregarded</span>
                </div>
              )}

              {activeRule === 2 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Box className="w-12 h-12 text-blue-400 stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-white font-extrabold">V = L &times; B &times; D</div>
                    <div className="text-[10px] text-blue-400 bg-blue-500/5 border border-blue-500/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                      Heavy Concrete / Excavation
                    </div>
                  </div>
                </div>
              )}

              {activeRule === 3 && (
                <div className="flex items-center gap-3 animate-fadeIn">
                  <Square className="w-12 h-12 text-emerald-400 stroke-[1.5]" />
                  <div className="font-mono text-left">
                    <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">Formula Block</div>
                    <div className="text-xs text-white font-extrabold">A = L &times; B</div>
                    <div className="text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 px-1.5 py-0.5 rounded mt-1 inline-block">
                      BFS / Surface DPC Layer
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-900">
              <div className={`p-2.5 rounded border transition-all ${activeRule === 2 ? 'bg-blue-500/5 border-blue-500/30' : 'bg-slate-900/40 border-slate-850 opacity-40'}`}>
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-blue-400" /> Massive Item Vol
                </div>
                <div className="text-lg font-black font-mono text-white mt-1">
                  {cubicVolume} <span className="text-xs text-blue-400 font-bold">m³</span>
                </div>
              </div>

              <div className={`p-2.5 rounded border transition-all ${activeRule === 3 ? 'bg-emerald-500/5 border-emerald-500/30' : 'bg-slate-900/40 border-slate-850 opacity-40'}`}>
                <div className="text-[9px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Layers className="w-3 h-3 text-emerald-400" /> Surface Area
                </div>
                <div className="text-lg font-black font-mono text-white mt-1">
                  {squareArea} <span className="text-xs text-emerald-400 font-bold">m²</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Slide 3: Bedding, Base & Footing Computations
 * Demonstrates: Layer stacks, dimension sheet modeling, and visual cross-sections
 */
export function SubstructureConcreteComputations() {
  const [activeLayer, setActiveLayer] = useState<number>(1);

  const [footingLength, setFootingLength] = useState<number>(2.40);
  const [footingWidth, setFootingWidth] = useState<number>(2.40);
  const [ccThickness, setCcThickness] = useState<number>(0.075);
  const [rccHeight, setRccHeight] = useState<number>(0.45);

  const bfsSurfaceArea = (footingLength * footingWidth).toFixed(3);
  const leanConcreteVolume = (footingLength * footingWidth * ccThickness).toFixed(3);
  const rccFootingVolume = (footingLength * footingWidth * rccHeight).toFixed(3);

  const stepsData = [
    { id: 1, title: '3.1 Brick Flat Soling (BFS)', unit: 'm²', label: 'Surface Item' },
    { id: 2, title: '3.2 Lean Concrete Base', unit: 'm³', label: 'Volumetric Base' },
    { id: 3, title: '3.3 Reinforced Footing', unit: 'm³', label: 'Structural Mass' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-slate-950 text-slate-100 border border-slate-850 rounded-xl font-sans shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              CO2: Prepare BoQ
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CEE 0732 2224 • Section 3 Foundation Bedding
            </span>
          </div>
          <h2 className="text-xl font-extrabold mt-1 text-white tracking-tight">
            Bedding, Base &amp; Footing Computations
          </h2>
        </div>

        <div className="flex gap-1.5 bg-slate-900 p-1 rounded-lg border border-slate-800">
          {stepsData.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveLayer(step.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded transition-all cursor-pointer ${
                activeLayer === step.id
                  ? 'bg-blue-500 text-white font-black shadow-lg shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {step.title.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-slate-900/40 border border-slate-850 rounded-xl p-5 flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block mb-3">
              Interactive Cross-Section Profiler
            </span>

            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-end items-center p-6 overflow-hidden">
              <div className="absolute top-12 left-0 right-0 border-b border-dashed border-slate-800 pointer-events-none" />
              
              <div className="absolute bottom-6 w-[85%] h-48 border-x border-b border-slate-900/60 bg-slate-900/10 pointer-events-none rounded-b flex items-start justify-between px-2 text-[9px] font-mono text-slate-600">
                <span>Trench Edge</span>
                <span>Undisturbed Earth</span>
                <span>Trench Edge</span>
              </div>

              <div className="w-full flex flex-col items-center z-10 space-y-0.5 max-w-xs pb-6">
                {/* Layer 3: RCC Footing Block */}
                <div className={`w-36 bg-slate-700 border border-slate-500 rounded text-center text-[10px] py-4 transition-all ${activeLayer >= 3 ? 'opacity-100 scale-100' : 'opacity-10 scale-95'}`}>
                  <span className="font-extrabold text-white block">RCC Footing</span>
                  <span className="text-[9px] text-slate-300 font-mono">D = {rccHeight.toFixed(2)}m</span>
                </div>

                {/* Layer 2: CC Bedding */}
                <div className={`w-48 bg-slate-500 border border-slate-400 text-slate-950 text-center text-[9px] font-bold py-1.5 transition-all ${activeLayer >= 2 ? 'opacity-100' : 'opacity-10'}`}>
                  Lean Concrete Bedding (D = {ccThickness.toFixed(3)}m)
                </div>

                {/* Layer 1: BFS flat brick soling */}
                <div className={`w-48 bg-orange-700 border border-orange-500 text-orange-100 text-center text-[8px] font-mono py-1 tracking-widest transition-all ${activeLayer >= 1 ? 'opacity-100' : 'opacity-10'}`}>
                  ▰▰▰ BRICK FLAT SOLING (BFS) ▰▰▰
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between">
          <InteractiveCard title="Material Properties Sandbox">
            <div className="space-y-4 mb-4">
              <ParameterSlider
                label="Footing Length (L)"
                min={1.0}
                max={4.0}
                step={0.1}
                value={footingLength}
                onChange={setFootingLength}
                unit="m"
              />
              <ParameterSlider
                label="Footing Width (B)"
                min={1.0}
                max={4.0}
                step={0.1}
                value={footingWidth}
                onChange={setFootingWidth}
                unit="m"
              />
              {activeLayer === 2 && (
                <ParameterSlider
                  label="CC Base Thickness"
                  min={0.05}
                  max={0.15}
                  step={0.01}
                  value={ccThickness}
                  onChange={setCcThickness}
                  unit="m"
                />
              )}
              {activeLayer === 3 && (
                <ParameterSlider
                  label="RCC Footing Height"
                  min={0.25}
                  max={1.0}
                  step={0.05}
                  value={rccHeight}
                  onChange={setRccHeight}
                  unit="m"
                />
              )}
            </div>

            <div className="border-t border-slate-850 pt-4">
              <CalculationOutput
                label={stepsData[activeLayer - 1].title.split(': ')[1]}
                value={
                  activeLayer === 1 ? `${bfsSurfaceArea} m²` :
                  activeLayer === 2 ? `${leanConcreteVolume} m³` : `${rccFootingVolume} m³`
                }
              />
              
              <div className="mt-3 p-2 bg-slate-900 border border-slate-800 rounded font-mono text-[10px] text-center text-slate-400">
                {activeLayer === 1 ? (
                  <span>BFS Formula: Area = L &times; B</span>
                ) : activeLayer === 2 ? (
                  <span>CC Vol Formula: Vol = L &times; B &times; Thickness</span>
                ) : (
                  <span>RCC Vol Formula: Vol = L &times; B &times; Height</span>
                )}
              </div>
            </div>
          </InteractiveCard>
        </div>
      </div>
    </div>
  );
}

/**
 * Slide 4: Centre Line Method & T-Junction Deductions
 * Demonstrates: T-Junction double counting visual overlay and outside B dimension ticks
 */
export function SubstructureTJunctionDeduction() {
  const [clickedJunction, setClickedJunction] = useState<boolean>(true);
  const [totalLength, setTotalLength] = useState<number>(32.40);
  const [wallBreadth, setWallBreadth] = useState<number>(0.30);
  const [junctionsCount, setJunctionsCount] = useState<number>(2);

  const netLength = (totalLength - 0.5 * wallBreadth * junctionsCount).toFixed(3);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-slate-950 text-slate-100 border border-slate-850 rounded-xl font-sans shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-850 pb-4 mb-6 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-widest uppercase px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded">
              CO2: Prepare BoQ
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              CEE 0732 2224 • Centerline Deductions
            </span>
          </div>
          <h2 className="text-xl font-extrabold mt-1 text-white tracking-tight">
            Centre Line Method: T-Junction Deductions
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <p className="text-xs text-slate-400 leading-relaxed">
              When tracing continuous centerlines, junction intersection zones are double-counted. For every T-junction, a correction factor is required.
            </p>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wider">The Centerline Deduction Rule</h4>
              <p className="text-xs text-slate-300">
                Deduct <span className="text-amber-400 font-bold">0.5 &times; Breadth (B)</span> from the total centerline length for each T-junction.
              </p>
              <div className="mt-3 font-mono text-xs text-slate-400">
                Formula: Net L = Total L - (0.5 &times; B &times; N)
              </div>
            </div>
            <div className="p-3 bg-slate-900/60 border border-slate-850 rounded-lg text-[11px] text-slate-400">
              <strong>Note:</strong> L-corners do not require any deductions since the centerline path perfectly balances inner and outer area boundaries.
            </div>
          </div>

          <div className="space-y-4">
            <ParameterSlider
              label="Total Centerline Length (L)"
              min={10.0}
              max={100.0}
              step={0.5}
              value={totalLength}
              onChange={setTotalLength}
              unit=" m"
            />
            <ParameterSlider
              label="Wall Breadth (B)"
              min={0.15}
              max={1.0}
              step={0.05}
              value={wallBreadth}
              onChange={setWallBreadth}
              unit=" m"
            />
            <ParameterSlider
              label="Number of T-Junctions (N)"
              min={1}
              max={10}
              step={1}
              value={junctionsCount}
              onChange={setJunctionsCount}
              unit=""
            />
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-900/60 rounded-xl border border-slate-850 p-4">
          <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-center p-4">
            <svg width="220" height="200" viewBox="0 0 220 200" className="cursor-pointer select-none">
              {/* Horizontal Wall Outer Boundaries */}
              <rect x="20" y="40" width="180" height="40" className="fill-slate-800 stroke-slate-700" strokeWidth="1.5" />
              {/* Vertical Wall Outer Boundaries */}
              <rect x="90" y="80" width="40" height="80" className="fill-slate-800 stroke-slate-700" strokeWidth="1.5" />
              
              {/* Centerlines */}
              <line x1="20" y1="60" x2="200" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
              <line x1="110" y1="60" x2="110" y2="160" stroke="#f59e0b" strokeWidth="2" strokeDasharray="5,3" />
              
              {/* Overlapping Junction Highlight Area (Inner Half: y=60 to y=80, height = 0.5 * B) */}
              <rect 
                x="90" 
                y="60" 
                width="40" 
                height="20" 
                fill={clickedJunction ? '#ef4444' : '#3b82f6'} 
                fillOpacity="0.45"
                stroke={clickedJunction ? '#ef4444' : '#60a5fa'}
                strokeWidth="1.5"
                onClick={() => setClickedJunction(!clickedJunction)}
                className="transition-colors duration-350"
              />
              
              {/* Text labels */}
              <text x="50" y="30" className="fill-slate-400" fontSize="10" textAnchor="middle" fontWeight="bold">Horizontal Main Wall</text>
              <text x="110" y="125" className="fill-slate-500" fontSize="9" textAnchor="middle" fontWeight="bold">Cross Wall</text>
              
              {/* Outside dimension line for B (Width of vertical wall) */}
              <line x1="90" y1="160" x2="90" y2="188" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.3" />
              <line x1="130" y1="160" x2="130" y2="188" stroke="currentColor" strokeWidth="0.75" strokeDasharray="2,2" opacity="0.3" />
              
              {/* Dimension line line */}
              <line x1="90" y1="180" x2="130" y2="180" stroke="#ef4444" strokeWidth="1.2" />
              {/* Architectural diagonal ticks */}
              <line x1="87" y1="183" x2="93" y2="177" stroke="#ef4444" strokeWidth="1.5" />
              <line x1="127" y1="183" x2="133" y2="177" stroke="#ef4444" strokeWidth="1.5" />
              
              <text x="110" y="174" className="fill-amber-400 font-mono font-black text-xs" textAnchor="middle">B</text>
              
              {/* Interactive Highlight tag */}
              <g transform="translate(110, 60)" onClick={() => setClickedJunction(!clickedJunction)}>
                <circle r="8" className="fill-amber-400 animate-ping" opacity="0.4" />
                <circle r="4" className="fill-amber-400" />
              </g>
            </svg>
            
            {clickedJunction && (
              <div className="absolute top-2 right-2 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] p-2 rounded-md font-mono">
                <strong>Double-counted:</strong>
                <br />
                Deduction = 0.5 &times; B
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-850">
            <CalculationOutput 
              label="Corrected Net Centerline Length" 
              value={`${netLength} m`} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

