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
      console.log("🔥 Firebase auth state changed:", {
        firebaseUserExists: !!firebaseUser,
        firebaseUserUid: firebaseUser?.uid,
        timestamp: new Date().toISOString(),
      });

      if (firebaseUser) {
        // User is signed in, load their profile data from Firebase
        try {
          const profileResult = await DataService.getUser(firebaseUser.uid);

          if (profileResult.user) {
            console.log("✅ Loaded user profile from Firebase:", {
              uid: profileResult.user.uid,
              onboardingComplete: profileResult.user.onboardingComplete,
              displayName: profileResult.user.displayName,
              rawOnboardingComplete: profileResult.user.onboardingComplete,
              typeOfOnboardingComplete:
                typeof profileResult.user.onboardingComplete,
              timestamp: new Date().toISOString(),
            });

            // Update auth store with fresh Firebase data
            setUser(profileResult.user);
            setAuthenticated(true);
            setOnboardingComplete(
              profileResult.user.onboardingComplete || false
            );
          } else {
            console.log("❌ Failed to load user profile:", profileResult.error);
            // User exists in Firebase Auth but not in Firestore
            // This shouldn't happen in normal flow, but handle gracefully
            setAuthenticated(false);
            setUser(null);
            setOnboardingComplete(false);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setAuthenticated(false);
          setUser(null);
          setOnboardingComplete(false);
        }
      } else {
        // User is signed out
        console.log("👤 User signed out");
        setAuthenticated(false);
        setUser(null);
        setOnboardingComplete(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setAuthenticated, setOnboardingComplete]);

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

      // Only update if the user profile has a different onboarding status
      // AND if the store value is false (to avoid overriding completed onboarding)
      if (
        userOnboardingComplete !== onboardingComplete &&
        !onboardingComplete
      ) {
        console.log("🔄 Updating store onboarding status:", {
          from: onboardingComplete,
          to: userOnboardingComplete,
          timestamp: new Date().toISOString(),
        });
        setOnboardingComplete(userOnboardingComplete);
      } else if (onboardingComplete && !userOnboardingComplete) {
        console.log(
          "⚠️ Store shows onboarding complete but user profile doesn't - keeping store value"
        );
      }
    }
  }, [isAuthenticated, user, onboardingComplete, setOnboardingComplete]);

  console.log("🧭 AppNavigator render:", {
    isAuthenticated,
    userExists: !!user,
    userUid: user?.uid,
    userOnboardingComplete: user?.onboardingComplete,
    storeOnboardingComplete: onboardingComplete,
    userDisplayName: user?.displayName,
    userPhoneNumber: user?.phoneNumber,
    timestamp: new Date().toISOString(),
  });

  if (!isAuthenticated) {
    console.log("➡️ Not authenticated, showing OnboardingStack");
    return <OnboardingStack />;
  }

  // Check both the store state and user profile data
  const userOnboardingComplete = user?.onboardingComplete || onboardingComplete;

  console.log("🎯 Final onboarding check:", {
    userOnboardingComplete,
    userProfileValue: user?.onboardingComplete,
    storeValue: onboardingComplete,
    willShowOnboarding: !userOnboardingComplete,
    userDisplayName: user?.displayName,
    userUid: user?.uid,
    userProfileType: typeof user?.onboardingComplete,
    storeType: typeof onboardingComplete,
    timestamp: new Date().toISOString(),
  });

  if (!userOnboardingComplete) {
    console.log("➡️ Onboarding not complete, showing OnboardingStack");
    console.log("📊 Onboarding decision details:", {
      userProfileOnboarding: user?.onboardingComplete,
      storeOnboarding: onboardingComplete,
      finalDecision: userOnboardingComplete,
      reason: !user?.onboardingComplete
        ? "User profile shows incomplete"
        : "Store shows incomplete",
    });
    return <OnboardingStack />;
  }

  console.log("➡️ Onboarding complete, showing MainTabs");
  console.log("🎉 User successfully authenticated and onboarded!");
  return <MainTabs />;
}
