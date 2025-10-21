import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

interface AnimatedCheckmarkProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  style?: any;
}

const AnimatedCheckmark: React.FC<AnimatedCheckmarkProps> = ({
  text,
  delay = 0,
  onComplete,
  style,
}) => {
  const spinnerAnim = useRef(new Animated.Value(0)).current;
  const lineAnim = useRef(new Animated.Value(0)).current;
  const checkmarkAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startSequence = () => {
      // Start spinner rotation
      Animated.timing(spinnerAnim, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }).start(() => {
        // Fade in line below spinner
        Animated.timing(lineAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          // Transform spinner to checkmark
          Animated.timing(checkmarkAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            // Fade in text
            Animated.timing(textAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start(() => {
              onComplete?.();
            });
          });
        });
      });
    };

    startSequence();
  }, [delay, onComplete]);

  const spinnerRotation = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const checkmarkScale = checkmarkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconContainer}>
        {/* Spinner */}
        <Animated.View
          style={[
            styles.spinner,
            {
              opacity: spinnerAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1, 0],
              }),
              transform: [{ rotate: spinnerRotation }],
            },
          ]}
        >
          <View
            style={[
              styles.spinnerCircle,
              { borderColor: "rgba(255, 255, 255, 0.3)" },
            ]}
          />
        </Animated.View>

        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkmark,
            {
              opacity: checkmarkAnim,
              transform: [{ scale: checkmarkScale }],
            },
          ]}
        >
          <View
            style={[
              styles.checkmarkCircle,
              { backgroundColor: "rgba(255, 255, 255, 0.2)" },
            ]}
          >
            <Text style={styles.checkmarkIcon}>✓</Text>
          </View>
        </Animated.View>

        {/* Line below icon */}
        <Animated.View
          style={[
            styles.line,
            {
              opacity: lineAnim,
              backgroundColor: "rgba(255, 255, 255, 0.3)",
            },
          ]}
        />
      </View>

      {/* Text */}
      <Animated.Text
        style={[
          styles.text,
          {
            opacity: textAnim,
            color: "#FFFFFF", // Force white text for better visibility
          },
        ]}
      >
        {text}
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  iconContainer: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  spinnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderTopColor: "transparent",
  },
  checkmark: {
    position: "absolute",
    width: 20,
    height: 20,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmarkIcon: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  line: {
    position: "absolute",
    bottom: -2,
    width: 16,
    height: 2,
    borderRadius: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    flex: 1,
  },
});

export default AnimatedCheckmark;
