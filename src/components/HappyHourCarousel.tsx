import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { useNavigation } from "@react-navigation/native";
import { Event } from "../types";

const { width: screenWidth } = Dimensions.get("window");

interface HappyHourCarouselProps {
  onEventPress?: (event: Event) => void;
}

// Mock happy hour events - using simplified Event interface
export const getHappyHourEvents = (): Event[] => [
  {
    id: "hh1",
    title: "Wine & Cheese Tasting",
    description:
      "Join us for an evening of fine wines and artisanal cheeses from local producers.",
    venue: "Downtown Wine Bar",
    venueType: "Restaurant",
    location: { latitude: 37.7749, longitude: -122.4194 },
    locationName: "Downtown Wine Bar",
    address: "123 Main St, San Francisco, CA",
    startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endTime: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ), // 2 hours later
    timezone: "PST",
    category: "Food & Drink",
    tags: ["wine", "cheese", "tasting"],
    price: 25,
    currency: "USD",
    maxAttendees: 20,
    currentAttendees: 12,
    coverImage:
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
    subcategory: "Wine Tasting",
    images: [
      "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=400&h=300&fit=crop",
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
    views: 150,
    shares: 12,
    likes: 25,
    attendees: ["user1", "user2", "user5", "user6", "user7"],
    waitlist: [],
    interestedUsers: ["user1", "user2"],
    checkIns: 0,
    whosGoing: [
      {
        id: "user5",
        name: "David L.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user6",
        name: "Lisa K.",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
      {
        id: "user7",
        name: "James W.",
        avatar:
          "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
    ],
    isHappyHour: true,
    happyHourDetails: {
      discount: "30% off all wines",
      discountPercentage: 30,
      dealTimeWindow: "5pm-7pm Daily",
      specialMenuItems: [
        {
          name: "House Red Wine",
          originalPrice: 12,
          dealPrice: 8,
          description: "Smooth Cabernet Sauvignon from Napa Valley",
        },
        {
          name: "House White Wine",
          originalPrice: 12,
          dealPrice: 8,
          description: "Crisp Chardonnay with hints of oak",
        },
        {
          name: "Cheese Board",
          originalPrice: 18,
          dealPrice: 12,
          description: "Selection of artisanal cheeses with crackers",
        },
        {
          name: "Charcuterie Plate",
          originalPrice: 22,
          dealPrice: 16,
          description: "Cured meats, olives, and pickled vegetables",
        },
      ],
      dealHighlights: [
        "30% off all wines by the glass",
        "Discounted cheese boards",
        "Complimentary tasting notes",
        "Live sommelier guidance",
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh2",
    title: "Craft Beer Happy Hour",
    description:
      "Sample the latest craft beers from local breweries. 50% off all drinks!",
    venue: "Brewery District",
    venueType: "Brewery",
    location: { latitude: 37.7849, longitude: -122.4094 },
    locationName: "Brewery District",
    address: "456 Brew St, San Francisco, CA",
    startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day from now
    endTime: new Date(
      Date.now() + 1 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ), // 3 hours later
    timezone: "PST",
    category: "Food & Drink",
    tags: ["beer", "craft", "happy-hour"],
    price: 0,
    currency: "USD",
    maxAttendees: 50,
    currentAttendees: 28,
    coverImage:
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
    subcategory: "Beer Tasting",
    images: [
      "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400&h=300&fit=crop",
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
    views: 200,
    shares: 18,
    likes: 35,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    interestedUsers: ["user1", "user2", "user3"],
    checkIns: 0,
    whosGoing: [
      {
        id: "user1",
        name: "Sarah M.",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user2",
        name: "Mike C.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
      {
        id: "user3",
        name: "Emma R.",
        avatar:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user4",
        name: "Alex T.",
        avatar:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
    ],
    isHappyHour: true,
    happyHourDetails: {
      discount: "50% off all craft beers",
      discountPercentage: 50,
      dealTimeWindow: "4pm-7pm Mon-Fri",
      specialMenuItems: [
        {
          name: "IPA Flight",
          originalPrice: 16,
          dealPrice: 8,
          description: "4 local IPAs from Bay Area breweries",
        },
        {
          name: "Lager Pint",
          originalPrice: 8,
          dealPrice: 4,
          description: "Crisp house lager, refreshingly smooth",
        },
        {
          name: "Stout Pint",
          originalPrice: 9,
          dealPrice: 4.5,
          description: "Rich chocolate stout with coffee notes",
        },
        {
          name: "Pretzels & Beer Cheese",
          originalPrice: 10,
          dealPrice: 5,
          description: "Warm soft pretzels with house-made cheese",
        },
      ],
      dealHighlights: [
        "50% off all craft beers",
        "$4 domestic pints",
        "Half-price appetizers",
        "Free brewery tour at 5pm",
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh3",
    title: "Non-Alcoholic Mocktail Mixing",
    description:
      "Learn to create beautiful mocktails with fresh ingredients. Perfect for designated drivers!",
    venue: "Green Garden Café",
    venueType: "Café",
    location: { latitude: 37.7949, longitude: -122.3994 },
    locationName: "Green Garden Café",
    address: "789 Green Ave, San Francisco, CA",
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endTime: new Date(
      Date.now() + 3 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ), // 2 hours later
    timezone: "PST",
    category: "Food & Drink",
    tags: ["mocktails", "non-alcoholic", "mixology"],
    price: 15,
    currency: "USD",
    maxAttendees: 15,
    currentAttendees: 8,
    coverImage:
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
    subcategory: "Mocktail Mixing",
    images: [
      "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
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
    views: 120,
    shares: 8,
    likes: 18,
    attendees: ["user1", "user2"],
    waitlist: [],
    interestedUsers: ["user1", "user2"],
    checkIns: 0,
    whosGoing: [
      {
        id: "user8",
        name: "Maria G.",
        avatar:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user9",
        name: "Tom H.",
        avatar:
          "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
    ],
    isHappyHour: true,
    happyHourDetails: {
      discount: "Buy 1 Get 1 Free",
      discountPercentage: 50,
      dealTimeWindow: "3pm-6pm Daily",
      specialMenuItems: [
        {
          name: "Virgin Mojito",
          originalPrice: 8,
          dealPrice: 4,
          description: "Fresh mint, lime, and sparkling water",
        },
        {
          name: "Strawberry Basil Smash",
          originalPrice: 9,
          dealPrice: 4.5,
          description: "Muddled strawberries with fresh basil",
        },
        {
          name: "Cucumber Cooler",
          originalPrice: 8,
          dealPrice: 4,
          description: "Cool cucumber with elderflower and mint",
        },
        {
          name: "Ginger Fizz",
          originalPrice: 7,
          dealPrice: 3.5,
          description: "Spicy ginger beer with fresh lime juice",
        },
      ],
      dealHighlights: [
        "Buy 1 Get 1 Free on all mocktails",
        "Learn mixology techniques",
        "Fresh organic ingredients",
        "Recipes to take home",
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh4",
    title: "Rooftop Sunset Drinks",
    description: "Enjoy cocktails with a stunning city view as the sun sets.",
    venue: "Sky Lounge",
    venueType: "Rooftop Bar",
    location: { latitude: 37.8049, longitude: -122.3894 },
    locationName: "Sky Lounge",
    address: "321 Sky Tower, San Francisco, CA",
    startTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endTime: new Date(
      Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000
    ), // 2 hours later
    timezone: "PST",
    category: "Food & Drink",
    tags: ["rooftop", "sunset", "cocktails"],
    price: 20,
    currency: "USD",
    maxAttendees: 30,
    currentAttendees: 18,
    coverImage:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
    subcategory: "Rooftop Drinks",
    images: [
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=400&h=300&fit=crop",
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
    views: 180,
    shares: 15,
    likes: 28,
    attendees: ["user1", "user2", "user3"],
    waitlist: [],
    interestedUsers: ["user1", "user2", "user3"],
    checkIns: 0,
    whosGoing: [
      {
        id: "user10",
        name: "Sophie B.",
        avatar:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user11",
        name: "Ryan M.",
        avatar:
          "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
      {
        id: "user12",
        name: "Nina S.",
        avatar:
          "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user13",
        name: "Chris P.",
        avatar:
          "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
    ],
    isHappyHour: true,
    happyHourDetails: {
      discount: "$5 Cocktails & Small Plates",
      discountPercentage: 40,
      dealTimeWindow: "5pm-7pm Daily",
      specialMenuItems: [
        {
          name: "Sunset Spritz",
          originalPrice: 14,
          dealPrice: 5,
          description: "Aperol, prosecco, and fresh orange",
        },
        {
          name: "Sky Margarita",
          originalPrice: 13,
          dealPrice: 5,
          description: "Premium tequila with fresh lime juice",
        },
        {
          name: "Rooftop Old Fashioned",
          originalPrice: 15,
          dealPrice: 5,
          description: "Bourbon, bitters, and orange twist",
        },
        {
          name: "Truffle Fries",
          originalPrice: 12,
          dealPrice: 5,
          description: "Crispy fries with parmesan and truffle oil",
        },
      ],
      dealHighlights: [
        "$5 signature cocktails",
        "$5 small plates & appetizers",
        "Best sunset views in the city",
        "Live DJ from 6pm",
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh5",
    title: "Tapas & Sangria Night",
    description:
      "Authentic Spanish tapas paired with traditional sangria. ¡Olé!",
    venue: "Barcelona Bistro",
    venueType: "Spanish Restaurant",
    location: { latitude: 37.8149, longitude: -122.3794 },
    locationName: "Barcelona Bistro",
    address: "654 Spain St, San Francisco, CA",
    startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    endTime: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000
    ), // 3 hours later
    timezone: "PST",
    category: "Food & Drink",
    tags: ["tapas", "sangria", "spanish"],
    price: 35,
    currency: "USD",
    maxAttendees: 25,
    currentAttendees: 15,
    coverImage:
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
    subcategory: "Spanish Cuisine",
    images: [
      "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop",
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
    views: 220,
    shares: 20,
    likes: 42,
    attendees: ["user1", "user2", "user3", "user4"],
    waitlist: [],
    interestedUsers: ["user1", "user2", "user3", "user4"],
    checkIns: 0,
    whosGoing: [
      {
        id: "user14",
        name: "Isabella M.",
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user15",
        name: "Diego R.",
        avatar:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
      {
        id: "user16",
        name: "Amanda K.",
        avatar:
          "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
      {
        id: "user17",
        name: "Kevin L.",
        avatar:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: true,
      },
      {
        id: "user18",
        name: "Zoe T.",
        avatar:
          "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        isCheckedIn: false,
      },
    ],
    isHappyHour: true,
    happyHourDetails: {
      discount: "3 Tapas + Sangria for $35",
      discountPercentage: 35,
      dealTimeWindow: "4pm-8pm Wed-Sun",
      specialMenuItems: [
        {
          name: "Patatas Bravas",
          originalPrice: 9,
          dealPrice: 6,
          description: "Crispy potatoes with spicy aioli",
        },
        {
          name: "Gambas al Ajillo",
          originalPrice: 14,
          dealPrice: 9,
          description: "Garlic shrimp sizzled in olive oil",
        },
        {
          name: "Jamón Ibérico",
          originalPrice: 18,
          dealPrice: 12,
          description: "Premium cured ham from Spain",
        },
        {
          name: "House Sangria Pitcher",
          originalPrice: 28,
          dealPrice: 18,
          description: "Red or white sangria with fresh fruit",
        },
      ],
      dealHighlights: [
        "3 tapas + sangria combo for $35",
        "35% off all Spanish wines",
        "Complimentary paella sample",
        "Live flamenco music",
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HappyHourCarousel({
  onEventPress,
}: HappyHourCarouselProps) {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const happyHourEvents = getHappyHourEvents();

  const handleEventPress = (event: Event) => {
    // Serialize the event for navigation
    const serializedEvent = {
      ...event,
      startTime: event.startTime?.toISOString(),
      endTime: event.endTime?.toISOString(),
      createdAt: event.createdAt?.toISOString(),
      updatedAt: event.updatedAt?.toISOString(),
    };

    // Navigate to HappyHourDetails screen
    navigation.navigate("HappyHourDetails", {
      eventId: event.id,
      event: serializedEvent,
    });

    // Call the optional onEventPress callback
    if (onEventPress) {
      onEventPress(event);
    }
  };

  const formatTime = (date: Date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `${diffDays} days`;

    return eventDate.toLocaleDateString();
  };

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `$${price}`;
  };

  const renderEvent = ({ item }: { item: Event }) => {
    // Debug image data
    console.log(`🍷 HappyHour Event - ${item.title}:`, {
      hasCoverImage: !!item.coverImage,
      coverImageUrl: item.coverImage,
      hasImages: !!item.images,
      imagesArray: item.images,
    });

    return (
      <TouchableOpacity
        style={[styles.eventCard, { backgroundColor: colors.surface }]}
        onPress={() => handleEventPress(item)}
        activeOpacity={0.8}
      >
        <View style={styles.eventImageContainer}>
          {item.coverImage ? (
            <Image
              source={{ uri: item.coverImage }}
              style={styles.eventImage}
              onError={(error) => {
                console.log(
                  `❌ HappyHour image error for ${item.title}:`,
                  error.nativeEvent.error
                );
              }}
              onLoad={() => {
                console.log(`✅ HappyHour image loaded for ${item.title}`);
              }}
            />
          ) : (
            <View
              style={[styles.eventImage, { backgroundColor: colors.border }]}
            >
              <Ionicons name="wine" size={32} color={colors.primary} />
            </View>
          )}
          <View style={[styles.priceTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceText, { color: colors.onPrimary }]}>
              {formatPrice(item.price)}
            </Text>
          </View>
        </View>

        <View style={styles.eventContent}>
          <Text
            style={[styles.eventTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {item.title}
          </Text>

          <View style={styles.eventDetails}>
            <View style={styles.eventDetail}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.eventDetailText,
                  { color: colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {item.locationName}
              </Text>
            </View>

            <View style={styles.eventDetail}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[
                  styles.eventDetailText,
                  { color: colors.textSecondary },
                ]}
              >
                {formatTime(item.startTime)}
              </Text>
            </View>
          </View>

          <View style={styles.eventStats}>
            <View style={styles.whosGoing}>
              <View style={styles.avatarRow}>
                {item.whosGoing?.slice(0, 3).map((person, index) => (
                  <View
                    key={person.id}
                    style={[
                      styles.avatar,
                      {
                        backgroundColor: colors.surface,
                        borderColor: person.isCheckedIn
                          ? colors.primary
                          : colors.border,
                        borderWidth: person.isCheckedIn ? 2 : 1,
                        marginLeft: index > 0 ? -8 : 0,
                      },
                    ]}
                  >
                    <Image
                      source={{ uri: person.avatar }}
                      style={styles.avatarImage}
                    />
                    {person.isCheckedIn && (
                      <View
                        style={[
                          styles.checkInBadge,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Ionicons
                          name="checkmark"
                          size={8}
                          color={colors.onPrimary}
                        />
                      </View>
                    )}
                  </View>
                ))}
                {item.whosGoing && item.whosGoing.length > 3 && (
                  <View
                    style={[
                      styles.avatar,
                      styles.moreAvatars,
                      { backgroundColor: colors.border },
                    ]}
                  >
                    <Text style={[styles.moreText, { color: colors.text }]}>
                      +{item.whosGoing.length - 3}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[styles.whosGoingText, { color: colors.textSecondary }]}
              >
                {item.whosGoing?.length || 0} going
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeeAllCard = () => (
    <TouchableOpacity
      style={[styles.seeAllCard, { backgroundColor: colors.surface }]}
      onPress={() => (navigation as any).navigate("AllHappyHourEvents")}
      activeOpacity={0.8}
    >
      <View style={styles.seeAllContent}>
        <Ionicons
          name="arrow-forward-circle"
          size={48}
          color={colors.primary}
        />
        <Text style={[styles.seeAllCardTitle, { color: colors.text }]}>
          See All Events
        </Text>
        <Text
          style={[styles.seeAllCardSubtitle, { color: colors.textSecondary }]}
        >
          View all happy hours
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={happyHourEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
        ListFooterComponent={renderSeeAllCard}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    flexShrink: 1,
  },
  seeAllCard: {
    width: screenWidth * 0.5,
    height: 240,
    borderRadius: 16,
    marginLeft: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#E5E7EB",
  },
  seeAllContent: {
    alignItems: "center",
    gap: 12,
  },
  seeAllCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  seeAllCardSubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
  eventCard: {
    width: screenWidth * 0.7,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImageContainer: {
    position: "relative",
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  eventImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  priceTag: {
    position: "absolute",
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "600",
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 20,
  },
  eventDetails: {
    gap: 4,
    marginBottom: 12,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  eventDetailText: {
    fontSize: 13,
    flex: 1,
  },
  eventStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attendeeCount: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attendeeText: {
    fontSize: 12,
  },
  happyHourBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  happyHourText: {
    fontSize: 11,
    fontWeight: "500",
  },
  whosGoing: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  checkInBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  moreAvatars: {
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    fontSize: 10,
    fontWeight: "600",
  },
  whosGoingText: {
    fontSize: 12,
    fontWeight: "500",
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
});
