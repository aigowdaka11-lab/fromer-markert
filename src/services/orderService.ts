import { PurchaseEnquiry } from '../types';
import { initialEnquiries } from './mockData';
import { db, isFirebaseConfigured } from './firebaseConfig';
import { collection, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';

const ORDERS_STORAGE_KEY = 'fdm_enquiries_v1';

function getStoredOrders(): PurchaseEnquiry[] {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading enquiries from storage', e);
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initialEnquiries));
  return initialEnquiries;
}

function saveStoredOrders(orders: PurchaseEnquiry[]) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export const orderService = {
  async getEnquiriesForFarmer(farmerId: string): Promise<PurchaseEnquiry[]> {
    const all = getStoredOrders();
    return all
      .filter((o) => o.farmerId === farmerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getEnquiriesForBuyer(buyerId: string): Promise<PurchaseEnquiry[]> {
    const all = getStoredOrders();
    return all
      .filter((o) => o.buyerId === buyerId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async getAllEnquiries(): Promise<PurchaseEnquiry[]> {
    return getStoredOrders();
  },

  async createEnquiry(
    data: Omit<PurchaseEnquiry, 'id' | 'createdAt' | 'status'>
  ): Promise<PurchaseEnquiry> {
    const all = getStoredOrders();
    const newEnquiry: PurchaseEnquiry = {
      ...data,
      id: `enq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    all.unshift(newEnquiry);
    saveStoredOrders(all);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'orders', newEnquiry.id), newEnquiry);
      } catch (err) {
        console.warn('Firebase order sync failed:', err);
      }
    }

    return newEnquiry;
  },

  async updateStatus(
    id: string,
    status: PurchaseEnquiry['status'],
    rejectionReason?: string
  ): Promise<PurchaseEnquiry> {
    const all = getStoredOrders();
    const index = all.findIndex((o) => o.id === id);
    if (index === -1) throw new Error('Enquiry not found');

    const updated: PurchaseEnquiry = {
      ...all[index],
      status,
      ...(rejectionReason ? { rejectionReason } : {}),
    };

    all[index] = updated;
    saveStoredOrders(all);

    if (isFirebaseConfigured && db) {
      try {
        await updateDoc(doc(db, 'orders', id), {
          status,
          ...(rejectionReason ? { rejectionReason } : {}),
        });
      } catch (err) {
        console.warn('Firebase order update failed:', err);
      }
    }

    return updated;
  },
};
