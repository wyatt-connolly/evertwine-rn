import { User, Meetup, MessageRoom, ActivityItem, Message } from "../types";
import {
  getMockUsers,
  getMockMeetups,
  getActivityFeed,
  mockMessageRooms,
  getUserNotifications,
  getMockUserStats,
} from "../data/mockData";
import { getMockCommunityUsers } from "../data/mockCommunityUsers";
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

  static async findOrCreateDirectMessage(
    currentUserId: string,
    otherUserId: string,
    otherUserData: User
  ): Promise<{ room: MessageRoom | null; error: string | null }> {
    if (this.isDeveloperMode) {
      // In dev mode, return a mock room
      const mockRoom: MessageRoom = {
        id: `room_${currentUserId}_${otherUserId}`,
        type: "direct",
        participants: [currentUserId, otherUserId],
        admins: [],
        name: otherUserData.displayName,
        avatar: otherUserData.profilePictures?.[0],
        settings: {
          allowInvites: false,
          allowMedia: true,
          allowReactions: true,
        },
        createdTime: new Date(),
        updatedTime: new Date(),
      };
      return { room: mockRoom, error: null };
    }

    try {
      // Check if conversation already exists
      let room = await SupabaseDataService.findDirectMessageRoom(
        currentUserId,
        otherUserId
      );

      // If not, create a new one
      if (!room) {
        room = await SupabaseDataService.createDirectMessageRoom(
          currentUserId,
          otherUserId,
          otherUserData
        );
      }

      return { room, error: null };
    } catch (error) {
      console.error("Error finding/creating direct message:", error);
      return { room: null, error: String(error) };
    }
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
      const stats = getMockUserStats(uid);
      return { stats, error: null };
    }

    // TODO: Implement with Supabase
    return { stats: null, error: "Not implemented" };
  }

  // ==================== COMMUNITY USERS ====================
  static async getFeaturedUsers(): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 5 random mock community users
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 5);
    }

    try {
      return await SupabaseDataService.getFeaturedUsers();
    } catch (error) {
      console.error("Error fetching featured users:", error);
      return [];
    }
  }

  static async getActiveUsers(): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 8 mock community users (simulating active users)
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 8);
    }

    try {
      return await SupabaseDataService.getActiveUsers();
    } catch (error) {
      console.error("Error fetching active users:", error);
      return [];
    }
  }

  static async getNewMembers(): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 8 mock community users (simulating new members)
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 8);
    }

    try {
      return await SupabaseDataService.getNewMembers();
    } catch (error) {
      console.error("Error fetching new members:", error);
      return [];
    }
  }

  // ==================== MESSAGING ====================
  static async getMessageRoom(roomId: string): Promise<MessageRoom | null> {
    if (this.isDeveloperMode) {
      // Return mock room for development
      return {
        id: roomId,
        type: "direct",
        participants: ["user1", "user2"],
        admins: [],
        name: "Mock Room",
        avatar: undefined,
        settings: {
          allowInvites: false,
          allowMedia: true,
          allowReactions: true,
        },
        createdTime: new Date(),
        updatedTime: new Date(),
      };
    }
    try {
      return await SupabaseDataService.getMessageRoom(roomId);
    } catch (error) {
      console.error("Error fetching message room:", error);
      return null;
    }
  }

  static async getMessages(roomId: string, limit = 100): Promise<Message[]> {
    if (this.isDeveloperMode) {
      // Return mock messages for development
      return [];
    }
    try {
      return await SupabaseDataService.getMessages(roomId, limit);
    } catch (error) {
      console.error("Error fetching messages:", error);
      return [];
    }
  }

  static async sendMessage(message: Partial<Message>): Promise<Message | null> {
    console.log("📤 DataService.sendMessage called:", message);
    
    if (this.isDeveloperMode) {
      console.log("📤 Developer mode: returning mock message");
      // In dev mode, just return a mock message
      return {
        id: Date.now().toString(),
        messageRoomRef: message.messageRoomRef || "",
        senderRef: message.senderRef || "",
        text: message.text || "",
        messageType: message.messageType || "text",
        isEdited: false,
        reactions: {},
        isRead: false,
        readBy: {},
        isDeleted: false,
        createdTime: new Date(),
        updatedTime: new Date(),
      };
    }
    try {
      console.log("📤 Calling SupabaseDataService.sendMessage");
      const result = await SupabaseDataService.sendMessage(message);
      console.log("📤 SupabaseDataService.sendMessage result:", result);
      return result;
    } catch (error) {
      console.error("📤 Error in DataService.sendMessage:", error);
      return null;
    }
  }

  static setupMessageListener(
    roomId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    if (this.isDeveloperMode) {
      // In dev mode, return a no-op unsubscribe function
      return () => {};
    }
    try {
      return SupabaseDataService.setupMessageListener(roomId, callback);
    } catch (error) {
      console.error("Error setting up message listener:", error);
      return () => {};
    }
  }

  static async getUsersByIds(userIds: string[]): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return mock users for development
      const mockUsers = getMockCommunityUsers();
      return mockUsers.filter((user) => userIds.includes(user.uid));
    }
    try {
      return await SupabaseDataService.getUsersByIds(userIds);
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      return [];
    }
  }
}
