import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import SplashScreen from "./src/components/SplashScreen";
import ErrorBoundary from "./src/components/ErrorBoundary";
import { initializeDeepLinking } from "./src/utils/linking";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize deep linking for OAuth redirects
    const subscription = initializeDeepLinking();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  const handleSplashFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="auto" />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
