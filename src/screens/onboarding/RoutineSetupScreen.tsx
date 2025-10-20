import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";

type RoutineSetupScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "RoutineSetup"
>;

interface Props {
  navigation: RoutineSetupScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const routineOptions = [
  { time: "Once a week", label: "Casual", value: "casual" },
  { time: "2-3 times a week", label: "Regular", value: "regular" },
  {
    time: "4+ times a week",
    label: "Social butterfly",
    value: "social-butterfly",
  },
];

export default function RoutineSetupScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingData, setOnboardingStep } = useAuthStore();
  const [selectedRoutine, setSelectedRoutine] = useState<string>("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const questionAnim = useRef(new Animated.Value(0)).current;
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
      Animated.timing(questionAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(optionsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    setTimeout(() => {
      Animated.timing(buttonAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }, []);

  const handleContinue = () => {
    if (selectedRoutine) {
      // Save routine to onboarding data
      setOnboardingData({ routine: selectedRoutine });
      setOnboardingStep("FeatureIntro");
      navigation.navigate("FeatureIntro");
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
                  color: "#FFFFFF",
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
              Let's set up your preferences!
            </Animated.Text>

            {/* Question */}
            <Animated.Text
              style={[
                styles.question,
                {
                  opacity: questionAnim,
                  color: "#FFFFFF",
                  transform: [
                    {
                      translateY: questionAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              How often would you like to attend meetups?
            </Animated.Text>

            {/* Routine Options */}
            <View style={styles.optionsContainer}>
              {routineOptions.map((option, index) => (
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
                  <TouchableOpacity
                    style={[
                      styles.option,
                      {
                        backgroundColor:
                          selectedRoutine === option.value
                            ? "rgba(255, 255, 255, 0.1)"
                            : "rgba(255, 255, 255, 0.05)",
                        borderColor:
                          selectedRoutine === option.value
                            ? colors.accentSecondary
                            : colors.border,
                        borderWidth: selectedRoutine === option.value ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedRoutine(option.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, { color: "#FFFFFF" }]}>
                      {option.time}
                    </Text>
                    <Text style={[styles.optionLabel, { color: "#E5E5EA" }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
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
                title="Help me connect"
                onPress={handleContinue}
                disabled={!selectedRoutine}
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
    marginBottom: 20,
    lineHeight: 36,
  },
  question: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  option: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginVertical: 8,
    alignItems: "center",
    minHeight: 70,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "400",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
