import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { MessageRoom } from "../../types";
import { DataService } from "../../services/DataService";
import { EmptyMessagesState, LoadingState } from "../../components/EmptyStates";
import LoadingIndicator from "../../components/LoadingIndicator";

// Mock message rooms data
const mockMessageRooms: MessageRoom[] = [
  {
    id: "room1",
    type: "direct",
    participants: ["user1", "user2"],
    admins: [],
    name: "Maya Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    lastMessage: {
      text: "Thanks for the great yoga session today!",
      senderRef: "users/user2",
      timestamp: new Date("2024-09-13T15:30:00"),
      messageType: "text",
      isRead: false,
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true,
    },
    createdTime: new Date("2024-09-10"),
    updatedTime: new Date("2024-09-13T15:30:00"),
  },
  {
    id: "room2",
    type: "meetup",
    participants: ["user1", "user3", "user4", "user5"],
    admins: ["user3"],
    name: "Tech Networking Happy Hour",
    avatar:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    meetupRef: "meetups/meetup2",
    lastMessage: {
      text: "Looking forward to meeting everyone tomorrow!",
      senderRef: "users/user4",
      timestamp: new Date("2024-09-13T14:15:00"),
      messageType: "text",
      isRead: true,
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true,
    },
    createdTime: new Date("2024-09-12"),
    updatedTime: new Date("2024-09-13T14:15:00"),
  },
  {
    id: "room3",
    type: "group",
    participants: ["user1", "user6", "user7", "user8"],
    admins: ["user1"],
    name: "Photography Enthusiasts",
    avatar:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    description: "Share your best shots and photography tips",
    lastMessage: {
      text: "Check out this amazing sunset shot from yesterday!",
      senderRef: "users/user6",
      timestamp: new Date("2024-09-13T12:45:00"),
      messageType: "image",
      isRead: false,
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true,
    },
    createdTime: new Date("2024-09-01"),
    updatedTime: new Date("2024-09-13T12:45:00"),
  },
];

export default function MessagesScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "groups">("all");
  const [messageRooms, setMessageRooms] = useState<MessageRoom[]>([]);

  // Load message rooms using DataService
  useEffect(() => {
    const loadMessageRooms = async () => {
      try {
        const result = await DataService.getMessageRooms("user1");
        if (result.rooms) {
          setMessageRooms(result.rooms);
        }
      } catch (error) {
        console.error("Error loading message rooms:", error);
        // In developer mode, fallback to mock data if DataService fails
        if (DataService.isInDeveloperMode()) {
          setMessageRooms(mockMessageRooms);
        }
        // In Firebase mode, keep empty to show empty state
      } finally {
        setIsLoading(false);
      }
    };

    loadMessageRooms();
  }, []);

  const filteredRooms = messageRooms.filter((room) => {
    if (activeTab === "groups") {
      return room.type === "group";
    }
    return true; // "all" tab
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      const minutes = Math.floor(diff / (1000 * 60));
      return minutes > 0 ? `${minutes}m` : "now";
    }
  };

  const handleOpenMessage = async (roomId: string) => {
    setIsLoading(true);
    // Simulate loading message data
    await new Promise((resolve) => setTimeout(resolve, 800));
    navigation.navigate("MessageDetails", { roomId });
    setIsLoading(false);
  };

  const renderMessageRoom = ({ item: room }: { item: MessageRoom }) => (
    <TouchableOpacity
      style={[styles.messageRoom, { backgroundColor: colors.surface }]}
      onPress={() => handleOpenMessage(room.id)}
    >
      {/* Unread dot on the left */}
      {room.lastMessage && !room.lastMessage.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}

      <View style={styles.avatarContainer}>
        <Image source={{ uri: room.avatar }} style={styles.avatar} />
        {room.type === "group" && (
          <View
            style={[styles.groupIndicator, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="people" size={12} color={colors.onPrimary} />
          </View>
        )}
        {room.type === "meetup" && (
          <View
            style={[
              styles.meetupIndicator,
              { backgroundColor: colors.secondary },
            ]}
          >
            <Ionicons name="calendar" size={12} color={colors.onSecondary} />
          </View>
        )}
      </View>

      <View style={styles.messageContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.roomName, { color: colors.text }]}>
            {room.name}
          </Text>
          <Text style={[styles.messageTime, { color: colors.textTertiary }]}>
            {room.lastMessage && formatTime(room.lastMessage.timestamp)}
          </Text>
        </View>

        <View style={styles.messagePreview}>
          {room.lastMessage?.messageType === "image" && (
            <Ionicons name="image" size={16} color={colors.textSecondary} />
          )}
          <Text
            style={[
              styles.lastMessage,
              { color: colors.textSecondary },
              !room.lastMessage?.isRead && {
                color: colors.text,
                fontWeight: "600",
              },
            ]}
            numberOfLines={1}
          >
            {room.lastMessage?.text || "No messages yet"}
          </Text>
        </View>

        {room.participants.length > 2 && (
          <Text
            style={[styles.participantCount, { color: colors.textTertiary }]}
          >
            {room.participants.length} participants
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["all", "groups"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab ? colors.onPrimary : colors.textSecondary,
                },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message Rooms List */}
      {isLoading ? (
        <LoadingState style={{ margin: 20 }} />
      ) : (
        <FlatList
          data={filteredRooms}
          renderItem={renderMessageRoom}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyMessagesState
              onActionPress={() => navigation.navigate("Home")}
            />
          }
        />
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <LoadingIndicator
          overlay={true}
          text="Loading messages..."
          color={colors.primary}
        />
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
    borderRadius: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageRoom: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  groupIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  meetupIndicator: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  roomName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  messageTime: {
    fontSize: 12,
  },
  messagePreview: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
    marginLeft: 4,
  },
  participantCount: {
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
    alignSelf: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
});
