import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";

export default function NotificationsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // Notification settings state
  const [notificationSettings, setNotificationSettings] = useState({
    // Meetup Notifications
    meetup_invites: true,
    meetup_reminders: true,
    meetup_updates: true,
    meetup_cancelled: true,

    // Message Notifications
    new_messages: true,
    message_replies: true,

    // Social Notifications
    new_followers: true,
    profile_views: false,
    friend_requests: true,
    profile_likes: false,

    // System Notifications
    app_updates: true,
    promotions: false,
    verification_updates: true,
  });

  // Load notification preferences from Supabase
  useEffect(() => {
    const loadNotificationPreferences = async () => {
      console.log(
        "🔔 NotificationsScreen: Starting to load preferences for user:",
        user?.uid
      );

      if (!user?.uid) {
        console.log("🔔 NotificationsScreen: No user UID, skipping load");
        setIsLoading(false);
        return;
      }

      try {
        console.log(
          "🔔 NotificationsScreen: Fetching user data from Supabase..."
        );
        const userData = await SupabaseDataService.getUser(user.uid);
        console.log("🔔 NotificationsScreen: User data received:", {
          hasUserData: !!userData,
          hasNotificationPreferences: !!userData?.notificationPreferences,
          notificationPreferences: userData?.notificationPreferences,
        });

        if (userData?.notificationPreferences) {
          console.log(
            "🔔 NotificationsScreen: Setting notification preferences from database"
          );
          setNotificationSettings(userData.notificationPreferences);
        } else {
          console.log(
            "🔔 NotificationsScreen: No notification preferences found, using defaults"
          );
        }
      } catch (error) {
        console.error(
          "🔔 NotificationsScreen: Error loading notification preferences:",
          error
        );
      } finally {
        console.log("🔔 NotificationsScreen: Loading complete");
        setIsLoading(false);
      }
    };

    loadNotificationPreferences();
  }, [user?.uid]);

  const handleToggle = async (settingId: string) => {
    console.log(
      "🔔 NotificationsScreen: Toggle triggered for setting:",
      settingId
    );

    const newValue =
      !notificationSettings[settingId as keyof typeof notificationSettings];

    console.log(
      "🔔 NotificationsScreen: New value for",
      settingId,
      ":",
      newValue
    );

    // Update local state immediately for responsive UI
    setNotificationSettings((prev) => ({
      ...prev,
      [settingId]: newValue,
    }));

    // Save to Supabase
    if (user?.uid) {
      try {
        const updatedPreferences = {
          ...notificationSettings,
          [settingId]: newValue,
        };

        console.log("🔔 NotificationsScreen: Saving to Supabase:", {
          userId: user.uid,
          settingId,
          newValue,
          updatedPreferences,
        });

        const result = await SupabaseDataService.updateUser(user.uid, {
          notificationPreferences: updatedPreferences,
        });

        console.log("🔔 NotificationsScreen: Supabase update result:", result);
        console.log(
          "🔔 NotificationsScreen: Successfully saved notification preferences"
        );
      } catch (error) {
        console.error(
          "🔔 NotificationsScreen: Error saving notification preferences:",
          error
        );
        // Revert local state on error
        setNotificationSettings((prev) => ({
          ...prev,
          [settingId]: !newValue,
        }));
        console.log(
          "🔔 NotificationsScreen: Reverted local state due to error"
        );
      }
    } else {
      console.log("🔔 NotificationsScreen: No user UID available for saving");
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Meetups":
        return "#F97316";
      case "Messages":
        return "#10B981";
      case "Social":
        return "#EC4899";
      case "System":
        return "#6B7280";
      default:
        return "#3B82F6";
    }
  };

  const settingsData = [
    {
      category: "Meetups",
      items: [
        {
          id: "meetup_invites",
          title: "Meetup Invites",
          description: "When someone invites you to a meetup",
          icon: "calendar-outline",
        },
        {
          id: "meetup_reminders",
          title: "Meetup Reminders",
          description: "Reminders before your meetups start",
          icon: "time-outline",
        },
        {
          id: "meetup_updates",
          title: "Meetup Updates",
          description: "When meetup details are changed",
          icon: "refresh-outline",
        },
        {
          id: "meetup_cancelled",
          title: "Meetup Cancelled",
          description: "When a meetup you're attending is cancelled",
          icon: "close-circle-outline",
        },
      ],
    },
    {
      category: "Messages",
      items: [
        {
          id: "new_messages",
          title: "New Messages",
          description: "When you receive a new message",
          icon: "mail-outline",
        },
        {
          id: "message_replies",
          title: "Message Replies",
          description: "When someone replies to your message",
          icon: "chatbubble-outline",
        },
      ],
    },
    {
      category: "Social",
      items: [
        {
          id: "new_followers",
          title: "New Followers",
          description: "When someone follows you",
          icon: "person-add-outline",
        },
        {
          id: "profile_views",
          title: "Profile Views",
          description: "When someone views your profile",
          icon: "eye-outline",
        },
        {
          id: "friend_requests",
          title: "Friend Requests",
          description: "When someone sends you a friend request",
          icon: "people-outline",
        },
        {
          id: "profile_likes",
          title: "Profile Likes",
          description: "When someone likes your profile",
          icon: "heart-outline",
        },
      ],
    },
    {
      category: "System",
      items: [
        {
          id: "app_updates",
          title: "App Updates",
          description: "Important app updates and new features",
          icon: "sparkles-outline",
        },
        {
          id: "promotions",
          title: "Promotions",
          description: "Special offers and promotional content",
          icon: "gift-outline",
        },
        {
          id: "verification_updates",
          title: "Verification Updates",
          description: "Updates about your account verification",
          icon: "checkmark-done-circle-outline",
        },
      ],
    },
  ];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.leftContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Notification Settings
          </Text>
        </View>
        <View style={styles.rightContainer} />
      </View>

      {/* Settings List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading notification settings...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {settingsData.map((section, sectionIndex) => (
            <View key={section.category} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {section.category}
              </Text>

              <View
                style={[
                  styles.sectionContent,
                  { backgroundColor: colors.surface },
                ]}
              >
                {section.items.map((item, itemIndex) => (
                  <View key={item.id}>
                    <View style={styles.settingRow}>
                      <View style={styles.settingLeft}>
                        <View
                          style={[
                            styles.iconContainer,
                            { backgroundColor: getCategoryColor(section.category) },
                          ]}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={20}
                            color="#FFFFFF"
                          />
                        </View>
                        <View style={styles.settingText}>
                          <Text
                            style={[
                              styles.settingTitle,
                              { color: colors.text },
                            ]}
                          >
                            {item.title}
                          </Text>
                          <Text
                            style={[
                              styles.settingDescription,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {item.description}
                          </Text>
                        </View>
                      </View>
                        <Switch
                          value={
                            notificationSettings[
                              item.id as keyof typeof notificationSettings
                            ]
                          }
                          onValueChange={() => handleToggle(item.id)}
                          trackColor={{
                            false: colors.border,
                            true: getCategoryColor(section.category),
                          }}
                          thumbColor={
                            notificationSettings[
                              item.id as keyof typeof notificationSettings
                            ]
                              ? "#FFFFFF"
                              : colors.textTertiary
                          }
                        />
                    </View>
                    {itemIndex < section.items.length - 1 && (
                      <View
                        style={[
                          styles.separator,
                          { backgroundColor: colors.border },
                        ]}
                      />
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
  },
  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    paddingLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  separator: {
    height: 1,
    marginLeft: 68,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
});
