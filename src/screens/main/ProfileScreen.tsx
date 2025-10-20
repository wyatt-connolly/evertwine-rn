import React, { useState, useEffect } from "react";
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
// import { FirestoreService } from "../../services/firebase"; // Removed Firebase
import { DataService } from "../../services/DataService";
import * as ImagePicker from "expo-image-picker";
import { getMockUserStats, mockUsers } from "../../data/mockData";
import { UserStats, User } from "../../types";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation, route }: any) {
  const { user, logout, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [profileUserData, setProfileUserData] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get user data from navigation params or use current user
  const profileUserId = route?.params?.userId || user?.uid || "user1";
  const isViewingOtherProfile = profileUserId !== user?.uid;

  // Load profile data using DataService
  useEffect(() => {
    const loadProfileData = async () => {
      console.log("🔄 ProfileScreen loading data for:", profileUserId);
      try {
        setIsLoading(true);

        // Load user profile data
        console.log("📊 Loading user profile data...");
        const userResult = await DataService.getUser(profileUserId);
        console.log("📊 User result:", {
          success: !!userResult.user,
          error: userResult.error,
        });

        if (userResult.user) {
          setProfileUserData(userResult.user);
          console.log("✅ Profile data loaded:", userResult.user.displayName);
        } else if (route?.params?.userData) {
          setProfileUserData(route.params.userData);
          console.log("✅ Using route params data");
        } else if (user) {
          setProfileUserData(user);
          console.log("✅ Using current user data");
        } else {
          console.log("❌ No profile data available");
        }

        // Load user stats
        console.log("📊 Loading user stats...");
        try {
          const statsResult = await DataService.getUserStats(profileUserId);
          console.log("📊 Stats result:", {
            success: !!statsResult.stats,
            error: statsResult.error,
          });

          if (statsResult.stats) {
            setUserStats(statsResult.stats);
            console.log("✅ Stats loaded");
          } else {
            // Fallback to mock stats in developer mode
            if (DataService.isInDeveloperMode()) {
              setUserStats(getMockUserStats(profileUserId));
              console.log("✅ Using mock stats");
            }
          }
        } catch (statsError) {
          console.error("❌ Error loading stats:", statsError);
          // Don't fail the entire loading process for stats
          if (DataService.isInDeveloperMode()) {
            setUserStats(getMockUserStats(profileUserId));
          }
        }
      } catch (error) {
        console.error("❌ Error loading profile data:", error);
        // In developer mode, fallback to mock data
        if (DataService.isInDeveloperMode()) {
          setProfileUserData(mockUsers[0]);
          setUserStats(getMockUserStats(profileUserId));
          console.log("✅ Using fallback mock data");
        } else {
          // In production, try to use current user data as fallback
          if (user) {
            setProfileUserData(user);
            console.log("✅ Using current user as fallback");
          }
        }
      } finally {
        setIsLoading(false);
        console.log("✅ ProfileScreen loading complete");
      }
    };

    loadProfileData();
  }, [profileUserId, route?.params?.userData, user]);

  console.log("👤 ProfileScreen loaded:", {
    routeParams: route?.params,
    profileUserId,
    isViewingOtherProfile,
    profileUserData: profileUserData?.displayName || "Unknown",
    userData: route?.params?.userData,
  });

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

  const handlePrivacy = () => {
    Alert.alert("Privacy", "Privacy settings coming soon!");
  };

  const handleNotifications = () => {
    Alert.alert("Notifications", "Notification settings coming soon!");
  };

  const handleHelp = () => {
    Alert.alert("Help & Support", "Help center coming soon!");
  };

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading profile...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no profile data
  if (!profileUserData) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Profile not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>
          {isViewingOtherProfile ? "Profile" : "Profile"}
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          <TouchableOpacity
            onPress={isViewingOtherProfile ? undefined : handleChangePhoto}
            style={styles.photoContainer}
          >
            {profileUserData?.avatar || profileUserData?.photoURL ? (
              <Image
                source={{
                  uri: profileUserData.avatar || profileUserData.photoURL,
                }}
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
            {!isViewingOtherProfile && (
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
            )}

            {/* Verification Badge */}
            <View
              style={[
                styles.verificationBadge,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>

          <View style={styles.profileInfo}>
            <Text style={[styles.name, { color: colors.text }]}>
              {profileUserData?.name || profileUserData?.displayName || "User"}
            </Text>
            {profileUserData?.locationName && (
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                📍 {profileUserData.locationName}
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
                  <Text style={[styles.levelText, { color: colors.onPrimary }]}>
                    Level {userStats.level}
                  </Text>
                </View>
                <View style={styles.statsTextContainer}>
                  <Text
                    style={[styles.pointsText, { color: colors.textSecondary }]}
                  >
                    {userStats.points.toLocaleString()} points
                  </Text>
                  <Text
                    style={[styles.streakText, { color: colors.textSecondary }]}
                  >
                    {userStats.streak} day streak
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Menu Items */}
        <View
          style={[styles.menuContainer, { backgroundColor: colors.surface }]}
        >
          {!isViewingOtherProfile && (
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomColor: colors.border }]}
              onPress={handleEditProfile}
            >
              <Ionicons
                name="create-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Edit Profile
              </Text>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.textTertiary}
              />
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate("Favorites")}
          >
            <Ionicons name="heart-outline" size={24} color={colors.primary} />
            <Text style={[styles.menuText, { color: colors.text }]}>
              Favorites
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
            onPress={() => navigation.navigate("Settings")}
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
  location: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
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
  statsTextContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  pointsText: {
    fontSize: 14,
    marginBottom: 2,
  },
  streakText: {
    fontSize: 12,
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
});
