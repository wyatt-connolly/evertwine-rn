import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import SelectableOption from "../../components/SelectableOption";
import GradientBackground from "../../components/GradientBackground";

type GoalsSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "GoalsSelection"
>;

interface Props {
  navigation: GoalsSelectionScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const goalOptions = [
  { icon: "🌟", text: "Make new friends", value: "make-friends" },
  { icon: "💼", text: "Expand my network", value: "expand-network" },
  { icon: "🎯", text: "Find activity partners", value: "activity-partners" },
  { icon: "❤️", text: "Improve my dating life", value: "dating" },
  { icon: "🎉", text: "Discover local events", value: "local-events" },
  { icon: "🎨", text: "Learn new hobbies", value: "hobbies" },
  { icon: "📍", text: "Other", value: "other" },
];

export default function GoalsSelectionScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingData } = useAuthStore();
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const optionsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(optionsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  const handleGoalToggle = (goalValue: string) => {
    setSelectedGoals((prev) => {
      if (prev.includes(goalValue)) {
        return prev.filter((g) => g !== goalValue);
      } else {
        return [...prev, goalValue];
      }
    });
  };

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      // Save goals to onboarding data
      setOnboardingData({ goals: selectedGoals });
      navigation.navigate("ObstaclesSelection");
    }
  };

  return (
    <GradientBackground variant="dark">
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          <View style={styles.content}>
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
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              What do you hope to improve with Evertwine?
            </Animated.Text>

            {/* Goals Options */}
            <View style={styles.optionsContainer}>
              {goalOptions.map((option, index) => (
                <Animated.View
                  key={option.value}
                  style={[
                    {
                      opacity: optionsAnim,
                      transform: [
                        {
                          translateY: optionsAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [20, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <SelectableOption
                    icon={option.icon}
                    text={option.text}
                    selected={selectedGoals.includes(option.value)}
                    onPress={() => handleGoalToggle(option.value)}
                    multiple={true}
                  />
                </Animated.View>
              ))}
            </View>

            {/* Continue Button */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonAnim,
                  transform: [
                    {
                      translateY: buttonAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [30, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <OnboardingButton
                title="Continue"
                onPress={handleContinue}
                disabled={selectedGoals.length === 0}
              />
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
    paddingTop: height * 0.1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
