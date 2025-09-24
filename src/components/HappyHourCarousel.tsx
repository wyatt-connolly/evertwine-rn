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
const getHappyHourEvents = (): Event[] => [
  {
    id: "hh1",
    title: "Wine & Cheese Tasting",
    description:
      "Join us for an evening of fine wines and artisanal cheeses from local producers.",
    organizerId: "host1",
    organizerName: "Sarah Johnson",
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
    attendees: ["user1", "user2"],
    waitlist: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh2",
    title: "Craft Beer Happy Hour",
    description:
      "Sample the latest craft beers from local breweries. 50% off all drinks!",
    organizerId: "host2",
    organizerName: "Mike Chen",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh3",
    title: "Non-Alcoholic Mocktail Mixing",
    description:
      "Learn to create beautiful mocktails with fresh ingredients. Perfect for designated drivers!",
    organizerId: "host3",
    organizerName: "Emma Rodriguez",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh4",
    title: "Rooftop Sunset Drinks",
    description: "Enjoy cocktails with a stunning city view as the sun sets.",
    organizerId: "host4",
    organizerName: "David Park",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "hh5",
    title: "Tapas & Sangria Night",
    description:
      "Authentic Spanish tapas paired with traditional sangria. ¡Olé!",
    organizerId: "host5",
    organizerName: "Isabella Martinez",
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function HappyHourCarousel({
  onEventPress,
}: HappyHourCarouselProps) {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const happyHourEvents = getHappyHourEvents();

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
        onPress={() => onEventPress?.(item)}
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
            <View style={styles.attendeeCount}>
              <Ionicons
                name="people-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.attendeeText, { color: colors.textSecondary }]}
              >
                {item.currentAttendees}/{item.maxAttendees}
              </Text>
            </View>

            <View
              style={[
                styles.happyHourBadge,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons name="wine" size={12} color={colors.primary} />
              <Text style={[styles.happyHourText, { color: colors.primary }]}>
                Happy Hour
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Happy Hour Events
        </Text>
        <TouchableOpacity
          onPress={() => (navigation as any).navigate("AllHappyHourEvents")}
        >
          <Text style={[styles.seeAllText, { color: colors.primary }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={happyHourEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContent}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
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
  carouselContent: {
    paddingHorizontal: 0,
  },
});
