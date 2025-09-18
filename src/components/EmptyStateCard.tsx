import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

const { width } = Dimensions.get("window");

interface EmptyStateCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: any;
}

export default function EmptyStateCard({
  icon,
  title,
  description,
  actionText,
  onActionPress,
  style,
}: EmptyStateCardProps) {
  const { colors } = useThemeStore();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface }, style]}
    >
      <View style={styles.content}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.background }]}
        >
          <Ionicons name={icon} size={48} color={colors.textTertiary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {description}
        </Text>

        {actionText && onActionPress && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={onActionPress}
          >
            <Text style={[styles.actionText, { color: colors.onPrimary }]}>
              {actionText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 32,
    margin: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  content: {
    alignItems: "center",
    maxWidth: width * 0.7,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
