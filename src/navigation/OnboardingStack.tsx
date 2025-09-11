import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AuthHomeScreen from "../screens/auth/AuthHomeScreen";
import PhoneVerificationScreen from "../screens/onboarding/PhoneVerificationScreen";
import ProfileSetupScreen from "../screens/onboarding/ProfileSetupScreen";
import InterestSelectionScreen from "../screens/onboarding/InterestSelectionScreen";
import LocationPermissionScreen from "../screens/onboarding/LocationPermissionScreen";
import OnboardingCompleteScreen from "../screens/onboarding/OnboardingCompleteScreen";
import PreferenceSetupScreen from "../screens/preferences/PreferenceSetupScreen";

export type OnboardingStackParamList = {
  AuthHome: undefined;
  PhoneVerification: undefined;
  ProfileSetup: undefined;
  InterestSelection: undefined;
  LocationPermission: undefined;
  OnboardingComplete: undefined;
  PreferenceSetup: undefined;
};

const Stack = createStackNavigator<OnboardingStackParamList>();

export default function OnboardingStack() {
  return (
    <Stack.Navigator
      initialRouteName="AuthHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AuthHome" component={AuthHomeScreen} />
      <Stack.Screen
        name="PhoneVerification"
        component={PhoneVerificationScreen}
      />
      <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
      <Stack.Screen
        name="InterestSelection"
        component={InterestSelectionScreen}
      />
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
