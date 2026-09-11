import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Printer,
  Download,
  Share2,
  Calendar,
  CheckCircle,
  Eye,
  Camera,
  Layers,
  Search,
} from 'lucide-react';
import { CLEARWATER_BASIN } from '../data/basinData';

interface ReportsLibraryViewProps {
  onOpenReportModal: () => void;
  onPreviewReport: () => void;
}

export const ReportsLibraryView: React.FC<ReportsLibraryViewProps> = ({
  onOpenReportModal,
  onPreviewReport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const reports = [
    {
      id: 'rep-01',
      title: 'Rapport Hydrologique & Synthèse A4',
      basin: 'Upper Clearwater (#402)',
      format: 'PDF A4 Portrait',
      dpi: '300 DPI',
      size: '4.2 Mo',
      date: '11 Septembre 2026',
      status: 'Prêt',
      layersCount: 3,
    },
    {
      id: 'rep-02',
      title: 'Audit Morphométrique & Hypsométrie Détaillée',
      basin: 'Upper Clearwater (#402)',
      format: 'PDF A4 Paysage',
      dpi: '300 DPI',
      size: '3.8 Mo',
      date: '08 Septembre 2026',
      status: 'Archivé',
      layersCount: 4,
    },
    {
      id: 'rep-03',
      title: 'Simulation de Crue Centennale Q100 & Zonage Submersion',
      basin: 'Upper Clearwater (#402)',
      format: 'PDF A4 Portrait',
      dpi: '150 DPI',
      size: '2.9 Mo',
      date: '01 Septembre 2026',
      status: 'Archivé',
      layersCount: 5,
    },
  ];

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.basin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 pb-24 gap-4 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0ea5e9]/20 text-[#0ea5e9] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold text-[#dce2f7] tracking-tight">
              Bibliothèque de Rapports Hydrologiques
            </h2>
            <p className="text-xs text-[#bec8d2] font-mono">
              Génération vectorielle haute résolution & export d'images dynamiques depuis HTML
            </p>
          </div>
        </div>

        <button
          id="new-report-library-btn"
          onClick={onOpenReportModal}
          className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-gradient-to-r from-[#0ea5e9] to-[#00a572] text-[#070e1d] font-bold text-xs shadow-lg shadow-cyan-500/20 active:scale-95 transition-all hover:brightness-110"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Rapport A4</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#141b2b] border border-[#232a3a]">
        <Search className="w-4 h-4 text-[#88929b] ml-1" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher un rapport par titre, bassin ou date..."
          className="bg-transparent border-none outline-none text-xs text-[#dce2f7] placeholder-[#88929b] w-full font-mono"
        />
      </div>

      {/* Reports List */}
      <div className="flex flex-col gap-3">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="p-4 rounded-2xl bg-[#141b2b] border border-[#232a3a] hover:border-[#0ea5e9]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#191f2f] text-[#89ceff] flex items-center justify-center shrink-0 mt-0.5 border border-[#232a3a]">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#dce2f7] truncate">{report.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#0ea5e9]/20 text-[#89ceff] font-mono text-[10px] font-semibold border border-[#0ea5e9]/30">
                    {report.format}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono text-[#bec8d2] mt-1">
                  <span>{report.basin}</span>
                  <span className="text-[#3e4850]">•</span>
                  <span className="text-[#4edea3]">{report.dpi}</span>
                  <span className="text-[#3e4850]">•</span>
                  <span className="text-[#88929b]">{report.size}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={onPreviewReport}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#232a3a] hover:bg-[#2e3545] text-[#89ceff] font-mono text-xs transition-colors"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu PDF</span>
              </button>

              <button
                onClick={() => {
                  onPreviewReport();
                  setTimeout(() => window.print(), 300);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#070e1d] font-bold font-mono text-xs transition-colors shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
