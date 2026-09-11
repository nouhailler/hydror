import React from 'react';
import { X, Activity, Droplets, Thermometer, Waves, Snowflake, CheckCircle2 } from 'lucide-react';
import { StationData } from '../types';

interface StationDetailModalProps {
  station: StationData | null;
  onClose: () => void;
}

export const StationDetailModal: React.FC<StationDetailModalProps> = ({ station, onClose }) => {
  if (!station) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070e1d]/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#141b2b] border border-[#232a3a] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#232a3a] pb-3">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse"></span>
              <h3 className="text-sm font-bold text-[#dce2f7] truncate">{station.name}</h3>
            </div>
            <span className="font-mono text-[11px] text-[#0ea5e9] mt-0.5">
              ID : {station.id} • Télémétrie en continu
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#232a3a] text-[#bec8d2] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <div className="flex items-center justify-between text-xs text-[#88929b] font-mono">
              <span>Débit Instantané</span>
              <Droplets className="w-3.5 h-3.5 text-[#0ea5e9]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#dce2f7] mt-1">
              {station.discharge} <span className="text-xs text-[#bec8d2]">m³/s</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <div className="flex items-center justify-between text-xs text-[#88929b] font-mono">
              <span>Hauteur d'Eau</span>
              <Waves className="w-3.5 h-3.5 text-[#89ceff]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#dce2f7] mt-1">
              {station.gaugeHeight} <span className="text-xs text-[#bec8d2]">m</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <div className="flex items-center justify-between text-xs text-[#88929b] font-mono">
              <span>Vitesse Moyenne</span>
              <Activity className="w-3.5 h-3.5 text-[#4edea3]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#dce2f7] mt-1">
              {station.velocity} <span className="text-xs text-[#bec8d2]">m/s</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <div className="flex items-center justify-between text-xs text-[#88929b] font-mono">
              <span>Température</span>
              <Thermometer className="w-3.5 h-3.5 text-[#ffb95f]" />
            </div>
            <div className="text-lg font-bold font-mono text-[#dce2f7] mt-1">
              {station.temperature} <span className="text-xs text-[#bec8d2]">°C</span>
            </div>
          </div>
        </div>

        {/* 12h Hydrograph Sparkline */}
        <div className="flex flex-col gap-1.5 p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#bec8d2] font-semibold">Hydrogramme sur 12 heures</span>
            <span className="text-[#4edea3] text-[10px]">Stabilité Normale</span>
          </div>

          <div className="h-14 w-full flex items-end gap-1 pt-2">
            {station.recentTrend.map((val, idx) => {
              const maxVal = Math.max(...station.recentTrend);
              const minVal = Math.min(...station.recentTrend);
              const heightPercent = Math.max(
                20,
                Math.round(((val - minVal + 2) / (maxVal - minVal + 4)) * 100)
              );
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                  <div
                    className="w-full bg-[#0ea5e9]/70 group-hover:bg-[#0ea5e9] rounded-t-sm transition-all"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <div className="absolute -top-7 hidden group-hover:block bg-[#070e1d] text-[#89ceff] font-mono text-[9px] px-1 py-0.5 rounded border border-[#232a3a] whitespace-nowrap z-20">
                    {val} m³/s
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-[#88929b] pt-1 border-t border-[#232a3a]">
            <span>-12h</span>
            <span>-6h</span>
            <span>Temps réel</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-[#2e3545] hover:bg-[#323949] text-[#dce2f7] font-mono text-xs font-semibold transition-colors text-center"
        >
          Fermer l'inspecteur
        </button>
      </div>
    </div>
  );
};
