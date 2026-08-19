import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { useConfig } from '../context/ConfigContext';
import telemetryData from '../data/telemetry.json';
import { TRIM_OPTIONS } from '../data/configOptions';
import { TrimId } from '../types';
import { Check, Minus } from 'lucide-react';

type TelemetryTab = 'acceleration' | 'power' | 'thermal';

export const PerformanceView: React.FC = () => {
  const { config, dispatch, setCurrentTab } = useConfig();
  const [activeTab, setActiveTab] = useState<TelemetryTab>('acceleration');
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  // Keyboard navigation for ARIA tabs (Roving tabindex + Arrow keys)
  const tabList: { id: TelemetryTab; label: string }[] = [
    { id: 'acceleration', label: 'ACCELERATION' },
    { id: 'power', label: 'POWER CURVE' },
    { id: 'thermal', label: 'THERMAL' },
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const currentIndex = tabList.findIndex((t) => t.id === activeTab);
    let nextIndex = -1;

    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabList.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + tabList.length) % tabList.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = tabList.length - 1;
    }

    if (nextIndex !== -1) {
      e.preventDefault();
      const nextTab = tabList[nextIndex].id;
      setActiveTab(nextTab);
      tabsRef.current[nextIndex]?.focus();
    }
  };

  // -------------------------------------------------------------
  // CHART 1: ACCELERATION (G-Force over 0 - 4.5s)
  // -------------------------------------------------------------
  const renderAccelerationChart = () => {
    const data = telemetryData.acceleration.timePoints;
    const width = 640;
    const height = 320;
    const padding = { top: 30, right: 90, bottom: 40, left: 50 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const maxTime = 4.5;
    const maxG = 3.5;
    const maxSpeed = 300;

    const getX = (t: number) => padding.left + (t / maxTime) * plotW;
    const getY_G = (g: number) => padding.top + plotH - (g / maxG) * plotH;
    const getY_Speed = (s: number) => padding.top + plotH - (s / maxSpeed) * plotH;

    // Path generators
    const gPathD = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.time)} ${getY_G(p.gForce)}`,
      ''
    );

    const speedPathD = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.time)} ${getY_Speed(p.speed)}`,
      ''
    );

    const lastPoint = data[data.length - 1];

    return (
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Acceleration Telemetry: Longitudinal G-Force and Speed versus elapsed time"
          aria-describedby="telemetry-accel-table"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const normX = (mouseX / rect.width) * width;
            const timeVal = Math.max(0, Math.min(maxTime, ((normX - padding.left) / plotW) * maxTime));
            // Find closest point
            let closestIdx = 0;
            let minDiff = Infinity;
            data.forEach((pt, idx) => {
              const diff = Math.abs(pt.time - timeVal);
              if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
              }
            });
            setHoverIndex(closestIdx);
          }}
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="accel-fill-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C7F04A" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#C7F04A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 1.0, 2.0, 3.0].map((gVal) => {
            const y = getY_G(gVal);
            return (
              <g key={gVal}>
                <line x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="#2A2C32" strokeWidth="1" strokeDasharray="3 3" />
                <text x={padding.left - 10} y={y + 4} fill="#8F937C" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                  {gVal.toFixed(2)}G
                </text>
              </g>
            );
          })}

          {/* Time axis marks (vertical) */}
          {[0, 1, 2, 3, 4].map((tVal) => {
            const x = getX(tVal);
            return (
              <g key={tVal}>
                <line x1={x} y1={padding.top} x2={x} y2={height - padding.bottom} stroke="#1E2116" strokeWidth="1" />
                <text x={x} y={height - padding.bottom + 18} fill="#8F937C" fontSize="11" fontFamily="JetBrains Mono" textAnchor="middle">
                  {tVal}s
                </text>
              </g>
            );
          })}

          {/* Fill under G curve */}
          <path
            d={`${gPathD} L ${getX(lastPoint.time)} ${getY_G(0)} L ${getX(0)} ${getY_G(0)} Z`}
            fill="url(#accel-fill-grad)"
          />

          {/* Series 1: Speed (km/h) - Dotted line with on-plot direct label */}
          <path d={speedPathD} fill="none" stroke="#60A5FA" strokeWidth="1.5" strokeDasharray="4 3" />
          <text
            x={getX(lastPoint.time) + 6}
            y={getY_Speed(lastPoint.speed) + 4}
            fill="#93C5FD"
            fontSize="10"
            fontFamily="JetBrains Mono"
            fontWeight="500"
          >
            Velocity (km/h)
          </text>

          {/* Series 2: Longitudinal G-Force - Solid bold Electric Lime line with on-plot direct label */}
          <path d={gPathD} fill="none" stroke="#C7F04A" strokeWidth="3" strokeLinecap="round" />
          <text
            x={getX(lastPoint.time) + 6}
            y={getY_G(lastPoint.gForce) + 4}
            fill="#C7F04A"
            fontSize="11"
            fontFamily="JetBrains Mono"
            fontWeight="bold"
          >
            G-Force (G)
          </text>

          {/* Interactive hover scrubber */}
          {hoverIndex !== null && (
            <g pointerEvents="none">
              <line
                x1={getX(data[hoverIndex].time)}
                y1={padding.top}
                x2={getX(data[hoverIndex].time)}
                y2={height - padding.bottom}
                stroke="#C7F04A"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
              <circle cx={getX(data[hoverIndex].time)} cy={getY_G(data[hoverIndex].gForce)} r="5" fill="#0C0C0E" stroke="#C7F04A" strokeWidth="2.5" />
              <circle cx={getX(data[hoverIndex].time)} cy={getY_Speed(data[hoverIndex].speed)} r="4" fill="#0C0C0E" stroke="#60A5FA" strokeWidth="2" />

              {/* Scrubber Tooltip */}
              <g transform={`translate(${Math.min(getX(data[hoverIndex].time) + 10, width - 150)}, ${Math.max(padding.top + 10, getY_G(data[hoverIndex].gForce) - 40)})`}>
                <rect width="130" height="52" rx="3" fill="#17181C" stroke="#3F424A" strokeWidth="1" />
                <text x="8" y="16" fill="#C7F04A" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                  t = {data[hoverIndex].time}s : {data[hoverIndex].gForce.toFixed(2)} G
                </text>
                <text x="8" y="32" fill="#93C5FD" fontSize="9" fontFamily="JetBrains Mono">
                  Speed: {data[hoverIndex].speed} km/h
                </text>
                <text x="8" y="44" fill="#8F937C" fontSize="8" fontFamily="JetBrains Mono">
                  Slip Angle: {data[hoverIndex].slip}°
                </text>
              </g>
            </g>
          )}
        </svg>

        {/* Accessible visually hidden fallback table */}
        <table id="telemetry-accel-table" className="sr-only">
          <caption>Longitudinal Acceleration G-Force vs Time (0 to 4.5 seconds)</caption>
          <thead>
            <tr>
              <th scope="col">Time (s)</th>
              <th scope="col">Longitudinal G (G)</th>
              <th scope="col">Speed (km/h)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.time}</td>
                <td>{row.gForce}</td>
                <td>{row.speed}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // -------------------------------------------------------------
  // CHART 2: POWER CURVE (0 - 20,000 RPM)
  // -------------------------------------------------------------
  const renderPowerChart = () => {
    const data = telemetryData.powerCurve.rpmPoints;
    const width = 640;
    const height = 320;
    const padding = { top: 30, right: 100, bottom: 40, left: 50 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const maxRpm = 20000;
    const maxKw = 700;
    const maxTorque = 1600;

    const getX = (rpm: number) => padding.left + (rpm / maxRpm) * plotW;
    const getY_Kw = (kw: number) => padding.top + plotH - (kw / maxKw) * plotH;
    const getY_Torque = (nm: number) => padding.top + plotH - (nm / maxTorque) * plotH;

    const rearKwPath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.rpm)} ${getY_Kw(p.rearKw)}`,
      ''
    );
    const frontKwPath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.rpm)} ${getY_Kw(p.frontKw)}`,
      ''
    );
    const torquePath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.rpm)} ${getY_Torque(p.totalTorqueNm)}`,
      ''
    );

    const last = data[data.length - 1];

    return (
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Dual Inverter Power and Torque Curves across 0 to 20,000 RPM"
          aria-describedby="telemetry-power-table"
        >
          {/* Grid lines */}
          {[0, 200, 400, 600].map((kw) => (
            <g key={kw}>
              <line x1={padding.left} y1={getY_Kw(kw)} x2={width - padding.right} y2={getY_Kw(kw)} stroke="#2A2C32" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding.left - 8} y={getY_Kw(kw) + 4} fill="#8F937C" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                {kw}kW
              </text>
            </g>
          ))}

          {/* RPM X Axis */}
          {[0, 5000, 10000, 15000, 20000].map((rpm) => (
            <g key={rpm}>
              <line x1={getX(rpm)} y1={padding.top} x2={getX(rpm)} y2={height - padding.bottom} stroke="#1E2116" strokeWidth="1" />
              <text x={getX(rpm)} y={height - padding.bottom + 18} fill="#8F937C" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                {rpm / 1000}k
              </text>
            </g>
          ))}

          {/* Series 1: Front Motor (kW) - Dashed lime */}
          <path d={frontKwPath} fill="none" stroke="#A3E635" strokeWidth="2" strokeDasharray="6 3" />
          <text x={getX(last.rpm) + 6} y={getY_Kw(last.frontKw) + 4} fill="#A3E635" fontSize="10" fontFamily="JetBrains Mono">
            Front Motor (kW)
          </text>

          {/* Series 2: Rear Dual Motors (kW) - Solid Electric Lime */}
          <path d={rearKwPath} fill="none" stroke="#C7F04A" strokeWidth="3" />
          <text x={getX(last.rpm) + 6} y={getY_Kw(last.rearKw) + 4} fill="#C7F04A" fontSize="11" fontFamily="JetBrains Mono" fontWeight="bold">
            Rear Motors (kW)
          </text>

          {/* Series 3: Combined Torque (Nm) - Amber Dotted */}
          <path d={torquePath} fill="none" stroke="#FB923C" strokeWidth="2" strokeDasharray="2 3" />
          <text x={getX(last.rpm) + 6} y={getY_Torque(last.totalTorqueNm) + 4} fill="#FB923C" fontSize="10" fontFamily="JetBrains Mono">
            Total Torque (Nm)
          </text>
        </svg>

        {/* Accessible hidden table */}
        <table id="telemetry-power-table" className="sr-only">
          <caption>Dual Inverter Power and Torque Output across RPM range</caption>
          <thead>
            <tr>
              <th scope="col">RPM</th>
              <th scope="col">Front Output (kW)</th>
              <th scope="col">Rear Output (kW)</th>
              <th scope="col">Total Torque (Nm)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr key={i}>
                <td>{r.rpm}</td>
                <td>{r.frontKw}</td>
                <td>{r.rearKw}</td>
                <td>{r.totalTorqueNm}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // -------------------------------------------------------------
  // CHART 3: THERMAL DYNAMICS (10 Continuous Laps)
  // -------------------------------------------------------------
  const renderThermalChart = () => {
    const data = telemetryData.thermal.lapTimePoints;
    const width = 640;
    const height = 320;
    const padding = { top: 30, right: 100, bottom: 40, left: 50 };

    const plotW = width - padding.left - padding.right;
    const plotH = height - padding.top - padding.bottom;

    const maxLaps = 10;
    const maxTemp = 90;

    const getX = (lap: number) => padding.left + ((lap - 1) / (maxLaps - 1)) * plotW;
    const getY_Temp = (t: number) => padding.top + plotH - (t / maxTemp) * plotH;

    const batteryPath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.lap)} ${getY_Temp(p.batteryTemp)}`,
      ''
    );
    const inverterPath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.lap)} ${getY_Temp(p.inverterTemp)}`,
      ''
    );
    const statorPath = data.reduce(
      (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(p.lap)} ${getY_Temp(p.statorTemp)}`,
      ''
    );

    const last = data[data.length - 1];

    return (
      <div className="relative w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          role="img"
          aria-label="Thermal Equilibrium under continuous 10 lap track conditions"
          aria-describedby="telemetry-thermal-table"
        >
          {/* Safe limit thermal line (85C) */}
          <line x1={padding.left} y1={getY_Temp(85)} x2={width - padding.right} y2={getY_Temp(85)} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="4 4" />
          <text x={width - padding.right - 4} y={getY_Temp(85) - 6} fill="#F87171" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">
            MAX CRITICAL THRESHOLD (85°C)
          </text>

          {/* Grid lines */}
          {[30, 45, 60, 75].map((temp) => (
            <g key={temp}>
              <line x1={padding.left} y1={getY_Temp(temp)} x2={width - padding.right} y2={getY_Temp(temp)} stroke="#2A2C32" strokeWidth="1" strokeDasharray="3 3" />
              <text x={padding.left - 8} y={getY_Temp(temp) + 4} fill="#8F937C" fontSize="10" fontFamily="JetBrains Mono" textAnchor="end">
                {temp}°C
              </text>
            </g>
          ))}

          {/* Lap marks */}
          {data.map((p) => (
            <g key={p.lap}>
              <line x1={getX(p.lap)} y1={padding.top} x2={getX(p.lap)} y2={height - padding.bottom} stroke="#1E2116" strokeWidth="1" />
              <text x={getX(p.lap)} y={height - padding.bottom + 18} fill="#8F937C" fontSize="10" fontFamily="JetBrains Mono" textAnchor="middle">
                L{p.lap}
              </text>
            </g>
          ))}

          {/* Series 1: Battery Immersion Temp (Solid Electric Lime) */}
          <path d={batteryPath} fill="none" stroke="#C7F04A" strokeWidth="3" />
          <text x={getX(last.lap) + 6} y={getY_Temp(last.batteryTemp) + 4} fill="#C7F04A" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
            Battery (56°C)
          </text>

          {/* Series 2: Inverter Temp (Dashed Cyan) */}
          <path d={inverterPath} fill="none" stroke="#38BDF8" strokeWidth="2" strokeDasharray="5 3" />
          <text x={getX(last.lap) + 6} y={getY_Temp(last.inverterTemp) + 4} fill="#7DD3FC" fontSize="10" fontFamily="JetBrains Mono">
            Inverter (65°C)
          </text>

          {/* Series 3: Stator Motor Temp (Dotted Amber) */}
          <path d={statorPath} fill="none" stroke="#FBBF24" strokeWidth="2" strokeDasharray="2 3" />
          <text x={getX(last.lap) + 6} y={getY_Temp(last.statorTemp) + 4} fill="#FCD34D" fontSize="10" fontFamily="JetBrains Mono">
            Stator (77°C)
          </text>
        </svg>

        {/* Accessible hidden table */}
        <table id="telemetry-thermal-table" className="sr-only">
          <caption>Continuous Track Thermal Telemetry over 10 Laps</caption>
          <thead>
            <tr>
              <th scope="col">Lap</th>
              <th scope="col">Battery Pack (°C)</th>
              <th scope="col">Inverter (°C)</th>
              <th scope="col">Motor Stator (°C)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                <td>{row.lap}</td>
                <td>{row.batteryTemp}</td>
                <td>{row.inverterTemp}</td>
                <td>{row.statorTemp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div id="performance-view" className="w-full flex-1 flex flex-col bg-background min-h-[calc(100vh-80px)] px-4 sm:px-8 lg:px-16 py-8 select-none">
      <div className="max-w-[1440px] mx-auto w-full space-y-12">
        {/* ============================================================== */}
        {/* SECTION 1: TELEMETRY ANALYSIS (Matching Screenshot 5)          */}
        {/* ============================================================== */}
        <div className="space-y-6">
          <div className="flex flex-col">
            <span className="font-label-sm text-xs text-primary-container tracking-widest uppercase">
              V.2.4 TELEMETRY
            </span>
            <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-bold tracking-tighter mt-1">
              Telemetry Analysis
            </h1>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-2xl mt-2">
              Real-time data visualization of the dynamic systems during peak load scenarios.
            </p>
          </div>

          {/* ARIA Tabs Navigation */}
          <div
            role="tablist"
            aria-label="Telemetry Dimensions"
            onKeyDown={handleKeyDown}
            className="flex gap-6 border-b border-[#2A2C32] pb-3"
          >
            {tabList.map((tab, idx) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  ref={(el) => (tabsRef.current[idx] = el)}
                  id={`telemetry-tab-${tab.id}`}
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`telemetry-panel-${tab.id}`}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => setActiveTab(tab.id)}
                  className={`font-label-sm text-xs uppercase tracking-widest transition-all cursor-pointer ${
                    isSelected
                      ? 'text-primary-container border-b-2 border-primary-container font-bold pb-2 -mb-3.5'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Telemetry Visualizer & Live Readouts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart SVG Container (2 cols) */}
            <div
              id={`telemetry-panel-${activeTab}`}
              role="tabpanel"
              aria-labelledby={`telemetry-tab-${activeTab}`}
              className="lg:col-span-2 bg-level-1 border border-[#2A2C32] rounded p-5 sm:p-7 flex flex-col justify-between"
            >
              <div className="flex justify-between items-baseline mb-4">
                <div className="flex flex-col">
                  <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                    {activeTab === 'acceleration'
                      ? 'LONGITUDINAL G-FORCE'
                      : activeTab === 'power'
                      ? 'MOTOR & INVERTER DYNAMICS'
                      : 'TRACK THERMAL EQUILIBRIUM'}
                  </span>
                  <span className="font-spec-data text-xl text-primary font-bold">
                    {activeTab === 'acceleration'
                      ? '0-100 km/h: 1.85s'
                      : activeTab === 'power'
                      ? 'Peak Output: 882 kW (1,200 hp)'
                      : 'Max Stator: 77.0°C / Immersion Safe'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse" />
                  <span className="font-label-sm text-[10px] text-primary-container uppercase">
                    100 Hz Sampled
                  </span>
                </div>
              </div>

              {/* Dynamic Chart renderer */}
              {activeTab === 'acceleration' && renderAccelerationChart()}
              {activeTab === 'power' && renderPowerChart()}
              {activeTab === 'thermal' && renderThermalChart()}
            </div>

            {/* Right Telemetry Stat Cards matching Screenshot 5 */}
            <div className="flex flex-col gap-4">
              <div className="bg-level-1 border border-[#2A2C32] rounded p-6">
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                  PEAK ACCELERATION
                </span>
                <div className="font-spec-data text-3xl sm:text-4xl text-primary font-bold my-2">
                  2.84 G
                </div>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Maximum longitudinal force achieved during launch control sequence.
                </p>
              </div>

              <div className="bg-level-1 border border-[#2A2C32] rounded p-6">
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                  TORQUE VECTORING
                </span>
                <div className="font-spec-data text-3xl sm:text-4xl text-primary font-bold my-2">
                  98.5 %
                </div>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Optimal distribution ratio across rear axle during initial slip phase.
                </p>
              </div>

              <div className="bg-level-1 border border-[#2A2C32] rounded p-6">
                <span className="font-label-sm text-xs text-on-surface-variant uppercase tracking-widest">
                  SLIP ANGLE
                </span>
                <div className="font-spec-data text-3xl sm:text-4xl text-primary font-bold my-2">
                  1.2 °
                </div>
                <p className="font-body-md text-xs text-on-surface-variant">
                  Controlled micro-slip maintained for maximum mechanical grip.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 2: TRIM COMPARISON TABLE (Matching Screenshot 3)        */}
        {/* ============================================================== */}
        <div className="border-t border-[#2A2C32] pt-12 space-y-6">
          <div>
            <h2 className="font-headline-md text-3xl sm:text-4xl text-primary font-bold tracking-tighter">
              Trim Comparison
            </h2>
            <p className="font-body-md text-sm sm:text-base text-on-surface-variant max-w-3xl mt-2">
              Select the configuration that best aligns with your performance objectives. All trims share
              the core telemetry and chassis architecture, differing in powertrain output and aerodynamic focus.
            </p>
          </div>

          {/* Desktop Semantic Table (with sticky header and accessible cells) */}
          <div className="hidden md:block overflow-x-auto border border-[#2A2C32] rounded bg-level-1">
            <table className="w-full text-left border-collapse" id="trim-comparison-table">
              <caption className="sr-only">HyperDrive Supercar Specifications across Base, Performance, and Track trims</caption>
              <thead>
                <tr className="border-b border-[#2A2C32] bg-surface">
                  <th scope="col" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-widest sticky top-0 bg-surface">
                    SPECIFICATION
                  </th>
                  {TRIM_OPTIONS.map((trim) => (
                    <th key={trim.id} scope="col" className="p-4 sticky top-0 bg-surface">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-headline-md text-xl text-primary font-bold block">
                            {trim.name}
                          </span>
                          <span className="font-spec-data text-xs text-on-surface-variant">
                            From ${(trim.basePrice).toLocaleString()}
                          </span>
                        </div>
                        {trim.recommended && (
                          <span className="font-label-sm text-[10px] bg-primary-container text-background font-bold px-2 py-0.5 rounded uppercase">
                            RECOMMENDED
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A2C32] font-spec-data text-xs">
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    0-100 KM/H
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary font-bold">{t.acceleration0to100}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    TOP SPEED
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.topSpeedKmh} km/h</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    BATTERY CAPACITY
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.batteryKwh} kWh</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    AERODYNAMICS
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.aerodynamics}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    DOWNFORCE @ 250KM/H
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.downforceKg} kg</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    CARBON CERAMIC BRAKES
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4">
                      {t.brakes === 'Carbon Ceramic' ? (
                        <div className="flex items-center text-primary-container">
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </div>
                      ) : (
                        <div className="text-on-surface-variant">
                          <Minus className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Not available</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    TORQUE VECTORING
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.torqueVectoring}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    TELEMETRY SYSTEM
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4 text-primary">{t.telemetrySystem}</td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    ROLL CAGE (FIA)
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4">
                      {t.rollCage ? (
                        <div className="flex items-center text-primary-container">
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </div>
                      ) : (
                        <div className="text-on-surface-variant">
                          <Minus className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Not available</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    SLICK TIRES OPTION
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4">
                      {t.slickTiresOption ? (
                        <div className="flex items-center text-primary-container">
                          <Check className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Included</span>
                        </div>
                      ) : (
                        <div className="text-on-surface-variant">
                          <Minus className="w-4 h-4" aria-hidden="true" />
                          <span className="sr-only">Not available</span>
                        </div>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <th scope="row" className="p-4 font-label-sm text-xs text-on-surface-variant uppercase tracking-wider font-normal">
                    ACTION
                  </th>
                  {TRIM_OPTIONS.map((t) => (
                    <td key={t.id} className="p-4">
                      <button
                        id={`select-trim-${t.id}-btn`}
                        onClick={() => {
                          dispatch({ type: 'SET_TRIM', payload: t.id as TrimId });
                          setCurrentTab('configurator');
                        }}
                        className={`w-full py-2.5 px-4 font-label-sm text-xs uppercase tracking-wider rounded transition-all cursor-pointer ${
                          config.trim === t.id
                            ? 'border border-primary-container text-primary-container bg-[#12140A] font-bold'
                            : 'border border-[#2A2C32] text-primary hover:border-primary'
                        }`}
                      >
                        {config.trim === t.id ? `SELECTED (${t.name})` : `SELECT ${t.name}`}
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile View: Stacked Cards per trim as mandated in prompt */}
          <div className="grid grid-cols-1 gap-6 md:hidden">
            {TRIM_OPTIONS.map((trim) => (
              <div
                key={trim.id}
                className={`bg-level-1 border rounded p-6 space-y-4 ${
                  config.trim === trim.id ? 'border-primary-container' : 'border-[#2A2C32]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-headline-md text-2xl text-primary font-bold">{trim.name}</h3>
                    <span className="font-spec-data text-xs text-primary-container">
                      From ${trim.basePrice.toLocaleString()}
                    </span>
                  </div>
                  {trim.recommended && (
                    <span className="font-label-sm text-[10px] bg-primary-container text-background font-bold px-2 py-0.5 rounded uppercase">
                      RECOMMENDED
                    </span>
                  )}
                </div>

                <div className="space-y-2 font-spec-data text-xs border-t border-[#2A2C32] pt-3">
                  <div className="flex justify-between py-1 border-b border-[#1E2116]">
                    <span className="text-on-surface-variant font-label-sm uppercase">0-100 KM/H</span>
                    <span className="text-primary font-bold">{trim.acceleration0to100}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E2116]">
                    <span className="text-on-surface-variant font-label-sm uppercase">TOP SPEED</span>
                    <span className="text-primary">{trim.topSpeedKmh} km/h</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E2116]">
                    <span className="text-on-surface-variant font-label-sm uppercase">BATTERY</span>
                    <span className="text-primary">{trim.batteryKwh} kWh</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-[#1E2116]">
                    <span className="text-on-surface-variant font-label-sm uppercase">DOWNFORCE</span>
                    <span className="text-primary">{trim.downforceKg} kg @ 250km/h</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-on-surface-variant font-label-sm uppercase">AERO SUITE</span>
                    <span className="text-primary">{trim.aerodynamics}</span>
                  </div>
                </div>

                <button
                  id={`mobile-select-trim-${trim.id}`}
                  onClick={() => {
                    dispatch({ type: 'SET_TRIM', payload: trim.id as TrimId });
                    setCurrentTab('configurator');
                  }}
                  className="w-full py-3 bg-surface border border-primary-container text-primary-container font-label-sm text-xs uppercase tracking-widest rounded font-bold cursor-pointer"
                >
                  {config.trim === trim.id ? 'CONFIGURING NOW' : `SELECT ${trim.name.toUpperCase()}`}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
