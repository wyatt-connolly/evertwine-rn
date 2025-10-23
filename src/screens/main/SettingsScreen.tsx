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
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { SupabaseAuthService } from "../../services/supabase";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { SupabaseStorageService } from "../../services/SupabaseStorageService";
import { DataService } from "../../services/DataService";

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  
  // Enhanced notification states
  const [pushNotifications, setPushNotifications] = useState(true);
  const [meetupNotifications, setMeetupNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [activityNotifications, setActivityNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // App preferences states
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<"miles" | "km">("miles");

  // Load user settings from Supabase on mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    if (!user?.uid) return;

    try {
      const userData = await DataService.getUser(user.uid);
      if (userData.user) {
        // TODO: Load notification settings when User type is updated
        console.log("User settings loaded");
      }
    } catch (error) {
      console.error("Error loading user settings:", error);
    }
  };

  // Notification handlers
  const handlePushNotificationsToggle = async (value: boolean) => {
    setPushNotifications(value);
    // TODO: Save to backend when User type includes these fields
    console.log("Push notifications:", value);
  };

  const handleMeetupNotificationsToggle = async (value: boolean) => {
    setMeetupNotifications(value);
    console.log("Meetup notifications:", value);
  };

  const handleMessageNotificationsToggle = async (value: boolean) => {
    setMessageNotifications(value);
    console.log("Message notifications:", value);
  };

  const handleActivityNotificationsToggle = async (value: boolean) => {
    setActivityNotifications(value);
    console.log("Activity notifications:", value);
  };

  const handleEmailNotificationsToggle = async (value: boolean) => {
    setEmailNotifications(value);
    console.log("Email notifications:", value);
  };

  // App preferences handlers
  const handleAutoPlayVideosToggle = (value: boolean) => {
    setAutoPlayVideos(value);
    console.log("Auto-play videos:", value);
  };

  const handleDistanceUnitToggle = () => {
    const newUnit = distanceUnit === "miles" ? "km" : "miles";
    setDistanceUnit(newUnit);
    console.log("Distance unit:", newUnit);
  };

  // Navigation handlers
  const handlePrivacySecurity = () => {
    navigation.navigate("PrivacySecurity");
  };

  const handleHelpSupport = () => {
    navigation.navigate("HelpSupport");
  };

  const handleLanguage = () => {
    Alert.alert("Language", "Language selection coming soon!");
  };

  const handleDefaultLocation = () => {
    Alert.alert("Default Location", "Location selection coming soon!");
  };

  // Delete account functionality (keep existing)
  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account? This action cannot be undone and will delete all your data including:\n\n• Your profile and personal information\n• All your meetups and events\n• Your messages and conversations\n• Your favorites and preferences\n• Your activity history",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete Account",
          style: "destructive",
          onPress: () => {
            // Second confirmation
            Alert.alert(
              "Final Confirmation",
              "This is your final warning. Your account and all data will be permanently deleted. Are you absolutely sure?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Yes, Delete Forever",
                  style: "destructive",
                  onPress: confirmDeleteAccount,
                },
              ]
            );
          },
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "Unable to delete account. Please try again.");
      return;
    }

    try {
      // Show loading state
      Alert.alert(
        "Deleting Account",
        "Please wait while we delete your account and all associated data..."
      );

      // Delete all user files from storage first
      try {
        await SupabaseStorageService.deleteAllUserFiles(user.uid);
      } catch (storageError) {
        // Continue with database deletion even if storage deletion fails
      }

      // Delete all user data from Supabase database
      const supabaseResult = await SupabaseDataService.deleteUserAccount(
        user.uid
      );

      if (supabaseResult.error) {
        Alert.alert(
          "Delete Failed",
          `Unable to delete your account data. Please try again later.`
        );
        return;
      }

      // Delete the account from Supabase Auth (signs out user)
      const authResult = await SupabaseAuthService.deleteAccount();

      if (authResult.error) {
        Alert.alert(
          "Delete Failed",
          `Unable to complete account deletion. Please try again later.`
        );
        return;
      }

      // Success - logout and navigate to auth screen
      await logout();

      // Show success message
      Alert.alert(
        "Account Deleted",
        "Your account data has been successfully deleted from our database. You have been signed out and will be redirected to the login screen.",
        [{ text: "OK" }]
      );
    } catch (error: any) {
      Alert.alert(
        "Delete Failed",
        "We encountered an error while deleting your account. Please try again later or contact support if the problem persists."
      );
    }
  };

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
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Receive notifications on your device
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={handlePushNotificationsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="people-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Meetup Notifications
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Invites, updates, and reminders
              </Text>
            </View>
            <Switch
              value={meetupNotifications}
              onValueChange={handleMeetupNotificationsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="chatbubble-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Message Notifications
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                New messages and replies
              </Text>
            </View>
            <Switch
              value={messageNotifications}
              onValueChange={handleMessageNotificationsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="heart-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Activity Notifications
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Likes, follows, and comments
              </Text>
            </View>
            <Switch
              value={activityNotifications}
              onValueChange={handleActivityNotificationsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Email Notifications
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Newsletter, updates, and promotions
              </Text>
            </View>
            <Switch
              value={emailNotifications}
              onValueChange={handleEmailNotificationsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* App Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Preferences
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleLanguage}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
              <Ionicons name="language-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Language
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                English
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleDefaultLocation}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
              <Ionicons name="location-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Default Location
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Set your search location
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleDistanceUnitToggle}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
              <Ionicons name="resize-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Distance Units
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                {distanceUnit === "miles" ? "Miles" : "Kilometers"}
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#8B5CF6" }]}>
              <Ionicons name="play-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Auto-play Videos
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Automatically play videos in feeds
              </Text>
            </View>
            <Switch
              value={autoPlayVideos}
              onValueChange={handleAutoPlayVideosToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Privacy & Security Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy & Security
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handlePrivacySecurity}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#10B981" }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Privacy & Security
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Location, data, blocked users, legal
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Appearance
          </Text>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={[styles.iconContainer, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="color-palette-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Always use dark theme
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Help & Support Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Help & Support
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleHelpSupport}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#06B6D4" }]}>
              <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Help & Support
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Contact us, report bugs, send feedback
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.iconContainer, { backgroundColor: "#EF4444" }]}>
              <Ionicons name="warning-outline" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.error }]}>
                Delete Account
              </Text>
              <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                Permanently delete your account and data
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
    paddingBottom: 40,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
  },
});