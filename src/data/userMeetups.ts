import { Meetup } from "../types";

// User Meetup Status Types
export interface UserMeetup {
  meetup: Meetup;
  status: "upcoming" | "live" | "ongoing" | "completed" | "cancelled";
  role: "creator" | "participant" | "waitlisted";
  joinedAt: Date;
  attendance?: "attended" | "no-show" | "cancelled";
  rating?: number;
  review?: string;
}

// Mock User Meetup Data for current user (user1)
export const mockUserMeetups: UserMeetup[] = [
  // Current/Upcoming Meetups
  {
    meetup: {
      id: "user_meetup_1",
      title: "Morning Coffee & Networking",
      description:
        "Start your day with great coffee and meaningful connections with fellow professionals.",
      creatorId: "user1",
      creatorRef: "users/user1",
      location: { latitude: 37.7749, longitude: -122.4194 },
      locationName: "Blue Bottle Coffee",
      address: "66 Mint St, San Francisco, CA",
      time: new Date("2024-09-20T08:00:00"),
      duration: 90,
      timezone: "PST",
      activity: "Networking",
      activityCategory: "Professional",
      tags: ["networking", "coffee", "morning", "professional"],
      connectionType: "professional",
      maxParticipants: 8,
      currentParticipants: 5,
      participants: ["user1", "user2", "user3"],
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
        minAge: 22,
        verificationRequired: true,
        skillLevel: "professional",
      },
      views: 156,
      joinRequests: 8,
      completionRate: 92,
      engagementScore: 88,
      coverImage:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      images: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      ],
      createdAt: new Date("2024-09-01"),
      updatedAt: new Date(),
    },
    status: "upcoming",
    role: "creator",
    joinedAt: new Date("2024-09-01"),
  },
  {
    meetup: {
      id: "user_meetup_2",
      title: "Weekend Hiking Adventure",
      description:
        "Explore beautiful trails and connect with nature-loving friends.",
      creatorId: "user2",
      creatorRef: "users/user2",
      location: { latitude: 37.7694, longitude: -122.4862 },
      locationName: "Golden Gate Park",
      address: "Golden Gate Park, San Francisco, CA",
      time: new Date("2024-09-21T09:00:00"),
      duration: 180,
      timezone: "PST",
      activity: "Hiking",
      activityCategory: "Outdoor",
      tags: ["hiking", "nature", "weekend", "outdoor"],
      connectionType: "casual",
      maxParticipants: 12,
      currentParticipants: 8,
      participants: ["user1", "user2", "user3"],
      waitlist: [],
      declinedUsers: [],
      status: "active",
      isRecurring: false,
      requirements: {
        minAge: 18,
        verificationRequired: false,
        skillLevel: "beginner",
      },
      views: 89,
      joinRequests: 12,
      completionRate: 95,
      engagementScore: 91,
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      images: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      ],
      createdAt: new Date("2024-09-10"),
      updatedAt: new Date(),
    },
    status: "upcoming",
    role: "participant",
    joinedAt: new Date("2024-09-12"),
  },
  {
    meetup: {
      id: "user_meetup_3",
      title: "Tech Startup Pitch Night",
      description:
        "Present your startup ideas and get feedback from experienced entrepreneurs.",
      creatorId: "user3",
      creatorRef: "users/user3",
      location: { latitude: 37.7849, longitude: -122.4094 },
      locationName: "TechHub SF",
      address: "123 Market St, San Francisco, CA",
      time: new Date("2024-09-22T19:00:00"),
      duration: 120,
      timezone: "PST",
      activity: "Pitching",
      activityCategory: "Professional",
      tags: ["startup", "pitching", "entrepreneurship", "networking"],
      connectionType: "professional",
      maxParticipants: 30,
      currentParticipants: 25,
      participants: ["user1", "user3"],
      waitlist: [],
      declinedUsers: [],
      status: "active",
      isRecurring: false,
      requirements: {
        minAge: 18,
        verificationRequired: true,
        skillLevel: "professional",
      },
      views: 234,
      joinRequests: 35,
      completionRate: 88,
      engagementScore: 94,
      coverImage:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      images: [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      ],
      createdAt: new Date("2024-08-25"),
      updatedAt: new Date(),
    },
    status: "upcoming",
    role: "participant",
    joinedAt: new Date("2024-08-28"),
  },

  // Live/Ongoing Meetups
  {
    meetup: {
      id: "user_meetup_live_1",
      title: "Live: Coffee & Code Session",
      description:
        "Join us for a live coding session with coffee and collaboration.",
      creatorId: "user1",
      creatorRef: "users/user1",
      location: { latitude: 37.7749, longitude: -122.4194 },
      locationName: "Blue Bottle Coffee",
      address: "66 Mint St, San Francisco, CA",
      time: new Date("2024-09-19T10:00:00"),
      duration: 180,
      timezone: "PST",
      activity: "Coding",
      activityCategory: "Professional",
      tags: ["coding", "coffee", "live", "collaboration"],
      connectionType: "professional",
      maxParticipants: 12,
      currentParticipants: 8,
      participants: ["user1", "user2", "user3"],
      waitlist: [],
      declinedUsers: [],
      status: "active",
      isRecurring: false,
      requirements: {
        minAge: 18,
        verificationRequired: false,
        skillLevel: "intermediate",
      },
      views: 89,
      joinRequests: 5,
      completionRate: 95,
      engagementScore: 92,
      coverImage:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      images: [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800",
      ],
      createdAt: new Date("2024-09-18"),
      updatedAt: new Date(),
    },
    status: "live",
    role: "creator",
    joinedAt: new Date("2024-09-18"),
  },

  // Past Meetups
  {
    meetup: {
      id: "user_meetup_4",
      title: "Photography Workshop",
      description:
        "Learn advanced photography techniques with professional photographers.",
      creatorId: "user1",
      creatorRef: "users/user1",
      location: { latitude: 37.7599, longitude: -122.4148 },
      locationName: "Mission District",
      address: "Mission District, San Francisco, CA",
      time: new Date("2024-09-05T14:00:00"),
      duration: 150,
      timezone: "PST",
      activity: "Photography",
      activityCategory: "Arts & Culture",
      tags: ["photography", "workshop", "creative", "learning"],
      connectionType: "casual",
      maxParticipants: 10,
      currentParticipants: 8,
      participants: ["user1"],
      waitlist: [],
      declinedUsers: [],
      status: "completed",
      isRecurring: false,
      requirements: {
        minAge: 16,
        verificationRequired: false,
        skillLevel: "intermediate",
      },
      views: 145,
      joinRequests: 15,
      completionRate: 100,
      engagementScore: 96,
      coverImage:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      images: [
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
      ],
      createdAt: new Date("2024-08-20"),
      updatedAt: new Date(),
      completedAt: new Date("2024-09-05T16:30:00"),
    },
    status: "completed",
    role: "creator",
    joinedAt: new Date("2024-08-20"),
    attendance: "attended",
    rating: 4,
  },
  {
    meetup: {
      id: "user_meetup_5",
      title: "Yoga & Meditation Session",
      description: "Relax and rejuvenate with guided yoga and meditation.",
      creatorId: "user2",
      creatorRef: "users/user2",
      location: { latitude: 37.7694, longitude: -122.4862 },
      locationName: "Crissy Field",
      address: "Crissy Field, San Francisco, CA",
      time: new Date("2024-09-08T17:30:00"),
      duration: 90,
      timezone: "PST",
      activity: "Yoga",
      activityCategory: "Fitness & Wellness",
      tags: ["yoga", "meditation", "wellness", "outdoor"],
      connectionType: "casual",
      maxParticipants: 20,
      currentParticipants: 15,
      participants: ["user1", "user2"],
      waitlist: [],
      declinedUsers: [],
      status: "completed",
      isRecurring: false,
      requirements: {
        minAge: 16,
        verificationRequired: false,
        skillLevel: "beginner",
      },
      views: 78,
      joinRequests: 8,
      completionRate: 93,
      engagementScore: 89,
      coverImage:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
      ],
      createdAt: new Date("2024-08-25"),
      updatedAt: new Date(),
      completedAt: new Date("2024-09-08T19:00:00"),
    },
    status: "completed",
    role: "participant",
    joinedAt: new Date("2024-08-28"),
    attendance: "attended",
    rating: 5,
    review:
      "Amazing session! The instructor was fantastic and the location was perfect.",
  },
  {
    meetup: {
      id: "user_meetup_6",
      title: "Business Networking Happy Hour",
      description:
        "Connect with fellow professionals over drinks and appetizers.",
      creatorId: "user1",
      creatorRef: "users/user1",
      location: { latitude: 37.7849, longitude: -122.4094 },
      locationName: "The View Lounge",
      address: "123 Market St, San Francisco, CA",
      time: new Date("2024-09-01T18:00:00"),
      duration: 120,
      timezone: "PST",
      activity: "Networking",
      activityCategory: "Professional",
      tags: ["networking", "happy-hour", "professional", "business"],
      connectionType: "professional",
      maxParticipants: 50,
      currentParticipants: 32,
      participants: ["user1", "user3"],
      waitlist: [],
      declinedUsers: [],
      status: "completed",
      isRecurring: false,
      requirements: {
        minAge: 21,
        verificationRequired: true,
        skillLevel: "professional",
      },
      views: 189,
      joinRequests: 25,
      completionRate: 78,
      engagementScore: 88,
      coverImage:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      images: [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
      ],
      createdAt: new Date("2024-08-15"),
      updatedAt: new Date(),
      completedAt: new Date("2024-09-01T20:00:00"),
    },
    status: "completed",
    role: "creator",
    joinedAt: new Date("2024-08-15"),
    attendance: "attended",
    rating: 4,
  },
];

// Helper functions for user meetups
export const getUserUpcomingMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter(
    (um) =>
      um.status === "upcoming" &&
      (um.meetup.creatorId === userId ||
        um.meetup.participants.includes(userId))
  );
};

export const getUserLiveMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter(
    (um) =>
      (um.status === "live" || um.status === "ongoing") &&
      (um.meetup.creatorId === userId ||
        um.meetup.participants.includes(userId))
  );
};

export const getUserPastMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter(
    (um) =>
      um.status === "completed" &&
      (um.meetup.creatorId === userId ||
        um.meetup.participants.includes(userId))
  );
};

export const getUserCreatedMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter((um) => um.meetup.creatorId === userId);
};

export const getUserJoinedMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter(
    (um) =>
      um.meetup.participants.includes(userId) && um.meetup.creatorId !== userId
  );
};

export const getUserAllMeetups = (userId: string): UserMeetup[] => {
  return mockUserMeetups.filter(
    (um) =>
      um.meetup.creatorId === userId || um.meetup.participants.includes(userId)
  );
};

export const getUserMeetupStats = (userId: string) => {
  const allMeetups = getUserAllMeetups(userId);
  const upcoming = getUserUpcomingMeetups(userId);
  const past = getUserPastMeetups(userId);
  const created = getUserCreatedMeetups(userId);
  const joined = getUserJoinedMeetups(userId);

  const attended = past.filter((um) => um.attendance === "attended");
  const averageRating =
    attended.length > 0
      ? attended.reduce((sum, um) => sum + (um.rating || 0), 0) /
        attended.length
      : 0;

  return {
    total: allMeetups.length,
    upcoming: upcoming.length,
    past: past.length,
    created: created.length,
    joined: joined.length,
    attended: attended.length,
    averageRating: Math.round(averageRating * 10) / 10,
  };
};
