import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import { SupabaseDataService } from "./SupabaseDataService";

export class FeaturedMembersService {
  private static readonly STORAGE_KEY = "featured_members";
  private static readonly DATE_KEY = "featured_members_date";

  /**
   * Get daily featured members (3 users) with daily rotation
   */
  static async getDailyFeaturedMembers(currentUserId: string): Promise<User[]> {
    try {
      const today = this.getTodayDateString();
      const cachedData = await this.getCachedFeaturedMembers();

      // Check if we have cached data for today
      if (
        cachedData &&
        cachedData.date === today &&
        cachedData.members.length > 0
      ) {
        return cachedData.members;
      }

      // Fetch all active users excluding admin
      const allUsers =
        await SupabaseDataService.getAllActiveUsersExcludingAdmin();

      // Filter out current user if they're in the list
      const eligibleUsers = allUsers.filter(
        (user) => user.uid !== currentUserId
      );

      if (eligibleUsers.length === 0) {
        return [];
      }

      // Generate daily featured users
      const featuredUsers = this.generateDailyFeaturedUsers(
        eligibleUsers,
        today
      );

      // Cache the results
      await this.cacheFeaturedMembers(today, featuredUsers);

      return featuredUsers;
    } catch (error) {
      console.error("Error getting featured members:", error);
      // Return cached data if available, even if it's from a previous day
      const cachedData = await this.getCachedFeaturedMembers();
      return cachedData?.members || [];
    }
  }

  /**
   * Generate daily featured users using date-based seeding
   */
  private static generateDailyFeaturedUsers(
    allUsers: User[],
    dayKey: string
  ): User[] {
    if (allUsers.length === 0) return [];

    // Create a seeded random number generator using the date
    const seed = this.stringToSeed(dayKey);
    const seededRandom = this.createSeededRandom(seed);

    // Fisher-Yates shuffle with seeded random
    const shuffled = [...allUsers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // Return first 3 users (or all if less than 3)
    return shuffled.slice(0, Math.min(3, shuffled.length));
  }

  /**
   * Check if we need to refresh featured members (new day)
   */
  static async isNewDay(): Promise<boolean> {
    const today = this.getTodayDateString();
    const lastFetchDate = await AsyncStorage.getItem(this.DATE_KEY);
    return lastFetchDate !== today;
  }

  /**
   * Get today's date string in YYYY-MM-DD format (local timezone)
   */
  private static getTodayDateString(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  /**
   * Convert string to numeric seed
   */
  private static stringToSeed(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Create seeded random number generator
   */
  private static createSeededRandom(seed: number) {
    let state = seed;
    return function () {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  /**
   * Cache featured members for today
   */
  private static async cacheFeaturedMembers(
    date: string,
    members: User[]
  ): Promise<void> {
    try {
      const cacheData = {
        date,
        members,
        timestamp: Date.now(),
      };

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(cacheData));
      await AsyncStorage.setItem(this.DATE_KEY, date);
    } catch (error) {
      console.error("Error caching featured members:", error);
    }
  }

  /**
   * Get cached featured members
   */
  private static async getCachedFeaturedMembers(): Promise<{
    date: string;
    members: User[];
  } | null> {
    try {
      const cached = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (cached) {
        return JSON.parse(cached);
      }
      return null;
    } catch (error) {
      console.error("Error getting cached featured members:", error);
      return null;
    }
  }

  /**
   * Clear cached featured members (for testing or manual refresh)
   */
  static async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.STORAGE_KEY);
      await AsyncStorage.removeItem(this.DATE_KEY);
    } catch (error) {
      console.error("Error clearing featured members cache:", error);
    }
  }

  /**
   * Force refresh featured members (ignore cache)
   */
  static async forceRefresh(currentUserId: string): Promise<User[]> {
    await this.clearCache();
    return this.getDailyFeaturedMembers(currentUserId);
  }
}
