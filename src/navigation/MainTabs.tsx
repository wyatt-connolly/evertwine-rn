import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import HomeScreen from "../screens/main/HomeScreen";
import StandoutsScreen from "../screens/main/StandoutsScreen";
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
import CreateMeetupScreen from "../screens/main/CreateMeetupScreen";
import EditMeetupScreen from "../screens/main/EditMeetupScreen";
import GroupDetailsScreen from "../screens/main/GroupDetailsScreen";
import UserProfileScreen from "../screens/main/UserProfileScreen";
import EventDetailsScreen from "../screens/main/EventDetailsScreen";
import PlaceDetailsScreen from "../screens/main/PlaceDetailsScreen";

export type MainTabParamList = {
  Home: undefined;
  Standouts: undefined;
  Create: undefined;
  Messages: undefined;
  Profile: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: { userId?: string; userData?: any } | undefined;
  EditProfile: undefined;
  Settings: undefined;
  PreferenceSetup: undefined;
  ActivityFeed: undefined;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ActivityFeed: undefined;
};

export type StandoutsStackParamList = {
  StandoutsMain: undefined;
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
  EditMeetup: { meetupId: string };
  EventDetails: { eventId: string; event?: any };
  PlaceDetails: { placeId: string; place?: any };
  Favorites: undefined;
  GroupDetails: { groupId: string; groupData?: any };
  UserProfile: { userId: string; userData?: any };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const StandoutsStack = createStackNavigator<StandoutsStackParamList>();
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
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen
        name="PreferenceSetup"
        component={PreferenceSetupScreen}
      />
      <ProfileStack.Screen name="ActivityFeed" component={ActivityFeedScreen} />
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

function StandoutsStackNavigator() {
  return (
    <StandoutsStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <StandoutsStack.Screen name="StandoutsMain" component={StandoutsScreen} />
      <StandoutsStack.Screen name="Map" component={MapScreen} />
    </StandoutsStack.Navigator>
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
          } else if (route.name === "Standouts") {
            iconName = focused ? "star" : "star-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
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
        headerShown: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={({ route }) => {
          const routeName = getFocusedRouteNameFromRoute(route) ?? "HomeMain";
          const shouldShowTabBar = ["HomeMain"].includes(routeName);
          return {
            tabBarStyle: shouldShowTabBar
              ? {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                }
              : { display: "none" },
          };
        }}
      />
      <Tab.Screen
        name="Standouts"
        component={StandoutsStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "StandoutsMain";
          const shouldShowTabBar = ["StandoutsMain"].includes(routeName);
          return {
            tabBarStyle: shouldShowTabBar
              ? {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                }
              : { display: "none" },
          };
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateMeetupScreen}
        options={{
          title: "Create",
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "MessagesMain";
          const shouldShowTabBar = ["MessagesMain"].includes(routeName);
          return {
            tabBarStyle: shouldShowTabBar
              ? {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                }
              : { display: "none" },
          };
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "ProfileMain";
          const shouldShowTabBar = ["ProfileMain"].includes(routeName);
          return {
            tabBarStyle: shouldShowTabBar
              ? {
                  backgroundColor: colors.surface,
                  borderTopColor: colors.border,
                }
              : { display: "none" },
          };
        }}
      />
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
      <MainStack.Screen name="EditMeetup" component={EditMeetupScreen} />
      <MainStack.Screen name="EventDetails" component={EventDetailsScreen} />
      <MainStack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
      <MainStack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <MainStack.Screen name="UserProfile" component={UserProfileScreen} />
    </MainStack.Navigator>
  );
}
