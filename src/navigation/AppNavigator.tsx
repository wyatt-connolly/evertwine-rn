import { useEffect } from "react";
import { Linking, View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuthStore } from "../hooks/useAuthStore";
import OnboardingStack from "./OnboardingStack";
import MainTabs from "./MainTabs";
import MessageDetailsScreen from "../screens/main/MessageDetailsScreen";
import { SupabaseAuthService } from "../services/supabase";
import { SupabaseDataService } from "../services/SupabaseDataService";
import LoadingIndicator from "../components/LoadingIndicator";
import { useThemeStore } from "../hooks/useThemeStore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type RootStackParamList = {
  MainApp: undefined;
  MessageDetails: { roomId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

// Helper to safely convert Supabase booleans (which can be strings)
const toBoolean = (value: any): boolean => {
  if (typeof value === "string") {
    return value === "true" || value === "t" || value === "1";
  }
  return Boolean(value);
};

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
      // ONE-TIME CACHE CLEAR: Force clear corrupted AsyncStorage on first load
      try {
        const cacheVersion = await AsyncStorage.getItem("cache-version-v2");
        console.log("📦 [AppNavigator] Cache version check:", cacheVersion);
        if (!cacheVersion) {
          console.log("🗑️ [AppNavigator] CLEARING ALL CORRUPTED CACHE NOW!");
          await AsyncStorage.removeItem("auth-storage");
          await AsyncStorage.removeItem("featured_members");
          await AsyncStorage.setItem("cache-version-v2", "cleared");
          console.log("✅ [AppNavigator] Cache cleared!");
        }
      } catch (e) {
        console.error("❌ [AppNavigator] Cache clear error:", e);
      }

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
        console.error("❌ [AppNavigator] Error in checkSession:", error);
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
      if (supabaseUser) {
        // Check if this is a new user (different from current user)
        const currentUser = get().user;
        const isNewUser = !currentUser || currentUser.uid !== supabaseUser.uid;

        if (isNewUser) {
          resetOnboardingState();
        }

        // User is signed in, load their profile data from database
        try {
          const fullProfile = await SupabaseDataService.getUser(
            supabaseUser.uid
          );
          if (fullProfile) {
            setUser(fullProfile as any);
            setAuthenticated(true);
            setOnboardingComplete(fullProfile.onboardingComplete || false);

            // Don't reset hasSeenIntro - it should persist across app sessions
            // hasSeenIntro is only for the cinematic intro on first app install
          } else {
            // User exists in auth but not in database yet

            // Try to create the user in the database
            try {
              const createdUser = await SupabaseAuthService.ensureUserExists(
                supabaseUser
              );
              if (createdUser) {
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
              setUser(supabaseUser);
              setAuthenticated(true);
              setOnboardingComplete(supabaseUser.onboardingComplete || false);
            }
          }
        } catch (error) {
          setUser(supabaseUser);
          setAuthenticated(true);
          setOnboardingComplete(supabaseUser.onboardingComplete || false);
        }
      } else {
        // User is signed out

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
    const handleDeepLink = async (_event: { url: string }) => {
      // Supabase handles OAuth callbacks automatically
      // The auth state change listener above will handle the result
    };

    // Listen for deep links
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Check if app was opened with a deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
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
        setOnboardingComplete(userOnboardingComplete);
      }
    }
  }, [isAuthenticated, user, onboardingComplete, setOnboardingComplete]);

  // Prioritize user profile data over store state - SAFELY convert to boolean
  const userOnboardingComplete = toBoolean(
    user?.onboardingComplete !== undefined
      ? user.onboardingComplete
      : onboardingComplete
  );

  // Debug logging
  console.log(
    "🔍 [AppNavigator] user?.onboardingComplete:",
    user?.onboardingComplete,
    "type:",
    typeof user?.onboardingComplete
  );
  console.log(
    "🔍 [AppNavigator] onboardingComplete:",
    onboardingComplete,
    "type:",
    typeof onboardingComplete
  );
  console.log(
    "✅ [AppNavigator] userOnboardingComplete:",
    userOnboardingComplete,
    "type:",
    typeof userOnboardingComplete
  );

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
    console.log(
      "🎯 [AppNavigator] Rendering OnboardingStack, hasSeenIntro:",
      hasSeenIntro,
      "type:",
      typeof hasSeenIntro
    );
    const safeHasSeenIntro = toBoolean(hasSeenIntro);
    return <OnboardingStack key="onboarding" hasSeenIntro={safeHasSeenIntro} />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainApp" component={MainTabs} />
      <Stack.Screen
        name="MessageDetails"
        component={MessageDetailsScreen}
        options={{
          presentation: "modal",
          gestureEnabled: true,
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
