import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockUsers } from "../../data/mockData";
import { DataService } from "../../services/DataService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function AnimatedAvatarScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [users, setUsers] = useState(() => generateMoreUsers());
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Generate 10 users for the carousel
  function generateMoreUsers() {
    const baseUsers = getMockUsers();
    const carouselUsers = [];

    const names = [
      "Emma",
      "Liam",
      "Olivia",
      "Noah",
      "Ava",
      "William",
      "Sophia",
      "Jessica",
      "Isabella",
      "Benjamin",
    ];

    const profilePics = [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
    ];

    const interests = [
      ["Technology", "Travel", "Food"],
      ["Music", "Sports", "Art"],
      ["Photography", "Cooking", "Fitness"],
      ["Reading", "Gaming", "Movies"],
      ["Dancing", "Yoga", "Hiking"],
      ["Coffee", "Wine", "Craft Beer"],
      ["Fashion", "Design", "Architecture"],
      ["Nature", "Animals", "Gardening"],
      ["Languages", "Culture", "History"],
      ["Entrepreneurship", "Finance", "Startups"],
    ];

    const locations = [
      "New York, NY",
      "San Francisco, CA",
      "Los Angeles, CA",
      "Chicago, IL",
      "Boston, MA",
      "Seattle, WA",
      "Austin, TX",
      "Denver, CO",
      "Miami, FL",
      "Portland, OR",
    ];

    const schools = [
      "Stanford University",
      "MIT",
      "UC Berkeley",
      "Harvard University",
      "NYU",
      "UCLA",
      "University of Chicago",
      "Columbia University",
      "Yale University",
      "Princeton University",
    ];

    const jobTitles = [
      "Software Engineer",
      "Product Manager",
      "Designer",
      "Data Scientist",
      "Marketing Manager",
      "Consultant",
      "Entrepreneur",
      "Researcher",
      "Artist",
      "Writer",
    ];

    const bios = [
      "Adventure seeker and coffee enthusiast ☕ Always down for spontaneous plans!",
      "Tech lover by day, foodie by night 🍜 Let's grab drinks and swap stories!",
      "Fitness junkie and travel addict ✈️ Looking for workout buddies and adventure partners!",
      "Bookworm and movie buff 📚 Down for deep convos and chill hangs.",
      "Music lover and concert goer 🎵 Always looking for new friends to catch shows with!",
      "Creative soul and design nerd 🎨 Let's collaborate or just vibe!",
      "Nature enthusiast and weekend hiker 🏔️ Seeking outdoor adventure companions!",
      "Language learner and culture explorer 🌍 Love meeting people from all walks of life!",
      "Startup founder and innovation junkie 💡 Always up for networking and brainstorming!",
      "Yoga instructor and wellness advocate 🧘 Looking for zen friends and good vibes!",
    ];

    // Generate 10 users for the carousel
    for (let i = 0; i < 10; i++) {
      const randomUser = baseUsers[i % baseUsers.length];
      carouselUsers.push({
        ...randomUser,
        uid: `carousel_user_${i}`,
        displayName: names[i],
        profilePictures: [profilePics[i]],
        age: 22 + (i % 15),
        bio: bios[i],
        interests: interests[i],
        location: locations[i],
        school: schools[i],
        jobTitle: jobTitles[i],
        pronouns: ["they/them", "she/her", "he/him"][i % 3],
      });
    }

    return carouselUsers;
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: false });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / screenWidth);
    if (index >= 0 && index < users.length) {
      setCurrentIndex(index);
    }
  };

  const [messagedUsers, setMessagedUsers] = useState<Set<string>>(new Set());
  const [messageInputs, setMessageInputs] = useState<Record<string, string>>(
    {}
  );
  const [showMessageInput, setShowMessageInput] = useState<string | null>(null);
  const messageAnimations = useRef<Record<string, Animated.Value>>({}).current;
  const [scrolledCards, setScrolledCards] = useState<Set<string>>(new Set());
  const scrollIndicatorAnims = useRef<Record<string, Animated.Value>>(
    {}
  ).current;

  const handleSendMessage = (user: any) => {
    const message = messageInputs[user.uid]?.trim();

    if (!message) {
      Alert.alert("Empty Message", "Please type a message before sending.");
      return;
    }

    // Mark user as messaged
    setMessagedUsers((prev) => new Set(prev).add(user.uid));

    // Clear input
    setMessageInputs((prev) => ({ ...prev, [user.uid]: "" }));
    setShowMessageInput(null);

    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Show success message
    Alert.alert(
      "Message Sent!",
      `Your message to ${user.displayName} has been sent successfully.`,
      [{ text: "OK" }]
    );
  };

  const getMessageAnimation = (userId: string) => {
    if (!messageAnimations[userId]) {
      messageAnimations[userId] = new Animated.Value(0);
    }
    return messageAnimations[userId];
  };

  const getScrollIndicatorAnimation = (userId: string) => {
    if (!scrollIndicatorAnims[userId]) {
      scrollIndicatorAnims[userId] = new Animated.Value(0);
    }
    return scrollIndicatorAnims[userId];
  };

  useEffect(() => {
    // Start bouncing animation for all scroll indicators
    users.forEach((user) => {
      const anim = getScrollIndicatorAnimation(user.uid);
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, [users]);

  const handleCardScroll = (userId: string, event: any) => {
    const scrollY = event.nativeEvent.contentOffset.y;
    if (scrollY > 10 && !scrolledCards.has(userId)) {
      setScrolledCards((prev) => new Set(prev).add(userId));
    }
  };

  const handleToggleMessageInput = (userId: string) => {
    const isCurrentlyShown = showMessageInput === userId;
    const animation = getMessageAnimation(userId);

    if (isCurrentlyShown) {
      // Collapse animation
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowMessageInput(null);
      });
    } else {
      // Close any other open inputs first
      if (showMessageInput) {
        const prevAnimation = getMessageAnimation(showMessageInput);
        Animated.timing(prevAnimation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }

      // Expand animation
      setShowMessageInput(userId);
      Animated.timing(animation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const renderUser = ({ item, index }: { item: any; index: number }) => {
    const messageAnimation = getMessageAnimation(item.uid);
    const animatedHeight = messageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 180],
    });
    const animatedOpacity = messageAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    const scrollIndicatorAnim = getScrollIndicatorAnimation(item.uid);
    const scrollIndicatorTranslateY = scrollIndicatorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -10],
    });
    const scrollIndicatorOpacity = scrollIndicatorAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1],
    });

    const showScrollIndicator = !scrolledCards.has(item.uid);

    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
          {/* Scrollable Content Section */}
          <ScrollView
            style={styles.contentScrollView}
            contentContainerStyle={styles.contentSection}
            showsVerticalScrollIndicator={true}
            bounces={true}
            onScroll={(event) => handleCardScroll(item.uid, event)}
            scrollEventThrottle={16}
          >
            {/* Large Profile Image with Gradient Overlay */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.profilePictures[0] }}
                style={styles.profileImage}
                resizeMode="cover"
              />
              <View style={styles.gradientOverlay} />

              {/* Floating Info Badge */}
              <View
                style={[
                  styles.infoBadge,
                  { backgroundColor: colors.background + "E6" },
                ]}
              >
                <View style={styles.badgeRow}>
                  <Ionicons name="location" size={12} color={colors.primary} />
                  <Text
                    style={[styles.badgeText, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.location.split(",")[0]}
                  </Text>
                </View>
              </View>
            </View>

            {/* Content */}
            <View style={styles.contentWrapper}>
              {/* Name and Age */}
              <View style={styles.nameSection}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {item.displayName}, {item.age}
                </Text>
                <View
                  style={[
                    styles.pronounBadge,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.pronounText, { color: colors.primary }]}>
                    {item.pronouns}
                  </Text>
                </View>
              </View>

              {/* Bio */}
              <Text
                style={[styles.bio, { color: colors.textSecondary }]}
                numberOfLines={2}
              >
                {item.bio}
              </Text>

              {/* Interests Pills */}
              <View style={styles.interestsContainer}>
                {item.interests.map((interest: string, idx: number) => (
                  <View
                    key={idx}
                    style={[
                      styles.interestPill,
                      { backgroundColor: colors.primary + "15" },
                    ]}
                  >
                    <Text
                      style={[styles.interestText, { color: colors.primary }]}
                    >
                      {interest}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Professional Info Compact */}
              <View style={styles.professionalCompact}>
                <View style={styles.compactItem}>
                  <Ionicons
                    name="briefcase"
                    size={14}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.compactText,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {item.jobTitle}
                  </Text>
                </View>
                <View style={styles.compactItem}>
                  <Ionicons
                    name="school"
                    size={14}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.compactText,
                      { color: colors.textSecondary },
                    ]}
                    numberOfLines={1}
                  >
                    {item.school}
                  </Text>
                </View>
              </View>

              {/* Message Section */}
              {messagedUsers.has(item.uid) ? (
                <Animated.View
                  style={[
                    styles.messageButton,
                    {
                      backgroundColor: colors.success || "#4CAF50",
                      transform: [{ scale: scaleAnim }],
                    },
                  ]}
                >
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                  <Text
                    style={[
                      styles.messageButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Message Sent!
                  </Text>
                </Animated.View>
              ) : (
                <>
                  {showMessageInput === item.uid && (
                    <Animated.View
                      style={[
                        styles.messageInputContainer,
                        {
                          height: animatedHeight,
                          opacity: animatedOpacity,
                          overflow: "hidden",
                        },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.messageInput,
                          {
                            backgroundColor: colors.background,
                            color: colors.text,
                            borderColor: colors.border,
                          },
                        ]}
                        placeholder={`Message ${item.displayName}...`}
                        placeholderTextColor={colors.textTertiary}
                        value={messageInputs[item.uid] || ""}
                        onChangeText={(text) =>
                          setMessageInputs((prev) => ({
                            ...prev,
                            [item.uid]: text,
                          }))
                        }
                        multiline
                        maxLength={500}
                        autoFocus
                      />
                      <View style={styles.messageActions}>
                        <TouchableOpacity
                          style={[
                            styles.messageActionButton,
                            styles.cancelButton,
                            { borderColor: colors.border },
                          ]}
                          onPress={() => handleToggleMessageInput(item.uid)}
                          activeOpacity={0.8}
                        >
                          <Text
                            style={[
                              styles.messageActionText,
                              { color: colors.textSecondary },
                            ]}
                          >
                            Cancel
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[
                            styles.messageActionButton,
                            styles.sendButton,
                            { backgroundColor: colors.primary },
                          ]}
                          onPress={() => handleSendMessage(item)}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="send" size={16} color="#fff" />
                          <Text
                            style={[
                              styles.sendButtonText,
                              { color: colors.onPrimary },
                            ]}
                          >
                            Send
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </Animated.View>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.messageButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={() => handleToggleMessageInput(item.uid)}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="chatbubble" size={18} color="#fff" />
                    <Text
                      style={[
                        styles.messageButtonText,
                        { color: colors.onPrimary },
                      ]}
                    >
                      {showMessageInput === item.uid
                        ? "Hide Message"
                        : "Send Message"}
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Additional Information */}
              <View style={styles.additionalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  About Me
                </Text>
                <Text
                  style={[styles.sectionText, { color: colors.textSecondary }]}
                >
                  Hi! I'm {item.displayName}, passionate about connecting with
                  like-minded people. I love exploring new places, trying
                  different cuisines, and meeting interesting people. Always up
                  for an adventure or a good conversation over coffee or drinks!
                  ☕🍷
                </Text>
              </View>

              <View style={styles.additionalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Looking For
                </Text>
                <Text
                  style={[styles.sectionText, { color: colors.textSecondary }]}
                >
                  Friends to explore the city with, grab drinks, try new
                  restaurants, attend events and meetups, and share new
                  experiences together!
                </Text>
              </View>

              <View style={styles.additionalSection}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Recent Activity
                </Text>
                <View style={styles.activityList}>
                  <View style={styles.activityItem}>
                    <Ionicons
                      name="calendar"
                      size={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.activityText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Attended "Wine Tasting Meetup" 2 days ago
                    </Text>
                  </View>
                  <View style={styles.activityItem}>
                    <Ionicons name="people" size={16} color={colors.primary} />
                    <Text
                      style={[
                        styles.activityText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Joined "Foodies Unite" group
                    </Text>
                  </View>
                  <View style={styles.activityItem}>
                    <Ionicons name="heart" size={16} color={colors.primary} />
                    <Text
                      style={[
                        styles.activityText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Interested in 3 upcoming happy hours
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <Animated.View
              style={[
                styles.scrollIndicator,
                {
                  opacity: scrollIndicatorOpacity,
                  transform: [{ translateY: scrollIndicatorTranslateY }],
                },
              ]}
            >
              <Ionicons name="chevron-down" size={24} color={colors.primary} />
            </Animated.View>
          )}
        </View>
      </View>
    );
  };

  if (!DataService.isInDeveloperMode()) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Community
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Discover people nearby
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Community View
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            This feature is only available in developer mode
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Community
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            New profiles every 24 hours
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {/* Page Indicator */}
      <View style={styles.pageIndicator}>
        <Text style={[styles.pageText, { color: colors.textSecondary }]}>
          {currentIndex + 1} of {users.length}
        </Text>
      </View>

      {/* User Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.uid}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
          snapToInterval={screenWidth}
          snapToAlignment="center"
          decelerationRate="fast"
          getItemLayout={(data, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
          initialScrollIndex={0}
          contentContainerStyle={styles.carouselContent}
          removeClippedSubviews={false}
        />
      </View>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.navArrowLeft, { backgroundColor: colors.surface }]}
          onPress={() => {
            const newIndex = currentIndex - 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToOffset({
              offset: newIndex * screenWidth,
              animated: true,
            });
          }}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {currentIndex < users.length - 1 && (
        <TouchableOpacity
          style={[styles.navArrowRight, { backgroundColor: colors.surface }]}
          onPress={() => {
            const newIndex = currentIndex + 1;
            setCurrentIndex(newIndex);
            flatListRef.current?.scrollToOffset({
              offset: newIndex * screenWidth,
              animated: true,
            });
          }}
        >
          <Ionicons name="chevron-forward" size={24} color={colors.text} />
        </TouchableOpacity>
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
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  pageIndicator: {
    paddingVertical: 12,
    alignItems: "center",
  },
  pageText: {
    fontSize: 13,
    fontWeight: "600",
  },
  carouselContainer: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
  carouselContent: {
    paddingHorizontal: 0,
  },
  cardWrapper: {
    width: screenWidth,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  userCard: {
    flex: 1,
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    maxHeight: screenHeight - 285,
  },
  contentScrollView: {
    flex: 1,
  },
  imageContainer: {
    height: screenHeight * 0.42,
    position: "relative",
    marginBottom: 0,
  },
  contentWrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "transparent",
  },
  infoBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  contentSection: {
    flexGrow: 1,
  },
  nameSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    flex: 1,
  },
  pronounBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pronounText: {
    fontSize: 11,
    fontWeight: "600",
  },
  bio: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  interestPill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  interestText: {
    fontSize: 13,
    fontWeight: "600",
  },
  professionalCompact: {
    gap: 8,
    marginBottom: 20,
  },
  compactItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  compactText: {
    fontSize: 13,
    flex: 1,
  },
  messageInputContainer: {
    width: "100%",
    marginBottom: 12,
    gap: 10,
    paddingTop: 8,
  },
  messageInput: {
    width: "100%",
    minHeight: 80,
    maxHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    textAlignVertical: "top",
  },
  messageActions: {
    flexDirection: "row",
    gap: 10,
  },
  messageActionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  cancelButton: {
    borderWidth: 1,
  },
  sendButton: {
    // backgroundColor set dynamically
  },
  messageActionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  messageButton: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 14,
    gap: 8,
    marginBottom: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
  navArrowLeft: {
    position: "absolute",
    left: 8,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  navArrowRight: {
    position: "absolute",
    right: 8,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 16,
    left: "50%",
    marginLeft: -12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
  additionalSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activityText: {
    fontSize: 13,
    flex: 1,
  },
});
