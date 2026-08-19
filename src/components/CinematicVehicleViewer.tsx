import React from 'react';
import { VehicleConfig } from '../types';
import { VehicleRenderer } from './VehicleRenderer';

interface CinematicVehicleViewerProps {
  config: VehicleConfig;
  className?: string;
}

export const CinematicVehicleViewer: React.FC<CinematicVehicleViewerProps> = ({
  config,
  className,
}) => {
  return <VehicleRenderer config={config} className={className} />;
};
