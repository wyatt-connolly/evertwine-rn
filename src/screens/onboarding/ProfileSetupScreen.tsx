import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { FirestoreService } from "../../services/firebase";
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
  const [bio, setBio] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();

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
      updateUserProfile({
        displayName: displayName.trim(),
        ...(profileImage && { photoURL: profileImage }),
      });

      const userData = {
        displayName: displayName.trim(),
        phoneNumber: user?.phoneNumber,
        ...(bio.trim() && { bio: bio.trim() }),
        ...(profileImage && { photoURL: profileImage }),
      };

      const result = await FirestoreService.createUser(userData);

      if (result.error) {
        Alert.alert("Error", "Failed to save profile. Please try again.");
        console.error("Firestore error:", result.error);
        return;
      }

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
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <AnimatedCard delay={200} direction="up">
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Set Up Your Profile
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
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
                <Text style={[styles.label, { color: colors.text }]}>
                  Bio (Optional)
                </Text>
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
                  style={[
                    styles.characterCount,
                    { color: colors.textSecondary },
                  ]}
                >
                  {bio.length}/200
                </Text>
              </View>
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
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
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
    height: 100,
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
