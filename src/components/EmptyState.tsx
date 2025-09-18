import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";

interface EmptyStateProps {
  type?:
    | "meetups"
    | "messages"
    | "friends"
    | "notifications"
    | "search"
    | "generic";
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  showInvite?: boolean;
  onInvite?: () => void;
  style?: ViewStyle;
  illustration?: string; // URL to illustration image
}

export default function EmptyState({
  type = "generic",
  title,
  message,
  actionText,
  onAction,
  showInvite = false,
  onInvite,
  style,
  illustration,
}: EmptyStateProps) {
  const { colors } = useThemeStore();

  const getEmptyStateConfig = () => {
    switch (type) {
      case "meetups":
        return {
          icon: "calendar-outline",
          defaultTitle: "No meetups yet",
          defaultMessage:
            "Be the first to create a meetup in your area! Connect with people who share your interests.",
          defaultActionText: "Create Meetup",
          color: colors.primary,
          showInviteDefault: true,
        };

      case "messages":
        return {
          icon: "chatbubbles-outline",
          defaultTitle: "No messages yet",
          defaultMessage:
            "Start conversations with people you meet at events. Your messages will appear here.",
          defaultActionText: "Find People",
          color: colors.secondary,
          showInviteDefault: true,
        };

      case "friends":
        return {
          icon: "people-outline",
          defaultTitle: "No connections yet",
          defaultMessage:
            "Build your network by connecting with people at meetups and events.",
          defaultActionText: "Discover People",
          color: colors.primary,
          showInviteDefault: true,
        };

      case "notifications":
        return {
          icon: "notifications-outline",
          defaultTitle: "No notifications",
          defaultMessage:
            "When you have updates about meetups, messages, or connections, they'll appear here.",
          defaultActionText: "Explore App",
          color: colors.textSecondary,
          showInviteDefault: false,
        };

      case "search":
        return {
          icon: "search-outline",
          defaultTitle: "No results found",
          defaultMessage:
            "Try adjusting your search terms or explore different categories.",
          defaultActionText: "Clear Filters",
          color: colors.textSecondary,
          showInviteDefault: false,
        };

      default:
        return {
          icon: "information-circle-outline",
          defaultTitle: "Nothing here yet",
          defaultMessage: "Content will appear here as you use the app.",
          defaultActionText: "Get Started",
          color: colors.textSecondary,
          showInviteDefault: false,
        };
    }
  };

  const config = getEmptyStateConfig();
  const shouldShowInvite = showInvite || config.showInviteDefault;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {illustration ? (
          <Image source={{ uri: illustration }} style={styles.illustration} />
        ) : (
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.color + "20" },
            ]}
          >
            <Ionicons
              name={config.icon as any}
              size={60}
              color={config.color}
            />
          </View>
        )}

        <Text style={[styles.title, { color: colors.text }]}>
          {title || config.defaultTitle}
        </Text>

        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {message || config.defaultMessage}
        </Text>

        <View style={styles.buttonContainer}>
          {onAction && (
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={onAction}
            >
              <Text
                style={[styles.primaryButtonText, { color: colors.onPrimary }]}
              >
                {actionText || config.defaultActionText}
              </Text>
            </TouchableOpacity>
          )}

          {shouldShowInvite && onInvite && (
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={onInvite}
            >
              <Ionicons
                name="person-add-outline"
                size={18}
                color={colors.primary}
              />
              <Text
                style={[styles.secondaryButtonText, { color: colors.primary }]}
              >
                Invite Friends
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {shouldShowInvite && (
          <View style={styles.inviteHint}>
            <Ionicons
              name="bulb-outline"
              size={16}
              color={colors.textTertiary}
            />
            <Text
              style={[styles.inviteHintText, { color: colors.textTertiary }]}
            >
              Invite friends to make Evertwine more fun!
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  content: {
    alignItems: "center",
    maxWidth: 300,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  illustration: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
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
  primaryButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  inviteHint: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 6,
  },
  inviteHintText: {
    fontSize: 12,
    fontStyle: "italic",
  },
});
