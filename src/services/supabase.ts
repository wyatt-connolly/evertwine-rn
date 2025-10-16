import { supabase } from "../config/supabase.config";
import { AuthUser } from "../types";

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
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
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
}

