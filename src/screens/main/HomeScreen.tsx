import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  RefreshControl,
} from "react-native";
import { Image } from "expo-image";
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
  const { meetups } = useMeetupStore();

  // Debug current user data

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
      // No API calls needed - using mock data
    }
  }, [currentUser]);

  // Only test Firebase data when not in developer mode and in dev environment
  useEffect(() => {
    if (__DEV__ && !DataService.isInDeveloperMode()) {
      testFirebaseData();
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      // Simulate refresh delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  const handleInviteFriends = () => {
    setShowInviteSnackbar(false);
  };

  const handleShareApp = () => {
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
      {/* Meetups Carousel - Now handles all scrolling */}
      <MeetupsCarousel
        onMeetupPress={(meetup) => {
          navigation.navigate("MeetupDetails", { meetupId: meetup.id });
        }}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        headerComponent={() => (
          <View>
            {/* Happy Hour Carousel */}
            <HappyHourCarousel
              onEventPress={(event) => {
                // Serialize the event to avoid non-serializable Date objects
                const serializedEvent = {
                  ...event,
                  startTime: event.startTime?.toISOString(),
                  endTime: event.endTime?.toISOString(),
                  createdAt: event.createdAt?.toISOString(),
                  updatedAt: event.updatedAt?.toISOString(),
                };
                navigation.navigate("EventDetails", {
                  eventId: event.id,
                  event: serializedEvent,
                });
              }}
            />

            {/* Meetups Header */}
            <View
              style={[
                styles.meetupsHeader,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.meetupsHeaderTitle, { color: colors.text }]}>
                Meetups
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllMeetups")}
              >
                <Text style={[styles.seeAllText, { color: colors.primary }]}>
                  See All
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
  meetupsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 8,
  },
  meetupsHeaderTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
