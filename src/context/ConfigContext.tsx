import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import {
  VehicleConfig,
  PaintId,
  WheelId,
  InteriorId,
  TrimId,
  NavTab,
} from '../types';
import {
  PAINT_OPTIONS,
  WHEEL_OPTIONS,
  INTERIOR_OPTIONS,
  TRIM_OPTIONS,
} from '../data/configOptions';

const STORAGE_KEY = 'hyperdrive_vehicle_config';

export type ConfigAction =
  | { type: 'SET_PAINT'; payload: PaintId }
  | { type: 'SET_WHEELS'; payload: WheelId }
  | { type: 'SET_INTERIOR'; payload: InteriorId }
  | { type: 'SET_TRIM'; payload: TrimId }
  | { type: 'TOGGLE_ACTIVE_AERO'; payload?: boolean }
  | { type: 'SET_CALIPER_COLOR'; payload: 'lime' | 'amber' | 'stealth' | 'red' }
  | { type: 'HYDRATE_CONFIG'; payload: Partial<VehicleConfig> }
  | { type: 'RESET_CONFIG' };

const DEFAULT_CONFIG: VehicleConfig = {
  trim: 'track',
  paint: 'obsidian',
  wheels: 'aero-21',
  interior: 'alcantara',
  activeAero: true,
  caliperColor: 'lime',
};

const VALID_PAINTS: Set<PaintId> = new Set([
  'obsidian',
  'tungsten',
  'velocity-red',
  'stratosphere',
  'apex-white',
  'tactical-green',
  'solar-flare',
  'stealth-matte',
]);

const VALID_WHEELS: Set<WheelId> = new Set(['forged-20', 'aero-21', 'carbon-22']);
const VALID_INTERIORS: Set<InteriorId> = new Set(['alcantara', 'nappa-leather']);
const VALID_TRIMS: Set<TrimId> = new Set(['base', 'performance', 'track']);

function configReducer(state: VehicleConfig, action: ConfigAction): VehicleConfig {
  switch (action.type) {
    case 'SET_PAINT':
      return { ...state, paint: action.payload };
    case 'SET_WHEELS':
      return { ...state, wheels: action.payload };
    case 'SET_INTERIOR':
      return { ...state, interior: action.payload };
    case 'SET_TRIM':
      return { ...state, trim: action.payload };
    case 'TOGGLE_ACTIVE_AERO':
      return {
        ...state,
        activeAero: action.payload !== undefined ? action.payload : !state.activeAero,
      };
    case 'SET_CALIPER_COLOR':
      return { ...state, caliperColor: action.payload };
    case 'HYDRATE_CONFIG':
      return { ...state, ...action.payload };
    case 'RESET_CONFIG':
      return DEFAULT_CONFIG;
    default:
      return state;
  }
}

// Parse URL search params safely with validation
export function parseConfigFromUrl(search: string): Partial<VehicleConfig> {
  const params = new URLSearchParams(search);
  const config: Partial<VehicleConfig> = {};

  const paint = params.get('paint') as PaintId;
  if (paint && VALID_PAINTS.has(paint)) config.paint = paint;

  const wheels = params.get('wheels') as WheelId;
  if (wheels && VALID_WHEELS.has(wheels)) config.wheels = wheels;

  const interior = params.get('interior') as InteriorId;
  if (interior && VALID_INTERIORS.has(interior)) config.interior = interior;

  const trim = params.get('trim') as TrimId;
  if (trim && VALID_TRIMS.has(trim)) config.trim = trim;

  const activeAero = params.get('aero');
  if (activeAero !== null) config.activeAero = activeAero === 'true' || activeAero === '1';

  return config;
}

// Parse initial config from LocalStorage safely
export function parseConfigFromStorage(): Partial<VehicleConfig> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const valid: Partial<VehicleConfig> = {};
    if (parsed.paint && VALID_PAINTS.has(parsed.paint)) valid.paint = parsed.paint;
    if (parsed.wheels && VALID_WHEELS.has(parsed.wheels)) valid.wheels = parsed.wheels;
    if (parsed.interior && VALID_INTERIORS.has(parsed.interior)) valid.interior = parsed.interior;
    if (parsed.trim && VALID_TRIMS.has(parsed.trim)) valid.trim = parsed.trim;
    if (typeof parsed.activeAero === 'boolean') valid.activeAero = parsed.activeAero;
    return valid;
  } catch (e) {
    console.warn('Failed to parse saved config from localStorage', e);
    return {};
  }
}

// Price derivation pure function
export function calculateDerivedPrice(config: VehicleConfig): {
  basePrice: number;
  paintPrice: number;
  wheelsPrice: number;
  interiorPrice: number;
  aeroPrice: number;
  totalPrice: number;
} {
  const trimObj = TRIM_OPTIONS.find((t) => t.id === config.trim) || TRIM_OPTIONS[2];
  const paintObj = PAINT_OPTIONS.find((p) => p.id === config.paint) || PAINT_OPTIONS[0];
  const wheelObj = WHEEL_OPTIONS.find((w) => w.id === config.wheels) || WHEEL_OPTIONS[1];
  const interiorObj = INTERIOR_OPTIONS.find((i) => i.id === config.interior) || INTERIOR_OPTIONS[0];

  const basePrice = trimObj.basePrice;
  const paintPrice = paintObj.priceDelta;
  const wheelsPrice = wheelObj.priceDelta;
  const interiorPrice = interiorObj.priceDelta;
  const aeroPrice = config.activeAero && config.trim !== 'track' ? 6000 : 0;

  const totalPrice = basePrice + paintPrice + wheelsPrice + interiorPrice + aeroPrice;

  return {
    basePrice,
    paintPrice,
    wheelsPrice,
    interiorPrice,
    aeroPrice,
    totalPrice,
  };
}

interface ConfigContextValue {
  config: VehicleConfig;
  dispatch: React.Dispatch<ConfigAction>;
  currentTab: NavTab;
  setCurrentTab: (tab: NavTab) => void;
  pricing: ReturnType<typeof calculateDerivedPrice>;
  currentPaint: typeof PAINT_OPTIONS[number];
  currentWheel: typeof WHEEL_OPTIONS[number];
  currentInterior: typeof INTERIOR_OPTIONS[number];
  currentTrim: typeof TRIM_OPTIONS[number];
  shareableUrl: string;
  isSpecLocked: boolean;
  setIsSpecLocked: (locked: boolean) => void;
  isReserveModalOpen: boolean;
  setIsReserveModalOpen: (open: boolean) => void;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  // Initialize reducer with precedence: URL > LocalStorage > Defaults
  const initialConfig = useMemo(() => {
    const urlConfig = typeof window !== 'undefined' ? parseConfigFromUrl(window.location.search) : {};
    const storageConfig = typeof window !== 'undefined' ? parseConfigFromStorage() : {};
    return {
      ...DEFAULT_CONFIG,
      ...storageConfig,
      ...urlConfig,
    };
  }, []);

  const [config, dispatch] = useReducer(configReducer, initialConfig);
  const [currentTab, setCurrentTab] = React.useState<NavTab>('showroom');
  const [isSpecLocked, setIsSpecLocked] = React.useState<boolean>(false);
  const [isReserveModalOpen, setIsReserveModalOpen] = React.useState<boolean>(false);

  // Sync to URL query string and LocalStorage whenever config changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Save to LocalStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.warn('Unable to persist config', e);
    }

    // Apply CSS custom properties to document root for paint base, highlight, gloss, and wheel finish
    const paintObj = PAINT_OPTIONS.find((p) => p.id === config.paint) || PAINT_OPTIONS[0];
    const wheelObj = WHEEL_OPTIONS.find((w) => w.id === config.wheels) || WHEEL_OPTIONS[0];
    document.documentElement.style.setProperty('--paint-base', paintObj.baseColor);
    document.documentElement.style.setProperty('--paint-highlight', paintObj.highlightColor);
    document.documentElement.style.setProperty('--paint-gloss', String(paintObj.gloss));
    document.documentElement.style.setProperty('--wheel-finish', wheelObj.finishColor);

    // Update URL query string without reloading page
    const params = new URLSearchParams(window.location.search);
    params.set('trim', config.trim);
    params.set('paint', config.paint);
    params.set('wheels', config.wheels);
    params.set('interior', config.interior);
    params.set('aero', String(config.activeAero));

    const newRelativePathQuery =
      window.location.pathname + '?' + params.toString() + window.location.hash;
    window.history.replaceState(null, '', newRelativePathQuery);
  }, [config]);

  // Handle browser back/forward or tab changes from hash
  useEffect(() => {
    const handlePopState = () => {
      const urlConfig = parseConfigFromUrl(window.location.search);
      if (Object.keys(urlConfig).length > 0) {
        dispatch({ type: 'HYDRATE_CONFIG', payload: urlConfig });
      }
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (['showroom', 'configurator', 'performance', 'technical', 'privacy', 'terms', 'legal'].includes(hash)) {
        setCurrentTab(hash);
      }
    };

    // Check initial hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '') as NavTab;
      if (['showroom', 'configurator', 'performance', 'technical', 'privacy', 'terms', 'legal'].includes(hash)) {
        setCurrentTab(hash);
      }
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const pricing = useMemo(() => calculateDerivedPrice(config), [config]);

  const currentPaint = useMemo(
    () => PAINT_OPTIONS.find((p) => p.id === config.paint) || PAINT_OPTIONS[0],
    [config.paint]
  );
  const currentWheel = useMemo(
    () => WHEEL_OPTIONS.find((w) => w.id === config.wheels) || WHEEL_OPTIONS[0],
    [config.wheels]
  );
  const currentInterior = useMemo(
    () => INTERIOR_OPTIONS.find((i) => i.id === config.interior) || INTERIOR_OPTIONS[0],
    [config.interior]
  );
  const currentTrim = useMemo(
    () => TRIM_OPTIONS.find((t) => t.id === config.trim) || TRIM_OPTIONS[2],
    [config.trim]
  );

  const shareableUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <ConfigContext.Provider
      value={{
        config,
        dispatch,
        currentTab,
        setCurrentTab: (tab: NavTab) => {
          setCurrentTab(tab);
          if (typeof window !== 'undefined') {
            window.location.hash = tab;
          }
        },
        pricing,
        currentPaint,
        currentWheel,
        currentInterior,
        currentTrim,
        shareableUrl,
        isSpecLocked,
        setIsSpecLocked,
        isReserveModalOpen,
        setIsReserveModalOpen,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}
