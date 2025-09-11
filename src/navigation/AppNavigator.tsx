import React, { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import TestScreen from "../screens/TestScreen";

export default function AppNavigator() {
  const {
    isAuthenticated,
    user,
    onboardingComplete,
    setOnboardingComplete,
  } = useAuthStore();

  // For testing Firebase integration, uncomment the next line
  // return <TestScreen />;

  // Check if user has completed onboarding from their profile data
  useEffect(() => {
    console.log("🔄 AppNavigator useEffect triggered:", {
      isAuthenticated,
      userExists: !!user,
      userUid: user?.uid,
      userOnboardingComplete: user?.onboardingComplete,
      storeOnboardingComplete: onboardingComplete,
      timestamp: new Date().toISOString(),
    });

    if (isAuthenticated && user) {
      const userOnboardingComplete = user.onboardingComplete || false;
      console.log("📊 Onboarding status check:", {
        userOnboardingComplete,
        storeOnboardingComplete: onboardingComplete,
        needsUpdate: userOnboardingComplete !== onboardingComplete,
        timestamp: new Date().toISOString(),
      });

      if (userOnboardingComplete !== onboardingComplete) {
        console.log("🔄 Updating store onboarding status:", {
          from: onboardingComplete,
          to: userOnboardingComplete,
          timestamp: new Date().toISOString(),
        });
        setOnboardingComplete(userOnboardingComplete);
      }
    }
  }, [isAuthenticated, user, onboardingComplete, setOnboardingComplete]);

  console.log("🧭 AppNavigator render:", {
    isAuthenticated,
    userExists: !!user,
    userUid: user?.uid,
    userOnboardingComplete: user?.onboardingComplete,
    storeOnboardingComplete: onboardingComplete,
    timestamp: new Date().toISOString(),
  });

  if (!isAuthenticated) {
    console.log("➡️ Not authenticated, showing OnboardingStack");
    return <OnboardingStack />;
  }

  // Check both the store state and user profile data
  const userOnboardingComplete =
    user?.onboardingComplete || onboardingComplete;

  console.log("🎯 Final onboarding check:", {
    userOnboardingComplete,
    userProfileValue: user?.onboardingComplete,
    storeValue: onboardingComplete,
    willShowOnboarding: !userOnboardingComplete,
    timestamp: new Date().toISOString(),
  });

  if (!userOnboardingComplete) {
    console.log("➡️ Onboarding not complete, showing OnboardingStack");
    return <OnboardingStack />;
  }

  console.log("➡️ Onboarding complete, showing MainTabs");
  return <MainTabs />;
}
