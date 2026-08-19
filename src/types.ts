export type PaintId =
  | 'obsidian'
  | 'tungsten'
  | 'velocity-red'
  | 'stratosphere'
  | 'apex-white'
  | 'tactical-green'
  | 'solar-flare'
  | 'stealth-matte';

export interface PaintOption {
  id: PaintId;
  name: string;
  category: 'metallic' | 'gloss' | 'matte' | 'pearl';
  baseColor: string;
  highlightColor: string;
  gloss: number; // 0.0 (ultra-matte) to 1.0 (high-metallic specular clearcoat)
  swatchBg: string;
  swatchBorder?: string;
  pattern?: string;
  priceDelta: number;
  description: string;
}

export type WheelId = 'forged-20' | 'aero-21' | 'carbon-22';

export interface WheelOption {
  id: WheelId;
  name: string;
  diameter: number;
  type: string;
  finishColor: string;
  priceDelta: number;
  weightDeltaKg: number;
  efficiencyBonusPct: number;
  description: string;
}

export type InteriorId = 'alcantara' | 'nappa-leather';

export interface InteriorOption {
  id: InteriorId;
  name: string;
  priceDelta: number;
  description: string;
  accentColor: string;
}

export type TrimId = 'base' | 'performance' | 'track';

export interface TrimOption {
  id: TrimId;
  name: string;
  tagline: string;
  basePrice: number;
  acceleration0to100: string;
  topSpeedKmh: number;
  batteryKwh: number;
  rangeKm: number;
  peakOutputHp: number;
  downforceKg: number;
  aerodynamics: string;
  brakes: string;
  torqueVectoring: string;
  telemetrySystem: string;
  rollCage: boolean;
  slickTiresOption: boolean;
  recommended?: boolean;
}

export interface VehicleConfig {
  trim: TrimId;
  paint: PaintId;
  wheels: WheelId;
  interior: InteriorId;
  activeAero: boolean;
  caliperColor: 'lime' | 'amber' | 'stealth' | 'red';
}

export interface HotspotModule {
  id: string;
  number: '01' | '02' | '03' | '04';
  name: string;
  title: string;
  description: string;
  specs: {
    downforce?: string;
    dragCoefficient?: string;
    material?: string;
    activeElements?: string;
    energyDensity?: string;
    voltage?: string;
    peakTorque?: string;
    responseLatency?: string;
  };
  efficiencyPct: number;
  position: { x: number; y: number }; // percentage coordinates on 100x100 canvas
}

export type NavTab = 'showroom' | 'configurator' | 'performance' | 'technical' | 'privacy' | 'terms' | 'legal';

export interface TelemetryPoint {
  time: number;
  longitudinalG: number;
  speedKmh: number;
  torqueFrontPct: number;
  torqueRearPct: number;
  slipAngleDeg: number;
  motorPowerKw: number;
  batteryTempC: number;
  inverterTempC: number;
  statorTempC: number;
}

export interface TelemetryDataSet {
  acceleration: {
    title: string;
    unit: string;
    timePoints: { time: number; gForce: number; speed: number; slip: number }[];
    peakG: number;
    zeroToHundredTime: string;
    torqueVectoringRatio: string;
    slipAngle: string;
  };
  powerCurve: {
    title: string;
    rpmPoints: { rpm: number; frontKw: number; rearKw: number; totalTorqueNm: number }[];
    maxRpm: number;
    peakKw: number;
    peakTorqueNm: number;
  };
  thermal: {
    title: string;
    lapTimePoints: { lap: number; batteryTemp: number; inverterTemp: number; statorTemp: number; ambientTemp: number }[];
    maxSafeTemp: number;
    coolingCapacityKw: number;
  };
}
