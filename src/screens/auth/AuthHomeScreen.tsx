import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  Dimensions,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { AuthService } from "../../services/firebase";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import { Ionicons } from "@expo/vector-icons";

type AuthHomeScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "AuthHome"
>;

interface Props {
  navigation: AuthHomeScreenNavigationProp;
}

export default function AuthHomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const { setUser, setAuthenticated, setOnboardingComplete } = useAuthStore();
  const { colors } = useThemeStore();

  const handlePhoneSignIn = () => {
    navigation.navigate("PhoneVerification");
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const result = await AuthService.signInWithApple();

      if (result.error) {
        Alert.alert("Apple Sign-In Error", result.error);
        return;
      }

      const user = {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber || undefined,
        displayName: result.user.displayName || undefined,
        email: result.user.email || undefined,
        photoURL: result.user.photoURL || undefined,
        onboardingComplete: result.user.onboardingComplete || false,
        interests: result.user.interests || undefined,
        location: result.user.location || undefined,
        bio: result.user.bio || undefined,
      };

      setUser(user);
      setAuthenticated(true);

      // Also update the onboarding status in the store to ensure consistency
      if (user.onboardingComplete) {
        setOnboardingComplete(true);
        console.log(
          "✅ User has completed onboarding, updating store and navigating to main app"
        );
        // The AppNavigator will handle routing to MainTabs
      } else {
        setOnboardingComplete(false);
        console.log(
          "📝 User needs to complete onboarding, navigating to ProfileSetup"
        );
        navigation.navigate("ProfileSetup");
      }
    } catch (error) {
      Alert.alert("Error", "Apple Sign-In failed. Please try again.");
      console.error("Apple Sign-In error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await AuthService.signInWithGoogle();

      if (result.error) {
        Alert.alert("Google Sign-In Error", result.error);
        return;
      }

      const user = {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber || undefined,
        displayName: result.user.displayName || undefined,
        email: result.user.email || undefined,
        photoURL: result.user.photoURL || undefined,
        onboardingComplete: result.user.onboardingComplete || false,
        interests: result.user.interests || undefined,
        location: result.user.location || undefined,
        bio: result.user.bio || undefined,
      };

      setUser(user);
      setAuthenticated(true);

      // Also update the onboarding status in the store to ensure consistency
      if (user.onboardingComplete) {
        setOnboardingComplete(true);
        console.log(
          "✅ User has completed onboarding, updating store and navigating to main app"
        );
        // The AppNavigator will handle routing to MainTabs
      } else {
        setOnboardingComplete(false);
        console.log(
          "📝 User needs to complete onboarding, navigating to ProfileSetup"
        );
        navigation.navigate("ProfileSetup");
      }
    } catch (error) {
      Alert.alert("Error", "Google Sign-In failed. Please try again.");
      console.error("Google Sign-In error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          {/* Header Section */}
          <AnimatedCard delay={200} direction="up">
            <View style={styles.logoContainer}>
                <View
                  style={[
                    styles.logoWrapper,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Image
                    source={require("../../assets/app_launcher_icon.png")}
                    style={styles.logoImage}
                    resizeMode="contain"
                  />
                </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome to Evertwine
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Connect with people who share your interests through amazing
                meetups
              </Text>
            </View>
          </AnimatedCard>

          {/* Features Section */}
          <AnimatedCard delay={400} direction="up">
            <View style={styles.featuresContainer}>
              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons name="people" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Meet New People
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons name="location" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Local Events
                </Text>
              </View>

              <View style={styles.featureItem}>
                <View
                  style={[
                    styles.featureIcon,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons name="heart" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Shared Interests
                </Text>
              </View>
            </View>
          </AnimatedCard>

          {/* Sign In Buttons */}
          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Continue with Phone"
              onPress={handlePhoneSignIn}
              variant="primary"
              disabled={loading}
              style={styles.button}
              icon="call"
            />

            <AnimatedButton
              title="Continue with Apple"
              onPress={handleAppleSignIn}
              variant="secondary"
              disabled={loading}
              style={styles.button}
              icon="logo-apple"
            />

            <AnimatedButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="secondary"
              disabled={loading}
              style={styles.button}
              icon="logo-google"
            />
          </View>

          {/* Footer */}
          <AnimatedCard delay={800} direction="up">
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                By continuing, you agree to our{" "}
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text style={[styles.linkText, { color: colors.primary }]}>
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
    paddingTop: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 10,
  },
  logoWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    marginBottom: 12,
  },
  featureItem: {
    alignItems: "center",
    flex: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  buttonContainer: {
    gap: 12,
    paddingBottom: 10,
  },
  button: {
    marginBottom: 0,
  },
  footer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  linkText: {
    fontWeight: "500",
  },
});
