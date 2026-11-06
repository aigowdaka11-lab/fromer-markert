import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../locales/translations';
import { isFirebaseConfigured, firebaseConfig } from '../services/firebaseConfig';
import {
  X,
  Database,
  CheckCircle2,
  Copy,
  Check,
  Shield,
  Smartphone,
  Cloud,
  FileCode,
  Terminal,
} from 'lucide-react';

interface FirebaseSetupModalProps {
  language: Language;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({
  language,
  onClose,
}) => {
  const t = translations[language];
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const envSnippet = `# Firebase Web App Configuration
VITE_FIREBASE_API_KEY="${firebaseConfig.apiKey || 'AIzaSyYourApiKeyHere'}"
VITE_FIREBASE_AUTH_DOMAIN="${firebaseConfig.authDomain || 'farmer-direct-market.firebaseapp.com'}"
VITE_FIREBASE_PROJECT_ID="${firebaseConfig.projectId || 'farmer-direct-market-app'}"
VITE_FIREBASE_STORAGE_BUCKET="${firebaseConfig.storageBucket || 'farmer-direct-market.appspot.com'}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${firebaseConfig.messagingSenderId || '123456789012'}"
VITE_FIREBASE_APP_ID="${firebaseConfig.appId || '1:123456789012:web:abcdef123456'}"

# Optional Google Maps API Key
VITE_GOOGLE_MAPS_API_KEY=""`;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              {language === 'kn'
                ? 'Firebase ಡೇಟಾಬೇಸ್ & ನಿಯೋಜನೆ ಮಾಹಿತಿ'
                : 'Firebase & Deployment Architecture'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-6 text-xs text-stone-700">
          {/* Status Banner */}
          <div
            className={`p-4 rounded-2xl border flex items-start gap-3 ${
              isFirebaseConfigured
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            {isFirebaseConfigured ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            ) : (
              <Database className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            )}
            <div>
              <span className="font-bold block text-sm">
                {isFirebaseConfigured
                  ? (language === 'kn' ? 'ಲೈವ್ Firebase ಪ್ರಾಜೆಕ್ಟ್ ಸಂಪರ್ಕಗೊಂಡಿದೆ!' : 'Live Firebase Connected!')
                  : (language === 'kn' ? 'ಸ್ಥಳೀಯ ಡೆಮೊ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ (Local Persistence)' : 'Local Demo Mode Active (Offline / Fallback)')}
              </span>
              <p className="mt-1 leading-relaxed">
                {isFirebaseConfigured
                  ? `Connected to Firestore & Auth project: ${firebaseConfig.projectId}. Realtime synchronization is live.`
                  : language === 'kn'
                  ? 'ಯಾವುದೇ ನೈಜ Firebase ಕೀ ಇಲ್ಲದೆಯೂ ಈ ಅಪ್ಲಿಕೇಶನ್ ಸಂಪೂರ್ಣವಾಗಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ. ನೀವು ನಿಮ್ಮದೇ Firebase ಪ್ರಾಜೆಕ್ಟ್ ಸಂಪರ್ಕಿಸಲು ಕೆಳಗಿನ .env ಕೀಗಳನ್ನು ಸೇರಿಸಬಹುದು.'
                  : 'The app is fully functional with persistent localStorage. When you are ready to connect a live Firebase project, set the environment variables below.'}
              </p>
            </div>
          </div>

          {/* Section 1: Required .env configuration */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <FileCode className="w-4 h-4 text-emerald-800" />
                <span>1. Environment Variables (.env / Vercel)</span>
              </span>
              <button
                onClick={() => handleCopy(envSnippet, 'env')}
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold"
              >
                {copiedKey === 'env' ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'env' ? 'Copied' : 'Copy .env'}</span>
              </button>
            </div>
            <pre className="p-4 bg-stone-900 text-emerald-400 rounded-xl overflow-x-auto font-mono text-[11px] leading-relaxed">
              {envSnippet}
            </pre>
          </div>

          {/* Section 2: Firestore Collections & Security Rules */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
            <span className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-emerald-800" />
              <span>2. Firestore Collections & RBAC Security Rules</span>
            </span>
            <p className="text-stone-600 leading-relaxed">
              Included in the project root as <code className="bg-stone-200 px-1 py-0.5 rounded font-mono">/firestore.rules</code>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-600 pl-2">
              <li><strong>users/&#123;uid&#125;:</strong> Farmers, buyers, and administrators. Users can edit only their own profile.</li>
              <li><strong>crops/&#123;cropId&#125;:</strong> Publicly readable by all buyers. Only the owning farmer or admin can update/delete.</li>
              <li><strong>orders/&#123;orderId&#125;:</strong> Read/write restricted exclusively to the buyer who initiated and the receiving farmer.</li>
              <li><strong>mandiPrices/&#123;id&#125;:</strong> Publicly readable market prices. Modifiable only by admin.</li>
            </ul>
          </div>

          {/* Section 3: Android Capacitor & Vercel Packaging */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-emerald-800" />
                <span>Capacitor Android Packaging</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                Run:
                <code className="block bg-stone-900 text-stone-100 p-2 rounded-lg font-mono text-[10px] mt-1">
                  npm install @capacitor/core @capacitor/cli @capacitor/android<br />
                  npx cap init "Farmer Direct Market" "com.farmerdirectmarket.app"<br />
                  npm run build<br />
                  npx cap add android<br />
                  npx cap open android
                </code>
              </p>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1.5">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <Cloud className="w-4 h-4 text-emerald-800" />
                <span>Vercel / GitHub Deployment</span>
              </span>
              <p className="text-stone-600 leading-relaxed">
                Connect your GitHub repository to Vercel. Framework preset will automatically detect <strong>Vite</strong>. Add the environment variables from step 1 in the Vercel project settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
