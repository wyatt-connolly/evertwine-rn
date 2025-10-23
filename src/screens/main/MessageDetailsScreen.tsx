import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Message, MessageRoom, User } from "../../types";
import { DataService } from "../../services/DataService";

interface MessageDetailsScreenProps {
  route: {
    params: {
      roomId: string;
    };
  };
  navigation: any;
}

export default function MessageDetailsScreen({
  route,
  navigation,
}: MessageDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { roomId } = route.params;

  // State management
  const [room, setRoom] = useState<MessageRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  // Load initial data
  useEffect(() => {
    console.log("📱 MessageDetailsScreen mounted with roomId:", roomId);
    loadInitialData();
  }, [roomId]);

  // Set up real-time message subscription
  useEffect(() => {
    if (!roomId) return;

    console.log("🔄 Setting up real-time subscription for room:", roomId);
    const unsubscribe = DataService.setupMessageListener(
      roomId,
      (newMessages) => {
        console.log("🔄 Real-time subscription received messages:", newMessages.length);
        setMessages(newMessages);
        // Auto-scroll to bottom on new message
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      console.log("🔄 Cleaning up real-time subscription for room:", roomId);
      unsubscribe();
    };
  }, [roomId]);

  const loadInitialData = async () => {
    try {
      console.log("📱 Loading message data for room:", roomId);
      setIsLoading(true);

      // Fetch room details
      console.log("📱 Fetching room details...");
      const roomData = await DataService.getMessageRoom(roomId);
      console.log("📱 Room data:", roomData);
      if (!roomData) {
        console.log("📱 Room not found, navigating back");
        Alert.alert("Error", "Room not found");
        navigation.goBack();
        return;
      }
      setRoom(roomData);

      // Fetch messages
      console.log("📱 Fetching messages...");
      const messagesData = await DataService.getMessages(roomId);
      console.log("📱 Messages fetched:", messagesData.length);
      setMessages(messagesData);

      // Fetch all participant user data
      console.log("📱 Fetching participant users:", roomData.participants);
      const participantUsers = await DataService.getUsersByIds(
        roomData.participants
      );
      console.log("📱 Users fetched:", participantUsers.length);
      const usersMap: Record<string, User> = {};
      participantUsers.forEach((user) => {
        usersMap[user.uid] = user;
      });
      setUsers(usersMap);
      console.log("📱 Users map created:", Object.keys(usersMap));
    } catch (error) {
      console.error("📱 Error loading message data:", error);
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !room) return;

    console.log("📤 Sending message:", newMessage.trim());
    console.log("📤 Current user:", currentUser.uid);
    console.log("📤 Room ID:", roomId);
    
    setIsSending(true);
    try {
      const message: Partial<Message> = {
        messageRoomRef: roomId,
        senderRef: currentUser.uid,
        text: newMessage.trim(),
        messageType: "text",
        isEdited: false,
        reactions: {},
        isRead: false,
        readBy: {},
        isDeleted: false,
      };

      console.log("📤 Message object created:", message);
      const result = await DataService.sendMessage(message);
      console.log("📤 Message send result:", result);
      setNewMessage("");
    } catch (error) {
      console.error("📤 Error sending message:", error);
      Alert.alert("Error", "Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getSenderName = (senderId: string): string => {
    if (senderId === currentUser?.uid) return "You";
    return users[senderId]?.displayName || "Unknown User";
  };

  const getSenderAvatar = (senderId: string): string | null => {
    if (senderId === currentUser?.uid)
      return (currentUser as any).profilePictures?.[0] || null;
    return users[senderId]?.profilePictures?.[0] || null;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderRef === currentUser?.uid;
    const senderName = getSenderName(item.senderRef);
    const senderAvatar = getSenderAvatar(item.senderRef);

    return (
      <View
        style={[
          styles.messageContainer,
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
        ]}
      >
        {!isCurrentUser && (
          <View style={styles.messageHeader}>
            <Image
              source={{ uri: senderAvatar || "https://via.placeholder.com/40" }}
              style={styles.avatar}
            />
            <Text style={[styles.senderName, { color: colors.textSecondary }]}>
              {senderName}
            </Text>
          </View>
        )}
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isCurrentUser ? colors.primary : colors.surface,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isCurrentUser ? colors.onPrimary : colors.text },
            ]}
          >
            {item.text}
          </Text>
        </View>
        <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
          {new Date(item.createdTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    if (!room) return null;

    const otherParticipants = room.participants.filter(
      (id) => id !== currentUser?.uid
    );
    const otherUser =
      otherParticipants.length > 0 ? users[otherParticipants[0]] : null;

    return (
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          {otherUser && (
            <Image
              source={{
                uri:
                  otherUser.profilePictures?.[0] ||
                  "https://via.placeholder.com/40",
              }}
              style={styles.headerAvatar}
            />
          )}
          <View style={styles.headerText}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {room.name || otherUser?.displayName || "Chat"}
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              {room.type === "direct"
                ? "Direct message"
                : `${room.participants.length} participants`}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons
        name="chatbubbles-outline"
        size={64}
        color={colors.textTertiary}
      />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>
        No messages yet
      </Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        Start the conversation by sending a message!
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading messages...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {renderHeader()}

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {messages.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        )}

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            placeholderTextColor={colors.textTertiary}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              {
                backgroundColor: newMessage.trim()
                  ? colors.primary
                  : colors.border,
              },
            ]}
            onPress={handleSendMessage}
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <ActivityIndicator size="small" color={colors.onPrimary} />
            ) : (
              <Ionicons name="send" size={20} color={colors.onPrimary} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  menuButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  currentUserMessage: {
    alignItems: "flex-end",
  },
  otherUserMessage: {
    alignItems: "flex-start",
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  senderName: {
    fontSize: 12,
    fontWeight: "500",
  },
  messageBubble: {
    maxWidth: "80%",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
  keyboardView: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
});
