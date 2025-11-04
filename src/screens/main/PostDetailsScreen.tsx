import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  SafeAreaView,
  Share,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { normalizePostMessage } from "../../utils/postTextNormalizer";
import { PostComment } from "../../types";

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
  const [comments, setComments] = useState<PostComment[]>([]);
  const { post } = route.params;

  const isPostCreator = post.userId === currentUser?.uid;

  console.log("📱 [PostDetails] Rendering with post:", post.id);
  console.log("📱 [PostDetails] Current user:", currentUser?.uid);
  console.log("📱 [PostDetails] Post comments count:", comments.length);
  console.log("📱 [PostDetails] Is post creator:", isPostCreator);

  // Load comments when screen mounts
  useEffect(() => {
    const loadComments = async () => {
      try {
        const loadedComments = await SupabaseDataService.getPostComments(
          post.id
        );
        setComments(loadedComments);
        console.log(
          "✅ [PostDetails] Loaded",
          loadedComments.length,
          "comments"
        );
      } catch (error) {
        console.error("❌ [PostDetails] Error loading comments:", error);
      }
    };
    loadComments();
  }, [post.id]);

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

  const handleComment = async () => {
    console.log("💬 [PostDetails] handleComment called");
    console.log("💬 [PostDetails] commentText:", commentText);
    console.log("💬 [PostDetails] currentUser:", currentUser?.uid);

    if (commentText.trim() && currentUser) {
      try {
        console.log("✅ [PostDetails] Creating comment...");
        const comment = await SupabaseDataService.createComment({
          userId: currentUser.uid,
          message: commentText.trim(),
          postId: post.id,
        });
        console.log(
          "✅ [PostDetails] Comment created successfully:",
          comment.id
        );
        setCommentText("");
        // Add the new comment to the list
        setComments((prev) => [...prev, comment]);
      } catch (error) {
        console.error("❌ [PostDetails] Error creating comment:", error);
      }
    } else {
      console.log(
        "⚠️ [PostDetails] Cannot create comment: missing text or user"
      );
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        title: `Check out this post on Evertwine`,
        message: `"${post?.title || post?.message}"`,
        url: `https://evertwine.app/post/${post?.id}`,
      });
    } catch (error) {
      // User cancelled or error occurred
    }
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
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("UserProfile", {
                  userId: post.userId,
                });
              }}
              activeOpacity={0.7}
            >
              {post.userAvatar ? (
                <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    styles.placeholderAvatar,
                    { backgroundColor: colors.border },
                  ]}
                >
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

          {/* Post Content */}
          <View style={styles.postContent}>
            <Text style={[styles.title, { color: colors.text }]}>
              {post.title}
            </Text>
            <Text style={[styles.message, { color: colors.textSecondary }]}>
              {normalizePostMessage(post.message)}
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
            {comments.length} Comments
          </Text>

          {comments.map((comment: any) => {
            const isCommentCreator = comment.userId === post.userId;
            const isCurrentUser = comment.userId === currentUser?.uid;

            return (
              <View key={comment.id} style={styles.comment}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("UserProfile", {
                      userId: comment.userId,
                    });
                  }}
                  activeOpacity={0.7}
                >
                  {comment.userAvatar ? (
                    <Image
                      source={{ uri: comment.userAvatar }}
                      style={styles.commentAvatar}
                    />
                  ) : (
                    <View
                      style={[
                        styles.commentAvatar,
                        styles.placeholderAvatar,
                        { backgroundColor: colors.border },
                      ]}
                    >
                      <Ionicons
                        name="person"
                        size={16}
                        color={colors.textTertiary}
                      />
                    </View>
                  )}
                </TouchableOpacity>
                <View style={styles.commentContent}>
                  <View
                    style={[
                      styles.commentBubble,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <View style={styles.commentHeaderRow}>
                      <Text
                        style={[styles.commentUserName, { color: colors.text }]}
                      >
                        {comment.userName}
                      </Text>
                      {isCommentCreator && (
                        <View
                          style={[
                            styles.creatorBadge,
                            { backgroundColor: colors.primary },
                          ]}
                        >
                          <Text
                            style={[
                              styles.creatorBadgeText,
                              { color: colors.onPrimary },
                            ]}
                          >
                            OP
                          </Text>
                        </View>
                      )}
                      {isCurrentUser && !isCommentCreator && (
                        <View
                          style={[
                            styles.youBadge,
                            { backgroundColor: colors.border },
                          ]}
                        >
                          <Text
                            style={[
                              styles.youBadgeText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            You
                          </Text>
                        </View>
                      )}
                    </View>
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
            );
          })}
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
          {currentUser.profilePictures?.[0] ? (
            <Image
              source={{ uri: currentUser.profilePictures[0] }}
              style={styles.commentInputAvatar}
            />
          ) : (
            <View
              style={[
                styles.commentInputAvatar,
                styles.placeholderAvatar,
                { backgroundColor: colors.border },
              ]}
            >
              <Ionicons name="person" size={16} color={colors.textTertiary} />
            </View>
          )}
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
  placeholderAvatar: {
    justifyContent: "center",
    alignItems: "center",
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
  commentHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  commentUserName: {
    fontSize: 14,
    fontWeight: "600",
  },
  creatorBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  creatorBadgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  youBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  youBadgeText: {
    fontSize: 11,
    fontWeight: "600",
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
