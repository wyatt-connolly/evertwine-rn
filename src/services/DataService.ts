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
  static async getFeaturedUsers(currentUserId?: string): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 5 random mock community users
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 5);
    }

    try {
      const users = await SupabaseDataService.getFeaturedUsers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      console.error("Error fetching featured users:", error);
      return [];
    }
  }

  static async getActiveUsers(currentUserId?: string): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 8 mock community users (simulating active users)
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 8);
    }

    try {
      const users = await SupabaseDataService.getActiveUsers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      console.error("Error fetching active users:", error);
      return [];
    }
  }

  static async getNewMembers(currentUserId?: string): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return 8 mock community users (simulating new members)
      const mockUsers = getMockCommunityUsers();
      return mockUsers.slice(0, 8);
    }

    try {
      const users = await SupabaseDataService.getNewMembers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      console.error("Error fetching new members:", error);
      return [];
    }
  }

  // ==================== MESSAGING ====================
  static async getMessageRoom(
    roomId: string,
    currentUserId?: string
  ): Promise<MessageRoom | null> {
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
      const room = await SupabaseDataService.getMessageRoom(roomId);

      // Check if room contains blocked users
      if (room && currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        const hasBlockedUser = room.participants.some((participant) =>
          blockedUsers.includes(participant)
        );

        if (hasBlockedUser) {
          return null; // Don't return rooms with blocked users
        }
      }

      return room;
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

  static async getUsersByIds(
    userIds: string[],
    currentUserId?: string
  ): Promise<User[]> {
    if (this.isDeveloperMode) {
      // Return mock users for development
      const mockUsers = getMockCommunityUsers();
      return mockUsers.filter((user) => userIds.includes(user.uid));
    }
    try {
      const users = await SupabaseDataService.getUsersByIds(userIds);

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      console.error("Error fetching users by IDs:", error);
      return [];
    }
  }

  // ==================== BLOCKING & REPORTING ====================
  private static blockedUsersCache: Map<string, string[]> = new Map();
  private static cacheExpiry: Map<string, number> = new Map();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async blockUser(userId: string, blockedUserId: string): Promise<void> {
    if (this.isDeveloperMode) {
      console.log("🚫 Dev mode: Block user", { userId, blockedUserId });
      return;
    }

    try {
      await SupabaseDataService.blockUser(userId, blockedUserId);
      // Clear cache for both users
      this.blockedUsersCache.delete(userId);
      this.blockedUsersCache.delete(blockedUserId);
      this.cacheExpiry.delete(userId);
      this.cacheExpiry.delete(blockedUserId);
    } catch (error) {
      console.error("Error blocking user:", error);
      // If table doesn't exist or RLS policy fails, show user-friendly error
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "PGRST205") {
          throw new Error(
            "Blocking functionality is not available. Please contact support."
          );
        } else if (error.code === "42501") {
          console.log(
            "⚠️ Blocking failed due to RLS policy - database setup needed"
          );
          throw new Error(
            "Blocking is temporarily unavailable. Please contact support."
          );
        }
      }
      throw error;
    }
  }

  static async getBlockedUsers(userId: string): Promise<string[]> {
    if (this.isDeveloperMode) {
      return []; // No blocked users in dev mode
    }

    // Check cache first
    const cached = this.blockedUsersCache.get(userId);
    const expiry = this.cacheExpiry.get(userId);

    if (cached && expiry && Date.now() < expiry) {
      return cached;
    }

    try {
      const blockedUserIds = await SupabaseDataService.getBlockedUserIds(
        userId
      );

      // Update cache
      this.blockedUsersCache.set(userId, blockedUserIds);
      this.cacheExpiry.set(userId, Date.now() + this.CACHE_DURATION);

      return blockedUserIds;
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      // If table doesn't exist, return empty array and don't cache
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "PGRST205"
      ) {
        console.log("Blocked users table not found, returning empty array");
        return [];
      }
      return [];
    }
  }

  static async unblockUser(
    userId: string,
    unblockedUserId: string
  ): Promise<void> {
    if (this.isDeveloperMode) {
      console.log("🚫 Dev mode: Unblock user", { userId, unblockedUserId });
      return;
    }

    try {
      await SupabaseDataService.unblockUser(userId, unblockedUserId);
      // Clear cache for both users
      this.blockedUsersCache.delete(userId);
      this.blockedUsersCache.delete(unblockedUserId);
      this.cacheExpiry.delete(userId);
      this.cacheExpiry.delete(unblockedUserId);
    } catch (error) {
      console.error("Error unblocking user:", error);
      throw new Error("Unable to unblock user. Please try again later.");
    }
  }

  static async reportConversation(
    reporterId: string,
    reportedUserId: string,
    roomId: string,
    reason: string
  ): Promise<void> {
    if (this.isDeveloperMode) {
      console.log("🚩 Dev mode: Report conversation", {
        reporterId,
        reportedUserId,
        roomId,
        reason,
      });
      return;
    }

    try {
      await SupabaseDataService.reportConversation(
        reporterId,
        reportedUserId,
        roomId,
        reason
      );
    } catch (error) {
      console.error("Error reporting conversation:", error);
      throw error;
    }
  }
}
