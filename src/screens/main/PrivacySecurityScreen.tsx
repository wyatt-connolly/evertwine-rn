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
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { useFocusEffect } from "@react-navigation/native";
import * as WebBrowser from "expo-web-browser";

export default function PrivacySecurityScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [dataSharingEnabled, setDataSharingEnabled] = useState(true);
  const [showInCommunityHighlights, setShowInCommunityHighlights] =
    useState(true);
  const [blockedUsersCount, setBlockedUsersCount] = useState(0);

  // Load user privacy settings on mount
  useEffect(() => {
    loadPrivacySettings();
  }, []);

  // Refresh blocked users count when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (user?.uid) {
        loadBlockedUsersCount();
      }
    }, [user?.uid])
  );

  const loadPrivacySettings = async () => {
    if (!user?.uid) return;

    try {
      const userData = await DataService.getUser(user.uid);
      if (userData.user) {
        // For now, just load basic settings - locationEnabled will be handled separately
        // when the User type is updated to include privacy preferences
        console.log("Privacy settings loaded");
      }

      // Load blocked users count
      await loadBlockedUsersCount();
    } catch (error) {
      console.error("Error loading privacy settings:", error);
    }
  };

  const loadBlockedUsersCount = async () => {
    if (!user?.uid) return;

    try {
      const blockedUsers = await DataService.getBlockedUsers(user.uid);
      setBlockedUsersCount(blockedUsers.length);
    } catch (error) {
      console.error("Error loading blocked users count:", error);
    }
  };

  const handleLocationToggle = async (value: boolean) => {
    setLocationEnabled(value);

    if (user?.uid) {
      try {
        if (true) {
          // TODO: Update when User type includes locationEnabled field
          // await SupabaseDataService.updateUser(user.uid, {
          //   locationEnabled: value,
          // });
          console.log("Location setting would be saved:", value);
        }
      } catch (error) {
        setLocationEnabled(!value);
        Alert.alert("Error", "Failed to save location setting");
      }
    }
  };

  const handleDataSharingToggle = async (value: boolean) => {
    setDataSharingEnabled(value);
    // TODO: Save to backend when data sharing preferences are implemented
  };

  const handleCommunityHighlightsToggle = async (value: boolean) => {
    setShowInCommunityHighlights(value);

    if (user?.uid) {
      try {
        // TODO: Update user's showInCommunityHighlights preference in Supabase
        // when the User type is updated to include this field
        console.log("Community highlights preference:", value);
      } catch (error) {
        console.error("Error updating community highlights preference:", error);
      }
    }
  };

  const handleBlockedUsers = () => {
    navigation.navigate("BlockedUsers");
  };

  const handleExportData = () => {
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

  const handlePrivacyPolicy = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://www.evertwine.social/legal?doc=privacy-policy"
      );
    } catch (error) {
      Alert.alert("Error", "Unable to open Privacy Policy");
    }
  };

  const handleTermsOfService = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://www.evertwine.social/legal?doc=terms-of-service"
      );
    } catch (error) {
      Alert.alert("Error", "Unable to open Terms of Service");
    }
  };

  const handleCookiePolicy = async () => {
    try {
      await WebBrowser.openBrowserAsync(
        "https://www.evertwine.social/legal?doc=cookie-policy"
      );
    } catch (error) {
      Alert.alert("Error", "Unable to open Cookie Policy");
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
        <Text style={[styles.title, { color: colors.text }]}>
          Privacy & Security
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Privacy Settings Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Privacy Settings
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

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <Text style={[styles.menuText, { color: colors.text }]}>
              Data Sharing
            </Text>
            <Switch
              value={dataSharingEnabled}
              onValueChange={handleDataSharingToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuItemLeft}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Show in Community Highlights
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                Appear in featured and active member sections
              </Text>
            </View>
            <Switch
              value={showInCommunityHighlights}
              onValueChange={handleCommunityHighlightsToggle}
              trackColor={{ false: colors.border, true: "#10B981" }}
              thumbColor={colors.surface}
            />
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleBlockedUsers}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Blocked Users
            </Text>
            <View style={styles.menuItemRight}>
              <Text style={[styles.countText, { color: colors.textSecondary }]}>
                {blockedUsersCount}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textTertiary}
              />
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Management Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Data Management
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleExportData}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Export My Data
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleClearCache}
          >
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

        {/* Legal Documents Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Legal Documents
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handlePrivacyPolicy}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Privacy Policy
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleTermsOfService}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Terms of Service
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleCookiePolicy}
          >
            <Text style={[styles.menuText, { color: colors.text }]}>
              Cookie Policy
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    flex: 1,
  },
  menuItemLeft: {
    flex: 1,
  },
  menuSubtext: {
    fontSize: 14,
    marginTop: 2,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  countText: {
    fontSize: 14,
  },
});
