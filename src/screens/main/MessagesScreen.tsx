import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  TextInput,
  FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { MessageRoom, Message } from "../../types";

// Mock message rooms data
const mockMessageRooms: MessageRoom[] = [
  {
    id: "room1",
    type: "direct",
    participants: ["user1", "user2"],
    admins: [],
    name: "Maya Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    lastMessage: {
      text: "Thanks for the great yoga session today!",
      senderRef: "users/user2",
      timestamp: new Date("2024-09-13T15:30:00"),
      messageType: "text"
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true
    },
    createdTime: new Date("2024-09-10"),
    updatedTime: new Date("2024-09-13T15:30:00")
  },
  {
    id: "room2",
    type: "meetup",
    participants: ["user1", "user3", "user4", "user5"],
    admins: ["user3"],
    name: "Tech Networking Happy Hour",
    avatar: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    meetupRef: "meetups/meetup2",
    lastMessage: {
      text: "Looking forward to meeting everyone tomorrow!",
      senderRef: "users/user4",
      timestamp: new Date("2024-09-13T14:15:00"),
      messageType: "text"
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true
    },
    createdTime: new Date("2024-09-12"),
    updatedTime: new Date("2024-09-13T14:15:00")
  },
  {
    id: "room3",
    type: "group",
    participants: ["user1", "user6", "user7", "user8"],
    admins: ["user1"],
    name: "Photography Enthusiasts",
    avatar: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    description: "Share your best shots and photography tips",
    lastMessage: {
      text: "Check out this amazing sunset shot from yesterday!",
      senderRef: "users/user6",
      timestamp: new Date("2024-09-13T12:45:00"),
      messageType: "image"
    },
    settings: {
      allowInvites: true,
      allowMedia: true,
      allowReactions: true
    },
    createdTime: new Date("2024-09-01"),
    updatedTime: new Date("2024-09-13T12:45:00")
  }
];

export default function MessagesScreen() {
  const { colors } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "unread" | "groups">("all");

  const filteredRooms = mockMessageRooms.filter(room => {
    const matchesSearch = room.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.lastMessage?.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "unread") {
      return matchesSearch && room.lastMessage && !room.lastMessage.isRead;
    }
    if (activeTab === "groups") {
      return matchesSearch && room.type === "group";
    }
    return matchesSearch;
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

  const renderMessageRoom = ({ item: room }: { item: MessageRoom }) => (
    <TouchableOpacity 
      style={[styles.messageRoom, { backgroundColor: colors.surface }]}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: room.avatar }} style={styles.avatar} />
        {room.type === "group" && (
          <View style={[styles.groupIndicator, { backgroundColor: colors.primary }]}>
            <Ionicons name="people" size={12} color={colors.onPrimary} />
          </View>
        )}
        {room.type === "meetup" && (
          <View style={[styles.meetupIndicator, { backgroundColor: colors.secondary }]}>
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
              !room.lastMessage?.isRead && { color: colors.text, fontWeight: "600" }
            ]}
            numberOfLines={1}
          >
            {room.lastMessage?.text || "No messages yet"}
          </Text>
        </View>
        
        {room.participants.length > 2 && (
          <Text style={[styles.participantCount, { color: colors.textTertiary }]}>
            {room.participants.length} participants
          </Text>
        )}
      </View>
      
      {room.lastMessage && !room.lastMessage.isRead && (
        <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
        <TouchableOpacity style={styles.newMessageButton}>
          <Ionicons name="create-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search conversations..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["all", "unread", "groups"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary }
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab ? colors.onPrimary : colors.textSecondary }
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Message Rooms List */}
      <FlatList
        data={filteredRooms}
        renderItem={renderMessageRoom}
        keyExtractor={(item) => item.id}
        style={styles.messageList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No conversations yet
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Start a conversation by joining a meetup or connecting with someone
            </Text>
          </View>
        }
      />
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
  newMessageButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
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
    padding: 16,
    borderRadius: 12,
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
    marginLeft: 8,
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
