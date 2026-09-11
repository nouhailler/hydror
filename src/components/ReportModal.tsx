import React, { useState } from 'react';
import {
  FileText,
  X,
  Droplets,
  Mountain,
  Trees,
  Shield,
  AlertTriangle,
  Compass,
  CheckCircle2,
  Download,
  ListOrdered,
  Layers,
  Sparkles,
  Printer,
} from 'lucide-react';
import { ReportConfig } from '../types';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateReport: (config: ReportConfig) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  onGenerateReport,
}) => {
  const [config, setConfig] = useState<ReportConfig>({
    includeHydroStrahler: true,
    includeDemRelief: true,
    includeCorineLulc: true,
    includeEnvironmentalRamsar: false,
    includeFloodVulnerability: false,
    pageOrientation: 'portrait',
    resolutionDpi: 300,
    includeScaleRose: true,
    includeDynamicLegend: true,
    includeInventoryTables: true,
  });

  if (!isOpen) return null;

  const selectedLayersCount = [
    config.includeHydroStrahler,
    config.includeDemRelief,
    config.includeCorineLulc,
    config.includeEnvironmentalRamsar,
    config.includeFloodVulnerability,
  ].filter(Boolean).length;

  const estimatedFileSize = (
    2.1 +
    selectedLayersCount * 0.7 +
    (config.resolutionDpi === 300 ? 1.4 : 0.4)
  ).toFixed(1);

  const handleGenerate = () => {
    onGenerateReport(config);
  };

  return (
    <div
      id="report-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070e1d]/85 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-4 bg-[#141b2b]/95 border-b border-[#232a3a] flex items-start justify-between gap-3 shrink-0">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <FileText className="w-5 h-5 text-[#0ea5e9] shrink-0" />
              <h3 className="text-[17px] font-bold text-[#dce2f7] tracking-tight truncate">
                Générateur de Rapport Hydrologique
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#0ea5e9]/20 text-[#89ceff] font-mono text-[10px] font-semibold border border-[#0ea5e9]/30">
                PDF A4 Synthèse
              </span>
            </div>
            <p className="text-xs text-[#bec8d2] mt-1 truncate">
              Bassin versant #402 — Upper Clearwater (1 428.6 km²)
            </p>
          </div>

          <button
            id="close-report-modal-btn"
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-lg bg-[#232a3a] hover:bg-[#2e3545] text-[#bec8d2] hover:text-[#dce2f7] flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {/* Section 1: Cartes Thématiques & Calques */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#88929b]">
                1. Cartes Thématiques & Calques
              </span>
              <span className="font-mono text-[10px] text-[#4edea3] font-medium">
                {selectedLayersCount} sélectionnés
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Layer 1: Strahler */}
              <label
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.includeHydroStrahler
                    ? 'bg-[#191f2f] border-[#0ea5e9]/50'
                    : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center shrink-0">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#dce2f7] truncate">
                      Réseau hydrographique & Strahler
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b] truncate">
                      Ordres 1 à 5 • USGS & Linéaire hydrologique
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-[#0ea5e9]/10 text-[#89ceff] border border-[#0ea5e9]/30 font-mono text-[9px] font-bold">
                    Cyan
                  </span>
                  <input
                    type="checkbox"
                    checked={config.includeHydroStrahler}
                    onChange={(e) =>
                      setConfig({ ...config, includeHydroStrahler: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0ea5e9] cursor-pointer"
                  />
                </div>
              </label>

              {/* Layer 2: DEM Relief */}
              <label
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.includeDemRelief
                    ? 'bg-[#191f2f] border-[#89ceff]/50'
                    : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#2e3545] text-[#89ceff] flex items-center justify-center shrink-0">
                    <Mountain className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#dce2f7] truncate">
                      Hypsométrie & MNT Relief (DEM 10m)
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b] truncate">
                      Courbe intégrale • Pentes & Dénivelé
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-[#89ceff]/10 text-[#89ceff] border border-[#89ceff]/30 font-mono text-[9px] font-bold">
                    Indigo
                  </span>
                  <input
                    type="checkbox"
                    checked={config.includeDemRelief}
                    onChange={(e) =>
                      setConfig({ ...config, includeDemRelief: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0ea5e9] cursor-pointer"
                  />
                </div>
              </label>

              {/* Layer 3: Corine Land Cover */}
              <label
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.includeCorineLulc
                    ? 'bg-[#191f2f] border-[#10b981]/50'
                    : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center shrink-0">
                    <Trees className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-[#dce2f7] truncate">
                      Occupation du sol Corine Land Cover
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b] truncate">
                      Forêts, sols agricoles & imperméabilisation
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-1.5 py-0.5 rounded bg-[#4edea3]/10 text-[#4edea3] border border-[#4edea3]/30 font-mono text-[9px] font-bold">
                    Émeraude
                  </span>
                  <input
                    type="checkbox"
                    checked={config.includeCorineLulc}
                    onChange={(e) =>
                      setConfig({ ...config, includeCorineLulc: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#10b981] cursor-pointer"
                  />
                </div>
              </label>

              {/* Layer 4: Environmental Ramsar */}
              <label
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.includeEnvironmentalRamsar
                    ? 'bg-[#191f2f] border-[#ffb95f]/50'
                    : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#d88a00]/20 text-[#ffb95f] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#dce2f7] truncate">
                      Zonages environnementaux & RAMSAR
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b] truncate">
                      Natura 2000, ZNIEFF I/II, corridors écologiques
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] text-[#88929b]">Optionnel</span>
                  <input
                    type="checkbox"
                    checked={config.includeEnvironmentalRamsar}
                    onChange={(e) =>
                      setConfig({ ...config, includeEnvironmentalRamsar: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0ea5e9] cursor-pointer"
                  />
                </div>
              </label>

              {/* Layer 5: Flood Vulnerability */}
              <label
                className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                  config.includeFloodVulnerability
                    ? 'bg-[#191f2f] border-[#ff4d4f]/50'
                    : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-[#93000a]/20 text-[#ffb4ab] flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-medium text-[#dce2f7] truncate">
                      Vulnérabilité aux crues & submersion
                    </span>
                    <span className="font-mono text-[10px] text-[#88929b] truncate">
                      Zones d'expansion de crues centennales (Q100)
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[9px] text-[#88929b]">Optionnel</span>
                  <input
                    type="checkbox"
                    checked={config.includeFloodVulnerability}
                    onChange={(e) =>
                      setConfig({ ...config, includeFloodVulnerability: e.target.checked })
                    }
                    className="w-4 h-4 rounded accent-[#0ea5e9] cursor-pointer"
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Section 2: Configuration du Format & Rendu */}
          <div className="flex flex-col gap-3 pt-2 border-t border-[#232a3a]">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#88929b]">
              2. Configuration du Format & Rendu
            </span>

            {/* Orientation de page */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#bec8d2] font-medium">
                Orientation de page
              </span>
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#232a3a]/60 border border-[#232a3a]">
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, pageOrientation: 'portrait' })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all ${
                    config.pageOrientation === 'portrait'
                      ? 'bg-[#0ea5e9] text-[#070e1d] shadow-sm'
                      : 'text-[#bec8d2] hover:text-[#dce2f7]'
                  }`}
                >
                  <span className="text-[14px]">📄</span>
                  <span>A4 Portrait</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfig({ ...config, pageOrientation: 'landscape' })}
                  className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg font-mono text-xs font-bold transition-all ${
                    config.pageOrientation === 'landscape'
                      ? 'bg-[#0ea5e9] text-[#070e1d] shadow-sm'
                      : 'text-[#bec8d2] hover:text-[#dce2f7]'
                  }`}
                >
                  <span className="text-[14px]">📑</span>
                  <span>A4 Paysage</span>
                </button>
              </div>
            </div>

            {/* Résolution Cartographique */}
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] text-[#bec8d2] font-medium">
                Résolution cartographique
              </span>
              <div className="grid grid-cols-2 gap-2">
                <label
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                    config.resolutionDpi === 150
                      ? 'bg-[#191f2f] border-[#0ea5e9]/50'
                      : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                  }`}
                >
                  <input
                    type="radio"
                    name="dpi-export-opt"
                    checked={config.resolutionDpi === 150}
                    onChange={() => setConfig({ ...config, resolutionDpi: 150 })}
                    className="accent-[#0ea5e9]"
                  />
                  <div className="flex flex-col">
                    <span className="font-mono text-xs font-medium text-[#dce2f7]">
                      150 DPI
                    </span>
                    <span className="font-mono text-[9px] text-[#88929b]">
                      Standard Web (~2.5 Mo)
                    </span>
                  </div>
                </label>

                <label
                  className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-colors ${
                    config.resolutionDpi === 300
                      ? 'bg-[#00a572]/15 border-[#4edea3]/50'
                      : 'bg-[#191f2f]/60 border-[#232a3a] hover:bg-[#191f2f]'
                  }`}
                >
                  <input
                    type="radio"
                    name="dpi-export-opt"
                    checked={config.resolutionDpi === 300}
                    onChange={() => setConfig({ ...config, resolutionDpi: 300 })}
                    className="accent-[#10b981]"
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-mono text-xs font-bold text-[#4edea3]">
                        300 DPI
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
                    </div>
                    <span className="font-mono text-[9px] text-[#88929b]">
                      Haute Définition (~{estimatedFileSize} Mo)
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Éléments cartographiques inclus */}
            <div className="flex flex-col gap-1.5 pt-1">
              <span className="font-mono text-[10px] text-[#bec8d2] font-medium">
                Éléments cartographiques inclus
              </span>
              <div className="grid grid-cols-1 gap-1">
                <div className="flex items-center justify-between py-1 px-1.5 text-xs text-[#dce2f7]">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#0ea5e9]" />
                    <span>Échelle métrique & Rose des vents</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                </div>
                <div className="flex items-center justify-between py-1 px-1.5 text-xs text-[#dce2f7]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#4edea3]" />
                    <span>Légende thématique dynamique</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                </div>
                <div className="flex items-center justify-between py-1 px-1.5 text-xs text-[#dce2f7]">
                  <div className="flex items-center gap-2">
                    <ListOrdered className="w-4 h-4 text-[#ffb95f]" />
                    <span>Tableaux d'inventaires & statistiques LULC</span>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-[#4edea3]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 bg-[#141b2b]/95 border-t border-[#232a3a] flex flex-col sm:flex-row items-center justify-between gap-2.5 shrink-0">
          <button
            id="cancel-report-btn"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#2e3545] hover:bg-[#323949] text-[#dce2f7] hover:text-[#89ceff] font-mono text-xs font-semibold transition-colors text-center"
          >
            Annuler
          </button>

          <button
            id="generate-pdf-btn"
            onClick={handleGenerate}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#00a572] text-[#070e1d] font-bold text-sm shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all hover:brightness-110"
          >
            <Download className="w-4 h-4" />
            <span>Générer le rapport PDF (A4 - ~{estimatedFileSize} Mo)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
