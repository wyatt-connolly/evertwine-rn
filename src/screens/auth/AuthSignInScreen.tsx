import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Animated,
  Alert,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuthStore } from "../../hooks/useAuthStore";
import GradientBackground from "../../components/GradientBackground";
import OAuthButton from "../../components/OAuthButton";
import { SupabaseAuthService } from "../../services/supabase";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";

type Props = {
  navigation: StackNavigationProp<OnboardingStackParamList, "AuthSignIn">;
};

export default function AuthSignInScreen({ navigation }: Props) {
  const { isAuthenticated, user, setOnboardingStep } = useAuthStore();
  const [loading, setLoading] = useState<"google" | "apple" | null>(null);
  const [isOAuthInProgress, setIsOAuthInProgress] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Watch for authentication changes and navigate to next onboarding step
  useEffect(() => {
    if (
      isAuthenticated &&
      user &&
      !user.onboardingComplete &&
      !isOAuthInProgress
    ) {
      console.log("✅ User authenticated, navigating to NameInput");
      console.log("👤 User data:", {
        uid: user.uid,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
      });
      // Small delay to ensure the auth state is fully processed
      setTimeout(() => {
        setOnboardingStep("NameInput");
        navigation.navigate("NameInput");
      }, 500);
    }
  }, [isAuthenticated, user, navigation, isOAuthInProgress]);

  const handleOAuthSignIn = async (provider: "google" | "apple") => {
    try {
      console.log(`🔵 Starting ${provider} OAuth...`);
      setLoading(provider);
      setIsOAuthInProgress(true);

      let authData;
      if (provider === "google") {
        console.log("🔵 Calling signInWithGoogle...");
        authData = await SupabaseAuthService.signInWithGoogle();
      } else {
        console.log("🔵 Calling signInWithApple...");
        authData = await SupabaseAuthService.signInWithApple();
      }

      console.log(`✅ ${provider} OAuth completed:`, authData);

      // Check if the OAuth was successful
      if (authData?.type === "success") {
        console.log(
          "🎉 OAuth successful, auth state change will handle navigation"
        );
        // The auth state change listener in AppNavigator will handle navigation
        // based on onboardingComplete status - no manual navigation needed
      } else if (authData?.type === "cancel") {
        console.log(`ℹ️ User cancelled ${provider} OAuth`);
        return;
      } else {
        console.log(`⚠️ OAuth completed with unexpected result:`, authData);
      }
    } catch (error: any) {
      console.error(`❌ ${provider} sign-in error:`, error);

      // Handle specific error cases
      if (
        error.message?.includes("cancelled") ||
        error.message?.includes("canceled")
      ) {
        console.log(`ℹ️ User cancelled ${provider} OAuth`);
        return;
      }

      Alert.alert(
        "Sign In Failed",
        `Unable to sign in with ${provider}. Please try again.\n\nError: ${error.message}`,
        [{ text: "OK" }]
      );
    } finally {
      setLoading(null);
      setIsOAuthInProgress(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <GradientBackground variant="dark">
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: "#FFFFFF" }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: "#E5E5EA" }]}>
              Choose your sign-in method
            </Text>
          </View>

          {/* OAuth Buttons */}
          <View style={styles.buttonContainer}>
            <OAuthButton
              provider="google"
              onPress={() => handleOAuthSignIn("google")}
              loading={loading === "google"}
              disabled={loading !== null}
            />

            <View style={styles.buttonSpacing} />

            <OAuthButton
              provider="apple"
              onPress={() => handleOAuthSignIn("apple")}
              loading={loading === "apple"}
              disabled={loading !== null}
            />
          </View>

          {/* Back Button */}
          <View style={styles.footer}>
            <Text
              style={[styles.backText, { color: "#E5E5EA" }]}
              onPress={handleBack}
            >
              ← Back
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  buttonSpacing: {
    height: 16,
  },
  footer: {
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
