import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAudioPlayer } from "expo-audio";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAuthStore } from "../hooks/useAuthStore";
import { OnboardingStackParamList } from "../navigation/OnboardingStack";

interface FadingTextProps {
  text: string;
  onComplete?: () => void;
  delay?: number;
  opacity?: Animated.Value;
}

const FadingText: React.FC<FadingTextProps> = ({
  text,
  onComplete,
  delay = 0,
  opacity,
}) => {
  const words = text.split(" ");
  const wordOpacities = words.map(() => new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate each word fading in sequentially
      const animations = wordOpacities.map((wordOpacity, index) => {
        return Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 600,
          delay: index * 200, // Stagger each word by 200ms
          useNativeDriver: true,
        });
      });

      Animated.parallel(animations).start(() => {
        // Wait before calling onComplete
        if (onComplete) {
          setTimeout(onComplete, 2000);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete, text]);

  return (
    <Animated.View style={{ opacity }}>
      <View style={styles.textContainer}>
        {words.map((word, wordIndex) => (
          <View key={wordIndex} style={styles.wordContainer}>
            <Animated.Text
              style={[
                styles.fadingText,
                {
                  opacity: wordOpacities[wordIndex],
                },
              ]}
            >
              {word}
            </Animated.Text>
            {wordIndex < words.length - 1 && (
              <Animated.Text style={styles.fadingText}> </Animated.Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

type CinematicIntroScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "CinematicIntro"
>;

const CinematicIntroScreen: React.FC = () => {
  const navigation = useNavigation<CinematicIntroScreenNavigationProp>();
  const { setHasSeenIntro } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasCompleted, setHasCompleted] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const audioPlayer = useAudioPlayer(
    "https://www.bensound.com/bensound-music/bensound-cosmos.mp3"
  );

  // Start playing background music
  useEffect(() => {
    // Start playing with low volume and loop
    audioPlayer.loop = true;
    audioPlayer.volume = 0;

    // Start playing and fade in when intro begins
    setTimeout(() => {
      audioPlayer.play();

      // Gradual fade in over 3 seconds
      const fadeInSteps = 30; // 30 steps over 3 seconds
      const targetVolume = 0.3; // Slightly higher volume for this cinematic track
      const stepVolume = targetVolume / fadeInSteps;

      for (let i = 1; i <= fadeInSteps; i++) {
        setTimeout(() => {
          audioPlayer.volume = stepVolume * i;
        }, i * 100); // 100ms between each volume step
      }
    }, 1000); // Start after initial fade-in animation

    // Cleanup function
    return () => {
      audioPlayer.pause();
    };
  }, []);

  const introSteps = [
    {
      text: "Making new friends can be hard",
      delay: 600,
    },
    {
      text: "Real connections happen face-to-face",
      delay: 800,
    },
    {
      text: "Discover people who share your passions",
      delay: 800,
    },
    {
      text: "From coffee chats to hiking groups",
      delay: 800,
    },
    {
      text: "Stop scrolling. Start living.",
      delay: 800,
    },
    {
      text: "Your community is waiting",
      delay: 800,
    },
    {
      text: "Welcome to Evertwine",
      delay: 800,
    },
  ];

  // Fade in animation on mount
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(true);
      // Fade in the first text
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  }, []);

  // Fade in text when step changes
  useEffect(() => {
    if (isVisible && currentStep > 0) {
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [currentStep, isVisible]);

  const handleStepComplete = () => {
    if (currentStep < introSteps.length - 1) {
      // Fade out current text
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        // Move to next step (will trigger fade in via useEffect)
        setCurrentStep((prev) => Math.min(prev + 1, introSteps.length - 1));
      });
    } else {
      // Fade out text, then navigate directly (no screen fade)
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        // Fade out music before completing
        // Gradual fade out over 2 seconds
        const fadeOutSteps = 20; // 20 steps over 2 seconds
        const currentVolume = 0.3; // Match the target volume from fade-in
        const stepVolume = currentVolume / fadeOutSteps;

        for (let i = fadeOutSteps; i >= 0; i--) {
          setTimeout(() => {
            audioPlayer.volume = stepVolume * i;
          }, (fadeOutSteps - i) * 100); // 100ms between each volume step
        }

        setTimeout(() => {
          audioPlayer.pause();
        }, 2000);

        if (!hasCompleted) {
          setHasCompleted(true);
          setHasSeenIntro(true);
          // Navigate to Welcome screen after intro completes
          navigation.navigate("Welcome");
        }
      });
    }
  };

  const handleSkip = () => {
    // Fade out music before skipping
    // Quick fade out over 0.5 seconds for skip
    const fadeOutSteps = 5; // 5 steps over 0.5 seconds
    const currentVolume = 0.3; // Match the target volume from fade-in
    const stepVolume = currentVolume / fadeOutSteps;

    for (let i = fadeOutSteps; i >= 0; i--) {
      setTimeout(() => {
        audioPlayer.volume = stepVolume * i;
      }, (fadeOutSteps - i) * 100); // 100ms between each volume step
    }

    setTimeout(() => {
      audioPlayer.pause();
    }, 500);

    if (!hasCompleted) {
      setHasCompleted(true);
      setHasSeenIntro(true);
      // Navigate to Welcome screen when skipping
      navigation.navigate("Welcome");
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea}>
        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </SafeAreaView>
      <View style={styles.content}>
        {isVisible && introSteps[currentStep] && (
          <FadingText
            key={currentStep}
            text={introSteps[currentStep].text}
            onComplete={handleStepComplete}
            delay={introSteps[currentStep].delay}
            opacity={textFadeAnim}
          />
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    zIndex: 10,
  },
  skipButton: {
    alignSelf: "flex-end",
    marginTop: 20,
    marginRight: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  textContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  wordContainer: {
    flexDirection: "row",
  },
  fadingText: {
    fontSize: 36,
    fontWeight: "300",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 50,
    letterSpacing: 1,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default CinematicIntroScreen;
