import { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { Picker } from "@react-native-picker/picker";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
import { useAuthStore } from "../../hooks/useAuthStore";
import OnboardingButton from "../../components/OnboardingButton";
import GradientBackground from "../../components/GradientBackground";

type AgeSelectionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "AgeSelection"
>;

interface Props {
  navigation: AgeSelectionScreenNavigationProp;
}

const { width, height } = Dimensions.get("window");

// Generate age options from 18 to 99
const ageOptions = Array.from({ length: 82 }, (_, i) => i + 18);

export default function AgeSelectionScreen({ navigation }: Props) {
  const { setOnboardingData, setOnboardingStep } = useAuthStore();
  const [selectedAge, setSelectedAge] = useState<number>(18);

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
    if (selectedAge && selectedAge >= 18) {
      // Save exact age to onboarding data
      setOnboardingData({ age: selectedAge });
      setOnboardingStep("GenderSelection");
      navigation.navigate("GenderSelection");
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
              How old are you?
            </Animated.Text>

            {/* Age Picker */}
            <Animated.View
              style={[
                styles.pickerContainer,
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
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedAge}
                  onValueChange={setSelectedAge}
                  style={styles.picker}
                  itemStyle={styles.pickerItem}
                >
                  {ageOptions.map((age) => (
                    <Picker.Item
                      key={age}
                      label={`${age} years old`}
                      value={age}
                      color="#FFFFFF"
                    />
                  ))}
                </Picker>
              </View>
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
              <OnboardingButton
                title="Continue"
                onPress={handleContinue}
                disabled={selectedAge < 18}
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
  pickerContainer: {
    marginBottom: 40,
    alignItems: "center",
  },
  pickerWrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    overflow: "hidden",
    width: width * 0.7,
  },
  picker: {
    height: 200,
    width: "100%",
  },
  pickerItem: {
    color: "#FFFFFF",
    fontSize: 18,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 60,
    paddingTop: 20,
  },
});
