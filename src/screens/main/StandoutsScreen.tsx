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
import { PanGestureHandler } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockStandouts } from "../../data/mockData";
import { DataService } from "../../services/DataService";
import {
  EmptyStandoutsState,
  LoadingState,
} from "../../components/EmptyStates";
import { StandoutItem } from "../../types";
import UserMeetupNavigation from "../../components/UserMeetupNavigation";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.7;
const CARD_MARGIN = 12;

export default function StandoutsScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [standouts, setStandouts] = useState<StandoutItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
          // In production mode, we don't have standouts data yet
          // For now, keep empty to show empty state
          setStandouts([]);
        }
      } catch (error) {

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
            <Image
              source={{
                uri: item.userData?.profilePictures?.[
                  item.userData?.standoutPhotoIndex !== undefined
                    ? item.userData.standoutPhotoIndex
                    : 0
                ],
              }}
              style={styles.userAvatar}
            />
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
});
