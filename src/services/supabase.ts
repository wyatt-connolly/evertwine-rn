import { Platform } from "react-native";
import { supabase } from "../config/supabase.config";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

// Complete the auth session for better UX
WebBrowser.maybeCompleteAuthSession();

// User interface matching the existing MockUser structure
export interface SupabaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  phoneNumber: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
}

// Google Sign-In
export const signInWithGoogle = async (): Promise<{
  user: SupabaseUser | null;
  error: string | null;
}> => {
  try {
    console.log("🍎 Starting Google Sign-In with Supabase...");
    console.log("🔍 Platform:", Platform.OS);
    console.log("🔍 Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log(
      "🔍 Supabase Key exists:",
      !!process.env.EXPO_PUBLIC_SUPABASE_KEY
    );

    if (Platform.OS === "web") {
      console.log("🌐 Web platform detected");
      // Web: Use Supabase OAuth
      const redirectTo = `${window.location.origin}/auth/callback`;
      console.log("🔍 Web redirect URL:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });

      console.log("🔍 OAuth response data:", data);
      console.log("🔍 OAuth response error:", error);

      if (error) {
        console.error("❌ Google Sign-In error:", error);
        return { user: null, error: error.message };
      }

      // For web, we need to wait for the redirect to complete
      // The actual user will be available after the redirect
      return { user: null, error: "Redirecting to Google..." };
    } else {
      console.log("📱 Mobile platform detected");
      // Mobile: Use Supabase OAuth with Expo AuthSession
      const redirectUrl = "evertwine://auth/callback";

      console.log("🔍 Generated redirect URL:", redirectUrl);
      console.log("🔍 AuthSession.makeRedirectUri options:", {
        useProxy: true,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log("🔍 OAuth response data:", data);
      console.log("🔍 OAuth response error:", error);

      if (error) {
        console.error("❌ Google Sign-In error:", error);
        return { user: null, error: error.message };
      }

      if (data.url) {
        console.log("🔍 Opening OAuth URL:", data.url);
        console.log("🔍 Expected redirect URL:", redirectUrl);

        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log("🔍 WebBrowser result:", result);
        console.log("🔍 Result type:", result.type);
        console.log("🔍 Result URL:", result.url);

        if (result.type === "success") {
          console.log("🔍 OAuth session successful, checking session...");
          // The session should be automatically handled by Supabase
          const { data: sessionData } = await supabase.auth.getSession();

          console.log("🔍 Session data:", sessionData);
          console.log("🔍 Session user:", sessionData.session?.user);

          if (sessionData.session?.user) {
            const user = convertSupabaseUser(sessionData.session.user);
            console.log("✅ Google Sign-In successful");
            console.log("🔍 Converted user:", user);
            return { user, error: null };
          } else {
            console.log("❌ No user found in session");
          }
        } else {
          console.log("❌ OAuth session failed or cancelled");
        }

        return { user: null, error: "Google Sign-In was cancelled or failed" };
      } else {
        console.log("❌ No OAuth URL provided");
      }

      return { user: null, error: "Google Sign-In was cancelled or failed" };
    }
  } catch (error: any) {
    console.error("❌ Google Sign-In error:", error);
    return { user: null, error: `Google Sign-In failed: ${error.message}` };
  }
};

// Apple Sign-In
export const signInWithApple = async (): Promise<{
  user: SupabaseUser | null;
  error: string | null;
}> => {
  try {
    console.log("🍎 Starting Apple Sign-In with Supabase...");
    console.log("🔍 Platform:", Platform.OS);
    console.log("🔍 Supabase URL:", process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log(
      "🔍 Supabase Key exists:",
      !!process.env.EXPO_PUBLIC_SUPABASE_KEY
    );

    if (Platform.OS === "web") {
      // Web: Use Supabase OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        console.error("❌ Apple Sign-In error:", error);
        return { user: null, error: error.message };
      }

      // For web, we need to wait for the redirect to complete
      return { user: null, error: "Redirecting to Apple..." };
    } else {
      console.log("📱 Mobile platform detected");
      // Mobile: Use Supabase OAuth with Expo AuthSession
      const redirectUrl = "evertwine://auth/callback";

      console.log("🔍 Generated redirect URL:", redirectUrl);
      console.log("🔍 AuthSession.makeRedirectUri options:", {
        useProxy: true,
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "apple",
        options: {
          redirectTo: redirectUrl,
        },
      });

      console.log("🔍 OAuth response data:", data);
      console.log("🔍 OAuth response error:", error);

      if (error) {
        console.error("❌ Apple Sign-In error:", error);
        return { user: null, error: error.message };
      }

      if (data.url) {
        console.log("🔍 Opening OAuth URL:", data.url);
        console.log("🔍 Expected redirect URL:", redirectUrl);

        // Open the OAuth URL in the browser
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log("🔍 WebBrowser result:", result);
        console.log("🔍 Result type:", result.type);
        console.log("🔍 Result URL:", result.url);

        if (result.type === "success") {
          console.log("🔍 OAuth session successful, checking session...");
          // The session should be automatically handled by Supabase
          const { data: sessionData } = await supabase.auth.getSession();

          console.log("🔍 Session data:", sessionData);
          console.log("🔍 Session user:", sessionData.session?.user);

          if (sessionData.session?.user) {
            const user = convertSupabaseUser(sessionData.session.user);
            console.log("✅ Apple Sign-In successful");
            console.log("🔍 Converted user:", user);
            return { user, error: null };
          } else {
            console.log("❌ No user found in session");
          }
        } else {
          console.log("❌ OAuth session failed or cancelled");
        }
      } else {
        console.log("❌ No OAuth URL provided");
      }

      return { user: null, error: "Apple Sign-In was cancelled or failed" };
    }
  } catch (error: any) {
    console.error("❌ Apple Sign-In error:", error);
    return { user: null, error: `Apple Sign-In failed: ${error.message}` };
  }
};

// Sign Out
export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    console.log("🚪 Signing out from Supabase...");
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("❌ Sign out error:", error);
      return { error: error.message };
    }

    console.log("✅ Sign out successful");
    return { error: null };
  } catch (error: any) {
    console.error("❌ Sign out error:", error);
    return { error: `Sign out failed: ${error.message}` };
  }
};

// Auth State Listener
export const onAuthStateChanged = (
  callback: (user: SupabaseUser | null) => void
) => {
  return supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      const user = convertSupabaseUser(session.user);
      callback(user);
    } else {
      callback(null);
    }
  });
};

// Helper function to convert Supabase user to our interface
const convertSupabaseUser = (supabaseUser: any): SupabaseUser => {
  return {
    uid: supabaseUser.id,
    email: supabaseUser.email,
    displayName:
      supabaseUser.user_metadata?.full_name ||
      supabaseUser.user_metadata?.name ||
      null,
    phoneNumber: supabaseUser.phone,
    emailVerified: supabaseUser.email_confirmed_at ? true : false,
    isAnonymous: false,
    metadata: {
      creationTime: supabaseUser.created_at,
      lastSignInTime: supabaseUser.last_sign_in_at || new Date().toISOString(),
    },
  };
};

// Get current user
export const getCurrentUser = async (): Promise<SupabaseUser | null> => {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.user) {
      return convertSupabaseUser(session.user);
    }

    return null;
  } catch (error) {
    console.error("❌ Get current user error:", error);
    return null;
  }
};
