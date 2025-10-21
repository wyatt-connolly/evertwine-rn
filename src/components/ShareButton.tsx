import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Share,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { Meetup, User } from "../types";

interface ShareButtonProps {
  type: "meetup" | "profile" | "app" | "event";
  data?: Meetup | User | any;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: "small" | "medium" | "large";
  variant?: "icon" | "button" | "text";
  customMessage?: string;
}

export default function ShareButton({
  type,
  data,
  style,
  textStyle,
  size = "medium",
  variant = "button",
  customMessage,
}: ShareButtonProps) {
  const { colors } = useThemeStore();

  const getShareContent = () => {
    switch (type) {
      case "meetup":
        const meetup = data as Meetup;
        return {
          title: `Join me at ${meetup?.title || "this meetup"}!`,
          message:
            customMessage ||
            `Hey! I found this amazing meetup "${
              meetup?.title
            }" on Evertwine. Want to join me? 🎉\n\nLocation: ${
              meetup?.locationName
            }\nTime: ${
              meetup?.time ? new Date(meetup.time).toLocaleDateString() : "TBD"
            }\n\nDownload Evertwine to RSVP!`,
          url: `https://evertwine.app/meetup/${meetup?.id}`,
        };

      case "profile":
        const user = data as User;
        return {
          title: `Check out ${
            user?.displayName || "this profile"
          } on Evertwine`,
          message:
            customMessage ||
            `Hey! Check out ${
              user?.displayName
            }'s profile on Evertwine. They're into ${user?.hobbies
              ?.slice(0, 3)
              .join(
                ", "
              )} and more!\n\nConnect with amazing people in your area. Download Evertwine!`,
          url: `https://evertwine.app/profile/${user?.uid}`,
        };

      case "event":
        const event = data as any;
        return {
          title: `Join me at ${event?.title || "this event"}!`,
          message:
            customMessage ||
            `Found this cool event "${
              event?.title
            }" on Evertwine! Want to come with me? 🎊\n\nLocation: ${
              event?.location
            }\nTime: ${
              event?.time ? new Date(event.time).toLocaleDateString() : "TBD"
            }\n\nDownload Evertwine to join!`,
          url: `https://evertwine.app/event/${event?.id}`,
        };

      case "app":
      default:
        return {
          title: "Join me on Evertwine!",
          message:
            customMessage ||
            `Hey! I'm using Evertwine to meet amazing people and join cool meetups in our area. You should check it out! 🌟\n\nConnect with like-minded people, join events, and build meaningful relationships.\n\nDownload Evertwine now!`,
          url: "https://evertwine.app",
        };
    }
  };

  const handleShare = async () => {
    try {
      const shareContent = getShareContent();
      const result = await Share.share({
        title: shareContent.title,
        message: `${shareContent.message}\n\n${shareContent.url}`,
        url: shareContent.url,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {

        } else {

        }
      }
    } catch (error) {

      Alert.alert("Error", "Unable to share at this time. Please try again.");
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "small":
        return 16;
      case "large":
        return 28;
      default:
        return 20;
    }
  };

  const getButtonStyle = () => {
    const baseStyle = [styles.button, { backgroundColor: colors.primary }];

    switch (size) {
      case "small":
        return [...baseStyle, styles.smallButton];
      case "large":
        return [...baseStyle, styles.largeButton];
      default:
        return [...baseStyle, styles.mediumButton];
    }
  };

  if (variant === "icon") {
    return (
      <TouchableOpacity
        style={[styles.iconButton, style]}
        onPress={handleShare}
      >
        <Ionicons
          name="share-outline"
          size={getIconSize()}
          color={colors.primary}
        />
      </TouchableOpacity>
    );
  }

  if (variant === "text") {
    return (
      <TouchableOpacity
        style={[styles.textButton, style]}
        onPress={handleShare}
      >
        <Text
          style={[styles.textButtonText, { color: colors.primary }, textStyle]}
        >
          Share
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={[getButtonStyle(), style]} onPress={handleShare}>
      <Ionicons
        name="share-outline"
        size={getIconSize()}
        color={colors.onPrimary}
      />
      <Text style={[styles.buttonText, { color: colors.onPrimary }, textStyle]}>
        Share
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 6,
  },
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mediumButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  largeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  textButton: {
    padding: 8,
  },
  textButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
