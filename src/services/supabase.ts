import { supabase } from "../config/supabase.config";
import { AuthUser } from "../types";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as AuthSession from "expo-auth-session";
import { SupabaseDataService } from "./SupabaseDataService";

export class SupabaseAuthService {
  // Phone Authentication
  static async signInWithPhone(phoneNumber: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phoneNumber,
    });
    if (error) throw error;
    return data;
  }

  static async verifyPhoneOTP(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) throw error;
    return data;
  }

  // Email Authentication
  static async signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  static async signUpWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  // Session Management
  static async getCurrentUser(): Promise<AuthUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    return {
      uid: user.id,
      email: user.email,
      phoneNumber: user.phone,
      displayName: user.user_metadata?.displayName,
      photoURL: user.user_metadata?.photoURL,
      onboardingComplete: user.user_metadata?.onboardingComplete,
      interests: user.user_metadata?.interests,
      location: user.user_metadata?.location,
      bio: user.user_metadata?.bio,
    };
  }

  static async updateUserMetadata(updates: Partial<AuthUser>) {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    });
    if (error) throw error;
    return data;
  }

  static async signOut() {
    try {
      console.log("🚪 Signing out from Supabase...");
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      console.log("✅ Successfully signed out from Supabase");
    } catch (error) {
      console.error("❌ Error signing out:", error);
      throw error;
    }
  }

  // Clear browser session to allow account switching
  static async clearBrowserSession() {
    try {
      console.log("🧹 Clearing browser session...");
      // Clear any cached browser sessions with timeout
      await Promise.race([
        WebBrowser.dismissBrowser(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000)
        ),
      ]);
      console.log("✅ Browser session cleared");
    } catch (error) {
      console.log(
        "⚠️ Browser session clear timeout or error (non-critical):",
        error
      );
      // Don't throw - this is not critical
    }
  }

  // OAuth Authentication
  static async signInWithGoogle() {
    try {
      console.log("🚀 Starting Google OAuth...");

      // Use the standard OAuth flow without skipBrowserRedirect
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: "evertwine://auth/callback",
          queryParams: {
            prompt: "select_account", // Force account selection
          },
        },
      });

      if (error) {
        console.error("❌ Google OAuth error:", error);
        throw new Error(`Google OAuth not configured: ${error.message}`);
      }

      if (!data?.url) {
        console.error("❌ No OAuth URL received");
        throw new Error(
          "Google OAuth provider not configured in Supabase dashboard"
        );
      }

      console.log("✅ OAuth URL generated:", data.url);

      // Open the URL in the browser - Supabase will handle the redirect automatically
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        "evertwine://auth/callback"
      );

      console.log("🔙 OAuth result:", result);

      // Process the OAuth callback URL to set the session
      if (result.type === "success" && result.url) {
        console.log("🔄 Processing OAuth callback URL...");

        // Extract the URL fragment (everything after #)
        const urlFragment = result.url.split("#")[1];
        if (urlFragment) {
          console.log("🔑 Setting session with access token...");

          // Parse the URL fragment to extract tokens
          const params = new URLSearchParams(urlFragment);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          if (accessToken && refreshToken) {
            // Set the session manually
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) {
              console.error("❌ Error setting session:", sessionError);
              throw new Error(`Failed to set session: ${sessionError.message}`);
            }

            console.log("✅ Session set successfully:", !!sessionData.session);
          } else {
            console.error("❌ Missing tokens in OAuth callback");
            throw new Error(
              "Missing access or refresh token in OAuth callback"
            );
          }
        } else {
          console.error("❌ No URL fragment in OAuth callback");
          throw new Error("No URL fragment in OAuth callback");
        }
      }

      return result;
    } catch (error) {
      console.error("❌ Google sign-in error:", error);
      throw error;
    }
  }

  // Ensure user exists in database after OAuth
  static async ensureUserExists(authUser: any) {
    if (!authUser) return;

    try {
      console.log("🔍 Checking if user exists in database:", authUser.uid);

      // Check if user already exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("uid", authUser.uid)
        .single();

      if (existingUser) {
        console.log("✅ User already exists in database");
        return existingUser;
      }

      // Create new user record with OAuth data
      console.log("📝 Creating new user record with OAuth data");
      const userData = {
        uid: authUser.uid,
        email: authUser.email,
        displayName:
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          "New User",
        // Required fields with minimal defaults (will be updated during onboarding)
        age: 0, // Placeholder - user will set real age during onboarding
        gender: "", // Empty - user will set during onboarding
        pronouns: "", // Empty - user will set during onboarding
        bio: "", // Empty - user will set during onboarding
        about: "", // Empty - user will set during onboarding
        profilePictures:
          authUser.user_metadata?.avatar_url || authUser.user_metadata?.picture
            ? [
                authUser.user_metadata?.avatar_url ||
                  authUser.user_metadata?.picture,
              ]
            : [],
        standoutPhotoIndex: 0,
        location: { latitude: 0, longitude: 0 }, // Placeholder - user will set real location
        locationName: "", // Empty - user will set during onboarding
        phoneNumber: "", // Empty - user will set during onboarding
        school: "", // Empty - user will set during onboarding
        jobTitle: "", // Empty - user will set during onboarding
        jobCompany: "", // Empty - user will set during onboarding
        professionalLevel: "", // Empty - user will set during onboarding
        hometown: "", // Empty - user will set during onboarding
        starSign: "", // Empty - user will set during onboarding
        hobbies: [], // Empty - user will set during onboarding
        interests: [], // Empty - user will set during onboarding
        lookingFor: [], // Empty - user will set during onboarding
        onboardingComplete: false,
        isVerified: "pending",
        isPaused: false,
        lastActive: new Date(),
        verifiedAt: undefined,
        profileViews: 0,
        uniqueViewers: 0,
        viewsThisWeek: 0,
        averageViewDuration: 0,
        preferences: undefined,
        createdTime: new Date(),
        updatedTime: new Date(),
      };

      const newUser = await SupabaseDataService.createUser(userData);

      console.log("✅ New user created:", authUser.id);
      return newUser;
    } catch (error) {
      console.error("❌ Error in ensureUserExists:", error);
      throw error;
    }
  }

  static async signInWithApple() {
    const redirectUrl =
      "https://lqrumkrfmhrstcjfloty.supabase.co/auth/v1/callback";
    console.log("🔗 Redirect URL:", redirectUrl);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: false,
      },
    });

    if (error) {
      console.error("Apple OAuth error:", error);
      throw new Error(`Apple OAuth not configured: ${error.message}`);
    }

    // Check if we got a valid URL
    if (!data?.url) {
      throw new Error(
        "Apple OAuth provider not configured in Supabase dashboard"
      );
    }

    // Validate URL is not localhost (indicates misconfiguration)
    if (data.url.includes("localhost") || data.url.includes("127.0.0.1")) {
      throw new Error(
        "OAuth provider not properly configured. Please set up Apple OAuth in Supabase dashboard."
      );
    }

    // Open the OAuth URL in a browser
    console.log("🌐 Opening OAuth URL:", data.url);
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
    console.log("🔙 OAuth result:", result);

    // Handle session if successful
    if (result.type === "success" && result.url) {
      console.log("🔄 Processing Apple OAuth callback URL...");

      // Extract the URL fragment (everything after #)
      const urlFragment = result.url.split("#")[1];
      if (urlFragment) {
        // Parse the URL parameters
        const params = new URLSearchParams(urlFragment);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          console.log("🔑 Setting session with access token...");
          // Set the session manually
          const { data: sessionData, error: sessionError } =
            await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken || "",
            });

          if (sessionError) {
            console.error("❌ Error setting session:", sessionError);
            throw sessionError;
          }

          console.log("✅ Session set successfully:", !!sessionData.session);

          // Check if user exists in database and create if needed
          await this.ensureUserExists(sessionData.session?.user);
        }
      }
    }

    return result;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        callback({
          uid: session.user.id,
          email: session.user.email,
          phoneNumber: session.user.phone,
          displayName: session.user.user_metadata?.displayName,
          photoURL: session.user.user_metadata?.photoURL,
          onboardingComplete: session.user.user_metadata?.onboardingComplete,
          interests: session.user.user_metadata?.interests,
          location: session.user.user_metadata?.location,
          bio: session.user.user_metadata?.bio,
        });
      } else {
        callback(null);
      }
    });
  }

  // Account Deletion
  static async deleteAccount(): Promise<{ success: boolean; error?: any }> {
    try {
      console.log("🗑️ Deleting user account from Supabase Auth...");

      // Get current user to get their ID
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError) {
        console.error("Error getting current user for deletion:", getUserError);
        return { success: false, error: getUserError };
      }

      if (!user) {
        console.error("No user found to delete");
        return { success: false, error: new Error("No user found") };
      }

      // For now, we'll just sign out the user since we can't delete from auth on client side
      // In a production app, you would call an Edge Function with service role key
      console.log(
        "⚠️ Note: Auth account deletion requires server-side implementation"
      );
      console.log("📝 User will be signed out instead");

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        console.error("Error signing out user:", signOutError);
        return { success: false, error: signOutError };
      }

      console.log("✅ User signed out successfully");
      return { success: true };
    } catch (error) {
      console.error("Error in deleteAccount:", error);
      return { success: false, error };
    }
  }
}
