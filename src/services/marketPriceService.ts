import { MandiMarketPrice } from '../types';
import { initialMandiPrices } from './mockData';

const MANDI_STORAGE_KEY = 'fdm_mandi_prices_v1';

function getStoredPrices(): MandiMarketPrice[] {
  try {
    const raw = localStorage.getItem(MANDI_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading mandi prices from storage', e);
  }
  localStorage.setItem(MANDI_STORAGE_KEY, JSON.stringify(initialMandiPrices));
  return initialMandiPrices;
}

function saveStoredPrices(prices: MandiMarketPrice[]) {
  localStorage.setItem(MANDI_STORAGE_KEY, JSON.stringify(prices));
}

export const marketPriceService = {
  getAllPrices(): MandiMarketPrice[] {
    return getStoredPrices();
  },

  getPricesByDistrict(district: string): MandiMarketPrice[] {
    const all = getStoredPrices();
    if (!district || district === 'all') return all;
    return all.filter((p) => p.districtEn.toLowerCase().includes(district.toLowerCase()));
  },

  getModalPriceForCommodity(commodityKeyword: string): MandiMarketPrice | undefined {
    const all = getStoredPrices();
    const clean = commodityKeyword.toLowerCase();
    return all.find(
      (p) =>
        p.commodityEn.toLowerCase().includes(clean) ||
        p.commodityKn.toLowerCase().includes(clean)
    );
  },

  addPriceEntry(entry: Omit<MandiMarketPrice, 'id' | 'lastUpdated'>): MandiMarketPrice {
    const all = getStoredPrices();
    const newEntry: MandiMarketPrice = {
      ...entry,
      id: `mandi-${Date.now()}`,
      lastUpdated: new Date().toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    };
    all.unshift(newEntry);
    saveStoredPrices(all);
    return newEntry;
  },

  calculateMiddlemanSavings(
    quantityQuintals: number,
    pricePerQuintal: number,
    commissionPct = 8.5 // Typical APMC commission agent & middleman cut is 6-10%
  ) {
    const grossValue = quantityQuintals * pricePerQuintal;
    const middlemanCut = Math.round(grossValue * (commissionPct / 100));
    const netDirectValue = grossValue;
    return {
      grossValue,
      middlemanCut,
      netDirectValue,
      extraIncomePct: commissionPct,
    };
  },
};
