import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusUpdate } from "../types";
import { useThemeStore } from "../hooks/useThemeStore";

interface StatusUpdateCardProps {
  statusUpdate: StatusUpdate;
  onPress?: () => void;
  onLike?: (statusId: string) => void;
  onComment?: (statusId: string, message: string) => void;
  style?: any;
}

export default function StatusUpdateCard({
  statusUpdate,
  onPress,
  onLike,
  onComment,
  style,
}: StatusUpdateCardProps) {
  const { colors } = useThemeStore();

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

  const getActionText = () => {
    switch (statusUpdate.type) {
      case "joined_meetup":
        return "got into";
      case "joined_happy_hour":
        return "got into";
      case "created_meetup":
        return "created";
      case "created_happy_hour":
        return "created";
      default:
        return "got into";
    }
  };

  const getActionIcon = () => {
    switch (statusUpdate.type) {
      case "joined_meetup":
      case "created_meetup":
        return "people";
      case "joined_happy_hour":
      case "created_happy_hour":
        return "wine";
      default:
        return "people";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.statusCard, { backgroundColor: colors.surface }, style]}
      onPress={onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <Image source={{ uri: statusUpdate.userAvatar }} style={styles.avatar} />
        <View style={styles.headerInfo}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {statusUpdate.userName}
          </Text>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>
            {formatTime(statusUpdate.createdAt)}
          </Text>
        </View>
        <View style={styles.actionIcon}>
          <Ionicons
            name={getActionIcon() as any}
            size={16}
            color={colors.primary}
          />
        </View>
      </View>

      {/* Status Content */}
      <View style={styles.statusContent}>
        <Text style={[styles.statusText, { color: colors.text }]}>
          {getActionText()} a{" "}
          <Text style={[styles.targetTitle, { color: colors.primary }]}>
            {statusUpdate.targetType === "meetup" ? "meetup" : "happy hour"}
          </Text>
        </Text>
        
        {/* Target Preview */}
        <View style={styles.targetPreview}>
          {statusUpdate.targetImage && (
            <Image
              source={{ uri: statusUpdate.targetImage }}
              style={styles.targetImage}
            />
          )}
          <View style={styles.targetInfo}>
            <Text style={[styles.targetTitleText, { color: colors.text }]}>
              {statusUpdate.targetTitle}
            </Text>
            <View style={styles.targetMeta}>
              <Ionicons
                name={statusUpdate.targetType === "meetup" ? "people" : "wine"}
                size={12}
                color={colors.textSecondary}
              />
              <Text style={[styles.targetType, { color: colors.textSecondary }]}>
                {statusUpdate.targetType === "meetup" ? "Meetup" : "Happy Hour"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onLike?.(statusUpdate.id)}
        >
          <Ionicons
            name="heart-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {statusUpdate.likes.length > 0 ? statusUpdate.likes.length : "Like"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onComment?.(statusUpdate.id, "")}
        >
          <Ionicons
            name="chatbubble-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {statusUpdate.comments.length > 0 ? statusUpdate.comments.length : "Comment"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Ionicons
            name="share-outline"
            size={16}
            color={colors.textSecondary}
          />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            Share
          </Text>
        </TouchableOpacity>
      </View>

      {/* Comments */}
      {statusUpdate.comments.length > 0 && (
        <View style={[styles.commentsSection, { borderTopColor: colors.border }]}>
          {statusUpdate.comments.slice(0, 2).map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={[styles.commentText, { color: colors.text }]}>
                <Text style={[styles.commentUserName, { color: colors.text, fontWeight: "600" }]}>
                  {comment.userName}
                </Text>{" "}
                {comment.message}
              </Text>
            </View>
          ))}
          {statusUpdate.comments.length > 2 && (
            <TouchableOpacity style={styles.viewMoreComments}>
              <Text style={[styles.viewMoreText, { color: colors.textSecondary }]}>
                View {statusUpdate.comments.length - 2} more comments
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  statusContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  statusText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 12,
  },
  targetTitle: {
    fontWeight: "600",
  },
  targetPreview: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.02)",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
  },
  targetImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  targetInfo: {
    flex: 1,
  },
  targetTitleText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  targetMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  targetType: {
    fontSize: 12,
    marginLeft: 4,
  },
  actions: {
    flexDirection: "row",
    borderTopWidth: 1,
    paddingVertical: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "500",
  },
  commentsSection: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  comment: {
    marginBottom: 8,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 18,
  },
  commentUserName: {
    fontWeight: "600",
  },
  viewMoreComments: {
    marginTop: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontStyle: "italic",
  },
});
