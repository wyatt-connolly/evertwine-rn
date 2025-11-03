import AsyncStorage from "@react-native-async-storage/async-storage";

// Clear corrupted cache IMMEDIATELY on import, before any Zustand stores initialize
(async () => {
  try {
    const cacheVersion = await AsyncStorage.getItem('cache-version-v2');
    if (!cacheVersion) {
      // Clear ALL persisted Zustand stores
      await AsyncStorage.removeItem('auth-storage');
      await AsyncStorage.removeItem('meetup-storage');
      await AsyncStorage.removeItem('favorites-storage');
      await AsyncStorage.removeItem('meetup-filter-storage');
      await AsyncStorage.removeItem('featured_members');
      await AsyncStorage.setItem('cache-version-v2', 'cleared');
    }
  } catch (e) {
    console.error('❌ [setup.ts] Cache clear error:', e);
  }
})();

export {};

