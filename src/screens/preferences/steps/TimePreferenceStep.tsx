import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../../../hooks/useThemeStore';
import { usePreferenceStore } from '../../../hooks/usePreferenceStore';
import { PREFERENCE_OPTIONS } from '../../../constants/preferences';

interface TimePreferenceStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function TimePreferenceStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: TimePreferenceStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateTimePreference } = usePreferenceStore();
  
  const [selectedTimes, setSelectedTimes] = useState<string[]>(
    preferences.timePreference.availableTimes || []
  );
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.timePreference.availableTimes.length === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateTimePreference({ availableTimes: [] });
    } else {
      updateTimePreference({ availableTimes: selectedTimes });
    }
  }, [selectedTimes, hasNoPreference, updateTimePreference]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
    if (!hasNoPreference) {
      setSelectedTimes([]);
    }
  };

  const handleTimeToggle = (timeValue: string) => {
    if (hasNoPreference) {
      setHasNoPreference(false);
    }
    
    setSelectedTimes(prev => {
      if (prev.includes(timeValue)) {
        return prev.filter(t => t !== timeValue);
      } else {
        return [...prev, timeValue];
      }
    });
  };

  const handleNext = () => {
    onNext();
  };

  const getTimeIcon = (timeValue: string) => {
    switch (timeValue) {
      case 'morning':
        return 'sunny';
      case 'afternoon':
        return 'partly-sunny';
      case 'evening':
        return 'moon';
      case 'night':
        return 'moon-outline';
      default:
        return 'time';
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          When are you available?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Select the times when you're most likely to be free for meetups
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
          <Ionicons 
            name="time" 
            size={24} 
            color={hasNoPreference ? colors.onPrimary : colors.textSecondary} 
          />
          <View style={styles.noPreferenceTextContainer}>
            <Text style={[
              styles.noPreferenceText,
              { color: hasNoPreference ? colors.onPrimary : colors.text }
            ]}>
              Any time
            </Text>
            <Text style={[
              styles.noPreferenceSubtext,
              { color: hasNoPreference ? colors.onPrimary : colors.textSecondary }
            ]}>
              No time preference
            </Text>
          </View>
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

      {/* Time Options */}
      {!hasNoPreference && (
        <View style={styles.timeOptions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select specific times:
          </Text>
          
          {PREFERENCE_OPTIONS.timeSlots.map((timeSlot) => {
            const isSelected = selectedTimes.includes(timeSlot.value);
            
            return (
              <TouchableOpacity
                key={timeSlot.value}
                style={[
                  styles.timeOption,
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => handleTimeToggle(timeSlot.value)}
              >
                <Ionicons 
                  name={getTimeIcon(timeSlot.value)} 
                  size={24} 
                  color={isSelected ? colors.onPrimary : colors.textSecondary} 
                />
                <View style={styles.timeOptionContent}>
                  <Text style={[
                    styles.timeOptionText,
                    { color: isSelected ? colors.onPrimary : colors.text }
                  ]}>
                    {timeSlot.label}
                  </Text>
                </View>
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
      {!hasNoPreference && selectedTimes.length > 0 && (
        <View style={[styles.summaryContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Selected times:
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {selectedTimes.map(value => 
              PREFERENCE_OPTIONS.timeSlots.find(t => t.value === value)?.label
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  noPreferenceTextContainer: {
    marginLeft: 16,
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
  timeOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  timeOptionContent: {
    flex: 1,
    marginLeft: 16,
  },
  timeOptionText: {
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
