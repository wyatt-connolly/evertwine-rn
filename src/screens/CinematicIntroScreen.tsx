import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Audio } from "expo-av";
import { useAuthStore } from "../hooks/useAuthStore";

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
  const letterOpacities = text.split("").map(() => new Animated.Value(0));

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate each letter fading in sequentially
      const animations = letterOpacities.map((letterOpacity, index) => {
        return Animated.timing(letterOpacity, {
          toValue: 1,
          duration: 100,
          delay: index * 60, // Stagger each letter by 60ms
          useNativeDriver: true,
        });
      });

      Animated.parallel(animations).start(() => {
        // Wait before calling onComplete
        if (onComplete) {
          setTimeout(onComplete, 1200);
        }
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, onComplete, text]);

  let letterIndex = 0;

  return (
    <Animated.View style={{ opacity }}>
      <View style={styles.textContainer}>
        {words.map((word, wordIndex) => (
          <View key={wordIndex} style={styles.wordContainer}>
            {word.split("").map((letter, indexInWord) => {
              const currentLetterIndex = letterIndex++;
              return (
                <Animated.Text
                  key={indexInWord}
                  style={[
                    styles.fadingText,
                    {
                      opacity: letterOpacities[currentLetterIndex],
                    },
                  ]}
                >
                  {letter}
                </Animated.Text>
              );
            })}
            {wordIndex < words.length - 1 && (
              <Animated.Text
                style={[
                  styles.fadingText,
                  {
                    opacity: letterOpacities[letterIndex++],
                  },
                ]}
              >
                {" "}
              </Animated.Text>
            )}
          </View>
        ))}
      </View>
    </Animated.View>
  );
};

const CinematicIntroScreen: React.FC = () => {
  const { setHasSeenIntro } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const fadeAnim = new Animated.Value(0);
  const textFadeAnim = new Animated.Value(0);

  // Load and play background music
  useEffect(() => {
    const loadSound = async () => {
      try {
        // Option 1: Use a free ambient music URL
        const { sound: audioSound } = await Audio.Sound.createAsync(
          {
            uri: "https://www.bensound.com/bensound-music/bensound-ukulele.mp3",
          }, // Free ambient music
          { shouldPlay: true, isLooping: true, volume: 0.2 }
        );
        setSound(audioSound);
      } catch (error) {
        console.log("Error loading audio:", error);
        // Option 2: If URL fails, you can use a local file or continue without audio
        // Uncomment the lines below to use a local file instead:
        // try {
        //   const { sound: audioSound } = await Audio.Sound.createAsync(
        //     require('../../assets/intro-music.mp3'),
        //     { shouldPlay: true, isLooping: true, volume: 0.2 }
        //   );
        //   setSound(audioSound);
        // } catch (localError) {
        //   console.log("No audio file found, continuing without music");
        // }
      }
    };

    loadSound();

    // Cleanup function
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  // Cleanup sound when component unmounts
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  const introSteps = [
    {
      text: "Making new friends can be hard",
      delay: 300,
    },
    {
      text: "Real connections happen face-to-face",
      delay: 400,
    },
    {
      text: "Discover people who share your passions",
      delay: 400,
    },
    {
      text: "From coffee chats to hiking groups",
      delay: 400,
    },
    {
      text: "Stop scrolling. Start living.",
      delay: 400,
    },
    {
      text: "Your community is waiting",
      delay: 400,
    },
    {
      text: "Welcome to Evertwine",
      delay: 400,
    },
  ];

  // Load and play soothing background music
  useEffect(() => {
    const loadAudio = async () => {
      try {
        // For now, we'll use a placeholder. You can replace this with:
        // 1. A local audio file: require('../../assets/audio/soothing-intro.mp3')
        // 2. A remote URL: { uri: 'https://example.com/soothing-intro.mp3' }
        // 3. Or remove this section if you don't want background music
        
        // Placeholder - replace with actual audio source
        const { sound } = await Audio.Sound.createAsync(
          { uri: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' }, // Placeholder URL
          { shouldPlay: false, isLooping: false, volume: 0.1 } // Disabled for now
        );
        setSound(sound);
      } catch (error) {
        console.log('Error loading audio:', error);
      }
    };

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

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
        // Stop the music before completing
        if (sound) {
          sound.stopAsync();
        }
        setHasSeenIntro(true);
        // Let AppNavigator handle routing based on auth state
        // Don't navigate manually - the auth state change will trigger the correct route
      });
    }
  };

  const handleSkip = () => {
    // Stop the music before skipping
    if (sound) {
      sound.stopAsync();
    }
    setHasSeenIntro(true);
    // Let AppNavigator handle routing based on auth state
    // Don't navigate manually - the auth state change will trigger the correct route
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
