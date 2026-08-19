import React from 'react';
import { useConfig } from '../context/ConfigContext';
import { VehicleRenderer } from './VehicleRenderer';
import {
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  INTERIOR_OPTIONS,
  TRIM_OPTIONS,
} from '../data/configOptions';
import { PaintId, WheelId, InteriorId, TrimId } from '../types';
import { Lock } from 'lucide-react';

export const ConfiguratorView: React.FC = () => {
  const {
    config,
    dispatch,
    pricing,
    currentPaint,
    setIsSpecLocked,
    setIsReserveModalOpen,
  } = useConfig();

  // Dynamic aero readouts based on configuration
  const dragCd = config.activeAero ? '0.28 Cd' : '0.21 Cd';
  const downforce = config.activeAero ? '850 kg @ 250km/h' : '320 kg @ 250km/h';

  const caliperOptions: { id: 'lime' | 'amber' | 'stealth' | 'red'; label: string; color: string }[] = [
    { id: 'lime', label: 'Electric Lime', color: '#C7F04A' },
    { id: 'amber', label: 'Solar Amber', color: '#FB923C' },
    { id: 'stealth', label: 'Stealth Dark', color: '#33362A' },
    { id: 'red', label: 'Competition Red', color: '#EF4444' },
  ];

  return (
    <div id="configurator-view" className="flex-1 flex flex-col lg:flex-row overflow-hidden relative min-h-[calc(100vh-80px)] select-none">
      {/* ========================================================= */}
      {/* Left: 5-Layer Composite Preview Canvas (2/3)              */}
      {/* ========================================================= */}
      <section className="w-full lg:w-2/3 min-h-[460px] lg:min-h-full relative flex flex-col items-center justify-center bg-[#0C0C0E] p-4 sm:p-8 overflow-hidden">
        {/* Radial Floor Lighting Gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 65%, rgba(199, 240, 74, 0.05) 0%, rgba(12, 12, 14, 0.95) 60%, rgba(12, 12, 14, 1) 100%)',
          }}
        />

        {/* Technical Telemetry Overlays Top-Left */}
        <div className="absolute top-6 left-6 flex flex-col gap-4 z-20 pointer-events-none">
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-[#8C9280] uppercase tracking-widest">
              DRAG COEFFICIENT
            </span>
            <span className="font-spec-data text-base sm:text-xl text-[#E5E8D9] font-medium">
              {dragCd}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-sm text-[11px] text-[#8C9280] uppercase tracking-widest">
              DOWNFORCE
            </span>
            <span className="font-spec-data text-base sm:text-xl text-[#C7F04A] font-medium">
              {downforce}
            </span>
          </div>
        </div>

        {/* Main Supercar 5-Layer Composite Display */}
        <div className="relative w-full max-w-[1020px] z-10 flex items-center justify-center my-auto drop-shadow-2xl">
          <VehicleRenderer config={config} isConfigurator={true} className="w-full h-auto" />
        </div>

        {/* Active Aero Engaged Status Bottom-Right */}
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-3">
          <button
            id="toggle-aero-btn"
            onClick={() => dispatch({ type: 'TOGGLE_ACTIVE_AERO' })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all cursor-pointer ${
              config.activeAero
                ? 'bg-[#17181C] border-[#C7F04A] text-[#C7F04A]'
                : 'bg-[#17181C]/50 border-[#2A2C32] text-[#8C9280] hover:text-[#E5E8D9]'
            }`}
            aria-pressed={config.activeAero}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                config.activeAero ? 'bg-[#C7F04A] animate-pulse' : 'bg-[#444936]'
              }`}
            />
            <span className="font-label-sm text-[11px] uppercase tracking-widest font-mono">
              {config.activeAero ? 'ACTIVE AERO ENGAGED' : 'AERO DEPLOYED: OFF'}
            </span>
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* Right: Technical Control Panel (1/3)                      */}
      {/* ========================================================= */}
      <aside className="w-full lg:w-1/3 h-full bg-[#121316] border-l border-[#2A2C32] flex flex-col z-20 overflow-hidden">
        {/* Scrollable Configuration Modules */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          <div className="flex justify-between items-baseline">
            <h1 className="font-headline-md text-3xl sm:text-4xl text-[#E5E8D9] tracking-tighter">
              SPECIFICATION
            </h1>
            <span className="font-label-sm text-xs text-[#C7F04A] tracking-widest uppercase font-mono">
              V.2.4 MATRIX
            </span>
          </div>

          {/* Section 0: POWERTRAIN & CHASSIS TRIM */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="font-label-sm text-xs text-[#8C9280] tracking-widest uppercase">
                CHASSIS TRIM
              </h2>
              <span className="font-spec-data text-xs text-[#E5E8D9] font-mono">
                {TRIM_OPTIONS.find((t) => t.id === config.trim)?.name}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {TRIM_OPTIONS.map((trim) => {
                const isSelected = config.trim === trim.id;
                return (
                  <button
                    key={trim.id}
                    id={`trim-opt-${trim.id}`}
                    onClick={() => dispatch({ type: 'SET_TRIM', payload: trim.id as TrimId })}
                    className={`p-3 bg-[#0C0C0E] border rounded text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-2 border-[#C7F04A] ring-1 ring-[#C7F04A]'
                        : 'border-[#2A2C32] hover:border-[#E5E8D9]'
                    }`}
                  >
                    <span
                      className={`font-label-sm text-xs uppercase tracking-wider ${
                        isSelected ? 'text-[#C7F04A] font-bold' : 'text-[#E5E8D9]'
                      }`}
                    >
                      {trim.name}
                    </span>
                    <span className="font-spec-data text-[11px] text-[#8C9280] mt-1">
                      ${(trim.basePrice / 1000).toFixed(0)}k
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-[#2A2C32]" />

          {/* Section 1: EXTERIOR FINISH */}
          <div>
            <div className="flex justify-between items-baseline mb-4">
              <h2 className="font-label-sm text-xs text-[#8C9280] tracking-widest uppercase">
                EXTERIOR FINISH
              </h2>
              <span className="font-spec-data text-base text-[#E5E8D9] font-medium">
                {currentPaint.name}
              </span>
            </div>

            {/* 8 Paint Swatches matching Stitch markup */}
            <div className="grid grid-cols-4 gap-4" role="radiogroup" aria-label="Exterior Paint Colors">
              {PAINT_OPTIONS.map((paint) => {
                const isSelected = config.paint === paint.id;
                return (
                  <button
                    key={paint.id}
                    id={`paint-swatch-${paint.id}`}
                    onClick={() => dispatch({ type: 'SET_PAINT', payload: paint.id as PaintId })}
                    aria-label={`Select ${paint.name}`}
                    role="radio"
                    aria-checked={isSelected}
                    className={`w-12 h-12 rounded-full cursor-pointer relative transition-transform ${
                      isSelected
                        ? 'border-2 border-[#C7F04A] ring-2 ring-[#C7F04A] ring-offset-2 ring-offset-[#17181C] scale-105'
                        : 'border border-[#444936] hover:border-[#E5E8D9]'
                    }`}
                    style={{
                      backgroundColor: paint.swatchBg,
                      backgroundImage: paint.pattern || undefined,
                    }}
                  />
                );
              })}
            </div>
            <p className="font-body-md text-xs text-[#8C9280] mt-3">
              {currentPaint.description}
            </p>
          </div>

          <div className="w-full h-px bg-[#2A2C32]" />

          {/* Section 2: WHEEL ARCHITECTURE */}
          <div>
            <h2 className="font-label-sm text-xs text-[#8C9280] tracking-widest uppercase mb-4">
              WHEEL ARCHITECTURE
            </h2>
            <div className="flex flex-col gap-2.5">
              {WHEEL_OPTIONS.map((wheel) => {
                const isSelected = config.wheels === wheel.id;
                return (
                  <button
                    key={wheel.id}
                    id={`wheel-opt-${wheel.id}`}
                    onClick={() => dispatch({ type: 'SET_WHEELS', payload: wheel.id as WheelId })}
                    className={`w-full flex justify-between items-center p-4 bg-[#0C0C0E] border rounded transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#C7F04A]'
                        : 'border-[#2A2C32] hover:border-[#E5E8D9]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full border border-[#2A2C32]"
                        style={{ backgroundColor: wheel.finishColor }}
                      />
                      <span
                        className={`font-label-sm text-xs uppercase tracking-widest ${
                          isSelected ? 'text-[#C7F04A] font-bold' : 'text-[#E5E8D9]'
                        }`}
                      >
                        {wheel.name}
                      </span>
                    </div>
                    <span
                      className={`font-spec-data text-xs ${
                        isSelected ? 'text-[#C7F04A] font-bold' : 'text-[#8C9280]'
                      }`}
                    >
                      {wheel.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-[#2A2C32]" />

          {/* Section 3: INTERIOR ENVIRONMENT */}
          <div>
            <h2 className="font-label-sm text-xs text-[#8C9280] tracking-widest uppercase mb-4">
              INTERIOR ENVIRONMENT
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {INTERIOR_OPTIONS.map((interior) => {
                const isSelected = config.interior === interior.id;
                return (
                  <button
                    key={interior.id}
                    id={`interior-opt-${interior.id}`}
                    onClick={() =>
                      dispatch({ type: 'SET_INTERIOR', payload: interior.id as InteriorId })
                    }
                    className={`p-4 bg-[#0C0C0E] border rounded flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#C7F04A]'
                        : 'border-[#2A2C32] hover:border-[#E5E8D9]'
                    }`}
                  >
                    <span
                      className={`font-label-sm text-xs uppercase tracking-widest ${
                        isSelected ? 'text-[#C7F04A] font-bold' : 'text-[#8C9280]'
                      }`}
                    >
                      {interior.name}
                    </span>
                    {interior.priceDelta > 0 && (
                      <span className="font-spec-data text-[10px] text-[#8C9280]">
                        +${interior.priceDelta.toLocaleString()}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-[#2A2C32]" />

          {/* Section 4: BRAKE CALIPER ACCENT */}
          <div>
            <div className="flex justify-between items-baseline mb-3">
              <h2 className="font-label-sm text-xs text-[#8C9280] tracking-widest uppercase">
                CALIPER FINISH
              </h2>
              <span className="font-spec-data text-xs text-[#E5E8D9] font-mono capitalize">
                {config.caliperColor}
              </span>
            </div>
            <div className="flex gap-4">
              {caliperOptions.map((c) => {
                const isSelected = config.caliperColor === c.id;
                return (
                  <button
                    key={c.id}
                    id={`caliper-color-${c.id}`}
                    onClick={() => dispatch({ type: 'SET_CALIPER_COLOR', payload: c.id })}
                    aria-label={`Select ${c.label} Calipers`}
                    className={`w-9 h-9 rounded-full cursor-pointer relative transition-transform ${
                      isSelected
                        ? 'border-2 border-[#E5E8D9] ring-2 ring-[#C7F04A] ring-offset-2 ring-offset-[#17181C] scale-110'
                        : 'border border-[#444936] hover:border-[#E5E8D9]'
                    }`}
                    style={{ backgroundColor: c.color }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* Bottom Sticky Area matching Stitch markup                 */}
        {/* ========================================================= */}
        <div className="border-t border-[#2A2C32] bg-[#121316] p-6 mt-auto">
          <div className="flex justify-between items-end mb-5">
            <div className="flex flex-col">
              <span className="font-label-sm text-xs text-[#8C9280] uppercase tracking-widest">
                TOTAL BUILD
              </span>
              <span className="font-label-sm text-[10px] text-[#8C9280]/70">
                EXCL. TAXES & REGISTRATION
              </span>
            </div>
            <span className="font-spec-data text-[#E5E8D9] text-3xl font-bold font-mono">
              ${pricing.totalPrice.toLocaleString()}
            </span>
          </div>

          <button
            id="lock-specification-btn"
            onClick={() => {
              setIsSpecLocked(true);
              setIsReserveModalOpen(true);
            }}
            className="w-full py-4 border border-[#E5E8D9] text-[#E5E8D9] hover:border-[#C7F04A] hover:text-[#0C0C0E] hover:bg-[#C7F04A] transition-all duration-300 rounded flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
          >
            <Lock className="w-5 h-5 text-[#E5E8D9] group-hover:text-[#0C0C0E] transition-colors" />
            <span className="font-label-sm text-xs font-bold uppercase tracking-widest font-mono">
              LOCK SPECIFICATION
            </span>
          </button>
        </div>
      </aside>
    </div>
  );
};
