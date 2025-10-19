import { User, Meetup, MessageRoom, ActivityItem } from "../types";
import {
  getMockUsers,
  getMockMeetups,
  getActivityFeed,
  mockMessageRooms,
} from "../data/mockData";
import { SupabaseDataService } from "./SupabaseDataService";

export class DataService {
  private static isDeveloperMode = false;

  // Set developer mode
  static setDeveloperMode(enabled: boolean) {
    this.isDeveloperMode = enabled;
  }

  static isInDeveloperMode(): boolean {
    return this.isDeveloperMode;
  }

  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock user data in developer mode
      const mockUsers = getMockUsers();
      const user = mockUsers.find((u) => u.uid === uid) || mockUsers[0];
      return { user, error: null };
    }

    // Use Supabase in production mode
    try {
      const user = await SupabaseDataService.getUser(uid);
      return { user, error: null };
    } catch (error) {
      console.error("Error getting user from Supabase:", error);
      return {
        user: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate user creation in developer mode
      return { success: true, error: null };
    }

    // Use Supabase in production mode
    try {
      const result = await SupabaseDataService.createUser(userData);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error creating user in Supabase:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate user update in developer mode
      return { success: true, error: null };
    }

    // Use Supabase in production mode
    try {
      const result = await SupabaseDataService.updateUser(uid, updates);
      return { success: true, error: null };
    } catch (error) {
      console.error("Error updating user in Supabase:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Meetup Data Methods
  static async getMeetups(): Promise<{
    meetups: Meetup[];
    error: string | null;
  }> {
    if (this.isDeveloperMode) {
      // Return mock meetup data in developer mode
      const meetups = getMockMeetups();
      return { meetups, error: null };
    }

    // TODO: Implement with Supabase
    return { meetups: [], error: "Not implemented" };
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate meetup creation in developer mode
      return { success: true, error: null };
    }

    // TODO: Implement with Supabase
    return { success: false, error: "Not implemented" };
  }

  // Message Data Methods
  static async getMessageRooms(
    userId: string
  ): Promise<{ rooms: MessageRoom[]; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock message rooms
      return { rooms: mockMessageRooms, error: null };
    }

    // TODO: Implement with Supabase
    return { rooms: [], error: "Not implemented" };
  }

  // Activity Feed Methods
  static async getActivityFeed(
    page: number = 0,
    limit: number = 5
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock activity feed
      const activities = getActivityFeed(page, limit);
      return { activities, error: null };
    }

    // TODO: Implement with Supabase
    return { activities: [], error: "Not implemented" };
  }

  // Authentication Methods
  static async signInWithPhone(phoneNumber: string) {
    if (this.isDeveloperMode) {
      // Return mock phone auth for developer mode
      return {
        confirmationResult: null,
        error: "Use Developer Login for mock data",
      };
    }

    // TODO: Implement with Supabase
    return { confirmationResult: null, error: "Not implemented" };
  }

  static async signInWithGoogle() {
    if (this.isDeveloperMode) {
      // Return mock Google auth for developer mode
      return { user: null, error: "Use Developer Login for mock data" };
    }

    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  static async signInWithApple() {
    if (this.isDeveloperMode) {
      // Return mock Apple auth for developer mode
      return { user: null, error: "Use Developer Login for mock data" };
    }

    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  static async loadUserProfile(uid: string) {
    if (this.isDeveloperMode) {
      // Return mock user profile for developer mode
      const mockUsers = getMockUsers();
      const user = mockUsers.find((u) => u.uid === uid) || mockUsers[0];
      return { user, error: null };
    }

    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  // Real-time Data Listeners
  static setupUserListener(uid: string, callback: (user: User | null) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupMeetupsListener(callback: (meetups: Meetup[]) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupMessagesListener(
    userId: string,
    callback: (rooms: MessageRoom[]) => void
  ) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupActivityListener(callback: (activities: ActivityItem[]) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  // Notifications Methods
  static async getNotifications(
    uid: string
  ): Promise<{ notifications: any[]; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock notifications in developer mode
      const { getUserNotifications } = await import("../data/mockData");
      const notifications = getUserNotifications(uid);
      return { notifications, error: null };
    }

    // TODO: Implement with Supabase
    return { notifications: [], error: "Not implemented" };
  }

  // User Stats Methods
  static async getUserStats(
    uid: string
  ): Promise<{ stats: any | null; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock stats in developer mode
      const { getMockUserStats } = await import("../data/mockData");
      const stats = getMockUserStats(uid);
      return { stats, error: null };
    }

    // TODO: Implement with Supabase
    return { stats: null, error: "Not implemented" };
  }
}
