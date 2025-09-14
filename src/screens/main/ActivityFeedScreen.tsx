import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockUsers, getMockMeetups } from "../../data/mockData";
import { User, Meetup } from "../../types";

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

const mockActivities: ActivityItem[] = [
  {
    id: "1",
    type: "meetup_created",
    user: getMockUsers()[1], // Maya
    meetup: getMockMeetups()[0],
    timestamp: new Date("2024-09-13T10:30:00"),
    description: "created a new meetup",
  },
  {
    id: "2",
    type: "meetup_joined",
    user: getMockUsers()[2], // James
    meetup: getMockMeetups()[1],
    timestamp: new Date("2024-09-13T09:15:00"),
    description: "joined a meetup",
  },
  {
    id: "3",
    type: "meetup_liked",
    user: getMockUsers()[0], // Alex
    meetup: getMockMeetups()[2],
    timestamp: new Date("2024-09-13T08:45:00"),
    description: "liked a meetup",
  },
  {
    id: "4",
    type: "profile_viewed",
    user: getMockUsers()[1], // Maya
    timestamp: new Date("2024-09-13T07:20:00"),
    description: "viewed your profile",
  },
  {
    id: "5",
    type: "friend_added",
    user: getMockUsers()[2], // James
    timestamp: new Date("2024-09-12T16:30:00"),
    description: "added you as a friend",
  },
  {
    id: "6",
    type: "meetup_created",
    user: getMockUsers()[0], // Alex
    meetup: getMockMeetups()[2],
    timestamp: new Date("2024-09-12T14:15:00"),
    description: "created a new meetup",
  },
];

export default function ActivityFeedScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activities] = useState<ActivityItem[]>(mockActivities);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { key: "all", label: "All Activity", icon: "apps" },
    { key: "meetup_created", label: "Meetup Created", icon: "add-circle" },
    { key: "meetup_joined", label: "Meetup Joined", icon: "people" },
    { key: "meetup_liked", label: "Meetup Liked", icon: "heart" },
    { key: "profile_viewed", label: "Profile Viewed", icon: "eye" },
    { key: "friend_added", label: "Friend Added", icon: "person-add" },
  ];

  const filteredActivities =
    selectedFilter === "all"
      ? activities
      : activities.filter((activity) => activity.type === selectedFilter);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes}m ago` : "now";
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "meetup_created":
        return "add-circle";
      case "meetup_joined":
        return "people";
      case "meetup_liked":
        return "heart";
      case "profile_viewed":
        return "eye";
      case "friend_added":
        return "person-add";
      default:
        return "notifications";
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "meetup_created":
        return colors.primary;
      case "meetup_joined":
        return colors.secondary;
      case "meetup_liked":
        return colors.error;
      case "profile_viewed":
        return colors.textSecondary;
      case "friend_added":
        return colors.primary;
      default:
        return colors.textSecondary;
    }
  };

  const handleActivityPress = (activity: ActivityItem) => {
    switch (activity.type) {
      case "meetup_created":
      case "meetup_joined":
      case "meetup_liked":
        if (activity.meetup) {
          navigation.navigate("MeetupDetails", {
            meetupId: activity.meetup.id,
          });
        }
        break;
      case "profile_viewed":
        // Navigate to user profile - for now just show alert
        navigation.navigate("Profile");
        break;
      case "friend_added":
        // Navigate to friends/connections screen - for now just show alert
        navigation.navigate("Profile");
        break;
      default:
        break;
    }
  };

  const renderActivityItem = (activity: ActivityItem) => (
    <TouchableOpacity
      key={activity.id}
      style={[styles.activityItem, { backgroundColor: colors.surface }]}
      onPress={() => handleActivityPress(activity)}
    >
      <View style={styles.activityContent}>
        <View style={styles.activityHeader}>
          <Image
            source={{ uri: activity.user.profilePictures[0] }}
            style={styles.userAvatar}
          />
          <View style={styles.activityInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {activity.user.displayName}
            </Text>
            <Text
              style={[
                styles.activityDescription,
                { color: colors.textSecondary },
              ]}
            >
              {activity.description}
            </Text>
            {activity.meetup && (
              <Text style={[styles.meetupTitle, { color: colors.primary }]}>
                "{activity.meetup.title}"
              </Text>
            )}
          </View>
          <View style={styles.activityMeta}>
            <Ionicons
              name={getActivityIcon(activity.type)}
              size={20}
              color={getActivityColor(activity.type)}
            />
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {formatTime(activity.timestamp)}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Activity Feed
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="filter-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Filter Dropdown */}
      {showFilters && (
        <View
          style={[styles.filterDropdown, { backgroundColor: colors.surface }]}
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {filterOptions.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterOption,
                  selectedFilter === filter.key && {
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => {
                  setSelectedFilter(filter.key);
                  setShowFilters(false);
                }}
              >
                <Ionicons
                  name={filter.icon as any}
                  size={16}
                  color={
                    selectedFilter === filter.key
                      ? colors.onPrimary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.filterOptionText,
                    {
                      color:
                        selectedFilter === filter.key
                          ? colors.onPrimary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>

          {filteredActivities.map(renderActivityItem)}

          <View style={styles.loadMoreContainer}>
            <TouchableOpacity
              style={[
                styles.loadMoreButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Text style={[styles.loadMoreText, { color: colors.onPrimary }]}>
                Load More Activity
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  filterButton: {
    padding: 8,
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  activityItem: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityContent: {
    padding: 16,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  activityDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  meetupTitle: {
    fontSize: 14,
    fontWeight: "500",
    fontStyle: "italic",
  },
  activityMeta: {
    alignItems: "center",
    marginLeft: 8,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  loadMoreContainer: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  loadMoreButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loadMoreText: {
    fontSize: 14,
    fontWeight: "600",
  },
  filterDropdown: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  filterOptionText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 6,
  },
});
