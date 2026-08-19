import React from 'react';
import { VehicleConfig } from '../types';
import { VehicleRenderer } from './VehicleRenderer';

interface VehicleSVGProps {
  config: VehicleConfig;
  className?: string;
}

export const VehicleSVG: React.FC<VehicleSVGProps> = ({ config, className }) => {
  return <VehicleRenderer config={config} className={className} />;
};
