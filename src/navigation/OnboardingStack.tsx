import { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CinematicIntroScreen from "../screens/CinematicIntroScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import AuthSignInScreen from "../screens/auth/AuthSignInScreen";
import NameInputScreen from "../screens/onboarding/NameInputScreen";
import AgeSelectionScreen from "../screens/onboarding/AgeSelectionScreen";
import GenderSelectionScreen from "../screens/onboarding/GenderSelectionScreen";
import GoalsSelectionScreen from "../screens/onboarding/GoalsSelectionScreen";
import ObstaclesScreen from "../screens/onboarding/ObstaclesScreen";
import RoutineSetupScreen from "../screens/onboarding/RoutineSetupScreen";
import FeatureIntroScreen from "../screens/onboarding/FeatureIntroScreen";
import CommitmentScreen from "../screens/onboarding/CommitmentScreen";
import BuildingProfileScreen from "../screens/onboarding/BuildingProfileScreen";
import { useAuthStore } from "../hooks/useAuthStore";
// Removed old onboarding screens - now navigating directly to Home

export type OnboardingStackParamList = {
  CinematicIntro: undefined;
  Welcome: undefined;
  AuthSignIn: undefined;
  NameInput: undefined;
  AgeSelection: undefined;
  GenderSelection: undefined;
  GoalsSelection: undefined;
  ObstaclesSelection: undefined;
  RoutineSetup: undefined;
  FeatureIntro: undefined;
  Commitment: undefined;
  BuildingProfile: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

interface OnboardingStackProps {
  hasSeenIntro: boolean;
}

export default function OnboardingStack({
  hasSeenIntro,
}: OnboardingStackProps) {
  const { isAuthenticated, getCurrentOnboardingStep } = useAuthStore();

  // Determine the initial route based on authentication and progress
  const getInitialRoute = (): keyof OnboardingStackParamList => {
    if (!hasSeenIntro) {
      return "CinematicIntro";
    }

    if (!isAuthenticated) {
      return "Welcome";
    }

    // User is authenticated, resume from where they left off
    const currentStep = getCurrentOnboardingStep();

    return currentStep as keyof OnboardingStackParamList;
  };

  useEffect(() => {
    console.log(
      "🎯 [OnboardingStack] hasSeenIntro:",
      hasSeenIntro,
      "type:",
      typeof hasSeenIntro
    );
    console.log(
      "🎯 [OnboardingStack] isAuthenticated:",
      isAuthenticated,
      "type:",
      typeof isAuthenticated
    );
  }, [hasSeenIntro, isAuthenticated]);

  const initialRoute = getInitialRoute();
  console.log("🎯 [OnboardingStack] Initial route:", initialRoute);

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Disable swipe back gestures
      }}
    >
      <Stack.Screen name="CinematicIntro" component={CinematicIntroScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="AuthSignIn" component={AuthSignInScreen} />
      <Stack.Screen name="NameInput" component={NameInputScreen} />
      <Stack.Screen name="AgeSelection" component={AgeSelectionScreen} />
      <Stack.Screen name="GenderSelection" component={GenderSelectionScreen} />
      <Stack.Screen name="GoalsSelection" component={GoalsSelectionScreen} />
      <Stack.Screen name="ObstaclesSelection" component={ObstaclesScreen} />
      <Stack.Screen name="RoutineSetup" component={RoutineSetupScreen} />
      <Stack.Screen name="FeatureIntro" component={FeatureIntroScreen} />
      <Stack.Screen name="Commitment" component={CommitmentScreen} />
      <Stack.Screen name="BuildingProfile" component={BuildingProfileScreen} />
    </Stack.Navigator>
  );
}
