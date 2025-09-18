import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { FirestoreService } from "../../services/firebase";
import { OnboardingService } from "../../services/OnboardingService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import * as ImagePicker from "expo-image-picker";

type ProfileSetupScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "ProfileSetup"
>;

interface Props {
  navigation: ProfileSetupScreenNavigationProp;
}

export default function ProfileSetupScreen({ navigation }: Props) {
  const [displayName, setDisplayName] = useState("");
  const [headline, setHeadline] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();

  // Refs for input fields
  const displayNameRef = useRef<TextInput>(null);
  const headlineRef = useRef<TextInput>(null);

  const pickImage = async () => {
    try {
      console.log("📸 Starting image picker...");

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log("📸 Permission status:", status);

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload a photo."
        );
        return;
      }

      console.log("📸 Launching image library...");
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      console.log("📸 Image picker result:", result);

      if (!result.canceled && result.assets && result.assets[0]) {
        console.log("📸 Image selected:", result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
        Alert.alert("Success", "Photo selected successfully!");
      } else {
        console.log("📸 Image picker canceled or no assets");
      }
    } catch (error) {
      console.error("📸 Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleContinue = async () => {
    if (!displayName.trim()) {
      Alert.alert("Required Field", "Please enter your display name");
      return;
    }

    setLoading(true);

    try {
      // Update local user profile
      updateUserProfile({
        displayName: displayName.trim(),
        ...(profileImage && { photoURL: profileImage }),
        ...(headline.trim() && { bio: headline.trim() }),
      });

      // Use OnboardingService to complete profile setup
      const result = await OnboardingService.completeProfileSetup(
        user?.uid || "",
        {
          displayName: displayName.trim(),
          bio: headline.trim() || `Hi! I'm ${displayName.trim()}`,
          about: `I'm ${displayName.trim()} and I'm excited to meet new people through Evertwine!`,
          interests: ["Networking", "Social", "Technology"], // Default interests
          location: { latitude: 37.7749, longitude: -122.4194 }, // Default to SF
          photoURL: profileImage || undefined,
        }
      );

      if (result.error) {
        Alert.alert("Error", "Failed to save profile. Please try again.");
        console.error("Profile setup error:", result.error);
        return;
      }

      console.log("✅ Profile setup completed successfully");
      navigation.navigate("InterestSelection");
    } catch (error) {
      Alert.alert("Error", "Failed to save profile. Please try again.");
      console.error("Profile setup error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <AnimatedCard delay={200} direction="up">
              <View style={styles.header}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Set Up Your Profile
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  Tell us a bit about yourself
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard delay={400} direction="up">
              <View style={styles.profileImageContainer}>
                <TouchableOpacity
                  style={styles.profileImageButton}
                  onPress={pickImage}
                >
                  {profileImage ? (
                    <Image
                      source={{ uri: profileImage }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View
                      style={[
                        styles.profileImagePlaceholder,
                        { backgroundColor: colors.surfaceVariant },
                      ]}
                    >
                      <Text
                        style={[
                          styles.profileImageText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        +
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
                <Text
                  style={[
                    styles.profileImageLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Add Photo
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard delay={600} direction="up">
              <View style={styles.form}>
                <TouchableOpacity
                  style={styles.inputGroup}
                  onPress={() => displayNameRef.current?.focus()}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.label, { color: colors.text }]}>
                    Display Name *
                  </Text>
                  <TextInput
                    ref={displayNameRef}
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
                    returnKeyType="next"
                    onSubmitEditing={() => headlineRef.current?.focus()}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.inputGroup}
                  onPress={() => headlineRef.current?.focus()}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.label, { color: colors.text }]}>
                    Professional Headline (Optional)
                  </Text>
                  <TextInput
                    ref={headlineRef}
                    style={[
                      styles.input,
                      styles.bioInput,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                        fontSize: 16,
                      },
                    ]}
                    value={headline}
                    onChangeText={setHeadline}
                    placeholder="e.g. Software Engineer at Tech Company"
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={2}
                    maxLength={100}
                    textAlignVertical="top"
                    selectionColor={colors.primary}
                    returnKeyType="done"
                    onSubmitEditing={() => headlineRef.current?.blur()}
                  />
                  <Text
                    style={[
                      styles.characterCount,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {headline.length}/100
                  </Text>
                </TouchableOpacity>
              </View>
            </AnimatedCard>

            <AnimatedButton
              title={loading ? "Saving..." : "Continue"}
              onPress={handleContinue}
              variant="primary"
              disabled={loading}
              loading={loading}
              style={styles.button}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 100, // Extra padding for keyboard
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImageButton: {
    marginBottom: 12,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderStyle: "dashed",
  },
  profileImageText: {
    fontSize: 32,
    fontWeight: "300",
  },
  profileImageLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  form: {
    marginBottom: 20,
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
    height: 60,
    textAlignVertical: "top",
  },
  characterCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  button: {
    marginTop: 20,
  },
});
