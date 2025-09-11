import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { FirestoreService } from "../../services/firebase";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import { usePreferenceStore } from "../../hooks/usePreferenceStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import { Ionicons } from "@expo/vector-icons";

type OnboardingCompleteScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "OnboardingComplete"
>;

interface Props {
  navigation: OnboardingCompleteScreenNavigationProp;
}

export default function OnboardingCompleteScreen({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  const { user, setOnboardingComplete, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();
  const { loadPreferences } = usePreferenceStore();

  const handleGetStarted = async () => {
    setLoading(true);

    try {
      // Load preferences
      await loadPreferences();
      
      // Update local state
      setOnboardingComplete(true);
      updateUserProfile({ onboardingComplete: true });

      if (user?.uid) {
        const result = await FirestoreService.updateUser(user.uid, {
          onboardingComplete: true,
        });

        if (result.error) {
          console.error("Failed to update onboarding status:", result.error);
        } else {
          console.log("✅ Onboarding completed successfully!");
        }
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetupPreferences = async () => {
    setLoading(true);

    try {
      // Load preferences
      await loadPreferences();
      
      // Update local state
      setOnboardingComplete(true);
      updateUserProfile({ onboardingComplete: true });

      if (user?.uid) {
        const result = await FirestoreService.updateUser(user.uid, {
          onboardingComplete: true,
        });

        if (result.error) {
          console.error("Failed to update onboarding status:", result.error);
        } else {
          console.log("✅ Onboarding completed successfully!");
        }
      }

      // Navigate to preference setup
      navigation.navigate("PreferenceSetup");
    } catch (error) {
      console.error("Error completing onboarding:", error);
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
            <View style={styles.iconContainer}>
              <Ionicons
                name="checkmark-circle"
                size={100}
                color={colors.success}
              />
            </View>

            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                You're All Set!
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Welcome to Evertwine! You're ready to start connecting with
                people who share your interests.
              </Text>
            </View>
          </AnimatedCard>

          <AnimatedCard delay={400} direction="up">
            <View style={styles.features}>
              <View style={styles.featureItem}>
                <Ionicons name="people" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Discover meetups
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="chatbubbles" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Connect with others
                </Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="heart" size={24} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  Build meaningful relationships
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={loading ? "Getting Started..." : "Setup Preferences"}
              onPress={handleSetupPreferences}
              variant="primary"
              disabled={loading}
              loading={loading}
              style={styles.primaryButton}
            />
            
            <AnimatedButton
              title="Skip for Now"
              onPress={handleGetStarted}
              variant="outline"
              disabled={loading}
              style={styles.secondaryButton}
            />
          </View>
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
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureText: {
    fontSize: 18,
    marginLeft: 16,
    fontWeight: "500",
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    marginTop: 20,
  },
  secondaryButton: {
    marginTop: 0,
  },
});
