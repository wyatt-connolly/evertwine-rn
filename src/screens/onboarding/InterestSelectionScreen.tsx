import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  StatusBar,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { DataService } from "../../services/DataService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import OnboardingButton from "../../components/OnboardingButton";
import SelectableOption from "../../components/SelectableOption";
import GradientBackground from "../../components/GradientBackground";

type InterestSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "InterestSelection"
>;

interface Props {
  navigation: InterestSelectionScreenNavigationProp;
}

const INTERESTS = [
  { name: "Technology", icon: "💻" },
  { name: "Sports", icon: "⚽" },
  { name: "Music", icon: "🎵" },
  { name: "Art", icon: "🎨" },
  { name: "Travel", icon: "✈️" },
  { name: "Food", icon: "🍕" },
  { name: "Fitness", icon: "💪" },
  { name: "Photography", icon: "📸" },
  { name: "Reading", icon: "📚" },
  { name: "Gaming", icon: "🎮" },
  { name: "Movies", icon: "🎬" },
  { name: "Dancing", icon: "💃" },
  { name: "Cooking", icon: "👨‍🍳" },
  { name: "Hiking", icon: "🥾" },
  { name: "Yoga", icon: "🧘" },
  { name: "Fashion", icon: "👗" },
  { name: "Business", icon: "💼" },
  { name: "Science", icon: "🔬" },
  { name: "Nature", icon: "🌿" },
  { name: "Volunteering", icon: "🤝" },
  { name: "Learning", icon: "📖" },
  { name: "Socializing", icon: "👥" },
  { name: "Creativity", icon: "✨" },
  { name: "Adventure", icon: "🗺️" },
];

export default function InterestSelectionScreen({ navigation }: Props) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const subtitleAnim = useRef(new Animated.Value(0)).current;
  const interestsAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start the animation sequence
    const startAnimations = () => {
      // Fade in the entire screen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();

      // Stagger the animations
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
        Animated.timing(interestsAnim, {
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
      }, 800);
    };

    startAnimations();
  }, []);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) => {
      if (prev.includes(interest)) {
        return prev.filter((item) => item !== interest);
      } else {
        return [...prev, interest];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedInterests.length < 3) {
      Alert.alert(
        "Select More Interests",
        "Please select at least 3 interests to help us find better meetups for you."
      );
      return;
    }

    setLoading(true);

    try {
      updateUserProfile({
        interests: selectedInterests,
      });

      // Only connect to Supabase if not in developer mode
      if (!DataService.isInDeveloperMode() && user?.uid) {
        const result = await SupabaseDataService.updateUser(user.uid, {
          interests: selectedInterests,
        });

        if (result.error) {
          Alert.alert("Error", "Failed to save interests. Please try again.");
          console.error("Supabase error:", result.error);
          return;
        }
      } else {
        console.log("🔧 Developer Mode: Using local storage only");
      }

      navigation.navigate("AppFeatures");
    } catch (error) {
      Alert.alert("Error", "Failed to save interests. Please try again.");
      console.error("Interest selection error:", error);
    } finally {
      setLoading(false);
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
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.content}
          >
            <View style={styles.header}>
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
                What are you interested in?
              </Animated.Text>
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
                Select at least 3 interests to help us find better meetups for
                you
              </Animated.Text>
              <Animated.Text
                style={[
                  styles.count,
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
                {selectedInterests.length} selected (minimum 3)
              </Animated.Text>
            </View>

            <Animated.View
              style={[
                styles.interestsGrid,
                {
                  opacity: interestsAnim,
                  transform: [
                    {
                      translateY: interestsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              {INTERESTS.map((interest, index) => (
                <SelectableOption
                  key={interest.name}
                  icon={interest.icon}
                  text={interest.name}
                  selected={selectedInterests.includes(interest.name)}
                  onPress={() => toggleInterest(interest.name)}
                  style={styles.interestOption}
                />
              ))}
            </Animated.View>

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
                title={loading ? "Saving..." : "Continue"}
                onPress={handleContinue}
                variant="primary"
                disabled={loading || selectedInterests.length < 3}
              />
            </Animated.View>
          </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 22,
  },
  count: {
    fontSize: 14,
    fontWeight: "600",
  },
  interestsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  interestOption: {
    width: "48%",
    marginBottom: 12,
  },
  buttonContainer: {
    marginTop: 20,
    paddingBottom: 40,
  },
});
