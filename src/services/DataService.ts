import {
  User,
  Meetup,
  MessageRoom,
  ActivityItem,
  Message,
  Post,
} from "../types";
import {
  getMockUsers,
  getMockMeetups,
  getMockPosts,
  getActivityFeed,
  mockMessageRooms,
  getUserNotifications,
  getMockUserStats,
} from "../data/mockData";
import { getMockCommunityUsers } from "../data/mockCommunityUsers";
import { SupabaseDataService } from "./SupabaseDataService";

export class DataService {
  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
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
    userData: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await SupabaseDataService.createUser(userData);
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
    try {
      await SupabaseDataService.updateUser(uid, updates);
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
    // TODO: Implement with Supabase
    return { meetups: [], error: "Not implemented" };
  }

  static async createMeetup(
    _meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    // TODO: Implement with Supabase
    return { success: false, error: "Not implemented" };
  }

  // Message Data Methods
  static async getMessageRooms(
    _userId: string
  ): Promise<{ rooms: MessageRoom[]; error: string | null }> {
    // TODO: Implement with Supabase
    return { rooms: [], error: "Not implemented" };
  }

  static async findOrCreateDirectMessage(
    currentUserId: string,
    otherUserId: string,
    otherUserData: User
  ): Promise<{ room: MessageRoom | null; error: string | null }> {
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
      return { room: null, error: String(error) };
    }
  }

  // Activity Feed Methods
  static async getActivityFeed(
    page: number = 0,
    limit: number = 5
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    // TODO: Implement with Supabase
    return { activities: [], error: "Not implemented" };
  }

  // Authentication Methods
  static async signInWithPhone(_phoneNumber: string) {
    // TODO: Implement with Supabase
    return { confirmationResult: null, error: "Not implemented" };
  }

  static async signInWithGoogle() {
    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  static async signInWithApple() {
    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  static async loadUserProfile(_uid: string) {
    // TODO: Implement with Supabase
    return { user: null, error: "Not implemented" };
  }

  // Real-time Data Listeners
  static setupUserListener(
    _uid: string,
    _callback: (user: User | null) => void
  ) {
    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupMeetupsListener(_callback: (meetups: Meetup[]) => void) {
    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupMessagesListener(
    _userId: string,
    _callback: (rooms: MessageRoom[]) => void
  ) {
    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  static setupActivityListener(
    _callback: (activities: ActivityItem[]) => void
  ) {
    // TODO: Implement with Supabase
    return () => {}; // Return unsubscribe function
  }

  // Notifications Methods
  static async getNotifications(
    uid: string
  ): Promise<{ notifications: any[]; error: string | null }> {
    // TODO: Implement with Supabase
    return { notifications: [], error: "Not implemented" };
  }

  // User Stats Methods
  static async getUserStats(
    uid: string
  ): Promise<{ stats: any | null; error: string | null }> {
    // TODO: Implement with Supabase
    return { stats: null, error: "Not implemented" };
  }

  // ==================== POSTS ====================
  static async getPosts(): Promise<{
    data: Post[] | null;
    error: string | null;
  }> {
    try {
      const posts = await SupabaseDataService.getPosts();
      return { data: posts, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async createPost(
    postData: Partial<Post>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await SupabaseDataService.createPost(postData);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async updatePost(
    id: string,
    updates: Partial<Post>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await SupabaseDataService.updatePost(id, updates);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  static async deletePost(
    id: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await SupabaseDataService.deletePost(id);
      return { success: true, error: null };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // ==================== COMMUNITY USERS ====================
  static async getFeaturedUsers(currentUserId?: string): Promise<User[]> {
    try {
      const users = await SupabaseDataService.getFeaturedUsers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      return [];
    }
  }

  static async getActiveUsers(currentUserId?: string): Promise<User[]> {
    try {
      const users = await SupabaseDataService.getActiveUsers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      return [];
    }
  }

  static async getNewMembers(currentUserId?: string): Promise<User[]> {
    try {
      const users = await SupabaseDataService.getNewMembers();

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      return [];
    }
  }

  // ==================== MESSAGING ====================
  static async getMessageRoom(
    roomId: string,
    currentUserId?: string
  ): Promise<MessageRoom | null> {
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
      return null;
    }
  }

  static async getMessages(roomId: string, limit = 100): Promise<Message[]> {
    try {
      return await SupabaseDataService.getMessages(roomId, limit);
    } catch (error) {
      return [];
    }
  }

  static async sendMessage(message: Partial<Message>): Promise<Message | null> {
    try {
      const result = await SupabaseDataService.sendMessage(message);
      return result;
    } catch (error) {
      return null;
    }
  }

  static setupMessageListener(
    roomId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    try {
      return SupabaseDataService.setupMessageListener(roomId, callback);
    } catch (error) {
      return () => {};
    }
  }

  static async getUsersByIds(
    userIds: string[],
    currentUserId?: string
  ): Promise<User[]> {
    try {
      const users = await SupabaseDataService.getUsersByIds(userIds);

      // Filter out blocked users if currentUserId is provided
      if (currentUserId) {
        const blockedUsers = await this.getBlockedUsers(currentUserId);
        return users.filter((user) => !blockedUsers.includes(user.uid));
      }

      return users;
    } catch (error) {
      return [];
    }
  }

  // ==================== BLOCKING & REPORTING ====================
  private static blockedUsersCache: Map<string, string[]> = new Map();
  private static cacheExpiry: Map<string, number> = new Map();
  private static CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async blockUser(userId: string, blockedUserId: string): Promise<void> {
    try {
      await SupabaseDataService.blockUser(userId, blockedUserId);
      // Clear cache for both users
      this.blockedUsersCache.delete(userId);
      this.blockedUsersCache.delete(blockedUserId);
      this.cacheExpiry.delete(userId);
      this.cacheExpiry.delete(blockedUserId);
    } catch (error) {
      // If table doesn't exist or RLS policy fails, show user-friendly error
      if (error && typeof error === "object" && "code" in error) {
        if (error.code === "PGRST205") {
          throw new Error(
            "Blocking functionality is not available. Please contact support."
          );
        } else if (error.code === "42501") {
          throw new Error(
            "Blocking is temporarily unavailable. Please contact support."
          );
        }
      }
      throw error;
    }
  }

  static async getBlockedUsers(userId: string): Promise<string[]> {
    // Check cache first
    const cached = this.blockedUsersCache.get(userId);
    const expiry = this.cacheExpiry.get(userId);
    const isCacheValid = cached && expiry && Date.now() < expiry;

    if (isCacheValid) {
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
      // If table doesn't exist, return empty array and don't cache
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "PGRST205"
      ) {
        return [];
      }
      return [];
    }
  }

  static async unblockUser(
    userId: string,
    unblockedUserId: string
  ): Promise<void> {
    try {
      await SupabaseDataService.unblockUser(userId, unblockedUserId);
      // Clear cache for both users
      this.blockedUsersCache.delete(userId);
      this.blockedUsersCache.delete(unblockedUserId);
      this.cacheExpiry.delete(userId);
      this.cacheExpiry.delete(unblockedUserId);
    } catch (error) {
      throw new Error("Unable to unblock user. Please try again later.");
    }
  }

  static async reportConversation(
    reporterId: string,
    reportedUserId: string,
    roomId: string,
    reason: string
  ): Promise<void> {
    try {
      await SupabaseDataService.reportConversation(
        reporterId,
        reportedUserId,
        roomId,
        reason
      );
    } catch (error) {
      throw error;
    }
  }

  // Meetup Group Chat Methods
  static async createMeetupGroupChat(
    meetupId: string,
    meetupTitle: string,
    meetupImage: string,
    participants: string[]
  ): Promise<MessageRoom | null> {
    try {
      return await SupabaseDataService.createMeetupGroupChat(
        meetupId,
        meetupTitle,
        meetupImage,
        participants
      );
    } catch (error) {
      throw error;
    }
  }

  static async findMeetupGroupChat(
    meetupId: string
  ): Promise<MessageRoom | null> {
    try {
      return await SupabaseDataService.findMeetupGroupChat(meetupId);
    } catch (error) {
      throw error;
    }
  }

  static async addUserToMeetupGroupChat(
    meetupId: string,
    userId: string
  ): Promise<MessageRoom | null> {
    try {
      return await SupabaseDataService.addUserToMeetupGroupChat(
        meetupId,
        userId
      );
    } catch (error) {
      throw error;
    }
  }

  static setupMessageRoomsListener(
    userId: string,
    callback: (rooms: MessageRoom[]) => void
  ): () => void {
    return SupabaseDataService.setupMessageRoomsListener(userId, callback);
  }
}
