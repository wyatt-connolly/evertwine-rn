import { User, Meetup, MessageRoom, ActivityItem } from "../types";
import { SupabaseDataService } from "./SupabaseDataService";

export class DataService {
  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
    return await SupabaseDataService.getUser(uid);
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.createUser(userData, userUid);
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.updateUser(uid, updates);
  }

  // Meetup Data Methods
  static async getMeetups(): Promise<{
    meetups: Meetup[];
    error: string | null;
  }> {
    return await SupabaseDataService.getMeetups();
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.createMeetup(meetupData);
  }

  static async updateMeetup(
    id: string,
    updates: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.updateMeetup(id, updates);
  }

  static async deleteMeetup(
    id: string
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.deleteMeetup(id);
  }

  // Message Data Methods
  static async getMessages(
    roomId: string
  ): Promise<{ messages: any[]; error: string | null }> {
    return await SupabaseDataService.getMessages(roomId);
  }

  static async sendMessage(
    roomId: string,
    message: any
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.sendMessage(roomId, message);
  }

  static async createMessageRoom(
    participants: string[]
  ): Promise<{ roomId: string | null; error: string | null }> {
    return await SupabaseDataService.createMessageRoom(participants);
  }

  // Activity Feed Methods
  static async getActivity(
    userId: string
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    return await SupabaseDataService.getActivity(userId);
  }

  static async createActivity(
    activityData: Partial<ActivityItem>
  ): Promise<{ success: boolean; error: string | null }> {
    return await SupabaseDataService.createActivity(activityData);
  }

  // Note: Authentication methods are now handled by the Supabase auth service
  // Real-time listeners would need to be implemented with Supabase real-time subscriptions
  // For now, we'll keep the methods but they won't have Firebase dependencies
}
