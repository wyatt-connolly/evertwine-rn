# Evertwine - Social Meetup Mobile App

A beautiful, modern social meetup app built with React Native, Expo, and Firebase. Connect with people in your area through shared interests and activities.

## ✨ Features

### 🔐 Authentication

- **Phone Number Verification** - Secure SMS-based authentication
- **Apple Sign-In** - Native iOS authentication
- **Google Sign-In** - Google OAuth integration
- **Firebase Authentication** - Secure user management

### 🎨 User Experience

- **Dark/Light Theme** - Beautiful theming with user preference
- **Animated Onboarding** - Smooth, engaging user introduction
- **Gradient Backgrounds** - Modern visual design
- **Responsive Design** - Optimized for all screen sizes

### 👤 Profile Management

- **Profile Creation** - Display name, bio, and photo upload
- **Interest Selection** - Choose from curated interest categories
- **Location Services** - Enable location-based meetups
- **Profile Editing** - Update your information anytime

### 🏠 Main App

- **Home Feed** - Discover nearby meetups and events
- **Explore** - Browse events by category and location
- **Messages** - Connect with other users
- **Profile** - Manage your account and settings

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator
- Firebase project setup

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/wyatt-connolly/evertwine-rn.git
   cd evertwine-rn
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm start
   ```

4. **Run on your preferred platform:**
   ```bash
   npm run ios     # iOS Simulator
   npm run android # Android Emulator
   npm run web     # Web browser
   ```

## 🔧 Configuration

### Firebase Setup

The app uses Firebase for authentication, database, and storage:

- **Project ID:** `evertwine-qm8y7p`
- **Auth Domain:** `evertwine-qm8y7p.firebaseapp.com`
- **Storage Bucket:** `evertwine-qm8y7p.appspot.com`

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=evertwine-qm8y7p.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=evertwine-qm8y7p
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=evertwine-qm8y7p.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AnimatedButton.tsx
│   ├── AnimatedCard.tsx
│   ├── AnimatedLogo.tsx
│   ├── GradientBackground.tsx
│   └── Logo.tsx
├── screens/            # Screen components
│   ├── auth/           # Authentication screens
│   ├── main/           # Main app screens
│   └── onboarding/     # Onboarding flow screens
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── MainTabs.tsx
│   └── OnboardingStack.tsx
├── hooks/              # Custom React hooks
│   ├── useAuthStore.ts
│   └── useThemeStore.ts
├── services/           # API and business logic
│   └── firebase.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Utility functions
```

## 🎨 Design System

### Theme Colors

- **Light Mode:** Clean, modern light theme
- **Dark Mode:** Beautiful dark theme with proper contrast
- **Gradients:** Blue gradient system for onboarding
- **Animations:** Smooth transitions and micro-interactions

### Components

- **AnimatedButton** - Interactive buttons with press feedback
- **AnimatedCard** - Cards with slide-in animations
- **GradientBackground** - Beautiful gradient backgrounds
- **AnimatedLogo** - Rotating logo with pulse effect

## 🔄 Development Workflow

### Branch Strategy

- **main** - Production-ready code
- **develop** - Integration branch for features

### Getting Started with Development

1. Create a feature branch from `develop`
2. Make your changes
3. Test thoroughly
4. Create a pull request to `develop`
5. After review, merge to `develop`
6. Deploy from `main` branch

## 🧪 Testing

### Firebase Testing

The app includes a comprehensive Firebase test screen:

- Connection status verification
- Authentication testing
- Firestore operations
- Storage functionality

### Manual Testing

1. **Onboarding Flow:**

   - Phone verification (use any 6-digit code in development)
   - Profile setup with photo upload
   - Interest selection
   - Location permission

2. **Authentication:**

   - Phone number sign-in
   - Apple/Google sign-in (simulated in Expo Go)
   - Profile persistence

3. **Theme System:**
   - Dark/light mode toggle
   - Theme persistence
   - Consistent theming across screens

## 🚀 Deployment

### Expo Build

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android
```

### App Store Deployment

1. Build production version
2. Submit to App Store Connect
3. Configure app metadata
4. Submit for review

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo** - Amazing React Native development platform
- **Firebase** - Backend-as-a-Service for authentication and data
- **React Navigation** - Navigation library for React Native
- **Zustand** - Lightweight state management
- **Ionicons** - Beautiful icon library

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the documentation
- Review the troubleshooting section

---

**Built with ❤️ using React Native, Expo, and Firebase**
