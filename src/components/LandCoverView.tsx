import React, { useState, useRef } from 'react';
import {
  Trees,
  Camera,
  Layers,
  Sliders,
  AlertTriangle,
  ArrowRight,
  Droplets,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { CLEARWATER_BASIN, CORINE_LAND_COVER, ENVIRONMENTAL_ZONES } from '../data/basinData';
import { exportSvgToDataUrl, downloadDataUrl } from '../utils/imageExporter';

export const LandCoverView: React.FC = () => {
  // Simulator state: urban delta in percentage points (-5% to +15%)
  const [urbanDelta, setUrbanDelta] = useState<number>(0);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Baseline LULC
  const baseForest = 52.0;
  const baseAgri = 33.0;
  const baseUrban = 15.0;

  // New simulated percentages
  const simulatedUrban = Math.max(5, Math.min(40, baseUrban + urbanDelta));
  // Deduct from forest/agri proportionally
  const difference = urbanDelta;
  const simulatedForest = Number((baseForest - difference * 0.65).toFixed(1));
  const simulatedAgri = Number((baseAgri - difference * 0.35).toFixed(1));

  // Compute composite Runoff Coefficient C
  // Forests C=0.18, Agri C=0.38, Urban C=0.78
  const baseCompositeC = Number(
    (0.52 * 0.18 + 0.33 * 0.38 + 0.15 * 0.78).toFixed(3)
  );
  const simulatedCompositeC = Number(
    (
      (simulatedForest / 100) * 0.18 +
      (simulatedAgri / 100) * 0.38 +
      (simulatedUrban / 100) * 0.78
    ).toFixed(3)
  );

  // Peak flood discharge Q100 delta
  const basePeakQ = CLEARWATER_BASIN.q100Discharge;
  const simulatedPeakQ = Math.round(basePeakQ * (simulatedCompositeC / baseCompositeC));
  const peakDeltaPercent = Math.round(((simulatedPeakQ - basePeakQ) / basePeakQ) * 100);

  const handleExportChart = () => {
    if (!chartSvgRef.current) return;
    try {
      const url = exportSvgToDataUrl(chartSvgRef.current);
      downloadDataUrl(url, `corine-land-cover-bassin-402-${Date.now()}.svg`);
      setExportNotice('Diagramme exporté en image dynamique SVG !');
      setTimeout(() => setExportNotice(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24 gap-4 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center shrink-0">
            <Trees className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#dce2f7] tracking-tight">
              Occupation du Sol & Hydrologie de Surface
            </h2>
            <p className="text-xs text-[#bec8d2] font-mono">
              Inventaire Corine Land Cover (CLC 2024) & Coefficients de Ruissellement
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#4edea3] font-mono text-xs font-medium transition-colors border border-[#3e4850]/40"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Export Image Dynamique</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-[#00a572]/20 border border-[#00a572]/40 text-[#4edea3] font-mono text-xs font-bold">
            C composite = {simulatedCompositeC}
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-2 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 text-[#4edea3] font-mono text-xs text-center">
          {exportNotice}
        </div>
      )}

      {/* Main CLC Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CORINE_LAND_COVER.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex flex-col gap-2 relative overflow-hidden"
          >
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-[#88929b] uppercase">{item.code}</span>
              <span className="font-mono text-base font-bold" style={{ color: item.color }}>
                {item.percentage}%
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#dce2f7]">{item.name}</h3>
            <p className="text-xs text-[#bec8d2] leading-relaxed flex-1">{item.description}</p>
            <div className="pt-2 border-t border-[#232a3a] flex items-center justify-between text-xs font-mono">
              <span className="text-[#88929b]">Superficie : {item.areaKm2} km²</span>
              <span className="text-[#89ceff]">C = {item.runoffCoefficient}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Land Cover & Urbanization Scenario Simulator */}
      <div className="flex flex-col p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-md gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#0ea5e9]" />
            <h3 className="text-sm font-bold text-[#dce2f7]">
              Simulateur d'Imperméabilisation & Impact sur les Crues
            </h3>
          </div>
          <span className="font-mono text-xs text-[#89ceff] bg-[#0ea5e9]/10 px-2 py-0.5 rounded-lg border border-[#0ea5e9]/30">
            Méthode Rationnelle : Q = C · I · A
          </span>
        </div>

        <p className="text-xs text-[#bec8d2] leading-relaxed">
          Modifiez l'expansion urbaine pour évaluer en temps réel l'élévation du coefficient global de ruissellement et le débit de pointe de la crue centennale (Q100).
        </p>

        {/* Slider Controls */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#dce2f7]">
              Variation de l'urbanisation / imperméabilisation
            </span>
            <span
              className={`font-mono text-xs font-bold ${
                urbanDelta > 0 ? 'text-[#ff4d4f]' : urbanDelta < 0 ? 'text-[#4edea3]' : 'text-[#bec8d2]'
              }`}
            >
              {urbanDelta > 0 ? `+${urbanDelta}%` : `${urbanDelta}%`}
            </span>
          </div>

          <input
            type="range"
            min={-5}
            max={20}
            step={1}
            value={urbanDelta}
            onChange={(e) => setUrbanDelta(Number(e.target.value))}
            className="w-full h-2 bg-[#232a3a] rounded-lg appearance-none cursor-pointer accent-[#0ea5e9]"
          />

          <div className="flex items-center justify-between text-[11px] font-mono text-[#88929b] pt-1">
            <span>Restauration écologique (-5%)</span>
            <span>Actuel (0%)</span>
            <span>Forte urbanisation (+20%)</span>
          </div>
        </div>

        {/* Simulation Output Dashboard Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Coeff. Ruissellement (C)</span>
            <div className="text-lg font-bold font-mono text-[#dce2f7] mt-0.5">
              {simulatedCompositeC}
            </div>
            <span className="text-[10px] font-mono text-[#bec8d2]">
              Base : {baseCompositeC} ({simulatedCompositeC >= baseCompositeC ? '+' : ''}
              {(((simulatedCompositeC - baseCompositeC) / baseCompositeC) * 100).toFixed(1)}%)
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Débit de Pointe Q100</span>
            <div className="text-lg font-bold font-mono text-[#ffb4ab] mt-0.5">
              {simulatedPeakQ} m³/s
            </div>
            <span
              className={`text-[10px] font-mono font-bold ${
                peakDeltaPercent > 0 ? 'text-[#ff4d4f]' : 'text-[#4edea3]'
              }`}
            >
              {peakDeltaPercent >= 0 ? `+${peakDeltaPercent}%` : `${peakDeltaPercent}%`} par rapport à la référence
            </span>
          </div>

          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Surface Imperméabilisée</span>
            <div className="text-lg font-bold font-mono text-[#89ceff] mt-0.5">
              {Math.round((simulatedUrban / 100) * CLEARWATER_BASIN.areaKm2)} km²
            </div>
            <span className="text-[10px] font-mono text-[#bec8d2]">
              {simulatedUrban}% du territoire
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
