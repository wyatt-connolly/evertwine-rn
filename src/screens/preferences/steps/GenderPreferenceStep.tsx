import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useThemeStore } from '../../../hooks/useThemeStore';
import { usePreferenceStore } from '../../../hooks/usePreferenceStore';
import { PREFERENCE_OPTIONS } from '../../../constants/preferences';

interface GenderPreferenceStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function GenderPreferenceStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: GenderPreferenceStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateGenderPreference } = usePreferenceStore();
  
  const [selectedGenders, setSelectedGenders] = useState<string[]>(
    preferences.genderPreference.interestedIn || []
  );
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.genderPreference.interestedIn.length === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateGenderPreference({ interestedIn: [] });
    } else {
      updateGenderPreference({ interestedIn: selectedGenders });
    }
  }, [selectedGenders, hasNoPreference, updateGenderPreference]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
    if (!hasNoPreference) {
      setSelectedGenders([]);
    }
  };

  const handleGenderToggle = (genderValue: string) => {
    if (hasNoPreference) {
      setHasNoPreference(false);
    }
    
    setSelectedGenders(prev => {
      if (prev.includes(genderValue)) {
        return prev.filter(g => g !== genderValue);
      } else {
        return [...prev, genderValue];
      }
    });
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Who would you like to meet?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the genders you're interested in meeting
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
            All genders
          </Text>
          <Text style={[
            styles.noPreferenceSubtext,
            { color: hasNoPreference ? colors.onPrimary : colors.textSecondary }
          ]}>
            No gender preference
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

      {/* Gender Options */}
      {!hasNoPreference && (
        <View style={styles.genderOptions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select specific genders:
          </Text>
          
          {PREFERENCE_OPTIONS.genders.map((gender) => {
            const isSelected = selectedGenders.includes(gender.value);
            
            return (
              <TouchableOpacity
                key={gender.value}
                style={[
                  styles.genderOption,
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => handleGenderToggle(gender.value)}
              >
                <Text style={[
                  styles.genderOptionText,
                  { color: isSelected ? colors.onPrimary : colors.text }
                ]}>
                  {gender.label}
                </Text>
                <View style={[
                  styles.optionCheckbox,
                  { 
                    backgroundColor: isSelected ? colors.onPrimary : 'transparent',
                    borderColor: isSelected ? colors.onPrimary : colors.border,
                  }
                ]}>
                  {isSelected && (
                    <Text style={[styles.optionCheckmark, { color: colors.primary }]}>✓</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Selection Summary */}
      {!hasNoPreference && selectedGenders.length > 0 && (
        <View style={[styles.summaryContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Selected:
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {selectedGenders.map(value => 
              PREFERENCE_OPTIONS.genders.find(g => g.value === value)?.label
            ).join(', ')}
          </Text>
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
  genderOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  genderOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  genderOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  optionCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionCheckmark: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
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
