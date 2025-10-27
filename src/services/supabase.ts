import { supabase } from "../config/supabase.config";
import { AuthUser } from "../types";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import * as AuthSession from "expo-auth-session";
import * as AppleAuthentication from "expo-apple-authentication";
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  // Clear browser session to allow account switching
  static async clearBrowserSession() {
    try {
      // Clear any cached browser sessions with timeout
      await Promise.race([
        WebBrowser.dismissBrowser(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2000)
        ),
      ]);
    } catch (error) {
      // Don't throw - this is not critical
    }
  }

  // OAuth Authentication
  static async signInWithGoogle() {
    try {
      console.log("🔵 [Google Sign In] Starting Google OAuth flow...");

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

      console.log("🔵 [Google Sign In] OAuth request result:", { data, error });

      if (error) {
        console.error("🔴 [Google Sign In] OAuth error:", error);
        throw new Error(`Google OAuth not configured: ${error.message}`);
      }

      if (!data?.url) {
        console.error("🔴 [Google Sign In] No OAuth URL received");
        throw new Error(
          "Google OAuth provider not configured in Supabase dashboard"
        );
      }

      console.log("🔵 [Google Sign In] Opening browser with URL:", data.url);

      // Open the URL in the browser - Supabase will handle the redirect automatically
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        "evertwine://auth/callback"
      );

      console.log("🔵 [Google Sign In] Browser session result:", result);

      // Process the OAuth callback URL to set the session
      if (result.type === "success" && result.url) {
        console.log(
          "🔵 [Google Sign In] Processing successful callback URL:",
          result.url
        );

        // Extract the URL fragment (everything after #)
        const urlFragment = result.url.split("#")[1];
        console.log("🔵 [Google Sign In] URL fragment:", urlFragment);

        if (urlFragment) {
          // Parse the URL fragment to extract tokens
          const params = new URLSearchParams(urlFragment);
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");

          console.log("🔵 [Google Sign In] Extracted tokens:", {
            hasAccessToken: !!accessToken,
            hasRefreshToken: !!refreshToken,
          });

          if (accessToken && refreshToken) {
            console.log("🔵 [Google Sign In] Setting session with tokens...");

            // Set the session manually
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            console.log("🔵 [Google Sign In] Session set result:", {
              sessionData,
              sessionError,
            });

            if (sessionError) {
              console.error("🔴 [Google Sign In] Session error:", sessionError);
              throw new Error(`Failed to set session: ${sessionError.message}`);
            }

            console.log(
              "✅ [Google Sign In] Successfully authenticated with Google"
            );
          } else {
            console.error("🔴 [Google Sign In] Missing tokens in callback");
            throw new Error(
              "Missing access or refresh token in OAuth callback"
            );
          }
        } else {
          console.error("🔴 [Google Sign In] No URL fragment in callback");
          throw new Error("No URL fragment in OAuth callback");
        }
      } else {
        console.log(
          "🔵 [Google Sign In] Browser session result type:",
          result.type
        );
        if (result.type === "cancel") {
          console.log("🟡 [Google Sign In] User cancelled authentication");
        } else {
          console.log("🔵 [Google Sign In] Other result type:", result);
        }
      }

      return result;
    } catch (error) {
      console.error("🔴 [Google Sign In] Error in signInWithGoogle:", error);
      throw error;
    }
  }

  // Ensure user exists in database after OAuth
  static async ensureUserExists(authUser: any) {
    if (!authUser) return;

    try {
      // Check if user already exists in database
      const { data: existingUser, error: fetchError } = await supabase
        .from("users")
        .select("*")
        .eq("uid", authUser.uid)
        .single();

      if (existingUser) {
        return existingUser;
      }

      // Create new user record with OAuth data

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
        notificationPreferences: {
          meetup_invites: true,
          meetup_reminders: true,
          meetup_updates: true,
          meetup_cancelled: true,
          new_messages: true,
          message_replies: true,
          new_followers: true,
          profile_views: false,
          friend_requests: true,
          profile_likes: false,
          app_updates: true,
          promotions: false,
          verification_updates: true,
        },
        createdTime: new Date(),
        updatedTime: new Date(),
      };

      const newUser = await SupabaseDataService.createUser(userData);

      return newUser;
    } catch (error) {
      throw error;
    }
  }

  static async signInWithApple() {
    try {
      console.log("🍎 [Apple Sign In] Starting Apple authentication...");

      // Check if Apple Authentication is available on this device
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      console.log(
        "🍎 [Apple Sign In] Apple Authentication available:",
        isAvailable
      );

      if (!isAvailable) {
        throw new Error("Apple Sign In is not available on this device");
      }

      // Request Apple Sign In credentials
      console.log("🍎 [Apple Sign In] Requesting Apple credentials...");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log("🍎 [Apple Sign In] Apple credential received:", {
        state: credential.state,
        hasIdentityToken: !!credential.identityToken,
        hasEmail: !!credential.email,
        hasFullName: !!credential.fullName,
        nonce: credential.nonce,
      });

      // Check if the user cancelled the sign-in
      if (
        credential.state ===
        AppleAuthentication.AppleAuthenticationCredentialState.CANCELED
      ) {
        console.log("🟡 [Apple Sign In] User cancelled authentication");
        return { type: "cancel" };
      }

      // Verify the credential state
      if (
        credential.state !==
        AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
      ) {
        console.error(
          "🔴 [Apple Sign In] Credential not authorized, state:",
          credential.state
        );
        throw new Error("Apple Sign In was not authorized");
      }

      console.log("🍎 [Apple Sign In] Exchanging Apple token with Supabase...");

      // Sign in to Supabase using the Apple ID token
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: "apple",
        token: credential.identityToken!,
        nonce: credential.nonce,
      });

      console.log("🍎 [Apple Sign In] Supabase response:", { data, error });

      if (error) {
        console.error("🔴 [Apple Sign In] Supabase error:", error);
        throw new Error(`Apple Sign In failed: ${error.message}`);
      }

      if (!data.user) {
        console.error("🔴 [Apple Sign In] No user data from Supabase");
        throw new Error("No user data received from Apple Sign In");
      }

      console.log("🍎 [Apple Sign In] User data received:", {
        uid: data.user.uid,
        email: data.user.email,
        hasMetadata: !!data.user.user_metadata,
      });

      // Update user metadata with Apple-specific data
      const updates: any = {};

      // Apple only provides email on first sign-in, so we preserve it
      if (credential.email) {
        updates.email = credential.email;
        console.log("🍎 [Apple Sign In] Email provided:", credential.email);
      }

      // Apple only provides full name on first sign-in
      if (credential.fullName) {
        const { givenName, familyName } = credential.fullName;
        if (givenName || familyName) {
          updates.displayName = `${givenName || ""} ${familyName || ""}`.trim();
          console.log(
            "🍎 [Apple Sign In] Full name provided:",
            updates.displayName
          );
        }
      }

      console.log("🍎 [Apple Sign In] Metadata updates:", updates);

      // Update user metadata if we have new information
      if (Object.keys(updates).length > 0) {
        console.log("🍎 [Apple Sign In] Updating user metadata...");
        await this.updateUserMetadata(updates);
      }

      // Ensure user exists in database and create if needed
      console.log("🍎 [Apple Sign In] Ensuring user exists in database...");
      await this.ensureUserExists(data.user);

      console.log("✅ [Apple Sign In] Successfully authenticated with Apple");
      return { type: "success", user: data.user };
    } catch (error: any) {
      console.error("🔴 [Apple Sign In] Error in signInWithApple:", error);

      // Handle Apple Authentication specific errors
      if (error.code === "ERR_CANCELED") {
        console.log("🟡 [Apple Sign In] User cancelled (ERR_CANCELED)");
        return { type: "cancel" };
      }

      throw error;
    }
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
      // Get current user to get their ID
      const {
        data: { user },
        error: getUserError,
      } = await supabase.auth.getUser();

      if (getUserError) {
        return { success: false, error: getUserError };
      }

      if (!user) {
        return { success: false, error: new Error("No user found") };
      }

      // For now, we'll just sign out the user since we can't delete from auth on client side
      // In a production app, you would call an Edge Function with service role key

      // Sign out the user
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        return { success: false, error: signOutError };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
