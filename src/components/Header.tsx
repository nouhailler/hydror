import React, { useState } from 'react';
import { Layers, User, Compass, ChevronDown, Check, Activity } from 'lucide-react';
import { CLEARWATER_BASIN } from '../data/basinData';

interface HeaderProps {
  onToggleLayers: () => void;
  activeLayersCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onToggleLayers, activeLayersCount }) => {
  const [showBasinMenu, setShowBasinMenu] = useState(false);
  const [selectedBasin, setSelectedBasin] = useState(CLEARWATER_BASIN.name);

  const basins = [
    { name: 'Upper Clearwater Basin', id: '#402', area: '1,428.6 km²' },
    { name: 'Middle Fork Clearwater', id: '#405', area: '982.4 km²' },
    { name: 'Lochsa River Catchment', id: '#408', area: '1,120.0 km²' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#070e1d]/85 backdrop-blur-xl border-b border-[#232a3a] shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 flex flex-col gap-1.5">
        {/* Top Row: App Title & User Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Hydro GIS Logo Icon */}
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0ea5e9] to-[#00a572] flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                <path d="M12 12a3 3 0 0 1 3 3" />
              </svg>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[17px] font-bold text-[#dce2f7] tracking-tight truncate leading-tight">
                HydroSphere GIS
              </span>
              <span className="text-[11px] text-[#0ea5e9] font-medium tracking-wide flex items-center gap-1 truncate">
                <span>Modélisation Hydrologique & SIG</span>
                <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                <span className="text-[#88929b] font-mono text-[10px]">v2.4.0</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Layers Quick Toggle */}
            <button
              id="header-toggle-layers-btn"
              onClick={onToggleLayers}
              aria-label="Calques cartographiques"
              className="relative h-9 px-2.5 sm:px-3 flex items-center gap-1.5 rounded-xl bg-[#232a3a]/90 text-[#89ceff] hover:text-[#dce2f7] hover:bg-[#2e3545] transition-all border border-[#3e4850]/40 text-xs font-mono"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Calques</span>
              <span className="w-4 h-4 rounded-full bg-[#0ea5e9] text-[#070e1d] font-bold text-[10px] flex items-center justify-center">
                {activeLayersCount}
              </span>
            </button>

            {/* Profile Avatar */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0ea5e9] to-[#89ceff] flex items-center justify-center text-[#070e1d] font-semibold text-xs shadow-inner cursor-pointer hover:ring-2 hover:ring-cyan-400 transition-all">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Bottom Sub-Row: Basin Metadata and Coordinate Tags */}
        <div className="flex items-center justify-between gap-2 pt-0.5 text-xs">
          {/* Basin Selector Button */}
          <div className="relative">
            <button
              id="basin-selector-toggle"
              onClick={() => setShowBasinMenu(!showBasinMenu)}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-[#00a572]/20 text-[#4edea3] hover:bg-[#00a572]/30 border border-[#00a572]/30 font-mono text-[11px] transition-colors truncate"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] shrink-0 animate-pulse"></span>
              <span className="truncate font-semibold">Bassin {selectedBasin}</span>
              <ChevronDown className="w-3 h-3 text-[#4edea3] opacity-75 shrink-0" />
            </button>

            {/* Basin selection popover */}
            {showBasinMenu && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#141b2b] border border-[#232a3a] rounded-xl shadow-2xl p-1 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1 text-[10px] uppercase font-mono text-[#88929b] tracking-wider border-b border-[#232a3a]">
                  Sélection du bassin versant
                </div>
                {basins.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setSelectedBasin(`${b.id}: ${b.name}`);
                      setShowBasinMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#191f2f] flex items-center justify-between transition-colors text-xs"
                  >
                    <div>
                      <div className="font-medium text-[#dce2f7]">{b.name}</div>
                      <div className="text-[10px] text-[#88929b] font-mono">{b.id} • {b.area}</div>
                    </div>
                    {selectedBasin.includes(b.id) && <Check className="w-3.5 h-3.5 text-[#4edea3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Coordinate & Hydro Status Pill */}
          <div className="inline-flex items-center gap-2">
            <div className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#141b2b] text-[#88929b] border border-[#232a3a] font-mono text-[10px]">
              <Activity className="w-3 h-3 text-[#4edea3]" />
              <span>3 balises actives</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#232a3a] text-[#bec8d2] font-mono text-[10px] shrink-0 border border-[#3e4850]/40">
              <Compass className="w-3 h-3 text-[#89ceff]" />
              <span>{CLEARWATER_BASIN.coordinates}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
