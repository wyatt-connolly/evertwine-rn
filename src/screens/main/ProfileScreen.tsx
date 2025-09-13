import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { FirestoreService } from "../../services/firebase";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ navigation }: any) {
  const { user, logout, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const [loading, setLoading] = useState(false);

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

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
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
});
