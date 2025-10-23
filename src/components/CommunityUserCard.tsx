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

interface CommunityUserCardProps {
  user: User;
  variant?: "large" | "small" | "grid";
  onPress?: () => void;
  showBadge?: boolean;
  badgeText?: string;
  badgeColor?: string;
}

const { width: screenWidth } = Dimensions.get("window");

export default function CommunityUserCard({
  user,
  variant = "large",
  onPress,
  showBadge = false,
  badgeText,
  badgeColor = "#3B82F6",
}: CommunityUserCardProps) {
  const { colors } = useThemeStore();

  const getCardStyle = () => {
    switch (variant) {
      case "large":
        return {
          width: screenWidth * 0.7,
          height: 200,
          marginRight: 16,
        };
      case "small":
        return {
          width: screenWidth * 0.4,
          height: 160,
          marginRight: 12,
        };
      case "grid":
        return {
          width: (screenWidth - 60) / 2,
          height: 180,
          marginBottom: 16,
        };
      default:
        return {
          width: screenWidth * 0.7,
          height: 200,
          marginRight: 16,
        };
    }
  };

  const getImageSize = () => {
    switch (variant) {
      case "large":
        return 60;
      case "small":
        return 50;
      case "grid":
        return 55;
      default:
        return 60;
    }
  };

  const getTextSizes = () => {
    switch (variant) {
      case "large":
        return {
          name: 18,
          bio: 14,
          location: 12,
        };
      case "small":
        return {
          name: 16,
          bio: 12,
          location: 11,
        };
      case "grid":
        return {
          name: 16,
          bio: 13,
          location: 11,
        };
      default:
        return {
          name: 18,
          bio: 14,
          location: 12,
        };
    }
  };

  const cardStyle = getCardStyle();
  const imageSize = getImageSize();
  const textSizes = getTextSizes();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        cardStyle,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Profile Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: user.profilePictures[user.standoutPhotoIndex || 0],
          }}
          style={[
            styles.profileImage,
            {
              width: imageSize,
              height: imageSize,
            },
          ]}
          resizeMode="cover"
        />
        {user.isVerified === "verified" && (
          <View style={[styles.verifiedBadge, { backgroundColor: "#10B981" }]}>
            <Ionicons name="checkmark" size={12} color="#FFFFFF" />
          </View>
        )}
        {showBadge && badgeText && (
          <View style={[styles.activityBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <Text
          style={[
            styles.userName,
            { color: colors.text, fontSize: textSizes.name },
          ]}
          numberOfLines={1}
        >
          {user.displayName}
        </Text>
        
        <Text
          style={[
            styles.userBio,
            { color: colors.textSecondary, fontSize: textSizes.bio },
          ]}
          numberOfLines={variant === "grid" ? 2 : 1}
        >
          {user.bio}
        </Text>
        
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={12}
            color={colors.textTertiary}
          />
          <Text
            style={[
              styles.locationText,
              { color: colors.textTertiary, fontSize: textSizes.location },
            ]}
            numberOfLines={1}
          >
            {user.locationName}
          </Text>
        </View>

        {/* Activity Stats */}
        {variant === "large" && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {user.profileViews}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                views
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>
                {user.viewsThisWeek}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textTertiary }]}>
                this week
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Gradient Overlay for Large Cards */}
      {variant === "large" && (
        <View style={styles.gradientOverlay} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  profileImage: {
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  verifiedBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  activityBadge: {
    position: "absolute",
    top: -8,
    right: -8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  userInfo: {
    flex: 1,
    alignItems: "center",
  },
  userName: {
    fontWeight: "600",
    marginBottom: 4,
    textAlign: "center",
  },
  userBio: {
    textAlign: "center",
    marginBottom: 8,
    lineHeight: 16,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 4,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 8,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "600",
  },
  statLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: "rgba(0,0,0,0.1)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
});
