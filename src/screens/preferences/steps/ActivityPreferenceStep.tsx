import React, { useState, useEffect } from "react";
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
import { PREFERENCE_OPTIONS } from "../../../constants/preferences";

interface ActivityPreferenceStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ActivityPreferenceStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: ActivityPreferenceStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateActivityPreference } = usePreferenceStore();

  const [selectedActivities, setSelectedActivities] = useState<string[]>(
    preferences.activityPreference.interests || []
  );
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.activityPreference.interests.length === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateActivityPreference({ interests: [] });
    } else {
      updateActivityPreference({ interests: selectedActivities });
    }
  }, [selectedActivities, hasNoPreference, updateActivityPreference]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
    if (!hasNoPreference) {
      setSelectedActivities([]);
    }
  };

  const handleActivityToggle = (activityValue: string) => {
    if (hasNoPreference) {
      setHasNoPreference(false);
    }

    setSelectedActivities((prev) => {
      if (prev.includes(activityValue)) {
        return prev.filter((a) => a !== activityValue);
      } else {
        return [...prev, activityValue];
      }
    });
  };

  const handleNext = () => {
    onNext();
  };

  const getActivityIcon = (activityValue: string) => {
    switch (activityValue) {
      case "coffee":
        return "cafe";
      case "food":
        return "restaurant";
      case "outdoor":
        return "leaf";
      case "fitness":
        return "fitness";
      case "arts":
        return "color-palette";
      case "music":
        return "musical-notes";
      case "movies":
        return "film";
      case "gaming":
        return "game-controller";
      case "books":
        return "book";
      case "travel":
        return "airplane";
      case "volunteer":
        return "heart";
      case "networking":
        return "people";
      case "learning":
        return "school";
      case "photography":
        return "camera";
      case "cooking":
        return "restaurant";
      default:
        return "star";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          What activities interest you?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select activities you'd enjoy doing with others
        </Text>
      </View>

      {/* No Preference Option */}
      <TouchableOpacity
        style={[
          styles.noPreferenceOption,
          {
            backgroundColor: hasNoPreference ? colors.primary : colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={handleNoPreferenceToggle}
      >
        <View style={styles.noPreferenceContent}>
          <Ionicons
            name="star"
            size={24}
            color={hasNoPreference ? colors.onPrimary : colors.textSecondary}
          />
          <View style={styles.noPreferenceTextContainer}>
            <Text
              style={[
                styles.noPreferenceText,
                { color: hasNoPreference ? colors.onPrimary : colors.text },
              ]}
            >
              All activities
            </Text>
            <Text
              style={[
                styles.noPreferenceSubtext,
                {
                  color: hasNoPreference
                    ? colors.onPrimary
                    : colors.textSecondary,
                },
              ]}
            >
              No activity preference
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: hasNoPreference
                ? colors.onPrimary
                : "transparent",
              borderColor: hasNoPreference ? colors.onPrimary : colors.border,
            },
          ]}
        >
          {hasNoPreference && (
            <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Activity Options */}
      {!hasNoPreference && (
        <View style={styles.activityOptions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select specific activities:
          </Text>

          <View style={styles.activityGrid}>
            {PREFERENCE_OPTIONS.activities.map((activity) => {
              const isSelected = selectedActivities.includes(activity.value);

              return (
                <TouchableOpacity
                  key={activity.value}
                  style={[
                    styles.activityOption,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                  ]}
                  onPress={() => handleActivityToggle(activity.value)}
                >
                  <Ionicons
                    name={getActivityIcon(activity.value)}
                    size={20}
                    color={isSelected ? colors.onPrimary : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.activityOptionText,
                      { color: isSelected ? colors.onPrimary : colors.text },
                    ]}
                  >
                    {activity.label}
                  </Text>
                  {isSelected && (
                    <View
                      style={[
                        styles.selectedIndicator,
                        { backgroundColor: colors.onPrimary },
                      ]}
                    >
                      <Ionicons
                        name="checkmark"
                        size={12}
                        color={colors.primary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Selection Summary */}
      {!hasNoPreference && selectedActivities.length > 0 && (
        <View
          style={[styles.summaryContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Selected activities ({selectedActivities.length}):
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {selectedActivities
              .map(
                (value) =>
                  PREFERENCE_OPTIONS.activities.find((a) => a.value === value)
                    ?.label
              )
              .join(", ")}
          </Text>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            {isLastStep ? "Complete" : "Next"}
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
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  noPreferenceOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  noPreferenceContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  noPreferenceTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  noPreferenceText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  noPreferenceSubtext: {
    fontSize: 14,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "bold",
  },
  activityOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  activityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  activityOption: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    alignItems: "center",
    position: "relative",
  },
  activityOptionText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
  },
  actionButtons: {
    marginTop: "auto",
    paddingTop: 20,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
