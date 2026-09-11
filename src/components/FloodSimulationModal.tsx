import React, { useState } from 'react';
import { X, Waves, AlertTriangle, Play, Pause, RotateCcw, ShieldAlert, Droplets } from 'lucide-react';
import { CLEARWATER_BASIN } from '../data/basinData';

interface FloodSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyToMap: () => void;
  isMapOverlayActive: boolean;
}

export const FloodSimulationModal: React.FC<FloodSimulationModalProps> = ({
  isOpen,
  onClose,
  onApplyToMap,
  isMapOverlayActive,
}) => {
  const [hour, setHour] = useState(12); // peak at hour 12
  const [isPlaying, setIsPlaying] = useState(false);

  if (!isOpen) return null;

  // Gaussian hydrograph curve calculation centered around hour 12
  const peakDischarge = CLEARWATER_BASIN.q100Discharge; // 540 m3/s
  const baseDischarge = CLEARWATER_BASIN.q90Discharge; // 42.8 m3/s
  const sigma = 3.5;
  const currentDischarge = Math.round(
    baseDischarge +
      (peakDischarge - baseDischarge) * Math.exp(-Math.pow(hour - 12, 2) / (2 * Math.pow(sigma, 2)))
  );

  const waterLevelRise = Number(
    (0.2 + 4.2 * Math.exp(-Math.pow(hour - 12, 2) / (2 * Math.pow(sigma, 2)))).toFixed(2)
  );

  const inundatedAreaKm2 = Number(
    (5 + 79.5 * Math.exp(-Math.pow(hour - 12, 2) / (2 * Math.pow(sigma, 2)))).toFixed(1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#070e1d]/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#141b2b] border border-[#232a3a] rounded-2xl shadow-2xl p-5 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#232a3a] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#ff4d4f]/20 text-[#ff4d4f] flex items-center justify-center shrink-0">
              <Waves className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-sm font-bold text-[#dce2f7]">
                Simulation Dynamique de Crue Centennale (Q100)
              </h3>
              <span className="font-mono text-[10px] text-[#ffb4ab]">
                Modèle d'inondation hydrodynamique 2D D8 • Bassin #402
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#232a3a] text-[#bec8d2] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Time Step Slider */}
        <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#191f2f] border border-[#232a3a]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#dce2f7]">
              Chronologie de l'Événement Pluvieux
            </span>
            <span className="font-mono text-xs font-bold text-[#0ea5e9]">
              t = +{hour}h00 {hour === 12 && '(Pic de Crue)'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={24}
            step={1}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            className="w-full h-2 bg-[#232a3a] rounded-lg appearance-none cursor-pointer accent-[#ff4d4f]"
          />

          <div className="flex items-center justify-between text-[10px] font-mono text-[#88929b]">
            <span>t=0h (Pluie décennale)</span>
            <span className="text-[#ff4d4f] font-bold">t=12h (Pic hydrographique)</span>
            <span>t=24h (Décrue)</span>
          </div>
        </div>

        {/* Simulated Metric Readouts */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Débit Simulé</span>
            <div className="text-base font-bold font-mono text-[#ff4d4f] mt-0.5">
              {currentDischarge} <span className="text-[10px] font-normal">m³/s</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Élévation Cote</span>
            <div className="text-base font-bold font-mono text-[#ffb95f] mt-0.5">
              +{waterLevelRise} <span className="text-[10px] font-normal">m</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#191f2f] border border-[#232a3a]">
            <span className="text-[10px] font-mono text-[#88929b] uppercase">Zone Inondée</span>
            <div className="text-base font-bold font-mono text-[#0ea5e9] mt-0.5">
              {inundatedAreaKm2} <span className="text-[10px] font-normal">km²</span>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner */}
        <div className="p-3 rounded-xl bg-[#ff4d4f]/10 border border-[#ff4d4f]/30 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-[#ff4d4f] shrink-0 mt-0.5" />
          <div className="text-xs text-[#bec8d2] leading-relaxed">
            <b className="text-[#ffb4ab]">Vigilance Crues Importante :</b> 18 tronçons de voirie et 4 franchissements de ponts submergés entre les heures 10 et 14 dans la basse vallée.
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onApplyToMap();
              onClose();
            }}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#0ea5e9] hover:bg-[#38bdf8] text-[#070e1d] font-bold font-mono text-xs transition-all shadow-md text-center"
          >
            {isMapOverlayActive ? 'Désactiver le calque de crue' : 'Afficher l’emprise sur la carte'}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-[#2e3545] hover:bg-[#323949] text-[#dce2f7] font-mono text-xs font-semibold transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
