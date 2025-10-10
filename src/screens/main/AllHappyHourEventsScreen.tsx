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
import { getHappyHourEvents } from "../../components/HappyHourCarousel";

const { width } = Dimensions.get("window");

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
      onPress={() => {
        // Serialize the event to avoid non-serializable Date objects
        const serializedEvent = {
          ...item,
          startTime: item.startTime?.toISOString(),
          endTime: item.endTime?.toISOString(),
          createdAt: item.createdAt?.toISOString(),
          updatedAt: item.updatedAt?.toISOString(),
        };
        // Route to HappyHourDetails for happy hour events
        navigation.navigate("HappyHourDetails", {
          eventId: item.id,
          event: serializedEvent,
        });
      }}
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
