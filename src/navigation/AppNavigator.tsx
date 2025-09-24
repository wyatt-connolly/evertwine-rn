import React, { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import TestScreen from "../screens/TestScreen";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase.config";
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

  // Firebase auth state listener - loads user data on app startup
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, load their profile data from Firebase
        try {
          const profileResult = await DataService.getUser(firebaseUser.uid);

          if (profileResult.user) {
            // Update auth store with fresh Firebase data
            setUser(profileResult.user);
            setAuthenticated(true);
            setOnboardingComplete(
              profileResult.user.onboardingComplete || false
            );
          } else {
            // User exists in Firebase Auth but not in Firestore
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

    return () => unsubscribe();
  }, [setUser, setAuthenticated, setOnboardingComplete]);

  // Check if user has completed onboarding from their profile data
  useEffect(() => {
    if (isAuthenticated && user) {
      const userOnboardingComplete = user.onboardingComplete || false;

      // Only update if the user profile has a different onboarding status
      // AND if the store value is false (to avoid overriding completed onboarding)
      if (
        userOnboardingComplete !== onboardingComplete &&
        !onboardingComplete
      ) {
        setOnboardingComplete(userOnboardingComplete);
      } else if (onboardingComplete && !userOnboardingComplete) {
      }
    }
  }, [isAuthenticated, user, onboardingComplete, setOnboardingComplete]);

  if (!isAuthenticated) {
    return <OnboardingStack />;
  }

  // Check both the store state and user profile data
  const userOnboardingComplete = user?.onboardingComplete || onboardingComplete;

  if (!userOnboardingComplete) {
    return <OnboardingStack />;
  }

  return <MainTabs />;
}
