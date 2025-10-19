import React, { useEffect, useRef } from "react";
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
import AnimatedCheckmark from "../../components/AnimatedCheckmark";
import GradientBackground from "../../components/GradientBackground";
import { Ionicons } from "@expo/vector-icons";

type SocialBenefitsScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "SocialBenefits"
>;

interface Props {
  navigation: SocialBenefitsScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

const benefits = [
  "Join 50k+ people building real friendships",
  "Discover events tailored to your interests",
  "Safe, verified community members",
  "Free to join, easy to use",
];

export default function SocialBenefitsScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingStep } = useAuthStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const benefitsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation sequence
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 200);

    setTimeout(() => {
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(benefitsAnim, {
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
    setOnboardingStep("Commitment");
    navigation.navigate("Commitment");
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
          {/* Header with back button and progress */}
          <Animated.View
            style={[
              styles.header,
              {
                opacity: headerAnim,
                transform: [
                  {
                    translateY: headerAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View
                style={[styles.progressBar, { backgroundColor: colors.border }]}
              >
                <View
                  style={[
                    styles.progressFill,
                    { backgroundColor: colors.accent },
                  ]}
                />
              </View>
              <Text style={[styles.progressText, { color: colors.text }]}>
                Last step
              </Text>
            </View>
          </Animated.View>

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
              Real connections transform your life
            </Animated.Text>

            {/* Benefits List */}
            <Animated.View
              style={[
                styles.benefitsContainer,
                {
                  opacity: benefitsAnim,
                  transform: [
                    {
                      translateY: benefitsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {benefits.map((benefit, index) => (
                <AnimatedCheckmark
                  key={index}
                  text={benefit}
                  delay={index * 200}
                  style={styles.benefitItem}
                />
              ))}
            </Animated.View>

            {/* Source Citation */}
            <Animated.Text
              style={[
                styles.citation,
                {
                  opacity: benefitsAnim,
                  color: colors.textTertiary,
                },
              ]}
            >
              Harvard Business Review, 2023 | Carnegie Foundation Study |
              Harvard Study of Adult Development
            </Animated.Text>

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
              <OnboardingButton title="Continue" onPress={handleContinue} />
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  progressContainer: {
    flex: 1,
    alignItems: "center",
  },
  progressBar: {
    height: 4,
    width: "100%",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    width: "80%",
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 36,
  },
  benefitsContainer: {
    marginBottom: 30,
  },
  benefitItem: {
    marginVertical: 12,
  },
  citation: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
