import React, { useEffect } from "react";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import { SupabaseAuthService } from "../services/supabase";
import { SupabaseDataService } from "../services/SupabaseDataService";

export default function AppNavigator() {
  const {
    isAuthenticated,
    user,
    onboardingComplete,
    hasSeenIntro,
    isHydrated,
    setOnboardingComplete,
    setUser,
    setAuthenticated,
    setLoading,
  } = useAuthStore();

  // Supabase auth state listener - loads user data on app startup
  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      setLoading(true);
      try {
        const currentUser = await SupabaseAuthService.getCurrentUser();
        if (currentUser) {
          // Load full user profile from database
          const fullProfile = await SupabaseDataService.getUser(
            currentUser.uid
          );
          if (fullProfile) {
            setUser(fullProfile as any);
            setAuthenticated(true);
            setOnboardingComplete(fullProfile.onboardingComplete || false);
          } else {
            // User exists in auth but not in database
            setUser(currentUser);
            setAuthenticated(true);
            setOnboardingComplete(currentUser.onboardingComplete || false);
          }
        } else {
          setAuthenticated(false);
          setUser(null);
          setOnboardingComplete(false);
        }
      } catch (error) {
        console.error("Error checking session:", error);
        setAuthenticated(false);
        setUser(null);
        setOnboardingComplete(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = SupabaseAuthService.onAuthStateChange(async (supabaseUser) => {
      console.log("🔄 Auth state changed:", { supabaseUser: !!supabaseUser });

      if (supabaseUser) {
        // User is signed in, load their profile data from database
        try {
          const fullProfile = await SupabaseDataService.getUser(
            supabaseUser.uid
          );
          if (fullProfile) {
            console.log("👤 Loaded full profile:", {
              onboardingComplete: fullProfile.onboardingComplete,
            });
            setUser(fullProfile as any);
            setAuthenticated(true);
            setOnboardingComplete(fullProfile.onboardingComplete || false);
          } else {
            // User exists in auth but not in database yet
            console.log("👤 User in auth but not in database yet");
            setUser(supabaseUser);
            setAuthenticated(true);
            setOnboardingComplete(supabaseUser.onboardingComplete || false);
          }
        } catch (error) {
          console.error("Error loading user profile:", error);
          setUser(supabaseUser);
          setAuthenticated(true);
          setOnboardingComplete(supabaseUser.onboardingComplete || false);
        }
      } else {
        // User is signed out
        console.log("👤 User signed out");
        setAuthenticated(false);
        setUser(null);
        setOnboardingComplete(false);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [setUser, setAuthenticated, setOnboardingComplete, setLoading]);

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

  // Prioritize user profile data over store state
  const userOnboardingComplete =
    user?.onboardingComplete !== undefined
      ? user.onboardingComplete
      : onboardingComplete;

  console.log("🧭 AppNavigator Routing:", {
    isAuthenticated,
    hasSeenIntro,
    isHydrated,
    userOnboardingComplete,
    userOnboardingStatus: user?.onboardingComplete,
    storeOnboardingStatus: onboardingComplete,
    willShowOnboarding: !userOnboardingComplete,
  });

  // Show loading screen while store is hydrating to prevent flash
  if (!isHydrated) {
    return null; // or a loading component
  }

  // Show onboarding only if onboarding is not complete (ignore authentication for now)
  if (!userOnboardingComplete) {
    return <OnboardingStack key="onboarding" hasSeenIntro={hasSeenIntro} />;
  }

  return <MainTabs />;
}
