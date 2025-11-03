import AsyncStorage from "@react-native-async-storage/async-storage";

// Clear corrupted cache IMMEDIATELY on import, before any Zustand stores initialize
(async () => {
  try {
    const cacheVersion = await AsyncStorage.getItem('cache-version-v2');
    console.log('📦 [setup.ts] Cache version check:', cacheVersion);
    if (!cacheVersion) {
      console.log('🗑️ [setup.ts] CLEARING ALL CORRUPTED CACHE NOW!');
      // Clear ALL persisted Zustand stores
      await AsyncStorage.removeItem('auth-storage');
      await AsyncStorage.removeItem('meetup-storage');
      await AsyncStorage.removeItem('favorites-storage');
      await AsyncStorage.removeItem('meetup-filter-storage');
      await AsyncStorage.removeItem('featured_members');
      await AsyncStorage.setItem('cache-version-v2', 'cleared');
      console.log('✅ [setup.ts] All caches cleared!');
    } else {
      // FORCE clear on every load for debugging
      console.log('🗑️ [setup.ts] FORCE CLEARING CACHE FOR DEBUGGING!');
      await AsyncStorage.removeItem('auth-storage');
      await AsyncStorage.removeItem('meetup-storage');
      await AsyncStorage.removeItem('favorites-storage');
      await AsyncStorage.removeItem('meetup-filter-storage');
      await AsyncStorage.removeItem('featured_members');
      console.log('✅ [setup.ts] Force cleared all caches!');
    }
  } catch (e) {
    console.error('❌ [setup.ts] Cache clear error:', e);
  }
})();

export {};

