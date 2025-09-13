import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import HomeScreen from "../screens/main/HomeScreen";
import ExploreScreen from "../screens/main/ExploreScreen";
import MessagesScreen from "../screens/main/MessagesScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import EditProfileScreen from "../screens/main/EditProfileScreen";
import SettingsScreen from "../screens/main/SettingsScreen";
import PreferenceSetupScreen from "../screens/preferences/PreferenceSetupScreen";
import MeetupDetailsScreen from "../screens/main/MeetupDetailsScreen";
import ActivityFeedScreen from "../screens/main/ActivityFeedScreen";
import MapScreen from "../screens/main/MapScreen";
import MessageDetailsScreen from "../screens/main/MessageDetailsScreen";
import ComposeMessageScreen from "../screens/main/ComposeMessageScreen";
import FavoritesScreen from "../screens/main/FavoritesScreen";

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  EditProfile: undefined;
  Settings: undefined;
  PreferenceSetup: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ActivityFeed: undefined;
};

export type ExploreStackParamList = {
  ExploreMain: undefined;
  Map: undefined;
};

export type MessagesStackParamList = {
  MessagesMain: undefined;
  MessageDetails: { roomId: string };
  ComposeMessage: undefined;
};

export type MainStackParamList = {
  MainTabs: undefined;
  MeetupDetails: { meetupId: string };
  Favorites: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const ExploreStack = createStackNavigator<ExploreStackParamList>();
const MessagesStack = createStackNavigator<MessagesStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();

function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen
        name="PreferenceSetup"
        component={PreferenceSetupScreen}
      />
    </ProfileStack.Navigator>
  );
}

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="ActivityFeed" component={ActivityFeedScreen} />
    </HomeStack.Navigator>
  );
}

function ExploreStackNavigator() {
  return (
    <ExploreStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <ExploreStack.Screen name="ExploreMain" component={ExploreScreen} />
      <ExploreStack.Screen name="Map" component={MapScreen} />
    </ExploreStack.Navigator>
  );
}

function MessagesStackNavigator() {
  return (
    <MessagesStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MessagesStack.Screen name="MessagesMain" component={MessagesScreen} />
      <MessagesStack.Screen
        name="MessageDetails"
        component={MessageDetailsScreen}
      />
      <MessagesStack.Screen
        name="ComposeMessage"
        component={ComposeMessageScreen}
      />
    </MessagesStack.Navigator>
  );
}

function MainTabsNavigator() {
  const { colors } = useThemeStore();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Explore") {
            iconName = focused ? "compass" : "compass-outline";
          } else if (route.name === "Messages") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Explore" component={ExploreStackNavigator} />
      <Tab.Screen name="Messages" component={MessagesStackNavigator} />
      <Tab.Screen name="Profile" component={ProfileStackNavigator} />
    </Tab.Navigator>
  );
}

export default function MainTabs() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabsNavigator} />
      <MainStack.Screen name="MeetupDetails" component={MeetupDetailsScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
    </MainStack.Navigator>
  );
}
