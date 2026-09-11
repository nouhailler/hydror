import React from 'react';
import { Globe2, AreaChart, Trees, FileText } from 'lucide-react';
import { ScreenType } from '../types';

interface BottomNavProps {
  activeScreen: ScreenType;
  onSelectScreen: (screen: ScreenType) => void;
  unreadReportsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onSelectScreen,
  unreadReportsCount = 0,
}) => {
  const navItems: { id: ScreenType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'map',
      label: 'Carte & Analyse',
      icon: <Globe2 className="w-5 h-5" />,
    },
    {
      id: 'hypsometry',
      label: 'Hypsométrie',
      icon: <AreaChart className="w-5 h-5" />,
    },
    {
      id: 'landcover',
      label: 'Occupation Sol',
      icon: <Trees className="w-5 h-5" />,
    },
    {
      id: 'reports',
      label: 'Rapports PDF',
      icon: (
        <div className="relative">
          <FileText className="w-5 h-5" />
          {unreadReportsCount > 0 && (
            <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#0ea5e9] text-[9px] font-bold text-[#070e1d] flex items-center justify-center">
              {unreadReportsCount}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 w-full z-40 bg-[#070e1d]/92 backdrop-blur-xl border-t border-[#232a3a] shadow-[0_-4px_25px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => onSelectScreen(item.id)}
              className={`flex-1 flex flex-col items-center justify-center h-12 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-[#89ceff] bg-[#232a3a]/80 font-semibold shadow-sm'
                  : 'text-[#88929b] hover:text-[#dce2f7] hover:bg-[#141b2b]'
              }`}
            >
              <div className={`${isActive ? 'scale-110' : ''} transition-transform`}>
                {item.icon}
              </div>
              <span className="font-mono text-[10px] mt-1 tracking-tight truncate max-w-[80px]">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
