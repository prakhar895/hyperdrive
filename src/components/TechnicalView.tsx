import React, { useState, KeyboardEvent } from 'react';
import { HOTSPOT_MODULES } from '../data/configOptions';
import { HotspotModule } from '../types';
import { Download, Layers, ShieldCheck, Activity } from 'lucide-react';

export const TechnicalView: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<HotspotModule>(HOTSPOT_MODULES[0]);

  // Handle keyboard navigation across hotspots
  const handleHotspotKeyDown = (e: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (currentIndex + 1) % HOTSPOT_MODULES.length;
      setSelectedModule(HOTSPOT_MODULES[nextIdx]);
      document.getElementById(`hotspot-btn-${HOTSPOT_MODULES[nextIdx].id}`)?.focus();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (currentIndex - 1 + HOTSPOT_MODULES.length) % HOTSPOT_MODULES.length;
      setSelectedModule(HOTSPOT_MODULES[prevIdx]);
      document.getElementById(`hotspot-btn-${HOTSPOT_MODULES[prevIdx].id}`)?.focus();
    }
  };

  const handleDownloadSchematics = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(
        JSON.stringify(
          {
            chassis: 'HyperDrive Gen-IV Carbo-Titanium Platform',
            architecture: '950V High-Discharge Immersion Matrix',
            modules: HOTSPOT_MODULES,
            telemetrySamplingRate: '100Hz Real-Time Bus',
            generatedDate: new Date().toISOString(),
            compliance: 'FIA GT Technical Regulations & Global EV Protocol',
          },
          null,
          2
        )
      );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `hyperdrive_schematics_${selectedModule.id}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div id="technical-view" className="w-full flex-1 flex flex-col bg-background min-h-[calc(100vh-80px)] px-4 sm:px-8 lg:px-16 py-8 select-none">
      <div className="max-w-[1440px] mx-auto w-full space-y-8">
        {/* Title Header matching Screenshot 9 */}
        <div>
          <span className="font-label-sm text-xs text-primary-container tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container" />
            TECHNICAL DOCUMENTATION
          </span>
          <h1 className="font-headline-md text-4xl sm:text-6xl text-primary font-bold tracking-tighter mt-2">
            SYSTEM ARCHITECTURE
          </h1>
          <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2">
            A high-fidelity structural analysis of the core engineering platform. Select modules below to
            reveal telemetry and material specifications.
          </p>
        </div>

        {/* Main 2-Column Technical Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* ============================================================== */}
          {/* Left: Interactive Isometric Chassis Blueprint (2 cols)         */}
          {/* ============================================================== */}
          <div className="lg:col-span-2 bg-level-1 border border-[#2A2C32] rounded p-6 sm:p-8 relative flex flex-col justify-between overflow-hidden min-h-[480px]">
            {/* Top Blueprint Metadata Overlays */}
            <div className="flex justify-between items-start z-20 pointer-events-none">
              <div className="flex flex-col">
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider">
                  HYPERDRIVE // CHASSIS OVERVIEW
                </span>
                <span className="font-spec-data text-xs text-on-surface-variant font-mono">
                  BATTERY PACK: 950V // TEMP: 42°C
                </span>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-[10px] text-outline uppercase tracking-wider block">
                  SCALE: 1:4
                </span>
                <span className="font-label-sm text-[10px] text-primary-container font-mono">
                  AXIS: ISOMETRIC
                </span>
              </div>
            </div>

            {/* Central Schematic Illustration / Vector Canvas */}
            <div className="relative my-auto w-full max-w-[760px] mx-auto z-10 flex items-center justify-center py-6">
              {/* Technical SVG Blueprint Background */}
              <svg viewBox="0 0 800 450" className="w-full h-auto select-none" role="img" aria-label="Isometric structural schematic of HyperDrive chassis">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E2116" strokeWidth="0.5" />
                  </pattern>
                </defs>

                {/* Technical Grid Floor */}
                <rect width="800" height="450" fill="url(#grid-pattern)" opacity="0.6" />

                {/* Ghosted Hypercar Silhouette */}
                <path
                  d="M100 290 C120 250 180 200 280 180 C400 160 520 120 620 120 C720 120 780 160 840 220 C880 260 860 330 780 370 L200 370 Z"
                  fill="#0D0F06"
                  stroke="#2A2C32"
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                />

                {/* 1. FRONT AERO & SPLITTER NODE (01) */}
                <g id="schematic-aero" className={selectedModule.number === '01' ? 'opacity-100' : 'opacity-70'}>
                  <path d="M90 280 L180 320 L240 310 L160 260 Z" fill="#14532D" fillOpacity="0.4" stroke="#C7F04A" strokeWidth="1.5" />
                  <line x1="160" y1="260" x2="200" y2="180" stroke="#C7F04A" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="205" y="175" fill="#C7F04A" fontSize="10" fontFamily="JetBrains Mono">AERO WINGLET // 4 NODES</text>
                </g>

                {/* 2. CARBON MONOCOQUE SURVIVAL CELL (02) */}
                <g id="schematic-tub" className={selectedModule.number === '02' ? 'opacity-100' : 'opacity-70'}>
                  <path d="M260 220 L520 180 L580 310 L280 330 Z" fill="#1E293B" fillOpacity="0.85" stroke="#60A5FA" strokeWidth="2" />
                  <line x1="400" y1="200" x2="380" y2="130" stroke="#60A5FA" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="320" y="125" fill="#93C5FD" fontSize="10" fontFamily="JetBrains Mono">MONOCOQUE // 48k Nm/deg</text>
                </g>

                {/* 3. MODULAR 950V BATTERY MATRIX (03) */}
                <g id="schematic-battery" className={selectedModule.number === '03' ? 'opacity-100' : 'opacity-70'}>
                  <polygon points="320,320 620,300 640,360 300,360" fill="#064E3B" stroke="#34D399" strokeWidth="2" />
                  <line x1="470" y1="330" x2="470" y2="410" stroke="#34D399" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="400" y="425" fill="#6EE7B7" fontSize="10" fontFamily="JetBrains Mono">950V IMMERSION MATRIX (100 kWh)</text>
                </g>

                {/* 4. DUAL REAR E-MOTORS & INVERTER (04) */}
                <g id="schematic-motors" className={selectedModule.number === '04' ? 'opacity-100' : 'opacity-70'}>
                  <circle cx="680" cy="270" r="32" fill="#78350F" stroke="#FBBF24" strokeWidth="2" />
                  <rect x="650" y="210" width="60" height="35" rx="3" fill="#854D0E" stroke="#FBBF24" strokeWidth="1.5" />
                  <line x1="680" y1="210" x2="680" y2="150" stroke="#FBBF24" strokeWidth="1" strokeDasharray="3 2" />
                  <text x="640" y="145" fill="#FDE68A" fontSize="10" fontFamily="JetBrains Mono">REAR E-MOTOR + INVERTER</text>
                </g>

                {/* Suspension Pushrod Links */}
                <line x1="220" y1="300" x2="270" y2="250" stroke="#94A3B8" strokeWidth="2" />
                <line x1="710" y1="280" x2="650" y2="240" stroke="#94A3B8" strokeWidth="2" />
              </svg>

              {/* Accessible Interactive Hotspot Buttons Overlaid Exactly */}
              {HOTSPOT_MODULES.map((mod, idx) => {
                const isSelected = selectedModule.id === mod.id;
                return (
                  <button
                    key={mod.id}
                    id={`hotspot-btn-${mod.id}`}
                    onClick={() => setSelectedModule(mod)}
                    onKeyDown={(e) => handleHotspotKeyDown(e, idx)}
                    aria-label={`Module ${mod.number}: ${mod.name}`}
                    aria-pressed={isSelected}
                    aria-controls="module-diagnostics-panel"
                    className={`absolute w-8 h-8 rounded-full flex items-center justify-center font-spec-data text-xs font-bold transition-all cursor-pointer z-30 shadow-lg ${
                      isSelected
                        ? 'bg-primary-container text-background border-2 border-primary ring-4 ring-primary-container/30 scale-125'
                        : 'bg-level-1 border border-primary-container text-primary-container hover:bg-primary-container hover:text-background'
                    }`}
                    style={{
                      left: `${mod.position.x}%`,
                      top: `${mod.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {mod.number}
                  </button>
                );
              })}
            </div>

            {/* Bottom Status Readout */}
            <div className="flex items-center gap-2 z-20 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-pulse" />
              <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest">
                LIVE TELEMETRY ACTIVE // 100 HZ SAMPLE BUS
              </span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* Right: Module Diagnostics Panel (Matching Screenshot 9)        */}
          {/* ============================================================== */}
          <aside
            id="module-diagnostics-panel"
            aria-live="polite"
            className="bg-level-1 border border-[#2A2C32] rounded p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex justify-between items-center border-b border-[#2A2C32] pb-4 mb-6">
                <span className="font-label-sm text-xs text-primary-container uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-container" />
                  MODULE DIAGNOSTICS
                </span>
                <span className="font-spec-data text-xs text-on-surface-variant font-mono">
                  [{selectedModule.number}]
                </span>
              </div>

              {/* Title & Description */}
              <h2 className="font-headline-md text-2xl sm:text-3xl text-primary font-bold tracking-tight mb-3">
                {selectedModule.title}
              </h2>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed mb-8">
                {selectedModule.description}
              </p>

              {/* 4-Cell Technical Spec Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {selectedModule.specs.downforce && (
                  <div className="border-l-2 border-primary-container pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      DOWNFORCE (250KM/H)
                    </span>
                    <span className="font-spec-data text-base text-primary font-bold font-mono">
                      {selectedModule.specs.downforce}
                    </span>
                  </div>
                )}

                {selectedModule.specs.dragCoefficient && (
                  <div className="border-l-2 border-primary-container pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      DRAG COEFFICIENT
                    </span>
                    <span className="font-spec-data text-base text-primary font-bold font-mono">
                      {selectedModule.specs.dragCoefficient}
                    </span>
                  </div>
                )}

                {selectedModule.specs.material && (
                  <div className="border-l-2 border-outline pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      MATERIAL MATRIX
                    </span>
                    <span className="font-spec-data text-base text-primary font-mono">
                      {selectedModule.specs.material}
                    </span>
                  </div>
                )}

                {selectedModule.specs.activeElements && (
                  <div className="border-l-2 border-outline pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      ACTIVE ACTUATION
                    </span>
                    <span className="font-spec-data text-base text-primary font-mono">
                      {selectedModule.specs.activeElements}
                    </span>
                  </div>
                )}

                {selectedModule.specs.voltage && (
                  <div className="border-l-2 border-primary-container pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      BUS VOLTAGE
                    </span>
                    <span className="font-spec-data text-base text-primary font-bold font-mono">
                      {selectedModule.specs.voltage}
                    </span>
                  </div>
                )}

                {selectedModule.specs.energyDensity && (
                  <div className="border-l-2 border-primary-container pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      ENERGY DENSITY
                    </span>
                    <span className="font-spec-data text-base text-primary font-bold font-mono">
                      {selectedModule.specs.energyDensity}
                    </span>
                  </div>
                )}

                {selectedModule.specs.peakTorque && (
                  <div className="border-l-2 border-primary-container pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      PEAK TORQUE
                    </span>
                    <span className="font-spec-data text-base text-primary font-bold font-mono">
                      {selectedModule.specs.peakTorque}
                    </span>
                  </div>
                )}

                {selectedModule.specs.responseLatency && (
                  <div className="border-l-2 border-outline pl-3 py-1">
                    <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider block">
                      RESPONSE LATENCY
                    </span>
                    <span className="font-spec-data text-base text-primary font-mono">
                      {selectedModule.specs.responseLatency}
                    </span>
                  </div>
                )}
              </div>

              {/* Efficiency Metric Gauge */}
              <div className="border-t border-[#2A2C32] pt-4 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                    SYSTEM EFFICIENCY
                  </span>
                  <span className="font-spec-data text-lg text-primary-container font-bold">
                    {selectedModule.efficiencyPct}%
                  </span>
                </div>
                {/* 2px Track Gauge per DESIGN.md */}
                <div className="w-full h-1 bg-[#2A2C32] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-container transition-all duration-500 rounded-full"
                    style={{ width: `${selectedModule.efficiencyPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Action: Download Schematics */}
            <button
              id="download-schematics-btn"
              onClick={handleDownloadSchematics}
              className="w-full py-3.5 border border-[#2A2C32] text-primary hover:border-primary-container hover:text-primary-container transition-all rounded font-label-sm text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD SCHEMATICS (JSON)</span>
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
};
