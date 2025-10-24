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
import { SupabaseAuthService } from "../../services/supabase";
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

      const result = await SupabaseAuthService.signInWithPhone(fullPhoneNumber);

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
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      Alert.alert("Invalid Code", "Please enter the 6-digit verification code");
      return;
    }

    setLoading(true);
    try {
      // Ensure we're in production mode for phone authentication

      const result = await SupabaseAuthService.verifyPhoneOTP(
        verificationId,
        verificationCode
      );

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      // Try to load user profile from Supabase
      let userProfile = null;
      try {
        const profileResult = await DataService.getUser(result.user.uid);

        if (profileResult.user) {
          userProfile = profileResult.user;
        } else {
        }
      } catch (profileError) {}

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

      // Set user and authentication state
      setUser(user);
      setAuthenticated(true);

      // Also update the onboarding status in the store to ensure consistency
      if (user.onboardingComplete) {
        setOnboardingComplete(true);

        // The AppNavigator will handle routing to MainTabs
      } else {
        setOnboardingComplete(false);

        try {
          navigation.navigate("ProfileSetup");
        } catch (navError) {
          Alert.alert(
            "Navigation Error",
            "Unable to navigate to profile setup. Please try again."
          );
        }
      }
    } catch (error) {
      Alert.alert("Error", "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground variant="dark">
      <SafeAreaView style={styles.container}>
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
                <Text style={[styles.title, { color: "#FFFFFF" }]}>
                  {isCodeSent
                    ? "Enter Verification Code"
                    : "Enter Your Phone Number"}
                </Text>
                <Text style={[styles.subtitle, { color: "#E5E5EA" }]}>
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
                        color: "#FFFFFF",
                      },
                    ]}
                    value={phoneNumber}
                    onChangeText={(text) =>
                      setPhoneNumber(formatPhoneNumber(text))
                    }
                    placeholder="(555) 123-4567"
                    placeholderTextColor="#AEAEB2"
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
                        color: "#FFFFFF",
                      },
                    ]}
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    placeholder="123456"
                    placeholderTextColor="#AEAEB2"
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
                        style={[styles.countdownText, { color: "#E5E5EA" }]}
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
