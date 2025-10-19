import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface OAuthButtonProps {
  provider: "google" | "apple";
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export default function OAuthButton({
  provider,
  onPress,
  loading = false,
  disabled = false,
}: OAuthButtonProps) {
  const { colors } = useThemeStore();

  const getProviderConfig = () => {
    switch (provider) {
      case "google":
        return {
          text: "Continue with Google",
          backgroundColor: "#FFFFFF",
          textColor: "#1F2937",
          borderColor: "#D1D5DB",
        };
      case "apple":
        return {
          text: "Continue with Apple",
          backgroundColor: "#000000",
          textColor: "#FFFFFF",
          borderColor: "#000000",
        };
      default:
        return {
          text: "Continue",
          backgroundColor: colors.accent,
          textColor: "#FFFFFF",
          borderColor: colors.accent,
        };
    }
  };

  const config = getProviderConfig();

  const renderIcon = () => {
    if (loading) {
      return (
        <ActivityIndicator
          size="small"
          color={config.textColor}
          style={styles.loader}
        />
      );
    }

    switch (provider) {
      case "google":
        return (
          <AntDesign
            name="google"
            size={20}
            color={config.textColor}
            style={styles.icon}
          />
        );
      case "apple":
        return (
          <Ionicons
            name="logo-apple"
            size={22}
            color={config.textColor}
            style={styles.icon}
          />
        );
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: config.backgroundColor,
          borderColor: config.borderColor,
          opacity: disabled || loading ? 0.6 : 1,
        },
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {renderIcon()}
        <Text
          style={[
            styles.text,
            {
              color: config.textColor,
            },
          ]}
        >
          {config.text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    marginRight: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    marginRight: 12,
  },
});
