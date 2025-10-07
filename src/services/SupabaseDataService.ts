import { supabase } from "../config/supabase.config";
import { User, Meetup, MessageRoom, ActivityItem } from "../types";

export class SupabaseDataService {
  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("uid", uid)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return { user: null, error: "User not found" };
        }
        return { user: null, error: error.message };
      }

      if (data) {
        const userData = this.convertSupabaseUserToUser(data);
        return { user: userData, error: null };
      }

      return { user: null, error: "User not found" };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseUserData = this.convertUserToSupabase(userData);

      if (userUid) {
        supabaseUserData.uid = userUid;
      }

      supabaseUserData.created_at = new Date().toISOString();
      supabaseUserData.updated_at = new Date().toISOString();

      const { error } = await supabase.from("users").insert([supabaseUserData]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseUpdates = this.convertUserToSupabase(updates);
      supabaseUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from("users")
        .update(supabaseUpdates)
        .eq("uid", uid);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Meetup Data Methods
  static async getMeetups(): Promise<{
    meetups: Meetup[];
    error: string | null;
  }> {
    try {
      const { data, error } = await supabase
        .from("meetups")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        return { meetups: [], error: error.message };
      }

      const meetups: Meetup[] = [];
      if (data) {
        data.forEach((meetupData) => {
          const meetup = this.convertSupabaseMeetupToMeetup(meetupData);
          meetups.push(meetup);
        });
      }

      return { meetups, error: null };
    } catch (error: any) {
      return { meetups: [], error: error.message };
    }
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseMeetupData = this.convertMeetupToSupabase(meetupData);
      supabaseMeetupData.created_at = new Date().toISOString();
      supabaseMeetupData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from("meetups")
        .insert([supabaseMeetupData]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async updateMeetup(
    id: string,
    updates: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseUpdates = this.convertMeetupToSupabase(updates);
      supabaseUpdates.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from("meetups")
        .update(supabaseUpdates)
        .eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async deleteMeetup(
    id: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const { error } = await supabase.from("meetups").delete().eq("id", id);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Message Methods
  static async getMessages(
    roomId: string
  ): Promise<{ messages: any[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("message_room_ref", roomId)
        .order("created_time", { ascending: true });

      if (error) {
        return { messages: [], error: error.message };
      }

      return { messages: data || [], error: null };
    } catch (error: any) {
      return { messages: [], error: error.message };
    }
  }

  static async sendMessage(
    roomId: string,
    message: any
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseMessage = {
        message_room_ref: roomId,
        sender_ref: message.senderRef,
        text: message.text,
        message_type: message.messageType || "text",
        media_url: message.mediaUrl,
        created_time: new Date().toISOString(),
        updated_time: new Date().toISOString(),
      };

      const { error } = await supabase
        .from("messages")
        .insert([supabaseMessage]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async createMessageRoom(
    participants: string[]
  ): Promise<{ roomId: string | null; error: string | null }> {
    try {
      const roomData = {
        type: "direct",
        participants,
        created_time: new Date().toISOString(),
        updated_time: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from("message_rooms")
        .insert([roomData])
        .select("id")
        .single();

      if (error) {
        return { roomId: null, error: error.message };
      }

      return { roomId: data.id, error: null };
    } catch (error: any) {
      return { roomId: null, error: error.message };
    }
  }

  // Activity Methods
  static async getActivity(
    userId: string
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from("activity")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false });

      if (error) {
        return { activities: [], error: error.message };
      }

      const activities: ActivityItem[] = [];
      if (data) {
        data.forEach((activityData) => {
          const activity = this.convertSupabaseActivityToActivity(activityData);
          activities.push(activity);
        });
      }

      return { activities, error: null };
    } catch (error: any) {
      return { activities: [], error: error.message };
    }
  }

  static async createActivity(
    activityData: Partial<ActivityItem>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const supabaseActivityData = {
        user_id: activityData.userId,
        type: activityData.type,
        description: activityData.description,
        timestamp:
          activityData.timestamp?.toISOString() || new Date().toISOString(),
        meetup_id: activityData.meetupId,
      };

      const { error } = await supabase
        .from("activity")
        .insert([supabaseActivityData]);

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Data Conversion Methods
  private static convertSupabaseUserToUser(data: any): User {
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.display_name,
      age: data.age || 0,
      gender: data.gender || "",
      pronouns: data.pronouns || "",
      bio: data.bio || "",
      about: data.about || "",
      profilePictures: data.profile_pictures || [],
      standoutPhotoIndex: data.standout_photo_index,
      location: data.location || { latitude: 0, longitude: 0 },
      locationName: data.location_name || "",
      phoneNumber: data.phone_number || "",
      school: data.school || "",
      jobTitle: data.job_title || "",
      jobCompany: data.job_company || "",
      professionalLevel: data.professional_level || "",
      hometown: data.hometown || "",
      starSign: data.star_sign || "",
      hobbies: data.hobbies || [],
      interests: data.interests || [],
      lookingFor: data.looking_for || [],
      onboardingComplete: data.onboarding_complete || false,
      isVerified: data.is_verified || "pending",
      isPaused: data.is_paused || false,
      lastActive: new Date(data.last_active || data.created_at),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      profileViews: data.profile_views || 0,
      uniqueViewers: data.unique_viewers || 0,
      viewsThisWeek: data.views_this_week || 0,
      averageViewDuration: data.average_view_duration || 0,
      preferences: data.preferences,
      createdTime: new Date(data.created_at),
      updatedTime: new Date(data.updated_at),
    };
  }

  private static convertUserToSupabase(user: Partial<User>): any {
    return {
      uid: user.uid,
      email: user.email,
      display_name: user.displayName,
      age: user.age,
      gender: user.gender,
      pronouns: user.pronouns,
      bio: user.bio,
      about: user.about,
      profile_pictures: user.profilePictures,
      standout_photo_index: user.standoutPhotoIndex,
      location: user.location,
      location_name: user.locationName,
      phone_number: user.phoneNumber,
      school: user.school,
      job_title: user.jobTitle,
      job_company: user.jobCompany,
      professional_level: user.professionalLevel,
      hometown: user.hometown,
      star_sign: user.starSign,
      hobbies: user.hobbies,
      interests: user.interests,
      looking_for: user.lookingFor,
      onboarding_complete: user.onboardingComplete,
      is_verified: user.isVerified,
      is_paused: user.isPaused,
      last_active: user.lastActive?.toISOString(),
      verified_at: user.verifiedAt?.toISOString(),
      profile_views: user.profileViews,
      unique_viewers: user.uniqueViewers,
      views_this_week: user.viewsThisWeek,
      average_view_duration: user.averageViewDuration,
      preferences: user.preferences,
    };
  }

  private static convertSupabaseMeetupToMeetup(data: any): Meetup {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      creatorId: data.creator_id,
      creatorRef: data.creator_ref || "",
      location: data.location || { latitude: 0, longitude: 0 },
      locationName: data.location_name || "",
      address: data.address || "",
      time: new Date(data.time),
      duration: data.duration || 60,
      timezone: data.timezone || "UTC",
      activity: data.activity || "",
      activityCategory: data.activity_category || "",
      tags: data.tags || [],
      maxParticipants: data.max_participants || 10,
      currentParticipants: data.current_participants || 0,
      participants: data.participants || [],
      waitlist: data.waitlist || [],
      declinedUsers: data.declined_users || [],
      status: data.status || "active",
      isRecurring: data.is_recurring || false,
      recurringPattern: data.recurring_pattern,
      requirements: data.requirements || { verificationRequired: false },
      coverImage: data.cover_image,
      images: data.images || [],
      views: data.views || 0,
      joinRequests: data.join_requests || 0,
      completionRate: data.completion_rate || 0,
      engagementScore: data.engagement_score || 0,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };
  }

  private static convertMeetupToSupabase(meetup: Partial<Meetup>): any {
    return {
      title: meetup.title,
      description: meetup.description,
      creator_id: meetup.creatorId,
      creator_ref: meetup.creatorRef,
      location: meetup.location,
      location_name: meetup.locationName,
      address: meetup.address,
      time: meetup.time?.toISOString(),
      duration: meetup.duration,
      timezone: meetup.timezone,
      activity: meetup.activity,
      activity_category: meetup.activityCategory,
      tags: meetup.tags,
      max_participants: meetup.maxParticipants,
      current_participants: meetup.currentParticipants,
      participants: meetup.participants,
      waitlist: meetup.waitlist,
      declined_users: meetup.declinedUsers,
      status: meetup.status,
      is_recurring: meetup.isRecurring,
      recurring_pattern: meetup.recurringPattern,
      requirements: meetup.requirements,
      cover_image: meetup.coverImage,
      images: meetup.images,
      views: meetup.views,
      join_requests: meetup.joinRequests,
      completion_rate: meetup.completionRate,
      engagement_score: meetup.engagementScore,
      completed_at: meetup.completedAt?.toISOString(),
    };
  }

  private static convertSupabaseActivityToActivity(data: any): ActivityItem {
    return {
      id: data.id,
      userId: data.user_id,
      type: data.type,
      description: data.description,
      timestamp: new Date(data.timestamp),
      meetupId: data.meetup_id,
    };
  }
}
