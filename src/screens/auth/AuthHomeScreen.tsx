import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { DataService } from "../../services/DataService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import { Ionicons } from "@expo/vector-icons";

type AuthHomeScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Welcome"
>;

interface Props {
  navigation: AuthHomeScreenNavigationProp;
}

export default function AuthHomeScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);
  const { setUser, setAuthenticated, setOnboardingComplete } = useAuthStore();
  const { colors } = useThemeStore();

  const handleDeveloperLogin = async () => {
    setLoading(true);

    try {
      // Enable developer mode to use mock data
      DataService.setDeveloperMode(true);

      // Create a developer user with complete data
      const developerUser = {
        uid: "developer_demo_user",
        phoneNumber: "+1234567890",
        displayName: "Demo User",
        email: "demo@evertwine.app",
        photoURL:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
        onboardingComplete: true,
        interests: ["Technology", "Business", "Networking", "Coffee"],
        location: { latitude: 37.7749, longitude: -122.4194 },
        bio: "Demo user for showcasing Evertwine features",
        about:
          "This is a demo user account for showcasing all Evertwine features. Perfect for demonstrations, testing, and development.",
      };

      // Set user and authentication state
      setUser(developerUser);
      setAuthenticated(true);
      setOnboardingComplete(true);

      setTimeout(() => {
        setLoading(false);
        // The AppNavigator will handle routing to MainTabs
      }, 1000);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleDeveloperOnboarding = async () => {
    setLoading(true);

    try {
      // Enable developer mode to use mock data
      DataService.setDeveloperMode(true);

      // Create a local user for onboarding testing (no backend)
      const localUser = {
        uid: "local_onboarding_user",
        phoneNumber: "+1234567890",
        displayName: "Local User",
        email: "local@evertwine.app",
        photoURL: null,
        onboardingComplete: false,
        interests: [],
        location: null,
        bio: "",
        about: "",
      };

      // Set local authentication state (no backend connection)
      setUser(localUser);
      setAuthenticated(true);
      setOnboardingComplete(false);

      console.log("🔧 Developer Onboarding:", {
        message: "Starting local onboarding flow (no backend)",
        isAuthenticated: true,
        onboardingComplete: false,
        user: localUser,
      });

      // Navigate to ProfileSetup to start onboarding UI testing
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("ProfileSetup");
      }, 500);
    } catch (error) {
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
                <Ionicons
                  name="people-circle"
                  size={80}
                  color={colors.primary}
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
              title="🔧 Developer Login"
              onPress={handleDeveloperLogin}
              variant="primary"
              disabled={loading}
              style={styles.button}
              icon="home"
            />

            <AnimatedButton
              title="🚀 Developer Onboarding"
              onPress={handleDeveloperOnboarding}
              variant="secondary"
              disabled={loading}
              style={styles.button}
              icon="person-add"
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
  developerButton: {
    opacity: 0.8,
    borderStyle: "dashed",
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
