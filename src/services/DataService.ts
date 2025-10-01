import { User, Meetup, MessageRoom, ActivityItem } from "../types";
import { AuthService, FirestoreService } from "./firebase";
import { FirebaseDataService } from "./FirebaseDataService";
import {
  getMockUsers,
  getMockMeetups,
  getActivityFeed,
  mockMessageRooms,
} from "../data/mockData";

export class DataService {
  private static isDeveloperMode = true;

  // Set developer mode (bypasses Firebase)
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

    // Use Firebase for real authentication - NEVER return mock data
    return await FirestoreService.getUser(uid);
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate user creation in developer mode
      return { success: true, error: null };
    }

    // Use Firebase
    return await FirestoreService.createUser(userData, userUid);
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate user update in developer mode
      return { success: true, error: null };
    }

    // Use Firebase
    return await FirestoreService.updateUser(uid, updates);
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

    // Use Firebase for real data - NEVER return mock data
    return await FirebaseDataService.getMeetups();
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    if (this.isDeveloperMode) {
      // Simulate meetup creation in developer mode
      return { success: true, error: null };
    }

    // Use Firebase
    return await FirebaseDataService.createMeetup(meetupData);
  }

  // Message Data Methods
  static async getMessageRooms(
    userId: string
  ): Promise<{ rooms: MessageRoom[]; error: string | null }> {
    if (this.isDeveloperMode) {
      // Return mock message rooms
      return { rooms: mockMessageRooms, error: null };
    }

    // Use Firebase
    return await FirebaseDataService.getMessageRooms(userId);
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

    // Use Firebase - NEVER return mock data
    return await FirebaseDataService.getActivityFeed(page, limit);
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

    // Use Firebase
    return await AuthService.signInWithPhone(phoneNumber);
  }

  static async signInWithGoogle() {
    if (this.isDeveloperMode) {
      // Return mock Google auth for developer mode
      return { user: null, error: "Use Developer Login for mock data" };
    }

    // Use Firebase
    return await AuthService.signInWithGoogle();
  }

  static async signInWithApple() {
    if (this.isDeveloperMode) {
      // Return mock Apple auth for developer mode
      return { user: null, error: "Use Developer Login for mock data" };
    }

    // Use Firebase
    return await AuthService.signInWithApple();
  }

  static async loadUserProfile(uid: string) {
    if (this.isDeveloperMode) {
      // Return mock user profile for developer mode
      const mockUsers = getMockUsers();
      const user = mockUsers.find((u) => u.uid === uid) || mockUsers[0];
      return { user, error: null };
    }

    // Use Firebase
    return await AuthService.loadUserProfile(uid);
  }

  // Real-time Data Listeners
  static setupUserListener(uid: string, callback: (user: User | null) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // Use Firebase real-time listeners
    return FirebaseDataService.setupUserListener(uid, callback);
  }

  static setupMeetupsListener(callback: (meetups: Meetup[]) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // Use Firebase real-time listeners
    return FirebaseDataService.setupMeetupsListener(callback);
  }

  static setupMessagesListener(
    userId: string,
    callback: (rooms: MessageRoom[]) => void
  ) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // Use Firebase real-time listeners
    return FirebaseDataService.setupMessagesListener(userId, callback);
  }

  static setupActivityListener(callback: (activities: ActivityItem[]) => void) {
    if (this.isDeveloperMode) {
      // Simulate real-time updates in developer mode
      return () => {}; // Return unsubscribe function
    }

    // Use Firebase real-time listeners
    return FirebaseDataService.setupActivityListener(callback);
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

    // Use Firebase for real data
    return await FirebaseDataService.getNotifications(uid);
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

    // Use Firebase for real data
    return await FirebaseDataService.getUserStats(uid);
  }
}
