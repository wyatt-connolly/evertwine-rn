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
import { useMeetupStore } from "../../hooks/useMeetupStore";
import { Meetup } from "../../types";
import MeetupCard from "../../components/MeetupCard";
import { getMockMeetups } from "../../data/mockData";
import { DataService } from "../../services/DataService";

const { width } = Dimensions.get("window");

export default function AllMeetupsScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { meetups: localMeetups } = useMeetupStore();
  const [activeFilter, setActiveFilter] = useState<"all" | "today" | "this-week" | "following">("all");
  
  // Get meetups from store or mock data
  const allMeetups = DataService.isInDeveloperMode() 
    ? getMockMeetups() 
    : localMeetups;

  const getFilteredMeetups = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    let filtered = [...allMeetups];

    // Apply primary filter
    if (activeFilter === "following") {
      // In a real app, this would filter by followed hosts
      filtered = filtered.filter((meetup) => meetup.creatorId === "user1");
    }

    // Apply time filters
    switch (activeFilter) {
      case "today":
        filtered = filtered.filter(meetup => {
          const meetupDate = new Date(meetup.time);
          return meetupDate >= today && meetupDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
        });
        break;
      case "this-week":
        filtered = filtered.filter(meetup => {
          const meetupDate = new Date(meetup.time);
          return meetupDate >= today && meetupDate < weekFromNow;
        });
        break;
    }

    return filtered;
  };

  const filteredMeetups = getFilteredMeetups();

  const renderMeetup = ({ item }: { item: Meetup }) => (
    <MeetupCard
      key={item.id}
      meetup={item}
      onPress={() => navigation.navigate("MeetupDetails", { meetupId: item.id })}
      style={[styles.meetupCard, { backgroundColor: colors.surface }]}
    />
  );

  const renderFilterButton = (filter: "all" | "today" | "this-week" | "following", label: string) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        {
          backgroundColor: activeFilter === filter ? colors.primary : colors.surface,
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
          All Meetups
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All")}
        {renderFilterButton("today", "Today")}
        {renderFilterButton("this-week", "This Week")}
        {renderFilterButton("following", "Following")}
      </View>

      {/* Meetups List */}
      <FlatList
        data={filteredMeetups}
        renderItem={renderMeetup}
        keyExtractor={(item) => item.id}
        style={styles.meetupsList}
        contentContainerStyle={styles.meetupsContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Meetups Found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your filters or create a new meetup to get started.
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("Create")}
            >
              <Text style={[styles.createButtonText, { color: colors.onPrimary }]}>
                Create Meetup
              </Text>
            </TouchableOpacity>
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
  meetupsList: {
    flex: 1,
  },
  meetupsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  meetupCard: {
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
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
