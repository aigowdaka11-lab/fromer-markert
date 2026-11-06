import React, { useState } from 'react';
import { CropListing, Language } from '../types';
import { translations } from '../locales/translations';
import { MapPin, CheckCircle2, Phone, Calendar, ArrowRight, ShieldCheck, Sprout } from 'lucide-react';

interface CropCardProps {
  crop: CropListing;
  language: Language;
  onSelect: (crop: CropListing) => void;
  onQuickContact?: (crop: CropListing) => void;
}

export const CropCard: React.FC<CropCardProps> = ({
  crop,
  language,
  onSelect,
  onQuickContact,
}) => {
  const t = translations[language];
  const [imgError, setImgError] = useState(false);

  const cropName = language === 'kn' ? crop.cropNameKn : crop.cropNameEn;
  const unitLabel =
    crop.unit === 'tonne' ? t.unitTonne : crop.unit === 'quintal' ? t.unitQuintal : t.unitKg;

  return (
    <article
      onClick={() => onSelect(crop)}
      className="group flex flex-col bg-white rounded-2xl border border-stone-200 hover:border-emerald-500 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left"
    >
      {/* Visual Asset Container (approx 65% of top height) */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        {!imgError && crop.imageUrl ? (
          <img
            src={crop.imageUrl}
            alt={cropName}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4">
            <Sprout className="w-12 h-12 text-emerald-600 mb-2 stroke-[1.5]" />
            <span className="text-xs font-medium text-stone-600 text-center">{cropName}</span>
          </div>
        )}

        {/* Quiet, unboxed organic marker or availability status */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {crop.organicCertified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-900/90 text-emerald-100 backdrop-blur-xs text-[11px] font-semibold">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              {t.organicCertified}
            </span>
          )}
        </div>

        {/* Available Stock Tag */}
        <div className="absolute bottom-3 right-3 bg-stone-900/85 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-xs font-mono tabular-nums">
          {crop.quantity.toLocaleString()} {unitLabel}
        </div>
      </div>

      {/* Card Content & Metadata */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Unboxed clean metadata with dot separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 flex-wrap">
            <span className="font-medium text-emerald-800">{crop.variety}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              {crop.village}, {crop.district}
            </span>
          </div>

          {/* Primary Crop Title */}
          <h3 className="text-base font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
            {cropName}
          </h3>

          {/* Farmer Attributed Info */}
          <div className="text-xs text-stone-600 mt-1 flex items-center gap-1.5">
            <span className="text-stone-400">{language === 'kn' ? 'ಬೆಳೆದವರು:' : 'Farmer:'}</span>
            <span className="font-medium text-stone-800 truncate">{crop.farmerName}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          </div>
        </div>

        {/* Bottom Price & Action Zone */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="text-[11px] text-stone-400 uppercase tracking-wider">
              {t.askingPrice}
            </div>
            <div className="font-mono tabular-nums text-lg font-bold text-emerald-900">
              ₹{crop.askingPricePerUnit.toLocaleString()}
              <span className="text-xs font-normal text-stone-500 ml-1">/ {unitLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {onQuickContact && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickContact(crop);
                }}
                className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                title={t.directCall}
              >
                <Phone className="w-4 h-4 text-emerald-700" />
              </button>
            )}

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(crop);
              }}
              className="px-3 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
            >
              <span>{t.viewDetails}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
