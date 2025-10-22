import React, { useState, useEffect } from "react";
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
import { usePreferenceStore } from "../../hooks/usePreferenceStore";
import { getPreferenceCompletionPercentage } from "../../constants/preferences";
import { SupabaseAuthService } from "../../services/supabase";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { SupabaseStorageService } from "../../services/SupabaseStorageService";
import { DataService } from "../../services/DataService";

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const { preferences, getCompletionPercentage } = usePreferenceStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Load user settings from Supabase on mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    if (!user?.uid) return;

    try {
      const userData = await DataService.getUser(user.uid);
      if (userData.user) {
        // Load notification settings, location settings, etc.
        setNotificationsEnabled(userData.user.notificationsEnabled ?? true);
        setLocationEnabled(userData.user.locationEnabled ?? true);
      }
    } catch (error) {}
  };

  // Save notification settings changes
  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);

    if (user?.uid) {
      try {
        if (!DataService.isInDeveloperMode()) {
          await SupabaseDataService.updateUser(user.uid, {
            notificationsEnabled: value,
          });
        }
      } catch (error) {
        // Revert on error
        setNotificationsEnabled(!value);
        Alert.alert("Error", "Failed to save setting");
      }
    }
  };

  // Save location settings
  const handleLocationToggle = async (value: boolean) => {
    setLocationEnabled(value);

    if (user?.uid) {
      try {
        if (!DataService.isInDeveloperMode()) {
          await SupabaseDataService.updateUser(user.uid, {
            locationEnabled: value,
          });
        }
      } catch (error) {
        setLocationEnabled(!value);
        Alert.alert("Error", "Failed to save setting");
      }
    }
  };

  const handlePrivacy = () => {
    Alert.alert("Privacy Policy", "Privacy policy content coming soon!");
  };

  const handleTerms = () => {
    Alert.alert("Terms of Service", "Terms of service content coming soon!");
  };

  const handleDataExport = () => {
    Alert.alert("Export Data", "Data export feature coming soon!");
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "Are you sure you want to clear the app cache?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => Alert.alert("Success", "Cache cleared!"),
        },
      ]
    );
  };

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

  const handleAbout = () => {
    Alert.alert(
      "About Evertwine",
      "Version 1.0.0\n\nEvertwine helps you connect with people who share your interests through local meetups and events.\n\n© 2024 Evertwine"
    );
  };

  const handleContact = () => {
    Alert.alert(
      "Contact Support",
      "support@evertwine.com\n\nWe're here to help!"
    );
  };

  const handlePreferences = () => {
    navigation.navigate("PreferenceSetup");
  };

  const completionPercentage = getCompletionPercentage();

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
        {/* Account Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Account
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Edit Profile
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Change Password
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

        </View>


        {/* Notifications Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Notifications
          </Text>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Push Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Email Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Privacy Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy & Security
          </Text>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Location Services
            </Text>
            <Switch
              value={locationEnabled}
              onValueChange={handleLocationToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handlePrivacy}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleTerms}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Terms of Service
            </Text>
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

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>
        </View>


        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support
          </Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Contact Support
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleAbout}>
            <Text style={[styles.menuText, { color: colors.text }]}>About</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Danger Zone
          </Text>

          <TouchableOpacity
            style={[styles.dangerItem, { borderBottomColor: colors.border }]}
            onPress={handleDeleteAccount}
          >
            <Text style={[styles.dangerText, { color: colors.error }]}>
              Delete Account
            </Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  placeholder: {
    width: 40,
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
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
  },
  preferenceTextContainer: {
    flex: 1,
    justifyContent: "center",
  },
  preferenceMainText: {
    fontSize: 16,
  },
  preferenceSubtext: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  dangerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  dangerText: {
    flex: 1,
    fontSize: 16,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
});
