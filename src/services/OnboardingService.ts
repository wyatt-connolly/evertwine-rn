import { User } from "../types";
import { DataService } from "./DataService";
import { AuthService } from "./firebase";
import { addAppVersionInfo } from "../utils/firebaseAppFilter";

export class OnboardingService {
  // Complete user profile setup
  static async completeProfileSetup(
    uid: string,
    profileData: {
      displayName: string;
      bio: string;
      about: string;
      interests: string[];
      location: { latitude: number; longitude: number };
      photoURL?: string;
    }
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // First, check if user exists
      const existingUser = await DataService.getUser(uid);

      const userData: Partial<User> = {
        uid: uid,
        displayName: profileData.displayName,
        bio: profileData.bio,
        about: profileData.about,
        interests: profileData.interests,
        location: profileData.location,
        onboardingComplete: true,
        isVerified: "pending",
        lastActive: new Date(),
        // Default values for required fields
        age: 25,
        gender: "Prefer not to say",
        pronouns: "they/them",
        profilePictures: profileData.photoURL
          ? [profileData.photoURL]
          : [
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            ],
        standoutPhotoIndex: 0,
        locationName: "",
        phoneNumber: "",
        school: "",
        jobTitle: "",
        jobCompany: "",
        professionalLevel: "",
        hometown: "",
        starSign: "",
        hobbies: [],
        lookingFor: [],
        isPaused: false,
        profileViews: 0,
        uniqueViewers: 0,
        viewsThisWeek: 0,
        averageViewDuration: 0,
        createdTime: new Date(),
        updatedTime: new Date(),
      };

      // Add app version info before saving
      const appUserData = addAppVersionInfo(userData);

      let result;
      if (existingUser.user) {
        // User exists, update them
        result = await DataService.updateUser(uid, appUserData);
      } else {
        // User doesn't exist, create them
        result = await DataService.createUser(appUserData, uid);
      }

      if (result.success) {
        console.log("✅ Profile setup completed successfully");
        return { success: true, error: null };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Profile setup error:", error);
      return { success: false, error: error.message };
    }
  }

  // Import data from social providers
  static async importFromGoogle(
    user: any
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const profileData = {
        displayName: user.displayName || "Google User",
        bio: `Hi! I'm ${user.displayName || "a Google user"}`,
        about: `I joined Evertwine through Google. Looking forward to meeting new people and building connections!`,
        interests: ["Technology", "Networking", "Social"],
        location: { latitude: 37.7749, longitude: -122.4194 }, // Default to SF
        photoURL: user.photoURL,
      };

      return await this.completeProfileSetup(user.uid, profileData);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async importFromApple(
    user: any
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const profileData = {
        displayName: user.displayName || "Apple User",
        bio: `Hi! I'm ${user.displayName || "an Apple user"}`,
        about: `I joined Evertwine through Apple. Excited to connect with like-minded people!`,
        interests: ["Technology", "Networking", "Social"],
        location: { latitude: 37.7749, longitude: -122.4194 }, // Default to SF
        photoURL: user.photoURL,
      };

      return await this.completeProfileSetup(user.uid, profileData);
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Set up user preferences
  static async setupPreferences(
    uid: string,
    preferences: {
      ageRange: { min: number; max: number };
      genderPreference: string[];
      groupSizePreference: string;
      timePreference: string[];
      locationPreference: { radius: number; city: string };
      activityPreference: string[];
    }
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const userData: Partial<User> = {
        preferences: {
          minAgePreference: preferences.ageRange.min,
          maxAgePreference: preferences.ageRange.max,
          genderPreference: preferences.genderPreference,
          groupSizePreference: preferences.groupSizePreference,
          timePreferences: preferences.timePreference,
          locationPreference: preferences.locationPreference.radius,
          activityPreferences: preferences.activityPreference,
          preferredNeighborhoods: [preferences.locationPreference.city],
          notificationSettings: {
            all: true,
            likes: true,
            messages: true,
            announcements: true,
            requests: true,
            reservationInvites: true,
          },
        },
      };

      const result = await DataService.updateUser(uid, userData);

      if (result.success) {
        console.log("✅ User preferences set successfully");
        return { success: true, error: null };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Preferences setup error:", error);
      return { success: false, error: error.message };
    }
  }

  // Verify user profile
  static async verifyProfile(
    uid: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const userData: Partial<User> = {
        isVerified: "verified",
        verifiedAt: new Date(),
      };

      const result = await DataService.updateUser(uid, userData);

      if (result.success) {
        console.log("✅ User profile verified successfully");
        return { success: true, error: null };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error: any) {
      console.error("Profile verification error:", error);
      return { success: false, error: error.message };
    }
  }

  // Check if user needs onboarding
  static async needsOnboarding(
    uid: string
  ): Promise<{ needsOnboarding: boolean; error: string | null }> {
    try {
      const result = await DataService.getUser(uid);

      if (result.user) {
        return {
          needsOnboarding: !result.user.onboardingComplete,
          error: null,
        };
      } else {
        return { needsOnboarding: true, error: result.error };
      }
    } catch (error: any) {
      return { needsOnboarding: true, error: error.message };
    }
  }

  // Get onboarding progress
  static async getOnboardingProgress(
    uid: string
  ): Promise<{ progress: number; error: string | null }> {
    try {
      const result = await DataService.getUser(uid);

      if (result.user) {
        let progress = 0;
        const user = result.user;

        if (user.displayName) progress += 20;
        if (user.bio) progress += 20;
        if (user.about) progress += 20;
        if (user.interests && user.interests.length > 0) progress += 20;
        if (user.location) progress += 20;

        return { progress, error: null };
      } else {
        return { progress: 0, error: result.error };
      }
    } catch (error: any) {
      return { progress: 0, error: error.message };
    }
  }
}
