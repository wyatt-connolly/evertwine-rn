// Authentication Configuration
// Configured with your Firebase project details

export const AUTH_CONFIG = {
  // Google Sign-In Configuration
  GOOGLE_WEB_CLIENT_ID:
    "177107134327-vo2ga4qjrn04ogrkbdrp2glm39nj2ef3.apps.googleusercontent.com",
  GOOGLE_ANDROID_CLIENT_ID:
    "177107134327-0r6hcloucgrbk1b7bc2jg47tur5jchmd.apps.googleusercontent.com",
  GOOGLE_IOS_CLIENT_ID:
    "177107134327-am6pukb2m0khkoh5kq8edeii43ih1sl8.apps.googleusercontent.com",
  GOOGLE_REVERSED_CLIENT_ID:
    "com.googleusercontent.apps.177107134327-6cfvuapn3sp7joap5um3o73773gk0vkb",

  // Apple Sign-In Configuration
  APPLE_SERVICE_ID: "YOUR_APPLE_SERVICE_ID", // Configure in Apple Developer Console
  APPLE_TEAM_ID: "YOUR_APPLE_TEAM_ID", // Your Apple Developer Team ID

  // Firebase Configuration
  FIREBASE_PROJECT_ID: "evertwine-qm8y7p",
  FIREBASE_PROJECT_NUMBER: "177107134327",
  FIREBASE_AUTH_DOMAIN: "evertwine-qm8y7p.firebaseapp.com",

  // App Configuration
  ANDROID_PACKAGE_NAME: "com.mycompany.evertwinedraft",
  IOS_BUNDLE_ID: "com.mycompany.evertwinedraft",
};

// ✅ CONFIGURATION COMPLETE
//
// Google Sign-In: ✅ CONFIGURED
// - Web Client ID: 177107134327-vo2ga4qjrn04ogrkbdrp2glm39nj2ef3.apps.googleusercontent.com
// - Android Client ID: 177107134327-0r6hcloucgrbk1b7bc2jg47tur5jchmd.apps.googleusercontent.com
// - iOS Client ID: 177107134327-am6pukb2m0khkoh5kq8edeii43ih1sl8.apps.googleusercontent.com
// - Reversed Client ID: com.googleusercontent.apps.177107134327-6cfvuapn3sp7joap5um3o73773gk0vkb
//
// Apple Sign-In: ⚠️ REQUIRES APPLE DEVELOPER CONSOLE SETUP
// - Bundle ID: com.mycompany.evertwinedraft
// - You need to configure Service ID and Team ID in Apple Developer Console
// - Update APPLE_SERVICE_ID and APPLE_TEAM_ID above when configured
//
// Firebase Project: ✅ CONFIGURED
// - Project ID: evertwine-qm8y7p
// - Project Number: 177107134327
// - Auth Domain: evertwine-qm8y7p.firebaseapp.com
//
// Files Present: ✅
// - android/app/google-services.json
// - ios/Runner/GoogleService-Info.plist
// - ios/Runner.entitlements (Apple Sign-In capability)
