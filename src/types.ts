export type ScreenType = 'map' | 'hypsometry' | 'landcover' | 'reports';

export interface StationData {
  id: string;
  name: string;
  type: 'limnigraph' | 'snotel' | 'runoff';
  coordinates: [number, number];
  gaugeHeight: number; // in meters
  discharge: number; // m3/s
  velocity: number; // m/s
  temperature: number; // °C
  swe?: number; // Snow Water Equivalent in mm
  status: 'normal' | 'alert' | 'warning';
  recentTrend: number[]; // last 12 readings
}

export interface LandCoverClass {
  id: string;
  name: string;
  code: string;
  areaKm2: number;
  percentage: number;
  color: string;
  runoffCoefficient: number; // Rational method C (0-1)
  description: string;
}

export interface EnvironmentalZone {
  id: string;
  type: 'Natura 2000' | 'ZNIEFF Type I' | 'Trame Bleue & RAMSAR';
  code: string;
  name: string;
  areaKm2: number;
  vulnerability: string;
  status: 'Actif' | 'Inventorié' | 'Prioritaire';
  color: string;
}

export interface BasinMetadata {
  id: string;
  name: string;
  hucCode: string;
  areaKm2: number;
  perimeterKm: number;
  graveliusKc: number; // Compactness index
  meanElevationM: number;
  minElevationM: number;
  maxElevationM: number;
  meanSlopeDeg: number;
  meanSlopePercent: number;
  hiIntegral: number; // Hypsometric Integral
  q90Discharge: number; // m3/s
  q100Discharge: number; // 100-yr flood peak discharge m3/s
  coordinates: string;
  projection: string;
  demResolution: string;
}

export interface ReportConfig {
  includeHydroStrahler: boolean;
  includeDemRelief: boolean;
  includeCorineLulc: boolean;
  includeEnvironmentalRamsar: boolean;
  includeFloodVulnerability: boolean;
  pageOrientation: 'portrait' | 'landscape';
  resolutionDpi: 150 | 300;
  includeScaleRose: boolean;
  includeDynamicLegend: boolean;
  includeInventoryTables: boolean;
}

export interface FloodSimulationState {
  isActive: boolean;
  hour: number; // 0 - 24 hours
  waterLevelRiseM: number;
  peakDischargeM3s: number;
  inundatedAreaKm2: number;
  affectedInfrastructureCount: number;
}
