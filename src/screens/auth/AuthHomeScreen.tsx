import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { AuthService } from "../../services/firebase";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import AnimatedLogo from "../../components/AnimatedLogo";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";

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
          <AnimatedCard delay={200} direction="up">
            <View style={styles.logoContainer}>
              <AnimatedLogo size={80} />
              <Text style={[styles.title, { color: colors.text }]}>
                Welcome to Evertwine
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Connect with people who share your interests
              </Text>
            </View>
          </AnimatedCard>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title="Continue with Phone"
              onPress={handlePhoneSignIn}
              variant="primary"
              disabled={loading}
              style={styles.button}
            />

            <AnimatedButton
              title="Continue with Apple"
              onPress={handleAppleSignIn}
              variant="secondary"
              disabled={loading}
              style={styles.button}
            />

            <AnimatedButton
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              variant="secondary"
              disabled={loading}
              style={styles.button}
            />
          </View>

          <AnimatedCard delay={800} direction="up">
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: colors.textTertiary }]}>
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </Text>
            </View>
          </AnimatedCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  logoContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 24,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    paddingBottom: 40,
  },
  button: {
    marginBottom: 16,
  },
  footer: {
    paddingBottom: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
