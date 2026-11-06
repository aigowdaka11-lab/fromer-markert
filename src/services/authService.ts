import { UserProfile, UserRole } from '../types';
import { initialAdmin, initialBuyers, initialFarmers } from './mockData';
import { auth, db, isFirebaseConfigured } from './firebaseConfig';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const STORAGE_KEY = 'fdm_current_user_v1';
const ALL_USERS_KEY = 'fdm_all_users_v1';

// Seed or retrieve local users
function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(ALL_USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read users from localStorage', e);
  }
  const defaultList: UserProfile[] = [...initialFarmers, ...initialBuyers, initialAdmin];
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(defaultList));
  return defaultList;
}

function saveStoredUsers(users: UserProfile[]) {
  localStorage.setItem(ALL_USERS_KEY, JSON.stringify(users));
}

let currentUser: UserProfile | null = (() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.error('Failed to load user', e);
  }
  // Default to first farmer Kempegowda for instant interactive preview
  return initialFarmers[0];
})();

const listeners: Array<(user: UserProfile | null) => void> = [];

function notifyListeners() {
  listeners.forEach((fn) => fn(currentUser));
}

// Sync with Firebase Auth if configured
if (isFirebaseConfigured && auth) {
  onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
    if (fbUser && db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          currentUser = userDoc.data() as UserProfile;
        } else {
          // Fallback profile from Firebase user
          currentUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Kisan User',
            phone: fbUser.phoneNumber || '+91 98765 43210',
            email: fbUser.email || 'user@example.com',
            role: 'farmer',
            district: 'Mandya',
            taluk: 'Maddur',
            village: 'Maddur Town',
            isVerified: true,
            joinedDate: new Date().toISOString().split('T')[0],
          };
        }
      } catch (e) {
        console.warn('Could not fetch user profile from Firestore:', e);
      }
    } else if (!fbUser && isFirebaseConfigured) {
      currentUser = null;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
  });
}

export const authService = {
  getCurrentUser(): UserProfile | null {
    return currentUser;
  },

  subscribe(callback: (user: UserProfile | null) => void): () => void {
    listeners.push(callback);
    callback(currentUser);
    return () => {
      const idx = listeners.indexOf(callback);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  async loginWithDemoAccount(role: UserRole, specificId?: string): Promise<UserProfile> {
    const all = getStoredUsers();
    let target: UserProfile | undefined;

    if (specificId) {
      target = all.find((u) => u.id === specificId);
    }
    if (!target) {
      if (role === 'farmer') target = all.find((u) => u.role === 'farmer') || initialFarmers[0];
      else if (role === 'buyer') target = all.find((u) => u.role === 'buyer') || initialBuyers[0];
      else target = initialAdmin;
    }

    currentUser = target;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
    return currentUser;
  },

  async login(emailOrPhone: string, role: UserRole): Promise<UserProfile> {
    const all = getStoredUsers();
    const clean = emailOrPhone.trim().toLowerCase();
    let found = all.find(
      (u) =>
        u.email.toLowerCase() === clean ||
        u.phone.replace(/\s+/g, '') === clean.replace(/\s+/g, '')
    );

    if (!found) {
      // Auto-create friendly profile for test
      found = {
        id: `user-${Date.now()}`,
        name: emailOrPhone.includes('@') ? emailOrPhone.split('@')[0] : `ಕಿಸಾನ್ ${emailOrPhone.slice(-4)}`,
        phone: emailOrPhone.includes('@') ? '+91 98450 12345' : emailOrPhone,
        email: emailOrPhone.includes('@') ? emailOrPhone : `user_${Date.now()}@kisan.in`,
        role,
        district: 'Mandya (ಮಂಡ್ಯ)',
        taluk: 'Maddur (ಮದ್ದೂರು)',
        village: 'Maddur Rural',
        isVerified: true,
        joinedDate: new Date().toISOString().split('T')[0],
      };
      all.push(found);
      saveStoredUsers(all);
    }

    currentUser = found;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
    return currentUser;
  },

  async register(profileData: Omit<UserProfile, 'id' | 'joinedDate' | 'isVerified'>): Promise<UserProfile> {
    const all = getStoredUsers();
    const newProfile: UserProfile = {
      ...profileData,
      id: `user-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0],
      isVerified: profileData.role === 'admin' ? true : false,
    };

    all.push(newProfile);
    saveStoredUsers(all);

    // Save to Firebase Firestore if connected
    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', newProfile.id), newProfile);
      } catch (err) {
        console.warn('Firebase registration sync failed:', err);
      }
    }

    currentUser = newProfile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
    return newProfile;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!currentUser) throw new Error('No user logged in');
    const updated = { ...currentUser, ...updates };
    currentUser = updated;

    const all = getStoredUsers();
    const index = all.findIndex((u) => u.id === updated.id);
    if (index !== -1) {
      all[index] = updated;
      saveStoredUsers(all);
    }

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, 'users', updated.id), updated, { merge: true });
      } catch (err) {
        console.warn('Firebase update failed:', err);
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
    return updated;
  },

  async logout(): Promise<void> {
    if (isFirebaseConfigured && auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.warn('Firebase signout warning:', err);
      }
    }
    currentUser = null;
    localStorage.removeItem(STORAGE_KEY);
    notifyListeners();
  },

  getAllUsers(): UserProfile[] {
    return getStoredUsers();
  },

  verifyUser(userId: string): void {
    const all = getStoredUsers();
    const user = all.find((u) => u.id === userId);
    if (user) {
      user.isVerified = true;
      saveStoredUsers(all);
      if (currentUser?.id === userId) {
        currentUser.isVerified = true;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
      }
      notifyListeners();
    }
  },
};
