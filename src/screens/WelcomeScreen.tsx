import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Dimensions,
  ImageBackground,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../navigation/OnboardingStack";
import { useThemeStore } from "../hooks/useThemeStore";

type WelcomeScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "Welcome"
>;

interface Props {
  navigation: WelcomeScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }: Props) {
  const { colors } = useThemeStore();

  const handleBeginJourney = () => {
    navigation.navigate("PhoneVerification");
  };

  const handleAlreadyHaveAccount = () => {
    // For now, navigate to phone verification as well
    // In a real app, this might go to a sign-in screen
    navigation.navigate("PhoneVerification");
  };

  return (
    <ImageBackground
      source={require("../../assets/auth.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Main Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome to Evertwine</Text>

            <Text style={styles.description}>
              Making new friends can be hard. Build real friendships through
              local meetups and events.
            </Text>

            <Text style={styles.question}>Ready to do more, together?</Text>
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: "#FF7F27" }]}
              onPress={handleBeginJourney}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Start Connecting</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { backgroundColor: "rgba(255, 255, 255, 0.2)" },
              ]}
              onPress={handleAlreadyHaveAccount}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>
                I already have an account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "flex-end",
    paddingTop: height * 0.3,
    paddingBottom: 40,
  },
  textContainer: {
    flex: 0,
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "left",
    lineHeight: 36,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 12,
    textAlign: "left",
    lineHeight: 22,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  question: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 8,
    textAlign: "left",
    lineHeight: 22,
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    gap: 16,
    paddingHorizontal: 20,
  },
  primaryButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF7F27",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
});
