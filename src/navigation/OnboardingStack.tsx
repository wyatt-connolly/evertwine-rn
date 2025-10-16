import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import CinematicIntroScreen from "../screens/CinematicIntroScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import PhoneVerificationScreen from "../screens/onboarding/PhoneVerificationScreen";
import AgeVerificationScreen from "../screens/onboarding/AgeVerificationScreen";
import ProfileSetupScreen from "../screens/onboarding/ProfileSetupScreen";
import InterestSelectionScreen from "../screens/onboarding/InterestSelectionScreen";
import AppFeaturesScreen from "../screens/onboarding/AppFeaturesScreen";
import LocationPermissionScreen from "../screens/onboarding/LocationPermissionScreen";
import OnboardingCompleteScreen from "../screens/onboarding/OnboardingCompleteScreen";
import PreferenceSetupScreen from "../screens/preferences/PreferenceSetupScreen";
import { useAuthStore } from "../hooks/useAuthStore";

export type OnboardingStackParamList = {
  CinematicIntro: undefined;
  Welcome: undefined;
  PhoneVerification: undefined;
  AgeVerification: undefined;
  ProfileSetup: undefined;
  InterestSelection: undefined;
  AppFeatures: undefined;
  LocationPermission: undefined;
  OnboardingComplete: undefined;
  PreferenceSetup: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="CinematicIntro"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CinematicIntro" component={CinematicIntroScreen} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
      />
      <Stack.Screen name="AgeVerification" component={AgeVerificationScreen} />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen
        name="InterestSelection"
        component={InterestSelectionScreen}
      />
      <Stack.Screen name="AppFeatures" component={AppFeaturesScreen} />
      <Stack.Screen
        name="LocationPermission"
        component={LocationPermissionScreen}
      />
      <Stack.Screen
        name="OnboardingComplete"
        component={OnboardingCompleteScreen}
      />
      <Stack.Screen name="PreferenceSetup" component={PreferenceSetupScreen} />
    </Stack.Navigator>
  );
}
