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
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.photoURL || null
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    user?.interests || []
  );
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const pickImage = async () => {
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
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image. Please try again.");
      console.error("Image picker error:", error);
    }
  };

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Required Field", "Please enter your display name");
      return;
    }

    if (selectedInterests.length < 3) {
      Alert.alert(
        "Select More Interests",
        "Please select at least 3 interests to help us find better meetups for you."
      );
      return;
    }

    setLoading(true);

    try {
      // Update local state
      updateUserProfile({
        displayName: displayName.trim(),
        bio: bio.trim() || undefined,
        photoURL: profileImage || undefined,
        interests: selectedInterests,
      });

      // Update in Firestore
      if (user?.uid) {
        const userData = {
          displayName: displayName.trim(),
          ...(bio.trim() && { bio: bio.trim() }),
          ...(profileImage && { photoURL: profileImage }),
          interests: selectedInterests,
        };

        const result = await FirestoreService.updateUser(user.uid, userData);

        if (result.error) {
          Alert.alert("Error", "Failed to save profile. Please try again.");
          console.error("Firestore error:", result.error);
          return;
        }
      }

      Alert.alert("Success", "Profile updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
      console.error("Profile update error:", error);
    } finally {
      setLoading(false);
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
        <Text style={[styles.title, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity
          onPress={handleSave}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
          disabled={loading}
        >
          <Text style={[styles.saveButtonText, { color: colors.onPrimary }]}>
            {loading ? "Saving..." : "Save"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <TouchableOpacity onPress={pickImage} style={styles.photoContainer}>
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
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
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="camera" size={16} color={colors.onPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={[styles.photoLabel, { color: colors.textSecondary }]}>
            Tap to change photo
          </Text>
        </View>

        {/* Form Fields */}
        <View style={[styles.form, { backgroundColor: colors.surface }]}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Display Name *
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Enter your display name"
              placeholderTextColor={colors.textTertiary}
              maxLength={50}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>Bio</Text>
            <TextInput
              style={[
                styles.input,
                styles.bioInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              maxLength={200}
            />
            <Text
              style={[styles.characterCount, { color: colors.textSecondary }]}
            >
              {bio.length}/200
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.text }]}>
              Interests *
            </Text>
            <Text
              style={[styles.interestSubtext, { color: colors.textSecondary }]}
            >
              Select at least 3 interests ({selectedInterests.length} selected)
            </Text>
            <View style={styles.interestsGrid}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    selectedInterests.includes(interest) && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: colors.text },
                      selectedInterests.includes(interest) && {
                        color: colors.onPrimary,
                      },
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
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
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  photoSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 12,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  photoEditBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  photoLabel: {
    fontSize: 14,
  },
  form: {
    borderRadius: 12,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
  },
  bioInput: {
    height: 100,
    textAlignVertical: "top",
  },
  disabledInput: {
    // backgroundColor and color will be set dynamically
  },
  characterCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  interestSubtext: {
    fontSize: 14,
    marginBottom: 12,
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  interestButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    width: "48%",
    alignItems: "center",
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
