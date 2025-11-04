import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Post } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";
import { useAuthStore } from "../hooks/useAuthStore";
import { normalizePostMessage } from "../utils/postTextNormalizer";

const { width } = Dimensions.get("window");

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string, message: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const navigation = useNavigation<any>();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  const isLiked = currentUser ? post.likes.includes(currentUser.uid) : false;

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
            { backgroundColor: colors.announcement },
          ]}
        >
          <Ionicons name="megaphone" size={12} color={colors.onAnnouncement} />
          <Text
            style={[styles.announcementText, { color: colors.onAnnouncement }]}
          >
            Announcement
          </Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            // Don't navigate if clicking on own avatar
            if (currentUser?.uid && post.userId === currentUser.uid) {
              return;
            }
            navigation.navigate("UserProfile", {
              userId: post.userId,
            });
          }}
          activeOpacity={currentUser?.uid === post.userId ? 1 : 0.7}
          disabled={currentUser?.uid === post.userId}
        >
          {post.userAvatar ? (
            <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: colors.border }]}>
              <Ionicons name="person" size={20} color={colors.textTertiary} />
            </View>
          )}
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {post.userName}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {formatTime(post.createdAt)}
          </Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{post.title}</Text>
        <Text style={[styles.message, { color: colors.textSecondary }]}>
          {normalizePostMessage(post.message)}
        </Text>
      </View>

      {/* Images */}
      {post.images && post.images.length > 0 && (
        <FlatList
          data={post.images}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.imagesContainer}
          keyExtractor={(item, index) => `image-${index}`}
          renderItem={({ item: image }) => (
            <Image source={{ uri: image }} style={styles.postImage} />
          )}
        />
      )}

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike?.(post.id)}
        >
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={20}
            color={isLiked ? "#EF4444" : colors.textSecondary}
          />
          <Text
            style={[
              styles.actionText,
              { color: isLiked ? "#EF4444" : colors.textSecondary },
            ]}
          >
            {post.likes.length > 0 ? post.likes.length : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setShowComments(!showComments)}
        >
          <Ionicons
            name="chatbubble-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {post.comments.length > 0 ? `${post.comments.length}` : "Comment"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments Section */}
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
          {user && (
            <View style={styles.commentInputContainer}>
              <Image
                source={{ uri: user.photoURL || "" }}
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
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
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
