import { User, Meetup, MessageRoom, ActivityItem } from "../types";
import {
  getMockUsers,
  getMockMeetups,
  getActivityFeed,
  mockMessageRooms,
} from "../data/mockData";

export class DataService {
  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
    // Return mock user data
    const mockUsers = getMockUsers();
    const user = mockUsers.find((u) => u.uid === uid) || mockUsers[0];
    return { user, error: null };
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    // Simulate user creation
    return { success: true, error: null };
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    // Simulate user update
    return { success: true, error: null };
  }

  // Meetup Data Methods
  static async getMeetups(): Promise<{
    meetups: Meetup[];
    error: string | null;
  }> {
    // Return mock meetup data
    const meetups = getMockMeetups();
    return { meetups, error: null };
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    // Simulate meetup creation
    return { success: true, error: null };
  }

  // Message Data Methods
  static async getMessageRooms(
    userId: string
  ): Promise<{ rooms: MessageRoom[]; error: string | null }> {
    // Return mock message rooms
    return { rooms: mockMessageRooms, error: null };
  }

  // Activity Feed Methods
  static async getActivityFeed(
    page: number = 0,
    limit: number = 5
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    // Return mock activity feed
    const activities = getActivityFeed(page, limit);
    return { activities, error: null };
  }

  // Authentication Methods (mock only)
  static async signInWithPhone(phoneNumber: string) {
    return {
      confirmationResult: null,
      error: "Phone auth not available in mock mode",
    };
  }

  static async signInWithGoogle() {
    return { user: null, error: "Google auth not available in mock mode" };
  }

  static async signInWithApple() {
    return { user: null, error: "Apple auth not available in mock mode" };
  }

  static async loadUserProfile(uid: string) {
    // Return mock user profile
    const mockUsers = getMockUsers();
    const user = mockUsers.find((u) => u.uid === uid) || mockUsers[0];
    return { user, error: null };
  }

  // Real-time Data Listeners (mock only)
  static setupUserListener(uid: string, callback: (user: User | null) => void) {
    // Simulate real-time updates
    return () => {}; // Return unsubscribe function
  }

  static setupMeetupsListener(callback: (meetups: Meetup[]) => void) {
    // Simulate real-time updates
    return () => {}; // Return unsubscribe function
  }

  static setupMessagesListener(
    userId: string,
    callback: (rooms: MessageRoom[]) => void
  ) {
    // Simulate real-time updates
    return () => {}; // Return unsubscribe function
  }

  static setupActivityListener(callback: (activities: ActivityItem[]) => void) {
    // Simulate real-time updates
    return () => {}; // Return unsubscribe function
  }

  // Notifications Methods
  static async getNotifications(
    uid: string
  ): Promise<{ notifications: any[]; error: string | null }> {
    // Return mock notifications
    const { getUserNotifications } = await import("../data/mockData");
    const notifications = getUserNotifications(uid);
    return { notifications, error: null };
  }

  // User Stats Methods
  static async getUserStats(
    uid: string
  ): Promise<{ stats: any | null; error: string | null }> {
    // Return mock stats
    const { getMockUserStats } = await import("../data/mockData");
    const stats = getMockUserStats(uid);
    return { stats, error: null };
  }

  // Developer mode check
  static isInDeveloperMode(): boolean {
    return true; // Always in mock mode
  }
}
