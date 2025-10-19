import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface FABOption {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color?: string;
}

interface ExpandableFABProps {
  options: FABOption[];
}

export default function ExpandableFAB({ options }: ExpandableFABProps) {
  const { colors } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const toggleExpand = () => {
    const toValue = isExpanded ? 0 : 1;
    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    setIsExpanded(!isExpanded);
  };

  const handleOptionPress = (option: FABOption) => {
    setIsExpanded(false);
    Animated.spring(rotateAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
    setTimeout(() => option.onPress(), 100);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <Modal transparent visible={isExpanded} animationType="fade">
          <Pressable style={styles.backdrop} onPress={toggleExpand}>
            <View style={styles.optionsContainer}>
              {options.map((option, index) => (
                <Animated.View
                  key={index}
                  style={[
                    styles.optionWrapper,
                    {
                      opacity: rotateAnim,
                      transform: [
                        {
                          translateY: rotateAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -(index + 1) * 120],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.labelContainer,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor: option.color || colors.surface,
                      },
                    ]}
                    onPress={() => handleOptionPress(option)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={option.icon}
                      size={24}
                      color={option.color ? colors.onPrimary : colors.primary}
                    />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Main FAB */}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: colors.primary,
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.2)",
          },
        ]}
        onPress={toggleExpand}
        activeOpacity={0.8}
      >
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Ionicons name="add" size={28} color={colors.onPrimary} />
        </Animated.View>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 100, // Moved down a bit from 140 to 120
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 24, // Adjusted to match new FAB position (120 - 60 - 16 for clearance)
    right: 24,
    zIndex: 1001,
  },
  optionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    zIndex: 1002,
  },
  labelContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1003,
  },
});
