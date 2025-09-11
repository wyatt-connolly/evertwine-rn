// Preference constants and helper functions for Evertwine

export interface AgeRange {
  min: number;
  max: number;
}

export interface GenderPreference {
  interestedIn: string[]; // Empty array = no preference (all genders)
}

export interface TimePreference {
  availableTimes: string[]; // Empty array = no preference (all times)
}

export interface LocationPreference {
  maxDistance: number; // 0 = no preference (any distance)
}

export interface ActivityPreference {
  interests: string[]; // Empty array = no preference (all activities)
}

export interface GroupSizePreference {
  preferredSizes: string[]; // Empty array = no preference (all sizes)
}

export interface UserPreferences {
  ageRange: AgeRange;
  genderPreference: GenderPreference;
  timePreference: TimePreference;
  locationPreference: LocationPreference;
  activityPreference: ActivityPreference;
  groupSizePreference: GroupSizePreference;
  hasCompletedPreferences: boolean;
}

// Default preference values (empty = no preference)
export const DEFAULT_PREFERENCES: UserPreferences = {
  ageRange: {
    min: 0, // 0 = no minimum preference
    max: 0, // 0 = no maximum preference
  },
  genderPreference: {
    interestedIn: [], // Empty array = no preference (all genders)
  },
  timePreference: {
    availableTimes: [], // Empty array = no preference (all times)
  },
  locationPreference: {
    maxDistance: 0, // 0 = no preference (any distance)
  },
  activityPreference: {
    interests: [], // Empty array = no preference (all activities)
  },
  groupSizePreference: {
    preferredSizes: [], // Empty array = no preference (all sizes)
  },
  hasCompletedPreferences: false,
};

// Available options for each preference type
export const PREFERENCE_OPTIONS = {
  // Age range options
  ageRange: {
    min: Array.from({ length: 50 }, (_, i) => i + 18), // 18-67
    max: Array.from({ length: 50 }, (_, i) => i + 18), // 18-67
  },

  // Gender options
  genders: [
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
    { value: 'non-binary', label: 'Non-binary' },
    { value: 'transgender', label: 'Transgender' },
    { value: 'other', label: 'Other' },
  ],

  // Time preferences
  timeSlots: [
    { value: 'morning', label: 'Morning (6 AM - 12 PM)' },
    { value: 'afternoon', label: 'Afternoon (12 PM - 6 PM)' },
    { value: 'evening', label: 'Evening (6 PM - 10 PM)' },
    { value: 'night', label: 'Night (10 PM - 6 AM)' },
  ],

  // Distance options (in miles)
  distances: [
    { value: 1, label: '1 mile' },
    { value: 5, label: '5 miles' },
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
    { value: 0, label: 'Any distance' },
  ],

  // Activity interests
  activities: [
    { value: 'coffee', label: 'Coffee & Tea' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'outdoor', label: 'Outdoor Activities' },
    { value: 'fitness', label: 'Fitness & Sports' },
    { value: 'arts', label: 'Arts & Culture' },
    { value: 'music', label: 'Music & Concerts' },
    { value: 'movies', label: 'Movies & Entertainment' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'books', label: 'Books & Reading' },
    { value: 'travel', label: 'Travel & Adventure' },
    { value: 'volunteer', label: 'Volunteering' },
    { value: 'networking', label: 'Professional Networking' },
    { value: 'learning', label: 'Learning & Education' },
    { value: 'photography', label: 'Photography' },
    { value: 'cooking', label: 'Cooking & Baking' },
  ],

  // Group size preferences
  groupSizes: [
    { value: 'one-on-one', label: '1-on-1' },
    { value: 'small-group', label: 'Small Groups (2-4 people)' },
    { value: 'medium-group', label: 'Medium Groups (5-8 people)' },
    { value: 'large-group', label: 'Large Groups (9+ people)' },
  ],
};

// Helper functions to check if a value means "no preference"
export const isNoPreference = {
  ageRange: (ageRange: AgeRange): boolean => {
    return ageRange.min === 0 && ageRange.max === 0;
  },

  genderPreference: (genderPreference: GenderPreference): boolean => {
    return genderPreference.interestedIn.length === 0;
  },

  timePreference: (timePreference: TimePreference): boolean => {
    return timePreference.availableTimes.length === 0;
  },

  locationPreference: (locationPreference: LocationPreference): boolean => {
    return locationPreference.maxDistance === 0;
  },

  activityPreference: (activityPreference: ActivityPreference): boolean => {
    return activityPreference.interests.length === 0;
  },

  groupSizePreference: (groupSizePreference: GroupSizePreference): boolean => {
    return groupSizePreference.preferredSizes.length === 0;
  },
};

// Helper functions to get user-friendly display text
export const getDisplayText = {
  ageRange: (ageRange: AgeRange): string => {
    if (isNoPreference.ageRange(ageRange)) {
      return 'Any age';
    }
    if (ageRange.min === ageRange.max) {
      return `${ageRange.min} years old`;
    }
    return `${ageRange.min}-${ageRange.max} years old`;
  },

  genderPreference: (genderPreference: GenderPreference): string => {
    if (isNoPreference.genderPreference(genderPreference)) {
      return 'All genders';
    }
    const labels = genderPreference.interestedIn.map(
      (value) => PREFERENCE_OPTIONS.genders.find((g) => g.value === value)?.label || value
    );
    return labels.join(', ');
  },

  timePreference: (timePreference: TimePreference): string => {
    if (isNoPreference.timePreference(timePreference)) {
      return 'Any time';
    }
    const labels = timePreference.availableTimes.map(
      (value) => PREFERENCE_OPTIONS.timeSlots.find((t) => t.value === value)?.label || value
    );
    return labels.join(', ');
  },

  locationPreference: (locationPreference: LocationPreference): string => {
    if (isNoPreference.locationPreference(locationPreference)) {
      return 'Any distance';
    }
    const distance = PREFERENCE_OPTIONS.distances.find(
      (d) => d.value === locationPreference.maxDistance
    );
    return distance?.label || `${locationPreference.maxDistance} miles`;
  },

  activityPreference: (activityPreference: ActivityPreference): string => {
    if (isNoPreference.activityPreference(activityPreference)) {
      return 'All activities';
    }
    const labels = activityPreference.interests.map(
      (value) => PREFERENCE_OPTIONS.activities.find((a) => a.value === value)?.label || value
    );
    return labels.join(', ');
  },

  groupSizePreference: (groupSizePreference: GroupSizePreference): string => {
    if (isNoPreference.groupSizePreference(groupSizePreference)) {
      return 'Any group size';
    }
    const labels = groupSizePreference.preferredSizes.map(
      (value) => PREFERENCE_OPTIONS.groupSizes.find((g) => g.value === value)?.label || value
    );
    return labels.join(', ');
  },
};

// Validation functions
export const validatePreferences = (preferences: UserPreferences): string[] => {
  const errors: string[] = [];

  // Age range validation
  if (preferences.ageRange.min > 0 && preferences.ageRange.max > 0) {
    if (preferences.ageRange.min > preferences.ageRange.max) {
      errors.push('Minimum age cannot be greater than maximum age');
    }
  }

  // Distance validation
  if (preferences.locationPreference.maxDistance < 0) {
    errors.push('Distance cannot be negative');
  }

  return errors;
};

// Preference completion check
export const isPreferencesComplete = (preferences: UserPreferences): boolean => {
  return preferences.hasCompletedPreferences;
};

// Get preference completion percentage
export const getPreferenceCompletionPercentage = (preferences: UserPreferences): number => {
  const totalSteps = 6;
  let completedSteps = 0;

  if (!isNoPreference.ageRange(preferences.ageRange)) completedSteps++;
  if (!isNoPreference.genderPreference(preferences.genderPreference)) completedSteps++;
  if (!isNoPreference.timePreference(preferences.timePreference)) completedSteps++;
  if (!isNoPreference.locationPreference(preferences.locationPreference)) completedSteps++;
  if (!isNoPreference.activityPreference(preferences.activityPreference)) completedSteps++;
  if (!isNoPreference.groupSizePreference(preferences.groupSizePreference)) completedSteps++;

  return Math.round((completedSteps / totalSteps) * 100);
};
