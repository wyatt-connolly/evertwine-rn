import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import AnimatedCheckmark from "../../components/AnimatedCheckmark";
import GradientBackground from "../../components/GradientBackground";

type BuildingProfileScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "BuildingProfile"
>;

interface Props {
  navigation: BuildingProfileScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const tasks = [
  "Analyzing your preferences",
  "Finding nearby meetups",
  "Personalizing your feed",
];

export default function BuildingProfileScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { user, onboardingData, setOnboardingComplete, clearOnboardingData } =
    useAuthStore();
  const [currentProgress, setCurrentProgress] = useState(0);

  // Save all onboarding data to database
  const saveOnboardingData = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "User not found. Please sign in again.");
      return;
    }

    try {
      console.log("💾 Saving onboarding data:", onboardingData);
      console.log("👤 Current user UID:", user.uid);

      // Prepare user data with onboarding information
      const userUpdateData = {
        displayName: onboardingData.name || user.displayName,
        age: onboardingData.age || (user as any).age,
        gender: onboardingData.gender || (user as any).gender,
        bio: `Hi! I'm ${onboardingData.name || user.displayName}`,
        about: `I'm ${
          onboardingData.name || user.displayName
        } and I'm excited to meet new people through Evertwine!`,
        interests: onboardingData.goals || user.interests || [],
        onboardingComplete: true,
        updatedTime: new Date(),
      };

      // Save to database
      const result = await SupabaseDataService.updateUser(
        user.uid,
        userUpdateData
      );

      if ((result as any).error) {
        // Show error and don't mark complete
        Alert.alert(
          "Error Saving Profile",
          "Failed to save your profile. Please try again.",
          [{ text: "Retry", onPress: () => saveOnboardingData() }]
        );
        return; // Don't mark complete
      }

      console.log("✅ Onboarding data saved successfully");

      // Only mark complete on success
      clearOnboardingData();
      setOnboardingComplete(true);

      // Update the local user object to reflect the completion
      const { updateUserProfile } = useAuthStore.getState();
      updateUserProfile({ onboardingComplete: true });
    } catch (error) {
      console.error("❌ Error saving onboarding data:", error);
      Alert.alert("Error", "An unexpected error occurred. Please try again.", [
        { text: "Retry", onPress: () => saveOnboardingData() },
      ]);
    }
  };

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const tasksAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 200);

    setTimeout(() => {
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(tasksAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    // Start progress animation
    setTimeout(() => {
      startProgressAnimation();
    }, 1000);
  }, []);

  const startProgressAnimation = () => {
    console.log("🎬 Starting progress animation");
    // Update the displayed percentage during animation
    const listener = progressAnim.addListener(({ value }) => {
      setCurrentProgress(Math.round(value));
    });

    // Smooth animation from 0 to 100
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3000, // 3 seconds total
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        console.log("🎯 Progress animation finished, setting to 100%");
        setCurrentProgress(100);
        // Remove listener to prevent memory leaks
        progressAnim.removeListener(listener);
        // All done, save onboarding data and mark complete after 1 second
        setTimeout(async () => {
          console.log("🚀 Saving onboarding data and completing onboarding");
          await saveOnboardingData();
        }, 1000);
      }
    });
  };

  return (
    <GradientBackground variant="dark">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Progress Circle */}
            <Animated.View
              style={[
                styles.progressContainer,
                {
                  opacity: tasksAnim,
                  transform: [
                    {
                      scale: tasksAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              {/* Custom Progress Circle */}
              <View style={styles.progressCircleContainer}>
                {/* Background Circle */}
                <View style={styles.progressBackground} />

                {/* Progress Circle - starts small and fills */}
                <Animated.View
                  style={[
                    styles.progressCircle,
                    {
                      transform: [
                        {
                          scale: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: [0.1, 1],
                          }),
                        },
                        {
                          rotate: progressAnim.interpolate({
                            inputRange: [0, 100],
                            outputRange: ["0deg", "360deg"],
                          }),
                        },
                      ],
                    },
                  ]}
                />

                {/* Percentage Text */}
                <View style={styles.progressTextContainer}>
                  <Text style={[styles.progressText, { color: colors.text }]}>
                    {currentProgress}%
                  </Text>
                </View>
              </View>
            </Animated.View>

            {/* Title */}
            <Animated.Text
              style={[
                styles.title,
                {
                  opacity: titleAnim,
                  color: colors.text,
                  transform: [
                    {
                      translateY: titleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              Just a moment
            </Animated.Text>

            {/* Subtitle */}
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleAnim,
                  color: colors.textSecondary,
                  transform: [
                    {
                      translateY: subtitleAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              Building a personalized plan
            </Animated.Text>

            {/* Tasks List */}
            <Animated.View
              style={[
                styles.tasksContainer,
                {
                  opacity: tasksAnim,
                  transform: [
                    {
                      translateY: tasksAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {tasks.map((task, index) => (
                <AnimatedCheckmark
                  key={index}
                  text={task}
                  delay={1000 + index * 400}
                  style={styles.taskItem}
                />
              ))}
            </Animated.View>
          </View>
        </SafeAreaView>
      </Animated.View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  progressContainer: {
    marginBottom: 40,
  },
  progressCircleContainer: {
    width: 120,
    height: 120,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressBackground: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  progressCircle: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#3B82F6",
    borderRightColor: "#3B82F6",
  },
  progressTextContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
  },
  tasksContainer: {
    width: "100%",
    maxWidth: 300,
  },
  taskItem: {
    marginVertical: 8,
  },
});
