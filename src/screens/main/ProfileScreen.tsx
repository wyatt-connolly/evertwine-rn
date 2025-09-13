import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { FirestoreService } from "../../services/firebase";
import * as ImagePicker from "expo-image-picker";
import { getMockUserStats, mockBadges } from "../../data/mockData";
import { UserStats, Badge } from "../../types";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "stats" | "badges">(
    "profile"
  );

  const userStats = getMockUserStats("user1");
  const badges = mockBadges;

  const handleEditProfile = () => {
    navigation.navigate("EditProfile");
  };

  const handleChangePhoto = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload a photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setLoading(true);

        // Update user profile with new photo
        updateUserProfile({
          photoURL: result.assets[0].uri,
        });

        // Update in Firestore
        if (user?.uid) {
          await FirestoreService.updateUser(user.uid, {
            photoURL: result.assets[0].uri,
          });
        }

        setLoading(false);
        Alert.alert("Success", "Profile photo updated!");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to update photo. Please try again.");
      console.error("Photo update error:", error);
    }
  };

  const handleSettings = () => {
    navigation.navigate("Settings");
  };

  const handlePrivacy = () => {
    Alert.alert("Privacy", "Privacy settings coming soon!");
  };

  const handleNotifications = () => {
    Alert.alert("Notifications", "Notification settings coming soon!");
  };

  const handleHelp = () => {
    Alert.alert("Help & Support", "Help center coming soon!");
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity
          onPress={handleSettings}
          style={styles.settingsButton}
        >
          <Ionicons name="settings-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["profile", "stats", "badges"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab ? colors.onPrimary : colors.textSecondary,
                },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {activeTab === "profile" && (
          <>
            {/* Profile Header */}
            <View
              style={[
                styles.profileHeader,
                { backgroundColor: colors.surface },
              ]}
            >
              <TouchableOpacity
                onPress={handleChangePhoto}
                style={styles.photoContainer}
              >
                {user?.photoURL ? (
                  <Image
                    source={{ uri: user.photoURL }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <View
                    style={[
                      styles.profilePhotoPlaceholder,
                      { backgroundColor: colors.surfaceVariant },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={40}
                      color={colors.textSecondary}
                    />
                  </View>
                )}
                <View
                  style={[
                    styles.photoEditBadge,
                    {
                      backgroundColor: colors.primary,
                      borderColor: colors.surface,
                    },
                  ]}
                >
                  <Ionicons name="camera" size={16} color={colors.onPrimary} />
                </View>

                {/* Verification Badge */}
                <View
                  style={[
                    styles.verificationBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.onPrimary}
                  />
                </View>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {user?.displayName || "User"}
                </Text>
                {user?.bio && (
                  <Text style={[styles.bio, { color: colors.textSecondary }]}>
                    {user.bio}
                  </Text>
                )}

                {/* Level and Points */}
                {userStats && (
                  <View style={styles.levelContainer}>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[styles.levelText, { color: colors.onPrimary }]}
                      >
                        Level {userStats.level}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.pointsText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {userStats.points.toLocaleString()} points
                    </Text>
                  </View>
                )}

                {user?.interests && user.interests.length > 0 && (
                  <View style={styles.interestsContainer}>
                    <Text
                      style={[
                        styles.interestsLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Interests
                    </Text>
                    <View style={styles.interestsList}>
                      {user.interests.slice(0, 6).map((interest, index) => (
                        <View
                          key={index}
                          style={[
                            styles.interestTag,
                            {
                              backgroundColor: colors.primary + "20",
                              borderColor: colors.primary + "40",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.interestTagText,
                              { color: colors.primary },
                            ]}
                          >
                            {interest}
                          </Text>
                        </View>
                      ))}
                      {user.interests.length > 6 && (
                        <View
                          style={[
                            styles.interestTag,
                            {
                              backgroundColor: colors.surfaceVariant,
                              borderColor: colors.border,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.interestTagText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            +{user.interests.length - 6} more
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          </>
        )}

        {activeTab === "stats" && userStats && (
          <View style={[styles.statsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.statsTitle, { color: colors.text }]}>
              Your Stats
            </Text>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.level}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Level
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.points.toLocaleString()}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Points
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.streak}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Day Streak
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.primary }]}>
                  {userStats.badges.length}
                </Text>
                <Text
                  style={[styles.statLabel, { color: colors.textSecondary }]}
                >
                  Badges
                </Text>
              </View>
            </View>

            {/* Experience Bar */}
            <View style={styles.experienceContainer}>
              <Text
                style={[
                  styles.experienceLabel,
                  { color: colors.textSecondary },
                ]}
              >
                Experience to Next Level
              </Text>
              <View
                style={[
                  styles.experienceBar,
                  { backgroundColor: colors.surfaceVariant },
                ]}
              >
                <View
                  style={[
                    styles.experienceProgress,
                    {
                      backgroundColor: colors.primary,
                      width: `${(userStats.experience % 1000) / 10}%`,
                    },
                  ]}
                />
              </View>
              <Text
                style={[styles.experienceText, { color: colors.textSecondary }]}
              >
                {userStats.experience % 1000}/1000 XP
              </Text>
            </View>
          </View>
        )}

        {activeTab === "badges" && (
          <View style={styles.badgesContainer}>
            <Text style={[styles.badgesTitle, { color: colors.text }]}>
              Your Badges ({badges.length})
            </Text>
            {badges.map((badge: Badge) => (
              <View
                key={badge.id}
                style={[styles.badgeItem, { backgroundColor: colors.surface }]}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={[styles.badgeName, { color: colors.text }]}>
                    {badge.name}
                  </Text>
                  <Text
                    style={[
                      styles.badgeDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {badge.description}
                  </Text>
                  <Text style={[styles.badgeRarity, { color: colors.primary }]}>
                    {badge.rarity.toUpperCase()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Profile Stats */}
        <View
          style={[styles.statsContainer, { backgroundColor: colors.surface }]}
        >
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Meetups
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Friends
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: colors.text }]}>0</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Events
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={24} color={colors.primary} />
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
            onPress={handleNotifications}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Notifications
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handlePrivacy}
          >
            <Ionicons name="shield-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Privacy & Security
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleHelp}
          >
            <Ionicons
              name="help-circle-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Help & Support
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleSettings}
          >
            <Ionicons
              name="settings-outline"
              size={24}
              color={colors.primary}
            />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Settings
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 8,
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  photoEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
  },
  profileInfo: {
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    marginBottom: 2,
  },
  phone: {
    fontSize: 16,
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  interestsContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  interestsLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    maxWidth: 280,
  },
  interestTag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    margin: 2,
  },
  interestTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 20,
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
    fontSize: 14,
  },
  menuContainer: {
    borderRadius: 12,
    marginBottom: 20,
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
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Gamification Styles
  verificationBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  pointsText: {
    fontSize: 14,
  },
  statsCard: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  experienceContainer: {
    marginTop: 16,
  },
  experienceLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  experienceBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  experienceProgress: {
    height: "100%",
    borderRadius: 4,
  },
  experienceText: {
    fontSize: 12,
    textAlign: "right",
  },
  badgesContainer: {
    marginBottom: 20,
  },
  badgesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  badgeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  badgeRarity: {
    fontSize: 12,
    fontWeight: "600",
  },
});
