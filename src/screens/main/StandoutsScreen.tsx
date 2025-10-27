import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { getMockStandouts } from "../../data/mockData";
import { DataService } from "../../services/DataService";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import {
  EmptyStandoutsState,
  LoadingState,
} from "../../components/EmptyStates";
import { StandoutItem, User } from "../../types";
import UserMeetupNavigation from "../../components/UserMeetupNavigation";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 12;

// Messaging Modal Component
interface MessagingModalProps {
  visible: boolean;
  onClose: () => void;
  standouts: StandoutItem[];
  currentUser: User | null;
  navigation: any;
}

const MessagingModal: React.FC<MessagingModalProps> = ({
  visible,
  onClose,
  standouts,
  currentUser,
  navigation,
}) => {
  const { colors } = useThemeStore();
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const selectedUser = standouts[selectedUserIndex];

  const handleSendMessage = () => {
    if (selectedUser) {
      // Navigate to messages or create a new conversation
      navigation.navigate("Messages", {
        screen: "Chat",
        params: {
          userId: selectedUser.id,
          userData: selectedUser.userData,
        },
      });
      onClose();
    }
  };

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View
        style={[styles.modalContainer, { backgroundColor: colors.surface }]}
      >
        {/* Header */}
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Message Someone
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* User Selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.userSelection}
          contentContainerStyle={styles.userSelectionContent}
        >
          {standouts.map((user, index) => (
            <TouchableOpacity
              key={user.id}
              style={[
                styles.userSelectionItem,
                {
                  backgroundColor:
                    index === selectedUserIndex
                      ? colors.primary
                      : colors.background,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setSelectedUserIndex(index)}
            >
              {user.image ? (
                <Image
                  source={{ uri: user.image }}
                  style={styles.userSelectionAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.userSelectionAvatar,
                    styles.placeholderAvatar,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={colors.textSecondary}
                  />
                </View>
              )}
              <Text
                style={[
                  styles.userSelectionName,
                  {
                    color:
                      index === selectedUserIndex
                        ? colors.onPrimary
                        : colors.text,
                  },
                ]}
                numberOfLines={1}
              >
                {user.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected User Profile */}
        {selectedUser && (
          <View style={styles.selectedUserProfile}>
            <View style={styles.profileHeader}>
              {selectedUser.image ? (
                <Image
                  source={{ uri: selectedUser.image }}
                  style={styles.profileAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.profileAvatar,
                    styles.placeholderAvatar,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Ionicons
                    name="person"
                    size={40}
                    color={colors.textSecondary}
                  />
                </View>
              )}
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>
                  {selectedUser.title}
                </Text>
                <Text
                  style={[
                    styles.profileDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {selectedUser.description}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.sendMessageButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={handleSendMessage}
            >
              <Ionicons name="send" size={20} color={colors.onPrimary} />
              <Text
                style={[styles.sendMessageText, { color: colors.onPrimary }]}
              >
                Send Message
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default function StandoutsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [standouts, setStandouts] = useState<StandoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMessagingModal, setShowMessagingModal] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Load standouts data
  useEffect(() => {
    const loadStandouts = async () => {
      try {
        if (DataService.isInDeveloperMode()) {
          // Use mock data in developer mode
          const mockStandouts = getMockStandouts().filter(
            (item) => item.type === "user"
          );
          setStandouts(mockStandouts);
        } else {
          // Use Supabase data in production mode
          console.log("Loading standouts from Supabase...");
          const users =
            await SupabaseDataService.getAllActiveUsersExcludingAdmin(10); // Get more to filter
          console.log("Loaded users from Supabase:", users.length, users);

          // Filter out current user
          const filteredUsers = users.filter(
            (user) => user.uid !== currentUser?.uid
          );
          console.log(
            "Filtered users (excluding current):",
            filteredUsers.length
          );

          // Take first 3 users
          const selectedUsers = filteredUsers.slice(0, 3);

          const standoutItems = selectedUsers.map((user, index) => ({
            id: user.uid,
            type: "user" as const,
            title: user.displayName || "Anonymous User",
            description:
              user.bio ||
              `${user.age ? `${user.age} years old` : ""} • ${
                user.locationName || "Location not set"
              }`,
            image: user.profilePictures?.[0] || "",
            badge:
              index === 0
                ? "New Member"
                : index === 1
                ? "Active User"
                : "Community Member",
            stats: {
              followers: Math.floor(Math.random() * 1000) + 100, // Mock follower count
              rating: 4.5 + Math.random() * 0.5, // Mock rating between 4.5-5.0
            },
            userData: user,
            location: user.locationName || "Unknown Location",
          }));

          console.log("Converted to standout items:", standoutItems);
          setStandouts(standoutItems);
        }
      } catch (error) {
        console.error("Error loading standouts:", error);
        setStandouts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStandouts();
  }, []);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const onMomentumScrollEnd = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / (CARD_WIDTH + CARD_MARGIN));
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    const scrollX = index * (CARD_WIDTH + CARD_MARGIN);
    scrollViewRef.current?.scrollTo({ x: scrollX, animated: true });
  };

  const renderCard = (item: StandoutItem, index: number) => {
    const inputRange = [
      (index - 1) * (CARD_WIDTH + CARD_MARGIN),
      index * (CARD_WIDTH + CARD_MARGIN),
      (index + 1) * (CARD_WIDTH + CARD_MARGIN),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.6, 1, 0.6],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        key={item.id}
        style={[
          styles.card,
          { backgroundColor: colors.surface },
          {
            transform: [{ scale }],
            opacity,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.cardContent}
          onPress={() => {
            navigation.navigate("UserProfile", {
              userId: item.id,
              userData: item.userData,
            });
          }}
        >
          <View style={styles.avatarContainer}>
            {item.image ? (
              <Image
                source={{ uri: item.image }}
                style={styles.userAvatar}
                onError={() => {
                  // Handle image load error
                  console.log("Image failed to load for user:", item.id);
                }}
              />
            ) : (
              <View
                style={[
                  styles.userAvatar,
                  styles.placeholderAvatar,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="person"
                  size={40}
                  color={colors.textSecondary}
                />
              </View>
            )}
            {item.userData?.standoutPhotoIndex !== undefined && (
              <View
                style={[
                  styles.standoutIndicator,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="star" size={12} color={colors.onPrimary} />
              </View>
            )}
            <View
              style={[styles.cardBadge, { backgroundColor: colors.primary }]}
            >
              <Text style={[styles.cardBadgeText, { color: colors.onPrimary }]}>
                {item.badge}
              </Text>
            </View>
          </View>

          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {item.title}
          </Text>

          <Text
            style={[styles.cardDescription, { color: colors.textSecondary }]}
          >
            {item.description}
          </Text>

          <View style={styles.cardStats}>
            <View style={styles.statItem}>
              <Ionicons name="people" size={16} color={colors.primary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.stats?.followers?.toLocaleString() || 0} followers
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {item.stats.rating} rating
              </Text>
            </View>
          </View>

          <View style={styles.cardActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={() => {
                navigation.navigate("UserProfile", {
                  userId: item.id,
                  userData: item.userData,
                });
              }}
            >
              <Ionicons name="person" size={16} color={colors.onPrimary} />
              <Text
                style={[styles.actionButtonText, { color: colors.onPrimary }]}
              >
                View Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.messageButton, { borderColor: colors.primary }]}
              onPress={() => setShowMessagingModal(true)}
            >
              <Ionicons name="chatbubble" size={16} color={colors.primary} />
              <Text
                style={[styles.messageButtonText, { color: colors.primary }]}
              >
                Message
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <LoadingState style={{ margin: 20 }} />
      </SafeAreaView>
    );
  }

  if (standouts.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>
              Standouts
            </Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Discover amazing people in your community
            </Text>
          </View>
        </View>
        <EmptyStandoutsState />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: colors.text }]}>Standouts</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Discover amazing people in your community
          </Text>
        </View>
        <Text style={[styles.counter, { color: colors.textSecondary }]}>
          {currentIndex + 1} of {standouts.length}
        </Text>
      </View>

      {/* User Meetup Navigation */}
      <UserMeetupNavigation
        userId="user1"
        onMeetupPress={(meetupId) => {
          navigation.navigate("MeetupDetails", { meetupId });
        }}
      />

      <View style={styles.cardContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          onScroll={onScroll}
          onMomentumScrollEnd={onMomentumScrollEnd}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          snapToAlignment="start"
          contentInsetAdjustmentBehavior="never"
        >
          {standouts.map((item, index) => renderCard(item, index))}
        </ScrollView>
      </View>

      {/* Messaging Modal */}
      <MessagingModal
        visible={showMessagingModal}
        onClose={() => setShowMessagingModal(false)}
        standouts={standouts}
        currentUser={currentUser}
        navigation={navigation}
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
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  counter: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: (width - CARD_WIDTH) / 2,
  },
  card: {
    width: CARD_WIDTH,
    marginHorizontal: CARD_MARGIN / 2,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
    alignSelf: "center",
  },
  cardContent: {
    padding: 24,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  userAvatar: {
    width: 100,
    height: 133, // 3:4 aspect ratio
    borderRadius: 16,
  },
  placeholderAvatar: {
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  standoutIndicator: {
    position: "absolute",
    top: -4,
    left: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  cardBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 20,
  },
  cardStats: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  statText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
  },
  cardActions: {
    marginTop: 16,
    width: "100%",
    gap: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  messageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 1,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
  },
  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    minHeight: "50%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  userSelection: {
    maxHeight: 100,
    paddingVertical: 16,
  },
  userSelectionContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  userSelectionItem: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 80,
  },
  userSelectionAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  userSelectionName: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  selectedUserProfile: {
    padding: 20,
    flex: 1,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  profileDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  sendMessageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    gap: 8,
  },
  sendMessageText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
