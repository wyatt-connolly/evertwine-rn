import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { FeaturedMembersService } from "../../services/FeaturedMembersService";
import UserProfileScreen from "./UserProfileScreen";

const { width: screenWidth } = Dimensions.get("window");

export default function CommunityScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [standoutUsers, setStandoutUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const leftArrowBounce = useRef(new Animated.Value(1)).current;
  const rightArrowBounce = useRef(new Animated.Value(1)).current;

  // Fetch standout users on component mount
  useEffect(() => {
    fetchStandoutUsers();
  }, []);

  useEffect(() => {
    console.log("Standout users loaded:", standoutUsers.length);
  }, [standoutUsers]);

  const fetchStandoutUsers = async () => {
    if (!currentUser) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const users = await FeaturedMembersService.getDailyFeaturedMembers(
        currentUser.uid
      );
      setStandoutUsers(users);
    } catch (err) {
      console.error("Error fetching standout users:", err);
      setError("Failed to load standout users");
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / screenWidth);
    setCurrentIndex(index);
  };

  const bounceArrow = (arrowRef: Animated.Value) => {
    Animated.sequence([
      Animated.timing(arrowRef, {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(arrowRef, {
        toValue: 1,
        tension: 100,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const renderUserProfile = ({ item }: { item: any }) => (
    <View style={styles.userProfileContainer}>
      <UserProfileScreen
        route={{
          params: {
            userId: item.uid,
            userData: item,
            hideHeader: true,
          },
        }}
        navigation={navigation}
      />
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="people-outline" size={80} color={colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        No Standout Users
      </Text>
      <Text
        style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}
      >
        Check back tomorrow for new featured community members!
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={fetchStandoutUsers}
      >
        <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
        Loading standout users...
      </Text>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.emptyStateContainer}>
      <Ionicons name="alert-circle-outline" size={80} color={colors.error} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        Something went wrong
      </Text>
      <Text
        style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}
      >
        {error || "Failed to load standout users"}
      </Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: colors.primary }]}
        onPress={fetchStandoutUsers}
      >
        <Text style={[styles.retryButtonText, { color: colors.onPrimary }]}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Standouts
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Discover amazing people in your community
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SettingsPage")}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        {renderLoadingState()}
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Standouts
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Discover amazing people in your community
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SettingsPage")}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        {renderErrorState()}
      </SafeAreaView>
    );
  }

  if (standoutUsers.length === 0) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft} />
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Standouts
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Discover amazing people in your community
            </Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("SettingsPage")}>
            <Ionicons name="settings-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        {renderEmptyState()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header with Description */}
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Standouts
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Discover amazing people in your community
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* User Carousel */}
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={standoutUsers}
          renderItem={renderUserProfile}
          keyExtractor={(item) => item.uid}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          scrollEventThrottle={16}
          style={styles.carousel}
        />

        {/* Side Page Indicators */}
        {standoutUsers.length > 0 && (
          <>
            {/* Left Arrow */}
            <TouchableOpacity
              onPress={() => {
                if (currentIndex > 0) {
                  bounceArrow(leftArrowBounce);
                  const newIndex = currentIndex - 1;
                  setCurrentIndex(newIndex);
                  flatListRef.current?.scrollToIndex({
                    index: newIndex,
                    animated: true,
                  });
                }
              }}
              disabled={currentIndex === 0}
            >
              <Animated.View
                style={[
                  styles.sideIndicator,
                  styles.leftIndicator,
                  {
                    transform: [{ scale: leftArrowBounce }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-back"
                  size={24}
                  color={currentIndex === 0 ? colors.textTertiary : colors.text}
                />
              </Animated.View>
            </TouchableOpacity>

            {/* Right Arrow */}
            <TouchableOpacity
              onPress={() => {
                if (currentIndex < standoutUsers.length - 1) {
                  bounceArrow(rightArrowBounce);
                  const newIndex = currentIndex + 1;
                  setCurrentIndex(newIndex);
                  flatListRef.current?.scrollToIndex({
                    index: newIndex,
                    animated: true,
                  });
                }
              }}
              disabled={currentIndex === standoutUsers.length - 1}
            >
              <Animated.View
                style={[
                  styles.sideIndicator,
                  styles.rightIndicator,
                  {
                    transform: [{ scale: rightArrowBounce }],
                  },
                ]}
              >
                <Ionicons
                  name="chevron-forward"
                  size={24}
                  color={
                    currentIndex === standoutUsers.length - 1
                      ? colors.textTertiary
                      : colors.text
                  }
                />
              </Animated.View>
            </TouchableOpacity>
          </>
        )}
      </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerLeft: {
    width: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  headerRight: {
    width: 24,
  },
  carouselContainer: {
    flex: 1,
    position: "relative",
  },
  carousel: {
    flex: 1,
  },
  sideIndicator: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    marginTop: 100, // Adjust to center with the profile card content
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  leftIndicator: {
    left: 20,
  },
  rightIndicator: {
    right: 20,
  },
  userProfileContainer: {
    width: screenWidth,
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});
