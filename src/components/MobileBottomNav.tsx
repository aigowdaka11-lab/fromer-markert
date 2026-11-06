import React from 'react';
import { Language, UserProfile } from '../types';
import { Store, TrendingUp, MapPin, LayoutDashboard, PlusCircle, ShieldCheck } from 'lucide-react';

interface MobileBottomNavProps {
  language: Language;
  activeTab: 'market' | 'mandi' | 'map' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'market' | 'mandi' | 'map' | 'dashboard' | 'admin') => void;
  currentUser: UserProfile | null;
  onOpenAddCrop: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  language,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAddCrop,
}) => {
  const isFarmer = currentUser?.role === 'farmer';
  const isAdmin = currentUser?.role === 'admin';

  return (
    <nav aria-label="Mobile navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 pb-safe">
      <div className="grid grid-cols-5 items-center h-16 px-1">
        {/* Tab 1: Marketplace */}
        <button
          onClick={() => setActiveTab('market')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'market' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Store className={`w-5 h-5 ${activeTab === 'market' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
            {language === 'kn' ? 'ಬೆಳೆಗಳು' : 'Market'}
          </span>
        </button>

        {/* Tab 2: Mandi Prices */}
        <button
          onClick={() => setActiveTab('mandi')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'mandi' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <TrendingUp className={`w-5 h-5 ${activeTab === 'mandi' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
            {language === 'kn' ? 'ಮಂಡಿ ಬೆಲೆ' : 'Mandi'}
          </span>
        </button>

        {/* Tab 3: Center Primary Action (Add Crop for Farmer, or Map) */}
        {isFarmer ? (
          <button
            onClick={onOpenAddCrop}
            className="flex flex-col items-center justify-center min-h-[44px] min-w-[44px] text-emerald-800 group"
          >
            <div className="w-10 h-10 -mt-4 rounded-full bg-emerald-800 text-white flex items-center justify-center shadow-md group-active:scale-95 transition-transform">
              <PlusCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <span className="text-[10px] font-bold text-emerald-900 tracking-tight mt-0.5 truncate max-w-[64px]">
              {language === 'kn' ? '+ ಬೆಳೆ ಸೇರಿಸಿ' : '+ Sell'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'map' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
              {language === 'kn' ? 'ನಕ್ಷೆ' : 'Map'}
            </span>
          </button>
        )}

        {/* Tab 4: Dashboard */}
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
            activeTab === 'dashboard' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <LayoutDashboard className={`w-5 h-5 ${activeTab === 'dashboard' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
            {language === 'kn' ? 'ನನ್ನ ಖಾತೆ' : 'Dashboard'}
          </span>
        </button>

        {/* Tab 5: Map or Admin */}
        {isAdmin ? (
          <button
            onClick={() => setActiveTab('admin')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'admin' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
              {language === 'kn' ? 'ಆಡಳಿತ' : 'Admin'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('map')}
            className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-colors ${
              activeTab === 'map' ? 'text-emerald-800' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <MapPin className={`w-5 h-5 ${activeTab === 'map' ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1 truncate max-w-[64px]">
              {language === 'kn' ? 'ನಕ್ಷೆ' : 'Map'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
};
