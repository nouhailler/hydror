import React, { useState, useRef } from 'react';
import {
  CheckCircle,
  SquareDashed,
  TrendingUp,
  Activity,
  Trees,
  AreaChart,
  ShieldCheck,
  Radio,
  Waves,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Camera,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  CLEARWATER_BASIN,
  CORINE_LAND_COVER,
  ENVIRONMENTAL_ZONES,
  GAUGING_STATIONS,
  HYPSOMETRIC_CURVE_POINTS,
} from '../data/basinData';
import { StationData } from '../types';
import { exportSvgToDataUrl, downloadDataUrl } from '../utils/imageExporter';

interface AnalysisDrawerProps {
  onOpenReportModal: () => void;
  onOpenFloodSimulation: () => void;
  onSelectStation: (station: StationData) => void;
  onNavigateToHypsometry: () => void;
  onNavigateToLandCover: () => void;
}

export const AnalysisDrawer: React.FC<AnalysisDrawerProps> = ({
  onOpenReportModal,
  onOpenFloodSimulation,
  onSelectStation,
  onNavigateToHypsometry,
  onNavigateToLandCover,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'kpi' | 'hypsometry' | 'lulc' | 'sensors'>('kpi');
  const [d8Calculating, setD8Calculating] = useState(false);
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const hypsometrySvgRef = useRef<SVGSVGElement | null>(null);
  const lulcSvgRef = useRef<SVGSVGElement | null>(null);

  const handleRecalculateD8 = () => {
    setD8Calculating(true);
    setTimeout(() => {
      setD8Calculating(false);
      setExportFeedback('Calcul D8 terminé : réseau hydrographique recalibré');
      setTimeout(() => setExportFeedback(null), 3000);
    }, 1200);
  };

  const handleExportChartImage = (chart: 'hypso' | 'lulc') => {
    const targetRef = chart === 'hypso' ? hypsometrySvgRef.current : lulcSvgRef.current;
    if (!targetRef) return;
    try {
      const url = exportSvgToDataUrl(targetRef);
      downloadDataUrl(url, `graphique-${chart}-${Date.now()}.svg`);
      setExportFeedback('Lien image dynamique SVG généré et téléchargé !');
      setTimeout(() => setExportFeedback(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      id="analysis-drawer-panel"
      className="flex flex-col w-full bg-[#141b2b] rounded-t-3xl border-t border-[#232a3a] shadow-[0_-8px_30px_rgba(0,0,0,0.6)] z-30 transition-all duration-300 -mt-3 pb-24"
    >
      {/* Grabber Handle & Header Strip */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex flex-col items-center pt-2 pb-1.5 cursor-pointer select-none hover:bg-[#191f2f]/50 rounded-t-3xl transition-colors"
      >
        <div className="w-12 h-1.5 rounded-full bg-[#2e3545] hover:bg-[#88929b] transition-colors" />
        <div className="flex items-center gap-1 text-[10px] font-mono text-[#88929b] mt-1">
          <span>{isExpanded ? 'Réduire le panneau d’analyse' : 'Développer l’analyse approfondie'}</span>
          {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
        </div>
      </div>

      {/* Basin Metadata Identification Header */}
      <div className="px-4 pb-3 flex items-start justify-between gap-3 border-b border-[#232a3a]/60">
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[17px] font-bold text-[#dce2f7] tracking-tight truncate">
              {CLEARWATER_BASIN.name}
            </span>
            <CheckCircle className="w-4 h-4 text-[#4edea3] shrink-0" />
          </div>
          <div className="flex items-center gap-2 text-[#bec8d2] mt-0.5 text-xs font-mono">
            <span className="text-[#0ea5e9] font-medium">{CLEARWATER_BASIN.hucCode}</span>
            <span className="text-[#3e4850]">•</span>
            <span className="text-[#4edea3]">Base Calibrée USGS / IGN</span>
          </div>
        </div>

        {/* Live Catchment Flow Telemetry Badge */}
        <div className="flex flex-col items-end shrink-0 px-2.5 py-1 rounded-xl bg-[#232a3a] border border-[#3e4850]/40">
          <span className="text-[9px] text-[#88929b] font-mono uppercase tracking-wider">Débit Q90 Estival</span>
          <div className="flex items-baseline gap-1">
            <span className="text-base font-bold text-[#89ceff] font-mono">
              {CLEARWATER_BASIN.q90Discharge}
            </span>
            <span className="text-[10px] text-[#bec8d2] font-mono">m³/s</span>
          </div>
        </div>
      </div>

      {/* Drawer Content Body */}
      {isExpanded && (
        <div className="flex flex-col gap-3.5 px-4 pt-3.5 animate-in fade-in">
          {/* Notification Feedback Toast */}
          {exportFeedback && (
            <div className="p-2 rounded-xl bg-[#00a572]/20 border border-[#4edea3]/40 text-[#4edea3] font-mono text-xs text-center">
              {exportFeedback}
            </div>
          )}

          {/* Collapsible KPI Metric Grid (2x2 Compact Bento) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Area KPI Card */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a] shadow-sm hover:border-[#0ea5e9]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#bec8d2]">Surface Bassin (A)</span>
                <SquareDashed className="w-3.5 h-3.5 text-[#0ea5e9]" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#dce2f7] font-mono">
                  {CLEARWATER_BASIN.areaKm2.toLocaleString('fr-FR')}
                </span>
                <span className="text-[11px] text-[#bec8d2] font-mono">km²</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#4edea3] text-[10px] font-mono">
                <TrendingUp className="w-3 h-3" />
                <span>+2.4% vs moyenne régionale</span>
              </div>
            </div>

            {/* Perimeter / Compactness KPI Card */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a] shadow-sm hover:border-[#4edea3]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#bec8d2]">Périmètre (P)</span>
                <Activity className="w-3.5 h-3.5 text-[#4edea3]" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#dce2f7] font-mono">
                  {CLEARWATER_BASIN.perimeterKm}
                </span>
                <span className="text-[11px] text-[#bec8d2] font-mono">km</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#bec8d2] text-[10px] font-mono">
                <span className="font-semibold text-[#ffb95f]">Kc: {CLEARWATER_BASIN.graveliusKc}</span>
                <span>(Indice Gravelius)</span>
              </div>
            </div>

            {/* Elevation Profile KPI Card */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a] shadow-sm hover:border-[#ffb95f]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#bec8d2]">Altitude Moyenne</span>
                <AreaChart className="w-3.5 h-3.5 text-[#ffb95f]" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#dce2f7] font-mono">
                  {CLEARWATER_BASIN.meanElevationM}
                </span>
                <span className="text-[11px] text-[#bec8d2] font-mono">m a.s.l.</span>
              </div>
              <div className="flex items-center justify-between mt-1 text-[#88929b] text-[10px] font-mono">
                <span>Min: {CLEARWATER_BASIN.minElevationM}m</span>
                <span>Max: {CLEARWATER_BASIN.maxElevationM}m</span>
              </div>
            </div>

            {/* Slope / Relief Ratio KPI Card */}
            <div className="flex flex-col p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a] shadow-sm hover:border-[#ff4d4f]/40 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-[#bec8d2]">Pente Moyenne</span>
                <Waves className="w-3.5 h-3.5 text-[#ffb4ab]" />
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-bold text-[#dce2f7] font-mono">
                  {CLEARWATER_BASIN.meanSlopeDeg}°
                </span>
                <span className="text-[11px] text-[#bec8d2] font-mono">/ {CLEARWATER_BASIN.meanSlopePercent}%</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[#ffb95f] text-[10px] font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffb95f]"></span>
                <span>Fort potentiel d'écoulement</span>
              </div>
            </div>
          </div>

          {/* Analytical Chart 1: Hypsometric Curve */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#191f2f] border border-[#232a3a] shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <AreaChart className="w-4 h-4 text-[#0ea5e9]" />
                <span className="text-xs font-semibold text-[#dce2f7]">
                  Distribution Hypsométrique
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportChartImage('hypso')}
                  title="Créer un lien image dynamique vers ce graphique"
                  className="p-1 rounded-md text-[#88929b] hover:text-[#89ceff] hover:bg-[#232a3a] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <div className="px-2 py-0.5 rounded-lg bg-[#232a3a] text-[#0ea5e9] font-mono text-[10px] font-bold border border-[#0ea5e9]/30">
                  HI = {CLEARWATER_BASIN.hiIntegral}
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#bec8d2] mb-2 leading-relaxed">
              Aire relative (a/A) vs Altitude normalisée (h/H) : stade d'équilibre d'érosion mûr.
            </p>

            {/* SVG Hypsometry Plot */}
            <div className="w-full h-36 relative">
              <svg
                ref={hypsometrySvgRef}
                className="w-full h-full"
                viewBox="0 0 320 130"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="hypsoGradientDrawer" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Horizontal Gridlines */}
                <line x1="30" y1="15" x2="310" y2="15" stroke="#2e3545" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="45" x2="310" y2="45" stroke="#2e3545" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="75" x2="310" y2="75" stroke="#2e3545" strokeWidth="0.8" strokeDasharray="2 2" />
                <line x1="30" y1="105" x2="310" y2="105" stroke="#2e3545" strokeWidth="0.8" />

                {/* Y-Axis Labels */}
                <text x="5" y="19" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">1.0</text>
                <text x="5" y="62" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">0.5</text>
                <text x="5" y="108" fill="#88929b" fontSize="9" fontFamily="JetBrains Mono">0.0</text>

                {/* Equilibrium Reference Line */}
                <line x1="30" y1="15" x2="310" y2="105" stroke="#3e4850" strokeWidth="1" strokeDasharray="4 4" />

                {/* Filled Hypsometric Area */}
                <path
                  d="M 30 15 C 80 18 130 35 180 62 C 230 89 270 102 310 105 L 310 105 L 30 105 Z"
                  fill="url(#hypsoGradientDrawer)"
                />

                {/* S-Curve Stroke */}
                <path
                  d="M 30 15 C 80 18 130 35 180 62 C 230 89 270 102 310 105"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Median Intercept Point */}
                <circle cx="180" cy="62" r="4" fill="#4edea3" stroke="#070e1d" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="flex items-center justify-between text-[#88929b] font-mono text-[10px] mt-1 pt-1.5 border-t border-[#232a3a]">
              <span>0.0 (Exutoire 482m)</span>
              <button
                onClick={onNavigateToHypsometry}
                className="text-[#89ceff] hover:underline flex items-center gap-0.5"
              >
                <span>Détail complet</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
              <span>1.0 (Crête 2648m)</span>
            </div>
          </div>

          {/* Analytical Chart 2: Land Use / Corine Land Cover (LULC) */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#191f2f] border border-[#232a3a] shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Trees className="w-4 h-4 text-[#4edea3]" />
                <span className="text-xs font-semibold text-[#dce2f7]">
                  Occupation du Sol (Corine Land Cover)
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportChartImage('lulc')}
                  title="Créer un lien image dynamique vers ce diagramme"
                  className="p-1 rounded-md text-[#88929b] hover:text-[#4edea3] hover:bg-[#232a3a] transition-colors"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
                <span className="px-2 py-0.5 rounded-lg bg-[#232a3a] text-[#4edea3] font-mono text-[10px] font-bold border border-[#4edea3]/30">
                  Millésime 2024
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#bec8d2] mb-2 leading-relaxed">
              Répartition surfacique sur les 1 428,6 km² du bassin versant :
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 my-1">
              {/* Donut Chart SVG */}
              <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
                <svg
                  ref={lulcSvgRef}
                  className="w-full h-full -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#232a3a" strokeWidth="14" />
                  {/* Forests: 52% -> 124.15 on 238.76 circumference */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray="124.15 238.76"
                    strokeDashoffset="0"
                  />
                  {/* Agriculture: 33% -> 78.79 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray="78.79 238.76"
                    strokeDashoffset="-124.15"
                  />
                  {/* Urban/Water: 15% -> 35.81 */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="14"
                    strokeDasharray="35.81 238.76"
                    strokeDashoffset="-202.94"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="font-mono text-xs font-bold text-[#dce2f7]">1 429</span>
                  <span className="font-mono text-[9px] text-[#88929b]">km² total</span>
                </div>
              </div>

              {/* LULC Categories Legend List */}
              <div className="flex flex-col flex-1 w-full gap-1.5">
                {CORINE_LAND_COVER.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-1.5 rounded-xl bg-[#232a3a]/60 border border-[#232a3a]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-medium text-[#dce2f7] truncate">
                          {item.name}
                        </span>
                        <span className="font-mono text-[9px] text-[#88929b]">
                          {item.areaKm2} km² • Coeff C: {item.runoffCoefficient}
                        </span>
                      </div>
                    </div>
                    <span
                      className="font-mono text-xs font-bold shrink-0 ml-2"
                      style={{ color: item.color }}
                    >
                      {item.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={onNavigateToLandCover}
                className="text-[#4edea3] hover:underline text-[11px] font-mono flex items-center gap-1"
              >
                <span>Simulateur d'urbanisation & ruissellement</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Environmental Protected Zones Card */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#191f2f] border border-[#232a3a] shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0ea5e9]" />
                <span className="text-xs font-semibold text-[#dce2f7]">
                  Zonages & Enjeux Environnementaux
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-[#00a572]/20 text-[#4edea3] font-mono text-[10px] font-bold border border-[#00a572]/30">
                41.8% protégé
              </span>
            </div>

            <p className="text-[11px] text-[#bec8d2] mb-2 leading-relaxed">
              Inventaires écologiques et dispositifs réglementaires actifs sur le bassin.
            </p>

            <div className="flex flex-col gap-2">
              {ENVIRONMENTAL_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#232a3a]/60 border border-[#232a3a]"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="px-1.5 py-0.5 rounded font-mono text-[10px] font-bold"
                        style={{
                          backgroundColor: `${zone.color}20`,
                          color: zone.color,
                        }}
                      >
                        {zone.type}
                      </span>
                      <span className="font-mono text-[10px] text-[#88929b] truncate">
                        {zone.code}
                      </span>
                    </div>
                    <span className="text-xs text-[#dce2f7] mt-0.5 font-medium truncate">
                      {zone.name}
                    </span>
                    <span className="text-[10px] text-[#88929b] font-mono">
                      {zone.areaKm2} km² • {zone.vulnerability}
                    </span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded font-mono text-[10px] font-bold shrink-0 ml-2"
                    style={{
                      backgroundColor: `${zone.color}15`,
                      color: zone.color,
                      border: `1px solid ${zone.color}40`,
                    }}
                  >
                    {zone.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Monitoring Sensors */}
          <div className="flex flex-col p-3 rounded-2xl bg-[#191f2f] border border-[#232a3a] shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#0ea5e9]" />
                <span className="text-xs font-semibold text-[#dce2f7]">
                  Capteurs & Stations Télémétriques
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#4edea3] font-bold">
                3/3 En ligne
              </span>
            </div>

            <div className="flex flex-col gap-2 divide-y divide-[#232a3a]">
              {GAUGING_STATIONS.map((st) => (
                <div
                  key={st.id}
                  onClick={() => onSelectStation(st)}
                  className="pt-2 flex items-center justify-between cursor-pointer hover:bg-[#232a3a]/30 p-1.5 rounded-lg transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#dce2f7] truncate">
                      {st.name}
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b]">
                      Débit : <b className="text-[#89ceff]">{st.discharge} m³/s</b> • Hauteur : {st.gaugeHeight}m
                      {st.swe && ` • SWE : ${st.swe}mm`}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[10px] px-2 py-0.5 rounded shrink-0 ${
                      st.status === 'warning'
                        ? 'bg-[#ffb95f]/20 text-[#ffb95f] border border-[#ffb95f]/30'
                        : 'bg-[#00a572]/20 text-[#4edea3] border border-[#00a572]/30'
                    }`}
                  >
                    {st.status === 'warning' ? 'Fonte Active' : 'Normal'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Action Commands Execution Dock */}
          <div className="flex flex-col gap-2 pt-1">
            {/* Run 100-Yr Flood Simulation */}
            <button
              id="drawer-run-flood-sim-btn"
              onClick={onOpenFloodSimulation}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0ea5e9] text-[#070e1d] font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all hover:bg-[#38bdf8]"
            >
              <Waves className="w-4 h-4" />
              <span>Lancer la Simulation de Crue Q100</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                id="drawer-recalc-d8-btn"
                onClick={handleRecalculateD8}
                disabled={d8Calculating}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#2e3545] text-[#dce2f7] hover:text-[#89ceff] hover:bg-[#323949] font-mono text-[11px] font-semibold transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0ea5e9]" />
                <span>{d8Calculating ? 'Calcul en cours...' : 'Recalculer Flux D8'}</span>
              </button>

              <button
                id="drawer-full-report-btn"
                onClick={onOpenReportModal}
                className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl bg-[#2e3545] text-[#dce2f7] hover:text-[#4edea3] hover:bg-[#323949] font-mono text-[11px] font-semibold transition-colors"
              >
                <Layers className="w-3.5 h-3.5 text-[#4edea3]" />
                <span>Générer Rapport</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
