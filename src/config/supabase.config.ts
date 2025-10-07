import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Supabase configuration
const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  "https://lqrumkrfmhrstcjfloty.supabase.co";
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_KEY || "your-publishable-key";

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth for Expo
    storage: Platform.OS === "web" ? undefined : undefined, // Will use AsyncStorage by default
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === "web",
    flowType: "pkce",
  },
});

// Export configuration for external use
export const supabaseConfig = {
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
};
