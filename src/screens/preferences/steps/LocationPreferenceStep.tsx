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

interface LocationPreferenceStepProps {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function LocationPreferenceStep({
  onNext,
  onBack,
  onSkip,
  isFirstStep,
  isLastStep,
}: LocationPreferenceStepProps) {
  const { colors } = useThemeStore();
  const { preferences, updateLocationPreference } = usePreferenceStore();
  
  const [selectedDistance, setSelectedDistance] = useState(
    preferences.locationPreference.maxDistance || 0
  );
  const [hasNoPreference, setHasNoPreference] = useState(
    preferences.locationPreference.maxDistance === 0
  );

  useEffect(() => {
    if (hasNoPreference) {
      updateLocationPreference({ maxDistance: 0 });
    } else {
      updateLocationPreference({ maxDistance: selectedDistance });
    }
  }, [selectedDistance, hasNoPreference, updateLocationPreference]);

  const handleNoPreferenceToggle = () => {
    setHasNoPreference(!hasNoPreference);
    if (!hasNoPreference) {
      setSelectedDistance(0);
    } else {
      setSelectedDistance(10); // Default to 10 miles
    }
  };

  const handleDistanceSelect = (distance: number) => {
    if (hasNoPreference) {
      setHasNoPreference(false);
    }
    setSelectedDistance(distance);
  };

  const handleNext = () => {
    onNext();
  };

  const getDistanceIcon = (distance: number) => {
    if (distance === 0) return 'globe';
    if (distance <= 5) return 'walk';
    if (distance <= 25) return 'car';
    return 'airplane';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          How far are you willing to travel?
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Choose the maximum distance you'd travel for meetups
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
            name="globe" 
            size={24} 
            color={hasNoPreference ? colors.onPrimary : colors.textSecondary} 
          />
          <View style={styles.noPreferenceTextContainer}>
            <Text style={[
              styles.noPreferenceText,
              { color: hasNoPreference ? colors.onPrimary : colors.text }
            ]}>
              Any distance
            </Text>
            <Text style={[
              styles.noPreferenceSubtext,
              { color: hasNoPreference ? colors.onPrimary : colors.textSecondary }
            ]}>
              No distance preference
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

      {/* Distance Options */}
      {!hasNoPreference && (
        <View style={styles.distanceOptions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Select maximum distance:
          </Text>
          
          {PREFERENCE_OPTIONS.distances.filter(d => d.value > 0).map((distance) => {
            const isSelected = selectedDistance === distance.value;
            
            return (
              <TouchableOpacity
                key={distance.value}
                style={[
                  styles.distanceOption,
                  { 
                    backgroundColor: isSelected ? colors.primary : colors.surface,
                    borderColor: isSelected ? colors.primary : colors.border,
                  }
                ]}
                onPress={() => handleDistanceSelect(distance.value)}
              >
                <Ionicons 
                  name={getDistanceIcon(distance.value)} 
                  size={24} 
                  color={isSelected ? colors.onPrimary : colors.textSecondary} 
                />
                <View style={styles.distanceOptionContent}>
                  <Text style={[
                    styles.distanceOptionText,
                    { color: isSelected ? colors.onPrimary : colors.text }
                  ]}>
                    {distance.label}
                  </Text>
                  <Text style={[
                    styles.distanceOptionSubtext,
                    { color: isSelected ? colors.onPrimary : colors.textSecondary }
                  ]}>
                    {distance.value <= 5 ? 'Walking distance' : 
                     distance.value <= 25 ? 'Short drive' : 'Longer trip'}
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
      {!hasNoPreference && selectedDistance > 0 && (
        <View style={[styles.summaryContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            Selected distance:
          </Text>
          <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
            {PREFERENCE_OPTIONS.distances.find(d => d.value === selectedDistance)?.label}
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
  distanceOptions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  distanceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  distanceOptionContent: {
    flex: 1,
    marginLeft: 16,
  },
  distanceOptionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  distanceOptionSubtext: {
    fontSize: 14,
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
