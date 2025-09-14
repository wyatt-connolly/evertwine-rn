import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { FirestoreService } from "../../services/firebase";
import { getMockUserStats, mockUsers } from "../../data/mockData";
import { UserStats } from "../../types";
import * as ImagePicker from "expo-image-picker";

const INTERESTS = [
  "Technology",
  "Sports",
  "Music",
  "Art",
  "Travel",
  "Food",
  "Fitness",
  "Photography",
  "Reading",
  "Gaming",
  "Movies",
  "Dancing",
  "Cooking",
  "Hiking",
  "Yoga",
  "Fashion",
  "Business",
  "Science",
  "Nature",
  "Volunteering",
  "Learning",
  "Socializing",
  "Creativity",
  "Adventure",
];

export default function EditProfileScreen({ navigation }: any) {
  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const [loading, setLoading] = useState(false);

  // Local state for editable profile data
  const [profileData, setProfileData] = useState({
    ...mockUsers[0], // Start with Alex Chen's data
  });
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});

  const userStats = getMockUserStats("user1");

  const handleEditSection = (section: string) => {
    setEditingSection(section);

    // Set up temp data based on section
    switch (section) {
      case "Photo":
        setTempData({ profileImage: profileData.profilePictures[0] });
        break;
      case "Basic Info":
        setTempData({
          displayName: profileData.displayName,
          bio: profileData.bio,
          locationName: profileData.locationName,
        });
        break;
      case "Professional Info":
        setTempData({
          school: profileData.school,
          jobTitle: profileData.jobTitle,
          jobCompany: profileData.jobCompany,
        });
        break;
      case "Interests":
        setTempData({ hobbies: [...profileData.hobbies] });
        break;
    }
  };

  const handleSaveEdit = () => {
    if (!editingSection) return;

    // Update profile data based on section
    switch (editingSection) {
      case "Photo":
        setProfileData((prev) => ({
          ...prev,
          profilePictures: [
            tempData.profileImage,
            ...prev.profilePictures.slice(1),
          ],
        }));
        break;
      case "Basic Info":
        setProfileData((prev) => ({
          ...prev,
          displayName: tempData.displayName,
          bio: tempData.bio,
          locationName: tempData.locationName,
        }));
        break;
      case "Professional Info":
        setProfileData((prev) => ({
          ...prev,
          school: tempData.school,
          jobTitle: tempData.jobTitle,
          jobCompany: tempData.jobCompany,
        }));
        break;
      case "Interests":
        setProfileData((prev) => ({
          ...prev,
          hobbies: tempData.hobbies,
        }));
        break;
    }

    setEditingSection(null);
    setTempData({});
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setTempData({});
  };

  const handleLinkedInImport = () => {
    Alert.alert("LinkedIn Import", "LinkedIn integration coming soon!");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Drag Handle */}
      <View style={styles.dragHandleContainer}>
        <View
          style={[styles.dragHandle, { backgroundColor: colors.textTertiary }]}
        />
      </View>

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* LinkedIn Import Banner */}
        <TouchableOpacity
          style={[styles.linkedinBanner, { backgroundColor: colors.surface }]}
          onPress={handleLinkedInImport}
        >
          <View style={styles.linkedinBannerContent}>
            <Ionicons name="logo-linkedin" size={24} color="#0077B5" />
            <View style={styles.linkedinBannerText}>
              <Text
                style={[styles.linkedinBannerTitle, { color: colors.text }]}
              >
                Import from LinkedIn
              </Text>
              <Text
                style={[
                  styles.linkedinBannerSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Auto-fill your professional information
              </Text>
            </View>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.textTertiary}
          />
        </TouchableOpacity>

        {/* Profile Header - How it looks to others */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          {/* Photo Section with Edit */}
          <View style={styles.photoSection}>
            <View style={styles.photoContainer}>
              {profileData.profilePictures[0] ? (
                <Image
                  source={{ uri: profileData.profilePictures[0] }}
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
                  styles.verificationBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
              </View>
              {/* Edit Button Overlay */}
              <TouchableOpacity
                style={[
                  styles.photoEditBadge,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.surface,
                  },
                ]}
                onPress={() => handleEditSection("Photo")}
              >
                <Ionicons name="camera" size={16} color={colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Basic Info Section with Edit */}
          <View style={styles.infoSection}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Basic Information
              </Text>
              <TouchableOpacity
                style={styles.editIconButton}
                onPress={() => handleEditSection("Basic Info")}
              >
                <Ionicons
                  name="create-outline"
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
            </View>

            <Text style={[styles.name, { color: colors.text }]}>
              {profileData.displayName}
            </Text>
            {profileData.bio && (
              <Text style={[styles.bio, { color: colors.textSecondary }]}>
                {profileData.bio}
              </Text>
            )}
            {profileData.locationName && (
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                📍 {profileData.locationName}
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

        {/* Professional Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Professional Information
            </Text>
            <TouchableOpacity
              style={styles.editIconButton}
              onPress={() => handleEditSection("Professional Info")}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.professionalGrid}>
            <View style={styles.professionalItem}>
              <Ionicons
                name="school-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.professionalItemContent}>
                <Text
                  style={[
                    styles.professionalItemLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Education
                </Text>
                <Text
                  style={[styles.professionalItemValue, { color: colors.text }]}
                >
                  {profileData.school}
                </Text>
              </View>
            </View>

            <View style={styles.professionalItem}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.professionalItemContent}>
                <Text
                  style={[
                    styles.professionalItemLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Current Job
                </Text>
                <Text
                  style={[styles.professionalItemValue, { color: colors.text }]}
                >
                  {profileData.jobTitle}
                </Text>
                <Text
                  style={[
                    styles.professionalItemSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  {profileData.jobCompany}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Interests
            </Text>
            <TouchableOpacity
              style={styles.editIconButton}
              onPress={() => handleEditSection("Interests")}
            >
              <Ionicons
                name="create-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.interestsList}>
            {profileData.hobbies.slice(0, 6).map((hobby, index) => (
              <View
                key={`interest-${index}`}
                style={[
                  styles.interestTag,
                  {
                    backgroundColor: colors.primary + "20",
                    borderColor: colors.primary + "40",
                  },
                ]}
              >
                <Text
                  style={[styles.interestTagText, { color: colors.primary }]}
                >
                  {hobby}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Edit Modals */}
      {editingSection === "Photo" && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayBackground}
            onPress={handleCancelEdit}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={[styles.modal, { backgroundColor: colors.surface }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Profile Photo
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Profile Picture
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Choose a photo that represents you (coming soon: photo picker)
                </Text>
              </View>

              <View style={styles.photoPreview}>
                {tempData.profileImage ? (
                  <Image
                    source={{ uri: tempData.profileImage }}
                    style={styles.previewPhoto}
                  />
                ) : (
                  <View
                    style={[
                      styles.previewPlaceholder,
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
                <TouchableOpacity
                  style={[
                    styles.changePhotoButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons name="camera" size={16} color={colors.onPrimary} />
                  <Text
                    style={[
                      styles.changePhotoText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Change Photo
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveEdit}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      {editingSection === "Basic Info" && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayBackground}
            onPress={handleCancelEdit}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={[styles.modal, { backgroundColor: colors.surface }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Basic Info
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Display Name
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  How others will see your name
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.displayName}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({ ...prev, displayName: text }))
                  }
                  placeholder="Enter your display name"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Bio
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Tell others about yourself (max 150 characters)
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    styles.modalTextArea,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.bio}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({ ...prev, bio: text }))
                  }
                  placeholder="Share something about yourself..."
                  placeholderTextColor={colors.textTertiary}
                  multiline
                  numberOfLines={3}
                  maxLength={150}
                />
                <Text
                  style={[
                    styles.characterCount,
                    { color: colors.textTertiary },
                  ]}
                >
                  {tempData.bio?.length || 0}/150
                </Text>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Location
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Your current city or general area
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.locationName}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({
                      ...prev,
                      locationName: text,
                    }))
                  }
                  placeholder="e.g., San Francisco, CA"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveEdit}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      {editingSection === "Professional Info" && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayBackground}
            onPress={handleCancelEdit}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={[styles.modal, { backgroundColor: colors.surface }]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Professional Info
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Education
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Your school, university, or educational background
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.school}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({ ...prev, school: text }))
                  }
                  placeholder="e.g., Stanford University, Computer Science"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Job Title
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Your current position or role
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.jobTitle}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({ ...prev, jobTitle: text }))
                  }
                  placeholder="e.g., Software Engineer, Marketing Manager"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Company
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Where you currently work
                </Text>
                <TextInput
                  style={[
                    styles.modalInput,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={tempData.jobCompany}
                  onChangeText={(text) =>
                    setTempData((prev: any) => ({ ...prev, jobCompany: text }))
                  }
                  placeholder="e.g., Google, Apple, Self-employed"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveEdit}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}

      {editingSection === "Interests" && (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalOverlayBackground}
            onPress={handleCancelEdit}
            activeOpacity={1}
          >
            <TouchableOpacity
              style={[
                styles.modal,
                styles.largeModal,
                { backgroundColor: colors.surface },
              ]}
              activeOpacity={1}
              onPress={(e) => e.stopPropagation()}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Interests
              </Text>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  Your Interests & Hobbies
                </Text>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textTertiary },
                  ]}
                >
                  Select the activities and topics you're passionate about. This
                  helps others connect with you.
                </Text>
                <Text
                  style={[
                    styles.selectionCount,
                    { color: colors.textTertiary },
                  ]}
                >
                  {tempData.hobbies?.length || 0} interests selected
                </Text>
              </View>

              <ScrollView
                style={styles.interestsScrollContainer}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.interestsGrid}>
                  {INTERESTS.map((interest) => (
                    <TouchableOpacity
                      key={interest}
                      style={[
                        styles.interestButton,
                        {
                          backgroundColor: colors.background,
                          borderColor: colors.border,
                        },
                        tempData.hobbies?.includes(interest) && {
                          backgroundColor: colors.primary,
                          borderColor: colors.primary,
                        },
                      ]}
                      onPress={() => {
                        const hobbies = tempData.hobbies || [];
                        if (hobbies.includes(interest)) {
                          setTempData((prev: any) => ({
                            ...prev,
                            hobbies: hobbies.filter(
                              (h: string) => h !== interest
                            ),
                          }));
                        } else {
                          setTempData((prev: any) => ({
                            ...prev,
                            hobbies: [...hobbies, interest],
                          }));
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.interestText,
                          { color: colors.text },
                          tempData.hobbies?.includes(interest) && {
                            color: colors.onPrimary,
                          },
                        ]}
                      >
                        {interest}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleCancelEdit}
                >
                  <Text
                    style={[styles.modalButtonText, { color: colors.text }]}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleSaveEdit}
                >
                  <Text
                    style={[
                      styles.modalButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
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
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
  },
  // LinkedIn Import Banner
  linkedinBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#0077B5",
  },
  linkedinBannerContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  linkedinBannerText: {
    marginLeft: 12,
    flex: 1,
  },
  linkedinBannerTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  linkedinBannerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  // Profile Header Styles
  profileHeader: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 8,
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
  infoSection: {
    alignItems: "center",
    width: "100%",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  editIconButton: {
    padding: 4,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
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
  // Section Styles
  section: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  // Professional Information Styles
  professionalGrid: {
    flexDirection: "row",
    marginBottom: 16,
  },
  professionalItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginRight: 16,
  },
  professionalItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  professionalItemLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  professionalItemValue: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  professionalItemSubtext: {
    fontSize: 12,
  },
  // Interests Styles
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
  // Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalOverlayBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modal: {
    margin: 20,
    borderRadius: 12,
    padding: 20,
    minWidth: 300,
    maxWidth: 400,
    maxHeight: "80%",
  },
  largeModal: {
    maxHeight: "90%",
    minWidth: 350,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  modalTextArea: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  photoPreview: {
    alignItems: "center",
    marginBottom: 16,
  },
  previewPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  previewPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  interestsScrollContainer: {
    maxHeight: 400,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  interestButton: {
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
    width: "48%",
    alignItems: "center",
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
  },
  // Input Group Styles
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  inputDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 18,
  },
  characterCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  changePhotoButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 12,
  },
  changePhotoText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
});
