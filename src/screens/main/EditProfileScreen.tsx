import React, { useState, useEffect } from "react";
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
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { SupabaseStorageService } from "../../services/SupabaseStorageService";
import { DataService } from "../../services/DataService";
import { getMockUserStats, mockUsers } from "../../data/mockData";
import { UserStats, User } from "../../types";
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
  const [isLoading, setIsLoading] = useState(true);

  // Local state for editable profile data
  const [profileData, setProfileData] = useState<User | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [tempData, setTempData] = useState<any>({});
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  // Image upload function
  const uploadProfileImage = async (imageUri: string) => {
    try {
      console.log("📤 Starting image upload:", imageUri);
      setUploadingPhotos(true);

      console.log(
        "📤 Calling SupabaseStorageService.uploadProfilePicture with UID:",
        user?.uid
      );
      // Upload to Supabase Storage
      // Generate a unique index based on timestamp
      const imageIndex = Date.now();
      const uploadedUrl = await SupabaseStorageService.uploadProfilePicture(
        user?.uid || "",
        imageUri,
        imageIndex
      );

      console.log("✅ Image uploaded successfully:", uploadedUrl);
      return uploadedUrl; // Public URL of uploaded image
    } catch (error) {
      console.error("❌ Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
      return null;
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Load profile data using DataService
  useEffect(() => {
    const loadProfileData = async () => {
      console.log("🔄 EditProfileScreen loading data for:", user?.uid);
      try {
        setIsLoading(true);

        if (!user?.uid) {
          console.error("❌ No user UID available");
          return;
        }

        // Load user profile data
        const userResult = await DataService.getUser(user.uid);

        if (userResult.user) {
          setProfileData(userResult.user);
          console.log("✅ Profile data loaded");
        } else {
          // User doesn't exist in Supabase - create them
          console.log("🔄 No user data found, creating user record...");

          const createResult = await DataService.createUser({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || "User",
            age: 25,
            gender: "Prefer not to say",
            pronouns: "they/them",
            bio: "",
            about: "",
            profilePictures: [
              user.photoURL ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            ],
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
            // Reload the user data from Supabase
            const newUserResult = await DataService.getUser(user.uid);
            if (newUserResult.user) {
              setProfileData(newUserResult.user);
              console.log("✅ User record created and loaded");
            }
          } else {
            console.error(
              "❌ Failed to create user record:",
              createResult.error
            );
          }
        }

        // Load user stats (always use mock for now)
        if (DataService.isInDeveloperMode()) {
          setUserStats(getMockUserStats(user.uid));
        }
      } catch (error) {
        console.error("❌ Error loading profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user?.uid]);

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

  const handlePhotoUpload = async (photoIndex?: number) => {
    try {
      // Request permissions
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access camera roll is required!"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false, // Single photo selection
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedPhoto = result.assets[0];
        console.log("📷 Selected photo to upload at index:", photoIndex || "end");
        setUploadingPhotos(true);

        try {
          // Upload the single photo to Supabase
          console.log("📤 Starting upload of photo:", selectedPhoto.uri);
          const uploadedUrl = await uploadProfileImage(selectedPhoto.uri);
          console.log("✅ Photo uploaded:", uploadedUrl);

          if (uploadedUrl) {
            // Create updated photos array
            const currentPhotos = profileData?.profilePictures || [];
            const updatedPhotos = [...currentPhotos];
            
            if (photoIndex !== undefined) {
              // Replace photo at specific index
              updatedPhotos[photoIndex] = uploadedUrl;
              console.log(`📝 Replacing photo at index ${photoIndex}`);
            } else {
              // Add to end (fallback behavior)
              updatedPhotos.push(uploadedUrl);
              console.log("📝 Adding photo to end");
            }

            // Ensure we don't exceed 6 photos
            const finalPhotos = updatedPhotos.slice(0, 6);

            console.log("💾 Saving to Supabase. Updated photos array:", finalPhotos);

            // Update Supabase
            if (profileData?.uid) {
              const updateResult = await SupabaseDataService.updateUser(
                profileData.uid,
                {
                  profilePictures: finalPhotos,
                }
              );

              console.log("💾 Supabase update result:", updateResult);

              // Update local state
              setProfileData((prev) =>
                prev ? { ...prev, profilePictures: finalPhotos } : null
              );

              console.log("✅ Local state updated. New profile data:", {
                ...profileData,
                profilePictures: finalPhotos,
              });

              Alert.alert(
                "Success",
                "Photo uploaded successfully!"
              );
            } else {
              console.error("❌ No profileData.uid available");
            }
          } else {
            console.warn("⚠️ No valid URLs after upload");
          }
        } catch (error) {
          console.error("❌ Error uploading photos:", error);
          Alert.alert(
            "Error",
            "Failed to upload some photos. Please try again."
          );
        } finally {
          setUploadingPhotos(false);
        }
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to upload photos. Please try again.");
      setUploadingPhotos(false);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    if (!profileData) {
      console.error("❌ No profileData available for removing photo");
      return;
    }

    console.log("🗑️ Removing photo at index:", index);

    Alert.alert("Remove Photo", "Are you sure you want to remove this photo?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          const updatedPhotos = profileData.profilePictures.filter(
            (_, i) => i !== index
          );

          console.log("💾 Updating Supabase with photos:", updatedPhotos);

          // Update Supabase
          const updateResult = await SupabaseDataService.updateUser(
            profileData.uid,
            {
              profilePictures: updatedPhotos,
            }
          );

          console.log("💾 Photo removal update result:", updateResult);

          // Update local state
          setProfileData((prev) =>
            prev ? { ...prev, profilePictures: updatedPhotos } : null
          );

          console.log("✅ Photo removed successfully");
        },
      },
    ]);
  };

  const handleSetStandoutPhoto = async (index: number) => {
    if (!profileData) {
      console.error("❌ No profileData available for setting standout photo");
      return;
    }

    const newStandoutIndex =
      profileData.standoutPhotoIndex === index ? 0 : index;

    console.log("⭐ Setting standout photo to index:", newStandoutIndex);

    // Update Supabase
    const updateResult = await SupabaseDataService.updateUser(profileData.uid, {
      standoutPhotoIndex: newStandoutIndex,
    });

    console.log("💾 Standout photo update result:", updateResult);

    // Update local state
    setProfileData((prev) =>
      prev ? { ...prev, standoutPhotoIndex: newStandoutIndex } : null
    );

    console.log("✅ Standout photo updated successfully");
  };

  const handleSaveEdit = async () => {
    if (!editingSection || !user?.uid) return;

    setLoading(true);
    try {
      let updates: Partial<User> = {};

      switch (editingSection) {
        case "Photo":
          if (tempData.profileImage) {
            const uploadedUrl = await uploadProfileImage(tempData.profileImage);
            if (uploadedUrl) {
              updates = {
                profilePictures: [
                  uploadedUrl,
                  ...(profileData?.profilePictures?.slice(1) || []),
                ],
              };

              // Update auth store
              updateUserProfile({ photoURL: uploadedUrl });
            }
          }
          break;
        case "Basic Info":
          updates = {
            displayName: tempData.displayName,
            bio: tempData.bio,
            locationName: tempData.locationName,
          };
          break;
        case "Professional Info":
          updates = {
            school: tempData.school,
            jobTitle: tempData.jobTitle,
            jobCompany: tempData.jobCompany,
          };
          break;
        case "Interests":
          updates = {
            hobbies: tempData.hobbies,
          };
          break;
      }

      // Save to Supabase (or local storage in dev mode)
      if (!DataService.isInDeveloperMode()) {
        const result = await SupabaseDataService.updateUser(user.uid, updates);
        if (result.error) {
          throw new Error(result.error);
        }
      }

      // Update local state
      setProfileData((prev) => (prev ? { ...prev, ...updates } : null));

      // Update auth store if name changed
      if (updates.displayName) {
        updateUserProfile({ displayName: updates.displayName });
      }

      setEditingSection(null);
      setTempData({});
      Alert.alert("Success", "Profile updated successfully");
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Error", "Failed to save changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingSection(null);
    setTempData({});
  };

  // Show loading state - removed loading text for better UX
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          {/* Loading text removed for smoother UX */}
        </View>
      </View>
    );
  }

  // Show empty state if no profile data
  if (!profileData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Profile not found
          </Text>
        </View>
      </View>
    );
  }

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
        {/* Profile Header - How it looks to others */}
        <View
          style={[styles.profileHeader, { backgroundColor: colors.surface }]}
        >
          {/* Photo Gallery Section */}
          <View style={styles.photoSection}>
            <View style={styles.photoGalleryHeader}>
              <Text style={[styles.photoGalleryTitle, { color: colors.text }]}>
                Profile Photos
              </Text>
              <Text
                style={[
                  styles.photoGallerySubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                {profileData.profilePictures?.length || 0}/6 photos
              </Text>
            </View>

            <View style={styles.photoGrid}>
              {/* Render existing photos */}
              {Array.from({ length: 6 }).map((_, index) => {
                const photo = profileData.profilePictures?.[index];
                const isEmpty = !photo;

                return (
                  <View key={index} style={styles.photoGridItem}>
                    {isEmpty ? (
                      <TouchableOpacity
                        style={[
                          styles.photoPlaceholder,
                          {
                            backgroundColor: colors.surfaceVariant,
                            borderColor: colors.border,
                          },
                        ]}
                        onPress={() => handlePhotoUpload(index)}
                        disabled={uploadingPhotos}
                      >
                        <Ionicons
                          name="add"
                          size={24}
                          color={colors.textSecondary}
                        />
                      </TouchableOpacity>
                    ) : (
                      <View style={styles.photoItemContainer}>
                        <Image
                          source={{ uri: photo }}
                          style={styles.gridPhoto}
                        />
                        {/* Remove button */}
                        <TouchableOpacity
                          style={[
                            styles.removePhotoButton,
                            { backgroundColor: colors.error },
                          ]}
                          onPress={() => handleRemovePhoto(index)}
                        >
                          <Ionicons
                            name="close"
                            size={14}
                            color={colors.error}
                          />
                        </TouchableOpacity>
                        {/* Standout photo indicator */}
                        {profileData.standoutPhotoIndex === index && (
                          <View
                            style={[
                              styles.standoutBadge,
                              { backgroundColor: colors.primary },
                            ]}
                          >
                            <Ionicons
                              name="star"
                              size={12}
                              color={colors.onPrimary}
                            />
                          </View>
                        )}

                        {/* Standout photo toggle button */}
                        <TouchableOpacity
                          style={[
                            styles.standoutButton,
                            {
                              backgroundColor:
                                profileData.standoutPhotoIndex === index
                                  ? colors.primary
                                  : colors.surface + "80",
                            },
                          ]}
                          onPress={() => handleSetStandoutPhoto(index)}
                        >
                          <Ionicons
                            name="star"
                            size={12}
                            color={
                              profileData.standoutPhotoIndex === index
                                ? colors.onPrimary
                                : colors.textSecondary
                            }
                          />
                        </TouchableOpacity>

                        {/* Replace photo button */}
                        <TouchableOpacity
                          style={[
                            styles.replacePhotoButton,
                            { backgroundColor: colors.primary },
                          ]}
                          onPress={() => handlePhotoUpload(index)}
                          disabled={uploadingPhotos}
                        >
                          <Ionicons
                            name="camera"
                            size={12}
                            color={colors.onPrimary}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Upload button */}
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={handlePhotoUpload}
              disabled={uploadingPhotos}
            >
              <Ionicons
                name={uploadingPhotos ? "hourglass" : "cloud-upload"}
                size={20}
                color={colors.onPrimary}
              />
              <Text
                style={[styles.uploadButtonText, { color: colors.onPrimary }]}
              >
                {uploadingPhotos ? "Uploading..." : "Add Photos"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Basic Information Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
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

          <View style={styles.basicInfoGrid}>
            <View style={styles.basicInfoItem}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.basicInfoItemContent}>
                <Text
                  style={[
                    styles.basicInfoItemLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Display Name
                </Text>
                <Text
                  style={[styles.basicInfoItemValue, { color: colors.text }]}
                >
                  {profileData.displayName}
                </Text>
              </View>
            </View>

            <View style={styles.basicInfoItem}>
              <Ionicons
                name="chatbubble-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.basicInfoItemContent}>
                <Text
                  style={[
                    styles.basicInfoItemLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Bio
                </Text>
                {profileData.bio ? (
                  <Text
                    style={[styles.basicInfoItemValue, { color: colors.text }]}
                  >
                    {profileData.bio}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.basicInfoItemValue,
                      styles.emptyFieldText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Tap to add a bio and tell others about yourself
                  </Text>
                )}
              </View>
            </View>

            <View style={styles.basicInfoItem}>
              <Ionicons
                name="location-outline"
                size={20}
                color={colors.primary}
              />
              <View style={styles.basicInfoItemContent}>
                <Text
                  style={[
                    styles.basicInfoItemLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Location
                </Text>
                {profileData.locationName ? (
                  <Text
                    style={[styles.basicInfoItemValue, { color: colors.text }]}
                  >
                    {profileData.locationName}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.basicInfoItemValue,
                      styles.emptyFieldText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Add your current location
                  </Text>
                )}
              </View>
            </View>

            {userStats && (
              <View style={styles.basicInfoItem}>
                <Ionicons
                  name="trophy-outline"
                  size={20}
                  color={colors.primary}
                />
                <View style={styles.basicInfoItemContent}>
                  <Text
                    style={[
                      styles.basicInfoItemLabel,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Level & Stats
                  </Text>
                  <Text
                    style={[styles.basicInfoItemValue, { color: colors.text }]}
                  >
                    {userStats
                      ? `Level ${
                          userStats.level
                        } • ${userStats.points.toLocaleString()} XP • ${
                          userStats.streak
                        } day streak`
                      : "Stats loading..."}
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
                {profileData.school ? (
                  <Text
                    style={[
                      styles.professionalItemValue,
                      { color: colors.text },
                    ]}
                  >
                    {profileData.school}
                  </Text>
                ) : (
                  <Text
                    style={[
                      styles.professionalItemValue,
                      styles.emptyFieldText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Add your school or university
                  </Text>
                )}
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
                {profileData.jobTitle ? (
                  <>
                    <Text
                      style={[
                        styles.professionalItemValue,
                        { color: colors.text },
                      ]}
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
                  </>
                ) : (
                  <Text
                    style={[
                      styles.professionalItemValue,
                      styles.emptyFieldText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Add your job title and company
                  </Text>
                )}
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
            {profileData.hobbies && profileData.hobbies.length > 0 ? (
              profileData.hobbies.slice(0, 6).map((hobby, index) => (
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
              ))
            ) : (
              <Text
                style={[
                  styles.emptyFieldText,
                  {
                    color: colors.textTertiary,
                    textAlign: "center",
                    marginTop: 8,
                  },
                ]}
              >
                Tap to add your interests and hobbies
              </Text>
            )}
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
                <View style={styles.bioHeader}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    About You
                  </Text>
                  <Text
                    style={[
                      styles.characterCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {tempData.bio?.length || 0}/150
                  </Text>
                </View>
                <Text
                  style={[
                    styles.inputDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  Share what makes you unique and what you're passionate about
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.background,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.bioTextInput, { color: colors.text }]}
                    value={tempData.bio}
                    onChangeText={(text) =>
                      setTempData((prev: any) => ({ ...prev, bio: text }))
                    }
                    placeholder="I'm passionate about..."
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={4}
                    maxLength={150}
                    textAlignVertical="top"
                  />
                </View>
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  // Profile Header Styles
  profileHeader: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoGalleryHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  photoGalleryTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  photoGallerySubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  photoGridItem: {
    width: "30%",
    aspectRatio: 1,
    marginBottom: 12,
  },
  photoPlaceholder: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  photoItemContainer: {
    position: "relative",
    width: "100%",
    height: "100%",
  },
  gridPhoto: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removePhotoButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  replacePhotoButton: {
    position: "absolute",
    bottom: -6,
    right: -6,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  standoutBadge: {
    position: "absolute",
    top: -6,
    left: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  standoutButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  photoContainer: {
    position: "relative",
    marginBottom: 8,
    alignItems: "center",
  },
  profilePhotosScroll: {
    maxWidth: 320, // Allow for 3 photos side by side
  },
  profilePhotosContainer: {
    paddingHorizontal: 10,
    gap: 12,
  },
  profilePhotoItem: {
    position: "relative",
  },
  singlePhotoContainer: {
    position: "relative",
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
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  editIconButton: {
    padding: 8,
    borderRadius: 8,
  },
  basicInfoGrid: {
    gap: 16,
    alignItems: "flex-start",
  },
  basicInfoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  basicInfoItemContent: {
    flex: 1,
    marginLeft: 8,
  },
  basicInfoItemLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  basicInfoItemValue: {
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bioTextInput: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 80,
    textAlignVertical: "top",
  },
  // Section Styles
  section: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Professional Information Styles
  professionalGrid: {
    flexDirection: "column",
    marginBottom: 16,
    gap: 20,
  },
  professionalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 4,
  },
  professionalItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  professionalItemLabel: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    opacity: 0.8,
  },
  professionalItemValue: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    lineHeight: 22,
  },
  professionalItemSubtext: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  // Interests Styles
  interestsList: {
    flexDirection: "row",
    flexWrap: "wrap",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
  },
  emptyFieldText: {
    fontStyle: "italic",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyFieldPrompt: {
    fontStyle: "italic",
    fontSize: 13,
    opacity: 0.6,
  },
});
