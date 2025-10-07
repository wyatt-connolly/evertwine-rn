import { Linking } from "react-native";

// Deep link handler for OAuth redirects
export const handleDeepLink = (url: string) => {
  console.log("🔗 Deep link received:", url);

  if (url.includes("evertwine://auth/callback")) {
    console.log("✅ OAuth callback received");
    // The Supabase client should automatically handle this
    return true;
  }

  return false;
};

// Initialize deep link handling
export const initializeDeepLinking = () => {
  // Handle initial URL if app was opened via deep link
  Linking.getInitialURL().then((url) => {
    if (url) {
      console.log("🔗 Initial deep link:", url);
      handleDeepLink(url);
    }
  });

  // Handle deep links while app is running
  const subscription = Linking.addEventListener("url", (event) => {
    console.log("🔗 Deep link event:", event.url);
    handleDeepLink(event.url);
  });

  return subscription;
};
