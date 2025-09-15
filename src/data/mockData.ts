import {
  Meetup,
  Event,
  Place,
  PlaceReview,
  User,
  Notification,
  NotificationType,
  Achievement,
  UserStats,
  Tutorial,
  TutorialScreen,
  StandoutItem,
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
    bio: "Adventure seeker and coffee enthusiast. Love hiking, photography, and meeting new people! Currently working as a Senior Software Engineer at a tech startup, passionate about building meaningful connections through technology and outdoor adventures.",
    profilePictures: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
    ],
    standoutPhotoIndex: 0,
    location: { latitude: 37.7749, longitude: -122.4194 },
    locationName: "San Francisco, CA",
    phoneNumber: "+1234567890",
    school: "UC Berkeley",
    jobTitle: "Senior Software Engineer",
    jobCompany: "InnovateTech Solutions",
    professionalLevel: "Senior",
    hometown: "Seattle, WA",
    starSign: "Gemini",
    hobbies: [
      "Hiking",
      "Photography",
      "Coffee",
      "Travel",
      "Rock Climbing",
      "Board Games",
      "Cooking",
      "Reading",
    ],
    lookingFor: ["Friends", "Business", "Dating"],
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
    bio: "Artist and yoga instructor. Passionate about wellness, creativity, and building community. I believe in the power of mindfulness and self-expression to bring people together. Always excited to share my love for yoga and art with new friends!",
    profilePictures: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    ],
    standoutPhotoIndex: 1,
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "San Francisco, CA",
    phoneNumber: "+1234567891",
    school: "San Francisco Art Institute",
    jobTitle: "Yoga Instructor & Studio Manager",
    jobCompany: "Zen Wellness Studio",
    professionalLevel: "Mid-level",
    hometown: "Los Angeles, CA",
    starSign: "Pisces",
    hobbies: [
      "Yoga",
      "Painting",
      "Meditation",
      "Cooking",
      "Dancing",
      "Poetry",
      "Gardening",
      "Pottery",
    ],
    lookingFor: ["Friends", "Business"],
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
    standoutPhotoIndex: 0,
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
    lookingFor: ["Business", "Friends"],
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
  // Standout User Meetups
  {
    id: "sarah_meetup_1",
    title: "Sunrise Yoga in Central Park",
    description:
      "Start your day with peaceful yoga as the sun rises over Central Park. All levels welcome!",
    creatorId: "user_sarah_chen",
    creatorRef: "users/user_sarah_chen",
    location: { latitude: 40.7829, longitude: -73.9654 },
    locationName: "Central Park, NYC",
    address: "Central Park, New York, NY",
    time: new Date("2024-09-20T07:00:00"),
    duration: 60,
    timezone: "EST",
    activity: "Yoga",
    activityCategory: "Fitness & Wellness",
    tags: ["yoga", "morning", "outdoor", "sunrise", "beginner-friendly"],
    connectionType: "casual",
    maxParticipants: 20,
    currentParticipants: 12,
    participants: ["user_sarah_chen"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "weekly",
      daysOfWeek: [5], // Friday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 16,
      maxAge: 70,
      verificationRequired: false,
      skillLevel: "beginner",
    },
    views: 156,
    joinRequests: 8,
    completionRate: 95,
    engagementScore: 88,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    createdAt: new Date("2024-08-15"),
    updatedAt: new Date(),
  },
  {
    id: "marcus_meetup_1",
    title: "Startup Pitch Night",
    description:
      "Present your startup idea to fellow entrepreneurs and get valuable feedback.",
    creatorId: "user_marcus_rodriguez",
    creatorRef: "users/user_marcus_rodriguez",
    location: { latitude: 37.7749, longitude: -122.4194 },
    locationName: "TechConnect Hub, Silicon Valley",
    address: "TechConnect Hub, Silicon Valley, CA",
    time: new Date("2024-09-22T19:00:00"),
    duration: 180,
    timezone: "PST",
    activity: "Pitching",
    activityCategory: "Professional",
    tags: ["startup", "pitching", "entrepreneurship", "networking", "feedback"],
    connectionType: "professional",
    maxParticipants: 50,
    currentParticipants: 45,
    participants: ["user_marcus_rodriguez"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "monthly",
      daysOfWeek: [5], // Friday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 18,
      verificationRequired: true,
      skillLevel: "professional",
    },
    views: 324,
    joinRequests: 25,
    completionRate: 92,
    engagementScore: 94,
    coverImage:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
    images: [
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800",
    ],
    createdAt: new Date("2024-08-01"),
    updatedAt: new Date(),
  },
  {
    id: "emma_meetup_1",
    title: "Gallery Opening - Emerging Artists",
    description:
      "Join us for an exclusive gallery opening featuring talented emerging contemporary artists.",
    creatorId: "user_emma_thompson",
    creatorRef: "users/user_emma_thompson",
    location: { latitude: 40.7231, longitude: -74.0026 },
    locationName: "SoHo Gallery, NYC",
    address: "SoHo Gallery, New York, NY",
    time: new Date("2024-09-21T18:00:00"),
    duration: 180,
    timezone: "EST",
    activity: "Gallery Opening",
    activityCategory: "Arts & Culture",
    tags: ["art", "gallery", "contemporary", "emerging-artists", "networking"],
    connectionType: "casual",
    maxParticipants: 80,
    currentParticipants: 60,
    participants: ["user_emma_thompson"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 18,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 245,
    joinRequests: 35,
    completionRate: 88,
    engagementScore: 91,
    coverImage:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    images: [
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      "https://images.unsplash.com/photo-1464822759844-d150baec6d9b?w=800",
    ],
    createdAt: new Date("2024-08-20"),
    updatedAt: new Date(),
  },
  {
    id: "david_meetup_1",
    title: "Korean BBQ Masterclass",
    description:
      "Learn the secrets of authentic Korean BBQ from a Michelin-starred chef.",
    creatorId: "user_david_kim",
    creatorRef: "users/user_david_kim",
    location: { latitude: 40.6782, longitude: -73.9442 },
    locationName: "Kim's Kitchen, Brooklyn",
    address: "Kim's Kitchen, Brooklyn, NY",
    time: new Date("2024-09-23T18:00:00"),
    duration: 120,
    timezone: "EST",
    activity: "Cooking Class",
    activityCategory: "Food & Cooking",
    tags: ["cooking", "korean-bbq", "masterclass", "food", "hands-on"],
    connectionType: "casual",
    maxParticipants: 10,
    currentParticipants: 8,
    participants: ["user_david_kim"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "weekly",
      daysOfWeek: [1], // Monday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 18,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 189,
    joinRequests: 15,
    completionRate: 96,
    engagementScore: 93,
    coverImage:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    images: [
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    ],
    createdAt: new Date("2024-08-10"),
    updatedAt: new Date(),
  },
  {
    id: "lisa_meetup_1",
    title: "Morning Meditation Circle",
    description:
      "Start your day with guided meditation and mindfulness practices in a supportive group setting.",
    creatorId: "user_lisa_park",
    creatorRef: "users/user_lisa_park",
    location: { latitude: 40.7505, longitude: -73.9934 },
    locationName: "Mindful Moments Center, Manhattan",
    address: "Mindful Moments Center, Manhattan, NY",
    time: new Date("2024-09-24T07:30:00"),
    duration: 45,
    timezone: "EST",
    activity: "Meditation",
    activityCategory: "Wellness",
    tags: ["meditation", "mindfulness", "morning", "wellness", "guided"],
    connectionType: "casual",
    maxParticipants: 25,
    currentParticipants: 20,
    participants: ["user_lisa_park"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "weekly",
      daysOfWeek: [2], // Tuesday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 16,
      verificationRequired: false,
      skillLevel: "beginner",
    },
    views: 167,
    joinRequests: 12,
    completionRate: 94,
    engagementScore: 89,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
    ],
    createdAt: new Date("2024-08-05"),
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

// Mock Standouts
export const mockStandouts: StandoutItem[] = [
  // Popular Users
  {
    id: "standout_user_1",
    type: "user",
    title: "r Chen",
    description: "Yoga Instructor • Central Park • 5+ years experience",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
    badge: "Wellness Expert",
    stats: {
      followers: 2847,
      rating: 4.9,
    },
    userData: {
      uid: "user_sarah_chen",
      email: "sarah@example.com",
      displayName: "Sarah Chen",
      age: 29,
      gender: "Female",
      pronouns: "she/her",
      bio: "Certified yoga instructor and wellness coach with 5+ years experience. Hosts sunrise yoga sessions in Central Park and meditation workshops. Passionate about helping people find balance through movement and mindfulness.",
      profilePictures: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
      ],
      location: { latitude: 40.7829, longitude: -73.9654 },
      locationName: "Central Park, NYC",
      phoneNumber: "+1234567891",
      school: "NYU",
      jobTitle: "Yoga Instructor",
      jobCompany: "Central Park Wellness",
      professionalLevel: "Senior",
      hometown: "San Francisco, CA",
      starSign: "Libra",
      hobbies: ["Yoga", "Meditation", "Hiking", "Wellness"],
      lookingFor: ["Friends", "Wellness"],
      onboardingComplete: true,
      isVerified: "verified",
      isPaused: false,
      lastActive: new Date(),
      profileViews: 2847,
      uniqueViewers: 2100,
      viewsThisWeek: 89,
      averageViewDuration: 180,
      createdTime: new Date("2023-01-15"),
      updatedTime: new Date(),
      // Additional standout details
      achievements: [
        "Certified Yoga Alliance Instructor",
        "500+ Students Taught",
        "Featured in Yoga Journal",
      ],
      specialties: [
        "Vinyasa Flow",
        "Restorative Yoga",
        "Meditation",
        "Breathwork",
      ],
      languages: ["English", "Mandarin"],
      availability: "Weekday mornings, Weekend retreats",
      certifications: [
        "RYT-500",
        "Yin Yoga Certification",
        "Meditation Teacher Training",
      ],
      socialMedia: {
        instagram: "@sarahchenyoga",
        website: "www.sarahchenwellness.com",
      },
    },
  },
  {
    id: "standout_user_2",
    type: "user",
    title: "Marcus Rodriguez",
    description: "Tech Entrepreneur • Silicon Valley • 3 successful exits",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
    badge: "Tech Mentor",
    stats: {
      followers: 1923,
      rating: 4.8,
    },
    userData: {
      uid: "user_marcus_rodriguez",
      email: "marcus@example.com",
      displayName: "Marcus Rodriguez",
      age: 34,
      gender: "Male",
      pronouns: "he/him",
      bio: "Serial entrepreneur and startup advisor with 3 successful exits. Founder of TechConnect, a networking platform for developers. Hosts weekly pitch nights and career workshops. Loves mentoring the next generation of tech leaders.",
      profilePictures: [
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      ],
      location: { latitude: 37.7749, longitude: -122.4194 },
      locationName: "Silicon Valley, CA",
      phoneNumber: "+1234567892",
      school: "Stanford University",
      jobTitle: "Tech Entrepreneur",
      jobCompany: "TechConnect",
      professionalLevel: "Founder",
      hometown: "Austin, TX",
      starSign: "Capricorn",
      hobbies: ["Technology", "Networking", "Mentoring", "Startups"],
      lookingFor: ["Business", "Networking"],
      onboardingComplete: true,
      isVerified: "verified",
      isPaused: false,
      lastActive: new Date(),
      profileViews: 1923,
      uniqueViewers: 1500,
      viewsThisWeek: 67,
      averageViewDuration: 240,
      createdTime: new Date("2022-06-10"),
      updatedTime: new Date(),
      // Additional standout details
      achievements: [
        "3 Successful Exits",
        "Forbes 30 Under 30",
        "TechCrunch Featured",
      ],
      specialties: [
        "Startup Strategy",
        "Product Development",
        "Team Building",
        "Fundraising",
      ],
      languages: ["English", "Spanish"],
      availability: "Evening networking events, Weekend workshops",
      certifications: [
        "MBA Stanford",
        "Certified Scrum Master",
        "AWS Solutions Architect",
      ],
      socialMedia: {
        linkedin: "linkedin.com/in/marcusrodriguez",
        twitter: "@marcustech",
      },
    },
  },
  {
    id: "standout_user_3",
    type: "user",
    title: "Emma Thompson",
    description: "Art Curator • SoHo Gallery • Contemporary Art Specialist",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
    badge: "Art Curator",
    stats: {
      followers: 1567,
      rating: 4.9,
    },
    userData: {
      uid: "user_emma_thompson",
      email: "emma@example.com",
      displayName: "Emma Thompson",
      age: 31,
      gender: "Female",
      pronouns: "she/her",
      bio: "Contemporary art curator and gallery owner in SoHo. Specializes in emerging artists and hosts monthly gallery openings. Runs creative workshops for aspiring artists and art enthusiasts. Passionate about making art accessible to everyone.",
      profilePictures: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      ],
      location: { latitude: 40.7231, longitude: -74.0026 },
      locationName: "SoHo, NYC",
      phoneNumber: "+1234567893",
      school: "Parsons School of Design",
      jobTitle: "Art Curator",
      jobCompany: "SoHo Gallery",
      professionalLevel: "Senior",
      hometown: "Boston, MA",
      starSign: "Pisces",
      hobbies: ["Art", "Curating", "Creative Workshops", "Gallery Management"],
      lookingFor: ["Friends", "Business"],
      onboardingComplete: true,
      isVerified: "verified",
      isPaused: false,
      lastActive: new Date(),
      profileViews: 1567,
      uniqueViewers: 1200,
      viewsThisWeek: 45,
      averageViewDuration: 200,
      createdTime: new Date("2023-03-20"),
      updatedTime: new Date(),
      // Additional standout details
      achievements: [
        "50+ Gallery Exhibitions",
        "Art Basel Featured",
        "Museum Partnership",
      ],
      specialties: [
        "Contemporary Art",
        "Emerging Artists",
        "Art Curation",
        "Gallery Management",
      ],
      languages: ["English", "French"],
      availability: "Gallery openings, Art workshops, Weekend tours",
      certifications: [
        "MFA Parsons",
        "Art History Certification",
        "Gallery Management",
      ],
      socialMedia: {
        instagram: "@emmathompsonart",
        website: "www.sohogallery.com",
      },
    },
  },
  {
    id: "standout_user_4",
    type: "user",
    title: "David Kim",
    description: "Master Chef • Brooklyn • Michelin Star Restaurant",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    badge: "Master Chef",
    stats: {
      followers: 3241,
      rating: 4.9,
    },
    userData: {
      uid: "user_david_kim",
      email: "david@example.com",
      displayName: "David Kim",
      age: 36,
      gender: "Male",
      pronouns: "he/him",
      bio: "Michelin-starred chef and culinary instructor. Owner of 'Kim's Kitchen' restaurant in Brooklyn. Hosts weekly cooking masterclasses and food tours through NYC's best neighborhoods. Passionate about fusion cuisine and sustainable cooking.",
      profilePictures: [
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      ],
      location: { latitude: 40.6782, longitude: -73.9442 },
      locationName: "Brooklyn, NYC",
      phoneNumber: "+1234567894",
      school: "Culinary Institute of America",
      jobTitle: "Master Chef",
      jobCompany: "Kim's Kitchen",
      professionalLevel: "Executive",
      hometown: "Seoul, South Korea",
      starSign: "Taurus",
      hobbies: [
        "Cooking",
        "Food Tours",
        "Fusion Cuisine",
        "Sustainable Cooking",
      ],
      lookingFor: ["Friends", "Business"],
      onboardingComplete: true,
      isVerified: "verified",
      isPaused: false,
      lastActive: new Date(),
      profileViews: 3241,
      uniqueViewers: 2800,
      viewsThisWeek: 112,
      averageViewDuration: 220,
      createdTime: new Date("2022-09-15"),
      updatedTime: new Date(),
      // Additional standout details
      achievements: [
        "Michelin Star 2023",
        "James Beard Nominee",
        "Food Network Featured",
      ],
      specialties: [
        "Fusion Cuisine",
        "Korean BBQ",
        "Sustainable Cooking",
        "Food Tours",
      ],
      languages: ["English", "Korean", "Japanese"],
      availability: "Evening classes, Weekend food tours",
      certifications: [
        "Culinary Institute of America",
        "Michelin Star Chef",
        "Food Safety Certified",
      ],
      socialMedia: {
        instagram: "@chefdavidkim",
        website: "www.kimskitchen.com",
      },
    },
  },
  {
    id: "standout_user_5",
    type: "user",
    title: "Lisa Park",
    description: "Mindfulness Coach • Wellness Center • 8+ years experience",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop",
    badge: "Mindfulness Coach",
    stats: {
      followers: 2156,
      rating: 4.8,
    },
    userData: {
      uid: "user_lisa_park",
      email: "lisa@example.com",
      displayName: "Lisa Park",
      age: 28,
      gender: "Female",
      pronouns: "she/her",
      bio: "Certified mindfulness coach and meditation teacher with 8+ years experience. Founder of 'Mindful Moments' wellness center. Hosts daily meditation sessions and weekend retreats in the mountains. Specializes in stress reduction and emotional healing.",
      profilePictures: [
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      ],
      location: { latitude: 40.7505, longitude: -73.9934 },
      locationName: "Manhattan, NYC",
      phoneNumber: "+1234567895",
      school: "Columbia University",
      jobTitle: "Mindfulness Coach",
      jobCompany: "Mindful Moments Wellness Center",
      professionalLevel: "Senior",
      hometown: "Portland, OR",
      starSign: "Cancer",
      hobbies: ["Meditation", "Mindfulness", "Wellness", "Mountain Retreats"],
      lookingFor: ["Friends", "Wellness"],
      onboardingComplete: true,
      isVerified: "verified",
      isPaused: false,
      lastActive: new Date(),
      profileViews: 2156,
      uniqueViewers: 1800,
      viewsThisWeek: 78,
      averageViewDuration: 190,
      createdTime: new Date("2023-02-28"),
      updatedTime: new Date(),
      // Additional standout details
      achievements: [
        "1000+ Students Helped",
        "Mindfulness App Featured",
        "TEDx Speaker",
      ],
      specialties: [
        "Stress Reduction",
        "Emotional Healing",
        "Mountain Retreats",
        "Corporate Wellness",
      ],
      languages: ["English", "Korean"],
      availability: "Daily sessions, Weekend retreats",
      certifications: [
        "Certified Mindfulness Coach",
        "MBSR Teacher",
        "Psychology Degree",
      ],
      socialMedia: {
        instagram: "@lisaparkmindfulness",
        website: "www.mindfulmoments.com",
      },
    },
  },
];

export const getMockStandouts = (limit?: number): StandoutItem[] => {
  return limit ? mockStandouts.slice(0, limit) : mockStandouts;
};

// Get meetups by creator ID
export const getMeetupsByCreator = (creatorId: string): Meetup[] => {
  return mockMeetups.filter((meetup) => meetup.creatorId === creatorId);
};
