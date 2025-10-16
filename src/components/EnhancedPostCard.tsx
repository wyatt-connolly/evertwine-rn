import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";

const { width } = Dimensions.get("window");

interface EnhancedPostCardProps {
  post: Post;
}

export default function EnhancedPostCard({ post }: EnhancedPostCardProps) {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  return (
    <TouchableOpacity
      activeOpacity={0.95}
      onPress={() => {
        navigation.navigate("PostDetails", { post });
      }}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Announcement Badge */}
        {post.isAnnouncement && (
          <View
            style={[
              styles.announcementBadge,
              { backgroundColor: colors.announcement },
            ]}
          >
            <Ionicons
              name="megaphone"
              size={12}
              color={colors.onAnnouncement}
            />
            <Text
              style={[
                styles.announcementText,
                { color: colors.onAnnouncement },
              ]}
            >
              Announcement
            </Text>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {post.userName}
            </Text>
            <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
              {formatTime(post.createdAt)}
            </Text>
          </View>
          <TouchableOpacity style={styles.shareButton}>
            <Ionicons
              name="share-outline"
              size={22}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            {post.title}
          </Text>
          <Text style={[styles.message, { color: colors.textSecondary }]}>
            {post.message}
          </Text>
        </View>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.imagesContainer}
          >
            {post.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.postImage}
              />
            ))}
          </ScrollView>
        )}

        {/* Actions */}
        <View style={[styles.actions, { borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              navigation.navigate("PostDetails", { post });
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={[styles.actionText, { color: colors.textSecondary }]}>
              Comments
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  announcementBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  announcementText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
  },
  timestamp: {
    fontSize: 12,
    marginTop: 2,
  },
  shareButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  imagesContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: width * 0.7,
    height: width * 0.5,
    borderRadius: 12,
    marginRight: 8,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 4,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
