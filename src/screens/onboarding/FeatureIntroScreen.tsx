import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";

type FeatureIntroScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "FeatureIntro"
>;

interface Props {
  navigation: FeatureIntroScreenNavigationProp;
}

const { height } = Dimensions.get("window");

const features = [
  { icon: "📍", text: "Discover Local Meetups", color: "#8B5CF6" },
  { icon: "🎉", text: "Find Happy Hours & Events", color: "#3B82F6" },
  { icon: "💬", text: "Connect Before You Meet", color: "#10B981" },
  { icon: "📊", text: "Track Your Social Circle", color: "#8B5CF6" },
  { icon: "🔔", text: "Smart Notifications", color: "#10B981" },
];

interface AnimatedFeatureItemProps {
  feature: { icon: string; text: string; color: string };
  index: number;
  delay: number;
}

const AnimatedFeatureItem: React.FC<AnimatedFeatureItemProps> = ({
  feature,
  delay,
}) => {
  const { colors } = useThemeStore();
  const [isLoaded, setIsLoaded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // Fade in the item
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // Scale in the item
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();

      // After 800ms, show loading complete
      setTimeout(() => {
        setIsLoaded(true);
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }).start();
      }, 800);
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.featureItem,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.featureIconContainer}>
        {!isLoaded ? (
          <ActivityIndicator size="small" color={feature.color} />
        ) : (
          <Animated.View
            style={[
              styles.checkmarkContainer,
              {
                opacity: checkmarkAnim,
                transform: [
                  {
                    scale: checkmarkAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.5, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={[styles.checkmark, { color: feature.color }]}>✓</Text>
          </Animated.View>
        )}
      </View>
      <Text style={[styles.featureText, { color: colors.text }]}>
        {feature.text}
      </Text>
    </Animated.View>
  );
};

export default function FeatureIntroScreen({ navigation }: Props) {
  const { colors } = useThemeStore();
  const { setOnboardingStep } = useAuthStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
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
      Animated.timing(subtitleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }, 400);

    setTimeout(() => {
      Animated.timing(featuresAnim, {
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
    }, 9500);
  }, []);

  const handleGetStarted = () => {
    setOnboardingStep("SocialBenefits");
    navigation.navigate("SocialBenefits");
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
              Welcome to Evertwine
            </Animated.Text>

            {/* Subtitle */}
            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleAnim,
                  color: colors.text,
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
              Level up your social skills with a fun, daily practice for your
              career and relationships.
            </Animated.Text>

            {/* Features List */}
            <Animated.View
              style={[
                styles.featuresContainer,
                {
                  opacity: featuresAnim,
                  transform: [
                    {
                      translateY: featuresAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {features.map((feature, index) => (
                <AnimatedFeatureItem
                  key={index}
                  feature={feature}
                  index={index}
                  delay={800 + index * 1700}
                />
              ))}
            </Animated.View>

            {/* Get Started Button */}
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
                title="Get Started"
                onPress={handleGetStarted}
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
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  featureIconContainer: {
    width: 24,
    height: 24,
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    fontSize: 16,
    fontWeight: "bold",
  },
  featureText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
