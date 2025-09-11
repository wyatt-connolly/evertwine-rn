import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserPreferences,
  DEFAULT_PREFERENCES,
  validatePreferences,
  isPreferencesComplete,
  getPreferenceCompletionPercentage,
} from '../constants/preferences';

interface PreferenceState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
}

interface PreferenceActions {
  // Core preference management
  setPreferences: (preferences: UserPreferences) => void;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  resetPreferences: () => void;
  
  // Specific preference updates
  updateAgeRange: (ageRange: UserPreferences['ageRange']) => void;
  updateGenderPreference: (genderPreference: UserPreferences['genderPreference']) => void;
  updateTimePreference: (timePreference: UserPreferences['timePreference']) => void;
  updateLocationPreference: (locationPreference: UserPreferences['locationPreference']) => void;
  updateActivityPreference: (activityPreference: UserPreferences['activityPreference']) => void;
  updateGroupSizePreference: (groupSizePreference: UserPreferences['groupSizePreference']) => void;
  
  // Completion and validation
  markPreferencesComplete: () => void;
  markPreferencesIncomplete: () => void;
  
  // Storage operations
  loadPreferences: () => Promise<void>;
  savePreferences: () => Promise<void>;
  
  // Utility functions
  getCompletionPercentage: () => number;
  isComplete: () => boolean;
  validate: () => string[];
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

const STORAGE_KEY = '@evertwine_preferences';

export const usePreferenceStore = create<PreferenceState & PreferenceActions>((set, get) => ({
  // Initial state
  preferences: DEFAULT_PREFERENCES,
  isLoading: false,
  error: null,

  // Core preference management
  setPreferences: (preferences: UserPreferences) => {
    const errors = validatePreferences(preferences);
    if (errors.length > 0) {
      set({ error: errors.join(', ') });
      return;
    }
    
    set({ preferences, error: null });
  },

  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    const currentPreferences = get().preferences;
    const newPreferences = { ...currentPreferences, [key]: value };
    
    const errors = validatePreferences(newPreferences);
    if (errors.length > 0) {
      set({ error: errors.join(', ') });
      return;
    }
    
    set({ preferences: newPreferences, error: null });
  },

  resetPreferences: () => {
    set({ preferences: DEFAULT_PREFERENCES, error: null });
  },

  // Specific preference updates
  updateAgeRange: (ageRange: UserPreferences['ageRange']) => {
    get().updatePreference('ageRange', ageRange);
  },

  updateGenderPreference: (genderPreference: UserPreferences['genderPreference']) => {
    get().updatePreference('genderPreference', genderPreference);
  },

  updateTimePreference: (timePreference: UserPreferences['timePreference']) => {
    get().updatePreference('timePreference', timePreference);
  },

  updateLocationPreference: (locationPreference: UserPreferences['locationPreference']) => {
    get().updatePreference('locationPreference', locationPreference);
  },

  updateActivityPreference: (activityPreference: UserPreferences['activityPreference']) => {
    get().updatePreference('activityPreference', activityPreference);
  },

  updateGroupSizePreference: (groupSizePreference: UserPreferences['groupSizePreference']) => {
    get().updatePreference('groupSizePreference', groupSizePreference);
  },

  // Completion and validation
  markPreferencesComplete: () => {
    get().updatePreference('hasCompletedPreferences', true);
  },

  markPreferencesIncomplete: () => {
    get().updatePreference('hasCompletedPreferences', false);
  },

  // Storage operations
  loadPreferences: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const preferences = JSON.parse(stored) as UserPreferences;
        set({ preferences, isLoading: false });
      } else {
        set({ preferences: DEFAULT_PREFERENCES, isLoading: false });
      }
    } catch (error) {
      set({ 
        error: 'Failed to load preferences', 
        isLoading: false,
        preferences: DEFAULT_PREFERENCES 
      });
    }
  },

  savePreferences: async () => {
    const { preferences } = get();
    set({ isLoading: true, error: null });
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      set({ isLoading: false });
    } catch (error) {
      set({ 
        error: 'Failed to save preferences', 
        isLoading: false 
      });
    }
  },

  // Utility functions
  getCompletionPercentage: () => {
    const { preferences } = get();
    return getPreferenceCompletionPercentage(preferences);
  },

  isComplete: () => {
    const { preferences } = get();
    return isPreferencesComplete(preferences);
  },

  validate: () => {
    const { preferences } = get();
    return validatePreferences(preferences);
  },

  // State management
  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },
}));

// Auto-save preferences when they change
usePreferenceStore.subscribe((state) => {
  // Debounce the save operation
  const timeoutId = setTimeout(() => {
    usePreferenceStore.getState().savePreferences();
  }, 1000);
  
  return () => clearTimeout(timeoutId);
});
