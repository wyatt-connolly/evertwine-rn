import React, { useState, useRef } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { User } from "../../types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Mock data for testing
const mockUsers: User[] = [
  {
    uid: "mock1",
    displayName: "Alex Johnson",
    age: 25,
    locationName: "San Francisco, CA",
    pronouns: "they/them",
    bio: "Love hiking, photography, and good coffee. Always up for an adventure!",
    interests: ["Photography", "Hiking", "Coffee"],
    hobbies: ["Rock Climbing", "Cooking"],
    school: "UC Berkeley",
    jobTitle: "Software Engineer",
    jobCompany: "Tech Corp",
    lookingFor: ["Friendship", "Adventure"],
    profilePictures: [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=800&h=800&fit=crop",
    ],
    isVerified: "verified",
    lastActive: new Date().toISOString(),
    onboarding_complete: true,
  },
  {
    uid: "mock2",
    displayName: "Sam Chen",
    age: 28,
    locationName: "New York, NY",
    pronouns: "she/her",
    bio: "Artist and designer. Love exploring new neighborhoods and trying new restaurants.",
    interests: ["Art", "Design", "Food"],
    hobbies: ["Painting", "Yoga"],
    school: "Parsons School of Design",
    jobTitle: "UX Designer",
    jobCompany: "Creative Studio",
    lookingFor: ["Creative Collaboration", "Food Adventures"],
    profilePictures: [
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
    ],
    isVerified: "verified",
    lastActive: new Date().toISOString(),
    onboarding_complete: true,
  },
  {
    uid: "mock3",
    displayName: "Jordan Smith",
    age: 30,
    locationName: "Austin, TX",
    pronouns: "they/them",
    bio: "Fitness enthusiast and outdoor adventurer. Love rock climbing, hiking, and trying new restaurants.",
    interests: ["Fitness", "Outdoor Activities", "Food"],
    hobbies: ["Rock Climbing", "Cooking", "Photography"],
    school: "UT Austin",
    jobTitle: "Personal Trainer",
    jobCompany: "FitLife Gym",
    lookingFor: ["Workout Partners", "Adventure Buddies"],
    profilePictures: [
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
    ],
    isVerified: "pending",
    lastActive: new Date().toISOString(),
    onboarding_complete: true,
  },
];

export default function CommunityScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users] = useState<User[]>(mockUsers);
  const [likedUsers, setLikedUsers] = useState<Set<string>>(new Set());

  // Debug logging
  console.log("CommunityScreen - Users loaded:", users.length);
  console.log("CommunityScreen - Current index:", currentIndex);

  const flatListRef = useRef<FlatList>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const scrollToIndex = (index: number) => {
    if (flatListRef.current && index >= 0 && index < users.length) {
      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });
    }
  };

  const handleLike = (userId: string) => {
    setLikedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleMessage = (user: User) => {
    // Navigate to chat or show message modal
    console.log("Message user:", user.displayName);
  };

  const renderUser = ({ item, index }: { item: User; index: number }) => {
    const isLiked = likedUsers.has(item.uid);

    return (
      <View style={[styles.userCard, { width: screenWidth }]}>
        <View style={styles.userScrollView}>
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
            {item.profilePictures && item.profilePictures.length > 0 ? (
              <Image
                source={{ uri: item.profilePictures[0] }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <View
                style={[
                  styles.placeholderImage,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Ionicons
                  name="person"
                  size={80}
                  color={colors.textSecondary}
                />
              </View>
            )}

            {/* Gradient Overlay */}
            <View style={styles.gradientOverlay} />

            {/* Verification Badge */}
            {item.isVerified === "verified" && (
              <View
                style={[
                  styles.verifiedBadge,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
              </View>
            )}

            {/* User Info Overlay */}
            <View style={styles.userInfoOverlay}>
              <View style={styles.nameRow}>
                <Text style={[styles.userName, { color: "white" }]}>
                  {item.displayName || "Unknown User"}, {item.age || "?"}
                </Text>
              </View>

              <Text style={[styles.location, { color: "white" }]}>
                <Ionicons name="location-outline" size={16} color="white" />{" "}
                {item.locationName || "Location not specified"}
              </Text>

              {item.pronouns && (
                <Text style={[styles.pronouns, { color: "white" }]}>
                  {item.pronouns}
                </Text>
              )}
            </View>
          </View>

          {/* Scrollable Content */}
          <View style={styles.contentContainer}>
            {/* Bio */}
            <View style={styles.bioSection}>
              <Text style={[styles.bioTitle, { color: colors.text }]}>
                About
              </Text>
              <Text style={[styles.bioText, { color: colors.textSecondary }]}>
                {item.bio || "This user hasn't added a bio yet."}
              </Text>
            </View>

            {/* Interests */}
            <View style={styles.interestsSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Interests
              </Text>
              <View style={styles.interestsContainer}>
                {item.interests && item.interests.length > 0 ? (
                  item.interests.map((interest, index) => (
                    <View
                      key={index}
                      style={[
                        styles.interestTag,
                        { backgroundColor: colors.primary + "20" },
                      ]}
                    >
                      <Text
                        style={[styles.interestText, { color: colors.primary }]}
                      >
                        {interest}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    No interests listed
                  </Text>
                )}
              </View>
            </View>

            {/* Hobbies */}
            <View style={styles.hobbiesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Hobbies
              </Text>
              <View style={styles.interestsContainer}>
                {item.hobbies && item.hobbies.length > 0 ? (
                  item.hobbies.map((hobby, index) => (
                    <View
                      key={index}
                      style={[
                        styles.interestTag,
                        { backgroundColor: colors.accent + "20" },
                      ]}
                    >
                      <Text
                        style={[styles.interestText, { color: colors.accent }]}
                      >
                        {hobby}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    No hobbies listed
                  </Text>
                )}
              </View>
            </View>

            {/* Education & Work */}
            <View style={styles.educationWorkSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Education & Work
              </Text>
              {item.school && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="school-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    {item.school}
                  </Text>
                </View>
              )}
              {item.jobTitle && item.jobCompany && (
                <View style={styles.infoRow}>
                  <Ionicons
                    name="briefcase-outline"
                    size={16}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.infoText, { color: colors.textSecondary }]}
                  >
                    {item.jobTitle} at {item.jobCompany}
                  </Text>
                </View>
              )}
            </View>

            {/* Looking For */}
            <View style={styles.lookingForSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Looking For
              </Text>
              <View style={styles.interestsContainer}>
                {item.lookingFor && item.lookingFor.length > 0 ? (
                  item.lookingFor.map((lookingForItem, index) => (
                    <View
                      key={index}
                      style={[
                        styles.interestTag,
                        { backgroundColor: colors.success + "20" },
                      ]}
                    >
                      <Text
                        style={[styles.interestText, { color: colors.success }]}
                      >
                        {lookingForItem}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    Not specified
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.surface }]}
            onPress={() => handleMessage(item)}
          >
            <Ionicons name="chatbubble-outline" size={24} color={colors.text} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Message
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.primary }]}
            onPress={() => handleLike(item.uid)}
          >
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={colors.onPrimary}
            />
            <Text
              style={[styles.actionButtonText, { color: colors.onPrimary }]}
            >
              {isLiked ? "Liked" : "Like"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
          snapToInterval={screenWidth}
          decelerationRate="fast"
        >
          {users.map((user, index) => {
            const userElement = renderUser({ item: user, index });
            return React.cloneElement(userElement, { key: user.uid });
          })}
        </ScrollView>
      </View>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.navArrowLeft, { backgroundColor: colors.surface }]}
          onPress={() => scrollToIndex(currentIndex - 1)}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}

      {currentIndex < users.length - 1 && (
        <TouchableOpacity
          style={[styles.navArrowRight, { backgroundColor: colors.surface }]}
          onPress={() => scrollToIndex(currentIndex + 1)}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: "400",
  },
  pageIndicator: {
    alignItems: "center",
    paddingVertical: 12,
  },
  pageText: {
    fontSize: 16,
    fontWeight: "500",
  },
  carouselContainer: {
    flex: 1,
  },
  carousel: {
    flex: 1,
  },
  userCard: {
    width: screenWidth,
    height: "100%",
    backgroundColor: "transparent",
  },
  userScrollView: {
    flex: 1,
    justifyContent: "space-between",
  },
  profileImageContainer: {
    position: "relative",
    height: screenHeight * 0.5,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  verifiedBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoOverlay: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  location: {
    fontSize: 16,
    color: "white",
    marginBottom: 4,
  },
  pronouns: {
    fontSize: 14,
    color: "white",
    opacity: 0.9,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: "transparent",
    flex: 1,
  },
  bioSection: {
    marginBottom: 24,
  },
  bioTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
  },
  interestsSection: {
    marginBottom: 24,
  },
  hobbiesSection: {
    marginBottom: 24,
  },
  educationWorkSection: {
    marginBottom: 24,
  },
  lookingForSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  interestTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  interestText: {
    fontSize: 14,
    fontWeight: "500",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  actionButtons: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  navArrowLeft: {
    position: "absolute",
    left: 16,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
    transform: [{ translateY: -20 }],
  },
  navArrowRight: {
    position: "absolute",
    right: 16,
    top: "50%",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
    transform: [{ translateY: -20 }],
  },
  debugContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  debugText: {
    fontSize: 16,
    textAlign: "center",
  },
});
