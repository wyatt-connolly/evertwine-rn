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
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";

type AgeSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "AgeSelection"
>;

interface Props {
  navigation: AgeSelectionScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const ageRanges = [
  { label: "18-24", value: "18-24" },
  { label: "25-34", value: "25-34" },
  { label: "35-44", value: "35-44" },
  { label: "45-54", value: "45-54" },
  { label: "55+", value: "55+" },
];

export default function AgeSelectionScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingData, setOnboardingStep } = useAuthStore();
  const [selectedAge, setSelectedAge] = useState<string>("");

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
    }, 800);
  }, []);

  // Convert age range to midpoint number
  const getAgeFromRange = (ageRange: string): number => {
    switch (ageRange) {
      case "18-24":
        return 21;
      case "25-34":
        return 29;
      case "35-44":
        return 39;
      case "45-54":
        return 49;
      case "55+":
        return 57;
      default:
        return 29; // Default to 25-34 range
    }
  };

  const handleContinue = () => {
    if (selectedAge) {
      // Convert age range to number and save to onboarding data
      const age = getAgeFromRange(selectedAge);
      setOnboardingData({ age });
      setOnboardingStep("GenderSelection");
      navigation.navigate("GenderSelection");
    }
  };

  const renderAgeOption = (
    age: { label: string; value: string },
    index: number
  ) => {
    const isSelected = selectedAge === age.value;

    return (
      <Animated.View
        key={age.value}
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
        <Animated.View
          style={[
            styles.option,
            {
              backgroundColor: isSelected
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(255, 255, 255, 0.05)",
              borderColor: isSelected ? "#FF6B35" : "rgba(255, 255, 255, 0.3)",
              borderWidth: isSelected ? 2 : 1,
            },
          ]}
        >
          <Text style={[styles.optionText, { color: "#FFFFFF" }]}>
            {age.label}
          </Text>
        </Animated.View>
      </Animated.View>
    );
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
              How old are you?
            </Animated.Text>

            {/* Age Options */}
            <View style={styles.optionsContainer}>
              {ageRanges.map((age, index) => (
                <Animated.View
                  key={age.value}
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
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderColor:
                          selectedAge === age.value
                            ? "#8B5CF6"
                            : "rgba(255, 255, 255, 0.3)",
                        borderWidth: selectedAge === age.value ? 2 : 1,
                      },
                    ]}
                    onPress={() => setSelectedAge(age.value)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, { color: "#FFFFFF" }]}>
                      {age.label}
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
                title="Continue"
                onPress={handleContinue}
                disabled={!selectedAge}
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
    paddingTop: height * 0.15,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 40,
  },
  optionsContainer: {
    marginBottom: 40,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    alignItems: "center",
    minHeight: 56,
    justifyContent: "center",
  },
  optionText: {
    fontSize: 18,
    fontWeight: "500",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
