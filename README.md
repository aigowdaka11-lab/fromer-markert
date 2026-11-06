# FARMER DIRECT MARKET (ರೈತ ನೇರ ಮಾರುಕಟ್ಟೆ)

A production-grade, direct agricultural marketplace connecting Karnataka farmers directly with hotels, wholesale merchants, retailers, and consumers without middlemen or commission brokers.

---

## 🌟 Key Features

1. **Bilingual by Default (Kannada & English)**:
   - Default language is **Kannada (ಕನ್ನಡ)** with instant toggle to English.
   - Domain-authentic agricultural terminology (e.g. ರಾಗಿ, ಕಬ್ಬು, ಬೆಲ್ಲ, ಎಳನೀರು, ಟೊಮೇಟೊ; ಕ್ವಿಂಟಾಲ್, ಕೆಜಿ, ಟನ್; ಕನಿಷ್ಠ ದರ, ಮಾದರಿ ದರ, ಗರಿಷ್ಠ ದರ).

2. **Role-Based Architecture**:
   - **Farmer (ರೈತ)**: Add crops with real photographs, set asking price per unit (₹), manage inventory, view incoming purchase orders, accept/reject requests, and track direct bank trade revenue.
   - **Buyer (ಖರೀದಿದಾರ)**: Browse crops across Karnataka districts (Mandya, Maddur, Hassan, Mysuru, Ramanagara), compare prices against APMC benchmarks, negotiate purchase requests, contact farmers directly via Phone/WhatsApp, and track deliveries.
   - **Administrator (ಆಡಳಿತಾಧಿಕಾರಿ)**: Moderate listings, flag/remove fraudulent lots, verify farmers, manage complaints/disputes, and review platform analytics.

3. **APMC Mandi Price Transparency**:
   - Daily wholesale benchmark bulletin based on AGMARKNET and Karnataka State Agricultural Marketing Board (KSAMB) market data.
   - Shows Minimum, Maximum, and Modal prices per quintal.
   - Interactive **Middleman Elimination Savings Calculator** displaying exact income retained by bypassing commission agents (typically 8.5%–12%).

4. **Geographic Farm Locator (Google Maps)**:
   - Interactive Karnataka district agricultural cluster map (Mandya, Maddur, Hassan, Mysuru, Ramanagara).
   - Farm gate coordinates with one-click Google Maps driving navigation for transport vehicles.
   - Optional custom Google Maps API key support (works out of the box without paid keys).

5. **Firebase Integration & Resilient Demo Mode**:
   - Works immediately in **Demo Mode** with persistent browser storage so you can test all features without API keys.
   - Plugs directly into live Firebase Auth, Cloud Firestore, and Firebase Storage when credentials are provided in `.env`.

6. **Capacitor-Ready Android Architecture**:
   - Fully optimized for compilation into native Android APK / AAB packages using `@capacitor/android`.

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
# http://localhost:3000
```

---

## 🔥 Firebase Configuration & Setup

To connect your own Google Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the Firebase project settings, click **Add app** and select **Web (`</>`)**.
3. Enable **Authentication** (Email/Password or Phone provider).
4. Enable **Cloud Firestore** in production mode.
5. In your project root, create a `.env` file (or set environment variables in your deployment host):

```env
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"

# Optional: Google Maps Platform API Key
VITE_GOOGLE_MAPS_API_KEY=""
```

6. Deploy the included Firestore Security Rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🔒 Firestore Security Rules (`firestore.rules`)

The project includes production-ready Role-Based Access Control (RBAC) rules in `/firestore.rules`:
- `users/{uid}`: Authenticated self-ownership. Users can update only their own profile.
- `crops/{cropId}`: Publicly readable; create/update/delete restricted to the verified owning farmer or admin.
- `orders/{orderId}`: Private to the buyer who created it and the recipient farmer.
- `mandiPrices/{id}`: Publicly readable; editable strictly by administrators.

---

## 📱 Android Packaging with Capacitor

To build an Android APK:

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Build the web app
npm run build

# 3. Initialize and add Android platform
npx cap add android

# 4. Sync web assets with native Android project
npx cap sync android

# 5. Open in Android Studio to build APK or run on connected device
npx cap open android
```

---

## ☁️ Deployment to Vercel

1. Push your repository to **GitHub**.
2. Go to [Vercel Dashboard](https://vercel.com/) and click **New Project**.
3. Select your GitHub repository.
4. Framework preset will automatically be detected as **Vite**.
5. Under **Environment Variables**, paste the `VITE_FIREBASE_*` variables from your `.env`.
6. Click **Deploy**.
