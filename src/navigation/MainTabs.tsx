import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import HomeScreen from "../screens/main/HomeScreen";
import AnimatedAvatarScreen from "../screens/main/AnimatedAvatarScreen";
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
import CreateMeetupStep1Screen from "../screens/main/CreateMeetupStep1Screen";
import CreateMeetupStep2Screen from "../screens/main/CreateMeetupStep2Screen";
import CreateMeetupStep4Screen from "../screens/main/CreateMeetupStep4Screen";
import CreateMeetupConfirmationScreen from "../screens/main/CreateMeetupConfirmationScreen";
import EditMeetupScreen from "../screens/main/EditMeetupScreen";
import GroupDetailsScreen from "../screens/main/GroupDetailsScreen";
import UserProfileScreen from "../screens/main/UserProfileScreen";
import EventDetailsScreen from "../screens/main/EventDetailsScreen";
import PlaceDetailsScreen from "../screens/main/PlaceDetailsScreen";
import PostDetailsScreen from "../screens/main/PostDetailsScreen";
import NotificationsScreen from "../screens/main/NotificationsScreen";
import AllHappyHourEventsScreen from "../screens/main/AllHappyHourEventsScreen";
import AllMeetupsScreen from "../screens/main/AllMeetupsScreen";

export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
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
  Notifications: undefined;
  Map: undefined;
};

export type CommunityStackParamList = {
  CommunityMain: undefined;
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
  PostDetails: { post: any };
  Favorites: undefined;
  GroupDetails: { groupId: string; groupData?: any };
  UserProfile: { userId: string; userData?: any };
  AllHappyHourEvents: undefined;
  AllMeetups: undefined;
  CreateMeetupStep1: { formData?: any; onUpdate: (data: any) => void };
  CreateMeetupStep2: { formData: any; onUpdate: (data: any) => void };
  CreateMeetupStep4: { formData: any; onUpdate: (data: any) => void };
  CreateMeetupConfirmation: { formData: any; onUpdate: (data: any) => void };
};

const Tab = createBottomTabNavigator<MainTabParamList>();
const ProfileStack = createStackNavigator<ProfileStackParamList>();
const HomeStack = createStackNavigator<HomeStackParamList>();
const CommunityStack = createStackNavigator<CommunityStackParamList>();
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
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
      <HomeStack.Screen name="Map" component={MapScreen} />
    </HomeStack.Navigator>
  );
}

function CommunityStackNavigator() {
  return (
    <CommunityStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <CommunityStack.Screen
        name="CommunityMain"
        component={AnimatedAvatarScreen}
      />
      <CommunityStack.Screen name="Map" component={MapScreen} />
    </CommunityStack.Navigator>
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
          } else if (route.name === "Community") {
            iconName = focused ? "people" : "people-outline";
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
        tabBarStyle: {
          position: "absolute",
          bottom: 20,
          backgroundColor: colors.surface,
          borderRadius: 30,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          paddingHorizontal: 16,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: "rgba(255, 255, 255, 0.1)",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 16,
          marginHorizontal: 40,
        },
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
                  position: "absolute",
                  bottom: 20,
                  backgroundColor: colors.surface,
                  borderRadius: 30,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                  paddingHorizontal: 16,
                  borderTopWidth: 0,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 16,
                  marginHorizontal: 40,
                }
              : { display: "none" },
          };
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityStackNavigator}
        options={({ route }) => {
          const routeName =
            getFocusedRouteNameFromRoute(route) ?? "CommunityMain";
          const shouldShowTabBar = ["CommunityMain"].includes(routeName);
          return {
            tabBarStyle: shouldShowTabBar
              ? {
                  position: "absolute",
                  bottom: 20,
                  backgroundColor: colors.surface,
                  borderRadius: 30,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                  paddingHorizontal: 16,
                  borderTopWidth: 0,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 16,
                  marginHorizontal: 40,
                }
              : { display: "none" },
          };
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
                  position: "absolute",
                  bottom: 20,
                  backgroundColor: colors.surface,
                  borderRadius: 30,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                  paddingHorizontal: 16,
                  borderTopWidth: 0,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 16,
                  marginHorizontal: 40,
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
                  position: "absolute",
                  bottom: 20,
                  backgroundColor: colors.surface,
                  borderRadius: 30,
                  height: 60,
                  paddingBottom: 8,
                  paddingTop: 8,
                  paddingHorizontal: 16,
                  borderTopWidth: 0,
                  borderWidth: 1,
                  borderColor: "rgba(255, 255, 255, 0.1)",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 16,
                  marginHorizontal: 40,
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
      <MainStack.Screen name="PostDetails" component={PostDetailsScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
      <MainStack.Screen name="GroupDetails" component={GroupDetailsScreen} />
      <MainStack.Screen name="UserProfile" component={UserProfileScreen} />
      <MainStack.Screen
        name="AllHappyHourEvents"
        component={AllHappyHourEventsScreen}
      />
      <MainStack.Screen name="AllMeetups" component={AllMeetupsScreen} />
      <MainStack.Screen
        name="CreateMeetupStep1"
        component={CreateMeetupStep1Screen}
      />
      <MainStack.Screen
        name="CreateMeetupStep2"
        component={CreateMeetupStep2Screen}
      />
      <MainStack.Screen
        name="CreateMeetupStep4"
        component={CreateMeetupStep4Screen}
      />
      <MainStack.Screen
        name="CreateMeetupConfirmation"
        component={CreateMeetupConfirmationScreen}
      />
    </MainStack.Navigator>
  );
}
