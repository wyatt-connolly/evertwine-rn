import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { OnboardingService } from "../../services/OnboardingService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
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
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to add a profile photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        console.log("✅ Image selected:", result.assets[0].uri);
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("❌ Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleContinue = async () => {
    if (!displayName.trim()) {
      Alert.alert("Required Field", "Please enter your name.");
      displayNameRef.current?.focus();
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
      navigation.navigate("AgeVerification");
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
          {/* Header */}
          <AnimatedCard delay={200} direction="up">
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Text style={[styles.title, { color: colors.text }]}>
                  Set Up Your Profile
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  Tell us a bit about yourself
                </Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Main Content */}
          <View style={styles.mainContent}>
            {/* Profile Image */}
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
                    <Ionicons name="camera" size={32} color={colors.primary} />
                  </View>
                )}
              </TouchableOpacity>
              <Text
                style={[styles.imageLabel, { color: colors.textSecondary }]}
              >
                Add a photo
              </Text>
            </View>

            {/* Form Fields */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  What's your name? *
                </Text>
                <TextInput
                  ref={displayNameRef}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={displayName}
                  onChangeText={setDisplayName}
                  placeholder="Enter your name"
                  placeholderTextColor={colors.textTertiary}
                  returnKeyType="next"
                  onSubmitEditing={() => headlineRef.current?.focus()}
                  autoFocus
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>
                  Add a headline (optional)
                </Text>
                <TextInput
                  ref={headlineRef}
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                      color: colors.text,
                    },
                  ]}
                  value={headline}
                  onChangeText={setHeadline}
                  placeholder="e.g., Software Engineer at Tech Corp"
                  placeholderTextColor={colors.textTertiary}
                  returnKeyType="done"
                  onSubmitEditing={handleContinue}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={loading ? "Setting up..." : "Continue"}
              onPress={handleContinue}
              variant="primary"
              disabled={loading || !displayName.trim()}
              icon="arrow-forward"
              style={[
                styles.continueButton,
                (!displayName.trim() || loading) && styles.disabledButton,
              ]}
            />
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: "center",
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  profileImageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profileImagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 60,
    borderWidth: 2,
    borderStyle: "dashed",
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  formContainer: {
    gap: 24,
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  textInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
