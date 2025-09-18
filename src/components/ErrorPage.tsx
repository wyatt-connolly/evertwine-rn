import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface ErrorPageProps {
  type?: "network" | "notFound" | "generic" | "offline";
  title?: string;
  message?: string;
  onRetry?: () => void;
  onGoBack?: () => void;
  showRetry?: boolean;
  showGoBack?: boolean;
}

export default function ErrorPage({
  type = "generic",
  title,
  message,
  onRetry,
  onGoBack,
  showRetry = true,
  showGoBack = false,
}: ErrorPageProps) {
  const { colors } = useThemeStore();

  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "wifi-outline",
          defaultTitle: "Network Error",
          defaultMessage:
            "Please check your internet connection and try again.",
          color: "#FF9500",
        };
      case "notFound":
        return {
          icon: "search-outline",
          defaultTitle: "Not Found",
          defaultMessage: "The content you're looking for doesn't exist.",
          color: "#FF6B6B",
        };
      case "offline":
        return {
          icon: "cloud-offline-outline",
          defaultTitle: "You're Offline",
          defaultMessage:
            "Connect to the internet to continue using Evertwine.",
          color: "#666666",
        };
      default:
        return {
          icon: "alert-circle-outline",
          defaultTitle: "Something went wrong",
          defaultMessage:
            "We encountered an unexpected error. Please try again.",
          color: "#FF6B6B",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Ionicons
          name={config.icon as any}
          size={80}
          color={config.color}
          style={styles.icon}
        />

        <Text style={[styles.title, { color: colors.text }]}>
          {title || config.defaultTitle}
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message || config.defaultMessage}
        </Text>

        <View style={styles.buttonContainer}>
          {showRetry && onRetry && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={onRetry}
            >
              <Ionicons name="refresh" size={20} color={colors.onPrimary} />
              <Text style={[styles.buttonText, { color: colors.onPrimary }]}>
                Try Again
              </Text>
            </TouchableOpacity>
          )}

          {showGoBack && onGoBack && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.secondaryButton,
                { borderColor: colors.border },
              ]}
              onPress={onGoBack}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
              <Text style={[styles.buttonText, { color: colors.text }]}>
                Go Back
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  buttonContainer: {
    width: "100%",
    gap: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
