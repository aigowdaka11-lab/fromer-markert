import React, { useState } from 'react';
import { CropCategory, CropListing, Language, QuantityUnit, UserProfile } from '../types';
import { translations } from '../locales/translations';
import { X, Upload, Sprout, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { cropService } from '../services/cropService';

interface AddCropModalProps {
  language: Language;
  currentUser: UserProfile;
  onClose: () => void;
  onListingAdded: (newCrop: CropListing) => void;
}

const PHOTO_PRESETS = [
  {
    labelKn: 'ಕಬ್ಬಿನ ಕಟಾವು (ಮಂಡ್ಯ)',
    labelEn: 'Sugarcane Harvest',
    url: '/src/assets/images/crop_mandya_sugarcane_1793980645947.jpg',
  },
  {
    labelKn: 'ಸಾವಯವ ರಾಗಿ (ಗೋಣಿಚೀಲ)',
    labelEn: 'Organic Ragi Sacks',
    url: '/src/assets/images/crop_organic_ragi_grain_1793980646768.jpg',
  },
  {
    labelKn: 'ತಾಜಾ ಕೆಂಪು ಟೊಮೇಟೊ',
    labelEn: 'Red Fresh Tomatoes',
    url: '/src/assets/images/crop_fresh_tomatoes_1793980647493.jpg',
  },
  {
    labelKn: 'ಮದ್ದೂರು ಎಳನೀರು & ತೆಂಗು',
    labelEn: 'Maddur Coconuts',
    url: '/src/assets/images/crop_maddur_coconuts_1793980646658.jpg',
  },
  {
    labelKn: 'ಕೃಷಿ ತೋಟ / ಭತ್ತದ ಗದ್ದೆ',
    labelEn: 'Paddy & Farmland',
    url: '/src/assets/images/hero_karnataka_farmland_1793980645377.jpg',
  },
];

export const AddCropModal: React.FC<AddCropModalProps> = ({
  language,
  currentUser,
  onClose,
  onListingAdded,
}) => {
  const t = translations[language];

  const [cropNameEn, setCropNameEn] = useState('');
  const [cropNameKn, setCropNameKn] = useState('');
  const [category, setCategory] = useState<CropCategory>('grains');
  const [variety, setVariety] = useState('');
  const [quantity, setQuantity] = useState<number>(50);
  const [unit, setUnit] = useState<QuantityUnit>('quintal');
  const [askingPricePerUnit, setAskingPricePerUnit] = useState<number>(3500);
  const [minOrderQuantity, setMinOrderQuantity] = useState<number>(2);
  const [harvestDate, setHarvestDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [availableFrom, setAvailableFrom] = useState<string>(
    new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
  );
  const [district, setDistrict] = useState<string>(currentUser.district || 'Mandya');
  const [taluk, setTaluk] = useState<string>(currentUser.taluk || 'Maddur');
  const [village, setVillage] = useState<string>(currentUser.village || 'Kadalgere');
  const [marketNearby, setMarketNearby] = useState<string>('Mandya APMC Yard');
  const [imageUrl, setImageUrl] = useState<string>(PHOTO_PRESETS[0].url);
  const [organicCertified, setOrganicCertified] = useState<boolean>(false);
  const [descriptionKn, setDescriptionKn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropNameEn && !cropNameKn) return;

    try {
      setIsSubmitting(true);
      const newListing = await cropService.addListing({
        farmerId: currentUser.id,
        farmerName: currentUser.name,
        farmerPhone: currentUser.phone,
        district,
        taluk,
        village,
        marketNearby,
        coordinates: { lat: 12.524, lng: 76.897 },
        cropNameEn: cropNameEn || cropNameKn,
        cropNameKn: cropNameKn || cropNameEn,
        category,
        variety: variety || 'Standard Local Hybrid',
        quantity,
        unit,
        askingPricePerUnit,
        minOrderQuantity,
        harvestDate,
        availableFrom,
        imageUrl: imageUrl || PHOTO_PRESETS[0].url,
        organicCertified,
        descriptionEn:
          descriptionEn ||
          `Freshly harvested direct from farmer in ${village}, ${district}. Direct sales without middleman.`,
        descriptionKn:
          descriptionKn ||
          `${village}, ${district} ನ ರೈತರ ಹೊಲದಿಂದಲೇ ನೇರ ಮಾರಾಟ. ಗುಣಮಟ್ಟದ ಕೃಷಿ ಬೆಳೆ.`,
        status: 'available',
      });

      onListingAdded(newListing);
      onClose();
    } catch (err) {
      console.error('Failed to add listing', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div
        className="relative bg-white w-full max-w-3xl rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <h2 className="text-lg font-bold text-stone-900">
              {language === 'kn' ? 'ಹೊಸ ಬೆಳೆ ಮಾರಾಟಕ್ಕೆ ಸೇರಿಸಿ' : 'Add New Crop Listing'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 max-h-[80vh] overflow-y-auto space-y-5">
          {/* Section 1: Names and Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.cropNameKnLabel} *
              </label>
              <input
                type="text"
                value={cropNameKn}
                onChange={(e) => setCropNameKn(e.target.value)}
                placeholder="ಉದಾ: ನಾಟಿ ರಾಗಿ, ಸಾವಯವ ಕಬ್ಬು, ಟೊಮೇಟೊ"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white focus:border-emerald-700 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.cropNameEnLabel} *
              </label>
              <input
                type="text"
                value={cropNameEn}
                onChange={(e) => setCropNameEn(e.target.value)}
                placeholder="e.g., Organic Finger Millet (Ragi)"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white focus:border-emerald-700 text-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.categoryLabel}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CropCategory)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white focus:border-emerald-700 text-sm"
              >
                <option value="grains">{t.filterGrains}</option>
                <option value="sugarcane">{t.filterSugarcane}</option>
                <option value="horticulture">{t.filterHorticulture}</option>
                <option value="vegetables">{t.filterVegetables}</option>
                <option value="plantation">{t.filterPlantation}</option>
                <option value="pulses">{t.filterPulses}</option>
                <option value="spices">{t.filterSpices}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.varietyLabel}
              </label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="ಉದಾ: MR-1, CO-86032, Hybrid Red"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white focus:border-emerald-700 text-sm"
              />
            </div>
          </div>

          {/* Section 2: Quantities & Pricing */}
          <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.quantityLabel} *
              </label>
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-sm font-mono tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.unitLabel}
              </label>
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as QuantityUnit)}
                className="w-full px-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-sm"
              >
                <option value="quintal">{t.unitQuintal} (Quintal - 100 kg)</option>
                <option value="tonne">{t.unitTonne} (Tonne - 1000 kg)</option>
                <option value="kg">{t.unitKg} (Kilogram)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.priceLabel} *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-stone-500 font-mono">₹</span>
                <input
                  type="number"
                  min={1}
                  value={askingPricePerUnit}
                  onChange={(e) => setAskingPricePerUnit(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white rounded-lg border border-stone-300 focus:border-emerald-700 text-sm font-mono tabular-nums font-bold text-emerald-950"
                  required
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location and Market */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t.districtLabel}</label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t.talukLabel}</label>
              <input
                type="text"
                value={taluk}
                onChange={(e) => setTaluk(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t.villageLabel}</label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">{t.marketNearbyLabel}</label>
              <input
                type="text"
                value={marketNearby}
                onChange={(e) => setMarketNearby(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Section 4: Harvest Date & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.harvestDate}
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t.availableFrom}
              </label>
              <input
                type="text"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                placeholder="ಉದಾ: ತಕ್ಷಣ ಲಭ್ಯ / Ready Stock"
                className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Section 5: Photo Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-2">
              {t.uploadPhotoLabel}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PHOTO_PRESETS.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setImageUrl(preset.url)}
                  className={`group relative aspect-4/3 rounded-xl overflow-hidden border-2 text-left transition-all ${
                    imageUrl === preset.url
                      ? 'border-emerald-700 ring-2 ring-emerald-600/30'
                      : 'border-stone-200 hover:border-stone-400 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.labelEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-medium truncate">
                      {language === 'kn' ? preset.labelKn : preset.labelEn}
                    </span>
                  </div>
                  {imageUrl === preset.url && (
                    <div className="absolute top-1 right-1 bg-emerald-700 text-white rounded-full p-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Section 6: Organic Certification */}
          <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
            <input
              type="checkbox"
              id="organicCheck"
              checked={organicCertified}
              onChange={(e) => setOrganicCertified(e.target.checked)}
              className="w-4 h-4 text-emerald-700 rounded border-stone-300 focus:ring-emerald-700"
            />
            <label htmlFor="organicCheck" className="text-xs font-medium text-stone-800 cursor-pointer">
              {language === 'kn'
                ? 'ಸಾವಯವ ಪ್ರಮಾಣೀಕರಣ / ರಾಸಾಯನಿಕ ರಹಿತ ಕೃಷಿ ಪದ್ಧತಿ (Organic / Chemical Free)'
                : 'Organic Certified / Pesticide-Free Cultivation'}
            </label>
          </div>

          {/* Section 7: Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t.descriptionLabel}
            </label>
            <textarea
              rows={2}
              value={descriptionKn}
              onChange={(e) => setDescriptionKn(e.target.value)}
              placeholder="ಬೆಳೆಯ ತೇವಾಂಶ, ಪ್ಯಾಕಿಂಗ್ ವಿಧಾನ, ಕಟಾವಿನ ವಿವರ ಇತ್ಯಾದಿ..."
              className="w-full px-3 py-2 bg-stone-50 rounded-lg border border-stone-300 focus:bg-white text-xs mb-2"
            />
          </div>

          {/* Submit and Cancel Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 text-xs font-semibold transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md transition-colors disabled:opacity-50"
            >
              <Sprout className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (language === 'kn' ? 'ಪ್ರಕಟಿಸಲಾಗುತ್ತಿದೆ...' : 'Publishing...')
                  : t.saveListing}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
