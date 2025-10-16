import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { OnboardingService } from "../../services/OnboardingService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const imageAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const startAnimations = () => {
      // Fade in the entire screen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Stagger the animations
      setTimeout(() => {
        Animated.timing(titleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 200);

      setTimeout(() => {
        Animated.timing(subtitleAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 400);

      setTimeout(() => {
        Animated.timing(imageAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 600);

      setTimeout(() => {
        Animated.timing(formAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 800);

      setTimeout(() => {
        Animated.timing(buttonAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 1000);
    };

    startAnimations();
  }, []);

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
    <GradientBackground variant="dark">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.keyboardAvoidingView}
          >
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>

              <View style={styles.headerContent}>
                <Animated.Text
                  style={[
                    styles.title,
                    {
                      opacity: titleAnim,
                      color: colors.text,
                      transform: [
                        {
                          translateY: titleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [30, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  Set Up Your Profile
                </Animated.Text>
                <Animated.Text
                  style={[
                    styles.subtitle,
                    {
                      opacity: subtitleAnim,
                      color: colors.textSecondary,
                      transform: [
                        {
                          translateY: subtitleAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  Tell us a bit about yourself
                </Animated.Text>
              </View>
            </View>

            {/* Main Content */}
            <View style={styles.mainContent}>
              {/* Profile Image */}
              <Animated.View
                style={[
                  styles.profileImageContainer,
                  {
                    opacity: imageAnim,
                    transform: [
                      {
                        translateY: imageAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
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
                      <Ionicons
                        name="camera"
                        size={32}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <Text
                  style={[styles.imageLabel, { color: colors.textSecondary }]}
                >
                  Add a photo
                </Text>
              </Animated.View>

              {/* Form Fields */}
              <Animated.View
                style={[
                  styles.formContainer,
                  {
                    opacity: formAnim,
                    transform: [
                      {
                        translateY: formAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
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
              </Animated.View>
            </View>

            {/* Continue Button */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonAnim,
                  transform: [
                    {
                      translateY: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <OnboardingButton
                title={loading ? "Setting up..." : "Continue"}
                onPress={handleContinue}
                variant="primary"
                disabled={loading || !displayName.trim()}
              />
            </Animated.View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
});
