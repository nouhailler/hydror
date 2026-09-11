import React, { useState, useRef } from 'react';
import {
  Navigation,
  Plus,
  Minus,
  Ruler,
  Maximize2,
  Box,
  FileText,
  FileSpreadsheet,
  Droplets,
  Share2,
  Eye,
  Camera,
  Activity,
} from 'lucide-react';
import { CLEARWATER_BASIN, GAUGING_STATIONS } from '../data/basinData';
import { StationData } from '../types';
import { exportSvgToDataUrl, downloadDataUrl } from '../utils/imageExporter';

interface MapCanvasProps {
  onOpenReportModal: () => void;
  onSelectStation: (station: StationData) => void;
  onToggleFloodSimulation: () => void;
  isFloodSimulationActive: boolean;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  onOpenReportModal,
  onSelectStation,
  onToggleFloodSimulation,
  isFloodSimulationActive,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [is3DMode, setIs3DMode] = useState(false);
  const [compassRotation, setCompassRotation] = useState(0);

  // Active layer toggles
  const [showContours, setShowContours] = useState(true);
  const [showStreams, setShowStreams] = useState(true);
  const [showFlowDir, setShowFlowDir] = useState(false);
  const [showDemRelief, setShowDemRelief] = useState(true);

  // Measurement mode state
  const [measureMode, setMeasureMode] = useState(false);
  const [measurePoints, setMeasurePoints] = useState<{ x: number; y: number }[]>([]);
  const [measuredDistance, setMeasuredDistance] = useState<number | null>(null);

  // Hovered station tooltip
  const [hoveredStation, setHoveredStation] = useState<StationData | null>(null);

  // SVG ref for dynamic image generation
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [imageExportMessage, setImageExportMessage] = useState<string | null>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setCompassRotation(0);
    setMeasurePoints([]);
    setMeasuredDistance(null);
  };

  const handleCompassClick = () => {
    setCompassRotation((prev) => (prev === 0 ? 45 : 0));
  };

  const handleCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!measureMode) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (measurePoints.length === 0) {
      setMeasurePoints([{ x, y }]);
      setMeasuredDistance(null);
    } else if (measurePoints.length === 1) {
      const p1 = measurePoints[0];
      const p2 = { x, y };
      setMeasurePoints([p1, p2]);
      // Scale: 400px width represents approx 50km
      const pixelDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const kmDistance = (pixelDistance / 400) * 50;
      setMeasuredDistance(Number(kmDistance.toFixed(2)));
    } else {
      setMeasurePoints([{ x, y }]);
      setMeasuredDistance(null);
    }
  };

  const handleExportMapImage = () => {
    if (!svgRef.current) return;
    try {
      const dataUrl = exportSvgToDataUrl(svgRef.current);
      downloadDataUrl(dataUrl, `hydrosphere-bassin-402-${Date.now()}.svg`);
      setImageExportMessage('Carte vectorielle SVG exportée dynamiquement !');
      setTimeout(() => setImageExportMessage(null), 3500);
    } catch (e) {
      console.error(e);
      setImageExportMessage("Erreur lors de l'export de l'image");
      setTimeout(() => setImageExportMessage(null), 3000);
    }
  };

  const handleExportExcelDataset = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Station_ID,Nom,Type,Hauteur_m,Debit_m3s,Vitesse_ms,Temperature_C,Statut\n' +
      GAUGING_STATIONS.map(
        (s) =>
          `"${s.id}","${s.name}","${s.type}",${s.gaugeHeight},${s.discharge},${s.velocity},${s.temperature},"${s.status}"`
      ).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hydrosphere-donnees-bassin-402.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-[52vh] min-h-[380px] overflow-hidden bg-[#070e1d] select-none border-b border-[#232a3a]">
      {/* Dynamic 3D perspective wrapper */}
      <div
        className={`w-full h-full transition-transform duration-500 origin-center ${
          is3DMode ? 'scale-90 [transform:rotateX(28deg)_rotateZ(-8deg)]' : ''
        }`}
        style={{
          transform: is3DMode
            ? 'perspective(900px) rotateX(28deg) rotateZ(-6deg) scale(0.92)'
            : `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      >
        <svg
          ref={svgRef}
          onClick={handleCanvasClick}
          className="w-full h-full object-cover cursor-crosshair"
          viewBox="0 0 400 380"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Topographic Hillshade Glow */}
            <radialGradient id="topo-glow" cx="48%" cy="46%" r="58%">
              <stop offset="0%" stopColor="#0ea5e9" stopOpacity={showDemRelief ? '0.22' : '0.08'} />
              <stop offset="45%" stopColor="#00a572" stopOpacity={showDemRelief ? '0.12' : '0.04'} />
              <stop offset="100%" stopColor="#070e1d" stopOpacity="0.8" />
            </radialGradient>

            {/* River Stream Gradient */}
            <linearGradient id="stream-grad" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#4edea3" />
              <stop offset="60%" stopColor="#89ceff" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>

            {/* Basin Border Glow Filter */}
            <filter id="basin-glow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#0ea5e9" floodOpacity="0.75" />
            </filter>

            {/* Flood Inundation Pulsing Filter */}
            <radialGradient id="flood-fill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d4f" stopOpacity="0.55" />
              <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#070e1d" stopOpacity="0" />
            </radialGradient>

            {/* Coordinate Grid Pattern */}
            <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#232a3a" strokeWidth="0.5" strokeDasharray="2 4" />
            </pattern>
          </defs>

          {/* Coordinate Grid Matrix */}
          <rect width="100%" height="100%" fill="#070e1d" />
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />

          {/* Shaded Relief / DEM Layer */}
          {showDemRelief && (
            <path
              d="M 50 40 Q 120 70 190 30 T 330 90 T 380 240 T 260 360 T 110 320 T 30 180 Z"
              fill="url(#topo-glow)"
            />
          )}

          {/* Topographic Contour Lines (Isohypses) */}
          {showContours && (
            <g fill="none" stroke="#3e4850" strokeWidth="0.75" opacity="0.5">
              <path d="M 40 180 C 70 140 130 110 200 120 C 270 130 330 80 370 140" />
              <path d="M 45 210 C 85 165 140 145 220 150 C 290 155 325 125 365 175" />
              <path d="M 60 250 C 105 210 160 185 240 190 C 300 195 315 220 350 245" />
              <path d="M 90 280 C 130 250 190 230 250 240 C 280 245 300 270 330 290" />
              <path d="M 120 310 C 160 285 220 275 270 280" />
            </g>
          )}

          {/* Flood Inundation Simulation Zone */}
          {isFloodSimulationActive && (
            <g className="animate-pulse">
              <path
                d="M 180 180 C 230 190 240 250 240 310 C 230 355 200 340 185 290 C 170 240 160 210 180 180 Z"
                fill="url(#flood-fill)"
                stroke="#ff4d4f"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <text x="210" y="270" fill="#ffb4ab" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                Q100 Submersion
              </text>
            </g>
          )}

          {/* Watershed Basin Polygon Boundary */}
          <path
            d="M 95 62 C 145 35 235 40 285 75 C 335 110 365 160 350 225 C 335 290 290 345 215 352 C 140 360 85 310 65 245 C 45 180 50 90 95 62 Z"
            fill="#0ea5e9"
            fillOpacity={showDemRelief ? '0.05' : '0.02'}
            stroke="#0ea5e9"
            strokeWidth="2.2"
            strokeDasharray="8 3"
            filter="url(#basin-glow)"
          />

          {/* Sub-Catchment Divides */}
          <path
            d="M 200 195 C 160 190 120 180 80 165"
            fill="none"
            stroke="#88929b"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />
          <path
            d="M 215 238 C 265 245 300 270 340 280"
            fill="none"
            stroke="#88929b"
            strokeWidth="1"
            strokeDasharray="3 3"
            opacity="0.4"
          />

          {/* Flow Direction Vectors (D8) */}
          {showFlowDir && (
            <g fill="#38bdf8" opacity="0.75" fontSize="10">
              <text x="140" y="110">↘</text>
              <text x="180" y="90">↓</text>
              <text x="250" y="140">↙</text>
              <text x="280" y="190">↙</text>
              <text x="130" y="230">↘</text>
              <text x="180" y="270">↓</text>
            </g>
          )}

          {/* River Network Hierarchy (Strahler Orders) */}
          {showStreams && (
            <g>
              {/* Order 1: Headwater Tributaries */}
              <g fill="none" stroke="#4edea3" strokeWidth="1" opacity="0.65">
                <path d="M 125 78 Q 145 115 165 142" />
                <path d="M 205 60 Q 195 100 180 135" />
                <path d="M 285 105 Q 260 135 230 160" />
                <path d="M 330 170 Q 295 190 260 205" />
                <path d="M 95 240 Q 130 230 170 220" />
                <path d="M 115 285 Q 150 270 185 255" />
              </g>

              {/* Orders 2 & 3: Secondary Collectors */}
              <g fill="none" stroke="#89ceff" strokeWidth="1.9" opacity="0.85">
                <path d="M 165 142 Q 185 170 200 195" />
                <path d="M 230 160 Q 215 180 200 195" />
                <path d="M 260 205 Q 235 220 215 238" />
                <path d="M 170 220 Q 190 230 215 238" />
              </g>

              {/* Orders 4 & 5: Main Stem Clearwater River */}
              <path
                d="M 200 195 Q 215 238 220 275 T 235 348"
                fill="none"
                stroke="url(#stream-grad)"
                strokeWidth="3.6"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Hydrological Gauging Stations */}
          {GAUGING_STATIONS.map((st) => (
            <g
              key={st.id}
              className="cursor-pointer transition-transform hover:scale-125"
              transform={`translate(${st.coordinates[0]}, ${st.coordinates[1]})`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(st);
              }}
              onMouseEnter={() => setHoveredStation(st)}
              onMouseLeave={() => setHoveredStation(null)}
            >
              <circle
                className="animate-ping"
                r={st.type === 'limnigraph' ? '9' : '7'}
                fill={st.status === 'warning' ? '#ffb95f' : '#0ea5e9'}
                fillOpacity="0.25"
              />
              <circle
                r={st.type === 'limnigraph' ? '6' : '5'}
                fill="#070e1d"
                stroke={st.status === 'warning' ? '#ffb95f' : '#0ea5e9'}
                strokeWidth="2"
              />
              <circle
                r="2.5"
                fill={
                  st.type === 'limnigraph'
                    ? '#4edea3'
                    : st.status === 'warning'
                    ? '#ffb95f'
                    : '#89ceff'
                }
              />
            </g>
          ))}

          {/* Active Measurement Tool Line */}
          {measurePoints.length === 2 && (
            <g>
              <line
                x1={measurePoints[0].x}
                y1={measurePoints[0].y}
                x2={measurePoints[1].x}
                y2={measurePoints[1].y}
                stroke="#ffb95f"
                strokeWidth="2"
                strokeDasharray="4 2"
              />
              <circle cx={measurePoints[0].x} cy={measurePoints[0].y} r="3" fill="#ffb95f" />
              <circle cx={measurePoints[1].x} cy={measurePoints[1].y} r="3" fill="#ffb95f" />
              <rect
                x={(measurePoints[0].x + measurePoints[1].x) / 2 - 25}
                y={(measurePoints[0].y + measurePoints[1].y) / 2 - 14}
                width="50"
                height="16"
                rx="4"
                fill="#070e1d"
                stroke="#ffb95f"
                strokeWidth="1"
              />
              <text
                x={(measurePoints[0].x + measurePoints[1].x) / 2}
                y={(measurePoints[0].y + measurePoints[1].y) / 2 - 2}
                textAnchor="middle"
                fill="#ffddb8"
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight="bold"
              >
                {measuredDistance} km
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Top HUD: Basemap Identifier Pill & Compass */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-20">
        <div className="pointer-events-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#070e1d]/85 backdrop-blur-md border border-[#232a3a] shadow-md text-[#dce2f7]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span className="font-mono text-[11px] font-semibold tracking-wide">Dark Topo v2.4</span>
          <span className="font-mono text-[11px] text-[#88929b]">• HUC-8 #402</span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Dynamic Image Export Quick Button */}
          <button
            id="map-export-image-btn"
            onClick={handleExportMapImage}
            title="Créer un lien image dynamique à partir du HTML / SVG"
            className="w-8 h-8 rounded-full bg-[#070e1d]/90 backdrop-blur-md border border-[#232a3a] shadow-md flex items-center justify-center text-[#89ceff] hover:text-white hover:bg-[#232a3a] transition-all"
          >
            <Camera className="w-4 h-4" />
          </button>

          {/* Compass Rose Widget */}
          <button
            id="map-compass-btn"
            onClick={handleCompassClick}
            aria-label="Orienter au Nord"
            className="w-8 h-8 rounded-full bg-[#070e1d]/90 backdrop-blur-md border border-[#232a3a] shadow-md flex items-center justify-center text-[#dce2f7] hover:bg-[#232a3a] transition-all"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            <div className="flex flex-col items-center justify-center -space-y-1">
              <span className="font-mono text-[9px] font-bold text-[#ffb4ab]">N</span>
              <Navigation className="w-3.5 h-3.5 text-[#bec8d2]" />
            </div>
          </button>
        </div>
      </div>

      {/* Mini Layer Switcher Pill Strip */}
      <div className="absolute top-11 left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-full bg-[#070e1d]/90 backdrop-blur-lg border border-[#232a3a] shadow-lg z-20 overflow-x-auto max-w-[90vw]">
        <button
          onClick={() => setShowContours(!showContours)}
          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold transition-all ${
            showContours
              ? 'bg-[#0ea5e9] text-[#070e1d]'
              : 'bg-[#191f2f] text-[#bec8d2] hover:text-[#dce2f7]'
          }`}
        >
          Courbes
        </button>
        <button
          onClick={() => setShowStreams(!showStreams)}
          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold transition-all ${
            showStreams
              ? 'bg-[#0ea5e9] text-[#070e1d]'
              : 'bg-[#191f2f] text-[#bec8d2] hover:text-[#dce2f7]'
          }`}
        >
          Réseau
        </button>
        <button
          onClick={() => setShowFlowDir(!showFlowDir)}
          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold transition-all ${
            showFlowDir
              ? 'bg-[#0ea5e9] text-[#070e1d]'
              : 'bg-[#191f2f] text-[#bec8d2] hover:text-[#dce2f7]'
          }`}
        >
          Flux D8
        </button>
        <button
          onClick={() => setShowDemRelief(!showDemRelief)}
          className={`px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold transition-all ${
            showDemRelief
              ? 'bg-[#0ea5e9] text-[#070e1d]'
              : 'bg-[#191f2f] text-[#bec8d2] hover:text-[#dce2f7]'
          }`}
        >
          MNT Relief
        </button>
      </div>

      {/* Right Side Map Controls Stack */}
      <div className="absolute right-2 top-20 flex flex-col gap-1.5 z-20">
        <div className="flex flex-col rounded-xl bg-[#070e1d]/90 backdrop-blur-md border border-[#232a3a] shadow-md overflow-hidden">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom avant"
            className="w-9 h-9 flex items-center justify-center text-[#dce2f7] hover:bg-[#2e3545] transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
          <div className="w-5 h-[1px] bg-[#2e3545] self-center"></div>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom arrière"
            className="w-9 h-9 flex items-center justify-center text-[#dce2f7] hover:bg-[#2e3545] transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>

        {/* Measurement Tool Button */}
        <button
          onClick={() => {
            setMeasureMode(!measureMode);
            setMeasurePoints([]);
            setMeasuredDistance(null);
          }}
          aria-label="Mesure spatiale"
          className={`w-9 h-9 rounded-xl border shadow-md flex items-center justify-center transition-all ${
            measureMode
              ? 'bg-[#ffb95f] text-[#070e1d] border-[#ffb95f]'
              : 'bg-[#070e1d]/90 text-[#89ceff] hover:bg-[#2e3545] border-[#232a3a]'
          }`}
        >
          <Ruler className="w-4 h-4" />
        </button>

        {/* Reset View Button */}
        <button
          onClick={handleResetView}
          aria-label="Centrer l'étendue"
          className="w-9 h-9 rounded-xl bg-[#070e1d]/90 backdrop-blur-md border border-[#232a3a] shadow-md flex items-center justify-center text-[#bec8d2] hover:text-[#dce2f7] hover:bg-[#2e3545] transition-colors"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Hovered Station Tooltip */}
      {hoveredStation && (
        <div className="absolute top-24 left-3 z-30 p-2 rounded-xl bg-[#141b2b]/95 border border-[#0ea5e9]/50 shadow-2xl backdrop-blur-md text-xs font-mono max-w-xs animate-in fade-in">
          <div className="text-[#89ceff] font-bold truncate">{hoveredStation.name}</div>
          <div className="text-[#bec8d2] text-[10px] mt-0.5">
            Débit: <span className="text-[#4edea3] font-bold">{hoveredStation.discharge} m³/s</span> • Haut:{' '}
            {hoveredStation.gaugeHeight}m
          </div>
          <div className="text-[9px] text-[#88929b] mt-0.5">Cliquez pour le détail hydrographique</div>
        </div>
      )}

      {/* Bottom Left Scale & Geodesic Telemetry */}
      <div className="absolute bottom-14 left-2 flex flex-col gap-1 pointer-events-none z-20">
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#070e1d]/85 backdrop-blur-md border border-[#232a3a] shadow-sm">
          <div className="w-12 h-1 bg-gradient-to-r from-[#dce2f7] to-[#88929b] rounded-sm"></div>
          <span className="font-mono text-[10px] text-[#dce2f7] font-medium">0 - 5 km</span>
        </div>
        <div className="px-2.5 py-0.5 rounded-lg bg-[#070e1d]/85 backdrop-blur-md border border-[#232a3a] shadow-sm w-fit">
          <span className="font-mono text-[9px] text-[#88929b] tracking-wider">
            {CLEARWATER_BASIN.projection} • {CLEARWATER_BASIN.demResolution}
          </span>
        </div>
      </div>

      {/* Export Toast Feedback */}
      {imageExportMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-[#00a572] text-[#070e1d] font-bold font-mono text-xs shadow-xl animate-in fade-in slide-in-from-top-2">
          {imageExportMessage}
        </div>
      )}

      {/* Floating Action Bar (Map Tools) */}
      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between gap-1.5 p-1.5 rounded-2xl bg-[#141b2b]/95 backdrop-blur-xl border border-[#232a3a] shadow-2xl z-20">
        {/* 3D Terrain Mode Toggle */}
        <button
          id="toggle-3d-dem-btn"
          onClick={() => setIs3DMode(!is3DMode)}
          className={`flex-1 flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl font-mono text-[11px] font-semibold transition-all active:scale-95 ${
            is3DMode
              ? 'bg-[#00a572] text-[#070e1d] shadow-md shadow-emerald-500/20'
              : 'bg-[#2e3545]/70 text-[#4edea3] hover:bg-[#2e3545]'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>3D DEM</span>
        </button>

        {/* Export PDF Map (Opens Report Modal) */}
        <button
          id="open-pdf-map-btn"
          onClick={onOpenReportModal}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl bg-[#2e3545]/70 text-[#dce2f7] hover:text-[#89ceff] hover:bg-[#2e3545] font-mono text-[11px] font-medium transition-all active:scale-95"
        >
          <FileText className="w-4 h-4 text-[#0ea5e9]" />
          <span>PDF Map</span>
        </button>

        {/* Export Excel Dataset */}
        <button
          id="export-excel-btn"
          onClick={handleExportExcelDataset}
          className="flex-1 flex items-center justify-center gap-1.5 h-10 px-2 rounded-xl bg-[#2e3545]/70 text-[#dce2f7] hover:text-[#4edea3] hover:bg-[#2e3545] font-mono text-[11px] font-medium transition-all active:scale-95"
        >
          <FileSpreadsheet className="w-4 h-4 text-[#4edea3]" />
          <span>Excel</span>
        </button>

        {/* Trigger 100-Year Flood Simulation Overlay */}
        <button
          id="trigger-flood-sim-btn"
          onClick={onToggleFloodSimulation}
          title="Simulation de crue centennale Q100"
          className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95 ${
            isFloodSimulationActive
              ? 'bg-[#ff4d4f] text-white animate-bounce'
              : 'bg-[#0ea5e9] text-[#070e1d] hover:bg-[#38bdf8]'
          }`}
        >
          <Droplets className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
