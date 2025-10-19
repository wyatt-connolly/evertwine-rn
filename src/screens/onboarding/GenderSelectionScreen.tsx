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

type GenderSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "GenderSelection"
>;

interface Props {
  navigation: GenderSelectionScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const genderOptions = [
  { icon: "👨", text: "Male", value: "male" },
  { icon: "👩", text: "Female", value: "female" },
  { icon: "🧑", text: "Non-binary", value: "non-binary" },
  { icon: "❓", text: "Prefer not to say", value: "prefer-not-to-say" },
];

export default function GenderSelectionScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingData } = useAuthStore();
  const [selectedGender, setSelectedGender] = useState<string>("");

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

  const handleContinue = () => {
    if (selectedGender) {
      // Save gender to onboarding data
      setOnboardingData({ gender: selectedGender });
      navigation.navigate("GoalsSelection");
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
              What's your gender?
            </Animated.Text>

            {/* Gender Options */}
            <View style={styles.optionsContainer}>
              {genderOptions.map((option, index) => (
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
                    selected={selectedGender === option.value}
                    onPress={() => setSelectedGender(option.value)}
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
                disabled={!selectedGender}
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
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
