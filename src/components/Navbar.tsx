import React from 'react';
import { Language, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { Sprout, Globe, User, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  activeTab: 'market' | 'mandi' | 'map' | 'dashboard' | 'admin';
  setActiveTab: (tab: 'market' | 'mandi' | 'map' | 'dashboard' | 'admin') => void;
  currentUser: UserProfile | null;
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element + agricultural leaf emblem) */}
        <button
          onClick={() => setActiveTab('market')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-emerald-700"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <span className="text-lg font-bold tracking-tight text-stone-900">
            {language === 'kn' ? 'ರೈತ ನೇರ ಮಾರುಕಟ್ಟೆ' : 'Farmer Direct Market'}
          </span>
        </button>

        {/* Zone 2: 4-5 Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('market')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'market'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            {t.navMarketplace}
          </button>
          <button
            onClick={() => setActiveTab('mandi')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'mandi'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            {t.navMandiPrices}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
              activeTab === 'map'
                ? 'border-emerald-700 text-emerald-800 font-semibold'
                : 'border-transparent hover:text-stone-900 hover:border-stone-300'
            }`}
          >
            {t.navFarmMap}
          </button>
          {currentUser && (
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
                activeTab === 'dashboard'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {t.navDashboard}
            </button>
          )}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`whitespace-nowrap shrink-0 pb-1 border-b-2 transition-colors ${
                activeTab === 'admin'
                  ? 'border-emerald-700 text-emerald-800 font-semibold'
                  : 'border-transparent hover:text-stone-900 hover:border-stone-300'
              }`}
            >
              {t.navAdmin}
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action Area (Language switcher & User Session) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-stone-300 hover:border-stone-400 bg-stone-50 hover:bg-stone-100 text-xs font-semibold text-stone-800 transition-colors whitespace-nowrap shrink-0"
            title="Switch Language / ಭಾಷೆ ಬದಲಾಯಿಸಿ"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t.switchLanguage}</span>
          </button>

          {/* User Profile or Login CTA */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 transition-colors text-xs font-medium whitespace-nowrap"
              >
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
                  {currentUser.name.charAt(0)}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate">
                  {currentUser.name.split(' ')[0]}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold capitalize">
                  ({currentUser.role === 'farmer' ? (language === 'kn' ? 'ರೈತ' : 'Farmer') : currentUser.role === 'buyer' ? (language === 'kn' ? 'ಖರೀದಿದಾರ' : 'Buyer') : 'Admin'})
                </span>
              </button>

              <button
                onClick={onLogout}
                className="p-1.5 text-stone-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title={t.logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-800 rounded-lg hover:bg-emerald-900 transition-colors whitespace-nowrap shrink-0 shadow-xs"
            >
              {t.login} / {t.register}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
