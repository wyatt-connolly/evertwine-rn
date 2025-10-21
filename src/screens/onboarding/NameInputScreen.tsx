import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";

type NameInputScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "NameInput"
>;

interface Props {
  navigation: NameInputScreenNavigationProp;
}

const { height } = Dimensions.get("window");

export default function NameInputScreen({ navigation }: Props) {
  const { setOnboardingData, setOnboardingStep } = useAuthStore();
  const [name, setName] = useState("");
  const [hasError, setHasError] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;
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
      Animated.timing(inputAnim, {
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
    }, 600);
  }, []);

  const handleNameChange = (text: string) => {
    setName(text);
    // Check if name contains special characters or numbers
    const hasSpecialChars = /[^a-zA-Z\s]/.test(text);
    setHasError(hasSpecialChars);
  };

  const handleContinue = () => {
    if (name.trim() && !hasError) {
      // Save name to onboarding data
      setOnboardingData({ name: name.trim() });
      setOnboardingStep("AgeSelection");
      navigation.navigate("AgeSelection");
    }
  };

  const handleKeyboardDismiss = () => {
    Keyboard.dismiss();
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
              What's your name?
            </Animated.Text>

            {/* Input Field */}
            <Animated.View
              style={[
                styles.inputContainer,
                {
                  opacity: inputAnim,
                  transform: [
                    {
                      translateY: inputAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TextInput
                style={[styles.input, { color: "#FFFFFF" }]}
                placeholder="Enter your name"
                placeholderTextColor="#AEAEB2"
                value={name}
                onChangeText={handleNameChange}
                returnKeyType="done"
                onSubmitEditing={handleKeyboardDismiss}
              />
              <View
                style={[
                  styles.underline,
                  { backgroundColor: hasError ? "#FF3B30" : "#FFFFFF" },
                ]}
              />
            </Animated.View>

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
              {hasError && (
                <Text style={styles.errorText}>
                  Please use only letters and spaces
                </Text>
              )}
              <OnboardingButton
                title="Continue"
                onPress={handleContinue}
                disabled={!name.trim() || hasError}
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
    paddingTop: height * 0.2,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 40,
  },
  inputContainer: {
    marginBottom: 40,
  },
  input: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  underline: {
    height: 2,
    width: "100%",
    marginTop: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
