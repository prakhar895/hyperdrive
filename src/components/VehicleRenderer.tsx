import React from 'react';
import { VehicleConfig } from '../types';
import { PAINT_OPTIONS, WHEEL_OPTIONS } from '../data/configOptions';

interface VehicleRendererProps {
  config: VehicleConfig;
  className?: string;
  isConfigurator?: boolean;
}

export const VehicleRenderer: React.FC<VehicleRendererProps> = ({
  config,
  className = '',
  isConfigurator = false,
}) => {
  const currentPaint = PAINT_OPTIONS.find((p) => p.id === config.paint) || PAINT_OPTIONS[0];
  const currentWheel = WHEEL_OPTIONS.find((w) => w.id === config.wheels) || WHEEL_OPTIONS[0];

  const objectPosClass = isConfigurator
    ? 'object-cover object-[center_55%]'
    : 'object-cover object-center';

  return (
    <div
      id="vehicle-composite-container"
      className={`vehicle-composite-container relative w-full overflow-hidden select-none ${className}`}
      style={{
        aspectRatio: '43 / 24',
        // Set CSS custom properties on composite container
        ['--paint-base' as string]: currentPaint.baseColor,
        ['--paint-highlight' as string]: currentPaint.highlightColor,
        ['--paint-gloss' as string]: currentPaint.gloss.toString(),
        ['--wheel-finish' as string]: currentWheel.finishColor,
      }}
    >
      {/* --------------------------------------------------------------------- */}
      {/* LAYER 1: base.webp — Neutral Grayscale Render (z-order 1)              */}
      {/* --------------------------------------------------------------------- */}
      <img
        src="/vehicle/base.webp"
        alt="HyperDrive Hypercar"
        width={2752}
        height={1536}
        className={`absolute inset-0 w-full h-full pointer-events-none select-none z-10 ${objectPosClass}`}
        loading="eager"
        fetchPriority="high"
        referrerPolicy="no-referrer"
      />

      {/* --------------------------------------------------------------------- */}
      {/* LAYER 2: paint-mask.webp — mix-blend-mode: multiply (z-order 2)        */}
      {/* background-color: var(--paint-base), masked by webp alpha             */}
      {/* --------------------------------------------------------------------- */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-20"
        style={{
          backgroundColor: 'var(--paint-base, #0A0A0C)',
          WebkitMaskImage: 'url(/vehicle/paint-mask.webp)',
          maskImage: 'url(/vehicle/paint-mask.webp)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          mixBlendMode: 'multiply',
        }}
      >
        <img
          src="/vehicle/paint-mask.webp"
          alt=""
          width={2752}
          height={1536}
          className="w-full h-full object-cover opacity-0 pointer-events-none"
          loading="eager"
          aria-hidden="true"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* LAYER 3: wheel-mask.webp — mix-blend-mode: multiply (z-order 3)        */}
      {/* background-color: var(--wheel-finish), masked by webp alpha           */}
      {/* --------------------------------------------------------------------- */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-30"
        style={{
          backgroundColor: 'var(--wheel-finish, #3A3E48)',
          WebkitMaskImage: 'url(/vehicle/wheel-mask.webp)',
          maskImage: 'url(/vehicle/wheel-mask.webp)',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
          mixBlendMode: 'multiply',
        }}
      >
        <img
          src="/vehicle/wheel-mask.webp"
          alt=""
          width={2752}
          height={1536}
          className="w-full h-full object-cover opacity-0 pointer-events-none"
          loading="eager"
          aria-hidden="true"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* --------------------------------------------------------------------- */}
      {/* LAYER 4: specular.webp — mix-blend-mode: screen (z-order 4)            */}
      {/* opacity: var(--paint-gloss), tint toward var(--paint-highlight)       */}
      {/* --------------------------------------------------------------------- */}
      <img
        src="/vehicle/specular.webp"
        alt=""
        width={2752}
        height={1536}
        className={`absolute inset-0 w-full h-full pointer-events-none select-none z-40 ${objectPosClass}`}
        style={{
          mixBlendMode: 'screen',
          opacity: 'var(--paint-gloss, 0.95)',
        }}
        loading="eager"
        aria-hidden="true"
        referrerPolicy="no-referrer"
      />

      {/* --------------------------------------------------------------------- */}
      {/* LAYER 5: lights.webp — mix-blend-mode: screen, opacity: 1 (z-order 5)  */}
      {/* --------------------------------------------------------------------- */}
      <img
        src="/vehicle/lights.webp"
        alt=""
        width={2752}
        height={1536}
        className={`absolute inset-0 w-full h-full pointer-events-none select-none z-50 ${objectPosClass}`}
        style={{
          mixBlendMode: 'screen',
          opacity: 1,
        }}
        loading="eager"
        aria-hidden="true"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
