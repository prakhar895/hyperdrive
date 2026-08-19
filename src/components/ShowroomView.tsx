import React from 'react';
import { useConfig } from '../context/ConfigContext';

export const ShowroomView: React.FC = () => {
  const { config, setCurrentTab, setIsReserveModalOpen, currentTrim } = useConfig();

  return (
    <section
      id="showroom-view"
      className="w-full flex-1 flex flex-col items-center justify-between min-h-[calc(100vh-80px)] bg-[#0C0C0E] relative overflow-hidden px-4 sm:px-8 py-6 sm:py-10 select-none"
    >
      {/* Subtle Radial Floor Lighting Gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 60%, rgba(199, 240, 74, 0.05) 0%, rgba(12, 12, 14, 0.85) 55%, rgba(12, 12, 14, 1) 100%)',
        }}
      />

      {/* Top Banner / Headline */}
      <div className="w-full max-w-[1440px] flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 gap-4">
        <div>
          <span className="font-label-sm text-xs text-[#C7F04A] tracking-widest uppercase flex items-center gap-2 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-[#C7F04A] animate-pulse" />
            HyperDrive Studio Showroom
          </span>
          <h1 className="font-headline-md text-3xl sm:text-5xl lg:text-6xl text-[#E5E8D9] font-bold tracking-tighter mt-1">
            THE APEX ALL-ELECTRIC HYPERCAR
          </h1>
        </div>

        <div className="hidden sm:flex items-center text-xs font-mono text-[#8C9280] tracking-widest uppercase border border-[#2A2C32] px-3 py-1.5 rounded bg-[#17181C]">
          <span>PLATFORM V.2.4 // 950V ARCHITECTURE</span>
        </div>
      </div>

      {/* Center Cinematic Supercar Stage (Full-bleed, object-position center) */}
      <div className="w-full max-w-[1280px] my-auto relative z-10 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[460px] lg:min-h-[520px]">
        {/* Overhead Softbox Studio Reflection */}
        <div className="w-72 sm:w-[500px] h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent blur-xs mb-2" />

        {/* 5-Layer Composite Vehicle Renderer */}
        <div className="w-full max-w-[1100px] h-auto drop-shadow-2xl">
          <img
  src="/vehicle/hero.webp"
  alt="HyperDrive hypercar, front three-quarter studio view"
  width={2752}
  height={1536}
  className="w-full h-auto"
  fetchPriority="high"
/>
        </div>
      </div>

      {/* Bottom Telemetry Bar matching Design Tokens */}
      <div className="w-full max-w-[1440px] z-10 border-t border-[#2A2C32] pt-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        {/* Left Sub-brand */}
        <div className="flex flex-col">
          <span className="font-label-sm text-[11px] text-[#8C9280] uppercase tracking-widest">
            HYPERDRIVE {currentTrim.name.toUpperCase()} SPEC
          </span>
          <span className="font-headline-md text-xl text-[#E5E8D9] font-semibold tracking-tight">
            1,420 Nm Peak System Torque
          </span>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 gap-6 sm:gap-12 w-full md:w-auto">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs text-[#8C9280] uppercase tracking-wider">0-100 KM/H</span>
            <span className="font-spec-data text-2xl sm:text-3xl text-[#E5E8D9] font-bold tracking-tight">
              {currentTrim.acceleration0to100}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-xs text-[#8C9280] uppercase tracking-wider">EST. RANGE</span>
            <span className="font-spec-data text-2xl sm:text-3xl text-[#C7F04A] font-bold tracking-tight">
              {currentTrim.rangeKm} <span className="text-lg font-normal text-[#8C9280]">km</span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-label-sm text-xs text-[#8C9280] uppercase tracking-wider">PEAK OUTPUT</span>
            <span className="font-spec-data text-2xl sm:text-3xl text-[#E5E8D9] font-bold tracking-tight">
              {currentTrim.peakOutputHp} <span className="text-lg font-normal text-[#8C9280]">hp</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full md:w-auto">
          <button
            id="showroom-configure-cta"
            onClick={() => setCurrentTab('configurator')}
            className="flex-1 md:flex-none font-label-sm text-xs uppercase tracking-widest px-6 py-3 bg-[#C7F04A] text-[#0C0C0E] font-bold rounded hover:bg-[#b8e23f] transition-all cursor-pointer text-center"
          >
            CUSTOMIZE BUILD
          </button>
          <button
            id="showroom-reserve-cta"
            onClick={() => setIsReserveModalOpen(true)}
            className="flex-1 md:flex-none font-label-sm text-xs uppercase tracking-widest px-6 py-3 border border-[#E5E8D9] text-[#E5E8D9] font-bold rounded hover:border-[#C7F04A] hover:text-[#C7F04A] transition-all cursor-pointer text-center"
          >
            RESERVE NOW
          </button>
        </div>
      </div>
    </section>
  );
};
