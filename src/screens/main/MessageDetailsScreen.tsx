import { useState, useRef, useEffect, useCallback } from "react";
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
  Modal,
  Animated,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { Message, MessageRoom, User, Meetup } from "../../types";
import { DataService } from "../../services/DataService";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import { NotificationService } from "../../services/NotificationService";

interface MessageDetailsScreenProps {
  route: {
    params: {
      roomId: string;
      hideBottomNav?: boolean;
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
  const { roomId, hideBottomNav = false } = route.params;

  // Check if this is being used as MessageDetailsFullScreen
  const isFullScreen =
    navigation
      .getState()
      ?.routes?.find((r: any) => r.name === "MessageDetailsFullScreen") !==
    undefined;

  // State management
  const [room, setRoom] = useState<MessageRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [meetup, setMeetup] = useState<Meetup | null>(null);

  // Animation values
  const menuScale = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;

  const flatListRef = useRef<FlatList>(null);
  const menuButtonRef = useRef<View>(null);

  const loadInitialData = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch room details
      const roomData = await DataService.getMessageRoom(
        roomId,
        currentUser?.uid
      );
      if (!roomData) {
        Alert.alert("Error", "Room not found");
        navigation.goBack();
        return;
      }
      setRoom(roomData);

      // Fetch messages
      const messagesData = await DataService.getMessages(roomId);
      setMessages(messagesData);

      // Fetch all participant user data
      const participantUsers = await DataService.getUsersByIds(
        roomData.participants
      );
      const usersMap: Record<string, User> = {};
      participantUsers.forEach((user) => {
        usersMap[user.uid] = user;
      });
      setUsers(usersMap);

      // Load meetup data if this is a meetup chat
      if (roomData.type === "meetup" && roomData.meetupRef) {
        // Extract meetup ID (handle both "meetups/{id}" and "{id}" formats)
        const meetupId = roomData.meetupRef.replace(/^meetups\//, "");
        try {
          const meetupData = await SupabaseDataService.getMeetup(meetupId);
          setMeetup(meetupData);
        } catch (error) {
          console.error("Error loading meetup:", error);
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  }, [roomId, currentUser?.uid]); // Dependencies for useCallback

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [roomId, loadInitialData]); // Include loadInitialData in dependencies

  // Set up real-time message subscription
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = DataService.setupMessageListener(
      roomId,
      (newMessages) => {
        setMessages(newMessages);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [roomId]); // Only depend on roomId

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser || !room) return;

    const messageText = newMessage.trim();

    setIsSending(true);

    // Clear the input immediately for better UX
    setNewMessage("");

    try {
      const message: Partial<Message> = {
        messageRoomRef: roomId,
        senderRef: currentUser.uid,
        text: messageText,
        messageType: "text",
        isEdited: false,
        reactions: {},
        isRead: false,
        readBy: {},
        isDeleted: false,
      };

      const result = await DataService.sendMessage(message);

      // Send notification to other participants (if not in the same room)
      if (room && room.participants) {
        const otherParticipants = room.participants.filter(
          (participantId) => participantId !== currentUser.uid
        );

        for (const participantId of otherParticipants) {
          try {
            await NotificationService.createNewMessageNotification(
              currentUser.uid,
              participantId,
              roomId,
              currentUser.displayName || "Someone",
              messageText.length > 50
                ? messageText.substring(0, 50) + "..."
                : messageText
            );
          } catch (error) {}
        }
      }

      // Manually refresh messages after sending to ensure UI updates
      try {
        const updatedMessages = await DataService.getMessages(roomId);
        setMessages(updatedMessages);
      } catch (error) {}
    } catch (error) {
      Alert.alert("Error", "Failed to send message");
      // Restore the message text if sending failed
      setNewMessage(messageText);
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

  const handleDeleteMessage = async (
    messageId: string,
    messageText: string
  ) => {
    console.log("DELETE BUTTON PRESSED: Message ID:", messageId);
    const isCurrentUserMessage =
      messages.find((m) => m.id === messageId)?.senderRef === currentUser?.uid;
    console.log("DELETE: Is current user message?", isCurrentUserMessage);

    if (!isCurrentUserMessage) {
      Alert.alert("Error", "You can only delete your own messages");
      return;
    }

    Alert.alert(
      "Delete Message",
      `Are you sure you want to delete this message?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              console.log("DELETE: Attempting to delete message:", messageId);

              // Optimistically remove from UI
              setMessages((prevMessages) => {
                console.log(
                  "DELETE: Current messages count:",
                  prevMessages.length
                );
                const filtered = prevMessages.filter(
                  (msg) => msg.id !== messageId
                );
                console.log("DELETE: Updated messages count:", filtered.length);
                return filtered;
              });

              await SupabaseDataService.deleteMessage(messageId);

              console.log("DELETE: Successfully deleted message from database");
            } catch (error) {
              console.log("DELETE ERROR:", error);
              // Revert on error
              const updatedMessages = await DataService.getMessages(roomId);
              setMessages(updatedMessages);
              Alert.alert("Error", "Failed to delete message");
            }
          },
        },
      ]
    );
  };

  const handleBlockUser = async () => {
    setShowMenu(false);

    Alert.alert(
      "Block User",
      "Are you sure you want to block this user? This will:\n\n• Remove all messages between you\n• Delete your conversation\n• Hide you from each other everywhere\n• Remove you from shared meetups\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            setIsBlocking(true);
            try {
              const otherUserId = room?.participants.find(
                (id) => id !== currentUser?.uid
              );
              if (otherUserId && currentUser) {
                await DataService.blockUser(currentUser.uid, otherUserId);
                Alert.alert(
                  "User Blocked",
                  "This user has been blocked and all data between you has been removed.",
                  [{ text: "OK", onPress: () => navigation.goBack() }]
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to block user. Please try again.");
            } finally {
              setIsBlocking(false);
            }
          },
        },
      ]
    );
  };

  const handleReportConversation = async () => {
    setShowMenu(false);

    Alert.alert(
      "Report Conversation",
      "Why are you reporting this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Spam",
          onPress: () => submitReport("spam"),
        },
        {
          text: "Harassment",
          onPress: () => submitReport("harassment"),
        },
        {
          text: "Inappropriate Content",
          onPress: () => submitReport("inappropriate"),
        },
        {
          text: "Threats",
          onPress: () => submitReport("threats"),
        },
        {
          text: "Other",
          onPress: () => submitReport("other"),
        },
      ]
    );
  };

  const submitReport = async (reason: string) => {
    setIsReporting(true);
    try {
      const otherUserId = room?.participants.find(
        (id) => id !== currentUser?.uid
      );
      if (otherUserId && currentUser && room) {
        await DataService.reportConversation(
          currentUser.uid,
          otherUserId,
          room.id,
          reason
        );

        // Ask if user wants to block after reporting
        Alert.alert(
          "Report Submitted",
          "Thank you for your report. Would you also like to block this user?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes, Block User",
              style: "destructive",
              onPress: async () => {
                try {
                  await DataService.blockUser(currentUser.uid, otherUserId);
                  Alert.alert(
                    "User Blocked",
                    "This user has been blocked and all data between you has been removed.",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                  );
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "Report submitted but failed to block user."
                  );
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isCurrentUser = item.senderRef === currentUser?.uid;
    const senderName = getSenderName(item.senderRef);
    const senderAvatar = getSenderAvatar(item.senderRef);

    const renderRightActions = (progress: Animated.AnimatedInterpolation) => {
      if (!isCurrentUser || item.isDeleted) return null;

      const scale = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0.5, 1],
        extrapolate: "clamp",
      });

      const opacity = progress.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, 0.5, 1],
        extrapolate: "clamp",
      });

      return (
        <View style={styles.swipeDeleteContainer}>
          <TouchableOpacity
            style={styles.swipeDeleteButton}
            activeOpacity={0.7}
            onPress={() => {
              console.log("DELETE BUTTON TAPPED in renderRightActions");
              handleDeleteMessage(item.id, item.text);
            }}
          >
            <Animated.View style={{ transform: [{ scale }], opacity }}>
              <Ionicons name="trash" size={24} color="white" />
              <Text style={styles.swipeDeleteText}>Delete</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        overshootRight={false}
        enabled={isCurrentUser && !item.isDeleted}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={() =>
            isCurrentUser &&
            !item.isDeleted &&
            handleDeleteMessage(item.id, item.text)
          }
        >
          <View
            style={[
              styles.messageContainer,
              isCurrentUser
                ? styles.currentUserMessage
                : styles.otherUserMessage,
            ]}
          >
            {!isCurrentUser && (
              <View style={styles.messageHeader}>
                {senderAvatar ? (
                  <Image source={{ uri: senderAvatar }} style={styles.avatar} />
                ) : (
                  <View
                    style={[
                      styles.avatar,
                      styles.avatarPlaceholder,
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
                <Text
                  style={[styles.senderName, { color: colors.textSecondary }]}
                >
                  {senderName}
                </Text>
              </View>
            )}
            {isCurrentUser ? (
              <LinearGradient
                colors={[colors.primary, colors.primaryVariant]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.messageBubble, styles.gradientBubble]}
              >
                <Text style={[styles.messageText, { color: colors.onPrimary }]}>
                  {item.isDeleted ? "[Message deleted]" : item.text}
                </Text>
              </LinearGradient>
            ) : (
              <View
                style={[
                  styles.messageBubble,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.messageText, { color: colors.text }]}>
                  {item.text}
                </Text>
              </View>
            )}
            <Text style={[styles.timestamp, { color: colors.textTertiary }]}>
              {new Date(item.createdTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
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
      <View style={styles.headerContent}>
        <View style={styles.headerInfo}>
          {otherUser && (
            <View style={styles.headerAvatarContainer}>
              {otherUser.profilePictures &&
              otherUser.profilePictures.length > 0 ? (
                <Image
                  source={{
                    uri: otherUser.profilePictures[0],
                  }}
                  style={styles.headerAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.headerAvatar,
                    styles.headerAvatarPlaceholder,
                    { backgroundColor: colors.border },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={colors.textTertiary}
                  />
                </View>
              )}
            </View>
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

        <TouchableOpacity
          ref={menuButtonRef}
          style={styles.menuButton}
          onPress={() => {
            menuButtonRef.current?.measure(
              (
                _fx: number,
                _fy: number,
                width: number,
                height: number,
                px: number,
                py: number
              ) => {
                setMenuPosition({ x: px + width, y: py + height });
                setShowMenu(true);

                // Animate menu entrance
                Animated.parallel([
                  Animated.spring(menuScale, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 8,
                  }),
                  Animated.timing(menuOpacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                  }),
                ]).start();
              }
            );
          }}
        >
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

  const renderMeetupInfoCard = () => {
    if (!meetup || !room || room.type !== "meetup") return null;

    const formatTime = (date: Date) => {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString([], {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <TouchableOpacity
        style={[
          styles.meetupInfoCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={() => {
          navigation.navigate("MeetupDetails", {
            meetupId: meetup.id,
            meetupData: meetup,
          });
        }}
        activeOpacity={0.7}
      >
        {meetup.coverImage && (
          <Image
            source={{ uri: meetup.coverImage }}
            style={styles.meetupInfoImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.meetupInfoContent}>
          <Text
            style={[styles.meetupInfoTitle, { color: colors.text }]}
            numberOfLines={1}
          >
            {meetup.title}
          </Text>
          <View style={styles.meetupInfoDetails}>
            <View style={styles.meetupInfoRow}>
              <Ionicons
                name="calendar-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.meetupInfoText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {formatDate(meetup.time)} at {formatTime(meetup.time)}
              </Text>
            </View>
            <View style={styles.meetupInfoRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color={colors.textSecondary}
              />
              <Text
                style={[styles.meetupInfoText, { color: colors.textSecondary }]}
                numberOfLines={1}
              >
                {meetup.locationName || meetup.address}
              </Text>
            </View>
          </View>
        </View>
        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </TouchableOpacity>
    );
  };

  const handleCloseMenu = () => {
    Animated.parallel([
      Animated.spring(menuScale, {
        toValue: 0,
        useNativeDriver: true,
        tension: 150,
        friction: 10,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMenu(false);
    });
  };

  const renderMenuModal = () => (
    <Modal
      visible={showMenu}
      transparent={true}
      animationType="none"
      onRequestClose={handleCloseMenu}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleCloseMenu}
      >
        <Animated.View
          style={[
            styles.menuPositioning,
            {
              top: menuPosition.y,
              right: Platform.OS === "ios" ? 16 : 8,
              opacity: menuOpacity,
              transform: [{ scale: menuScale }],
            },
          ]}
        >
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.menuItem,
                {
                  borderBottomColor: colors.border,
                  backgroundColor: isBlocking
                    ? colors.background
                    : "transparent",
                },
              ]}
              onPress={handleBlockUser}
              disabled={isBlocking}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="ban-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: "#EF4444" }]}>
                {isBlocking ? "Blocking..." : "Block User"}
              </Text>
              {isBlocking && (
                <ActivityIndicator
                  size="small"
                  color="#EF4444"
                  style={styles.menuLoader}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuItem,
                styles.lastMenuItem,
                {
                  backgroundColor: isReporting
                    ? colors.background
                    : "transparent",
                },
              ]}
              onPress={handleReportConversation}
              disabled={isReporting}
              activeOpacity={0.7}
            >
              <View style={styles.menuIconContainer}>
                <Ionicons name="flag-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: "#EF4444" }]}>
                {isReporting ? "Reporting..." : "Report Conversation"}
              </Text>
              {isReporting && (
                <ActivityIndicator
                  size="small"
                  color="#EF4444"
                  style={styles.menuLoader}
                />
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top", "bottom"]}
      >
        {/* Header with back button */}
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          {renderHeader()}
        </View>

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
      edges={["top", "bottom"]}
    >
      {/* Header with back button */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        {renderHeader()}
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {messages.length === 0 ? (
          <View style={styles.messagesList}>
            <View style={styles.emptyMessagesContainer}>
              {renderMeetupInfoCard()}
              <View style={styles.emptyStateWrapper}>
                {renderEmptyState()}
              </View>
            </View>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            style={styles.messagesList}
            contentContainerStyle={styles.messagesContent}
            inverted={true}
            ListFooterComponent={renderMeetupInfoCard}
          />
        )}

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: colors.surface,
              borderTopColor: colors.border,
              paddingBottom: hideBottomNav || isFullScreen ? 20 : 20,
            },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              { color: colors.text, backgroundColor: colors.background },
            ]}
            value={newMessage}
            onChangeText={(text) => {
              // Limit consecutive line breaks to maximum of 2 (one extra line)
              const limitedText = text.replace(/\n{3,}/g, "\n\n");
              setNewMessage(limitedText);
            }}
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

      {renderMenuModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  swipeIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12, // Add margin to prevent overlap with menu button
  },
  headerAvatarContainer: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerAvatarPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  headerText: {
    flex: 1,
    minWidth: 0, // Allow text to shrink if needed
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
  avatarPlaceholder: {
    justifyContent: "center",
    alignItems: "center",
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
  gradientBubble: {
    // Additional styles for gradient bubbles
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
  emptyMessagesContainer: {
    flex: 1,
    paddingTop: 16,
  },
  emptyStateWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
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
    paddingVertical: 8,
    paddingBottom: 16, // Add extra bottom padding to prevent cutoff
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menuPositioning: {
    position: "absolute",
    alignItems: "flex-end",
  },
  menuContainer: {
    width: 220,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  menuLoader: {
    marginLeft: 8,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  swipeDeleteContainer: {
    justifyContent: "center",
    alignItems: "flex-end",
    paddingRight: 16,
    flex: 1,
  },
  swipeDeleteButton: {
    width: 70,
    backgroundColor: "#ef4444",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    paddingVertical: 20,
  },
  swipeDeleteText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  // Meetup Info Card Styles
  meetupInfoCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  meetupInfoImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  meetupInfoContent: {
    flex: 1,
    minWidth: 0,
  },
  meetupInfoTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  meetupInfoDetails: {
    gap: 6,
  },
  meetupInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  meetupInfoText: {
    fontSize: 13,
    flex: 1,
  },
});
