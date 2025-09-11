import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useThemeStore } from '../../../hooks/useThemeStore';
import { usePreferenceStore } from '../../../hooks/usePreferenceStore';
import { PREFERENCE_OPTIONS } from '../../../constants/preferences';

interface AgeRangeStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function AgeRangeStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: AgeRangeStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateAgeRange } = usePreferenceStore();
  
  const [minAge, setMinAge] = useState(preferences.ageRange.min || 18);
  const [maxAge, setMaxAge] = useState(preferences.ageRange.max || 65);
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.ageRange.min === 0 && preferences.ageRange.max === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateAgeRange({ min: 0, max: 0 });
    } else {
      updateAgeRange({ min: minAge, max: maxAge });
    }
  }, [minAge, maxAge, hasNoPreference, updateAgeRange]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          What age range are you interested in?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This helps us find people in your preferred age group
        </Text>
      </View>

      {/* No Preference Option */}
      <TouchableOpacity
        style={[
          styles.noPreferenceOption,
          { 
            backgroundColor: hasNoPreference ? colors.primary : colors.surface,
            borderColor: colors.border,
          }
        ]}
        onPress={handleNoPreferenceToggle}
      >
        <View style={styles.noPreferenceContent}>
          <Text style={[
            styles.noPreferenceText,
            { color: hasNoPreference ? colors.onPrimary : colors.text }
          ]}>
            Any age
          </Text>
          <Text style={[
            styles.noPreferenceSubtext,
            { color: hasNoPreference ? colors.onPrimary : colors.textSecondary }
          ]}>
            No age preference
          </Text>
        </View>
        <View style={[
          styles.checkbox,
          { 
            backgroundColor: hasNoPreference ? colors.onPrimary : 'transparent',
            borderColor: hasNoPreference ? colors.onPrimary : colors.border,
          }
        ]}>
          {hasNoPreference && (
            <Text style={[styles.checkmark, { color: colors.primary }]}>✓</Text>
          )}
        </View>
      </TouchableOpacity>

      {/* Age Range Selectors */}
      {!hasNoPreference && (
        <View style={styles.ageRangeContainer}>
          <View style={styles.ageSelector}>
            <Text style={[styles.ageLabel, { color: colors.text }]}>
              Minimum Age
            </Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Picker
                selectedValue={minAge}
                onValueChange={setMinAge}
                style={[styles.picker, { color: colors.text }]}
                itemStyle={{ color: colors.text }}
              >
                {PREFERENCE_OPTIONS.ageRange.min.map((age) => (
                  <Picker.Item key={age} label={`${age} years`} value={age} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.ageSelector}>
            <Text style={[styles.ageLabel, { color: colors.text }]}>
              Maximum Age
            </Text>
            <View style={[styles.pickerContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Picker
                selectedValue={maxAge}
                onValueChange={setMaxAge}
                style={[styles.picker, { color: colors.text }]}
                itemStyle={{ color: colors.text }}
              >
                {PREFERENCE_OPTIONS.ageRange.max.map((age) => (
                  <Picker.Item key={age} label={`${age} years`} value={age} />
                ))}
              </Picker>
            </View>
          </View>

          {minAge > maxAge && (
            <View style={[styles.warningContainer, { backgroundColor: colors.error + '20' }]}>
              <Text style={[styles.warningText, { color: colors.error }]}>
                Minimum age cannot be greater than maximum age
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            { backgroundColor: colors.primary }
          ]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            {isLastStep ? 'Complete' : 'Next'}
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
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  noPreferenceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 24,
  },
  noPreferenceContent: {
    flex: 1,
  },
  noPreferenceText: {
    fontSize: 18,
    fontWeight: '600',
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ageRangeContainer: {
    marginBottom: 32,
  },
  ageSelector: {
    marginBottom: 24,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  pickerContainer: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  warningText: {
    fontSize: 14,
    textAlign: 'center',
  },
  actionButtons: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
