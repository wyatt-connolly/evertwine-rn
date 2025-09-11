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

interface GroupSizePreferenceStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function GroupSizePreferenceStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: GroupSizePreferenceStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateGroupSizePreference } = usePreferenceStore();

  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    preferences.groupSizePreference.preferredSizes || []
  );
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.groupSizePreference.preferredSizes.length === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateGroupSizePreference({ preferredSizes: [] });
    } else {
      updateGroupSizePreference({ preferredSizes: selectedSizes });
    }
  }, [selectedSizes, hasNoPreference, updateGroupSizePreference]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
    if (!hasNoPreference) {
      setSelectedSizes([]);
    }
  };

  const handleSizeToggle = (sizeValue: string) => {
    if (hasNoPreference) {
      setHasNoPreference(false);
    }

    setSelectedSizes((prev) => {
      if (prev.includes(sizeValue)) {
        return prev.filter((s) => s !== sizeValue);
      } else {
        return [...prev, sizeValue];
      }
    });
  };

  const handleNext = () => {
    onNext();
  };

  const getGroupSizeIcon = (sizeValue: string) => {
    switch (sizeValue) {
      case "one-on-one":
        return "person";
      case "small-group":
        return "people";
      case "medium-group":
        return "people-outline";
      case "large-group":
        return "people-circle";
      default:
        return "people";
    }
  };

  const getGroupSizeDescription = (sizeValue: string) => {
    switch (sizeValue) {
      case "one-on-one":
        return "Intimate conversations and deep connections";
      case "small-group":
        return "Close-knit gatherings with friends";
      case "medium-group":
        return "Social events with moderate crowds";
      case "large-group":
        return "Big events and networking opportunities";
      default:
        return "";
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          What group sizes do you prefer?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose the types of gatherings you enjoy most
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
            name="people"
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
              Any group size
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
              No group size preference
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

      {/* Group Size Options */}
      {!hasNoPreference && (
        <View style={styles.groupSizeOptions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select preferred group sizes:
          </Text>

          {PREFERENCE_OPTIONS.groupSizes.map((groupSize) => {
            const isSelected = selectedSizes.includes(groupSize.value);

            return (
              <TouchableOpacity
                key={groupSize.value}
                style={[
                  styles.groupSizeOption,
                  {
                    backgroundColor: isSelected
                      ? colors.primary
                      : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  },
                ]}
                onPress={() => handleSizeToggle(groupSize.value)}
              >
                <Ionicons
                  name={getGroupSizeIcon(groupSize.value)}
                  size={24}
                  color={isSelected ? colors.onPrimary : colors.textSecondary}
                />
                <View style={styles.groupSizeOptionContent}>
                  <Text
                    style={[
                      styles.groupSizeOptionText,
                      { color: isSelected ? colors.onPrimary : colors.text },
                    ]}
                  >
                    {groupSize.label}
                  </Text>
                  <Text
                    style={[
                      styles.groupSizeOptionDescription,
                      {
                        color: isSelected
                          ? colors.onPrimary
                          : colors.textSecondary,
                      },
                    ]}
                  >
                    {getGroupSizeDescription(groupSize.value)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.optionCheckbox,
                    {
                      backgroundColor: isSelected
                        ? colors.onPrimary
                        : "transparent",
                      borderColor: isSelected
                        ? colors.onPrimary
                        : colors.border,
                    },
                  ]}
                >
                  {isSelected && (
                    <Text
                      style={[
                        styles.optionCheckmark,
                        { color: colors.primary },
                      ]}
                    >
                      ✓
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Selection Summary */}
      {!hasNoPreference && selectedSizes.length > 0 && (
        <View
          style={[styles.summaryContainer, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Selected group sizes:
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {selectedSizes
              .map(
                (value) =>
                  PREFERENCE_OPTIONS.groupSizes.find((g) => g.value === value)
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
  groupSizeOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  groupSizeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  groupSizeOptionContent: {
    flex: 1,
    marginLeft: 16,
  },
  groupSizeOptionText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  groupSizeOptionDescription: {
    fontSize: 14,
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCheckmark: {
    fontSize: 12,
    fontWeight: "bold",
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
