import React, { useState, useEffect } from 'react';
import { CropCategory, CropListing, Language, UserProfile, UserRole } from './types';
import { translations } from './locales/translations';
import { authService } from './services/authService';
import { cropService } from './services/cropService';
import { DemoModeBanner } from './components/DemoModeBanner';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { CropCard } from './components/CropCard';
import { CropDetailModal } from './components/CropDetailModal';
import { AddCropModal } from './components/AddCropModal';
import { MandiPricesView } from './components/MandiPricesView';
import { KarnatakaFarmMap } from './components/KarnatakaFarmMap';
import { FarmerDashboard } from './components/FarmerDashboard';
import { BuyerDashboard } from './components/BuyerDashboard';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { FirebaseSetupModal } from './components/FirebaseSetupModal';
import {
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  Sprout,
  Sparkles,
  PhoneCall,
  Info,
} from 'lucide-react';

export default function App() {
  // Language state: Default to Kannada as requested by the prompt
  const [language, setLanguage] = useState<Language>('kn');
  const t = translations[language];

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<'market' | 'mandi' | 'map' | 'dashboard' | 'admin'>('market');

  // User state
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());

  // Data states
  const [crops, setCrops] = useState<CropListing[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<CropListing | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'priceLow' | 'priceHigh' | 'quantity'>('newest');

  // Modals
  const [isAddCropOpen, setIsAddCropOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = authService.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch crops with filters
  const loadCrops = async () => {
    try {
      setLoading(true);
      const data = await cropService.getListings({
        query: searchQuery,
        category: selectedCategory,
        district: selectedDistrict,
        sortBy,
      });
      setCrops(data);
    } catch (err) {
      console.error('Failed to load crops', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCrops();
  }, [selectedCategory, selectedDistrict, searchQuery, sortBy]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'kn' ? 'en' : 'kn'));
  };

  const handleSwitchRole = async (targetRole: UserRole) => {
    const user = await authService.loginWithDemoAccount(targetRole);
    setCurrentUser(user);
    if (targetRole === 'admin') {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('dashboard');
    }
  };

  const handleLogout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  return (
    <div className="min-h-screen bg-[#fbfbf9] text-stone-900 flex flex-col font-sans pb-20 md:pb-0">
      {/* 1. Environment & Quick Test Banner */}
      <DemoModeBanner
        language={language}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)}
      />

      {/* 2. Top Bar Contract Navbar */}
      <Navbar
        language={language}
        onToggleLanguage={toggleLanguage}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* 3. Main Views Router */}
      <main className="flex-1">
        {activeTab === 'market' && (
          <div>
            {/* Storefront Hero Section (§2.A of E-Commerce Design) */}
            <section className="relative bg-white border-b border-stone-200 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Text Zone */}
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                    <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{t.heroBadge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-tight">
                    {t.heroTitle}
                  </h1>

                  <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                    {t.heroSubtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        const target = document.getElementById('crops-grid');
                        target?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-[0.99] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                    >
                      <span>{t.heroPrimaryCta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        if (!currentUser) setIsAuthOpen(true);
                        else setIsAddCropOpen(true);
                      }}
                      className="px-5 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold border border-stone-300 transition-colors"
                    >
                      {t.heroSecondaryCta}
                    </button>
                  </div>

                  {/* Adjacent Trust & Claim-to-Proof Metrics (§1.H) */}
                  <div className="pt-6 border-t border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <div className="font-mono tabular-nums text-lg font-bold text-emerald-900">
                        1,420+
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">{t.kpiFarmers}</div>
                    </div>
                    <div>
                      <div className="font-mono tabular-nums text-lg font-bold text-stone-900">
                        8,500+ Qtl
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">{t.kpiVolume}</div>
                    </div>
                    <div>
                      <div className="font-mono tabular-nums text-lg font-bold text-emerald-800">
                        0% Cut
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">{t.kpiMiddlemanSaved}</div>
                    </div>
                    <div>
                      <div className="font-mono tabular-nums text-lg font-bold text-stone-900">
                        APMC e-NAM
                      </div>
                      <div className="text-stone-500 text-[11px] mt-0.5">{t.kpiPriceTransparency}</div>
                    </div>
                  </div>
                </div>

                {/* Right: Authentic Farmland Visual Showcase */}
                <div className="lg:col-span-5 relative">
                  <div className="relative aspect-4/3 sm:aspect-16/10 lg:aspect-4/3 rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-xl">
                    <img
                      src="/src/assets/images/hero_karnataka_farmland_1793980645377.jpg"
                      alt="Karnataka lush farmlands in Mandya"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-end p-5 text-white">
                      <span className="text-[11px] font-semibold text-emerald-300 uppercase tracking-wider">
                        ಮಂಡ್ಯ & ಮದ್ದೂರು ಕೃಷಿ ವಲಯ
                      </span>
                      <h3 className="text-base font-bold mt-0.5">
                        ಕಾವೇರಿ ನದಿ ತೀರದ ತಾಜಾ ಕಬ್ಬು, ರಾಗಿ ಮತ್ತು ಎಳನೀರು
                      </h3>
                      <p className="text-xs text-stone-300 mt-1">
                        ರೈತರ ಕಣಜದಿಂದ ನೇರವಾಗಿ ಗ್ರಾಹಕರು, ಹೋಟೆಲ್‌ಗಳು ಮತ್ತು ವ್ಯಾಪಾರಿಗಳಿಗೆ.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Filter & Crop Grid Section */}
            <section id="crops-grid" className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
              {/* Filter Bar with Segmented Category Controls */}
              <div className="space-y-4">
                {/* Search and Secondary Selectors */}
                <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="relative flex-1 max-w-lg">
                    <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 focus:border-emerald-700 text-xs shadow-xs"
                    />
                  </div>

                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {/* District Filter */}
                    <select
                      value={selectedDistrict}
                      onChange={(e) => setSelectedDistrict(e.target.value)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:border-emerald-700 shadow-xs shrink-0"
                    >
                      <option value="all">{t.allDistricts}</option>
                      <option value="Mandya">Mandya (ಮಂಡ್ಯ)</option>
                      <option value="Hassan">Hassan (ಹಾಸನ)</option>
                      <option value="Mysuru">Mysuru (ಮೈಸೂರು)</option>
                      <option value="Ramanagara">Ramanagara (ರಾಮನಗರ)</option>
                    </select>

                    {/* Sort Selector */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:border-emerald-700 shadow-xs shrink-0"
                    >
                      <option value="newest">{t.sortNewest}</option>
                      <option value="priceLow">{t.sortPriceLow}</option>
                      <option value="priceHigh">{t.sortPriceHigh}</option>
                      <option value="quantity">{t.sortQuantity}</option>
                    </select>
                  </div>
                </div>

                {/* Interactive Category Segmented Tabs (Functional Buttons) */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: t.filterAll },
                    { id: 'grains', label: t.filterGrains },
                    { id: 'sugarcane', label: t.filterSugarcane },
                    { id: 'horticulture', label: t.filterHorticulture },
                    { id: 'vegetables', label: t.filterVegetables },
                    { id: 'plantation', label: t.filterPlantation },
                    { id: 'pulses', label: t.filterPulses },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-800 text-white font-semibold shadow-xs'
                          : 'bg-white border border-stone-200 text-stone-600 hover:border-emerald-600 hover:text-stone-900'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3-Column / 2-Column Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {crops.map((crop) => (
                  <CropCard
                    key={crop.id}
                    crop={crop}
                    language={language}
                    onSelect={(c) => {
                      cropService.incrementViews(c.id);
                      setSelectedCrop(c);
                    }}
                    onQuickContact={(c) => setSelectedCrop(c)}
                  />
                ))}
              </div>

              {crops.length === 0 && (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                  <Sprout className="w-12 h-12 text-stone-400 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900">
                    {language === 'kn'
                      ? 'ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಯಾವುದೇ ಬೆಳೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ'
                      : 'No crops match your selected filters'}
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {language === 'kn'
                      ? 'ದಯವಿಟ್ಟು ವರ್ಗ ಅಥವಾ ಜಿಲ್ಲೆಯ ಆಯ್ಕೆಯನ್ನು ಬದಲಾಯಿಸಿ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.'
                      : 'Try adjusting your search criteria, category filters, or selected district.'}
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSelectedDistrict('all');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold"
                  >
                    {language === 'kn' ? 'ಎಲ್ಲ ಫಿಲ್ಟರ್ ತೆರವುಗೊಳಿಸಿ' : 'Clear All Filters'}
                  </button>
                </div>
              )}
            </section>

            {/* Direct Trade Middleman Elimination Story Section */}
            <section className="bg-stone-100/70 border-t border-stone-200 py-12">
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="max-w-2xl mb-8">
                  <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider block mb-1">
                    {language === 'kn' ? 'ನಮ್ಮ ಧ್ಯೇಯ' : 'Our Mission'}
                  </span>
                  <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
                    {language === 'kn'
                      ? 'ದಲ್ಲಾಳಿಗಳ ಶೋಷಣೆಯಿಂದ ರೈತರಿಗೆ ಶಾಶ್ವತ ಮುಕ್ತಿ'
                      : 'Freeing Farmers from Intermediary Broker Exploitation'}
                  </h2>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {language === 'kn'
                      ? 'ಸಾಂಪ್ರದಾಯಿಕ ಮಂಡಿಗಳಲ್ಲಿ ಮಧ್ಯವರ್ತಿಗಳು ಕಮಿಷನ್, ತೂಕದ ಕಡಿತ ಮತ್ತು ಸಾರಿಗೆ ಹೆಸರಿನಲ್ಲಿ ರೈತರಿಗೆ ನ್ಯಾಯಯುತ ಬೆಲೆ ಸಿಗದಂತೆ ಮಾಡುತ್ತಾರೆ. ರೈತ ನೇರ ಮಾರುಕಟ್ಟೆಯು ಪ್ರತಿಯೊಬ್ಬ ಬೆಳೆಗಾರನಿಗೆ ನೇರ ಸಂಪರ್ಕ ಮತ್ತು ಪಾರದರ್ಶಕ ಮಾರುಕಟ್ಟೆ ಶಕ್ತಿ ನೀಡುತ್ತದೆ.'
                      : 'In traditional markets, commission agents slice away 8-12% plus handling cuts. Farmer Direct Market empowers farmers with direct buyer relationships, fair bargaining, and authentic APMC benchmark price clarity.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      01
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {language === 'kn' ? 'ನೇರ ಸಂಪರ್ಕ & ಮಾತುಕತೆ' : 'Direct Producer-Buyer Link'}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {language === 'kn'
                        ? 'ಖರೀದಿದಾರರು ನೇರವಾಗಿ ರೈತರ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಗೆ ಕರೆ ಮಾಡಬಹುದು ಅಥವಾ WhatsApp ಮೂಲಕ ವ್ಯಾಪಾರ ನಿಶ್ಚಯಿಸಬಹುದು.'
                        : 'Buyers and hospitality chains negotiate directly with farmers with full transparent contact details.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      02
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {language === 'kn' ? 'ಖಚಿತ ಮಂಡಿ ಬೆಲೆ ದಿಕ್ಸೂಚಿ' : 'Official APMC Price Benchmark'}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {language === 'kn'
                        ? 'ದೈನಂದಿನ ಮಂಡ್ಯ, ಮದ್ದೂರು ಮತ್ತು ಮೈಸೂರು ಎಪಿಎಂಸಿ ದರಗಳನ್ನು ನೋಡಿ ರೈತರು ಬೆಲೆ ನಿಗದಿಪಡಿಸುತ್ತಾರೆ.'
                        : 'Accredited mandi price intelligence so farmers know the true modal trading rates before quoting.'}
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                      03
                    </div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {language === 'kn' ? 'ಕೃಷಿ ಭೂಮಿಯಿಂದಲೇ ಪಿಕಪ್' : 'Farm Gate Pickup & Logistics'}
                    </h3>
                    <p className="text-stone-600 leading-relaxed">
                      {language === 'kn'
                        ? 'Google Maps ನಿರ್ದೇಶಾಂಕಗಳೊಂದಿಗೆ ಸಾಗಾಣಿಕೆ ವಾಹನಗಳು ನೇರವಾಗಿ ರೈತರ ಕಣಜ ಅಥವಾ ಗದ್ದೆಗೆ ತಲುಪುತ್ತವೆ.'
                        : 'Geographic coordinate markers allow trucks and transport mini-vans to pick produce straight from fields.'}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Mandi Prices Bulletin View */}
        {activeTab === 'mandi' && <MandiPricesView language={language} />}

        {/* Farm Map View */}
        {activeTab === 'map' && (
          <KarnatakaFarmMap
            language={language}
            crops={crops}
            onSelectCrop={(c) => {
              cropService.incrementViews(c.id);
              setSelectedCrop(c);
            }}
          />
        )}

        {/* User Dashboard View (Farmer or Buyer) */}
        {activeTab === 'dashboard' && currentUser && (
          <div>
            {currentUser.role === 'farmer' ? (
              <FarmerDashboard
                language={language}
                currentUser={currentUser}
                onOpenAddCrop={() => setIsAddCropOpen(true)}
                onSelectCrop={(c) => setSelectedCrop(c)}
              />
            ) : currentUser.role === 'buyer' ? (
              <BuyerDashboard
                language={language}
                currentUser={currentUser}
                onBrowseCrops={() => setActiveTab('market')}
              />
            ) : (
              <AdminPortal language={language} />
            )}
          </div>
        )}

        {/* Admin Portal View */}
        {activeTab === 'admin' && <AdminPortal language={language} />}
      </main>

      {/* Clean Footer (§1.B Anti-Slop Discipline) */}
      <footer className="bg-white border-t border-stone-200 py-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sprout className="w-4 h-4 text-emerald-800" />
            <span className="font-bold text-stone-800">
              {language === 'kn' ? 'ರೈತ ನೇರ ಮಾರುಕಟ್ಟೆ' : 'Farmer Direct Market'}
            </span>
            <span aria-hidden="true">·</span>
            <span>{language === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ವೇದಿಕೆ' : 'Karnataka Agricultural Portal'}</span>
          </div>

          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:text-emerald-800 transition-colors"
            >
              {t.firebaseSetup}
            </button>
            <span>·</span>
            <button onClick={toggleLanguage} className="hover:text-emerald-800 transition-colors">
              {language === 'kn' ? 'English' : 'ಕನ್ನಡ'}
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Navigation Bar (Pattern 1) */}
      <MobileBottomNav
        language={language}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAddCrop={() => setIsAddCropOpen(true)}
      />

      {/* Crop Detail & Purchase Modal */}
      {selectedCrop && (
        <CropDetailModal
          crop={selectedCrop}
          language={language}
          currentUser={currentUser}
          onClose={() => setSelectedCrop(null)}
          onOpenAuth={() => setIsAuthOpen(true)}
          onEnquirySuccess={() => {
            loadCrops();
          }}
        />
      )}

      {/* Add Crop Listing Modal */}
      {isAddCropOpen && currentUser && (
        <AddCropModal
          language={language}
          currentUser={currentUser}
          onClose={() => setIsAddCropOpen(false)}
          onListingAdded={(newCrop) => {
            loadCrops();
            setSelectedCrop(newCrop);
          }}
        />
      )}

      {/* Auth Modal */}
      {isAuthOpen && (
        <AuthModal
          language={language}
          onClose={() => setIsAuthOpen(false)}
          onSuccess={(u) => {
            setCurrentUser(u);
            loadCrops();
          }}
        />
      )}

      {/* Firebase & Deployment Guide Modal */}
      {isFirebaseModalOpen && (
        <FirebaseSetupModal
          language={language}
          onClose={() => setIsFirebaseModalOpen(false)}
        />
      )}
    </div>
  );
}
