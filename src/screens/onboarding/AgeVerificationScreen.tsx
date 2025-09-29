import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";

const { width } = Dimensions.get("window");

interface AgeVerificationScreenProps {
  navigation: any;
}

export default function AgeVerificationScreen({
  navigation,
}: AgeVerificationScreenProps) {
  const { colors } = useThemeStore();
  const { updateUserProfile } = useAuthStore();
  const [age, setAge] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAgeVerification = async () => {
    const ageNumber = parseInt(age);

    if (!age || isNaN(ageNumber) || ageNumber < 1 || ageNumber > 120) {
      Alert.alert("Invalid Age", "Please enter a valid age between 1 and 120.");
      return;
    }

    if (ageNumber < 18) {
      Alert.alert(
        "Age Restriction",
        "You must be at least 18 years old to use Evertwine. We're sorry, but we cannot allow users under 18 to access our platform.",
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate back to auth
              navigation.goBack();
            },
          },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      // Update user profile with age
      updateUserProfile({
        age: ageNumber,
      });

      console.log("✅ Age verified:", ageNumber);

      // Navigate to next step
      setTimeout(() => {
        setLoading(false);
        navigation.navigate("InterestSelection");
      }, 1000);
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Failed to verify age. Please try again.");
    }
  };

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              Age Verification
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              You must be 18 or older to use Evertwine
            </Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Ionicons
                name="calendar-outline"
                size={48}
                color={colors.primary}
              />
            </View>
          </View>

          {/* Age Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              How old are you?
            </Text>
            <TextInput
              style={[
                styles.ageInput,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={age}
              onChangeText={setAge}
              placeholder="Enter your age"
              placeholderTextColor={colors.textTertiary}
              keyboardType="numeric"
              maxLength={3}
              autoFocus
            />
          </View>

          {/* Warning */}
          <View style={styles.warningContainer}>
            <Ionicons
              name="warning-outline"
              size={20}
              color={colors.warning || "#FFA500"}
            />
            <Text style={[styles.warningText, { color: colors.textSecondary }]}>
              You must be 18 or older to use Evertwine
            </Text>
          </View>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title={loading ? "Verifying..." : "Continue"}
            onPress={handleAgeVerification}
            variant="primary"
            disabled={loading || !age}
            icon="arrow-forward"
            style={[
              styles.continueButton,
              (!age || loading) && styles.disabledButton,
            ]}
          />
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    textAlign: "center",
  },
  ageInput: {
    height: 56,
    borderRadius: 16,
    borderWidth: 2,
    paddingHorizontal: 20,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    width: "100%",
  },
  warningText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  continueButton: {
    height: 56,
    borderRadius: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
});
