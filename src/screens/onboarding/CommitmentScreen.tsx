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
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../../components/GradientBackground";

type CommitmentScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Commitment"
>;

interface Props {
  navigation: CommitmentScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

export default function CommitmentScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingStep } = useAuthStore();
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const commitmentAnim = useRef(new Animated.Value(0)).current;
  const fingerprintAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(commitmentAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 600);

    setTimeout(() => {
      Animated.timing(fingerprintAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 800);
  }, []);

  const handlePressIn = () => {
    setIsHolding(true);
    startProgress();
  };

  const handlePressOut = () => {
    setIsHolding(false);
    setProgress(0);
  };

  const startProgress = () => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Use setTimeout to avoid setState-in-render error
          setTimeout(() => {
            setOnboardingStep("BuildingProfile");
            navigation.navigate("BuildingProfile");
          }, 0);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
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
              Your Journey Starts Now
            </Animated.Text>

            {/* Subtitle */}
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleAnim,
                  color: "#FFFFFF",
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
              Congratulations on taking the first step. Now, let's make a
              commitment to yourself.
            </Animated.Text>

            {/* Commitment Text Box */}
            <Animated.View
              style={[
                styles.commitmentBox,
                {
                  opacity: commitmentAnim,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  borderColor: colors.border,
                  transform: [
                    {
                      translateY: commitmentAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={[styles.commitmentText, { color: "#FFFFFF" }]}>
                I commit to investing time in building real connections. I
                understand that meaningful relationships come through consistent
                effort, and I'm ready to take the first step towards expanding
                my social circle.
              </Text>
            </Animated.View>

            {/* Fingerprint Icon */}
            <Animated.View
              style={[
                styles.fingerprintContainer,
                {
                  opacity: fingerprintAnim,
                  transform: [
                    {
                      translateY: fingerprintAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                style={styles.fingerprintButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.8}
              >
                <Ionicons name="finger-print" size={80} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>

            {/* Hold to commit text */}
            <Animated.Text
              style={[
                styles.holdText,
                {
                  opacity: fingerprintAnim,
                  color: "#FFFFFF",
                },
              ]}
            >
              Hold to commit
            </Animated.Text>

            {/* Progress indicator */}
            {isHolding && (
              <Animated.View style={styles.progressContainer}>
                <View
                  style={[
                    styles.progressDot,
                    { backgroundColor: colors.accent },
                  ]}
                />
                <Text style={[styles.progressText, { color: "#FFFFFF" }]}>
                  Creating your profile...
                </Text>
              </Animated.View>
            )}
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
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  commitmentBox: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 40,
    width: "100%",
  },
  commitmentText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
    textAlign: "left",
  },
  fingerprintContainer: {
    marginBottom: 20,
  },
  fingerprintButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  holdText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "400",
  },
});
