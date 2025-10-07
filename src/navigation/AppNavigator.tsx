import React, { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import TestScreen from "../screens/TestScreen";
import { onAuthStateChanged } from "../services/supabase";
import { DataService } from "../services/DataService";

export default function AppNavigator() {
  const {
    isAuthenticated,
    user,
    onboardingComplete,
    setOnboardingComplete,
    setUser,
    setAuthenticated,
  } = useAuthStore();

  // For testing Firebase integration, uncomment the next line
  // return <TestScreen />;

  // Supabase auth state listener - loads user data on app startup
  useEffect(() => {
    const {
      data: { subscription },
    } = onAuthStateChanged(async (supabaseUser) => {
      if (supabaseUser) {
        // User is signed in, load their profile data from Supabase
        try {
          const profileResult = await DataService.getUser(supabaseUser.uid);

          if (profileResult.user) {
            // Update auth store with fresh Supabase data
            setUser(profileResult.user);
            setAuthenticated(true);
            setOnboardingComplete(
              profileResult.user.onboardingComplete || false
            );
          } else {
            // User exists in Supabase Auth but not in database
            // This shouldn't happen in normal flow, but handle gracefully
            setAuthenticated(false);
            setUser(null);
            setOnboardingComplete(false);
          }
        } catch (error) {
          setAuthenticated(false);
          setUser(null);
          setOnboardingComplete(false);
        }
      } else {
        // User is signed out
        setAuthenticated(false);
        setUser(null);
        setOnboardingComplete(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, setAuthenticated, setOnboardingComplete]);

  // Check if user has completed onboarding from their profile data
  useEffect(() => {
    if (isAuthenticated && user) {
      const userOnboardingComplete = user.onboardingComplete ?? false;

      // Update store to match user profile data
      if (userOnboardingComplete !== onboardingComplete) {
        setOnboardingComplete(userOnboardingComplete);
      }
    }
  }, [isAuthenticated, user, onboardingComplete, setOnboardingComplete]);

  if (!isAuthenticated) {
    return <OnboardingStack />;
  }

  // Prioritize user profile data over store state
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
