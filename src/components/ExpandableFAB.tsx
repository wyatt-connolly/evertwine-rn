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
                            outputRange: [20, -(index + 1) * 116],
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
        style={[styles.fab, { backgroundColor: colors.primary }]}
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
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  optionsContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  optionWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  labelContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  optionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});
