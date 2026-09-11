import React, { useRef, useState } from 'react';
import {
  X,
  Printer,
  Download,
  Share2,
  Check,
  Camera,
  FileText,
  Compass,
  Layers,
  Activity,
  Award,
  Calendar,
  Droplets,
} from 'lucide-react';
import {
  CLEARWATER_BASIN,
  CORINE_LAND_COVER,
  ENVIRONMENTAL_ZONES,
  GAUGING_STATIONS,
} from '../data/basinData';
import { ReportConfig } from '../types';
import { exportSvgToDataUrl, downloadDataUrl } from '../utils/imageExporter';

interface ReportViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportConfig;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  isOpen,
  onClose,
  config,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const reportSvgRef = useRef<SVGSVGElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyDynamicImageLink = () => {
    if (!reportSvgRef.current) return;
    try {
      const dataUrl = exportSvgToDataUrl(reportSvgRef.current);
      navigator.clipboard.writeText(dataUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadSvg = () => {
    if (!reportSvgRef.current) return;
    try {
      const dataUrl = exportSvgToDataUrl(reportSvgRef.current);
      downloadDataUrl(dataUrl, `rapport-hydrosphere-a4-${Date.now()}.svg`);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadJson = () => {
    const data = {
      bassin: CLEARWATER_BASIN,
      stations: GAUGING_STATIONS,
      occupationSol: CORINE_LAND_COVER,
      zonages: ENVIRONMENTAL_ZONES,
      dateGeneration: new Date().toISOString(),
      config,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    downloadDataUrl(url, `hydrosphere-rapport-data-${Date.now()}.json`);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="report-viewer-modal"
      className="fixed inset-0 z-50 flex flex-col bg-[#070e1d]/95 backdrop-blur-xl animate-in fade-in duration-200 overflow-y-auto"
    >
      {/* Top Floating Control Bar */}
      <div className="sticky top-0 z-50 bg-[#0c1322]/90 border-b border-[#232a3a] px-4 py-2.5 flex items-center justify-between gap-3 shadow-md backdrop-blur-md no-print">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-5 h-5 text-[#0ea5e9]" />
          <div className="flex flex-col">
            <span className="font-bold text-sm text-[#dce2f7] truncate">
              Rapport Synthétique A4 — {CLEARWATER_BASIN.name}
            </span>
            <span className="font-mono text-[10px] text-[#4edea3]">
              Rendu {config.pageOrientation === 'portrait' ? 'Portrait' : 'Paysage'} • {config.resolutionDpi} DPI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Print / Save as PDF */}
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0ea5e9] text-[#070e1d] font-bold text-xs hover:bg-[#38bdf8] transition-all shadow-md active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Imprimer / PDF</span>
          </button>

          {/* Copy dynamic image link */}
          <button
            onClick={handleCopyDynamicImageLink}
            title="Copier le lien d'image dynamique généré à partir du HTML/SVG"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#89ceff] font-mono text-xs transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-[#4edea3]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{copiedLink ? 'Lien copié !' : 'Lien Image HTML'}</span>
          </button>

          {/* Download SVG Map */}
          <button
            onClick={handleDownloadSvg}
            title="Télécharger l'image vectorielle"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#dce2f7] font-mono text-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">SVG</span>
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#bec8d2] hover:text-white flex items-center justify-center transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable A4 Container */}
      <div className="flex-1 flex justify-center p-3 sm:p-6 pb-20">
        <div
          className={`w-full max-w-[840px] bg-[#0c1322] border border-[#232a3a] rounded-2xl shadow-2xl p-6 sm:p-10 flex flex-col gap-6 print-page ${
            config.pageOrientation === 'landscape' ? 'max-w-[1100px]' : ''
          }`}
        >
          {/* Header of Report Document */}
          <div className="flex items-start justify-between border-b border-[#232a3a] pb-4 gap-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#0ea5e9] flex items-center justify-center text-[#070e1d] font-bold">
                  <Droplets className="w-4 h-4" />
                </div>
                <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#0ea5e9]">
                  HydroSphere GIS Research Lab
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#dce2f7] mt-1.5 tracking-tight">
                Rapport Morphométrique & Diagnostic Hydrologique
              </h1>
              <p className="text-xs text-[#bec8d2] mt-0.5 font-mono">
                Bassin versant : <b className="text-[#89ceff]">{CLEARWATER_BASIN.name}</b> • {CLEARWATER_BASIN.hucCode}
              </p>
            </div>

            <div className="flex flex-col items-end text-right font-mono text-[10px] text-[#88929b] shrink-0">
              <div className="flex items-center gap-1 text-[#4edea3] font-bold">
                <Calendar className="w-3 h-3" />
                <span>{new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
              </div>
              <span>Réf : HYD-402-SYNTH-A4</span>
              <span>Système : {CLEARWATER_BASIN.projection}</span>
            </div>
          </div>

          {/* Section 1: Visual Map & Strahler Network Vector Snapshot */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-mono font-semibold uppercase tracking-wider text-[#88929b]">
              <span>Cartographie Synthétique du Bassin</span>
              <span className="text-[#0ea5e9]">Ordres Strahler 1 à 5</span>
            </div>

            <div className="w-full h-72 sm:h-80 rounded-xl overflow-hidden border border-[#232a3a] bg-[#070e1d] relative">
              <svg
                ref={reportSvgRef}
                className="w-full h-full"
                viewBox="0 0 400 280"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="100%" height="100%" fill="#070e1d" />
                {/* Topo hillshade background */}
                <path
                  d="M 50 20 Q 120 50 190 20 T 330 60 T 380 180 T 260 260 T 110 240 T 30 140 Z"
                  fill="#0ea5e9"
                  fillOpacity="0.08"
                />

                {/* Watershed Basin Contour */}
                <path
                  d="M 95 32 C 145 15 235 20 285 45 C 335 80 365 120 350 175 C 335 220 290 265 215 272 C 140 270 85 240 65 195 C 45 140 50 60 95 32 Z"
                  fill="#0ea5e9"
                  fillOpacity="0.04"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                  strokeDasharray="6 3"
                />

                {/* Sub-catchments */}
                <path
                  d="M 200 145 C 160 140 120 130 80 115"
                  fill="none"
                  stroke="#88929b"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />
                <path
                  d="M 215 178 C 265 185 300 200 340 210"
                  fill="none"
                  stroke="#88929b"
                  strokeWidth="0.8"
                  strokeDasharray="3 3"
                  opacity="0.5"
                />

                {/* Tributaries Order 1 */}
                <g fill="none" stroke="#4edea3" strokeWidth="1" opacity="0.75">
                  <path d="M 125 48 Q 145 75 165 92" />
                  <path d="M 205 35 Q 195 65 180 90" />
                  <path d="M 285 65 Q 260 90 230 110" />
                  <path d="M 330 120 Q 295 135 260 150" />
                  <path d="M 95 180 Q 130 170 170 160" />
                </g>

                {/* Secondary Collectors Orders 2 & 3 */}
                <g fill="none" stroke="#89ceff" strokeWidth="2" opacity="0.9">
                  <path d="M 165 92 Q 185 120 200 145" />
                  <path d="M 230 110 Q 215 130 200 145" />
                  <path d="M 260 150 Q 235 165 215 178" />
                  <path d="M 170 160 Q 190 170 215 178" />
                </g>

                {/* Main Stem Order 4 & 5 */}
                <path
                  d="M 200 145 Q 215 178 220 210 T 235 268"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Station markers */}
                <g transform="translate(235, 265)">
                  <circle r="5" fill="#070e1d" stroke="#0ea5e9" strokeWidth="2" />
                  <circle r="2" fill="#4edea3" />
                  <text x="8" y="4" fill="#89ceff" fontSize="8" fontFamily="JetBrains Mono">
                    Exutoire #12340500
                  </text>
                </g>
                <g transform="translate(200, 145)">
                  <circle r="4" fill="#070e1d" stroke="#ffb95f" strokeWidth="1.5" />
                  <circle r="1.8" fill="#ffb95f" />
                  <text x="7" y="4" fill="#ffb95f" fontSize="8" fontFamily="JetBrains Mono">
                    SNOTEL #540
                  </text>
                </g>

                {/* Dynamic scale bar */}
                <g transform="translate(20, 255)">
                  <line x1="0" y1="0" x2="50" y2="0" stroke="#dce2f7" strokeWidth="2" />
                  <line x1="0" y1="-3" x2="0" y2="3" stroke="#dce2f7" strokeWidth="1" />
                  <line x1="50" y1="-3" x2="50" y2="3" stroke="#dce2f7" strokeWidth="1" />
                  <text x="25" y="-5" fill="#88929b" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle">
                    5 km
                  </text>
                </g>

                {/* Compass Rose */}
                <g transform="translate(370, 30)">
                  <circle r="12" fill="#141b2b" stroke="#232a3a" strokeWidth="1" />
                  <path d="M 370 20 L 373 30 L 370 33 L 367 30 Z" fill="#ff4d4f" />
                  <text x="370" y="16" fill="#ffb4ab" fontSize="8" fontFamily="JetBrains Mono" textAnchor="middle" fontWeight="bold">
                    N
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* Section 2: Core Morphometric & Hydrological Parameters Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <span className="text-[10px] font-mono text-[#88929b] uppercase">Superficie (A)</span>
              <div className="text-lg font-bold font-mono text-[#dce2f7] mt-0.5">
                {CLEARWATER_BASIN.areaKm2} km²
              </div>
              <span className="text-[10px] text-[#4edea3] font-mono">Bassin versant HUC-8</span>
            </div>

            <div className="p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <span className="text-[10px] font-mono text-[#88929b] uppercase">Périmètre (P)</span>
              <div className="text-lg font-bold font-mono text-[#dce2f7] mt-0.5">
                {CLEARWATER_BASIN.perimeterKm} km
              </div>
              <span className="text-[10px] text-[#ffb95f] font-mono">Kc = {CLEARWATER_BASIN.graveliusKc} (Ovoïde)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <span className="text-[10px] font-mono text-[#88929b] uppercase">Altitude Médiane</span>
              <div className="text-lg font-bold font-mono text-[#dce2f7] mt-0.5">
                {CLEARWATER_BASIN.meanElevationM} m
              </div>
              <span className="text-[10px] text-[#89ceff] font-mono">ΔH = 2 166 m (Dénivelé)</span>
            </div>

            <div className="p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]">
              <span className="text-[10px] font-mono text-[#88929b] uppercase">Débit Q100 Estimé</span>
              <div className="text-lg font-bold font-mono text-[#dce2f7] mt-0.5">
                {CLEARWATER_BASIN.q100Discharge} m³/s
              </div>
              <span className="text-[10px] text-[#ffb4ab] font-mono">Pointe crue centennale</span>
            </div>
          </div>

          {/* Section 3: Land Cover & Runoff Statistics Table */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#88929b]">
              Bilan d'Occupation du Sol & Coefficients de Ruissellement (Méthode Rationnelle)
            </span>
            <div className="rounded-xl border border-[#232a3a] overflow-hidden">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#141b2b] text-[#88929b] text-[10px] uppercase border-b border-[#232a3a]">
                  <tr>
                    <th className="p-2.5">Classe CLC</th>
                    <th className="p-2.5">Surface (km²)</th>
                    <th className="p-2.5">Proportion (%)</th>
                    <th className="p-2.5">Coeff. Ruissellement (C)</th>
                    <th className="p-2.5">Contribution Q</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#232a3a] text-[#dce2f7] bg-[#191f2f]/60">
                  {CORINE_LAND_COVER.map((row) => (
                    <tr key={row.id}>
                      <td className="p-2.5 font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color }} />
                        <span>{row.name}</span>
                      </td>
                      <td className="p-2.5">{row.areaKm2}</td>
                      <td className="p-2.5 font-bold" style={{ color: row.color }}>
                        {row.percentage}%
                      </td>
                      <td className="p-2.5">{row.runoffCoefficient}</td>
                      <td className="p-2.5 text-[#88929b]">
                        {(row.areaKm2 * row.runoffCoefficient).toFixed(1)} km² eq
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Gauging Station Summary */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#88929b]">
              État des Stations Hydro-Météorologiques
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {GAUGING_STATIONS.map((st) => (
                <div key={st.id} className="p-3 rounded-xl bg-[#141b2b] border border-[#232a3a]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#dce2f7] truncate">{st.name}</span>
                    <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                  </div>
                  <div className="mt-2 text-xs font-mono text-[#bec8d2] flex flex-col gap-0.5">
                    <div>Débit : <b className="text-[#89ceff]">{st.discharge} m³/s</b></div>
                    <div>Cote : {st.gaugeHeight} m</div>
                    <div>Temp : {st.temperature} °C</div>
                    {st.swe && <div>Équiv. Eau Neige : {st.swe} mm</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document Certification Stamp & Signature */}
          <div className="border-t border-[#232a3a] pt-4 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#88929b] gap-2">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#4edea3]" />
              <span>Rapport validé conforme aux protocoles DQE / USGS 3DEP</span>
            </div>
            <button
              onClick={handleDownloadJson}
              className="text-[#0ea5e9] hover:underline flex items-center gap-1"
            >
              <span>Exporter toutes les données brutes (JSON)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
