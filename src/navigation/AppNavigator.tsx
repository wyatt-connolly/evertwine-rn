import React from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import TestScreen from "../screens/TestScreen";

export default function AppNavigator() {
  const { isAuthenticated, user, onboardingComplete } = useAuthStore();

  // For testing, uncomment the next line
  // return <TestScreen />;

  // Simple routing without authentication for now
  if (!isAuthenticated) {
    return <OnboardingStack />;
  }

  // Check if user has completed onboarding
  const userOnboardingComplete =
    user?.onboardingComplete !== undefined
      ? user.onboardingComplete
      : onboardingComplete;

  console.log("🧭 AppNavigator Routing:", {
    isAuthenticated,
    userOnboardingComplete,
    userOnboardingStatus: user?.onboardingComplete,
    storeOnboardingStatus: onboardingComplete,
    willShowOnboarding: !userOnboardingComplete,
  });

  if (!userOnboardingComplete) {
    return <OnboardingStack />;
  }

  return <MainTabs />;
}
