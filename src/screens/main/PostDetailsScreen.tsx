import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";

const { width } = Dimensions.get("window");

interface PostDetailsScreenProps {
  navigation: any;
  route: any;
}

export default function PostDetailsScreen({
  navigation,
  route,
}: PostDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [commentText, setCommentText] = useState("");
  const { post } = route.params;

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

  const handleComment = () => {
    if (commentText.trim() && currentUser) {
      // Here you would add the comment to the post
      console.log("Adding comment:", commentText.trim());
      setCommentText("");
    }
  };

  const handleShare = () => {
    // Here you would implement sharing functionality
    console.log("Sharing post:", post.id);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Post</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Post Content */}
        <View
          style={[
            styles.postContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
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

          {/* Post Header */}
          <View style={styles.postHeader}>
            <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
            <View style={styles.headerInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {post.userName}
              </Text>
              <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
                {formatTime(post.createdAt)}
              </Text>
            </View>
          </View>

          {/* Post Content */}
          <View style={styles.postContent}>
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
              {post.images.map((image: string, index: number) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.postImage}
                />
              ))}
            </ScrollView>
          )}
        </View>

        {/* Comments Section */}
        <View
          style={[
            styles.commentsContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.commentsTitle, { color: colors.text }]}>
            {post.comments.length} Comments
          </Text>

          {post.comments.map((comment: any) => (
            <View key={comment.id} style={styles.comment}>
              <Image
                source={{ uri: comment.userAvatar }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <View
                  style={[
                    styles.commentBubble,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text
                    style={[styles.commentUserName, { color: colors.text }]}
                  >
                    {comment.userName}
                  </Text>
                  <Text
                    style={[
                      styles.commentMessage,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {comment.message}
                  </Text>
                </View>
                <Text
                  style={[styles.commentTime, { color: colors.textTertiary }]}
                >
                  {formatTime(comment.createdAt)}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Comment Input */}
      {currentUser && (
        <View
          style={[
            styles.commentInputContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <Image
            source={{ uri: currentUser.photoURL || "" }}
            style={styles.commentInputAvatar}
          />
          <TextInput
            style={[
              styles.commentInput,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Write a comment..."
            placeholderTextColor={colors.textTertiary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: commentText.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handleComment}
            disabled={!commentText.trim()}
          >
            <Ionicons
              name="send"
              size={16}
              color={
                commentText.trim() ? colors.onPrimary : colors.textTertiary
              }
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  postContainer: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 12,
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
  postHeader: {
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
  postContent: {
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
  commentsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: 12,
    padding: 12,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  commentMessage: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentTime: {
    fontSize: 12,
    marginTop: 6,
    marginLeft: 12,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    gap: 12,
  },
  commentInputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
