import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface SelectableOptionProps {
  icon?: string;
  text: string;
  selected?: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

const SelectableOption: React.FC<SelectableOptionProps> = ({
  icon,
  text,
  selected = false,
  onPress,
  style,
}) => {
  const getButtonStyle = () => {
    const baseStyle: any[] = [styles.option];

    if (!selected) {
      baseStyle.push({
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.3)",
      });
    }

    if (style) {
      baseStyle.push(style);
    }

    return baseStyle;
  };

  if (selected) {
    return (
      <TouchableOpacity
        style={[styles.option, styles.selectedOption, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={[styles.text, { color: "#FFFFFF" }]}>{text}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.text, { color: "#FFFFFF" }]}>{text}</Text>
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
  selectedOption: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 2,
    borderColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
