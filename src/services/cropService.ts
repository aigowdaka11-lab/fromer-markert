import { CropListing } from '../types';
import { initialCropListings } from './mockData';
import { db, isFirebaseConfigured } from './firebaseConfig';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';

const CROPS_STORAGE_KEY = 'fdm_crops_v1';

function getStoredCrops(): CropListing[] {
  try {
    const raw = localStorage.getItem(CROPS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading crops from storage', e);
  }
  localStorage.setItem(CROPS_STORAGE_KEY, JSON.stringify(initialCropListings));
  return initialCropListings;
}

function saveStoredCrops(crops: CropListing[]) {
  localStorage.setItem(CROPS_STORAGE_KEY, JSON.stringify(crops));
}

export const cropService = {
  async getListings(filters?: {
    query?: string;
    category?: string;
    district?: string;
    sortBy?: 'newest' | 'priceLow' | 'priceHigh' | 'quantity';
  }): Promise<CropListing[]> {
    let crops: CropListing[] = [];

    if (isFirebaseConfigured && db) {
      try {
        const querySnapshot = await getDocs(collection(db, 'crops'));
        crops = querySnapshot.docs.map((d) => d.data() as CropListing);
        if (crops.length === 0) {
          crops = getStoredCrops();
        }
      } catch (err) {
        console.warn('Firestore fetch failed, using local store:', err);
        crops = getStoredCrops();
      }
    } else {
      crops = getStoredCrops();
    }

    // Apply client filters
    if (filters?.query) {
      const q = filters.query.toLowerCase().trim();
      crops = crops.filter(
        (c) =>
          c.cropNameEn.toLowerCase().includes(q) ||
          c.cropNameKn.toLowerCase().includes(q) ||
          c.variety.toLowerCase().includes(q) ||
          c.village.toLowerCase().includes(q) ||
          c.taluk.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.farmerName.toLowerCase().includes(q)
      );
    }

    if (filters?.category && filters.category !== 'all') {
      crops = crops.filter((c) => c.category === filters.category);
    }

    if (filters?.district && filters.district !== 'all') {
      const d = filters.district.toLowerCase();
      crops = crops.filter((c) => c.district.toLowerCase().includes(d));
    }

    if (filters?.sortBy) {
      if (filters.sortBy === 'priceLow') {
        crops.sort((a, b) => a.askingPricePerUnit - b.askingPricePerUnit);
      } else if (filters.sortBy === 'priceHigh') {
        crops.sort((a, b) => b.askingPricePerUnit - a.askingPricePerUnit);
      } else if (filters.sortBy === 'quantity') {
        crops.sort((a, b) => b.quantity - a.quantity);
      } else {
        // newest
        crops.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return crops;
  },

  async getListingById(id: string): Promise<CropListing | null> {
    const all = getStoredCrops();
    const found = all.find((c) => c.id === id);
    return found || null;
  },

  async getListingsByFarmer(farmerId: string): Promise<CropListing[]> {
    const all = getStoredCrops();
    return all.filter((c) => c.farmerId === farmerId);
  },

  async addListing(
    listingData: Omit<CropListing, 'id' | 'createdAt' | 'viewsCount' | 'enquiriesCount'>
  ): Promise<CropListing> {
    const all = getStoredCrops();
    const newCrop: CropListing = {
      ...listingData,
      id: `crop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
      enquiriesCount: 0,
    };

    all.unshift(newCrop);
    saveStoredCrops(all);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'crops', newCrop.id), newCrop);
      } catch (err) {
        console.warn('Firebase addListing sync failed:', err);
      }
    }

    return newCrop;
  },

  async updateListing(id: string, updates: Partial<CropListing>): Promise<CropListing> {
    const all = getStoredCrops();
    const idx = all.findIndex((c) => c.id === id);
    if (idx === -1) throw new Error('Listing not found');

    const updated = { ...all[idx], ...updates };
    all[idx] = updated;
    saveStoredCrops(all);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'crops', id), updates);
      } catch (err) {
        console.warn('Firebase updateListing failed:', err);
      }
    }

    return updated;
  },

  async deleteListing(id: string): Promise<void> {
    let all = getStoredCrops();
    all = all.filter((c) => c.id !== id);
    saveStoredCrops(all);

    if (isFirebaseConfigured && db) {
      try {
        await deleteDoc(doc(db, 'crops', id));
      } catch (err) {
        console.warn('Firebase deleteListing failed:', err);
      }
    }
  },

  async flagListing(id: string, isFlagged: boolean): Promise<void> {
    const all = getStoredCrops();
    const crop = all.find((c) => c.id === id);
    if (crop) {
      crop.isFlagged = isFlagged;
      saveStoredCrops(all);
    }
  },

  async incrementViews(id: string): Promise<void> {
    const all = getStoredCrops();
    const crop = all.find((c) => c.id === id);
    if (crop) {
      crop.viewsCount = (crop.viewsCount || 0) + 1;
      saveStoredCrops(all);
    }
  },
};
