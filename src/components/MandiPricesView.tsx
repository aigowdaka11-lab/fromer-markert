import React, { useState } from 'react';
import { Language, MandiMarketPrice } from '../types';
import { translations } from '../locales/translations';
import { marketPriceService } from '../services/marketPriceService';
import {
  TrendingUp,
  Search,
  MapPin,
  Calendar,
  AlertCircle,
  Calculator,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react';

interface MandiPricesViewProps {
  language: Language;
}

export const MandiPricesView: React.FC<MandiPricesViewProps> = ({ language }) => {
  const t = translations[language];
  const [districtFilter, setDistrictFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Calculator states
  const [calcQuantity, setCalcQuantity] = useState<number>(50);
  const [calcModalPrice, setCalcModalPrice] = useState<number>(3820); // Default Ragi modal price
  const [calcCommissionPct, setCalcCommissionPct] = useState<number>(8.5);

  const allPrices = marketPriceService.getAllPrices();

  const filteredPrices = allPrices.filter((item) => {
    const matchesDistrict =
      districtFilter === 'all' ||
      item.districtEn.toLowerCase().includes(districtFilter.toLowerCase()) ||
      item.districtKn.toLowerCase().includes(districtFilter.toLowerCase());

    const matchesQuery =
      searchQuery === '' ||
      item.commodityEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.commodityKn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.marketNameKn.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesDistrict && matchesQuery;
  });

  const savings = marketPriceService.calculateMiddlemanSavings(
    calcQuantity,
    calcModalPrice,
    calcCommissionPct
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-2">
          <TrendingUp className="w-4 h-4 text-emerald-700" />
          <span>{language === 'kn' ? 'ನೇರ ಬೆಲೆ ಪಾರದರ್ಶಕತೆ' : 'Market Price Transparency'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {t.mandiTitle}
        </h1>
        <p className="text-sm text-stone-600 mt-1 max-w-3xl">
          {t.mandiSubtitle}
        </p>
      </div>

      {/* Official Government Data Trust Notice */}
      <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold block mb-0.5">
            {language === 'kn'
              ? 'ಅಧಿಕೃತ ಕೃಷಿ ದತ್ತಾಂಶ ಧೋರಣೆ (AGMARKNET & KSAMB Benchmark):'
              : 'Official Agricultural Data Policy (AGMARKNET & KSAMB Benchmark):'}
          </span>
          {t.demoNotice}
        </div>
      </div>

      {/* Middleman Savings Calculator Widget */}
      <section aria-labelledby="calculator-heading" className="bg-gradient-to-br from-emerald-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-semibold mb-3 border border-emerald-700">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t.priceCompareTitle}</span>
          </div>
          <h2 id="calculator-heading" className="text-xl sm:text-2xl font-bold tracking-tight">
            {language === 'kn' ? 'ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ನಿಮ್ಮ ನಿವ್ವಳ ಲಾಭ ಎಷ್ಟು ಹೆಚ್ಚಾಗುತ್ತದೆ?' : 'How much extra do you earn without brokers?'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200 mt-1.5 leading-relaxed">
            {t.priceCompareDesc}
          </p>
        </div>

        {/* Interactive Calculator Inputs */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-emerald-800/80">
          <div>
            <label className="block text-xs text-emerald-200 font-medium mb-1">
              {language === 'kn' ? 'ಬೆಳೆಯ ಪ್ರಮಾಣ (ಕ್ವಿಂಟಾಲ್)' : 'Crop Quantity (Quintals)'}
            </label>
            <input
              type="number"
              min={1}
              value={calcQuantity}
              onChange={(e) => setCalcQuantity(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700 text-white font-mono tabular-nums text-sm focus:border-emerald-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs text-emerald-200 font-medium mb-1">
              {language === 'kn' ? 'ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ ಬೆಲೆ (₹)' : 'Price per Quintal (₹)'}
            </label>
            <input
              type="number"
              min={100}
              value={calcModalPrice}
              onChange={(e) => setCalcModalPrice(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700 text-white font-mono tabular-nums text-sm focus:border-emerald-400 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs text-emerald-200 font-medium mb-1">
              {language === 'kn' ? 'ದಲ್ಲಾಳಿ ಕಮಿಷನ್ ದರ (%)' : 'Broker Commission Cut (%)'}
            </label>
            <select
              value={calcCommissionPct}
              onChange={(e) => setCalcCommissionPct(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-emerald-950/70 border border-emerald-700 text-white text-sm focus:border-emerald-400 focus:outline-hidden"
            >
              <option value={6}>6% (ಕನಿಷ್ಠ ಕಮಿಷನ್)</option>
              <option value={8.5}>8.5% (ಸಾಮಾನ್ಯ ಸರಾಸರಿ)</option>
              <option value={10}>10% (ಹೆಚ್ಚಿನ ಮಾರುಕಟ್ಟೆ ಕಡಿತ)</option>
            </select>
          </div>
        </div>

        {/* Calculated Savings Showcase */}
        <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs text-emerald-300 font-medium block">
              {t.savingsResult}
            </span>
            <div className="text-2xl sm:text-3xl font-bold font-mono tabular-nums text-white mt-0.5">
              + ₹{savings.middlemanCut.toLocaleString()}
            </div>
            <span className="text-xs text-emerald-200 mt-0.5 block">
              {language === 'kn'
                ? `ದಲ್ಲಾಳಿಗಳಿಲ್ಲದೆ ಮಾರಾಟ ಮಾಡುವುದರಿಂದ ಒಟ್ಟು ₹${savings.grossValue.toLocaleString()} ಹಣವೂ ನೇರವಾಗಿ ನಿಮ್ಮ ಖಾತೆಗೆ ಬರುತ್ತದೆ!`
                : `100% of the ₹${savings.grossValue.toLocaleString()} trade value goes directly to your bank account!`}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs bg-emerald-800/80 px-4 py-2.5 rounded-xl border border-emerald-700 font-semibold text-emerald-100">
            <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {language === 'kn'
                ? `+${savings.extraIncomePct}% ನೇರ ಆದಾಯ ಹೆಚ್ಚಳ`
                : `+${savings.extraIncomePct}% Net Margin Retained`}
            </span>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'kn' ? 'ಬೆಳೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಹುಡುಕಿ (ಉದಾ: ರಾಗಿ, ಮಂಡ್ಯ)...' : 'Search commodity or mandi (e.g., Ragi, Mandya)...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-200 focus:border-emerald-700 text-xs shadow-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">
            {t.districtFilter}:
          </span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-medium focus:border-emerald-700 shadow-xs"
          >
            <option value="all">{t.allDistricts}</option>
            <option value="Mandya">Mandya (ಮಂಡ್ಯ)</option>
            <option value="Hassan">Hassan (ಹಾಸನ)</option>
            <option value="Mysuru">Mysuru (ಮೈಸೂರು)</option>
            <option value="Ramanagara">Ramanagara (ರಾಮನಗರ)</option>
          </select>
        </div>
      </div>

      {/* Mandi Price Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-xs text-stone-600 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 sm:px-6">{language === 'kn' ? 'ಕೃಷಿ ಉತ್ಪನ್ನ' : 'Commodity'}</th>
                <th className="py-3.5 px-4">{language === 'kn' ? 'ಮಾರುಕಟ್ಟೆ (APMC)' : 'Market Yard'}</th>
                <th className="py-3.5 px-4 text-right">{t.minPrice}</th>
                <th className="py-3.5 px-4 text-right">{t.maxPrice}</th>
                <th className="py-3.5 px-4 text-right text-emerald-900 bg-emerald-50/50">
                  {t.modalPrice}
                </th>
                <th className="py-3.5 px-4 sm:px-6 text-right">{t.sourceLabel}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
              {filteredPrices.map((row) => (
                <tr key={row.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-bold text-stone-900 text-sm">
                      {language === 'kn' ? row.commodityKn : row.commodityEn}
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {language === 'kn' ? row.commodityEn : row.commodityKn}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-semibold text-stone-800">
                      {language === 'kn' ? row.marketNameKn : row.marketNameEn}
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-stone-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{language === 'kn' ? row.districtKn : row.districtEn}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-right font-mono tabular-nums text-stone-600">
                    ₹{row.minPrice.toLocaleString()}
                    <span className="text-[10px] text-stone-400 block">/ ಕ್ವಿಂಟಾಲ್</span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono tabular-nums text-stone-600">
                    ₹{row.maxPrice.toLocaleString()}
                    <span className="text-[10px] text-stone-400 block">/ ಕ್ವಿಂಟಾಲ್</span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono tabular-nums font-bold text-sm text-emerald-900 bg-emerald-50/30">
                    ₹{row.modalPrice.toLocaleString()}
                    <span className="text-[10px] font-normal text-emerald-700 block">/ quintal</span>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600">
                      <Building2 className="w-3 h-3 text-stone-400" />
                      <span className="max-w-[150px] sm:max-w-xs truncate" title={row.sourceName}>
                        {row.sourceName}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono mt-0.5">
                      {row.lastUpdated}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPrices.length === 0 && (
          <div className="p-8 text-center text-xs text-stone-500">
            {language === 'kn'
              ? 'ಯಾವುದೇ ಮಂಡಿ ದರಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ದಯವಿಟ್ಟು ಹುಡುಕಾಟ ಪದ ಬದಲಾಯಿಸಿ.'
              : 'No mandi prices match your current filter. Please try a different search.'}
          </div>
        )}
      </div>
    </div>
  );
};
