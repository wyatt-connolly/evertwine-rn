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
  bio: string; // Short bio for standouts/cards
  about: string; // Longer about section like LinkedIn
  profilePictures: string[];
  standoutPhotoIndex?: number; // Index of the standout photo (0-5)

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
  interests: string[]; // User interests for matching

  // Meetup Intent
  lookingFor: string[]; // ["Friends", "Business", "Dating"]

  // Status & Verification
  onboardingComplete: boolean;
  isVerified: "pending" | "verified" | "rejected";
  isPaused: boolean;
  lastActive: Date;
  verifiedAt?: Date; // When user was verified

  // Analytics
  profileViews: number;
  uniqueViewers: number;
  viewsThisWeek: number;
  averageViewDuration: number;

  // User Preferences
  preferences?: UserPreferences;

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
  };

  // Media
  coverImage?: string;
  images?: string[];

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
    isRead: boolean;
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
  postRef?: string;
  commentRef?: string;
  eventRef?: string;

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
  friendRequest = "friend_request",

  // Engagement
  meetupLiked = "meetup_liked",
  meetupShared = "meetup_shared",
  meetupCommented = "meetup_commented",

  // Post Interactions
  postLiked = "post_liked",
  postCommented = "post_commented",
  postShared = "post_shared",
  commentReply = "comment_reply",
  commentLiked = "comment_liked",

  // Messages
  message = "message",

  // System
  verificationComplete = "verification_complete",
  newFeature = "new_feature",

  // Happy Hour Events
  happyHourStartingSoon = "happy_hour_starting_soon",
  happyHourInvite = "happy_hour_invite",
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

// Event Types
export interface Event {
  id: string;
  title: string;
  description: string;
  organizerId?: string;
  organizerName?: string;
  organizerAvatar?: string;

  // Venue info (for happy hours)
  venue?: string;
  venueType?: string;

  // Location & Time
  location: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
  address: string;
  startTime: Date;
  endTime: Date;
  timezone: string;

  // Event Details
  category: string;
  subcategory: string;
  tags: string[];
  price: number;
  currency: string;
  maxAttendees: number;
  currentAttendees: number;

  // Media
  coverImage: string;
  images: string[];
  videoUrl?: string;

  // Status
  status: "draft" | "published" | "cancelled" | "completed";
  isRecurring: boolean;
  recurringPattern?: {
    frequency: "daily" | "weekly" | "monthly" | "yearly";
    daysOfWeek?: number[];
    endDate?: Date;
  };

  // Features
  features: {
    hasQRCode: boolean;
    hasTickets: boolean;
    hasCoupons: boolean;
    allowsSharing: boolean;
    requiresVerification: boolean;
  };

  // Analytics
  views: number;
  shares: number;
  likes: number;
  attendees: string[];
  waitlist: string[];

  // Happy hour participation (updated for venue-based events)
  interestedUsers?: string[];
  checkIns?: number;
  whosGoing?: {
    id: string;
    name: string;
    avatar: string;
    isCheckedIn: boolean;
  }[]; // Who's going to the happy hour event

  // Happy hour specific data
  isHappyHour?: boolean;
  happyHourDetails?: {
    discount?: string; // e.g., "50% off", "Buy 1 Get 1 Free"
    discountPercentage?: number;
    dealTimeWindow: string; // e.g., "4pm-7pm daily"
    specialMenuItems?: {
      name: string;
      originalPrice: number;
      dealPrice: number;
      description?: string;
    }[];
    dealHighlights?: string[]; // e.g., ["Half-price cocktails", "$5 appetizers"]
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// Place/Review Types
export interface Place {
  id: string;
  name: string;
  title: string; // Display title for the place
  category: string;
  address: string;
  location: {
    latitude: number;
    longitude: number;
  };
  rating: number;
  reviewCount: number;
  priceLevel: number;
  photos: string[];
  hours: {
    [key: string]: { open: string; close: string; closed?: boolean };
  };
  features: string[];
  description: string;
}

export interface PlaceReview {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  review: string;
  photos: string[];
  visitDate: Date;
  helpful: number;
  verified: boolean;
  createdAt: Date;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  message: string;
  images?: string[];
  likes: string[];
  comments: PostComment[];
  createdAt: Date;
  isAnnouncement?: boolean;
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  message: string;
  createdAt: Date;
}

// Activity Feed Types
export interface ActivityItem {
  id: string;
  userId: string;
  type: string;
  description: string;
  timestamp: Date;
  meetupId?: string;
  user?: User;
  meetup?: Meetup;
}

// Verification Types
export interface Verification {
  id: string;
  userId: string;
  status: "pending" | "approved" | "rejected";
  type: "id" | "selfie" | "profile_photos";

  // ID Verification
  idDocument?: {
    type: "drivers_license" | "passport" | "state_id";
    frontImage: string;
    backImage?: string;
    extractedData: {
      name: string;
      dateOfBirth: string;
      documentNumber: string;
    };
  };

  // Selfie Verification
  selfieImage?: string;
  selfieWithId?: string;

  // Profile Photos
  profilePhotos?: string[];

  // Verification Results
  verificationResults?: {
    faceMatch: boolean;
    documentValid: boolean;
    ageVerified: boolean;
    confidence: number;
  };

  // Timestamps
  submittedAt: Date;
  reviewedAt?: Date;
  expiresAt: Date;
}

// Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  plan: "free" | "plus" | "premium";
  status: "active" | "cancelled" | "expired" | "trial";
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  features: string[];
  price: number;
  currency: string;
}

// Gamification Types
export interface UserStats {
  userId: string;
  level: number;
  experience: number;
  points: number;
  achievements: Achievement[];
  streak: number;
  lastActive: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  maxProgress: number;
  unlockedAt?: Date;
}

export interface StandoutItem {
  id: string;
  type: "user" | "meetup";
  title: string;
  description: string;
  image: string;
  badge: string;
  stats: {
    followers?: number;
    participants?: number;
    rating: number;
  };
  userData?: User & {
    // Additional standout-specific user details
    achievements?: string[];
    specialties?: string[];
    languages?: string[];
    availability?: string;
    certifications?: string[];
    socialMedia?: {
      instagram?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  location?: string;
  time?: string;
}

// Tutorial Types
export interface Tutorial {
  id: string;
  title: string;
  description: string;
  screens: TutorialScreen[];
  targetAudience: "new_user" | "returning_user" | "all";
  required: boolean;
  completed: boolean;
}

export interface TutorialScreen {
  id: string;
  title: string;
  description: string;
  image: string;
  action?: {
    type: "navigate" | "tap" | "swipe";
    target: string;
    text: string;
  };
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Main: undefined;
  Login: undefined;
  Register: undefined;
  Profile: { userId?: string };
  MeetupDetails: { meetupId: string };
  EventDetails: { eventId: string };
  Chat: { roomId: string };
  PlaceDetails: { placeId: string };
  Verification: undefined;
  Tutorial: { tutorialId: string };
  Share: { type: "meetup" | "event" | "profile"; id: string };
  ActivityFeed: undefined;
  Map: undefined;
  MessageDetails: { roomId: string };
  ComposeMessage: undefined;
  Favorites: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Create: undefined;
  Messages: undefined;
  Profile: undefined;
};
