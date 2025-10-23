import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import AnimatedTabIcon from "../components/AnimatedTabIcon";
import CustomTabBar from "../components/CustomTabBar";
import HomeScreen from "../screens/main/HomeScreen";
// import AnimatedAvatarScreen from "../screens/main/AnimatedAvatarScreen";
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
import HappyHourDetailsScreen from "../screens/main/HappyHourDetailsScreen";
import PlaceDetailsScreen from "../screens/main/PlaceDetailsScreen";
import PostDetailsScreen from "../screens/main/PostDetailsScreen";
import CreatePostScreen from "../screens/main/CreatePostScreen";
import NotificationsScreen from "../screens/main/NotificationsScreen";
import AllHappyHourEventsScreen from "../screens/main/AllHappyHourEventsScreen";
import AllMeetupsScreen from "../screens/main/AllMeetupsScreen";
import FollowingScreen from "../screens/main/FollowingScreen";
import PrivacySecurityScreen from "../screens/main/PrivacySecurityScreen";
import HelpSupportScreen from "../screens/main/HelpSupportScreen";
import CommunityScreen from "../screens/main/CommunityScreen";

export type MainTabParamList = {
  Home: undefined;
  Community: undefined;
  Messages: undefined;
  Settings: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: { userId?: string; userData?: any } | undefined;
  EditProfile: undefined;
  SettingsMain: undefined;
  PreferenceSetup: undefined;
  ActivityFeed: undefined;
  Notifications: undefined;
  PrivacySecurity: undefined;
  HelpSupport: undefined;
  MessageDetails: { roomId: string };
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
  HappyHourDetails: { eventId: string; event?: any };
  PlaceDetails: { placeId: string; place?: any };
  PostDetails: { post: any };
  Favorites: undefined;
  Following: undefined;
  GroupDetails: { groupId: string; groupData?: any };
  UserProfile: { userId: string; userData?: any };
  AllHappyHourEvents: undefined;
  AllMeetups: undefined;
  CreateMeetupStep1: { formData?: any; onUpdate: (data: any) => void };
  CreateMeetupStep2: { formData: any; onUpdate: (data: any) => void };
  CreateMeetupStep4: { formData: any; onUpdate: (data: any) => void };
  CreateMeetupConfirmation: { formData: any; onUpdate: (data: any) => void };
  CreatePost: undefined;
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
      <ProfileStack.Screen name="SettingsMain" component={SettingsScreen} />
      <ProfileStack.Screen
        name="PreferenceSetup"
        component={PreferenceSetupScreen}
      />
      <ProfileStack.Screen name="ActivityFeed" component={ActivityFeedScreen} />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
      />
      <ProfileStack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
      />
      <ProfileStack.Screen name="HelpSupport" component={HelpSupportScreen} />
      <ProfileStack.Screen
        name="MessageDetails"
        component={MessageDetailsScreen}
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
      <CommunityStack.Screen name="CommunityMain" component={CommunityScreen} />
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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "Messages") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          return (
            <AnimatedTabIcon
              name={iconName}
              focused={focused}
              size={size}
              color={color}
              activeColor={colors.primary}
              inactiveColor={colors.textTertiary}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textTertiary,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Community" component={CommunityStackNavigator} />
      <Tab.Screen name="Messages" component={MessagesStackNavigator} />
      <Tab.Screen name="Settings" component={ProfileStackNavigator} />
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
      <MainStack.Screen
        name="HappyHourDetails"
        component={HappyHourDetailsScreen}
      />
      <MainStack.Screen name="PlaceDetails" component={PlaceDetailsScreen} />
      <MainStack.Screen name="PostDetails" component={PostDetailsScreen} />
      <MainStack.Screen name="Favorites" component={FavoritesScreen} />
      <MainStack.Screen name="Following" component={FollowingScreen} />
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
      <MainStack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{
          presentation: "modal",
          gestureEnabled: true,
        }}
      />
    </MainStack.Navigator>
  );
}
