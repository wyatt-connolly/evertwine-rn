interface PresetImage {
  id: string;
  url: string;
  alt: string;
}

export class ImagePresetService {
  private static readonly PRESET_IMAGES: Record<string, PresetImage[]> = {
    "Coffee & Networking": [
      {
        id: "coffee-1",
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
        alt: "Coffee networking",
      },
      {
        id: "coffee-2",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        alt: "Business coffee",
      },
      {
        id: "coffee-3",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Coffee meeting",
      },
    ],
    "Business Lunch": [
      {
        id: "lunch-1",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        alt: "Business lunch",
      },
      {
        id: "lunch-2",
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        alt: "Professional dining",
      },
      {
        id: "lunch-3",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        alt: "Restaurant meeting",
      },
    ],
    "Happy Hour Networking": [
      {
        id: "happyhour-1",
        url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        alt: "Happy hour networking",
      },
      {
        id: "happyhour-2",
        url: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
        alt: "After work drinks",
      },
      {
        id: "happyhour-3",
        url: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop",
        alt: "Professional networking",
      },
    ],
    "Industry Meetup": [
      {
        id: "industry-1",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        alt: "Industry meetup",
      },
      {
        id: "industry-2",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Professional gathering",
      },
      {
        id: "industry-3",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        alt: "Business networking",
      },
    ],
    "Startup Pitch Event": [
      {
        id: "startup-1",
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        alt: "Startup pitch",
      },
      {
        id: "startup-2",
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
        alt: "Pitch event",
      },
      {
        id: "startup-3",
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
        alt: "Entrepreneur event",
      },
    ],
    "Professional Workshop": [
      {
        id: "workshop-1",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        alt: "Professional workshop",
      },
      {
        id: "workshop-2",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Training session",
      },
      {
        id: "workshop-3",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        alt: "Learning event",
      },
    ],
    "Conference Networking": [
      {
        id: "conference-1",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        alt: "Conference networking",
      },
      {
        id: "conference-2",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        alt: "Event networking",
      },
      {
        id: "conference-3",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Professional conference",
      },
    ],
    "Mentorship Session": [
      {
        id: "mentorship-1",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Mentorship session",
      },
      {
        id: "mentorship-2",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        alt: "Career guidance",
      },
      {
        id: "mentorship-3",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        alt: "Professional development",
      },
    ],
    "Business Book Club": [
      {
        id: "bookclub-1",
        url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop",
        alt: "Business book club",
      },
      {
        id: "bookclub-2",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Reading group",
      },
      {
        id: "bookclub-3",
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
        alt: "Professional reading",
      },
    ],
    "Entrepreneur Meetup": [
      {
        id: "entrepreneur-1",
        url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
        alt: "Entrepreneur meetup",
      },
      {
        id: "entrepreneur-2",
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
        alt: "Startup founders",
      },
      {
        id: "entrepreneur-3",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Business owners",
      },
    ],
    "Tech Talk": [
      {
        id: "techtalk-1",
        url: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=300&fit=crop",
        alt: "Tech talk",
      },
      {
        id: "techtalk-2",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Technology presentation",
      },
      {
        id: "techtalk-3",
        url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop",
        alt: "Tech networking",
      },
    ],
    "Investment Discussion": [
      {
        id: "investment-1",
        url: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop",
        alt: "Investment discussion",
      },
      {
        id: "investment-2",
        url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
        alt: "Finance meeting",
      },
      {
        id: "investment-3",
        url: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=300&fit=crop",
        alt: "Capital discussion",
      },
    ],
    "Coffee & Chat": [
      {
        id: "coffeechat-1",
        url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=300&fit=crop",
        alt: "Coffee and chat",
      },
      {
        id: "coffeechat-2",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        alt: "Casual coffee",
      },
      {
        id: "coffeechat-3",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Friendly conversation",
      },
    ],
    "Brunch with Friends": [
      {
        id: "brunch-1",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        alt: "Brunch with friends",
      },
      {
        id: "brunch-2",
        url: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
        alt: "Weekend brunch",
      },
      {
        id: "brunch-3",
        url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        alt: "Social brunch",
      },
    ],
    "Game Night": [
      {
        id: "gamenight-1",
        url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        alt: "Game night",
      },
      {
        id: "gamenight-2",
        url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        alt: "Board games",
      },
      {
        id: "gamenight-3",
        url: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=300&fit=crop",
        alt: "Gaming evening",
      },
    ],
    "Movie Night": [
      {
        id: "movienight-1",
        url: "https://images.unsplash.com/photo-1489599800079-4b2a6b5a4b5a?w=400&h=300&fit=crop",
        alt: "Movie night",
      },
      {
        id: "movienight-2",
        url: "https://images.unsplash.com/photo-1489599800079-4b2a6b5a4b5a?w=400&h=300&fit=crop",
        alt: "Film screening",
      },
      {
        id: "movienight-3",
        url: "https://images.unsplash.com/photo-1489599800079-4b2a6b5a4b5a?w=400&h=300&fit=crop",
        alt: "Cinema evening",
      },
    ],
    "Hiking Adventure": [
      {
        id: "hiking-1",
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
        alt: "Hiking adventure",
      },
      {
        id: "hiking-2",
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
        alt: "Mountain trail",
      },
      {
        id: "hiking-3",
        url: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
        alt: "Nature walk",
      },
    ],
    "Beach Day": [
      {
        id: "beach-1",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        alt: "Beach day",
      },
      {
        id: "beach-2",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        alt: "Ocean activities",
      },
      {
        id: "beach-3",
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
        alt: "Coastal fun",
      },
    ],
    "Picnic in the Park": [
      {
        id: "picnic-1",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        alt: "Picnic in the park",
      },
      {
        id: "picnic-2",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        alt: "Outdoor dining",
      },
      {
        id: "picnic-3",
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        alt: "Park gathering",
      },
    ],
    "Art Gallery Visit": [
      {
        id: "gallery-1",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Art gallery visit",
      },
      {
        id: "gallery-2",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Museum tour",
      },
      {
        id: "gallery-3",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Cultural experience",
      },
    ],
    "Museum Tour": [
      {
        id: "museum-1",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Museum tour",
      },
      {
        id: "museum-2",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Cultural visit",
      },
      {
        id: "museum-3",
        url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        alt: "Educational tour",
      },
    ],
    Concert: [
      {
        id: "concert-1",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Concert",
      },
      {
        id: "concert-2",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Live music",
      },
      {
        id: "concert-3",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Musical event",
      },
    ],
    "Comedy Show": [
      {
        id: "comedy-1",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Comedy show",
      },
      {
        id: "comedy-2",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Stand-up comedy",
      },
      {
        id: "comedy-3",
        url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        alt: "Laugh night",
      },
    ],
    "Dance Class": [
      {
        id: "dance-1",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Dance class",
      },
      {
        id: "dance-2",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Dancing lesson",
      },
      {
        id: "dance-3",
        url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        alt: "Dance workshop",
      },
    ],
    "Yoga Session": [
      {
        id: "yoga-1",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        alt: "Yoga session",
      },
      {
        id: "yoga-2",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        alt: "Yoga class",
      },
      {
        id: "yoga-3",
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
        alt: "Mindfulness practice",
      },
    ],
    "Fitness Workout": [
      {
        id: "fitness-1",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        alt: "Fitness workout",
      },
      {
        id: "fitness-2",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        alt: "Exercise session",
      },
      {
        id: "fitness-3",
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        alt: "Gym workout",
      },
    ],
    "Cooking Class": [
      {
        id: "cooking-1",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        alt: "Cooking class",
      },
      {
        id: "cooking-2",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        alt: "Culinary lesson",
      },
      {
        id: "cooking-3",
        url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        alt: "Chef workshop",
      },
    ],
    "Wine Tasting": [
      {
        id: "wine-1",
        url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        alt: "Wine tasting",
      },
      {
        id: "wine-2",
        url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        alt: "Wine event",
      },
      {
        id: "wine-3",
        url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop",
        alt: "Vineyard tour",
      },
    ],
    "Food Tour": [
      {
        id: "foodtour-1",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        alt: "Food tour",
      },
      {
        id: "foodtour-2",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        alt: "Culinary tour",
      },
      {
        id: "foodtour-3",
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&h=300&fit=crop",
        alt: "Tasting experience",
      },
    ],
  };

  /**
   * Get preset images for a specific activity type
   */
  static getImagesForActivity(activity: string): PresetImage[] {
    return this.PRESET_IMAGES[activity] || [];
  }

  /**
   * Get all available activity types that have preset images
   */
  static getAvailableActivities(): string[] {
    return Object.keys(this.PRESET_IMAGES);
  }

  /**
   * Check if an activity type has preset images
   */
  static hasImagesForActivity(activity: string): boolean {
    return (
      this.PRESET_IMAGES[activity] && this.PRESET_IMAGES[activity].length > 0
    );
  }
}
