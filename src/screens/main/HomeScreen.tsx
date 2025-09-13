import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Dimensions,
  RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockMeetups, getMockEvents, getMockNotifications } from "../../data/mockData";
import { Meetup, Event, Notification } from "../../types";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { user, logout } = useAuthStore();
  const { colors } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"live" | "upcoming" | "nearby">("live");

  const mockMeetups = getMockMeetups();
  const mockEvents = getMockEvents();
  const mockNotifications = getMockNotifications();

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderMeetupCard = (meetup: Meetup) => (
    <TouchableOpacity 
      key={meetup.id}
      style={[styles.meetupCard, { backgroundColor: colors.surface }]}
    >
      <View style={styles.meetupHeader}>
        <View style={styles.meetupInfo}>
          <Text style={[styles.meetupTitle, { color: colors.text }]}>
            {meetup.title}
          </Text>
          <Text style={[styles.meetupLocation, { color: colors.textSecondary }]}>
            <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
            {meetup.locationName}
          </Text>
        </View>
        <View style={[styles.liveIndicator, { backgroundColor: colors.error }]}>
          <View style={[styles.liveDot, { backgroundColor: colors.onPrimary }]} />
          <Text style={[styles.liveText, { color: colors.onPrimary }]}>LIVE</Text>
        </View>
      </View>
      
      <Text style={[styles.meetupDescription, { color: colors.textSecondary }]}>
        {meetup.description}
      </Text>
      
      <View style={styles.meetupFooter}>
        <View style={styles.meetupTime}>
          <Ionicons name="time-outline" size={14} color={colors.primary} />
          <Text style={[styles.timeText, { color: colors.primary }]}>
            {formatTime(meetup.time)} • {formatDate(meetup.time)}
          </Text>
        </View>
        <View style={styles.meetupStats}>
          <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
          <Text style={[styles.statsText, { color: colors.textSecondary }]}>
            {meetup.currentParticipants}/{meetup.maxParticipants}
          </Text>
        </View>
      </View>
      
      <View style={styles.meetupTags}>
        {meetup.tags.slice(0, 3).map((tag, index) => (
          <View key={index} style={[styles.tag, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.tagText, { color: colors.primary }]}>{tag}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );

  const renderEventCard = (event: Event) => (
    <TouchableOpacity 
      key={event.id}
      style={[styles.eventCard, { backgroundColor: colors.surface }]}
    >
      <Image source={{ uri: event.coverImage }} style={styles.eventImage} />
      <View style={styles.eventContent}>
        <View style={styles.eventHeader}>
          <Text style={[styles.eventTitle, { color: colors.text }]}>
            {event.title}
          </Text>
          <View style={[styles.priceTag, { backgroundColor: colors.primary }]}>
            <Text style={[styles.priceText, { color: colors.onPrimary }]}>
              ${event.price}
            </Text>
          </View>
        </View>
        
        <Text style={[styles.eventLocation, { color: colors.textSecondary }]}>
          <Ionicons name="location-outline" size={12} color={colors.textSecondary} />
          {event.locationName}
        </Text>
        
        <View style={styles.eventFooter}>
          <View style={styles.eventTime}>
            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.primary }]}>
              {formatDate(event.startTime)} • {formatTime(event.startTime)}
            </Text>
          </View>
          <View style={styles.eventStats}>
            <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
            <Text style={[styles.statsText, { color: colors.textSecondary }]}>
              {event.currentAttendees} going
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderNotificationItem = (notification: Notification) => (
    <TouchableOpacity 
      key={notification.id}
      style={[styles.notificationItem, { backgroundColor: colors.surface }]}
    >
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: colors.text }]}>
          {notification.title}
        </Text>
        <Text style={[styles.notificationMessage, { color: colors.textSecondary }]}>
          {notification.message}
        </Text>
        <Text style={[styles.notificationTime, { color: colors.textTertiary }]}>
          {notification.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      {!notification.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good morning</Text>
          <Text style={[styles.title, { color: colors.text }]}>
            {user?.displayName || "User"}
          </Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Meetups</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>8</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Events</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.primary }]}>24</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Connections</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
          {(["live", "upcoming", "nearby"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                activeTab === tab && { backgroundColor: colors.primary }
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.onPrimary : colors.textSecondary }
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content based on active tab */}
        {activeTab === "live" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Live Meetups
            </Text>
            {mockMeetups.map(renderMeetupCard)}
          </View>
        )}

        {activeTab === "upcoming" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Upcoming Events
            </Text>
            {mockEvents.map(renderEventCard)}
          </View>
        )}

        {activeTab === "nearby" && (
          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Nearby Activities
            </Text>
            {mockMeetups.slice(0, 2).map(renderMeetupCard)}
            {mockEvents.slice(0, 1).map(renderEventCard)}
          </View>
        )}

        {/* Recent Notifications */}
        <View style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Recent Activity
          </Text>
          {mockNotifications.map(renderNotificationItem)}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    margin: 16,
    borderRadius: 12,
    padding: 20,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  meetupCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  meetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  meetupInfo: {
    flex: 1,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  meetupLocation: {
    fontSize: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  meetupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  meetupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  meetupTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 4,
  },
  meetupStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    fontSize: 12,
    marginLeft: 4,
  },
  meetupTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "500",
  },
  eventCard: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventImage: {
    width: "100%",
    height: 120,
  },
  eventContent: {
    padding: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  priceTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  eventLocation: {
    fontSize: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eventTime: {
    flexDirection: "row",
    alignItems: "center",
  },
  eventStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 4,
  },
  notificationTime: {
    fontSize: 10,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
});
