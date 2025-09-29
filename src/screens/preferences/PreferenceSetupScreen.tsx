import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { usePreferenceStore } from "../../hooks/usePreferenceStore";
import {
  getPreferenceCompletionPercentage,
  DEFAULT_PREFERENCES,
} from "../../constants/preferences";
import { useAuthStore } from "../../hooks/useAuthStore";
import { FirestoreService } from "../../services/firebase";
import { DataService } from "../../services/DataService";

// Import preference step components
import AgeRangeStep from "./steps/AgeRangeStep";
import GenderPreferenceStep from "./steps/GenderPreferenceStep";
import TimePreferenceStep from "./steps/TimePreferenceStep";
import LocationPreferenceStep from "./steps/LocationPreferenceStep";
import ActivityPreferenceStep from "./steps/ActivityPreferenceStep";
import GroupSizePreferenceStep from "./steps/GroupSizePreferenceStep";
import PreferenceCompleteStep from "./steps/PreferenceCompleteStep";

interface PreferenceSetupScreenProps {
  navigation: any;
  onComplete?: () => void;
  onSkip?: () => void;
}

const PREFERENCE_STEPS = [
  { id: "ageRange", title: "Age Range", component: AgeRangeStep },
  {
    id: "genderPreference",
    title: "Gender Preference",
    component: GenderPreferenceStep,
  },
  {
    id: "timePreference",
    title: "Time Preferences",
    component: TimePreferenceStep,
  },
  {
    id: "locationPreference",
    title: "Location Distance",
    component: LocationPreferenceStep,
  },
  {
    id: "activityPreference",
    title: "Activity Interests",
    component: ActivityPreferenceStep,
  },
  {
    id: "groupSizePreference",
    title: "Group Size",
    component: GroupSizePreferenceStep,
  },
  { id: "complete", title: "Complete", component: PreferenceCompleteStep },
];

export default function PreferenceSetupScreen({
  navigation,
  onComplete,
  onSkip,
}: PreferenceSetupScreenProps) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const { preferences, markPreferencesComplete, savePreferences, isLoading } =
    usePreferenceStore();

  const [currentStep, setCurrentStep] = useState(0);
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    setCanGoBack(currentStep > 0);
  }, [currentStep]);

  const handleNext = () => {
    if (currentStep < PREFERENCE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      "Skip Preferences",
      "You can always set your preferences later in Settings. Are you sure you want to skip?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Skip",
          style: "destructive",
          onPress: async () => {
            try {
              // Save default preferences to Firebase (only if not in developer mode)
              if (!DataService.isInDeveloperMode() && user?.uid) {
                const result = await FirestoreService.updateUser(user.uid, {
                  preferences: DEFAULT_PREFERENCES,
                });

                if (result.error) {
                  console.error(
                    "Failed to save default preferences to Firebase:",
                    result.error
                  );
                } else {
                  console.log("✅ Default preferences saved to Firebase!");
                }
              } else {
                console.log(
                  "🔧 Developer Mode: Skipping Firebase, using local storage only"
                );
                console.log("✅ Default preferences saved locally!");
              }

              if (onSkip) {
                onSkip();
              } else {
                // Navigate to main app
                navigation.reset({
                  index: 0,
                  routes: [{ name: "MainTabs" }],
                });
              }
            } catch (error) {
              console.error("Error saving default preferences:", error);
              Alert.alert(
                "Error",
                "Failed to save preferences. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const handleComplete = async () => {
    try {
      await markPreferencesComplete();
      await savePreferences();

      // Save preferences to Firebase (only if not in developer mode)
      if (!DataService.isInDeveloperMode() && user?.uid) {
        const result = await FirestoreService.updateUser(user.uid, {
          preferences: preferences,
        });

        if (result.error) {
          console.error(
            "Failed to save preferences to Firebase:",
            result.error
          );
        } else {
          console.log("✅ Preferences saved to Firebase successfully!");
        }
      } else {
        console.log(
          "🔧 Developer Mode: Skipping Firebase, using local storage only"
        );
        console.log("✅ Preferences saved locally!");
      }

      if (onComplete) {
        onComplete();
      } else {
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        });
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
      Alert.alert("Error", "Failed to save preferences. Please try again.");
    }
  };

  const renderStep = () => {
    const step = PREFERENCE_STEPS[currentStep];
    const StepComponent = step.component;

    return (
      <StepComponent
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleSkip}
        isFirstStep={currentStep === 0}
        isLastStep={currentStep === PREFERENCE_STEPS.length - 1}
      />
    );
  };

  const getProgressPercentage = () => {
    if (currentStep === PREFERENCE_STEPS.length - 1) {
      return 100;
    }
    return Math.round((currentStep / (PREFERENCE_STEPS.length - 1)) * 100);
  };

  const completionPercentage = getPreferenceCompletionPercentage(preferences);

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          {canGoBack && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.headerCenter}>
          <Text style={[styles.title, { color: colors.text }]}>
            {PREFERENCE_STEPS[currentStep].title}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Step {currentStep + 1} of {PREFERENCE_STEPS.length}
          </Text>
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text
              style={[styles.skipButtonText, { color: colors.textSecondary }]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View
        style={[styles.progressContainer, { backgroundColor: colors.surface }]}
      >
        <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: colors.primary,
                width: `${getProgressPercentage()}%`,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {getProgressPercentage()}% Complete
        </Text>
      </View>

      {/* Step Content */}
      <View style={styles.content}>{renderStep()}</View>

      {/* Loading Overlay */}
      {isLoading && (
        <View
          style={[styles.loadingOverlay, { backgroundColor: colors.overlay }]}
        >
          <View
            style={[
              styles.loadingContainer,
              { backgroundColor: colors.surface },
            ]}
          >
            <Text style={[styles.loadingText, { color: colors.text }]}>
              Saving preferences...
            </Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerLeft: {
    width: 60,
    alignItems: "flex-start",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerRight: {
    width: 60,
    alignItems: "flex-end",
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  skipButton: {
    padding: 8,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 12,
  },
});
