import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { User } from "../types";

const { width: screenWidth } = Dimensions.get("window");
const CARD_WIDTH = (screenWidth - 60) / 3; // 3 cards with padding
const CARD_HEIGHT = 160;

interface FeaturedMemberCardProps {
  user: User;
  onPress: (user: User) => void;
  isCenter?: boolean;
}

export default function FeaturedMemberCard({
  user,
  onPress,
  isCenter = false,
}: FeaturedMemberCardProps) {
  const { colors } = useThemeStore();

  const getDisplayInterests = () => {
    if (!user.interests || user.interests.length === 0) return [];
    return user.interests.slice(0, 2);
  };

  const getLocationDisplay = () => {
    if (user.locationName) {
      return user.locationName.split(",")[0]; // Just city name
    }
    return "Location";
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.surface },
        isCenter ? styles.centerCard : styles.sideCard,
      ]}
      onPress={() => onPress(user)}
      activeOpacity={0.8}
    >
      {/* Profile Image */}
      <View
        style={[
          styles.imageContainer,
          isCenter ? styles.centerImageContainer : styles.sideImageContainer,
        ]}
      >
        {user.profilePictures && user.profilePictures.length > 0 ? (
          <Image
            source={{ uri: user.profilePictures[0] }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              styles.profileImage,
              {
                backgroundColor: colors.border,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <Ionicons
              name="person"
              size={isCenter ? 60 : 40}
              color={colors.textTertiary}
            />
          </View>
        )}
        {user.isVerified === "verified" && isCenter && (
          <View
            style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="checkmark" size={12} color={colors.onPrimary} />
          </View>
        )}
      </View>

      {/* User Info - Only show for center card */}
      {isCenter && (
        <>
          <View style={styles.userInfo}>
            <Text
              style={[styles.name, { color: colors.text }]}
              numberOfLines={1}
            >
              {user.displayName}
            </Text>
            <Text style={[styles.age, { color: colors.textSecondary }]}>
              {user.age} • {getLocationDisplay()}
            </Text>
          </View>

          {/* Interests */}
          <View style={styles.interestsContainer}>
            {getDisplayInterests().map((interest, index) => (
              <View
                key={index}
                style={[
                  styles.interestTag,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Text
                  style={[styles.interestText, { color: colors.primary }]}
                  numberOfLines={1}
                >
                  {interest}
                </Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Online Indicator */}
      {user.lastActive && (
        <View style={styles.onlineIndicator}>
          <View
            style={[
              styles.onlineDot,
              {
                backgroundColor:
                  new Date().getTime() - new Date(user.lastActive).getTime() <
                  300000 // 5 minutes
                    ? "#4CAF50"
                    : colors.border,
              },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: "relative",
  },
  centerCard: {
    width: screenWidth * 0.9,
    height: 200,
    opacity: 1,
    transform: [{ scale: 1 }],
  },
  sideCard: {
    width: screenWidth * 0.05,
    height: 140,
    opacity: 0.5,
    transform: [{ scale: 0.7 }],
  },
  imageContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 8,
    position: "relative",
  },
  centerImageContainer: {
    height: 120,
  },
  sideImageContainer: {
    height: 80,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  verifiedBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfo: {
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  age: {
    fontSize: 12,
    fontWeight: "400",
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  interestTag: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 4,
    marginBottom: 2,
  },
  interestText: {
    fontSize: 10,
    fontWeight: "500",
  },
  onlineIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
