import React, { useState } from "react";
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

export default function SettingsScreen({ navigation }: any) {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleTheme, colors } = useThemeStore();
  const { preferences, getCompletionPercentage } = usePreferenceStore();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

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

  const handleAbout = () => {
    Alert.alert(
      "About Evertwine",
      "Version 1.0.0\n\nEvertwine helps you connect with people who share your interests through local meetups and events.\n\n© 2024 Evertwine"
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete Account",
              "Account deletion feature coming soon!"
            );
          },
        },
      ]
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
            <Ionicons name="person-outline" size={24} color={colors.primary} />
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
            <Ionicons name="key-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Change Password
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleDataExport}>
            <Ionicons
              name="download-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Export Data
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Meetup Preferences
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handlePreferences}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
            <View style={styles.preferenceTextContainer}>
              <Text style={[styles.preferenceMainText, { color: colors.text }]}>
                Manage Preferences
              </Text>
              <Text
                style={[
                  styles.preferenceSubtext,
                  { color: colors.textSecondary },
                ]}
              >
                {completionPercentage}% complete
              </Text>
            </View>
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
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Push Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Email Notifications
            </Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
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
            <Ionicons
              name="location-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Location Services
            </Text>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>

          <TouchableOpacity style={styles.menuItem} onPress={handlePrivacy}>
            <Ionicons name="shield-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleTerms}>
            <Ionicons
              name="document-text-outline"
              size={24}
              color={colors.primary}
            />
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
            <Ionicons name="moon-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.surface}
            />
          </View>
        </View>

        {/* Storage Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Storage
          </Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleClearCache}>
            <Ionicons name="trash-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Clear Cache
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Support Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Support
          </Text>

          <TouchableOpacity style={styles.menuItem} onPress={handleContact}>
            <Ionicons name="mail-outline" size={24} color={colors.primary} />
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
            <Ionicons
              name="information-circle-outline"
              size={24}
              color={colors.primary}
            />
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
            <Ionicons name="trash-outline" size={24} color={colors.error} />
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

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: colors.error }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={24} color={colors.onPrimary} />
          <Text style={[styles.logoutButtonText, { color: colors.onPrimary }]}>
            Logout
          </Text>
        </TouchableOpacity>
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
    marginLeft: 16,
  },
  preferenceTextContainer: {
    flex: 1,
    marginLeft: 16,
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
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
