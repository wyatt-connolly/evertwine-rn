import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { PushNotificationService } from "../../services/PushNotificationService";

export default function NotificationSettingsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();

  // Notification settings states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meetupNotifications, setMeetupNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [marketingNotifications, setMarketingNotifications] = useState(false);

  // Load user notification settings from Supabase on mount
  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    if (!user?.uid) return;

    try {
      const userData = await SupabaseDataService.getUser(user.uid);

      if (userData?.notificationPreferences) {
        const prefs = userData.notificationPreferences;
        setMeetupNotifications(prefs.meetup_invites ?? true);
        setMessageNotifications(prefs.new_messages ?? true);
        setActivityNotifications(prefs.new_followers ?? true);
        setEmailNotifications(prefs.promotions ?? false);
        setMarketingNotifications(prefs.promotions ?? false);
      }

      // Check push notification permission
      const hasPermission = await PushNotificationService.hasPermission();
      setPushNotifications(hasPermission);
    } catch (error) {}
  };

  // Notification toggle handlers
  const handlePushNotificationsToggle = async (value: boolean) => {
    setPushNotifications(value);
    try {
      if (value) {
        // Request permission and save token
        const hasPermission =
          await PushNotificationService.requestPermissions();
        if (hasPermission.status === "granted") {
          await PushNotificationService.refreshPushToken();
        }
      }
    } catch (error) {
      setPushNotifications(!value); // Revert on error
    }
  };

  const handleMeetupNotificationsToggle = async (value: boolean) => {
    setMeetupNotifications(value);
    try {
      // TODO: Save to Supabase
    } catch (error) {
      setMeetupNotifications(!value);
    }
  };

  const handleMessageNotificationsToggle = async (value: boolean) => {
    setMessageNotifications(value);
    try {
      // TODO: Save to Supabase
    } catch (error) {
      setMessageNotifications(!value);
    }
  };

  const handleActivityNotificationsToggle = async (value: boolean) => {
    setActivityNotifications(value);
    try {
      // TODO: Save to Supabase
    } catch (error) {
      setActivityNotifications(!value);
    }
  };

  const handleEmailNotificationsToggle = async (value: boolean) => {
    setEmailNotifications(value);
    try {
      // TODO: Save to Supabase
    } catch (error) {
      setEmailNotifications(!value);
    }
  };

  const handleMarketingNotificationsToggle = async (value: boolean) => {
    setMarketingNotifications(value);
    try {
      // TODO: Save to Supabase
    } catch (error) {
      setMarketingNotifications(!value);
    }
  };

  const renderNotificationSetting = (
    title: string,
    description: string,
    value: boolean,
    onToggle: (value: boolean) => void
  ) => (
    <View style={[styles.settingItem, { borderBottomColor: colors.border }]}>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text
          style={[styles.settingDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: colors.border, true: "#10B981" }}
        thumbColor={colors.surface}
      />
    </View>
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
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Notification Settings
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Push Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Push Notifications
          </Text>

          {renderNotificationSetting(
            "Push Notifications",
            "Receive notifications on your device",
            pushNotifications,
            handlePushNotificationsToggle
          )}

          {renderNotificationSetting(
            "Meetup Notifications",
            "Get notified about meetup invitations and updates",
            meetupNotifications,
            handleMeetupNotificationsToggle
          )}

          {renderNotificationSetting(
            "Message Notifications",
            "Get notified about new messages and conversations",
            messageNotifications,
            handleMessageNotificationsToggle
          )}

          {renderNotificationSetting(
            "Activity Notifications",
            "Get notified about likes, follows, and comments",
            activityNotifications,
            handleActivityNotificationsToggle
          )}
        </View>

        {/* Email Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Email Notifications
          </Text>

          {renderNotificationSetting(
            "Email Notifications",
            "Receive important updates via email",
            emailNotifications,
            handleEmailNotificationsToggle
          )}

          {renderNotificationSetting(
            "Marketing & Updates",
            "Receive promotional content and app updates",
            marketingNotifications,
            handleMarketingNotificationsToggle
          )}
        </View>

        {/* Additional Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Additional Settings
          </Text>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              Alert.alert(
                "Notification Schedule",
                "Choose when you want to receive notifications",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Set Schedule",
                    onPress: () => {},
                  },
                ]
              );
            }}
          >
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Quiet Hours
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Set times when you don't want to be disturbed
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.settingItem, { borderBottomColor: colors.border }]}
            onPress={() => {
              Alert.alert(
                "Notification Sounds",
                "Choose notification sounds and vibration patterns",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Customize",
                    onPress: () => {},
                  },
                ]
              );
            }}
          >
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>
                Sounds & Vibration
              </Text>
              <Text
                style={[
                  styles.settingDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Customize notification sounds and vibration
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
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
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
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
    lineHeight: 20,
  },
});
