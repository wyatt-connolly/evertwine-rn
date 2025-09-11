// Auth User Types (simplified for authentication)
export interface AuthUser {
  uid: string;
  email?: string;
  phoneNumber?: string;
  displayName?: string;
  photoURL?: string;
  onboardingComplete?: boolean;
  interests?: string[];
  location?: {
    latitude: number;
    longitude: number;
  };
  bio?: string;
}

// Core User Types (full profile)
export interface User {
  // Core Identity
  uid: string;
  email?: string; // Optional for phone users
  displayName: string;
  age: number;
  gender: string;
  pronouns: string;
  bio: string;
  profilePictures: string[];

  // Location & Contact
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  phoneNumber: string;

  // Professional Info
  school: string;
  jobTitle: string;
  jobCompany: string;
  professionalLevel: string;

  // Personal Details
  hometown: string;
  starSign: string;
  hobbies: string[];

  // Status & Verification
  onboardingComplete: boolean;
  isVerified: "pending" | "verified" | "rejected";
  isPaused: boolean;
  lastActive: Date;

  // Analytics
  profileViews: number;
  uniqueViewers: number;
  viewsThisWeek: number;
  averageViewDuration: number;

  // Timestamps
  createdTime: Date;
  updatedTime: Date;
}

// User Preferences
export interface UserPreferences {
  // Age Preferences
  minAgePreference: number;
  maxAgePreference: number;

  // Gender Preferences
  genderPreference: string[];

  // Location Preferences
  locationPreference: number; // km radius
  preferredNeighborhoods: string[];

  // Activity Preferences
  activityPreferences: string[];
  timePreferences: string[];
  groupSizePreference: string;

  // Notification Preferences
  notificationSettings: {
    all: boolean;
    likes: boolean;
    messages: boolean;
    announcements: boolean;
    requests: boolean;
    reservationInvites: boolean;
  };
}

// Meetup Types
export interface Meetup {
  // Basic Info
  id: string;
  title: string;
  description: string;
  creatorId: string;
  creatorRef: string;

  // Location & Time
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  address: string;
  time: Date;
  duration: number; // in minutes
  timezone: string;

  // Activity Details
  activity: string;
  activityCategory: string;
  tags: string[];
  connectionType: string;

  // Participant Management
  maxParticipants: number;
  currentParticipants: number;
  participants: string[];
  waitlist: string[];
  declinedUsers: string[];

  // Status & State
  status: "draft" | "active" | "full" | "completed" | "cancelled";
  isRecurring: boolean;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly";
    daysOfWeek?: number[];
    endDate?: Date;
  };

  // Requirements & Restrictions
  requirements: {
    minAge?: number;
    maxAge?: number;
    genderRestriction?: string;
    verificationRequired: boolean;
    skillLevel?: string;
  };

  // Analytics
  views: number;
  joinRequests: number;
  completionRate: number;
  engagementScore: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

// Message Types
export interface MessageRoom {
  id: string;
  type: "direct" | "group" | "meetup";

  // Participants
  participants: string[];
  admins: string[];

  // Room Info
  name?: string;
  description?: string;
  avatar?: string;

  // Meetup Integration
  meetupRef?: string;

  // Last Message
  lastMessage?: {
    text: string;
    senderRef: string;
    timestamp: Date;
    messageType: string;
  };

  // Settings
  settings: {
    allowInvites: boolean;
    allowMedia: boolean;
    allowReactions: boolean;
  };

  // Timestamps
  createdTime: Date;
  updatedTime: Date;
}

export interface Message {
  id: string;
  messageRoomRef: string;
  senderRef: string;
  text: string;

  // Message Types
  messageType: "text" | "image" | "video" | "audio" | "location" | "system";
  mediaUrl?: string;
  mediaThumbnail?: string;
  mediaSize?: number;
  mediaDuration?: number;

  // Message Features
  isEdited: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions: Record<string, string[]>; // emoji -> user IDs

  // Status
  isRead: boolean;
  readBy: Record<string, Date>;
  isDeleted: boolean;
  deletedAt?: Date;

  // Timestamps
  createdTime: Date;
  updatedTime: Date;
}

// Notification Types
export interface Notification {
  id: string;
  receiverRef: string;
  senderRef?: string;
  meetupRef?: string;

  // Notification Content
  title: string;
  message: string;
  notificationType: NotificationType;

  // Status
  isRead: boolean;
  readAt?: Date;
  actionRequired: boolean;
  actionTaken?: boolean;

  // Metadata
  metadata?: {
    deepLink?: string;
    imageUrl?: string;
    priority: "low" | "medium" | "high";
  };

  // Timestamps
  createdAt: Date;
  scheduledFor?: Date;
}

export enum NotificationType {
  // Profile Interactions
  profileView = "profile_view",
  profileLike = "profile_like",
  profileViewReturn = "profile_view_return",

  // Meetup Interactions
  meetupRequest = "meetup_request",
  meetupAccepted = "meetup_accepted",
  meetupDeclined = "meetup_declined",
  meetupReminder = "meetup_reminder",
  meetupStartingSoon = "meetup_starting_soon",
  meetupCancelled = "meetup_cancelled",

  // Social Features
  newFollower = "new_follower",
  mutualConnection = "mutual_connection",
  friendSuggestion = "friend_suggestion",

  // Engagement
  meetupLiked = "meetup_liked",
  meetupShared = "meetup_shared",
  meetupCommented = "meetup_commented",

  // System
  verificationComplete = "verification_complete",
  newFeature = "new_feature",
}

// AI Types
export interface AIRecommendation {
  id: string;
  userId: string;
  meetupId: string;
  confidence: number; // 0-100
  reasoning: string;
  factors: {
    interestAlignment: number;
    locationProximity: number;
    timeCompatibility: number;
    socialCompatibility: number;
  };
  createdAt: Date;
  expiresAt: Date;
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Profile: { userId?: string };
  MeetupDetails: { meetupId: string };
  Chat: { roomId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Create: undefined;
  Messages: undefined;
  Notifications: undefined;
  Settings: undefined;
};
