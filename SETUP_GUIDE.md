# SkylARk Setup Guide

## Quick Start

Your SkylARk location-based AR coin collection app has been successfully created! Follow these steps to get started.

## ✅ What's Been Built

The app is fully implemented with:
- Phone authentication (OTP verification)
- Loading screen with confetti animation
- Interactive 3D map with Google Maps
- Coin generation and collection system
- Geolocation tracking
- Navigation UI (top bar & bottom nav)
- State management with Zustand
- Firebase backend integration

## 🚀 Next Steps

### 1. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Phone Authentication**:
   - Navigate to Authentication → Sign-in method
   - Enable "Phone" provider
   - Add test phone numbers if needed
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Click "Create Database"
   - Start in production mode
   - Choose your region
5. Get your Firebase config:
   - Project Settings → General → Your apps
   - Add a web app if not already added
   - Copy the firebaseConfig object

### 2. Set Up Google Maps

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - (Optional) Places API
4. Create credentials:
   - APIs & Services → Credentials
   - Create API Key
   - Restrict by HTTP referrers (add localhost for development)
5. Copy your API key

### 3. Configure Environment

Create a `.env` file in the skylark directory:

```bash
cd /Users/joelewis/PheonixAR/skylark
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSy...

# Firebase
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Run the App

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

## 📱 Testing the App

### Flow:
1. **Loading Screen** - Shows confetti for 3 seconds
2. **Phone Input** - Enter your 10-digit phone number
3. **OTP Verification** - Enter the 6-digit code sent via SMS
4. **Map View** - See your location and collect coins!

### For Development Testing:
- Use Firebase test phone numbers to avoid SMS costs
- In Firebase Console → Authentication → Sign-in method → Phone
- Add test phone numbers like: `+1 555-0100` with code `123456`

## 🏗️ Project Structure

```
skylark/
├── src/
│   ├── components/
│   │   ├── auth/              # LoadingScreen, PhoneInput, OTPVerification
│   │   ├── map/               # MapView, CoinOverlay
│   │   ├── navigation/        # TopBar, BottomNav
│   │   └── ui/                # Button, NumberPad
│   ├── hooks/                 # useAuth, useCoins, useGeolocation
│   ├── services/              # firebase, coinService
│   ├── store/                 # authStore, gameStore (Zustand)
│   ├── types/                 # TypeScript interfaces
│   └── utils/                 # coinGenerator
```

## 🔧 Common Issues

### "Location not available"
- Make sure you're using HTTPS (localhost is OK)
- Grant location permissions when prompted
- Check browser console for geolocation errors

### "Failed to send OTP"
- Verify Firebase Phone Auth is enabled
- Check Firebase quota limits
- Ensure domain is in authorized domains
- Try using a test phone number first

### "Map not loading"
- Verify Google Maps API key is correct
- Check if Maps JavaScript API is enabled
- Look for quota/billing issues in Google Cloud Console

### Build errors
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules and reinstall if needed
- Check that .env file has all required variables

## 🎯 Features to Add Next

Now that the foundation is built, consider adding:

1. **AR Camera Mode** - Use WebXR or switch to React Native
2. **Animations** - Add coin collection animations
3. **Sounds** - Audio feedback for collecting coins
4. **Multiplayer** - See other players on the map
5. **Achievements** - Unlock badges and rewards
6. **Shop System** - Spend coins on items
7. **Different Coin Types** - Rare coins worth more
8. **Time-based Events** - Special coins at certain times
9. **Leaderboard** - Compete with friends
10. **PWA Features** - Install on mobile home screen

## 📚 Documentation

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)
- [deck.gl](https://deck.gl/)
- [Firebase](https://firebase.google.com/docs)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🐛 Debugging Tips

```bash
# Check build output
npm run build

# Preview production build
npm run preview

# Check TypeScript errors
npx tsc --noEmit

# Lint code
npm run lint
```

## 💡 Development Tips

- Use React DevTools for debugging
- Monitor Firebase Console for auth/database activity
- Check browser console for geolocation/map errors
- Test on mobile device for best experience (use ngrok or similar)

---

**Ready to go!** Just add your API keys to `.env` and run `npm run dev`
