import {
  Meetup,
  Event,
  Place,
  PlaceReview,
  User,
  Notification,
  NotificationType,
  Badge,
  Achievement,
  UserStats,
  Tutorial,
  TutorialScreen,
} from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    uid: "user1",
    email: "alex@example.com",
    displayName: "Alex Chen",
    age: 28,
    gender: "Non-binary",
    pronouns: "they/them",
    bio: "Adventure seeker and coffee enthusiast. Love hiking, photography, and meeting new people!",
    profilePictures: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    ],
    location: { latitude: 37.7749, longitude: -122.4194 },
    locationName: "San Francisco, CA",
    phoneNumber: "+1234567890",
    school: "UC Berkeley",
    jobTitle: "Software Engineer",
    jobCompany: "Tech Corp",
    professionalLevel: "Senior",
    hometown: "Seattle, WA",
    starSign: "Gemini",
    hobbies: ["Hiking", "Photography", "Coffee", "Travel"],
    onboardingComplete: true,
    isVerified: "verified",
    isPaused: false,
    lastActive: new Date(),
    profileViews: 1250,
    uniqueViewers: 890,
    viewsThisWeek: 45,
    averageViewDuration: 120,
    createdTime: new Date("2024-01-15"),
    updatedTime: new Date(),
  },
  {
    uid: "user2",
    email: "maya@example.com",
    displayName: "Maya Rodriguez",
    age: 25,
    gender: "Female",
    pronouns: "she/her",
    bio: "Artist and yoga instructor. Passionate about wellness, creativity, and building community.",
    profilePictures: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "San Francisco, CA",
    phoneNumber: "+1234567891",
    school: "Art Institute",
    jobTitle: "Yoga Instructor",
    jobCompany: "Zen Studio",
    professionalLevel: "Mid-level",
    hometown: "Los Angeles, CA",
    starSign: "Pisces",
    hobbies: ["Yoga", "Painting", "Meditation", "Cooking"],
    onboardingComplete: true,
    isVerified: "verified",
    isPaused: false,
    lastActive: new Date(),
    profileViews: 980,
    uniqueViewers: 720,
    viewsThisWeek: 32,
    averageViewDuration: 95,
    createdTime: new Date("2024-02-10"),
    updatedTime: new Date(),
  },
  {
    uid: "user3",
    email: "james@example.com",
    displayName: "James Wilson",
    age: 32,
    gender: "Male",
    pronouns: "he/him",
    bio: "Entrepreneur and fitness enthusiast. Always up for a challenge and love connecting with like-minded people.",
    profilePictures: [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    ],
    location: { latitude: 37.7649, longitude: -122.4294 },
    locationName: "San Francisco, CA",
    phoneNumber: "+1234567892",
    school: "Stanford University",
    jobTitle: "Startup Founder",
    jobCompany: "InnovateLab",
    professionalLevel: "Executive",
    hometown: "Boston, MA",
    starSign: "Aries",
    hobbies: ["Fitness", "Entrepreneurship", "Reading", "Networking"],
    onboardingComplete: true,
    isVerified: "verified",
    isPaused: false,
    lastActive: new Date(),
    profileViews: 2100,
    uniqueViewers: 1500,
    viewsThisWeek: 78,
    averageViewDuration: 180,
    createdTime: new Date("2023-11-20"),
    updatedTime: new Date(),
  },
];

// Mock Meetups
export const mockMeetups: Meetup[] = [
  {
    id: "meetup1",
    title: "Morning Yoga in Golden Gate Park",
    description:
      "Join us for a peaceful morning yoga session in the beautiful Golden Gate Park. All levels welcome!",
    creatorId: "user2",
    creatorRef: "users/user2",
    location: { latitude: 37.7694, longitude: -122.4862 },
    locationName: "Golden Gate Park",
    address: "Golden Gate Park, San Francisco, CA",
    time: new Date("2024-09-15T08:00:00"),
    duration: 60,
    timezone: "PST",
    activity: "Yoga",
    activityCategory: "Fitness & Wellness",
    tags: ["yoga", "morning", "outdoor", "beginner-friendly"],
    connectionType: "casual",
    maxParticipants: 15,
    currentParticipants: 8,
    participants: ["user1", "user2", "user3"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "weekly",
      daysOfWeek: [0], // Sunday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 18,
      maxAge: 65,
      verificationRequired: false,
      skillLevel: "beginner",
    },
    views: 245,
    joinRequests: 12,
    completionRate: 85,
    engagementScore: 92,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date(),
  },
  {
    id: "meetup2",
    title: "Tech Networking Happy Hour",
    description:
      "Connect with fellow tech professionals over drinks and appetizers. Great opportunity to expand your network!",
    creatorId: "user3",
    creatorRef: "users/user3",
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "The View Lounge",
    address: "123 Market St, San Francisco, CA",
    time: new Date("2024-09-14T18:00:00"),
    duration: 120,
    timezone: "PST",
    activity: "Networking",
    activityCategory: "Professional",
    tags: ["networking", "tech", "happy-hour", "professional"],
    connectionType: "professional",
    maxParticipants: 50,
    currentParticipants: 32,
    participants: ["user1", "user3"],
    waitlist: ["user2"],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 21,
      verificationRequired: true,
      skillLevel: "professional",
    },
    views: 890,
    joinRequests: 45,
    completionRate: 78,
    engagementScore: 88,
    coverImage:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    ],
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date(),
  },
  {
    id: "meetup3",
    title: "Photography Walk - Mission District",
    description:
      "Explore the vibrant street art and architecture of the Mission District through photography. Bring your camera!",
    creatorId: "user1",
    creatorRef: "users/user1",
    location: { latitude: 37.7599, longitude: -122.4148 },
    locationName: "Mission District",
    address: "Mission District, San Francisco, CA",
    time: new Date("2024-09-16T14:00:00"),
    duration: 180,
    timezone: "PST",
    activity: "Photography",
    activityCategory: "Arts & Culture",
    tags: ["photography", "street-art", "walking", "creative"],
    connectionType: "casual",
    maxParticipants: 12,
    currentParticipants: 6,
    participants: ["user1"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 16,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 156,
    joinRequests: 8,
    completionRate: 92,
    engagementScore: 85,
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1464822759844-d150baec6d9b?w=800",
    ],
    createdAt: new Date("2024-09-01"),
    updatedAt: new Date(),
  },
];

// Mock Events
export const mockEvents: Event[] = [
  {
    id: "event1",
    title: "San Francisco Food Festival 2024",
    description:
      "Join us for the biggest food festival of the year! Featuring local chefs, food trucks, and live music.",
    organizerId: "user3",
    organizerName: "James Wilson",
    organizerAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "Fort Mason Center",
    address: "2 Marina Blvd, San Francisco, CA 94123",
    venue: "Fort Mason Center",
    startTime: new Date("2024-09-20T11:00:00"),
    endTime: new Date("2024-09-20T20:00:00"),
    timezone: "PST",
    category: "Food & Drink",
    subcategory: "Food Festival",
    tags: ["food", "festival", "music", "family-friendly"],
    price: 25,
    currency: "USD",
    maxAttendees: 500,
    currentAttendees: 234,
    coverImage:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    ],
    status: "published",
    isRecurring: false,
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: true,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 1250,
    shares: 89,
    likes: 156,
    attendees: ["user1", "user2"],
    waitlist: [],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date(),
  },
  {
    id: "event2",
    title: "Sunset Yoga & Meditation Retreat",
    description:
      "A peaceful evening of yoga, meditation, and mindfulness in a beautiful outdoor setting.",
    organizerId: "user2",
    organizerName: "Maya Rodriguez",
    organizerAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    location: { latitude: 37.7694, longitude: -122.4862 },
    locationName: "Crissy Field",
    address: "Crissy Field, San Francisco, CA",
    venue: "Crissy Field Beach",
    startTime: new Date("2024-09-18T17:30:00"),
    endTime: new Date("2024-09-18T19:30:00"),
    timezone: "PST",
    category: "Health & Wellness",
    subcategory: "Yoga",
    tags: ["yoga", "meditation", "sunset", "wellness"],
    price: 15,
    currency: "USD",
    maxAttendees: 30,
    currentAttendees: 18,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    status: "published",
    isRecurring: true,
    recurringPattern: {
      frequency: "weekly",
      daysOfWeek: [3], // Wednesday
      endDate: new Date("2024-11-30"),
    },
    features: {
      hasQRCode: true,
      hasTickets: true,
      hasCoupons: false,
      allowsSharing: true,
      requiresVerification: false,
    },
    views: 456,
    shares: 23,
    likes: 67,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date(),
  },
];

// Mock Places
export const mockPlaces: Place[] = [
  {
    id: "place1",
    name: "Blue Bottle Coffee",
    category: "Coffee Shop",
    address: "66 Mint St, San Francisco, CA 94103",
    location: { latitude: 37.7749, longitude: -122.4194 },
    rating: 4.5,
    reviewCount: 1247,
    priceLevel: 2,
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800",
    ],
    hours: {
      monday: { open: "06:00", close: "19:00" },
      tuesday: { open: "06:00", close: "19:00" },
      wednesday: { open: "06:00", close: "19:00" },
      thursday: { open: "06:00", close: "19:00" },
      friday: { open: "06:00", close: "19:00" },
      saturday: { open: "07:00", close: "20:00" },
      sunday: { open: "07:00", close: "20:00" },
    },
    features: ["WiFi", "Outdoor Seating", "Pet Friendly", "Takeout"],
    description:
      "Artisanal coffee roastery with minimalist design and exceptional single-origin beans.",
  },
  {
    id: "place2",
    name: "Mission Dolores Park",
    category: "Park",
    address: "Dolores St & 19th St, San Francisco, CA 94114",
    location: { latitude: 37.7596, longitude: -122.4269 },
    rating: 4.7,
    reviewCount: 2156,
    priceLevel: 0,
    photos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    hours: {
      monday: { open: "06:00", close: "22:00" },
      tuesday: { open: "06:00", close: "22:00" },
      wednesday: { open: "06:00", close: "22:00" },
      thursday: { open: "06:00", close: "22:00" },
      friday: { open: "06:00", close: "22:00" },
      saturday: { open: "06:00", close: "22:00" },
      sunday: { open: "06:00", close: "22:00" },
    },
    features: ["Dog Park", "Playground", "Tennis Courts", "Picnic Areas"],
    description:
      "Popular neighborhood park with stunning city views, perfect for picnics and outdoor activities.",
  },
];

// Mock Place Reviews
export const mockPlaceReviews: PlaceReview[] = [
  {
    id: "review1",
    placeId: "place1",
    userId: "user1",
    userName: "Alex Chen",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    rating: 5,
    review:
      "Amazing coffee and great atmosphere! The baristas are knowledgeable and the space is perfect for working or meeting friends.",
    photos: [
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400",
    ],
    visitDate: new Date("2024-09-10"),
    helpful: 12,
    verified: true,
    createdAt: new Date("2024-09-10"),
  },
  {
    id: "review2",
    placeId: "place2",
    userId: "user2",
    userName: "Maya Rodriguez",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    rating: 4,
    review:
      "Beautiful park with great views! Perfect for yoga sessions and picnics. Can get crowded on weekends though.",
    photos: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    ],
    visitDate: new Date("2024-09-08"),
    helpful: 8,
    verified: true,
    createdAt: new Date("2024-09-08"),
  },
];

// Mock Notifications - Account specific
export const mockNotifications: Notification[] = [
  {
    id: "notif1",
    receiverRef: "users/user1",
    senderRef: "users/user2",
    meetupRef: "meetups/meetup1",
    title: "New Meetup Request",
    message: "Maya Rodriguez wants to join your yoga session",
    notificationType: NotificationType.meetupRequest,
    isRead: false,
    actionRequired: true,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "medium",
    },
    createdAt: new Date("2024-09-13T10:30:00"),
  },
  {
    id: "notif2",
    receiverRef: "users/user1",
    senderRef: "users/user3",
    title: "Meetup Accepted",
    message:
      "Your request to join Tech Networking Happy Hour has been accepted!",
    notificationType: NotificationType.meetupAccepted,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "high",
    },
    createdAt: new Date("2024-09-12T15:45:00"),
  },
  {
    id: "notif3",
    receiverRef: "users/user1",
    senderRef: "users/user2",
    title: "New Message",
    message: "Maya Rodriguez sent you a message",
    notificationType: NotificationType.message,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "medium",
    },
    createdAt: new Date("2024-09-13T08:15:00"),
  },
  {
    id: "notif4",
    receiverRef: "users/user1",
    senderRef: "users/user3",
    title: "Friend Request",
    message: "James Wilson sent you a friend request",
    notificationType: NotificationType.friendRequest,
    isRead: false,
    actionRequired: true,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "medium",
    },
    createdAt: new Date("2024-09-12T20:30:00"),
  },
  {
    id: "notif5",
    receiverRef: "users/user1",
    senderRef: "users/user2",
    title: "Meetup Reminder",
    message: "Your yoga session starts in 1 hour",
    notificationType: NotificationType.meetupReminder,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "high",
    },
    createdAt: new Date("2024-09-13T07:00:00"),
  },
];

// Mock Badges
export const mockBadges: Badge[] = [
  {
    id: "badge1",
    name: "First Meetup",
    description: "Created your first meetup",
    icon: "trophy",
    category: "milestone",
    rarity: "common",
    unlockedAt: new Date("2024-08-01"),
  },
  {
    id: "badge2",
    name: "Social Butterfly",
    description: "Joined 10 meetups",
    icon: "people",
    category: "social",
    rarity: "rare",
    unlockedAt: new Date("2024-09-01"),
  },
  {
    id: "badge3",
    name: "Verified Explorer",
    description: "Completed ID verification",
    icon: "checkmark-circle",
    category: "verification",
    rarity: "epic",
    unlockedAt: new Date("2024-08-15"),
  },
  {
    id: "badge4",
    name: "Early Bird",
    description: "Joined 5 morning meetups",
    icon: "sunny",
    category: "activity",
    rarity: "common",
    unlockedAt: new Date("2024-09-05"),
  },
  {
    id: "badge5",
    name: "Night Owl",
    description: "Joined 5 evening meetups",
    icon: "moon",
    category: "activity",
    rarity: "common",
    unlockedAt: new Date("2024-09-08"),
  },
  {
    id: "badge6",
    name: "Fitness Fanatic",
    description: "Joined 15 fitness meetups",
    icon: "fitness",
    category: "fitness",
    rarity: "rare",
    unlockedAt: new Date("2024-09-10"),
  },
  {
    id: "badge7",
    name: "Creative Soul",
    description: "Joined 10 creative meetups",
    icon: "color-palette",
    category: "creative",
    rarity: "rare",
    unlockedAt: new Date("2024-09-12"),
  },
  {
    id: "badge8",
    name: "Community Leader",
    description: "Created 20 successful meetups",
    icon: "star",
    category: "leadership",
    rarity: "legendary",
    unlockedAt: new Date("2024-09-13"),
  },
  {
    id: "badge9",
    name: "Photography Pro",
    description: "Shared 50 photos in meetups",
    icon: "camera",
    category: "photography",
    rarity: "epic",
    unlockedAt: new Date("2024-09-11"),
  },
  {
    id: "badge10",
    name: "Wellness Warrior",
    description: "Completed 30 wellness activities",
    icon: "leaf",
    category: "wellness",
    rarity: "rare",
    unlockedAt: new Date("2024-09-09"),
  },
];

// Mock Achievements
export const mockAchievements: Achievement[] = [
  {
    id: "achieve1",
    name: "Meetup Master",
    description: "Host 5 successful meetups",
    icon: "🏆",
    progress: 3,
    maxProgress: 5,
    unlockedAt: undefined,
  },
  {
    id: "achieve2",
    name: "Community Builder",
    description: "Help 20 people connect",
    icon: "🤝",
    progress: 12,
    maxProgress: 20,
    unlockedAt: undefined,
  },
];

// Mock User Stats
export const mockUserStats: UserStats = {
  userId: "user1",
  level: 5,
  experience: 1250,
  points: 3420,
  badges: mockBadges,
  achievements: mockAchievements,
  streak: 7,
  lastActive: new Date(),
};

// Mock Tutorials
export const mockTutorials: Tutorial[] = [
  {
    id: "tutorial1",
    title: "Welcome to Evertwine",
    description: "Learn the basics of connecting with people through meetups",
    screens: [
      {
        id: "screen1",
        title: "Discover Meetups",
        description: "Browse and join meetups that match your interests",
        image:
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800",
        action: {
          type: "navigate",
          target: "Home",
          text: "Let's explore!",
        },
      },
      {
        id: "screen2",
        title: "Create Your Own",
        description: "Host meetups and bring people together",
        image:
          "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
        action: {
          type: "navigate",
          target: "Create",
          text: "Create a meetup",
        },
      },
    ],
    targetAudience: "new_user",
    required: true,
    completed: false,
  },
];

// Helper functions for mock data
export const getMockMeetups = (limit?: number): Meetup[] => {
  return limit ? mockMeetups.slice(0, limit) : mockMeetups;
};

export const getMockEvents = (limit?: number): Event[] => {
  return limit ? mockEvents.slice(0, limit) : mockEvents;
};

export const getMockPlaces = (limit?: number): Place[] => {
  return limit ? mockPlaces.slice(0, limit) : mockPlaces;
};

export const getMockUsers = (limit?: number): User[] => {
  return limit ? mockUsers.slice(0, limit) : mockUsers;
};

export const getMockNotifications = (limit?: number): Notification[] => {
  return limit ? mockNotifications.slice(0, limit) : mockNotifications;
};

export const getMockPlaceReviews = (placeId: string): PlaceReview[] => {
  return mockPlaceReviews.filter((review) => review.placeId === placeId);
};

export const getMockUserStats = (userId: string): UserStats | undefined => {
  return userId === "user1" ? mockUserStats : undefined;
};

export const getMockTutorials = (): Tutorial[] => {
  return mockTutorials;
};

// Get user-specific notifications
export const getUserNotifications = (userId: string): Notification[] => {
  return mockNotifications.filter(
    (notification) => notification.receiverRef === `users/${userId}`
  );
};

// Get activity feed with pagination
export const getActivityFeed = (
  page: number = 0,
  limit: number = 5
): ActivityItem[] => {
  const startIndex = page * limit;
  const endIndex = startIndex + limit;
  return mockActivityFeed.slice(startIndex, endIndex);
};

// Interface for ActivityItem (needed for mock data)
interface ActivityItem {
  id: string;
  type:
    | "meetup_created"
    | "meetup_joined"
    | "meetup_liked"
    | "profile_viewed"
    | "friend_added";
  user: User;
  meetup?: Meetup;
  timestamp: Date;
  description: string;
}

// Mock Activity Feed Data with pagination
export const mockActivityFeed: ActivityItem[] = [
  {
    id: "activity1",
    type: "meetup_created",
    user: getMockUsers()[1], // Maya
    meetup: getMockMeetups()[0],
    timestamp: new Date("2024-09-13T10:30:00"),
    description: "created a new meetup",
  },
  {
    id: "activity2",
    type: "meetup_joined",
    user: getMockUsers()[2], // James
    meetup: getMockMeetups()[1],
    timestamp: new Date("2024-09-13T09:15:00"),
    description: "joined a meetup",
  },
  {
    id: "activity3",
    type: "meetup_liked",
    user: getMockUsers()[0], // Alex
    meetup: getMockMeetups()[2],
    timestamp: new Date("2024-09-13T08:45:00"),
    description: "liked a meetup",
  },
  {
    id: "activity4",
    type: "profile_viewed",
    user: getMockUsers()[1], // Maya
    timestamp: new Date("2024-09-13T07:20:00"),
    description: "viewed your profile",
  },
  {
    id: "activity5",
    type: "friend_added",
    user: getMockUsers()[2], // James
    timestamp: new Date("2024-09-12T16:30:00"),
    description: "added you as a friend",
  },
  {
    id: "activity6",
    type: "meetup_created",
    user: getMockUsers()[0], // Alex
    meetup: getMockMeetups()[2],
    timestamp: new Date("2024-09-12T14:15:00"),
    description: "created a new meetup",
  },
  {
    id: "activity7",
    type: "meetup_joined",
    user: getMockUsers()[1], // Maya
    meetup: getMockMeetups()[0],
    timestamp: new Date("2024-09-12T12:00:00"),
    description: "joined a meetup",
  },
  {
    id: "activity8",
    type: "profile_viewed",
    user: getMockUsers()[2], // James
    timestamp: new Date("2024-09-12T10:30:00"),
    description: "viewed your profile",
  },
  {
    id: "activity9",
    type: "meetup_liked",
    user: getMockUsers()[0], // Alex
    meetup: getMockMeetups()[1],
    timestamp: new Date("2024-09-11T18:45:00"),
    description: "liked a meetup",
  },
  {
    id: "activity10",
    type: "friend_added",
    user: getMockUsers()[1], // Maya
    timestamp: new Date("2024-09-11T16:20:00"),
    description: "added you as a friend",
  },
];

// Get total activity count for pagination
export const getActivityFeedTotal = (): number => {
  return mockActivityFeed.length;
};
