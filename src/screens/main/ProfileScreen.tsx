import React, { useState, useEffect, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  Switch,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { DataService } from "../../services/DataService";
import * as ImagePicker from "expo-image-picker";
import { getMockUserStats, mockUsers } from "../../data/mockData";
import { UserStats, User } from "../../types";

const { width } = Dimensions.get("window");

export default function ProfileScreen({ navigation, route }: any) {
  const { user, logout, updateUserProfile } = useAuthStore();
  const { colors, isDarkMode, toggleTheme } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [profileUserData, setProfileUserData] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Get user data from navigation params or use current user
  const profileUserId = route?.params?.userId || user?.uid || "user1";
  const isViewingOtherProfile = profileUserId !== user?.uid;

  // Load profile data using DataService
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);

        // Load user profile data

        const userResult = await DataService.getUser(profileUserId);

        if (userResult.user) {
          setProfileUserData(userResult.user);
        } else if (route?.params?.userData) {
          setProfileUserData(route.params.userData);
        } else if (user && profileUserId === user.uid) {
          // If viewing own profile but no data in Supabase, create user record

          try {
            const createResult = await DataService.createUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName || "User",
              age: 25,
              gender: "Prefer not to say",
              pronouns: "they/them",
              bio: "",
              about: "",
              profilePictures: user.photoURL ? [user.photoURL] : [],
              standoutPhotoIndex: 0,
              location: { latitude: 0, longitude: 0 },
              locationName: "",
              phoneNumber: user.phoneNumber || "",
              school: "",
              jobTitle: "",
              jobCompany: "",
              professionalLevel: "",
              hometown: "",
              starSign: "",
              hobbies: [],
              interests: [],
              lookingFor: [],
              onboardingComplete: user.onboardingComplete || false,
              notificationsEnabled: true,
              locationEnabled: true,
            });

            if (createResult.success) {
              // Reload the user data
              const newUserResult = await DataService.getUser(profileUserId);
              if (newUserResult.user) {
                setProfileUserData(newUserResult.user);
              }
            } else {
              setProfileUserData(user);
            }
          } catch (error) {
            setProfileUserData(user);
          }
        } else {
        }

        // Load user stats

        try {
          const statsResult = await DataService.getUserStats(profileUserId);

          if (statsResult.stats) {
            setUserStats(statsResult.stats);
          } else {
            // Fallback to mock stats
            setUserStats(getMockUserStats(profileUserId));
          }
        } catch (statsError) {
          // Don't fail the entire loading process for stats
          setUserStats(getMockUserStats(profileUserId));
        }
      } catch (error) {
        // Fallback to mock data
        setProfileUserData(mockUsers[0]);
        setUserStats(getMockUserStats(profileUserId));
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [profileUserId, route?.params?.userData, user]);

  // Fade in animation on load
  useEffect(() => {
    if (!isLoading && profileUserData) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [isLoading, profileUserData]);

  // Reload profile data when screen comes into focus (e.g., after editing)
  useFocusEffect(
    React.useCallback(() => {
      console.log("👀 ProfileScreen focused, reloading data...");
      if (!isViewingOtherProfile) {
        // Reload current user's profile data
        const reloadData = async () => {
          console.log("🔄 Reloading profile data for:", profileUserId);
          const userResult = await DataService.getUser(profileUserId);
          if (userResult.user) {
            console.log("✅ Profile data reloaded:", {
              uid: userResult.user.uid,
              photoCount: userResult.user.profilePictures?.length || 0,
              photos: userResult.user.profilePictures,
            });
            setProfileUserData(userResult.user);
          }
        };
        reloadData();
      }
    }, [profileUserId, isViewingOtherProfile])
  );

  // Handle press animations
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 8,
    }).start();
  };

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
        mediaTypes: ["images"],
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

        // Update in Supabase
        if (user?.uid) {
          await SupabaseDataService.updateUser(user.uid, {
            photoURL: result.assets[0].uri,
          });
        }

        setLoading(false);
        Alert.alert("Success", "Profile photo updated!");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to update photo. Please try again.");
    }
  };

  const handlePrivacy = () => {
    navigation.navigate("PrivacySecurity");
  };

  const handleNotifications = () => {
    navigation.navigate("Notifications");
  };

  const handleHelp = () => {
    navigation.navigate("HelpSupport");
  };

  // Gradient colors for background
  const gradientColors = isDarkMode
    ? ["#1a1a2e", "#16213e", "#0f3460", "#533483"]
    : ["#667eea", "#764ba2", "#f093fb", "#4facfe"];

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          {/* Loading without text */}
        </View>
      </SafeAreaView>
    );
  }

  // Show empty state if no profile data
  if (!profileUserData) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient
          colors={gradientColors}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Profile not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFillObject}
      />

      {/* Header with glass effect */}
      <BlurView intensity={25} tint={isDarkMode ? "dark" : "light"} style={styles.headerBlur}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }]}>Profile</Text>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </BlurView>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header with Glass Effect */}
        <Animated.View
          style={[
            { opacity: fadeAnim },
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <BlurView
            intensity={25}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.profileHeaderGlass}
          >
            <View style={styles.profileHeader}>
              <TouchableOpacity
                onPress={isViewingOtherProfile ? undefined : handleChangePhoto}
                style={styles.photoContainer}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                {profileUserData?.profilePictures?.[0] ? (
                  <Image
                    source={{
                      uri: profileUserData.profilePictures[0],
                    }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <View
                    style={[
                      styles.profilePhotoPlaceholder,
                      { backgroundColor: colors.surfaceVariant + "40" },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={40}
                      color={colors.textSecondary}
                    />
                  </View>
                )}

                {/* Verification Badge with Glass Effect */}
                <BlurView
                  intensity={20}
                  tint={isDarkMode ? "dark" : "light"}
                  style={styles.verificationBadgeGlass}
                >
                  <View
                    style={[
                      styles.verificationBadge,
                      { backgroundColor: colors.primary + "80" },
                    ]}
                  >
                    <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
                  </View>
                </BlurView>
              </TouchableOpacity>

              <View style={styles.profileInfo}>
                <Text style={[styles.name, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3 }]}>
                  {profileUserData?.name || profileUserData?.displayName || "User"}
                </Text>
                {profileUserData?.locationName && (
                  <Text style={[styles.location, { color: "#FFFFFF", opacity: 0.9, textShadowColor: "rgba(0, 0, 0, 0.2)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
                    📍 {profileUserData.locationName}
                  </Text>
                )}

                {/* Level and Points with Glass Effect */}
                {userStats && (
                  <View style={styles.levelContainer}>
                    <BlurView
                      intensity={20}
                      tint={isDarkMode ? "dark" : "light"}
                      style={styles.levelBadgeGlass}
                    >
                      <View
                        style={[
                          styles.levelBadge,
                          { backgroundColor: colors.primary + "80" },
                        ]}
                      >
                        <Text style={[styles.levelText, { color: colors.onPrimary }]}>
                          Level {userStats.level}
                        </Text>
                      </View>
                    </BlurView>
                    <View style={styles.statsTextContainer}>
                      <Text
                        style={[styles.pointsText, { color: "#FFFFFF", opacity: 0.9, textShadowColor: "rgba(0, 0, 0, 0.2)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}
                      >
                        {userStats.points.toLocaleString()} points
                      </Text>
                      <Text
                        style={[styles.streakText, { color: "#FFFFFF", opacity: 0.85, textShadowColor: "rgba(0, 0, 0, 0.2)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}
                      >
                        {userStats.streak} day streak
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </BlurView>
        </Animated.View>

        {/* Menu Items with Glass Effect */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <BlurView
            intensity={25}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.menuContainerGlass}
          >
            <View style={styles.menuContainer}>
              {!isViewingOtherProfile && (
                <TouchableOpacity
                  style={[styles.menuItem, { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                  onPress={handleEditProfile}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <BlurView
                    intensity={15}
                    tint={isDarkMode ? "dark" : "light"}
                    style={styles.iconContainerGlass}
                  >
                    <View
                      style={[styles.iconContainer, { backgroundColor: "#8B5CF6" + "80" }]}
                    >
                      <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                    </View>
                  </BlurView>
                  <Text style={[styles.menuText, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
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
                style={[styles.menuItem, { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                onPress={handleNotifications}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <BlurView
                  intensity={15}
                  tint={isDarkMode ? "dark" : "light"}
                  style={styles.iconContainerGlass}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "#3B82F6" + "80" }]}
                  >
                    <Ionicons
                      name="notifications-outline"
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                </BlurView>
                <Text style={[styles.menuText, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
                  Notifications
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { borderBottomColor: "rgba(255, 255, 255, 0.1)" }]}
                onPress={handlePrivacy}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <BlurView
                  intensity={15}
                  tint={isDarkMode ? "dark" : "light"}
                  style={styles.iconContainerGlass}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "#14B8A6" + "80" }]}
                  >
                    <Ionicons name="shield-outline" size={20} color="#FFFFFF" />
                  </View>
                </BlurView>
                <Text style={[styles.menuText, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
                  Privacy & Security
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={handleHelp}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <BlurView
                  intensity={15}
                  tint={isDarkMode ? "dark" : "light"}
                  style={styles.iconContainerGlass}
                >
                  <View
                    style={[styles.iconContainer, { backgroundColor: "#06B6D4" + "80" }]}
                  >
                    <Ionicons name="help-circle-outline" size={20} color="#FFFFFF" />
                  </View>
                </BlurView>
                <Text style={[styles.menuText, { color: "#FFFFFF", textShadowColor: "rgba(0, 0, 0, 0.3)", textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2 }]}>
                  Help & Support
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            </View>
          </BlurView>
        </Animated.View>

        {/* Logout Button with Glass Effect */}
        <Animated.View style={{ opacity: fadeAnim }}>
          <BlurView
            intensity={25}
            tint={isDarkMode ? "dark" : "light"}
            style={styles.logoutButtonGlass}
          >
            <TouchableOpacity
              style={[styles.logoutButton, { backgroundColor: colors.error + "80" }]}
              onPress={logout}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
            >
              <Ionicons name="log-out-outline" size={24} color={colors.onPrimary} />
              <Text style={[styles.logoutButtonText, { color: colors.onPrimary }]}>
                Logout
              </Text>
            </TouchableOpacity>
          </BlurView>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
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
  profileHeaderGlass: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  profileHeader: {
    padding: 20,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.3)",
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
  menuContainerGlass: {
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  menuContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
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
  iconContainerGlass: {
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonGlass: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  // Gamification Styles with Glass Effect
  verificationBadgeGlass: {
    position: "absolute",
    top: -5,
    right: -5,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  verificationBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  levelBadgeGlass: {
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 8,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
