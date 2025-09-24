import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import MeetupCard from "../../components/MeetupCard";
import EventCard from "../../components/EventCard";
import MeetupsCarousel from "../../components/MeetupsCarousel";
import HappyHourCarousel from "../../components/HappyHourCarousel";
import {
  getMockMeetups,
  getMockEvents,
  getUserNotifications,
  getMockUsers,
  getActivityFeed,
  getActivityFeedTotal,
} from "../../data/mockData";
import { DataService } from "../../services/DataService";
import InviteSnackbar from "../../components/InviteSnackbar";
import LoadingIndicator from "../../components/LoadingIndicator";
import { safeUserMerge } from "../../utils/firebaseDataConverter";
import { safeGet, safeArrayGet, createSafeUser } from "../../utils/safeAccess";
import { testComponentData, testFirebaseData } from "../../utils/devTesting";
import {
  EmptyMeetupsState,
  EmptyEventsState,
  EmptyActivityState,
  LoadingState,
} from "../../components/EmptyStates";
import {
  Meetup,
  Event,
  Notification,
  User,
  NotificationType,
} from "../../types";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { currentUser, isInitialLoading } = useAuthStore();
  const { meetups, fetchMeetups } = useMeetupStore();

  // State
  const [refreshing, setRefreshing] = useState(false);
  const [showInviteSnackbar, setShowInviteSnackbar] = useState(false);
  const [showShareSnackbar, setShowShareSnackbar] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Mock data
  const allMeetups = DataService.isInDeveloperMode()
    ? getMockMeetups()
    : meetups;
  const mockEvents = DataService.isInDeveloperMode() ? getMockEvents() : [];
  const mockUsers = DataService.isInDeveloperMode() ? getMockUsers() : [];

  useEffect(() => {
    if (currentUser && DataService.isInDeveloperMode()) {
      setNotifications(getUserNotifications(currentUser.uid));
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser && !DataService.isInDeveloperMode()) {
      fetchMeetups();
    }
  }, [currentUser, fetchMeetups]);

  // Only test Firebase data when not in developer mode and in dev environment
  useEffect(() => {
    if (__DEV__ && !DataService.isInDeveloperMode()) {
      testFirebaseData();
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (DataService.isInDeveloperMode()) {
        // In developer mode, just simulate a refresh
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else {
        await fetchMeetups();
      }
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleInviteFriends = () => {
    console.log("Invite friends pressed");
    setShowInviteSnackbar(false);
  };

  const handleShareApp = () => {
    console.log("Share app pressed");
    setShowShareSnackbar(false);
  };

  const handleDismissInvite = () => {
    setShowInviteSnackbar(false);
  };

  const handleDismissShare = () => {
    setShowShareSnackbar(false);
  };

  const renderMeetupCard = (meetup: Meetup) => (
    <MeetupCard
      key={meetup.id}
      meetup={meetup}
      onPress={() =>
        navigation.navigate("MeetupDetails", { meetupId: meetup.id })
      }
    />
  );

  const renderEventCard = (event: Event) => (
    <EventCard
      key={event.id}
      event={event}
      onPress={() => navigation.navigate("EventDetails", { eventId: event.id })}
    />
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: currentUser?.photoURL || "https://via.placeholder.com/40",
              }}
              style={styles.profileImage}
            />
            <View>
              <Text style={[styles.greeting, { color: colors.text }]}>
                {currentUser
                  ? `Hello, ${currentUser.displayName || "User"}!`
                  : "Welcome!"}
              </Text>
              <Text
                style={[styles.welcomeText, { color: colors.textSecondary }]}
              >
                {DataService.isInDeveloperMode()
                  ? "Developer Mode - Using mock data"
                  : "Discover amazing meetups"}
              </Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[styles.headerButton, { backgroundColor: colors.surface }]}
              onPress={() => navigation.navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Welcome Section for New Users (not in developer mode) */}
        {!DataService.isInDeveloperMode() && (
          <View style={styles.content}>
            <View
              style={[styles.welcomeCard, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.welcomeTitle, { color: colors.text }]}>
                Welcome to Evertwine! 🌟
              </Text>
              <Text
                style={[
                  styles.welcomeSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Ready to discover amazing meetups and connect with your
                community? Let's get you started with some quick actions.
              </Text>
              <View style={styles.quickActions}>
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => navigation.navigate("Create")}
                >
                  <Ionicons name="add" size={20} color={colors.onPrimary} />
                  <Text
                    style={[
                      styles.quickActionText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Create Meetup
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.quickActionButton,
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 1,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={() => navigation.navigate("Explore")}
                >
                  <Ionicons name="search" size={20} color={colors.text} />
                  <Text
                    style={[styles.quickActionText, { color: colors.text }]}
                  >
                    Explore
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Discover Section for New Users */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Discover
            </Text>
            <View style={styles.discoverGrid}>
              <TouchableOpacity
                style={[
                  styles.discoverCard,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => navigation.navigate("Explore")}
              >
                <Ionicons name="location" size={32} color={colors.primary} />
                <Text style={[styles.discoverTitle, { color: colors.text }]}>
                  Find Events Near You
                </Text>
                <Text
                  style={[
                    styles.discoverSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Discover local meetups and activities
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.discoverCard,
                  { backgroundColor: colors.surface },
                ]}
                onPress={() => navigation.navigate("Community")}
              >
                <Ionicons name="people" size={32} color={colors.primary} />
                <Text style={[styles.discoverTitle, { color: colors.text }]}>
                  Connect with Community
                </Text>
                <Text
                  style={[
                    styles.discoverSubtitle,
                    { color: colors.textSecondary },
                  ]}
                >
                  Meet like-minded people
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Happy Hour Carousel */}
        <HappyHourCarousel
          onEventPress={(event) => {
            navigation.navigate("EventDetails", { eventId: event.id });
          }}
        />

        {/* Meetups Carousel */}
        {isInitialLoading || !currentUser ? (
          <LoadingState style={{ margin: 20 }} />
        ) : (
          <MeetupsCarousel
            onMeetupPress={(meetup) => {
              navigation.navigate("MeetupDetails", { meetupId: meetup.id });
            }}
          />
        )}
      </ScrollView>

      <InviteSnackbar
        visible={showInviteSnackbar}
        onDismiss={handleDismissInvite}
        onInvite={handleInviteFriends}
        message="Loving the activity? Invite friends to join the fun!"
        type="invite"
      />

      <InviteSnackbar
        visible={showShareSnackbar}
        onDismiss={handleDismissShare}
        onInvite={handleShareApp}
        message="Share Evertwine with your friends and help them discover amazing meetups!"
        actionText="Share App"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    marginLeft: 8,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  welcomeText: {
    fontSize: 14,
    color: "#6b7280",
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
    color: "#1a1a1a",
  },
  welcomeCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  discoverGrid: {
    flexDirection: "row",
    gap: 12,
  },
  discoverCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  discoverTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  discoverSubtitle: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
