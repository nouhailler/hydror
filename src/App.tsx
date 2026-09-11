import React, { useState } from 'react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { MapCanvas } from './components/MapCanvas';
import { AnalysisDrawer } from './components/AnalysisDrawer';
import { HypsometryView } from './components/HypsometryView';
import { LandCoverView } from './components/LandCoverView';
import { ReportsLibraryView } from './components/ReportsLibraryView';
import { ReportModal } from './components/ReportModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { StationDetailModal } from './components/StationDetailModal';
import { FloodSimulationModal } from './components/FloodSimulationModal';
import { ReportConfig, ScreenType, StationData } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('map');
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReportViewerOpen, setIsReportViewerOpen] = useState(false);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [isFloodSimulationOpen, setIsFloodSimulationOpen] = useState(false);
  const [isFloodOverlayOnMap, setIsFloodOverlayOnMap] = useState(false);

  const [currentReportConfig, setCurrentReportConfig] = useState<ReportConfig>({
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

  const handleOpenReportModal = () => {
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
  };

  const handleGenerateReport = (config: ReportConfig) => {
    setCurrentReportConfig(config);
    setIsReportModalOpen(false);
    setIsReportViewerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0c1322] text-[#dce2f7] flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Application Header */}
      <Header
        onToggleLayers={() => setIsReportModalOpen(true)}
        activeLayersCount={isFloodOverlayOnMap ? 4 : 3}
      />

      {/* Main Content Body */}
      <main className="flex-1 flex flex-col pt-[88px] relative">
        {activeScreen === 'map' && (
          <div className="flex flex-col w-full">
            {/* Interactive Vector Geospatial Map */}
            <MapCanvas
              onOpenReportModal={handleOpenReportModal}
              onSelectStation={(st) => setSelectedStation(st)}
              onToggleFloodSimulation={() => setIsFloodSimulationOpen(true)}
              isFloodSimulationActive={isFloodOverlayOnMap}
            />

            {/* Collapsible Hydrological Analysis Sidebar & Drawer */}
            <AnalysisDrawer
              onOpenReportModal={handleOpenReportModal}
              onOpenFloodSimulation={() => setIsFloodSimulationOpen(true)}
              onSelectStation={(st) => setSelectedStation(st)}
              onNavigateToHypsometry={() => setActiveScreen('hypsometry')}
              onNavigateToLandCover={() => setActiveScreen('landcover')}
            />
          </div>
        )}

        {activeScreen === 'hypsometry' && <HypsometryView />}

        {activeScreen === 'landcover' && <LandCoverView />}

        {activeScreen === 'reports' && (
          <ReportsLibraryView
            onOpenReportModal={handleOpenReportModal}
            onPreviewReport={() => setIsReportViewerOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Navigation Dock */}
      <BottomNav
        activeScreen={activeScreen}
        onSelectScreen={(screen) => setActiveScreen(screen)}
        unreadReportsCount={1}
      />

      {/* Report Generator Modal (Matches user screenshot) */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onGenerateReport={handleGenerateReport}
      />

      {/* Full Generated Report Viewer Modal (A4 Printable & Dynamic Link Export) */}
      <ReportViewerModal
        isOpen={isReportViewerOpen}
        onClose={() => setIsReportViewerOpen(false)}
        config={currentReportConfig}
      />

      {/* Gauging Station Telemetry Inspector */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      {/* 100-Year Flood Hydrodynamic Simulation Modal */}
      <FloodSimulationModal
        isOpen={isFloodSimulationOpen}
        onClose={() => setIsFloodSimulationOpen(false)}
        onApplyToMap={() => setIsFloodOverlayOnMap(!isFloodOverlayOnMap)}
        isMapOverlayActive={isFloodOverlayOnMap}
      />
    </div>
  );
}
