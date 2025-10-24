import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { useThemeStore } from "./src/hooks/useThemeStore";
import { PushNotificationService } from "./src/services/PushNotificationService";
import { useAuthStore } from "./src/hooks/useAuthStore";

export default function App() {
  const { initializeTheme, isDarkMode } = useThemeStore();
  const { user } = useAuthStore();

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
