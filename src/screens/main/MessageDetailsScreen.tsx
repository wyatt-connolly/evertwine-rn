import React, { useState, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Message, MessageRoom } from "../../types";

interface MessageDetailsScreenProps {
  route: {
    params: {
      roomId: string;
    };
  };
  navigation: any;
}

// Mock messages data
const mockMessages: Message[] = [
  {
    id: "1",
    messageRoomRef: "room1",
    senderRef: "users/user2",
    text: "Hey! Thanks for the great yoga session today!",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user1": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T15:30:00"),
    updatedTime: new Date("2024-09-13T15:30:00"),
  },
  {
    id: "2",
    messageRoomRef: "room1",
    senderRef: "users/user1",
    text: "You're welcome! It was so peaceful in the park. Would you like to join again next week?",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user2": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T15:32:00"),
    updatedTime: new Date("2024-09-13T15:32:00"),
  },
  {
    id: "3",
    messageRoomRef: "room1",
    senderRef: "users/user2",
    text: "Absolutely! I'd love to. What time works best for you?",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user1": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T15:35:00"),
    updatedTime: new Date("2024-09-13T15:35:00"),
  },
  {
    id: "4",
    messageRoomRef: "room1",
    senderRef: "users/user1",
    text: "How about Sunday morning at 8 AM? Same spot in Golden Gate Park.",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: false,
    readBy: {},
    isDeleted: false,
    createdTime: new Date("2024-09-13T15:37:00"),
    updatedTime: new Date("2024-09-13T15:37:00"),
  },
];

const mockRoom: MessageRoom = {
  id: "room1",
  type: "direct",
  participants: ["user1", "user2"],
  admins: [],
  name: "Maya Rodriguez",
  avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
  lastMessage: {
    text: "How about Sunday morning at 8 AM? Same spot in Golden Gate Park.",
    senderRef: "users/user1",
    timestamp: new Date("2024-09-13T15:37:00"),
    messageType: "text",
    isRead: false,
  },
  settings: {
    allowInvites: true,
    allowMedia: true,
    allowReactions: true,
  },
  createdTime: new Date("2024-09-10"),
  updatedTime: new Date("2024-09-13T15:37:00"),
};

export default function MessageDetailsScreen({ route, navigation }: MessageDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { roomId } = route.params;
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isMyMessage = (senderRef: string) => {
    return senderRef === "users/user1"; // Current user
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        messageRoomRef: roomId,
        senderRef: "users/user1",
        text: newMessage.trim(),
        messageType: "text",
        isEdited: false,
        reactions: {},
        isRead: false,
        readBy: {},
        isDeleted: false,
        createdTime: new Date(),
        updatedTime: new Date(),
      };
      
      setMessages(prev => [...prev, message]);
      setNewMessage("");
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMsg = isMyMessage(item.senderRef);
    
    return (
      <View style={[
        styles.messageContainer,
        isMyMsg ? styles.myMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          {
            backgroundColor: isMyMsg ? colors.primary : colors.surface,
          }
        ]}>
          <Text style={[
            styles.messageText,
            { color: isMyMsg ? colors.onPrimary : colors.text }
          ]}>
            {item.text}
          </Text>
          <Text style={[
            styles.messageTime,
            { color: isMyMsg ? colors.onPrimary + "80" : colors.textTertiary }
          ]}>
            {formatTime(item.createdTime)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Image source={{ uri: mockRoom.avatar }} style={styles.headerAvatar} />
          <View style={styles.headerText}>
            <Text style={[styles.headerName, { color: colors.text }]}>
              {mockRoom.name}
            </Text>
            <Text style={[styles.headerStatus, { color: colors.textSecondary }]}>
              Online
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView 
        style={styles.chatContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
        />

        <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.textInput, { color: colors.text, backgroundColor: colors.background }]}
              placeholder="Type a message..."
              placeholderTextColor={colors.textTertiary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={500}
            />
            
            <TouchableOpacity style={styles.cameraButton}>
              <Ionicons name="camera" size={24} color={colors.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.sendButton,
                { backgroundColor: newMessage.trim() ? colors.primary : colors.surfaceVariant }
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={newMessage.trim() ? colors.onPrimary : colors.textTertiary} 
              />
            </TouchableOpacity>
          </View>
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
    padding: 8,
    marginRight: 8,
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
  headerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  headerStatus: {
    fontSize: 12,
  },
  moreButton: {
    padding: 8,
    marginLeft: 8,
  },
  chatContainer: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  myMessageContainer: {
    alignItems: "flex-end",
  },
  otherMessageContainer: {
    alignItems: "flex-start",
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
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  attachButton: {
    padding: 8,
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 8,
  },
  cameraButton: {
    padding: 8,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
