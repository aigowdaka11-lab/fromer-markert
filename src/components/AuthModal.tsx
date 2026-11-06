import React, { useState } from 'react';
import { BuyerType, Language, UserProfile, UserRole } from '../types';
import { translations } from '../locales/translations';
import { authService } from '../services/authService';
import { X, Sprout, ShoppingBag, ShieldCheck, UserCheck, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  language: Language;
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  language,
  onClose,
  onSuccess,
}) => {
  const t = translations[language];

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('farmer');
  const [buyerType, setBuyerType] = useState<BuyerType>('wholesaler');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [district, setDistrict] = useState('Mandya');
  const [taluk, setTaluk] = useState('Maddur');
  const [village, setVillage] = useState('Kadalgere');
  const [farmSize, setFarmSize] = useState<number>(5.0);
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleQuickLogin = async (targetRole: UserRole, accountId?: string) => {
    try {
      setIsSubmitting(true);
      const user = await authService.loginWithDemoAccount(targetRole, accountId);
      onSuccess(user);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (mode === 'login') {
        const user = await authService.login(email || phone, role);
        onSuccess(user);
      } else {
        const user = await authService.register({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || `${phone.replace(/\s+/g, '')}@kisan.in`,
          role,
          district,
          taluk,
          village,
          farmSizeAcres: role === 'farmer' ? farmSize : undefined,
          buyerType: role === 'buyer' ? buyerType : undefined,
          businessName: role === 'buyer' ? businessName : undefined,
        });
        onSuccess(user);
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <h2 className="text-base font-bold text-stone-900">
              {mode === 'login' ? t.login : t.register}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* 1-Click Fast Evaluator Preset Accounts */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
            <span className="font-bold text-emerald-950 block mb-2">
              {language === 'kn' ? 'ತ್ವರಿತ ಪರೀಕ್ಷಾರ್ಥ ಲಾಗಿನ್ (1-ಕ್ಲಿಕ್ ಖಾತೆಗಳು):' : 'Instant 1-Click Test Accounts:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('farmer', 'farmer-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 font-semibold border border-emerald-300 text-left transition-colors"
              >
                <div className="font-bold">ಕೆಂಪೇಗೌಡ (Farmer)</div>
                <div className="text-[10px] text-stone-500">ಮಂಡ್ಯ (Sugarcane)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('buyer', 'buyer-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 font-semibold border border-emerald-300 text-left transition-colors"
              >
                <div className="font-bold">ಹೋಟೆಲ್ ಮಯೂರ</div>
                <div className="text-[10px] text-stone-500">Bengaluru (Buyer)</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin-1')}
                className="p-2.5 rounded-xl bg-white hover:bg-emerald-100 text-emerald-950 font-semibold border border-emerald-300 text-left transition-colors"
              >
                <div className="font-bold">ಆಡಳಿತಾಧಿಕಾರಿ</div>
                <div className="text-[10px] text-stone-500">Admin Console</div>
              </button>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'login' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.login}
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'register' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600'
              }`}
            >
              {t.register}
            </button>
          </div>

          {/* Role Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              {language === 'kn' ? 'ನಿಮ್ಮ ಬಳಕೆದಾರ ಪಾತ್ರ' : 'Select Account Role'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRole('farmer')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  role === 'farmer'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <Sprout className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                <span className="text-xs">{t.roleFarmer}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('buyer')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  role === 'buyer'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <ShoppingBag className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                <span className="text-xs">{t.roleBuyer}</span>
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  role === 'admin'
                    ? 'border-emerald-700 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-stone-200 text-stone-600'
                }`}
              >
                <ShieldCheck className="w-4 h-4 mx-auto mb-1 text-emerald-700" />
                <span className="text-xs">{t.roleAdmin}</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ಉದಾ: ಬಸವರಾಜು, ಮಂಜುನಾಥ್ ಗೌಡ"
                  className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs focus:bg-white focus:border-emerald-700"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ / ಇಮೇಲ್' : 'Mobile Number / Email'} *
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs font-mono focus:bg-white focus:border-emerald-700"
                required
              />
            </div>

            {mode === 'register' && role === 'buyer' && (
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'kn' ? 'ವ್ಯಾಪಾರ ವಿಧ' : 'Business Category'}
                </label>
                <select
                  value={buyerType}
                  onChange={(e) => setBuyerType(e.target.value as BuyerType)}
                  className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs"
                >
                  <option value="wholesaler">{t.buyerTypeWholesaler}</option>
                  <option value="retailer">{t.buyerTypeRetailer}</option>
                  <option value="hotel">{t.buyerTypeHotel}</option>
                  <option value="consumer">{t.buyerTypeConsumer}</option>
                </select>
              </div>
            )}

            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.districtLabel}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {t.villageLabel}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 text-xs"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-colors disabled:opacity-50 mt-2"
            >
              <span>{mode === 'login' ? t.login : t.register}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
