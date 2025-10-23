import { supabase } from "../config/supabase.config";
import {
  User,
  Post,
  PostComment,
  Meetup,
  Event,
  Message,
  MessageRoom,
  Notification,
} from "../types";

export class SupabaseDataService {
  // ==================== USERS ====================
  static async getUser(uid: string): Promise<User | null> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("uid", uid)
      .maybeSingle();

    if (error) {
      return null;
    }

    // If no user found (data is null), return null - this is normal for new users
    if (!data) {
      return null;
    }

    return this.mapUserFromDB(data);
  }

  static async createUser(user: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .insert([this.mapUserToDB(user)])
      .select()
      .single();
    if (error) throw error;
    return this.mapUserFromDB(data);
  }

  static async updateUser(uid: string, updates: Partial<User>) {
    const { data, error } = await supabase
      .from("users")
      .update({
        ...this.mapUserToDB(updates),
        updated_time: new Date().toISOString(),
      })
      .eq("uid", uid)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return this.mapUserFromDB(data);
  }

  static async getUsers(limit = 50): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_time", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapUserFromDB);
  }

  // ==================== COMMUNITY USERS ====================
  static async getFeaturedUsers(limit = 5): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_time", { ascending: false })
      .limit(limit * 2); // Get more users to filter from
    if (error) throw error;
    // Filter for users who are likely to be featured (have profile pictures, bio, etc.)
    const featuredCandidates = data.filter(
      (user) =>
        user.profile_pictures &&
        user.profile_pictures.length > 0 &&
        user.bio &&
        user.bio.length > 10
    );
    // Shuffle and take the requested number
    const shuffled = featuredCandidates
      .sort(() => Math.random() - 0.5)
      .slice(0, limit);
    return shuffled.map(this.mapUserFromDB);
  }

  static async getActiveUsers(limit = 8): Promise<User[]> {
    // For now, get recent users as a proxy for "active" users
    // In the future, we can add proper activity tracking
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .order("created_time", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapUserFromDB);
  }

  static async getNewMembers(limit = 8): Promise<User[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .gte("created_time", thirtyDaysAgo.toISOString())
      .order("created_time", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapUserFromDB);
  }

  // ==================== POSTS ====================
  static async getPosts(limit = 50): Promise<Post[]> {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users!posts_user_id_fkey(uid, display_name, profile_pictures)
      `
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapPostFromDB);
  }

  static async getPost(id: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        *,
        user:users!posts_user_id_fkey(uid, display_name, profile_pictures)
      `
      )
      .eq("id", id)
      .single();
    if (error) {
      return null;
    }
    return this.mapPostFromDB(data);
  }

  static async createPost(post: Partial<Post>) {
    const { data, error } = await supabase
      .from("posts")
      .insert([this.mapPostToDB(post)])
      .select()
      .single();
    if (error) throw error;
    return this.mapPostFromDB(data);
  }

  static async updatePost(id: string, updates: Partial<Post>) {
    const { data, error } = await supabase
      .from("posts")
      .update(this.mapPostToDB(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapPostFromDB(data);
  }

  static async deletePost(id: string) {
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;
  }

  // ==================== POST COMMENTS ====================
  static async getPostComments(postId: string): Promise<PostComment[]> {
    const { data, error } = await supabase
      .from("post_comments")
      .select(
        `
        *,
        user:users!post_comments_user_id_fkey(uid, display_name, profile_pictures)
      `
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data.map(this.mapPostCommentFromDB);
  }

  static async createComment(comment: Partial<PostComment>) {
    const { data, error } = await supabase
      .from("post_comments")
      .insert([this.mapPostCommentToDB(comment)])
      .select()
      .single();
    if (error) throw error;
    return this.mapPostCommentFromDB(data);
  }

  // ==================== MEETUPS ====================
  static async getMeetups(limit = 50): Promise<Meetup[]> {
    const { data, error } = await supabase
      .from("meetups")
      .select("*")
      .order("time", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapMeetupFromDB);
  }

  static async getMeetup(id: string): Promise<Meetup | null> {
    const { data, error } = await supabase
      .from("meetups")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return null;
    }
    return this.mapMeetupFromDB(data);
  }

  static async createMeetup(meetup: Partial<Meetup>) {
    const { data, error } = await supabase
      .from("meetups")
      .insert([this.mapMeetupToDB(meetup)])
      .select()
      .single();
    if (error) throw error;
    return this.mapMeetupFromDB(data);
  }

  static async updateMeetup(id: string, updates: Partial<Meetup>) {
    const { data, error } = await supabase
      .from("meetups")
      .update({
        ...this.mapMeetupToDB(updates),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapMeetupFromDB(data);
  }

  static async deleteMeetup(id: string) {
    const { error } = await supabase.from("meetups").delete().eq("id", id);
    if (error) throw error;
  }

  // ==================== HAPPY HOURS ====================
  static async getHappyHours(limit = 50): Promise<Event[]> {
    const { data, error } = await supabase
      .from("happy_hours")
      .select("*")
      .order("start_time", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapHappyHourFromDB);
  }

  static async getHappyHour(id: string): Promise<Event | null> {
    const { data, error } = await supabase
      .from("happy_hours")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      return null;
    }
    return this.mapHappyHourFromDB(data);
  }

  static async createHappyHour(event: Partial<Event>) {
    const { data, error } = await supabase
      .from("happy_hours")
      .insert([this.mapHappyHourToDB(event)])
      .select()
      .single();
    if (error) throw error;
    return this.mapHappyHourFromDB(data);
  }

  static async updateHappyHour(id: string, updates: Partial<Event>) {
    const { data, error } = await supabase
      .from("happy_hours")
      .update({
        ...this.mapHappyHourToDB(updates),
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapHappyHourFromDB(data);
  }

  // ==================== MESSAGE ROOMS ====================
  static async getMessageRooms(userId: string): Promise<MessageRoom[]> {
    const { data, error } = await supabase
      .from("message_rooms")
      .select("*")
      .contains("participants", [userId])
      .order("updated_time", { ascending: false });
    if (error) throw error;
    return data.map(this.mapMessageRoomFromDB);
  }

  // Find existing direct message room between two users
  static async findDirectMessageRoom(
    userId1: string,
    userId2: string
  ): Promise<MessageRoom | null> {
    const { data, error } = await supabase
      .from("message_rooms")
      .select("*")
      .eq("type", "direct")
      .contains("participants", [userId1])
      .contains("participants", [userId2]);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    return this.mapMessageRoomFromDB(data[0]);
  }

  // Create a new direct message room
  static async createDirectMessageRoom(
    userId1: string,
    userId2: string,
    otherUserData: User
  ): Promise<MessageRoom> {
    const roomData = {
      type: "direct",
      participants: [userId1, userId2],
      admins: [],
      name: otherUserData.displayName,
      avatar: otherUserData.profilePictures?.[0] || null,
      settings: {
        allow_invites: false,
        allow_media: true,
        allow_reactions: true,
      },
      created_time: new Date().toISOString(),
      updated_time: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("message_rooms")
      .insert(roomData)
      .select()
      .single();

    if (error) throw error;
    return this.mapMessageRoomFromDB(data);
  }

  static async createMessageRoom(room: Partial<MessageRoom>) {
    const { data, error } = await supabase
      .from("message_rooms")
      .insert([this.mapMessageRoomToDB(room)])
      .select()
      .single();
    if (error) throw error;
    return this.mapMessageRoomFromDB(data);
  }

  static async updateMessageRoom(id: string, updates: Partial<MessageRoom>) {
    const { data, error } = await supabase
      .from("message_rooms")
      .update({
        ...this.mapMessageRoomToDB(updates),
        updated_time: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapMessageRoomFromDB(data);
  }

  // ==================== MESSAGES ====================
  static async getMessages(roomId: string, limit = 100): Promise<Message[]> {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("message_room_ref", roomId)
      .order("created_time", { ascending: true })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapMessageFromDB);
  }

  static async sendMessage(message: Partial<Message>) {
    console.log("📤 SupabaseDataService.sendMessage called");
    console.log("📤 Message to insert:", message);
    console.log("📤 Mapped message:", this.mapMessageToDB(message));
    
    const { data, error } = await supabase
      .from("messages")
      .insert([this.mapMessageToDB(message)])
      .select()
      .single();
      
    console.log("📤 Supabase response - data:", data);
    console.log("📤 Supabase response - error:", error);
    
    if (error) throw error;
    return this.mapMessageFromDB(data);
  }

  static async getMessageRoom(roomId: string): Promise<MessageRoom | null> {
    const { data, error } = await supabase
      .from("message_rooms")
      .select("*")
      .eq("id", roomId)
      .single();

    if (error) throw error;
    if (!data) return null;

    return this.mapMessageRoomFromDB(data);
  }

  static async getUsersByIds(userIds: string[]): Promise<User[]> {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .in("uid", userIds);

    if (error) throw error;
    return data.map(this.mapUserFromDB);
  }

  static setupMessageListener(
    roomId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    const subscription = supabase
      .channel(`messages:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `message_room_ref=eq.${roomId}`,
        },
        async () => {
          // Fetch updated messages and call callback
          const messages = await this.getMessages(roomId);
          callback(messages);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }

  static async updateMessage(id: string, updates: Partial<Message>) {
    const { data, error } = await supabase
      .from("messages")
      .update({
        ...this.mapMessageToDB(updates),
        updated_time: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapMessageFromDB(data);
  }

  // ==================== NOTIFICATIONS ====================
  static async getNotifications(
    userId: string,
    limit = 50
  ): Promise<Notification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_ref", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.mapNotificationFromDB);
  }

  static async createNotification(notification: Partial<Notification>) {
    const { data, error } = await supabase
      .from("notifications")
      .insert([this.mapNotificationToDB(notification)])
      .select()
      .single();
    if (error) throw error;
    return this.mapNotificationFromDB(data);
  }

  static async markNotificationAsRead(id: string) {
    const { data, error } = await supabase
      .from("notifications")
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    return this.mapNotificationFromDB(data);
  }

  // ==================== MAPPING FUNCTIONS ====================
  // Convert DB snake_case to app camelCase

  private static mapUserFromDB(data: any): User {
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.display_name,
      age: data.age,
      gender: data.gender,
      pronouns: data.pronouns,
      bio: data.bio,
      about: data.about,
      profilePictures: data.profile_pictures,
      standoutPhotoIndex: data.standout_photo_index,
      location: data.location,
      locationName: data.location_name,
      phoneNumber: data.phone_number,
      school: data.school,
      jobTitle: data.job_title,
      jobCompany: data.job_company,
      professionalLevel: data.professional_level,
      hometown: data.hometown,
      starSign: data.star_sign,
      hobbies: data.hobbies,
      interests: data.interests,
      lookingFor: data.looking_for,
      onboardingComplete: data.onboarding_complete,
      isVerified: data.is_verified,
      isPaused: data.is_paused,
      lastActive: new Date(data.last_active),
      verifiedAt: data.verified_at ? new Date(data.verified_at) : undefined,
      profileViews: data.profile_views,
      uniqueViewers: data.unique_viewers,
      viewsThisWeek: data.views_this_week,
      averageViewDuration: data.average_view_duration,
      preferences: data.preferences,
      notificationPreferences: data.notification_preferences,
      createdTime: new Date(data.created_time),
      updatedTime: new Date(data.updated_time),
    };
  }

  private static mapUserToDB(user: Partial<User>): any {
    const mapped: any = {};
    if (user.uid !== undefined) mapped.uid = user.uid;
    if (user.email !== undefined) mapped.email = user.email;
    if (user.displayName !== undefined) mapped.display_name = user.displayName;
    if (user.age !== undefined) mapped.age = user.age;
    if (user.gender !== undefined) mapped.gender = user.gender;
    if (user.pronouns !== undefined) mapped.pronouns = user.pronouns;
    if (user.bio !== undefined) mapped.bio = user.bio;
    if (user.about !== undefined) mapped.about = user.about;
    if (user.profilePictures !== undefined)
      mapped.profile_pictures = user.profilePictures;
    if (user.standoutPhotoIndex !== undefined)
      mapped.standout_photo_index = user.standoutPhotoIndex;
    if (user.location !== undefined) mapped.location = user.location;
    if (user.locationName !== undefined)
      mapped.location_name = user.locationName;
    if (user.phoneNumber !== undefined) mapped.phone_number = user.phoneNumber;
    if (user.school !== undefined) mapped.school = user.school;
    if (user.jobTitle !== undefined) mapped.job_title = user.jobTitle;
    if (user.jobCompany !== undefined) mapped.job_company = user.jobCompany;
    if (user.professionalLevel !== undefined)
      mapped.professional_level = user.professionalLevel;
    if (user.hometown !== undefined) mapped.hometown = user.hometown;
    if (user.starSign !== undefined) mapped.star_sign = user.starSign;
    if (user.hobbies !== undefined) mapped.hobbies = user.hobbies;
    if (user.interests !== undefined) mapped.interests = user.interests;
    if (user.lookingFor !== undefined) mapped.looking_for = user.lookingFor;
    if (user.onboardingComplete !== undefined)
      mapped.onboarding_complete = user.onboardingComplete;
    if (user.isVerified !== undefined) mapped.is_verified = user.isVerified;
    if (user.isPaused !== undefined) mapped.is_paused = user.isPaused;
    if (user.lastActive !== undefined)
      mapped.last_active = user.lastActive.toISOString();
    if (user.verifiedAt !== undefined)
      mapped.verified_at = user.verifiedAt.toISOString();
    if (user.profileViews !== undefined)
      mapped.profile_views = user.profileViews;
    if (user.uniqueViewers !== undefined)
      mapped.unique_viewers = user.uniqueViewers;
    if (user.viewsThisWeek !== undefined)
      mapped.views_this_week = user.viewsThisWeek;
    if (user.averageViewDuration !== undefined)
      mapped.average_view_duration = user.averageViewDuration;
    if (user.preferences !== undefined) mapped.preferences = user.preferences;
    if (user.notificationPreferences !== undefined)
      mapped.notification_preferences = user.notificationPreferences;
    if (user.createdTime !== undefined)
      mapped.created_time = user.createdTime.toISOString();
    if (user.updatedTime !== undefined)
      mapped.updated_time = user.updatedTime.toISOString();
    return mapped;
  }

  private static mapPostFromDB(data: any): Post {
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user?.display_name || "",
      userAvatar: data.user?.profile_pictures?.[0] || "",
      title: data.title,
      message: data.message,
      images: data.images,
      likes: data.likes,
      comments: [], // Comments loaded separately
      createdAt: new Date(data.created_at),
      isAnnouncement: data.is_announcement,
    };
  }

  private static mapPostToDB(post: Partial<Post>): any {
    const mapped: any = {};
    if (post.id !== undefined) mapped.id = post.id;
    if (post.userId !== undefined) mapped.user_id = post.userId;
    if (post.title !== undefined) mapped.title = post.title;
    if (post.message !== undefined) mapped.message = post.message;
    if (post.images !== undefined) mapped.images = post.images;
    if (post.likes !== undefined) mapped.likes = post.likes;
    if (post.isAnnouncement !== undefined)
      mapped.is_announcement = post.isAnnouncement;
    return mapped;
  }

  private static mapPostCommentFromDB(data: any): PostComment {
    return {
      id: data.id,
      userId: data.user_id,
      userName: data.user?.display_name || "",
      userAvatar: data.user?.profile_pictures?.[0] || "",
      message: data.message,
      createdAt: new Date(data.created_at),
    };
  }

  private static mapPostCommentToDB(comment: Partial<PostComment>): any {
    const mapped: any = {};
    if (comment.id !== undefined) mapped.id = comment.id;
    if (comment.userId !== undefined) mapped.user_id = comment.userId;
    if (comment.message !== undefined) mapped.message = comment.message;
    return mapped;
  }

  private static mapMeetupFromDB(data: any): Meetup {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      creatorId: data.creator_id,
      creatorRef: data.creator_id,
      location: data.location,
      locationName: data.location_name,
      address: data.address,
      time: new Date(data.time),
      duration: data.duration,
      timezone: data.timezone,
      activity: data.activity,
      activityCategory: data.activity_category,
      tags: data.tags,
      maxParticipants: data.max_participants,
      currentParticipants: data.current_participants,
      participants: data.participants,
      waitlist: data.waitlist,
      declinedUsers: data.declined_users,
      status: data.status,
      isRecurring: data.is_recurring,
      recurringPattern: data.recurring_pattern,
      requirements: data.requirements,
      coverImage: data.cover_image,
      images: data.images,
      views: data.views,
      joinRequests: data.join_requests,
      completionRate: data.completion_rate,
      engagementScore: data.engagement_score,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      completedAt: data.completed_at ? new Date(data.completed_at) : undefined,
    };
  }

  private static mapMeetupToDB(meetup: Partial<Meetup>): any {
    const mapped: any = {};
    if (meetup.id !== undefined) mapped.id = meetup.id;
    if (meetup.title !== undefined) mapped.title = meetup.title;
    if (meetup.description !== undefined)
      mapped.description = meetup.description;
    if (meetup.creatorId !== undefined) mapped.creator_id = meetup.creatorId;
    if (meetup.location !== undefined) mapped.location = meetup.location;
    if (meetup.locationName !== undefined)
      mapped.location_name = meetup.locationName;
    if (meetup.address !== undefined) mapped.address = meetup.address;
    if (meetup.time !== undefined) mapped.time = meetup.time.toISOString();
    if (meetup.duration !== undefined) mapped.duration = meetup.duration;
    if (meetup.timezone !== undefined) mapped.timezone = meetup.timezone;
    if (meetup.activity !== undefined) mapped.activity = meetup.activity;
    if (meetup.activityCategory !== undefined)
      mapped.activity_category = meetup.activityCategory;
    if (meetup.tags !== undefined) mapped.tags = meetup.tags;
    if (meetup.maxParticipants !== undefined)
      mapped.max_participants = meetup.maxParticipants;
    if (meetup.currentParticipants !== undefined)
      mapped.current_participants = meetup.currentParticipants;
    if (meetup.participants !== undefined)
      mapped.participants = meetup.participants;
    if (meetup.waitlist !== undefined) mapped.waitlist = meetup.waitlist;
    if (meetup.declinedUsers !== undefined)
      mapped.declined_users = meetup.declinedUsers;
    if (meetup.status !== undefined) mapped.status = meetup.status;
    if (meetup.isRecurring !== undefined)
      mapped.is_recurring = meetup.isRecurring;
    if (meetup.recurringPattern !== undefined)
      mapped.recurring_pattern = meetup.recurringPattern;
    if (meetup.requirements !== undefined)
      mapped.requirements = meetup.requirements;
    if (meetup.coverImage !== undefined) mapped.cover_image = meetup.coverImage;
    if (meetup.images !== undefined) mapped.images = meetup.images;
    if (meetup.views !== undefined) mapped.views = meetup.views;
    if (meetup.joinRequests !== undefined)
      mapped.join_requests = meetup.joinRequests;
    if (meetup.completionRate !== undefined)
      mapped.completion_rate = meetup.completionRate;
    if (meetup.engagementScore !== undefined)
      mapped.engagement_score = meetup.engagementScore;
    if (meetup.completedAt !== undefined)
      mapped.completed_at = meetup.completedAt.toISOString();
    return mapped;
  }

  private static mapHappyHourFromDB(data: any): Event {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      organizerId: data.organizer_id,
      organizerName: data.organizer_name,
      organizerAvatar: data.organizer_avatar,
      venue: data.venue,
      venueType: data.venue_type,
      location: data.location,
      locationName: data.location_name,
      address: data.address,
      startTime: new Date(data.start_time),
      endTime: new Date(data.end_time),
      timezone: data.timezone,
      category: data.category,
      subcategory: data.subcategory,
      tags: data.tags,
      price: data.price,
      currency: data.currency,
      maxAttendees: data.max_attendees,
      currentAttendees: data.current_attendees,
      coverImage: data.cover_image,
      images: data.images,
      videoUrl: data.video_url,
      status: data.status,
      isRecurring: data.is_recurring,
      recurringPattern: data.recurring_pattern,
      features: data.features,
      views: data.views,
      shares: data.shares,
      likes: data.likes,
      attendees: data.attendees,
      waitlist: data.waitlist,
      interestedUsers: data.interested_users,
      checkIns: data.check_ins,
      whosGoing: data.whos_going,
      isHappyHour: true,
      happyHourDetails: {
        discount: data.discount,
        discountPercentage: data.discount_percentage,
        dealTimeWindow: data.deal_time_window,
        specialMenuItems: data.special_menu_items,
        dealHighlights: data.deal_highlights,
      },
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }

  private static mapHappyHourToDB(event: Partial<Event>): any {
    const mapped: any = {};
    if (event.id !== undefined) mapped.id = event.id;
    if (event.title !== undefined) mapped.title = event.title;
    if (event.description !== undefined) mapped.description = event.description;
    if (event.organizerId !== undefined)
      mapped.organizer_id = event.organizerId;
    if (event.venue !== undefined) mapped.venue = event.venue;
    if (event.venueType !== undefined) mapped.venue_type = event.venueType;
    if (event.location !== undefined) mapped.location = event.location;
    if (event.locationName !== undefined)
      mapped.location_name = event.locationName;
    if (event.address !== undefined) mapped.address = event.address;
    if (event.startTime !== undefined)
      mapped.start_time = event.startTime.toISOString();
    if (event.endTime !== undefined)
      mapped.end_time = event.endTime.toISOString();
    if (event.timezone !== undefined) mapped.timezone = event.timezone;
    if (event.category !== undefined) mapped.category = event.category;
    if (event.subcategory !== undefined) mapped.subcategory = event.subcategory;
    if (event.tags !== undefined) mapped.tags = event.tags;
    if (event.price !== undefined) mapped.price = event.price;
    if (event.currency !== undefined) mapped.currency = event.currency;
    if (event.maxAttendees !== undefined)
      mapped.max_attendees = event.maxAttendees;
    if (event.currentAttendees !== undefined)
      mapped.current_attendees = event.currentAttendees;
    if (event.coverImage !== undefined) mapped.cover_image = event.coverImage;
    if (event.images !== undefined) mapped.images = event.images;
    if (event.videoUrl !== undefined) mapped.video_url = event.videoUrl;
    if (event.status !== undefined) mapped.status = event.status;
    if (event.isRecurring !== undefined)
      mapped.is_recurring = event.isRecurring;
    if (event.recurringPattern !== undefined)
      mapped.recurring_pattern = event.recurringPattern;
    if (event.features !== undefined) mapped.features = event.features;
    if (event.views !== undefined) mapped.views = event.views;
    if (event.shares !== undefined) mapped.shares = event.shares;
    if (event.likes !== undefined) mapped.likes = event.likes;
    if (event.attendees !== undefined) mapped.attendees = event.attendees;
    if (event.waitlist !== undefined) mapped.waitlist = event.waitlist;
    if (event.interestedUsers !== undefined)
      mapped.interested_users = event.interestedUsers;
    if (event.checkIns !== undefined) mapped.check_ins = event.checkIns;
    if (event.whosGoing !== undefined) mapped.whos_going = event.whosGoing;
    if (event.happyHourDetails) {
      if (event.happyHourDetails.discount !== undefined)
        mapped.discount = event.happyHourDetails.discount;
      if (event.happyHourDetails.discountPercentage !== undefined)
        mapped.discount_percentage = event.happyHourDetails.discountPercentage;
      if (event.happyHourDetails.dealTimeWindow !== undefined)
        mapped.deal_time_window = event.happyHourDetails.dealTimeWindow;
      if (event.happyHourDetails.specialMenuItems !== undefined)
        mapped.special_menu_items = event.happyHourDetails.specialMenuItems;
      if (event.happyHourDetails.dealHighlights !== undefined)
        mapped.deal_highlights = event.happyHourDetails.dealHighlights;
    }
    return mapped;
  }

  private static mapMessageRoomFromDB(data: any): MessageRoom {
    return {
      id: data.id,
      type: data.type,
      participants: data.participants,
      admins: data.admins,
      name: data.name,
      description: data.description,
      avatar: data.avatar,
      meetupRef: data.meetup_ref,
      lastMessage: data.last_message,
      settings: data.settings,
      createdTime: new Date(data.created_time),
      updatedTime: new Date(data.updated_time),
    };
  }

  private static mapMessageRoomToDB(room: Partial<MessageRoom>): any {
    const mapped: any = {};
    if (room.id !== undefined) mapped.id = room.id;
    if (room.type !== undefined) mapped.type = room.type;
    if (room.participants !== undefined)
      mapped.participants = room.participants;
    if (room.admins !== undefined) mapped.admins = room.admins;
    if (room.name !== undefined) mapped.name = room.name;
    if (room.description !== undefined) mapped.description = room.description;
    if (room.avatar !== undefined) mapped.avatar = room.avatar;
    if (room.meetupRef !== undefined) mapped.meetup_ref = room.meetupRef;
    if (room.lastMessage !== undefined) mapped.last_message = room.lastMessage;
    if (room.settings !== undefined) mapped.settings = room.settings;
    return mapped;
  }

  private static mapMessageFromDB(data: any): Message {
    return {
      id: data.id,
      messageRoomRef: data.message_room_ref,
      senderRef: data.sender_ref,
      text: data.text,
      messageType: data.message_type,
      mediaUrl: data.media_url,
      mediaThumbnail: data.media_thumbnail,
      mediaSize: data.media_size,
      mediaDuration: data.media_duration,
      isEdited: data.is_edited,
      editedAt: data.edited_at ? new Date(data.edited_at) : undefined,
      replyTo: data.reply_to,
      reactions: data.reactions,
      isRead: data.is_read,
      readBy: data.read_by,
      isDeleted: data.is_deleted,
      deletedAt: data.deleted_at ? new Date(data.deleted_at) : undefined,
      createdTime: new Date(data.created_time),
      updatedTime: new Date(data.updated_time),
    };
  }

  private static mapMessageToDB(message: Partial<Message>): any {
    const mapped: any = {};
    if (message.id !== undefined) mapped.id = message.id;
    if (message.messageRoomRef !== undefined)
      mapped.message_room_ref = message.messageRoomRef;
    if (message.senderRef !== undefined) mapped.sender_ref = message.senderRef;
    if (message.text !== undefined) mapped.text = message.text;
    if (message.messageType !== undefined)
      mapped.message_type = message.messageType;
    if (message.mediaUrl !== undefined) mapped.media_url = message.mediaUrl;
    if (message.mediaThumbnail !== undefined)
      mapped.media_thumbnail = message.mediaThumbnail;
    if (message.mediaSize !== undefined) mapped.media_size = message.mediaSize;
    if (message.mediaDuration !== undefined)
      mapped.media_duration = message.mediaDuration;
    if (message.isEdited !== undefined) mapped.is_edited = message.isEdited;
    if (message.editedAt !== undefined)
      mapped.edited_at = message.editedAt.toISOString();
    if (message.replyTo !== undefined) mapped.reply_to = message.replyTo;
    if (message.reactions !== undefined) mapped.reactions = message.reactions;
    if (message.isRead !== undefined) mapped.is_read = message.isRead;
    if (message.readBy !== undefined) mapped.read_by = message.readBy;
    if (message.isDeleted !== undefined) mapped.is_deleted = message.isDeleted;
    if (message.deletedAt !== undefined)
      mapped.deleted_at = message.deletedAt.toISOString();
    return mapped;
  }

  private static mapNotificationFromDB(data: any): Notification {
    return {
      id: data.id,
      receiverRef: data.receiver_ref,
      senderRef: data.sender_ref,
      meetupRef: data.meetup_ref,
      postRef: data.post_ref,
      eventRef: data.happy_hour_ref,
      title: data.title,
      message: data.message,
      notificationType: data.notification_type,
      isRead: data.is_read,
      readAt: data.read_at ? new Date(data.read_at) : undefined,
      actionRequired: data.action_required,
      actionTaken: data.action_taken,
      metadata: data.metadata,
      createdAt: new Date(data.created_at),
      scheduledFor: data.scheduled_for
        ? new Date(data.scheduled_for)
        : undefined,
    };
  }

  private static mapNotificationToDB(notification: Partial<Notification>): any {
    const mapped: any = {};
    if (notification.id !== undefined) mapped.id = notification.id;
    if (notification.receiverRef !== undefined)
      mapped.receiver_ref = notification.receiverRef;
    if (notification.senderRef !== undefined)
      mapped.sender_ref = notification.senderRef;
    if (notification.meetupRef !== undefined)
      mapped.meetup_ref = notification.meetupRef;
    if (notification.postRef !== undefined)
      mapped.post_ref = notification.postRef;
    if (notification.eventRef !== undefined)
      mapped.happy_hour_ref = notification.eventRef;
    if (notification.title !== undefined) mapped.title = notification.title;
    if (notification.message !== undefined)
      mapped.message = notification.message;
    if (notification.notificationType !== undefined)
      mapped.notification_type = notification.notificationType;
    if (notification.isRead !== undefined) mapped.is_read = notification.isRead;
    if (notification.readAt !== undefined)
      mapped.read_at = notification.readAt.toISOString();
    if (notification.actionRequired !== undefined)
      mapped.action_required = notification.actionRequired;
    if (notification.actionTaken !== undefined)
      mapped.action_taken = notification.actionTaken;
    if (notification.metadata !== undefined)
      mapped.metadata = notification.metadata;
    if (notification.scheduledFor !== undefined)
      mapped.scheduled_for = notification.scheduledFor.toISOString();
    return mapped;
  }

  // ==================== ACCOUNT DELETION ====================

  /**
   * Delete all user data from the database
   * This method deletes records in the correct order to avoid foreign key constraints
   */
  static async deleteUserAccount(
    userId: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      // 1. Delete notifications

      const { error: notificationsError } = await supabase
        .from("notifications")
        .delete()
        .eq("receiver_ref", userId);

      if (notificationsError) {
        throw notificationsError;
      }

      // 2. Delete messages

      const { error: messagesError } = await supabase
        .from("messages")
        .delete()
        .eq("sender_ref", userId);

      if (messagesError) {
        throw messagesError;
      }

      // 3. Delete message rooms where user is a participant

      const { error: messageRoomsError } = await supabase
        .from("message_rooms")
        .delete()
        .contains("participants", [userId]);

      if (messageRoomsError) {
        throw messageRoomsError;
      }

      // 4. Delete post comments

      const { error: postCommentsError } = await supabase
        .from("post_comments")
        .delete()
        .eq("user_id", userId);

      if (postCommentsError) {
        throw postCommentsError;
      }

      // 5. Delete posts

      const { error: postsError } = await supabase
        .from("posts")
        .delete()
        .eq("user_id", userId);

      if (postsError) {
        throw postsError;
      }

      // 6. Delete meetups created by user

      const { error: meetupsError } = await supabase
        .from("meetups")
        .delete()
        .eq("creator_id", userId);

      if (meetupsError) {
        throw meetupsError;
      }

      // 7. Delete happy hours where user is a participant

      const { error: happyHoursError } = await supabase
        .from("happy_hours")
        .delete()
        .contains("attendees", [userId]);

      if (happyHoursError) {
        throw happyHoursError;
      }

      // 8. Delete user profile (this should be last)

      const { error: userError } = await supabase
        .from("users")
        .delete()
        .eq("uid", userId);

      if (userError) {
        throw userError;
      }

      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }
}
