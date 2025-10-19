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

type ObstaclesScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "ObstaclesSelection"
>;

interface Props {
  navigation: ObstaclesScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const obstacleOptions = [
  { icon: "💡", text: "I don't know where to start", value: "dont-know-where" },
  { icon: "⏳", text: "I don't have time", value: "no-time" },
  { icon: "👥", text: "Social anxiety", value: "social-anxiety" },
  { icon: "🚀", text: "Staying motivated", value: "motivation" },
  { icon: "😊", text: "Worried what others think", value: "judgment" },
  { icon: "❌", text: "Not really", value: "none" },
];

export default function ObstaclesScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingData } = useAuthStore();
  const [selectedObstacle, setSelectedObstacle] = useState<string>("");

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
    if (selectedObstacle) {
      // Save obstacle to onboarding data (convert single selection to array)
      setOnboardingData({ obstacles: [selectedObstacle] });
      navigation.navigate("RoutineSetup");
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
        <SafeAreaView style={styles.safeArea}>
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
              Is there anything holding you back from meeting new people?
            </Animated.Text>

            {/* Obstacle Options */}
            <View style={styles.optionsContainer}>
              {obstacleOptions.map((option, index) => (
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
                    selected={selectedObstacle === option.value}
                    onPress={() => setSelectedObstacle(option.value)}
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
                disabled={!selectedObstacle}
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
