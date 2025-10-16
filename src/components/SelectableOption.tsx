import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { useThemeStore } from "../hooks/useThemeStore";

interface SelectableOptionProps {
  icon?: string;
  text: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
  multiple?: boolean;
}

const SelectableOption: React.FC<SelectableOptionProps> = ({
  icon,
  text,
  selected = false,
  onPress,
  style,
  multiple = false,
}) => {
  const { colors } = useThemeStore();

  const getButtonStyle = () => {
    const baseStyle = [styles.option];

    if (selected) {
      baseStyle.push({
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 2,
        borderColor: colors.accentSecondary, // Purple border for selected
      });
    } else {
      baseStyle.push({
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: colors.border,
      });
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.text, { color: colors.text }]}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginVertical: 6,
    minHeight: 56,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
});

export default SelectableOption;
