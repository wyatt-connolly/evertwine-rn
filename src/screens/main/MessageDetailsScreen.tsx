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
  Modal,
  Alert,
  Dimensions,
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

// Mock user data for different conversation types
const mockUsers: Record<string, any> = {
  user1: {
    id: "user1",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Adventure seeker and coffee enthusiast",
    location: "San Francisco, CA",
    interests: ["Hiking", "Photography", "Coffee"],
    isOnline: true,
  },
  user2: {
    id: "user2",
    name: "Maya Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    bio: "Yoga instructor and nature lover. Passionate about mindfulness and helping others find inner peace.",
    location: "San Francisco, CA",
    interests: ["Yoga", "Meditation", "Nature", "Wellness"],
    isOnline: true,
    school: "UC Berkeley",
    job: "Yoga Instructor at SoulCycle",
    age: 28,
    joinedDate: "2023-03-22",
    meetups: [
      {
        id: "m3",
        title: "Morning Yoga in the Park",
        date: "2024-09-25",
        status: "upcoming",
      },
      {
        id: "m4",
        title: "Meditation Workshop",
        date: "2024-09-15",
        status: "attended",
      },
      {
        id: "m5",
        title: "Nature Walk & Mindfulness",
        date: "2024-09-10",
        status: "attended",
      },
    ],
    socialLinks: {
      instagram: "@maya_yoga_sf",
      website: "www.mayayoga.com",
      linkedin: "maya-rodriguez-yoga",
    },
    // LinkedIn-style professional info
    linkedinData: {
      headline:
        "Certified Yoga Instructor & Wellness Coach | Mindfulness Advocate",
      currentPosition: {
        title: "Senior Yoga Instructor",
        company: "SoulCycle",
        location: "San Francisco, CA",
        startDate: "2022-01-15",
        description:
          "Lead instructor for advanced yoga classes, mentor new instructors, and develop wellness programs for corporate clients.",
      },
      experience: [
        {
          title: "Senior Yoga Instructor",
          company: "SoulCycle",
          location: "San Francisco, CA",
          startDate: "2022-01-15",
          endDate: null,
          description:
            "Lead instructor for advanced yoga classes, mentor new instructors, and develop wellness programs for corporate clients.",
        },
        {
          title: "Yoga Instructor",
          company: "CorePower Yoga",
          location: "San Francisco, CA",
          startDate: "2020-06-01",
          endDate: "2021-12-31",
          description:
            "Taught various yoga styles including Vinyasa, Power Yoga, and Hot Yoga. Maintained 4.9/5 instructor rating.",
        },
        {
          title: "Wellness Coordinator",
          company: "Google",
          location: "Mountain View, CA",
          startDate: "2019-03-01",
          endDate: "2020-05-31",
          description:
            "Organized employee wellness programs, led meditation sessions, and coordinated fitness challenges for 500+ employees.",
        },
      ],
      education: [
        {
          school: "UC Berkeley",
          degree: "Bachelor of Arts in Psychology",
          field: "Psychology",
          startDate: "2014-09-01",
          endDate: "2018-05-31",
          description:
            "Focused on mindfulness-based interventions and stress management techniques.",
        },
        {
          school: "Yoga Alliance",
          degree: "RYT-500 Certification",
          field: "Yoga Instruction",
          startDate: "2019-01-01",
          endDate: "2019-12-31",
          description:
            "500-hour Registered Yoga Teacher certification with specialization in therapeutic yoga.",
        },
      ],
      skills: [
        "Yoga Instruction",
        "Mindfulness Training",
        "Stress Management",
        "Corporate Wellness",
        "Team Leadership",
        "Public Speaking",
        "Meditation",
        "Holistic Health",
        "Employee Engagement",
        "Program Development",
      ],
      certifications: [
        {
          name: "RYT-500 Yoga Alliance",
          issuer: "Yoga Alliance",
          issueDate: "2019-12-31",
          credentialId: "YA-123456",
        },
        {
          name: "Mindfulness-Based Stress Reduction",
          issuer: "UCSF Osher Center",
          issueDate: "2020-08-15",
          credentialId: "MBSR-789",
        },
        {
          name: "Corporate Wellness Specialist",
          issuer: "National Wellness Institute",
          issueDate: "2021-03-20",
          credentialId: "CWS-456",
        },
      ],
      languages: [
        { language: "English", proficiency: "Native" },
        { language: "Spanish", proficiency: "Fluent" },
        { language: "Portuguese", proficiency: "Conversational" },
      ],
      volunteerExperience: [
        {
          organization: "San Francisco Food Bank",
          role: "Volunteer Coordinator",
          startDate: "2021-01-01",
          endDate: null,
          description:
            "Organize monthly volunteer events and coordinate food distribution programs.",
        },
      ],
    },
  },
  user3: {
    id: "user3",
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    bio: "Tech entrepreneur and event organizer",
    location: "San Francisco, CA",
    interests: ["Technology", "Networking", "Startups"],
    isOnline: false,
  },
  user4: {
    id: "user4",
    name: "Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400",
    bio: "Software engineer and tech enthusiast",
    location: "San Francisco, CA",
    interests: ["Programming", "AI", "Networking"],
    isOnline: true,
  },
  user5: {
    id: "user5",
    name: "Mike Wilson",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    bio: "Product manager and startup advisor",
    location: "San Francisco, CA",
    interests: ["Product", "Strategy", "Leadership"],
    isOnline: false,
  },
  user6: {
    id: "user6",
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    bio: "Professional photographer and travel blogger",
    location: "San Francisco, CA",
    interests: ["Photography", "Travel", "Art"],
    isOnline: true,
  },
  user7: {
    id: "user7",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    bio: "Amateur photographer and tech worker",
    location: "San Francisco, CA",
    interests: ["Photography", "Technology", "Hiking"],
    isOnline: false,
  },
  user8: {
    id: "user8",
    name: "Lisa Park",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    bio: "Creative director and photography enthusiast",
    location: "San Francisco, CA",
    interests: ["Photography", "Design", "Art"],
    isOnline: true,
  },
};

// Mock room data for different conversations
const mockRooms: Record<string, MessageRoom> = {
  room1: {
    id: "room1",
    type: "direct",
    participants: ["user1", "user2"],
    admins: [],
    name: "Maya Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
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
  },
  room2: {
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
  room3: {
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
};

// Mock messages data for different room types
const mockDirectMessages: Message[] = [
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

const mockGroupMessages: Message[] = [
  {
    id: "1",
    messageRoomRef: "room3",
    senderRef: "users/user6",
    text: "Hey everyone! Check out this amazing sunset shot from yesterday!",
    messageType: "text",
    isEdited: false,
    reactions: { "❤️": ["users/user1", "users/user7"] },
    isRead: true,
    readBy: { "users/user1": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T12:45:00"),
    updatedTime: new Date("2024-09-13T12:45:00"),
  },
  {
    id: "2",
    messageRoomRef: "room3",
    senderRef: "users/user1",
    text: "Wow, that's absolutely stunning! Where was this taken?",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user6": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T12:47:00"),
    updatedTime: new Date("2024-09-13T12:47:00"),
  },
  {
    id: "3",
    messageRoomRef: "room3",
    senderRef: "users/user7",
    text: "Amazing composition! The colors are incredible",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user6": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T12:50:00"),
    updatedTime: new Date("2024-09-13T12:50:00"),
  },
];

const mockMeetupMessages: Message[] = [
  {
    id: "1",
    messageRoomRef: "room2",
    senderRef: "users/user4",
    text: "Looking forward to meeting everyone tomorrow!",
    messageType: "text",
    isEdited: false,
    reactions: { "👍": ["users/user1", "users/user3"] },
    isRead: true,
    readBy: { "users/user1": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T14:15:00"),
    updatedTime: new Date("2024-09-13T14:15:00"),
  },
  {
    id: "2",
    messageRoomRef: "room2",
    senderRef: "users/user3",
    text: "Great! I'll be there around 6:30 PM. Looking forward to connecting with fellow tech professionals!",
    messageType: "text",
    isEdited: false,
    reactions: {},
    isRead: true,
    readBy: { "users/user4": new Date() },
    isDeleted: false,
    createdTime: new Date("2024-09-13T14:18:00"),
    updatedTime: new Date("2024-09-13T14:18:00"),
  },
];

const { width, height } = Dimensions.get("window");

export default function MessageDetailsScreen({
  route,
  navigation,
}: MessageDetailsScreenProps) {
  const { colors } = useThemeStore();
  const roomId = route.params?.roomId || "room1";

  // Get the current room data based on roomId
  const currentRoom = mockRooms[roomId] || mockRooms.room1;

  // Load different messages based on room type
  const getMessagesForRoom = (roomId: string) => {
    switch (roomId) {
      case "room1":
        return mockDirectMessages;
      case "room2":
        return mockMeetupMessages;
      case "room3":
        return mockGroupMessages;
      default:
        return mockDirectMessages;
    }
  };

  const [messages, setMessages] = useState<Message[]>(
    getMessagesForRoom(roomId)
  );
  const [newMessage, setNewMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const flatListRef = useRef<FlatList>(null);
  const moreButtonRef = useRef<View | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const isMyMessage = (senderRef: string) => {
    return senderRef === "users/user1"; // Current user
  };

  const handleMoreButtonPress = () => {
    moreButtonRef.current?.measureInWindow(
      (x: number, y: number, width: number, height: number) => {
        // Calculate position relative to screen - position menu aligned with button
        const menuWidth = 200; // Approximate menu width
        const screenWidth = Dimensions.get("window").width;
        const screenHeight = Dimensions.get("window").height;

        // Ideal positioning: Align right edge of menu with right edge of button
        let menuX = x + width - menuWidth;

        // Ensure menu doesn't go off screen
        if (menuX < 16) {
          menuX = 16; // Minimum margin from left edge
        } else if (menuX + menuWidth > screenWidth - 16) {
          menuX = screenWidth - menuWidth - 16; // Minimum margin from right edge
        }

        // Position menu below button with optimal gap
        let menuY = y + height + 4; // 4px gap - tight but not touching

        // If menu would go off bottom of screen, position it above the button
        if (menuY + 200 > screenHeight - 50) {
          // 200 is approximate menu height, 50 is safe area
          menuY = y - 200 - 8; // Position above button
        }

        setMenuPosition({
          x: menuX,
          y: menuY,
        });
        setShowMenu(true);
      }
    );
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

      setMessages((prev) => [...prev, message]);
      setNewMessage("");

      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    switch (action) {
      case "view_profile":
        console.log("🔍 Menu 'View Profile' clicked - Debug info:", {
          roomId: currentRoom.id,
          roomType: currentRoom.type,
          roomName: currentRoom.name,
          participants: currentRoom.participants,
          currentUser: "user1",
        });

        // Handle navigation based on conversation type
        if (currentRoom.type === "direct") {
          // For direct messages, navigate to the other user's profile
          const otherUserId = currentRoom.participants.find(
            (id) => id !== "user1"
          );
          console.log("👤 Menu - Direct message - Other user ID:", otherUserId);

          if (otherUserId) {
            console.log("🚀 Menu - Navigating to UserProfile with:", {
              userId: otherUserId,
              userData: mockUsers[otherUserId],
            });
            navigation.navigate("UserProfile", {
              userId: otherUserId,
              userData: mockUsers[otherUserId],
              fromMessage: true,
            });
          } else {
            console.log("❌ Menu - No other user found in direct message");
          }
        } else if (currentRoom.type === "meetup") {
          // For meetup conversations, navigate to meetup details
          console.log("📅 Menu - Meetup message - Navigating to MeetupDetails");
          navigation.navigate("MeetupDetails", {
            meetupId: currentRoom.meetupRef || "meetup2",
            meetupData: {
              id: currentRoom.meetupRef || "meetup2",
              title: currentRoom.name,
              description: "Tech networking event for professionals",
              location: "San Francisco, CA",
              date: "2024-09-14T18:00:00", // Use string instead of Date object
              attendees: currentRoom.participants.length,
              organizer: mockUsers[currentRoom.admins[0] || "user3"],
            },
          });
        } else if (currentRoom.type === "group") {
          // For group conversations, navigate to a group details screen
          console.log("👥 Menu - Group message - Navigating to GroupDetails");
          navigation.navigate("GroupDetails", {
            groupId: currentRoom.id,
            groupData: {
              id: currentRoom.id,
              name: currentRoom.name,
              description:
                currentRoom.description || "No description available",
              members: currentRoom.participants,
              memberCount: currentRoom.participants.length,
              admins: currentRoom.admins,
            },
          });
        }
        break;
      case "block_user":
        Alert.alert("Block User", "Are you sure you want to block this user?", [
          { text: "Cancel", style: "cancel" },
          {
            text: "Block",
            style: "destructive",
            onPress: () => Alert.alert("User blocked"),
          },
        ]);
        break;
      case "report":
        Alert.alert("Report User", "Why are you reporting this user?", [
          { text: "Cancel", style: "cancel" },
          { text: "Spam", onPress: () => Alert.alert("Reported for spam") },
          {
            text: "Harassment",
            onPress: () => Alert.alert("Reported for harassment"),
          },
          { text: "Other", onPress: () => Alert.alert("Reported") },
        ]);
        break;
      case "mute_notifications":
        Alert.alert("Notifications muted for this conversation");
        break;
      case "clear_chat":
        Alert.alert(
          "Clear Chat",
          "Are you sure you want to clear all messages in this chat?",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Clear",
              style: "destructive",
              onPress: () => setMessages([]),
            },
          ]
        );
        break;
      default:
        break;
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMsg = isMyMessage(item.senderRef);

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMsg ? styles.myMessageContainer : styles.otherMessageContainer,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            {
              backgroundColor: isMyMsg ? colors.primary : colors.background,
              borderWidth: isMyMsg ? 0 : 1,
              borderColor: isMyMsg ? "transparent" : colors.border,
            },
          ]}
        >
          <Text
            style={[
              styles.messageText,
              { color: isMyMsg ? colors.onPrimary : colors.text },
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              {
                color: isMyMsg ? colors.onPrimary + "80" : colors.textTertiary,
              },
            ]}
          >
            {formatTime(item.createdTime)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.headerInfo}
          onPress={() => {
            console.log("🔍 Avatar/Name clicked - Debug info:", {
              roomId: currentRoom.id,
              roomType: currentRoom.type,
              roomName: currentRoom.name,
              participants: currentRoom.participants,
              currentUser: "user1",
            });

            // Handle navigation based on conversation type
            if (currentRoom.type === "direct") {
              // For direct messages, navigate to the other user's profile
              const otherUserId = currentRoom.participants.find(
                (id) => id !== "user1"
              );
              console.log("👤 Direct message - Other user ID:", otherUserId);

              if (otherUserId) {
                console.log("🚀 Navigating to UserProfile with:", {
                  userId: otherUserId,
                  userData: mockUsers[otherUserId],
                });
                navigation.navigate("UserProfile", {
                  userId: otherUserId,
                  userData: mockUsers[otherUserId],
                  fromMessage: true,
                });
              } else {
                console.log("❌ No other user found in direct message");
              }
            } else if (currentRoom.type === "meetup") {
              // For meetup conversations, navigate to meetup details
              console.log("📅 Meetup message - Navigating to MeetupDetails");
              navigation.navigate("MeetupDetails", {
                meetupId: currentRoom.meetupRef || "meetup2",
                meetupData: {
                  id: currentRoom.meetupRef || "meetup2",
                  title: currentRoom.name,
                  description: "Tech networking event for professionals",
                  location: "San Francisco, CA",
                  date: "2024-09-14T18:00:00", // Use string instead of Date object
                  attendees: currentRoom.participants.length,
                  organizer: mockUsers[currentRoom.admins[0] || "user3"],
                },
              });
            } else if (currentRoom.type === "group") {
              // For group conversations, navigate to a group details screen
              console.log("👥 Group message - Navigating to GroupDetails");
              navigation.navigate("GroupDetails", {
                groupId: currentRoom.id,
                groupData: {
                  id: currentRoom.id,
                  name: currentRoom.name,
                  description:
                    currentRoom.description || "No description available",
                  members: currentRoom.participants,
                  memberCount: currentRoom.participants.length,
                  admins: currentRoom.admins,
                },
              });
            }
          }}
        >
          <Image
            source={{ uri: currentRoom.avatar }}
            style={styles.headerAvatar}
          />
          <View style={styles.headerText}>
            <Text style={[styles.headerName, { color: colors.text }]}>
              {currentRoom.name}
            </Text>
            <Text
              style={[styles.headerStatus, { color: colors.textSecondary }]}
            >
              {currentRoom.type === "direct"
                ? "Online"
                : `${currentRoom.participants.length} members`}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          ref={moreButtonRef}
          style={styles.moreButton}
          onPress={handleMoreButtonPress}
        >
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

        <View
          style={[
            styles.inputContainer,
            { backgroundColor: colors.surface, borderTopColor: colors.border },
          ]}
        >
          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add" size={24} color={colors.primary} />
            </TouchableOpacity>

            <TextInput
              style={[
                styles.textInput,
                { color: colors.text, backgroundColor: colors.background },
              ]}
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
                {
                  backgroundColor: newMessage.trim()
                    ? colors.primary
                    : colors.surfaceVariant,
                },
              ]}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <Ionicons
                name="send"
                size={20}
                color={
                  newMessage.trim() ? colors.onPrimary : colors.textTertiary
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: colors.surface,
                position: "absolute",
                top: menuPosition.y,
                left: menuPosition.x,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction("view_profile")}
            >
              <Ionicons
                name={
                  currentRoom.type === "direct"
                    ? "person-outline"
                    : currentRoom.type === "meetup"
                    ? "calendar-outline"
                    : "people-outline"
                }
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                {currentRoom.type === "direct"
                  ? "View Profile"
                  : currentRoom.type === "meetup"
                  ? "View Event"
                  : "View Group"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction("mute_notifications")}
            >
              <Ionicons
                name="notifications-off-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Mute Notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction("clear_chat")}
            >
              <Ionicons name="trash-outline" size={24} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Clear Chat
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuAction("report")}
            >
              <Ionicons name="flag-outline" size={24} color={colors.primary} />
              <Text style={[styles.menuText, { color: colors.text }]}>
                Report
              </Text>
            </TouchableOpacity>

            {currentRoom.type === "direct" && (
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleMenuAction("block_user")}
              >
                <Ionicons name="ban-outline" size={24} color={colors.error} />
                <Text style={[styles.menuText, { color: colors.error }]}>
                  Block User
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingTop: 8,
    paddingBottom: 0,
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
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    borderRadius: 12,
    padding: 16,
    minWidth: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 12,
  },
});
