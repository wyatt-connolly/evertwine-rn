import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { useThemeStore } from "./src/hooks/useThemeStore";
import { PushNotificationService } from "./src/services/PushNotificationService";
import { useAuthStore } from "./src/hooks/useAuthStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const { initializeTheme, isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  
  const [cacheCleared, setCacheCleared] = useState(false);

  // MUST clear cache before Zustand rehydrates - this runs BEFORE the first render
  useEffect(() => {
    const clearCorruptedCache = async () => {
      try {
        const cacheVersion = await AsyncStorage.getItem('cache-version-v2');
        if (!cacheVersion) {
          await AsyncStorage.removeItem('auth-storage');
          await AsyncStorage.removeItem('featured_members');
          await AsyncStorage.setItem('cache-version-v2', 'cleared');
        }
        setCacheCleared(true);
      } catch (e) {
        console.error('❌ [App] Cache clear error:', e);
        setCacheCleared(true);
      }
    };
    clearCorruptedCache();
  }, []);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  // Initialize push notifications
  useEffect(() => {
    const initializePushNotifications = async () => {
      try {
        await PushNotificationService.initialize();
      } catch (error) {}
    };

    initializePushNotifications();
  }, []);

  // Update push token when user changes
  useEffect(() => {
    const updatePushToken = async () => {
      if (user?.uid) {
        try {
          const token = await PushNotificationService.refreshPushToken();
          if (token) {
          }
        } catch (error) {}
      }
    };

    updatePushToken();
  }, [user?.uid]);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style={isDarkMode ? "light" : "dark"} />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
