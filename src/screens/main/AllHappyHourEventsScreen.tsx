import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useNavigation } from "@react-navigation/native";
import { Event } from "../../types";
import EventCard from "../../components/EventCard";

const { width } = Dimensions.get("window");

// Mock happy hour events - using the same data as HappyHourCarousel
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
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
    subcategory: "Wine Tasting",
    images: [
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=300&fit=crop",
    subcategory: "Beer Tasting",
    images: [
      "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
    subcategory: "Mocktail Mixing",
    images: [
      "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    subcategory: "Rooftop Drinks",
    images: [
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
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
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
    subcategory: "Spanish Cuisine",
    images: [
      "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop",
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

export default function AllHappyHourEventsScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const [activeFilter, setActiveFilter] = useState<
    "all" | "today" | "this-week"
  >("all");

  const happyHourEvents = getHappyHourEvents();

  const getFilteredEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (activeFilter) {
      case "today":
        return happyHourEvents.filter((event) => {
          const eventDate = new Date(event.startTime);
          return (
            eventDate >= today &&
            eventDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)
          );
        });
      case "this-week":
        return happyHourEvents.filter((event) => {
          const eventDate = new Date(event.startTime);
          return eventDate >= today && eventDate < weekFromNow;
        });
      default:
        return happyHourEvents;
    }
  };

  const filteredEvents = getFilteredEvents();

  const renderEvent = ({ item }: { item: Event }) => (
    <EventCard
      key={item.id}
      event={item}
      onPress={() => navigation.navigate("EventDetails", { eventId: item.id })}
      style={[styles.eventCard, { backgroundColor: colors.surface }]}
    />
  );

  const renderFilterButton = (
    filter: "all" | "today" | "this-week",
    label: string
  ) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        {
          backgroundColor:
            activeFilter === filter ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: activeFilter === filter ? colors.onPrimary : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Happy Hour Events
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All")}
        {renderFilterButton("today", "Today")}
        {renderFilterButton("this-week", "This Week")}
      </View>

      {/* Events List */}
      <FlatList
        data={filteredEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        style={styles.eventsList}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="wine-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Events Found
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Try adjusting your filters or check back later for new events.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  headerRight: {
    width: 40,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventsList: {
    flex: 1,
  },
  eventsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  eventCard: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
