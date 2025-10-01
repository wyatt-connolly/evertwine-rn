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
  StandoutItem,
  ActivityItem,
  Post,
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
    bio: "Adventure seeker ☕️ Hiking & photography 📸 Software Engineer @InnovateTech",
    about:
      "Passionate software engineer with 5+ years of experience building scalable applications. I love combining technology with outdoor adventures - you'll often find me coding at a coffee shop or hiking in the mountains. I'm passionate about building meaningful connections through technology and believe in the power of community to drive innovation. When I'm not coding, I'm exploring new trails, capturing moments through photography, or planning my next adventure. I'm always excited to meet fellow tech enthusiasts and outdoor lovers who share my passion for both professional growth and personal exploration.",
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
    starSign: "Cancer",
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
    interests: ["Technology", "Outdoor Activities", "Photography", "Coffee"],
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
    bio: "Artist & yoga instructor 🧘‍♀️ Wellness enthusiast ✨ Building community through creativity",
    about:
      "Creative soul and certified yoga instructor with a passion for wellness and community building. I've been teaching yoga for 3 years and love helping people find balance through movement and mindfulness. My art focuses on abstract expressionism and I often incorporate wellness themes into my work. I believe in the power of creativity to heal and connect people. I host weekly art workshops and meditation sessions, and I'm always looking to collaborate with fellow artists and wellness enthusiasts. My goal is to create spaces where people can express themselves authentically while building meaningful connections.",
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
    interests: ["Art", "Wellness", "Creative Arts", "Mindfulness"],
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
    bio: "Entrepreneur 💼 Fitness enthusiast 💪 Always up for a challenge",
    about:
      "Serial entrepreneur and fitness enthusiast with a passion for building businesses and maintaining peak physical condition. I've founded two successful startups in the health tech space and believe that physical wellness directly correlates with professional success. I'm always up for a challenge, whether it's launching a new venture or pushing my limits in the gym. I love connecting with fellow entrepreneurs and fitness enthusiasts who share my drive for excellence. I believe in the power of networking and community to accelerate both personal and professional growth. When I'm not working on my latest venture, you'll find me at the gym, hiking, or planning my next business idea.",
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
    interests: ["Business", "Entrepreneurship", "Technology", "Fitness"],
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
    title: "Morning Yoga on the Beach",
    description:
      "Join us for a peaceful morning yoga session on the beautiful Pacific Beach. All levels welcome!",
    creatorId: "user2",
    creatorRef: "users/user2",
    location: { latitude: 32.797, longitude: -117.255 },
    locationName: "Pacific Beach",
    address: "Pacific Beach, San Diego, CA",
    time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
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
    location: { latitude: 32.845, longitude: -117.274 },
    locationName: "The Shores Restaurant",
    address: "8110 Camino Del Oro, La Jolla, San Diego, CA",
    time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
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
    title: "Photography Walk - Mission Beach Boardwalk",
    description:
      "Explore the vibrant beach scene and beautiful coastline of Mission Beach through photography. Bring your camera!",
    creatorId: "user1",
    creatorRef: "users/user1",
    location: { latitude: 32.77, longitude: -117.252 },
    locationName: "Mission Beach Boardwalk",
    address: "Mission Beach Boardwalk, San Diego, CA",
    time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
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
    title: "Sunrise Yoga at La Jolla Cove",
    description:
      "Start your day with peaceful yoga as the sun rises over La Jolla Cove. All levels welcome!",
    creatorId: "user_sarah_chen",
    creatorRef: "users/user_sarah_chen",
    location: { latitude: 32.8509, longitude: -117.2713 },
    locationName: "La Jolla Cove",
    address: "La Jolla Cove, San Diego, CA",
    time: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    duration: 60,
    timezone: "PST",
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
    location: { latitude: 32.7915, longitude: -117.254 },
    locationName: "Pacific Beach Innovation Hub",
    address: "Pacific Beach Innovation Hub, San Diego, CA",
    time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
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
    location: { latitude: 32.847, longitude: -117.274 },
    locationName: "La Jolla Art Gallery",
    address: "La Jolla Art Gallery, San Diego, CA",
    time: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    duration: 180,
    timezone: "PST",
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
    location: { latitude: 32.773, longitude: -117.253 },
    locationName: "Kim's Kitchen, Mission Beach",
    address: "Kim's Kitchen, Mission Beach, San Diego, CA",
    time: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    duration: 120,
    timezone: "PST",
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
    location: { latitude: 32.838, longitude: -117.272 },
    locationName: "Mindful Moments Center, La Jolla",
    address: "Mindful Moments Center, La Jolla, San Diego, CA",
    time: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    duration: 45,
    timezone: "PST",
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
  {
    id: "meetup_clairemont_1",
    title: "Weekend Book Club & Coffee",
    description:
      "Join our casual book club at a cozy Clairemont café. This month we're reading contemporary fiction. All book lovers welcome!",
    creatorId: "user1",
    creatorRef: "users/user1",
    location: { latitude: 32.822, longitude: -117.202 },
    locationName: "Clairemont Coffee House",
    address: "Clairemont Coffee House, Clairemont, San Diego, CA",
    time: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    duration: 120,
    timezone: "PST",
    activity: "Book Club",
    activityCategory: "Social & Hobbies",
    tags: ["books", "coffee", "reading", "discussion", "casual"],
    connectionType: "casual",
    maxParticipants: 12,
    currentParticipants: 7,
    participants: ["user1", "user2"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: true,
    recurringPattern: {
      frequency: "monthly",
      daysOfWeek: [6], // Saturday
      endDate: new Date("2024-12-31"),
    },
    requirements: {
      minAge: 18,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 142,
    joinRequests: 9,
    completionRate: 88,
    engagementScore: 82,
    coverImage:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
    images: [
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800",
    ],
    createdAt: new Date("2024-08-12"),
    updatedAt: new Date(),
  },
  {
    id: "meetup_clairemont_2",
    title: "Family-Friendly Park Picnic",
    description:
      "Bring the whole family for a Sunday picnic at Clairemont Community Park. Games, food, and fun for all ages!",
    creatorId: "user_sarah_chen",
    creatorRef: "users/user_sarah_chen",
    location: { latitude: 32.827, longitude: -117.205 },
    locationName: "Clairemont Community Park",
    address: "Clairemont Community Park, San Diego, CA",
    time: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    duration: 180,
    timezone: "PST",
    activity: "Picnic",
    activityCategory: "Family & Kids",
    tags: ["family", "picnic", "outdoor", "kids", "games"],
    connectionType: "casual",
    maxParticipants: 40,
    currentParticipants: 24,
    participants: ["user_sarah_chen", "user1"],
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
      minAge: 0,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 198,
    joinRequests: 18,
    completionRate: 92,
    engagementScore: 86,
    coverImage:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800",
    ],
    createdAt: new Date("2024-08-18"),
    updatedAt: new Date(),
  },
  // Additional upcoming meetups
  {
    id: "upcoming_meetup_1",
    title: "Coffee & Code Morning",
    description: "Join fellow developers for a casual coding session over coffee. Bring your laptop and work on personal projects together!",
    creatorId: "user1",
    creatorRef: "users/user1",
    location: { latitude: 37.7749, longitude: -122.4194 },
    locationName: "Blue Bottle Coffee, SF",
    address: "66 Mint St, San Francisco, CA 94103",
    time: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours from now
    duration: 120,
    timezone: "PST",
    activity: "Coding",
    activityCategory: "Technology",
    tags: ["coding", "coffee", "morning", "casual"],
    connectionType: "casual",
    maxParticipants: 12,
    currentParticipants: 5,
    participants: ["user1"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 18,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 89,
    joinRequests: 3,
    completionRate: 85,
    engagementScore: 78,
    coverImage: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
    images: ["https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "upcoming_meetup_2",
    title: "Weekend Farmers Market Tour",
    description: "Explore the best local farmers market together! We'll visit multiple vendors and share tips on finding the freshest produce.",
    creatorId: "user2",
    creatorRef: "users/user2",
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "Ferry Building Marketplace",
    address: "1 Ferry Building, San Francisco, CA 94111",
    time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 2 days + 8 hours from now (Saturday morning)
    duration: 150,
    timezone: "PST",
    activity: "Market Tour",
    activityCategory: "Food & Cooking",
    tags: ["farmers-market", "food", "weekend", "local"],
    connectionType: "casual",
    maxParticipants: 15,
    currentParticipants: 8,
    participants: ["user2"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 16,
      verificationRequired: false,
      skillLevel: "any",
    },
    views: 124,
    joinRequests: 7,
    completionRate: 90,
    engagementScore: 82,
    coverImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    images: ["https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "upcoming_meetup_3",
    title: "Sunset Photography Workshop",
    description: "Learn the basics of sunset photography with professional tips and hands-on practice at a beautiful SF location.",
    creatorId: "user1",
    creatorRef: "users/user1",
    location: { latitude: 37.8199, longitude: -122.4783 },
    locationName: "Battery Spencer",
    address: "Battery Spencer, Sausalito, CA 94965",
    time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 3 days + 18 hours from now (evening)
    duration: 120,
    timezone: "PST",
    activity: "Photography",
    activityCategory: "Arts & Culture",
    tags: ["photography", "sunset", "workshop", "golden-gate"],
    connectionType: "casual",
    maxParticipants: 10,
    currentParticipants: 6,
    participants: ["user1"],
    waitlist: [],
    declinedUsers: [],
    status: "active",
    isRecurring: false,
    requirements: {
      minAge: 18,
      verificationRequired: false,
      skillLevel: "beginner",
    },
    views: 156,
    joinRequests: 4,
    completionRate: 92,
    engagementScore: 88,
    coverImage: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
    images: ["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800"],
    createdAt: new Date(),
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
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 4 days from now + 9 hours
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
    startTime: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 12 hours from now + 2 hours
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
    title: "Blue Bottle Coffee",
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
      "Artisanal coffee roastery with minimalist design and exceptional single-origin beans. Perfect for meetings, studying, or enjoying a perfectly crafted cup of coffee.",
  },
  {
    id: "place2",
    name: "Mission Dolores Park",
    title: "Mission Dolores Park",
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
      "Popular neighborhood park with stunning city views, perfect for picnics and outdoor activities. Features tennis courts, playground, and dog-friendly areas.",
  },
  {
    id: "place3",
    name: "The Castro Theatre",
    title: "The Castro Theatre",
    category: "Movie Theater",
    address: "429 Castro St, San Francisco, CA 94114",
    location: { latitude: 37.7609, longitude: -122.435 },
    rating: 4.6,
    reviewCount: 892,
    priceLevel: 2,
    photos: [
      "https://images.unsplash.com/photo-1489599856088-4f6d1c07e9f1?w=800",
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800",
    ],
    hours: {
      monday: { open: "18:00", close: "23:00" },
      tuesday: { open: "18:00", close: "23:00" },
      wednesday: { open: "18:00", close: "23:00" },
      thursday: { open: "18:00", close: "23:00" },
      friday: { open: "17:00", close: "24:00" },
      saturday: { open: "14:00", close: "24:00" },
      sunday: { open: "14:00", close: "23:00" },
    },
    features: [
      "Historic Theater",
      "Organ Music",
      "Classic Films",
      "Special Events",
    ],
    description:
      "Historic movie palace featuring classic films, sing-alongs, and special events. Famous for its Mighty Wurlitzer organ and stunning Art Deco architecture.",
  },
  {
    id: "place4",
    name: "Ghirardelli Square",
    title: "Ghirardelli Square",
    category: "Shopping Center",
    address: "900 North Point St, San Francisco, CA 94109",
    location: { latitude: 37.8058, longitude: -122.4225 },
    rating: 4.3,
    reviewCount: 3421,
    priceLevel: 3,
    photos: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800",
      "https://images.unsplash.com/photo-1520637836862-4d197d17c90a?w=800",
    ],
    hours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "10:00", close: "22:00" },
      sunday: { open: "10:00", close: "21:00" },
    },
    features: ["Shopping", "Dining", "Bay Views", "Historic Building"],
    description:
      "Historic chocolate factory turned shopping and dining destination with stunning San Francisco Bay views. Features boutique shops, restaurants, and the famous Ghirardelli Ice Cream & Chocolate Shop.",
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
  // Meetup Notifications
  {
    id: "notif1",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user2",
    meetupRef: "meetup1",
    title: "New Meetup Request",
    message: "Maya Rodriguez wants to join your yoga session",
    notificationType: NotificationType.meetupRequest,
    isRead: false,
    actionRequired: true,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 mins ago
  },
  {
    id: "notif2",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user3",
    meetupRef: "meetup2",
    title: "Meetup Accepted",
    message:
      "Your request to join Tech Networking Happy Hour has been accepted!",
    notificationType: NotificationType.meetupAccepted,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  },
  {
    id: "notif3",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user2",
    meetupRef: "meetup1",
    title: "Meetup Starting Soon",
    message: "Morning Yoga on the Beach starts in 30 minutes!",
    notificationType: NotificationType.meetupStartingSoon,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 mins ago
  },
  {
    id: "notif4",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_sarah_chen",
    meetupRef: "meetup3",
    title: "Someone Liked Your Meetup",
    message: "Sarah Chen liked Photography Walk - Mission Beach Boardwalk",
    notificationType: NotificationType.meetupLiked,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
  },
  {
    id: "notif5",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_marcus_rodriguez",
    meetupRef: "meetup1",
    title: "New Comment on Your Meetup",
    message: 'Marcus commented: "Looking forward to this!"',
    notificationType: NotificationType.meetupCommented,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
  },

  // Post Notifications
  {
    id: "notif6",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user2",
    postRef: "post1",
    title: "Someone Liked Your Post",
    message: "Maya Rodriguez liked your post about wine tasting",
    notificationType: NotificationType.postLiked,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
  },
  {
    id: "notif7",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user3",
    postRef: "post2",
    title: "New Comment on Your Post",
    message: 'James Wilson commented: "This looks amazing!"',
    notificationType: NotificationType.postCommented,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 mins ago
  },
  {
    id: "notif8",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_david_kim",
    commentRef: "comment_123",
    postRef: "post1",
    title: "Reply to Your Comment",
    message: "David Kim replied to your comment",
    notificationType: NotificationType.commentReply,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 20 * 60 * 1000), // 20 mins ago
  },
  {
    id: "notif9",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_emma_thompson",
    postRef: "post3",
    title: "Your Post Was Shared",
    message: "Emma Thompson shared your post with her network",
    notificationType: NotificationType.postShared,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
      priority: "low",
    },
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: "notif10",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_lisa_park",
    commentRef: "comment_456",
    postRef: "post1",
    title: "Someone Liked Your Comment",
    message: "Lisa Park liked your comment",
    notificationType: NotificationType.commentLiked,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400",
      priority: "low",
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },

  // Social Notifications
  {
    id: "notif11",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user3",
    title: "New Friend Request",
    message: "James Wilson sent you a friend request",
    notificationType: NotificationType.friendRequest,
    isRead: false,
    actionRequired: true,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: "notif12",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_sarah_chen",
    title: "New Follower",
    message: "Sarah Chen started following you",
    notificationType: NotificationType.newFollower,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      priority: "medium",
    },
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
  },
  {
    id: "notif13",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_marcus_rodriguez",
    title: "Mutual Connection",
    message:
      "You and Marcus Rodriguez are now connected through 3 mutual friends",
    notificationType: NotificationType.mutualConnection,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      priority: "low",
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
  },
  {
    id: "notif14",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user_david_kim",
    title: "Profile View",
    message: "David Kim viewed your profile",
    notificationType: NotificationType.profileView,
    isRead: true,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      priority: "low",
    },
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000), // 18 hours ago
  },

  // Message Notifications
  {
    id: "notif15",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user2",
    title: "New Message",
    message: "Maya Rodriguez sent you a message",
    notificationType: NotificationType.message,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 mins ago
  },

  // Happy Hour Notifications
  {
    id: "notif16",
    receiverRef: "users/developer_demo_user",
    eventRef: "hh1",
    title: "Happy Hour Starting Soon",
    message: "Wine & Cheese Tasting starts in 1 hour at Pacific Wine Bar",
    notificationType: NotificationType.happyHourStartingSoon,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 mins ago
  },
  {
    id: "notif17",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user2",
    eventRef: "hh2",
    title: "Happy Hour Invite",
    message: "Maya Rodriguez invited you to Craft Beer Happy Hour",
    notificationType: NotificationType.happyHourInvite,
    isRead: false,
    actionRequired: true,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
  },

  // System Notifications
  {
    id: "notif18",
    receiverRef: "users/developer_demo_user",
    title: "Verification Complete",
    message:
      "Your account has been verified! You now have access to all features.",
    notificationType: NotificationType.verificationComplete,
    isRead: true,
    actionRequired: false,
    metadata: {
      priority: "high",
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: "notif19",
    receiverRef: "users/developer_demo_user",
    title: "New Feature: Map View",
    message: "Check out the new map view to discover meetups near you!",
    notificationType: NotificationType.newFeature,
    isRead: false,
    actionRequired: false,
    metadata: {
      priority: "low",
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },

  // Additional Meetup Notifications
  {
    id: "notif20",
    receiverRef: "users/developer_demo_user",
    senderRef: "users/user3",
    meetupRef: "meetup_clairemont_1",
    title: "Meetup Cancelled",
    message: "Weekend Book Club & Coffee has been cancelled by the organizer",
    notificationType: NotificationType.meetupCancelled,
    isRead: false,
    actionRequired: false,
    metadata: {
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      priority: "high",
    },
    createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000), // 7 hours ago
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
  return mockActivityFeed.slice(startIndex, endIndex).map((item) => ({
    id: item.id,
    userId: item.user.uid,
    type: item.type,
    description: item.description,
    timestamp: item.timestamp,
    meetupId: item.meetup?.id,
    user: item.user,
    meetup: item.meetup,
  }));
};

// Interface for ActivityItem (needed for mock data)
interface MockActivityItem {
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
export const mockActivityFeed: MockActivityItem[] = [
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
      bio: "Yoga instructor 🧘‍♀️ Wellness coach ✨ Central Park sunrise sessions 🌅",
      about:
        "Certified yoga instructor and wellness coach with over 5 years of experience helping people find balance and inner peace. I specialize in Vinyasa and restorative yoga, and I'm passionate about making wellness accessible to everyone. My Central Park sunrise sessions have become a beloved community tradition, bringing together people from all walks of life. I believe that wellness is not just about physical health, but about mental clarity, emotional balance, and spiritual growth. I'm always excited to meet fellow wellness enthusiasts and help others on their journey to better health and happiness.",
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
      interests: ["Wellness", "Yoga", "Meditation", "Health"],
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
      bio: "Serial entrepreneur 🚀 3 exits 💼 Founder @TechConnect | Mentoring next-gen leaders",
      about:
        "Serial entrepreneur with three successful exits and a passion for mentoring the next generation of tech leaders. As the founder of TechConnect, I've built a platform that connects developers and entrepreneurs worldwide. I believe in the power of technology to solve real-world problems and create meaningful impact. My journey from startup founder to successful exits has taught me valuable lessons about resilience, innovation, and the importance of building strong teams. I'm passionate about giving back to the community through mentorship and helping aspiring entrepreneurs navigate the challenges of building and scaling businesses.",
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
      interests: ["Technology", "Entrepreneurship", "Mentoring", "Business"],
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
      bio: "Art curator 🎨 Gallery owner in SoHo ✨ Emerging artists | Creative workshops",
      about:
        "Contemporary art curator and gallery owner in SoHo with a passion for discovering and promoting emerging artists. I've been in the art world for over 8 years and love the energy of New York's creative scene. My gallery specializes in contemporary works and I'm always on the lookout for fresh talent. I believe art has the power to transform communities and bring people together. I host monthly gallery openings and creative workshops to make art accessible to everyone, regardless of their background or experience. I'm passionate about building bridges between artists and art lovers, and I love connecting with fellow creatives who share my vision of making art a force for positive change.",
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
      interests: ["Art", "Creative Arts", "Culture", "Design"],
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
      bio: "Michelin-starred chef 👨‍🍳 @Kim'sKitchen Brooklyn 🍽️ Fusion cuisine | Food tours",
      about:
        "Michelin-starred chef and culinary innovator with a passion for fusion cuisine and sustainable cooking practices. I've been in the culinary world for over 15 years, working in kitchens from Tokyo to Paris before opening my own restaurant in Brooklyn. My approach to cooking combines traditional techniques with modern innovation, creating dishes that tell a story. I'm passionate about using locally sourced ingredients and supporting sustainable farming practices. I love sharing my knowledge through cooking masterclasses and food tours, helping people discover the joy of cooking and the stories behind great food. I believe that food has the power to bring people together and create lasting memories.",
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
      interests: ["Cooking", "Food", "Culinary Arts", "Sustainability"],
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
      bio: "Mindfulness coach 🧘‍♀️ @MindfulMoments ✨ Daily sessions | Mountain retreats",
      about:
        "Certified mindfulness coach and meditation teacher with over 8 years of experience helping people find inner peace and emotional balance. I founded MindfulMoments wellness center to create a sanctuary for healing and growth. My approach combines ancient wisdom with modern techniques, making mindfulness accessible to everyone. I specialize in stress reduction, emotional healing, and helping people develop sustainable self-care practices. My daily meditation sessions and weekend mountain retreats have helped hundreds of people transform their lives. I believe that mindfulness is not just a practice, but a way of living that can bring profound joy and fulfillment. I'm passionate about creating safe spaces for people to explore their inner world and connect with their authentic selves.",
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
      interests: ["Wellness", "Mindfulness", "Meditation", "Health"],
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

// Mock Message Rooms
export const mockMessageRooms = [
  {
    id: "room1",
    type: "direct" as const,
    participants: ["user1", "user2"],
    admins: ["user1"],
    lastMessage: {
      text: "Hey! Are you still up for coffee tomorrow?",
      senderRef: "user2",
      timestamp: new Date("2024-01-15T14:30:00"),
      messageType: "text",
      isRead: false,
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true,
    },
    createdTime: new Date("2024-01-10T10:00:00"),
    updatedTime: new Date("2024-01-15T14:30:00"),
  },
  {
    id: "room2",
    type: "group" as const,
    name: "SF Tech Meetup Group",
    description: "Discussion for our weekly tech meetup",
    participants: ["user1", "user3", "user4", "user5"],
    admins: ["user1", "user3"],
    lastMessage: {
      text: "Great session today! See you all next week 🚀",
      senderRef: "user3",
      timestamp: new Date("2024-01-15T16:45:00"),
      messageType: "text",
      isRead: true,
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true,
    },
    createdTime: new Date("2024-01-05T09:00:00"),
    updatedTime: new Date("2024-01-15T16:45:00"),
  },
];

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: "post1",
    userId: "evertwine",
    userName: "Evertwine Team",
    userAvatar:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
    title: "Welcome to Evertwine! 🎉",
    message:
      "We're thrilled to have you here! Create posts to share your thoughts, or create meetups to connect in person. This is your community - let's make it amazing together!",
    likes: ["user1", "user2", "user3", "user4"],
    comments: [
      {
        id: "comment1",
        userId: "user1",
        userName: "Alex Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        message: "So excited to be here! Can't wait to meet new people! 🙌",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isAnnouncement: true,
  },
  {
    id: "post2",
    userId: "user1",
    userName: "Alex Chen",
    userAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    title: "Just downloaded! 🎊",
    message:
      "Hey everyone! Just joined Evertwine and I'm looking forward to meeting new people who love hiking and coffee as much as I do! Anyone want to grab a coffee this weekend?",
    images: [
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    ],
    likes: ["user2", "user3", "user5"],
    comments: [
      {
        id: "comment2",
        userId: "user2",
        userName: "Maya Rodriguez",
        userAvatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
        message: "Welcome Alex! I'd love to grab coffee! ☕",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: "post3",
    userId: "user3",
    userName: "Sam Johnson",
    userAvatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    title: "Looking for hiking buddies! 🥾",
    message:
      "I've been going on solo hikes but would love some company! Planning to hit Marin Headlands this weekend. Beginner-friendly pace. Drop a comment if you're interested!",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=600&h=400&fit=crop",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&h=400&fit=crop",
    ],
    likes: ["user1", "user4", "user5", "user6"],
    comments: [
      {
        id: "comment3",
        userId: "user1",
        userName: "Alex Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        message: "Count me in! I've been wanting to explore that trail!",
        createdAt: new Date(Date.now() - 45 * 60 * 1000),
      },
      {
        id: "comment4",
        userId: "user4",
        userName: "Jordan Lee",
        userAvatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
        message: "Sounds great! What time are you thinking?",
        createdAt: new Date(Date.now() - 20 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: "post4",
    userId: "user2",
    userName: "Maya Rodriguez",
    userAvatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    title: "Best day ever! ✨",
    message:
      "Just attended my first meetup through Evertwine - a morning yoga session at Dolores Park! Met amazing people and can't wait for the next one. This community is incredible!",
    images: [
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&h=400&fit=crop",
    ],
    likes: ["user1", "user3", "user4", "user5"],
    comments: [
      {
        id: "comment5",
        userId: "user1",
        userName: "Alex Chen",
        userAvatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        message: "That's awesome! I saw that meetup and wanted to go!",
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: "post5",
    userId: "evertwine",
    userName: "Evertwine Team",
    userAvatar:
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=400&fit=crop",
    title: "New Feature: Happy Hour Events! 🍷",
    message:
      "Check out our new Happy Hour section! Discover the best happy hours in your area and see who else is going. Perfect for after-work socializing!",
    likes: ["user1", "user2", "user3", "user4", "user5", "user6"],
    comments: [],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    isAnnouncement: true,
  },
  {
    id: "post6",
    userId: "user4",
    userName: "Jordan Lee",
    userAvatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    title: "First time posting! 👋",
    message:
      "Hi everyone! New to the area and looking to make friends. I'm into gaming, board games, and trying new restaurants. Anyone up for a game night soon?",
    likes: ["user1", "user2", "user5"],
    comments: [
      {
        id: "comment6",
        userId: "user5",
        userName: "Taylor Smith",
        userAvatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
        message:
          "Welcome! There's a board game meetup next week you should check out!",
        createdAt: new Date(Date.now() - 10 * 60 * 1000),
      },
    ],
    createdAt: new Date(Date.now() - 10 * 60 * 60 * 1000),
  },
];

export const getMockPosts = (limit?: number): Post[] => {
  return limit ? mockPosts.slice(0, limit) : mockPosts;
};
