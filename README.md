# SkylARk - Location-Based AR Coin Collection App

A mobile-first React application where users collect virtual coins on an interactive 3D map. Built with Vite, React, TypeScript, Google Maps, deck.gl, and Firebase.

## Features

- 📱 **Phone Authentication** - Secure OTP-based login
- 🗺️ **3D Map View** - Interactive Google Maps with 3D buildings
- 🪙 **Coin Collection** - Collect coins scattered across your location
- 📍 **Real-time Location** - GPS tracking for coin proximity
- 🎨 **Beautiful UI** - Dark theme with smooth animations
- 🔥 **Firebase Backend** - Real-time database and authentication

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Google Maps API key with Maps JavaScript API enabled
- A Firebase project with:
  - Phone Authentication enabled
  - Firestore database created

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then edit `.env` and add your API keys:

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Phone Authentication**:
   - Go to Authentication → Sign-in method
   - Enable Phone provider
4. Create **Firestore Database**:
   - Go to Firestore Database
   - Create database in production mode
5. Add your domain to authorized domains (for development: `localhost`)

### 4. Google Maps Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the following APIs:
   - Maps JavaScript API
   - Places API (optional)
3. Create an API key and restrict it to your domain
4. Add the key to your `.env` file

### 5. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 6. Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
skylark/
├── src/
│   ├── components/
│   │   ├── auth/           # Authentication screens
│   │   ├── map/            # Map and coin components
│   │   ├── navigation/     # Top bar and bottom nav
│   │   └── ui/             # Reusable UI components
│   ├── hooks/              # Custom React hooks
│   ├── services/           # Firebase and API services
│   ├── store/              # Zustand state management
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
└── public/                 # Static assets
```

## Key Technologies

- **Vite** - Fast build tool and dev server
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Google Maps API** - Map rendering
- **deck.gl** - 3D overlay visualization
- **Firebase** - Authentication and database
- **Zustand** - State management
- **React Router** - Client-side routing

## Usage

1. **Launch App** - Opens with confetti loading screen
2. **Enter Phone** - Input your phone number (+1 format)
3. **Verify OTP** - Enter the 6-digit code sent via SMS
4. **Explore Map** - See 3D map with your location and nearby coins
5. **Collect Coins** - Tap coins on the map to collect them
6. **Track Score** - View your coin count in the top bar

## Features to Implement

- [ ] AR camera mode for collecting coins
- [ ] Multiplayer features
- [ ] Achievements and leaderboards
- [ ] Different coin types and rarities
- [ ] Shop for items using coins
- [ ] Social features (friends, teams)

## Troubleshooting

### Location Not Working
- Ensure you've granted location permissions
- Check if HTTPS is enabled (required for geolocation)

### Firebase Auth Errors
- Verify phone authentication is enabled in Firebase
- Check if your domain is in authorized domains list
- Ensure reCAPTCHA is properly configured

### Map Not Loading
- Verify Google Maps API key is correct
- Check if Maps JavaScript API is enabled
- Look for console errors related to API restrictions

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

MIT

## Contact

For questions or support, please open an issue on GitHub.
