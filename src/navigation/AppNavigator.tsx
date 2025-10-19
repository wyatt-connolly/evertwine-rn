import React, { useEffect } from "react";
import { Linking, View, StyleSheet } from "react-native";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import { SupabaseAuthService } from "../services/supabase";
import { SupabaseDataService } from "../services/SupabaseDataService";
import LoadingIndicator from "../components/LoadingIndicator";
import { useThemeStore } from "../hooks/useThemeStore";

export default function AppNavigator() {
  const { colors } = useThemeStore();
  const {
    isAuthenticated,
    user,
    onboardingComplete,
    hasSeenIntro,
    isHydrated: authHydrated,
    setOnboardingComplete,
    setUser,
    setAuthenticated,
    setLoading,
    resetOnboardingState,
  } = useAuthStore();

  // Get the store's get function to access current state
  const get = useAuthStore.getState;

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
        // Check if this is a new user (different from current user)
        const currentUser = get().user;
        const isNewUser = !currentUser || currentUser.uid !== supabaseUser.uid;

        console.log("👤 User comparison:", {
          currentUserUID: currentUser?.uid,
          newUserUID: supabaseUser.uid,
          isNewUser,
        });

        if (isNewUser) {
          console.log("🆕 New user detected, resetting onboarding state");
          resetOnboardingState();
        }

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

            // Don't reset hasSeenIntro - it should persist across app sessions
            // hasSeenIntro is only for the cinematic intro on first app install
          } else {
            // User exists in auth but not in database yet
            console.log("👤 User in auth but not in database yet");
            // Try to create the user in the database
            try {
              const createdUser = await SupabaseAuthService.ensureUserExists(
                supabaseUser
              );
              if (createdUser) {
                console.log("✅ User created and set in auth store");
                setUser(createdUser as any);
                setAuthenticated(true);
                setOnboardingComplete(createdUser.onboardingComplete || false);

                // Don't reset hasSeenIntro for new users either
                // hasSeenIntro is only for the cinematic intro on first app install
              } else {
                setUser(supabaseUser);
                setAuthenticated(true);
                setOnboardingComplete(supabaseUser.onboardingComplete || false);
              }
            } catch (error) {
              console.error("Error creating user:", error);
              setUser(supabaseUser);
              setAuthenticated(true);
              setOnboardingComplete(supabaseUser.onboardingComplete || false);
            }
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

  // Handle OAuth deep links
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      console.log("🔗 Deep link received:", url);

      // Supabase handles OAuth callbacks automatically
      // The auth state change listener above will handle the result
    };

    // Listen for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("🔗 Initial deep link:", url);
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  // Check if user has completed onboarding from their profile data
  useEffect(() => {
    if (isAuthenticated && user) {
      const userOnboardingComplete = user.onboardingComplete ?? false;

      // Only update store if user profile shows onboarding is complete and store shows incomplete
      // This prevents overriding a local completion with stale database data
      if (userOnboardingComplete && !onboardingComplete) {
        console.log(
          "🔄 Syncing onboarding completion from user profile to store"
        );
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
    authHydrated,
    userOnboardingComplete,
    userOnboardingStatus: user?.onboardingComplete,
    storeOnboardingStatus: onboardingComplete,
    willShowOnboarding: !userOnboardingComplete,
    userUID: user?.uid,
    currentRoute: !userOnboardingComplete ? "OnboardingStack" : "MainTabs",
    showingLoadingScreen: !authHydrated,
  });

  // Show loading screen while auth store is hydrating to prevent flash
  if (!authHydrated) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <LoadingIndicator size="large" text="Loading..." />
      </View>
    );
  }

  // Show onboarding only if onboarding is not complete
  if (!userOnboardingComplete) {
    return <OnboardingStack key="onboarding" hasSeenIntro={hasSeenIntro} />;
  }

  return <MainTabs />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
