import React from 'react';
import { Language, UserProfile, UserRole } from '../types';
import { translations } from '../locales/translations';
import { isFirebaseConfigured } from '../services/firebaseConfig';
import { Database, ShieldCheck, UserCheck, Settings } from 'lucide-react';

interface DemoModeBannerProps {
  language: Language;
  currentUser: UserProfile | null;
  onSwitchRole: (role: UserRole) => void;
  onOpenFirebaseModal: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  language,
  currentUser,
  onSwitchRole,
  onOpenFirebaseModal,
}) => {
  const t = translations[language];

  return (
    <aside aria-label="Environment and preview bar" className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Storage Mode Indicator */}
        <div className="flex items-center gap-2">
          <Database className={`w-3.5 h-3.5 ${isFirebaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`} />
          <span className="font-medium">
            {isFirebaseConfigured ? (
              <span className="text-emerald-400">Firebase Live Connected</span>
            ) : (
              <span className="text-amber-300">
                {language === 'kn' ? 'ಡೆಮೊ ಮೋಡ್ (ಸ್ಥಳೀಯ ಡೇಟಾ ಸಕ್ರಿಯ)' : 'Demo Mode (Local Persistent Store)'}
              </span>
            )}
          </span>
          <span className="hidden sm:inline text-stone-500">·</span>
          <span className="hidden md:inline text-stone-400">
            {language === 'kn'
              ? 'ಮಧ್ಯವರ್ತಿ ರಹಿತ ರೈತ ನೇರ ಮಾರಾಟ ವೇದಿಕೆ'
              : 'Direct farm-to-buyer agricultural marketplace'}
          </span>
        </div>

        {/* Right: Quick Role Switcher for instant evaluator testing & Firebase Config trigger */}
        <div className="flex items-center gap-2">
          <span className="hidden lg:inline text-stone-400">
            {language === 'kn' ? 'ಪರೀಕ್ಷಾರ್ಥ ಬದಲಾವಣೆ:' : 'Quick Role:'}
          </span>
          <div className="inline-flex rounded-md bg-stone-800 p-0.5 border border-stone-700">
            <button
              onClick={() => onSwitchRole('farmer')}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'farmer'
                  ? 'bg-emerald-700 text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {language === 'kn' ? 'ರೈತ (Farmer)' : 'Farmer'}
            </button>
            <button
              onClick={() => onSwitchRole('buyer')}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'buyer'
                  ? 'bg-emerald-700 text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {language === 'kn' ? 'ಖರೀದಿದಾರ (Buyer)' : 'Buyer'}
            </button>
            <button
              onClick={() => onSwitchRole('admin')}
              className={`px-2.5 py-1 text-xs rounded transition-colors whitespace-nowrap ${
                currentUser?.role === 'admin'
                  ? 'bg-emerald-700 text-white font-medium shadow-xs'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              {language === 'kn' ? 'ಆಡಳಿತ (Admin)' : 'Admin'}
            </button>
          </div>

          <button
            onClick={onOpenFirebaseModal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors whitespace-nowrap"
            title="Configure or view Firebase status"
          >
            <Settings className="w-3 h-3 text-stone-400" />
            <span>{t.firebaseSetup}</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
