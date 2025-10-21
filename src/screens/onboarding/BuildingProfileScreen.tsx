import { useEffect, useRef, useState } from "react";
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
import Svg, { Circle } from "react-native-svg";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import AnimatedCheckmark from "../../components/AnimatedCheckmark";
import GradientBackground from "../../components/GradientBackground";

const { height } = Dimensions.get("window");

const tasks = [
  { text: "Analyzing your preferences", color: "#8B5CF6" },
  { text: "Finding nearby meetups", color: "#3B82F6" },
  { text: "Personalizing your feed", color: "#10B981" },
];

export default function BuildingProfileScreen() {
  const {
    user,
    onboardingData,
    setOnboardingComplete,
    clearOnboardingData,
    setOnboardingStep,
  } = useAuthStore();
  const [currentProgress, setCurrentProgress] = useState(0);

  // Save all onboarding data to database
  const saveOnboardingData = async () => {
    if (!user?.uid) {
      Alert.alert("Error", "User not found. Please sign in again.");
      return;
    }

    try {


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

      // Only mark complete on success
      clearOnboardingData();
      setOnboardingComplete(true);
      setOnboardingStep("BuildingProfile"); // Mark as completed

      // Update the local user object to reflect the completion
      const { updateUserProfile } = useAuthStore.getState();
      updateUserProfile({ onboardingComplete: true });
    } catch (error) {

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

        setCurrentProgress(100);
        // Remove listener to prevent memory leaks
        progressAnim.removeListener(listener);
        // All done, save onboarding data and mark complete after 1 second
        setTimeout(async () => {

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
              {/* SVG Progress Circle */}
              <View style={styles.progressContainer}>
                <Svg width={120} height={120} style={styles.progressSvg}>
                  {/* Background circle */}
                  <Circle
                    cx={60}
                    cy={60}
                    r={56}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth={4}
                    fill="none"
                  />
                  {/* Progress arc */}
                  <AnimatedCircle
                    cx={60}
                    cy={60}
                    r={56}
                    stroke="#3B82F6"
                    strokeWidth={4}
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: [2 * Math.PI * 56, 0],
                    })}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                </Svg>
                {/* Percentage Text */}
                <View style={styles.progressTextContainer}>
                  <Text style={[styles.progressText, { color: "#FFFFFF" }]}>
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
                  color: "#FFFFFF",
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
                  color: "#E5E5EA",
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
                  text={task.text}
                  color={task.color}
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
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  progressSvg: {
    position: "absolute",
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
