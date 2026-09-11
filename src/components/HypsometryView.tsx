import React, { useState, useRef } from 'react';
import {
  AreaChart,
  Camera,
  Layers,
  TrendingDown,
  Info,
  CheckCircle2,
  Sliders,
  Maximize,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { CLEARWATER_BASIN, HYPSOMETRIC_CURVE_POINTS } from '../data/basinData';
import { exportSvgToDataUrl, downloadDataUrl } from '../utils/imageExporter';

export const HypsometryView: React.FC = () => {
  const [elevationThreshold, setElevationThreshold] = useState(1240); // default mean elevation
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const chartSvgRef = useRef<SVGSVGElement | null>(null);

  // Calculate percentage of area above current elevation slider
  const totalRange = CLEARWATER_BASIN.maxElevationM - CLEARWATER_BASIN.minElevationM;
  const normalizedH = Math.max(
    0,
    Math.min(1, (elevationThreshold - CLEARWATER_BASIN.minElevationM) / totalRange)
  );
  // Using S-curve approximation for relative area above
  const areaAbovePercent = Math.max(
    0,
    Math.min(100, Math.round((1 - Math.pow(normalizedH, 0.85)) * 100))
  );
  const areaAboveKm2 = Math.round((areaAbovePercent / 100) * CLEARWATER_BASIN.areaKm2);

  const handleExportChart = () => {
    if (!chartSvgRef.current) return;
    try {
      const dataUrl = exportSvgToDataUrl(chartSvgRef.current);
      downloadDataUrl(dataUrl, `courbe-hypsometrique-bassin-402-${Date.now()}.svg`);
      setExportNotice('Image dynamique vectorielle exportée avec succès !');
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
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <AreaChart className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#dce2f7] tracking-tight">
              Analyse Hypsométrique & Morphométrie
            </h2>
            <p className="text-xs text-[#bec8d2] font-mono">
              Bassin versant : {CLEARWATER_BASIN.name} • Dénivelé ΔH = 2 166 m
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportChart}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#89ceff] font-mono text-xs font-medium transition-colors border border-[#3e4850]/40"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Export Image Dynamique</span>
          </button>
          <div className="px-3 py-1.5 rounded-xl bg-[#0ea5e9]/20 border border-[#0ea5e9]/40 text-[#89ceff] font-mono text-xs font-bold">
            HI = {CLEARWATER_BASIN.hiIntegral}
          </div>
        </div>
      </div>

      {exportNotice && (
        <div className="p-2 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 text-[#4edea3] font-mono text-xs text-center">
          {exportNotice}
        </div>
      )}

      {/* Main Interactive Hypsometric Chart */}
      <div className="flex flex-col p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#dce2f7] uppercase font-mono tracking-wider">
            Courbe Intégrale Hypsométrique (Adimensionnelle)
          </span>
          <span className="text-[11px] font-mono text-[#4edea3]">
            Stade d'Équilibre Géomorphologique (Maturité)
          </span>
        </div>

        <p className="text-xs text-[#bec8d2] mb-3 leading-relaxed">
          Représentation de la distribution de surface du bassin en fonction de la tranche altimétrique.
          L'intégrale hypsométrique HI = 0,46 caractérise un bassin versant mature au relief disséqué.
        </p>

        {/* Large SVG Curve */}
        <div className="w-full h-64 sm:h-80 relative bg-[#070e1d] rounded-xl p-3 border border-[#232a3a]">
          <svg
            ref={chartSvgRef}
            className="w-full h-full"
            viewBox="0 0 500 240"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="hypsoGradientFull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Gridlines */}
            {[40, 80, 120, 160, 200].map((y) => (
              <line
                key={y}
                x1="45"
                y1={y}
                x2="480"
                y2={y}
                stroke="#232a3a"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}
            {[45, 130, 220, 310, 400, 480].map((x) => (
              <line
                key={x}
                x1={x}
                y1="30"
                x2={x}
                y2="205"
                stroke="#232a3a"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            ))}

            {/* Y-Axis Labels (Normalized Height) */}
            <text x="8" y="44" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">1.0 (2648m)</text>
            <text x="8" y="124" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">0.5 (1565m)</text>
            <text x="8" y="204" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">0.0 (482m)</text>

            {/* Equilibrium Line */}
            <line x1="45" y1="40" x2="480" y2="200" stroke="#3e4850" strokeWidth="1.2" strokeDasharray="4 4" />

            {/* Area fill */}
            <path
              d="M 45 40 C 130 45 220 80 310 125 C 390 165 440 195 480 200 L 480 200 L 45 200 Z"
              fill="url(#hypsoGradientFull)"
            />

            {/* Main curve */}
            <path
              d="M 45 40 C 130 45 220 80 310 125 C 390 165 440 195 480 200"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Dynamic Interactive Slice Marker */}
            {(() => {
              const currentY = 200 - normalizedH * 160;
              return (
                <g>
                  <line
                    x1="45"
                    y1={currentY}
                    x2="480"
                    y2={currentY}
                    stroke="#ffb95f"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <circle cx="280" cy={currentY} r="5" fill="#ffb95f" stroke="#070e1d" strokeWidth="2" />
                </g>
              );
            })()}

            {/* X-Axis Labels */}
            <text x="45" y="222" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">0.0 (Exutoire)</text>
            <text x="240" y="222" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="middle">0.5</text>
            <text x="480" y="222" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono" textAnchor="end">1.0 (Crête)</text>
          </svg>
        </div>

        {/* Dynamic Elevation Slice Slider */}
        <div className="flex flex-col gap-2 mt-4 p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#ffb95f]" />
              <span className="text-xs font-semibold text-[#dce2f7]">
                Seuil Altimétrique Dynamique
              </span>
            </div>
            <span className="font-mono text-sm font-bold text-[#ffb95f]">
              {elevationThreshold} m a.s.l.
            </span>
          </div>

          <input
            type="range"
            min={CLEARWATER_BASIN.minElevationM}
            max={CLEARWATER_BASIN.maxElevationM}
            step={10}
            value={elevationThreshold}
            onChange={(e) => setElevationThreshold(Number(e.target.value))}
            className="w-full h-2 bg-[#232a3a] rounded-lg appearance-none cursor-pointer accent-[#ffb95f]"
          />

          <div className="flex items-center justify-between text-xs font-mono pt-1 text-[#bec8d2]">
            <div>
              Surface au-dessus de {elevationThreshold}m :{' '}
              <b className="text-[#4edea3]">{areaAboveKm2} km²</b> ({areaAbovePercent}%)
            </div>
            <div className="text-[#88929b]">
              Min: {CLEARWATER_BASIN.minElevationM}m — Max: {CLEARWATER_BASIN.maxElevationM}m
            </div>
          </div>
        </div>
      </div>

      {/* Morphometric Classification Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#88929b] uppercase">Stade d'Érosion</span>
          <div className="text-base font-bold text-[#4edea3] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Maturité (HI 0.35 - 0.60)</span>
          </div>
          <p className="text-[11px] text-[#bec8d2] leading-relaxed">
            Réseau hydrographique bien développé avec vallées ouvertes et équilibre entre dénudation et incision.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#88929b] uppercase">Compacité de Gravelius</span>
          <div className="text-base font-bold text-[#ffb95f]">
            Kc = {CLEARWATER_BASIN.graveliusKc}
          </div>
          <p className="text-[11px] text-[#bec8d2] leading-relaxed">
            Forme allongée à ovoïde modérant la concomitance des ondes de crue vers l’exutoire principal.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#141b2b] border border-[#232a3a] flex flex-col gap-1.5">
          <span className="text-[10px] font-mono text-[#88929b] uppercase">Pente Moyenne Générale</span>
          <div className="text-base font-bold text-[#89ceff]">
            {CLEARWATER_BASIN.meanSlopeDeg}° / {CLEARWATER_BASIN.meanSlopePercent}%
          </div>
          <p className="text-[11px] text-[#bec8d2] leading-relaxed">
            Pentes fortes propices au ruissellement rapide en tête de bassin et érosion torrentielle localisée.
          </p>
        </div>
      </div>
    </div>
  );
};
