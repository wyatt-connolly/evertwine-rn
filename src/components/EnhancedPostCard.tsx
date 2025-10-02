import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import { useAuthStore } from "../hooks/useAuthStore";

const { width } = Dimensions.get("window");

interface EnhancedPostCardProps {
  post: Post;
  onComment?: (postId: string, message: string) => void;
}

export default function EnhancedPostCard({
  post,
  onComment,
}: EnhancedPostCardProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

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
    if (commentText.trim() && onComment) {
      onComment(post.id, commentText.trim());
      setCommentText("");
    }
  };

  // Get first 2 comments for preview
  const previewComments = post.comments.slice(0, 2);
  const hasMoreComments = post.comments.length > 2;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      {/* Announcement Badge */}
      {post.isAnnouncement && (
        <View
          style={[
            styles.announcementBadge,
            { backgroundColor: colors.primary },
          ]}
        >
          <Ionicons name="megaphone" size={12} color={colors.onPrimary} />
          <Text style={[styles.announcementText, { color: colors.onPrimary }]}>
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
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
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
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={20}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {post.comments.length > 0
              ? `${post.comments.length} Comments`
              : "Comment"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comment Preview */}
      {!showComments && previewComments.length > 0 && (
        <View
          style={[
            styles.commentPreview,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            },
          ]}
        >
          {previewComments.map((comment) => (
            <View key={comment.id} style={styles.previewComment}>
              <Image
                source={{ uri: comment.userAvatar }}
                style={styles.previewAvatar}
              />
              <View style={styles.previewCommentContent}>
                <Text style={[styles.previewUserName, { color: colors.text }]}>
                  {comment.userName}
                </Text>
                <Text
                  style={[
                    styles.previewCommentText,
                    { color: colors.textSecondary },
                  ]}
                  numberOfLines={2}
                >
                  {comment.message}
                </Text>
              </View>
            </View>
          ))}
          {hasMoreComments && (
            <TouchableOpacity
              style={styles.viewAllComments}
              onPress={() => setShowComments(true)}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>
                View all {post.comments.length} comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Full Comments Section */}
      {showComments && (
        <View
          style={[
            styles.commentsSection,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* Existing Comments */}
          {post.comments.length > 0 && (
            <ScrollView style={styles.commentsList}>
              {post.comments.map((comment) => (
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
                      style={[
                        styles.commentTime,
                        { color: colors.textTertiary },
                      ]}
                    >
                      {formatTime(comment.createdAt)}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Add Comment Input */}
          {currentUser && (
            <View style={styles.commentInputContainer}>
              <Image
                source={{ uri: currentUser.photoURL || "" }}
                style={styles.commentAvatar}
              />
              <TextInput
                style={[
                  styles.commentInput,
                  {
                    backgroundColor: colors.surface,
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
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
  commentPreview: {
    borderTopWidth: 1,
    padding: 12,
  },
  previewComment: {
    flexDirection: "row",
    marginBottom: 8,
  },
  previewAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  previewCommentContent: {
    flex: 1,
  },
  previewUserName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  previewCommentText: {
    fontSize: 13,
    lineHeight: 16,
  },
  viewAllComments: {
    paddingVertical: 4,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
  },
  commentsSection: {
    borderTopWidth: 1,
    padding: 12,
  },
  commentsList: {
    maxHeight: 200,
  },
  comment: {
    flexDirection: "row",
    marginBottom: 12,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    borderRadius: 12,
    padding: 10,
  },
  commentUserName: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
  },
  commentMessage: {
    fontSize: 13,
    lineHeight: 18,
  },
  commentTime: {
    fontSize: 11,
    marginTop: 4,
    marginLeft: 10,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginTop: 12,
    gap: 8,
  },
  commentInput: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
