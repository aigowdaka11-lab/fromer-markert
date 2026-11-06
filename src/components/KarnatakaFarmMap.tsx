import React, { useState } from 'react';
import { CropListing, Language } from '../types';
import { translations } from '../locales/translations';
import {
  MapPin,
  Navigation,
  Compass,
  Phone,
  CheckCircle2,
  ExternalLink,
  Layers,
  Key,
  Info,
} from 'lucide-react';

interface KarnatakaFarmMapProps {
  language: Language;
  crops: CropListing[];
  onSelectCrop: (crop: CropListing) => void;
}

const KARNATAKA_DISTRICTS = [
  {
    id: 'mandya',
    nameEn: 'Mandya District',
    nameKn: 'ಮಂಡ್ಯ ಜಿಲ್ಲೆ',
    highlight: 'Sugarcane, Jaggery, Tender Coconut, Ragi',
    centerLat: 12.524,
    centerLng: 76.897,
    taluks: ['Maddur', 'K.R. Pete', 'Pandavapura', 'Malavalli', 'Nagamangala', 'Srirangapatna'],
  },
  {
    id: 'hassan',
    nameEn: 'Hassan District',
    nameKn: 'ಹಾಸನ ಜಿಲ್ಲೆ',
    highlight: 'Tomato, Potato, Maize, Coffee',
    centerLat: 13.0033,
    centerLng: 76.1004,
    taluks: ['Channarayapatna', 'Arasikere', 'Holenarasipura', 'Sakleshpur', 'Belur'],
  },
  {
    id: 'mysuru',
    nameEn: 'Mysuru District',
    nameKn: 'ಮೈಸೂರು ಜಿಲ್ಲೆ',
    highlight: 'Nanjangud Banana, Paddy, Pulses, Vegetables',
    centerLat: 12.2958,
    centerLng: 76.6394,
    taluks: ['Nanjangud', 'T. Narasipura', 'Hunsur', 'K.R. Nagar', 'Periyapatna'],
  },
  {
    id: 'ramanagara',
    nameEn: 'Ramanagara District',
    nameKn: 'ರಾಮನಗರ ಜಿಲ್ಲೆ',
    highlight: 'Silk Cocoons, Mango, Ragi, Sericulture',
    centerLat: 12.7209,
    centerLng: 77.2799,
    taluks: ['Channapatna', 'Kanakapura', 'Magadi', 'Ramanagara Town'],
  },
];

export const KarnatakaFarmMap: React.FC<KarnatakaFarmMapProps> = ({
  language,
  crops,
  onSelectCrop,
}) => {
  const t = translations[language];
  const [selectedDistrict, setSelectedDistrict] = useState<string>('mandya');
  const [activeCropId, setActiveCropId] = useState<string>(crops[0]?.id || '');
  const [googleMapsKey, setGoogleMapsKey] = useState<string>(
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  );
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  const activeDistrictInfo =
    KARNATAKA_DISTRICTS.find((d) => d.id === selectedDistrict) || KARNATAKA_DISTRICTS[0];

  const districtCrops = crops.filter((c) =>
    c.district.toLowerCase().includes(activeDistrictInfo.nameEn.split(' ')[0].toLowerCase())
  );

  const activeCrop = crops.find((c) => c.id === activeCropId) || districtCrops[0] || crops[0];

  // Google Maps embed URL (works reliably with or without custom key)
  const mapEmbedUrl = googleMapsKey
    ? `https://www.google.com/maps/embed/v1/place?key=${googleMapsKey}&q=${activeCrop.coordinates.lat},${activeCrop.coordinates.lng}&zoom=12`
    : `https://maps.google.com/maps?q=${activeCrop.coordinates.lat},${activeCrop.coordinates.lng}&hl=kn&z=12&output=embed`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>{language === 'kn' ? 'ಭೌಗೋಳಿಕ ಕೃಷಿ ಸ್ಥಳ ನಕ್ಷೆ' : 'Geographic Farm Locator'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t.mapTitle}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-3xl">
            {t.mapSubtitle}
          </p>
        </div>

        {/* Optional Google Maps API Key Config Trigger */}
        <button
          onClick={() => setShowKeyInput(!showKeyInput)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-300 hover:border-emerald-700 bg-white text-xs font-medium text-stone-700 transition-colors shrink-0 self-start"
        >
          <Key className="w-3.5 h-3.5 text-stone-500" />
          <span>
            {googleMapsKey
              ? (language === 'kn' ? 'Google Maps ಕೀ ಸಕ್ರಿಯ' : 'Custom API Key Set')
              : (language === 'kn' ? 'Google Maps API ಕೀ (ಐಚ್ಛಿಕ)' : 'Google Maps API Key (Optional)')}
          </span>
        </button>
      </div>

      {/* Optional Google Maps Key Input Box */}
      {showKeyInput && (
        <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-stone-800">
              {language === 'kn' ? 'Google Maps Platform API ಕೀ ಸಂಯೋಜನೆ' : 'Google Maps Platform API Key'}
            </span>
            <span className="text-stone-400">
              {language === 'kn' ? 'ಉಚಿತ ಮಾದರಿಯಲ್ಲಿ ಕೀ ಇಲ್ಲದೆಯೂ ನಕ್ಷೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ' : 'Works out of the box without any paid key'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={googleMapsKey}
              onChange={(e) => setGoogleMapsKey(e.target.value)}
              placeholder="AIzaSy..."
              className="flex-1 px-3 py-2 bg-white rounded-lg border border-stone-300 font-mono text-xs"
            />
            <button
              onClick={() => setShowKeyInput(false)}
              className="px-3 py-2 rounded-lg bg-emerald-800 text-white font-medium"
            >
              {language === 'kn' ? 'ಉಳಿಸಿ' : 'Save'}
            </button>
          </div>
        </div>
      )}

      {/* District Selector Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
          {t.districtFilter}:
        </span>
        {KARNATAKA_DISTRICTS.map((dist) => (
          <button
            key={dist.id}
            onClick={() => {
              setSelectedDistrict(dist.id);
              const firstInDist = crops.find((c) =>
                c.district.toLowerCase().includes(dist.nameEn.split(' ')[0].toLowerCase())
              );
              if (firstInDist) setActiveCropId(firstInDist.id);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedDistrict === dist.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-stone-700 hover:border-emerald-600'
            }`}
          >
            {language === 'kn' ? dist.nameKn : dist.nameEn}
          </button>
        ))}
      </div>

      {/* Main Map & Location Cards Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Interactive Map Container */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span className="text-xs font-bold text-stone-800">
                {activeCrop.village}, {activeCrop.taluk}, {activeCrop.district}
              </span>
            </div>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${activeCrop.coordinates.lat},${activeCrop.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 hover:text-emerald-900"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಮಾರ್ಗಸೂಚಿ (Directions)' : 'Get Directions'}</span>
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </div>

          {/* Interactive Map Iframe */}
          <div className="relative w-full h-[360px] sm:h-[420px] bg-stone-100">
            <iframe
              title="Farmer Location Map"
              src={mapEmbedUrl}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>

          {/* Bottom GPS Coordinates strip */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500 font-mono">
            <span>GPS: {activeCrop.coordinates.lat.toFixed(4)}° N, {activeCrop.coordinates.lng.toFixed(4)}° E</span>
            <span>{activeCrop.marketNearby}</span>
          </div>
        </div>

        {/* Right: Active Farm Lots in District */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-stone-900">
              {language === 'kn' ? `${activeDistrictInfo.nameKn} ರೈತರ ಬೆಳೆಗಳು` : `Farms in ${activeDistrictInfo.nameEn}`}
            </h3>
            <span className="text-xs text-stone-500 font-mono tabular-nums">
              {districtCrops.length} {language === 'kn' ? 'ದಾಸ್ತಾನುಗಳು' : 'lots'}
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto max-h-[460px] pr-1">
            {districtCrops.map((crop) => {
              const isSelected = crop.id === activeCropId;
              const cropTitle = language === 'kn' ? crop.cropNameKn : crop.cropNameEn;

              return (
                <div
                  key={crop.id}
                  onClick={() => setActiveCropId(crop.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-emerald-50/70 border-emerald-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-emerald-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1">
                        <span className="font-semibold text-emerald-800">{crop.variety}</span>
                        <span aria-hidden="true">·</span>
                        <span>{crop.village}</span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900">{cropTitle}</h4>
                      <div className="text-xs text-stone-600 mt-1 flex items-center gap-1">
                        <span>{crop.farmerName}</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-bold tabular-nums text-emerald-900">
                        ₹{crop.askingPricePerUnit.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {crop.quantity} {crop.unit}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span className="font-mono">{crop.farmerPhone}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectCrop(crop);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-semibold transition-colors"
                    >
                      {t.viewDetails}
                    </button>
                  </div>
                </div>
              );
            })}

            {districtCrops.length === 0 && (
              <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
                {language === 'kn'
                  ? 'ಈ ಜಿಲ್ಲೆಯಲ್ಲಿ ಪ್ರಸ್ತುತ ಯಾವುದೇ ಹೊಸ ಬೆಳೆಗಳು ನೋಂದಣಿಯಾಗಿಲ್ಲ.'
                  : 'No active crops currently listed in this district.'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
