import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
// import { FirestoreService } from "../../services/firebase"; // Removed Firebase
import { DataService } from "../../services/DataService";
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";

type InterestSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "InterestSelection"
>;

interface Props {
  navigation: InterestSelectionScreenNavigationProp;
}

const INTERESTS = [
  "Technology",
  "Sports",
  "Music",
  "Art",
  "Travel",
  "Food",
  "Fitness",
  "Photography",
  "Reading",
  "Gaming",
  "Movies",
  "Dancing",
  "Cooking",
  "Hiking",
  "Yoga",
  "Fashion",
  "Business",
  "Science",
  "Nature",
  "Volunteering",
  "Learning",
  "Socializing",
  "Creativity",
  "Adventure",
];

export default function InterestSelectionScreen({ navigation }: Props) {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();

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

      // Only connect to Firebase if not in developer mode
      if (!DataService.isInDeveloperMode() && user?.uid) {
        const result = await FirestoreService.updateUser(user.uid, {
          interests: selectedInterests,
        });

        if (result.error) {
          Alert.alert("Error", "Failed to save interests. Please try again.");
          console.error("Firestore error:", result.error);
          return;
        }
      } else {
        console.log(
          "🔧 Developer Mode: Skipping Firebase, using local storage only"
        );
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
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.content}
        >
          <AnimatedCard delay={200} direction="up">
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                What are you interested in?
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Select at least 3 interests to help us find better meetups for
                you
              </Text>
              <Text style={[styles.count, { color: colors.textSecondary }]}>
                {selectedInterests.length} selected (minimum 3)
              </Text>
            </View>
          </AnimatedCard>

          <AnimatedCard delay={400} direction="up">
            <View style={styles.interestsGrid}>
              {INTERESTS.map((interest) => (
                <TouchableOpacity
                  key={interest}
                  style={[
                    styles.interestButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                    selectedInterests.includes(interest) && {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    },
                  ]}
                  onPress={() => toggleInterest(interest)}
                >
                  <Text
                    style={[
                      styles.interestText,
                      { color: colors.text },
                      selectedInterests.includes(interest) && {
                        color: colors.onPrimary,
                      },
                    ]}
                  >
                    {interest}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </AnimatedCard>

          <AnimatedButton
            title={loading ? "Saving..." : "Continue"}
            onPress={handleContinue}
            variant="primary"
            disabled={loading || selectedInterests.length < 3}
            loading={loading}
            style={styles.button}
          />
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
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
  interestButton: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 12,
    width: "48%",
    alignItems: "center",
  },
  interestButtonSelected: {
    // backgroundColor and borderColor will be set dynamically
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
  },
  interestTextSelected: {
    // color will be set dynamically
  },
  button: {
    marginTop: 20,
  },
});
