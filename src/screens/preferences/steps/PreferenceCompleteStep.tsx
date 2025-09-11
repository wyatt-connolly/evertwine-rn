import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../../hooks/useThemeStore";
import { usePreferenceStore } from "../../../hooks/usePreferenceStore";
import {
  getDisplayText,
  getPreferenceCompletionPercentage,
} from "../../../constants/preferences";

interface PreferenceCompleteStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function PreferenceCompleteStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: PreferenceCompleteStepProps) {
  const { colors } = useThemeStore();
  const { preferences } = usePreferenceStore();

  const completionPercentage = getPreferenceCompletionPercentage(preferences);

  const handleComplete = () => {
    onNext();
  };

  const handleEditPreferences = () => {
    // This would typically navigate back to the first step or allow editing
    // For now, we'll just go back
    onBack();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View
          style={[
            styles.successIcon,
            { backgroundColor: colors.success + "20" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={64} color={colors.success} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Preferences Complete!
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          We've saved your preferences and will use them to find the perfect
          meetups for you.
        </Text>
      </View>

      {/* Completion Summary */}
      <View
        style={[styles.summaryContainer, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          Your Preferences Summary
        </Text>

        <View style={styles.preferenceItem}>
          <Ionicons name="calendar" size={20} color={colors.textSecondary} />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Age Range
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.ageRange(preferences.ageRange)}
            </Text>
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Ionicons name="people" size={20} color={colors.textSecondary} />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Gender Preference
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.genderPreference(preferences.genderPreference)}
            </Text>
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Ionicons name="time" size={20} color={colors.textSecondary} />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Available Times
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.timePreference(preferences.timePreference)}
            </Text>
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Ionicons name="location" size={20} color={colors.textSecondary} />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Travel Distance
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.locationPreference(
                preferences.locationPreference
              )}
            </Text>
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Ionicons name="star" size={20} color={colors.textSecondary} />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Activity Interests
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.activityPreference(
                preferences.activityPreference
              )}
            </Text>
          </View>
        </View>

        <View style={styles.preferenceItem}>
          <Ionicons
            name="people-circle"
            size={20}
            color={colors.textSecondary}
          />
          <View style={styles.preferenceContent}>
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Group Size
            </Text>
            <Text
              style={[styles.preferenceValue, { color: colors.textSecondary }]}
            >
              {getDisplayText.groupSizePreference(
                preferences.groupSizePreference
              )}
            </Text>
          </View>
        </View>
      </View>

      {/* Completion Stats */}
      <View
        style={[styles.statsContainer, { backgroundColor: colors.surface }]}
      >
        <Text style={[styles.statsTitle, { color: colors.text }]}>
          Setup Complete
        </Text>
        <Text style={[styles.statsPercentage, { color: colors.primary }]}>
          {completionPercentage}%
        </Text>
        <Text
          style={[styles.statsDescription, { color: colors.textSecondary }]}
        >
          You're all set to start discovering amazing meetups!
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={handleComplete}
        >
          <Ionicons name="rocket" size={20} color={colors.onPrimary} />
          <Text
            style={[styles.completeButtonText, { color: colors.onPrimary }]}
          >
            Start Exploring
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.editButton, { borderColor: colors.border }]}
          onPress={handleEditPreferences}
        >
          <Ionicons name="create" size={20} color={colors.text} />
          <Text style={[styles.editButtonText, { color: colors.text }]}>
            Edit Preferences
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  summaryContainer: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  preferenceContent: {
    flex: 1,
    marginLeft: 12,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 14,
  },
  statsContainer: {
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 32,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  statsPercentage: {
    fontSize: 48,
    fontWeight: "700",
    marginBottom: 8,
  },
  statsDescription: {
    fontSize: 14,
    textAlign: "center",
  },
  actionButtons: {
    gap: 12,
  },
  completeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  completeButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
