import { User, Meetup, ActivityItem } from "../types";

/**
 * Utility functions to safely convert Firebase data to app types
 * These functions handle missing properties and provide safe defaults
 */

export const convertFirebaseUserToUser = (rawData: any): User => {
  return {
    uid: rawData.uid || "",
    email: rawData.email || undefined,
    displayName: rawData.displayName || "User",
    age: rawData.age || 25,
    gender: rawData.gender || "Prefer not to say",
    pronouns: rawData.pronouns || "they/them",
    bio: rawData.bio || "",
    about: rawData.about || "",
    profilePictures: rawData.profilePictures || [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    ],
    standoutPhotoIndex:
      rawData.standoutPhotoIndex !== undefined ? rawData.standoutPhotoIndex : 0,
    location: rawData.location || { latitude: 0, longitude: 0 },
    locationName: rawData.locationName || "",
    phoneNumber: rawData.phoneNumber || "",
    school: rawData.school || "",
    jobTitle: rawData.jobTitle || "",
    jobCompany: rawData.jobCompany || "",
    professionalLevel: rawData.professionalLevel || "",
    hometown: rawData.hometown || "",
    starSign: rawData.starSign || "",
    hobbies: rawData.hobbies || [],
    interests: rawData.interests || [],
    lookingFor: rawData.lookingFor || [],
    onboardingComplete: rawData.onboardingComplete || false,
    isVerified: rawData.isVerified || "pending",
    isPaused: rawData.isPaused || false,
    lastActive: rawData.lastActive?.toDate() || new Date(),
    verifiedAt: rawData.verifiedAt?.toDate() || undefined,
    profileViews: rawData.profileViews || 0,
    uniqueViewers: rawData.uniqueViewers || 0,
    viewsThisWeek: rawData.viewsThisWeek || 0,
    averageViewDuration: rawData.averageViewDuration || 0,
    preferences: rawData.preferences || undefined,
    createdTime:
      rawData.createdTime?.toDate() ||
      rawData.createdAt?.toDate() ||
      new Date(),
    updatedTime:
      rawData.updatedTime?.toDate() ||
      rawData.updatedAt?.toDate() ||
      new Date(),
  };
};

export const convertFirebaseMeetupToMeetup = (rawData: any): Meetup => {
  return {
    id: rawData.id || "",
    title: rawData.title || "Meetup",
    description: rawData.description || "",
    creatorId: rawData.creatorId || "",
    creatorRef: rawData.creatorRef || `users/${rawData.creatorId}`,
    location: rawData.location || { latitude: 0, longitude: 0 },
    locationName: rawData.locationName || "",
    address: rawData.address || "",
    time: rawData.time?.toDate() || new Date(),
    duration: rawData.duration || 60,
    timezone: rawData.timezone || "UTC",
    activity: rawData.activity || "",
    activityCategory: rawData.activityCategory || "",
    tags: rawData.tags || [],
    connectionType: rawData.connectionType || "casual",
    maxParticipants: rawData.maxParticipants || 10,
    currentParticipants: rawData.currentParticipants || 0,
    participants: rawData.participants || [],
    waitlist: rawData.waitlist || [],
    declinedUsers: rawData.declinedUsers || [],
    status: rawData.status || "active",
    isRecurring: rawData.isRecurring || false,
    recurringPattern: rawData.recurringPattern || undefined,
    requirements: rawData.requirements || { verificationRequired: false },
    coverImage: rawData.coverImage || undefined,
    images: rawData.images || [],
    views: rawData.views || 0,
    joinRequests: rawData.joinRequests || 0,
    completionRate: rawData.completionRate || 0,
    engagementScore: rawData.engagementScore || 0,
    createdAt: rawData.createdAt?.toDate() || new Date(),
    updatedAt: rawData.updatedAt?.toDate() || new Date(),
    completedAt: rawData.completedAt?.toDate() || undefined,
  };
};

export const convertFirebaseActivityToActivity = (
  rawData: any
): ActivityItem => {
  return {
    id: rawData.id || "",
    userId: rawData.userId || "",
    type: rawData.type || "profile_viewed",
    description: rawData.description || "No description",
    timestamp: rawData.timestamp?.toDate() || new Date(),
    meetupId: rawData.meetupId || undefined,
    user: rawData.user ? convertFirebaseUserToUser(rawData.user) : undefined,
    meetup: rawData.meetup
      ? convertFirebaseMeetupToMeetup(rawData.meetup)
      : undefined,
  };
};

/**
 * Safely merge user data with fallback values
 * Useful when combining Firebase auth data with Firestore profile data
 */
export const safeUserMerge = (
  firebaseUser: any,
  profileData: any,
  mockUserFallback: User
): User => {
  const baseUser = profileData || firebaseUser || {};
  return {
    ...mockUserFallback,
    ...baseUser,
    profilePictures: baseUser.profilePictures ||
      mockUserFallback.profilePictures || [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      ],
    standoutPhotoIndex:
      baseUser.standoutPhotoIndex !== undefined
        ? baseUser.standoutPhotoIndex
        : mockUserFallback.standoutPhotoIndex || 0,
    displayName: baseUser.displayName || mockUserFallback.displayName || "User",
    bio: baseUser.bio || mockUserFallback.bio || "",
    about: baseUser.about || mockUserFallback.about || "",
    interests: baseUser.interests || mockUserFallback.interests || [],
    hobbies: baseUser.hobbies || mockUserFallback.hobbies || [],
    location: baseUser.location ||
      mockUserFallback.location || { latitude: 0, longitude: 0 },
    locationName: baseUser.locationName || mockUserFallback.locationName || "",
  };
};

/**
 * Check if a value is a valid Firebase Timestamp and convert to Date
 */
export const safeTimestampToDate = (timestamp: any): Date => {
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  if (typeof timestamp === "string") {
    return new Date(timestamp);
  }
  return new Date();
};

/**
 * Safely access nested object properties with fallback
 */
export const safeGet = (obj: any, path: string, fallback: any = null): any => {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : fallback;
  }, obj);
};
