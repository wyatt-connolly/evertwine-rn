import React, { useState, useEffect } from "react";
import { View, StyleSheet, StatusBar, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";

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
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const fadeAnim = new Animated.Value(0);
  const textFadeAnim = new Animated.Value(0);

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
        setCurrentStep((prev) => prev + 1);
      });
    } else {
      // Fade out text, then navigate directly (no screen fade)
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => {
        navigation.navigate("Welcome" as never);
      });
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar hidden />
      <View style={styles.content}>
        {isVisible && (
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
