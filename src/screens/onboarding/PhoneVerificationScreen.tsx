import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
// import { AuthService } from "../../services/firebase"; // Removed Firebase
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import { Ionicons } from "@expo/vector-icons";

type PhoneVerificationScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "PhoneVerification"
>;

interface Props {
  navigation: PhoneVerificationScreenNavigationProp;
}

export default function PhoneVerificationScreen({ navigation }: Props) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const { setUser, setAuthenticated, setOnboardingComplete } = useAuthStore();
  const { colors } = useThemeStore();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, "");

    // Limit to 10 digits
    const limited = cleaned.slice(0, 10);

    // Format as (XXX) XXX-XXXX
    if (limited.length === 0) return "";
    if (limited.length <= 3) return `(${limited}`;
    if (limited.length <= 6)
      return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(
      6
    )}`;
  };

  const sendVerificationCode = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      Alert.alert(
        "Invalid Phone Number",
        "Please enter a valid 10-digit phone number"
      );
      return;
    }

    setLoading(true);
    try {
      const fullPhoneNumber = `+1${cleanPhone}`;

      const result = await AuthService.signInWithPhone(fullPhoneNumber);

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      setVerificationId(result.confirmationResult);
      setIsCodeSent(true);
      setCountdown(60);
      Alert.alert(
        "Code Sent",
        `Verification code sent to ${phoneNumber}\n\nFor development testing, use any 6-digit code (e.g., 123456)`
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Failed to send verification code. Please try again."
      );
      console.error("Phone verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit verification code");
      return;
    }

    console.log("🔄 Starting phone verification process...");
    setLoading(true);
    try {
      // Ensure we're in production mode for phone authentication
      console.log(
        "🔧 Setting developer mode to false for phone authentication"
      );
      const { DataService } = await import("../../services/DataService");
      DataService.setDeveloperMode(false);
      console.log(
        "📊 DataService developer mode:",
        DataService.isInDeveloperMode()
      );

      console.log("📞 Verifying phone code with Firebase Auth...");
      const result = await AuthService.verifyPhoneCode(
        verificationId,
        verificationCode
      );

      console.log("📞 Firebase Auth verification result:", {
        success: !result.error,
        error: result.error,
        userExists: !!result.user,
        userUid: result.user?.uid,
        timestamp: new Date().toISOString(),
      });

      if (result.error) {
        console.error("❌ Phone verification failed:", result.error);
        Alert.alert("Error", result.error);
        return;
      }

      console.log("✅ Phone verification successful, loading user profile...");

      // Try to load user profile from Firebase
      let userProfile = null;
      try {
        console.log("📖 Loading user profile data for:", result.user.uid);
        const profileResult = await DataService.getUser(result.user.uid);

        console.log("📖 Profile loading result:", {
          success: !!profileResult.user,
          error: profileResult.error,
          hasProfile: !!profileResult.user,
          timestamp: new Date().toISOString(),
        });

        if (profileResult.user) {
          userProfile = profileResult.user;
          console.log("✅ User profile found:", {
            displayName: userProfile.displayName,
            onboardingComplete: userProfile.onboardingComplete,
            email: userProfile.email,
            rawOnboardingComplete: userProfile.onboardingComplete,
            typeOfOnboardingComplete: typeof userProfile.onboardingComplete,
            timestamp: new Date().toISOString(),
          });
        } else {
          console.log("❌ No profile data found for user:", result.user.uid);
        }
      } catch (profileError) {
        console.error("❌ Error loading user profile:", profileError);
      }

      // Create user object with available data
      const user = {
        uid: result.user.uid,
        phoneNumber: result.user.phoneNumber || phoneNumber.replace(/\D/g, ""),
        displayName:
          userProfile?.displayName || result.user.displayName || "New User",
        // Only set email if it's not a generated email for phone users
        email:
          (userProfile?.email &&
            !userProfile.email.includes("@evertwine.app")) ||
          (result.user.email && !result.user.email.includes("@evertwine.app"))
            ? userProfile?.email || result.user.email
            : undefined,
        photoURL: userProfile?.photoURL || result.user.photoURL || undefined,
        onboardingComplete: userProfile?.onboardingComplete || false,
        interests: userProfile?.interests || undefined,
        location: userProfile?.location || undefined,
        bio: userProfile?.bio || undefined,
      };

      console.log("👤 Setting user in PhoneVerificationScreen:", {
        uid: user.uid,
        phoneNumber: user.phoneNumber,
        displayName: user.displayName,
        onboardingComplete: user.onboardingComplete,
        hasProfile: !!userProfile,
        userProfileOnboardingComplete: userProfile?.onboardingComplete,
        finalOnboardingComplete: user.onboardingComplete,
        timestamp: new Date().toISOString(),
      });

      // Set user and authentication state
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
        console.log("🧭 Navigation state:", {
          canGoBack: navigation.canGoBack(),
          currentRoute: "PhoneVerification",
          targetRoute: "ProfileSetup",
          timestamp: new Date().toISOString(),
        });

        try {
          navigation.navigate("ProfileSetup");
          console.log("✅ Navigation to ProfileSetup successful");
        } catch (navError) {
          console.error("❌ Navigation error:", navError);
          Alert.alert(
            "Navigation Error",
            "Unable to navigate to profile setup. Please try again."
          );
        }
      }
    } catch (error) {
      console.error("❌ Phone verification error:", error);
      Alert.alert("Error", "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
      console.log("🔄 Phone verification process complete");
    }
  };

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.content}>
            <AnimatedCard delay={200} direction="up">
              <View style={styles.header}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Ionicons
                    name={isCodeSent ? "shield-checkmark" : "call"}
                    size={32}
                    color={colors.primary}
                  />
                </View>
                <Text style={[styles.title, { color: colors.text }]}>
                  {isCodeSent
                    ? "Enter Verification Code"
                    : "Enter Your Phone Number"}
                </Text>
                <Text
                  style={[styles.subtitle, { color: colors.textSecondary }]}
                >
                  {isCodeSent
                    ? `We sent a 6-digit code to ${phoneNumber}`
                    : "We'll send you a verification code to confirm your number"}
                </Text>
              </View>
            </AnimatedCard>

            <AnimatedCard delay={400} direction="up">
              <View style={styles.inputContainer}>
                {!isCodeSent ? (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={phoneNumber}
                    onChangeText={(text) =>
                      setPhoneNumber(formatPhoneNumber(text))
                    }
                    placeholder="(555) 123-4567"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="phone-pad"
                    maxLength={14}
                    autoFocus
                  />
                ) : (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                        color: colors.text,
                      },
                    ]}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="123456"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="number-pad"
                    maxLength={6}
                    autoFocus
                  />
                )}
              </View>
            </AnimatedCard>

            <View style={styles.buttonContainer}>
              {!isCodeSent ? (
                <AnimatedButton
                  title={loading ? "Sending..." : "Send Code"}
                  onPress={sendVerificationCode}
                  variant="primary"
                  disabled={loading}
                  loading={loading}
                  style={styles.button}
                />
              ) : (
                <>
                  <AnimatedButton
                    title={loading ? "Verifying..." : "Verify Code"}
                    onPress={verifyCode}
                    variant="primary"
                    disabled={loading}
                    loading={loading}
                    style={styles.button}
                  />

                  {countdown > 0 ? (
                    <AnimatedCard delay={600} direction="up">
                      <Text
                        style={[
                          styles.countdownText,
                          { color: colors.textSecondary },
                        ]}
                      >
                        Resend code in {countdown}s
                      </Text>
                    </AnimatedCard>
                  ) : (
                    <AnimatedButton
                      title="Resend Code"
                      onPress={() => {
                        setIsCodeSent(false);
                        setVerificationCode("");
                        setCountdown(0);
                      }}
                      variant="outline"
                      style={styles.resendButton}
                    />
                  )}
                </>
              )}
            </View>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
  },
  button: {
    width: "100%",
    marginBottom: 16,
  },
  countdownText: {
    fontSize: 14,
    textAlign: "center",
    paddingVertical: 8,
  },
  resendButton: {
    width: "100%",
  },
});
