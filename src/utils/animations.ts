import { Animated } from "react-native";

export const createFadeInAnimation = (delay: number = 0) => {
  const fadeAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay,
      useNativeDriver: true,
    }).start();
  };

  return { fadeAnim, startAnimation };
};

export const createSlideUpAnimation = (
  delay: number = 0,
  translateY: number = 30
) => {
  const slideAnim = new Animated.Value(translateY);
  const fadeAnim = new Animated.Value(0);

  const startAnimation = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return {
    slideAnim,
    fadeAnim,
    startAnimation,
    animatedStyle: {
      opacity: fadeAnim,
      transform: [{ translateY: slideAnim }],
    },
  };
};

export const createStaggeredAnimations = (
  count: number,
  baseDelay: number = 0
) => {
  const animations = Array.from({ length: count }, (_, index) => {
    return createSlideUpAnimation(baseDelay + index * 200);
  });

  const startAllAnimations = () => {
    animations.forEach(({ startAnimation }) => startAnimation());
  };

  return { animations, startAllAnimations };
};

export const createProgressAnimation = (
  start: number,
  end: number,
  duration: number = 800
) => {
  const progressAnim = new Animated.Value(start);

  const startAnimation = (onComplete?: () => void) => {
    Animated.timing(progressAnim, {
      toValue: end,
      duration,
      useNativeDriver: false, // We need this for text interpolation
    }).start(onComplete);
  };

  const animatedValue = progressAnim.interpolate({
    inputRange: [start, end],
    outputRange: [start, end],
    extrapolate: "clamp",
  });

  return { progressAnim, startAnimation, animatedValue };
};

export const createCheckmarkSequence = (delay: number = 0) => {
  const spinnerAnim = new Animated.Value(0);
  const lineAnim = new Animated.Value(0);
  const checkmarkAnim = new Animated.Value(0);

  const startSequence = () => {
    // Start spinner
    Animated.timing(spinnerAnim, {
      toValue: 1,
      duration: 400,
      delay,
      useNativeDriver: true,
    }).start(() => {
      // Fade in line
      Animated.timing(lineAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        // Transform to checkmark
        Animated.timing(checkmarkAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      });
    });
  };

  return {
    spinnerAnim,
    lineAnim,
    checkmarkAnim,
    startSequence,
  };
};
