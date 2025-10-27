import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { MessageRoom } from "../../types";
import { DataService } from "../../services/DataService";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { EmptyMessagesState, LoadingState } from "../../components/EmptyStates";
import LoadingIndicator from "../../components/LoadingIndicator";

export default function MessagesScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "groups">("all");
  const [messageRooms, setMessageRooms] = useState<MessageRoom[]>([]);

  // Load message rooms from Supabase
  const loadMessageRooms = async () => {
    if (!currentUser?.uid) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Test database schema first
      await SupabaseDataService.testDatabaseSchema();

      const rooms = await SupabaseDataService.getMessageRooms(currentUser.uid);
      console.log("MessagesScreen: Loaded message rooms:", rooms);
      setMessageRooms(rooms);
    } catch (error) {
      console.error("Error loading message rooms:", error);
      setMessageRooms([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessageRooms();
  }, [currentUser?.uid]);

  // Refresh message rooms when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log("MessagesScreen: Screen focused, refreshing message rooms");
      loadMessageRooms();
    }, [currentUser?.uid])
  );

  // Manual refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await loadMessageRooms();
    setRefreshing(false);
  };

  // Set up real-time listener for message rooms
  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = DataService.setupMessageRoomsListener(
      currentUser.uid,
      (rooms) => {
        console.log("MessagesScreen: Received updated message rooms:", rooms);
        setMessageRooms(rooms);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [currentUser?.uid]);

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
    // Navigate to full-screen message view
    navigation.navigate("MessageDetailsFullScreen", { roomId });
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
            {room.lastMessage?.text ||
              (room.type === "meetup"
                ? "Group chat started"
                : room.type === "group"
                ? "Group chat started"
                : "Start a conversation")}
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
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Messages</Text>
      </View>

      {/* Tab Navigation */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          }
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
