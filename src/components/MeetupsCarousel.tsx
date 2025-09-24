import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
  Animated,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { useMeetupFilterStore } from "../hooks/useMeetupFilterStore";
import { useNavigation } from "@react-navigation/native";
import MeetupCard from "./MeetupCard";
import { Meetup } from "../types";
import { getMockMeetups } from "../data/mockData";
import { DataService } from "../services/DataService";

const { height } = Dimensions.get("window");

interface MeetupsCarouselProps {
  onMeetupPress?: (meetup: Meetup) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  headerComponent?: () => React.ReactElement;
}

interface FilterOption {
  id: string;
  label: string;
  type: "alcohol" | "activity" | "location" | "time";
}

export default function MeetupsCarousel({
  onMeetupPress,
  onRefresh,
  refreshing = false,
  headerComponent,
}: MeetupsCarouselProps) {
  const { colors } = useThemeStore();
  const { activeFilter, selectedFilters, setActiveFilter, setSelectedFilters } =
    useMeetupFilterStore();
  const navigation = useNavigation();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showAdvancedFilters) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [showAdvancedFilters, slideAnim]);

  // Mock data for meetups
  const allMeetups = DataService.isInDeveloperMode() ? getMockMeetups() : [];

  // Advanced filter options
  const filterOptions: FilterOption[] = [
    // Alcohol-related
    { id: "non-alcoholic", label: "Non-alcoholic", type: "alcohol" },
    { id: "wine", label: "Wine & Cocktails", type: "alcohol" },

    // Activity types
    { id: "outdoor", label: "Outdoor", type: "activity" },
    { id: "indoor", label: "Indoor", type: "activity" },

    // Locations
    { id: "downtown", label: "Downtown", type: "location" },
    { id: "golden-gate", label: "Golden Gate Park", type: "location" },

    // Time
    { id: "today", label: "Today", type: "time" },
    { id: "weekend", label: "This Weekend", type: "time" },
  ];

  // Filter meetups based on active filter
  const getFilteredMeetups = () => {
    if (!DataService.isInDeveloperMode()) {
      return [];
    }

    let filtered = [...allMeetups];

    // Apply primary filter
    if (activeFilter === "following") {
      // In a real app, this would filter by followed hosts
      filtered = filtered.filter((meetup) => meetup.creatorId === "user1");
    }

    // Apply advanced filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter((meetup) => {
        try {
          return selectedFilters.some((filterId) => {
            const filter = filterOptions.find((opt) => opt.id === filterId);
            if (!filter) return false;

            switch (filter.type) {
              case "alcohol":
                const title = meetup.title?.toLowerCase() || "";
                return (
                  title.includes("happy hour") ||
                  title.includes("wine") ||
                  title.includes("beer") ||
                  title.includes("cocktail")
                );
              case "activity":
                const activityTitle = meetup.title?.toLowerCase() || "";
                return (
                  activityTitle.includes("outdoor") ||
                  activityTitle.includes("hiking") ||
                  activityTitle.includes("park") ||
                  activityTitle.includes("walk") ||
                  (meetup.activityCategory &&
                    meetup.activityCategory === filter.label)
                );
              case "location":
                const location = meetup.locationName?.toLowerCase() || "";
                return (
                  location.includes("downtown") ||
                  location.includes("golden gate") ||
                  location.includes("center") ||
                  location.includes(filter.label.toLowerCase())
                );
              case "time":
                if (!meetup.time) return false;
                const now = new Date();
                const meetupTime = new Date(meetup.time);
                if (filter.label === "Today") {
                  return meetupTime.toDateString() === now.toDateString();
                } else if (filter.label === "This Weekend") {
                  const day = meetupTime.getDay();
                  return day === 0 || day === 6; // Sunday or Saturday
                }
                return true;
              default:
                return true;
            }
          });
        } catch (error) {
          return false;
        }
      });
    }

    return filtered;
  };

  const filteredMeetups = getFilteredMeetups();

  const toggleFilter = (filterId: string) => {
    const newFilters = selectedFilters.includes(filterId)
      ? selectedFilters.filter((id) => id !== filterId)
      : [...selectedFilters, filterId];
    setSelectedFilters(newFilters);
  };

  const renderMeetup = ({ item }: { item: Meetup }) => (
    <View style={styles.meetupWrapper}>
      <MeetupCard
        meetup={item}
        onPress={() => onMeetupPress?.(item)}
        style={styles.meetupCard}
      />
    </View>
  );

  const renderFilterChip = ({ item }: { item: FilterOption }) => {
    const isSelected = selectedFilters.includes(item.id);
    return (
      <TouchableOpacity
        style={[
          styles.filterChip,
          {
            backgroundColor: isSelected ? colors.primary : colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={() => toggleFilter(item.id)}
      >
        <Text
          style={[
            styles.filterChipText,
            {
              color: isSelected ? colors.onPrimary : colors.text,
            },
          ]}
        >
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAdvancedFiltersModal = () => (
    <Modal
      visible={showAdvancedFilters}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowAdvancedFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.advancedFiltersModal,
            {
              backgroundColor: colors.surface,
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [height * 0.7, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Advanced Filters
            </Text>
            <TouchableOpacity
              onPress={() => setShowAdvancedFilters(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.advancedFiltersContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Alcohol Preference
              </Text>
              <View style={styles.filterChipsContainer}>
                {filterOptions
                  .filter((opt) => opt.type === "alcohol")
                  .map((item) => (
                    <View key={item.id} style={styles.filterChipWrapper}>
                      {renderFilterChip({ item })}
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Activity Type
              </Text>
              <View style={styles.filterChipsContainer}>
                {filterOptions
                  .filter((opt) => opt.type === "activity")
                  .map((item) => (
                    <View key={item.id} style={styles.filterChipWrapper}>
                      {renderFilterChip({ item })}
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Location
              </Text>
              <View style={styles.filterChipsContainer}>
                {filterOptions
                  .filter((opt) => opt.type === "location")
                  .map((item) => (
                    <View key={item.id} style={styles.filterChipWrapper}>
                      {renderFilterChip({ item })}
                    </View>
                  ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
                Time
              </Text>
              <View style={styles.filterChipsContainer}>
                {filterOptions
                  .filter((opt) => opt.type === "time")
                  .map((item) => (
                    <View key={item.id} style={styles.filterChipWrapper}>
                      {renderFilterChip({ item })}
                    </View>
                  ))}
              </View>
            </View>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Sticky App Bar with Filter Tabs - Only for Developer Login */}
      {DataService.isInDeveloperMode() && (
        <View
          style={[styles.stickyAppBar, { backgroundColor: colors.background }]}
        >
          {/* Left: Filter Tabs */}
          <View style={styles.appBarLeft}>
            <View style={styles.primaryFilters}>
              <TouchableOpacity
                style={[
                  styles.primaryFilter,
                  {
                    backgroundColor:
                      activeFilter === "for-you"
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setActiveFilter("for-you")}
              >
                <Text
                  style={[
                    styles.primaryFilterText,
                    {
                      color:
                        activeFilter === "for-you"
                          ? colors.onPrimary
                          : colors.text,
                    },
                  ]}
                >
                  For You
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryFilter,
                  {
                    backgroundColor:
                      activeFilter === "following"
                        ? colors.primary
                        : colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => setActiveFilter("following")}
              >
                <Text
                  style={[
                    styles.primaryFilterText,
                    {
                      color:
                        activeFilter === "following"
                          ? colors.onPrimary
                          : colors.text,
                    },
                  ]}
                >
                  Following
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Right: Actions */}
          <View style={styles.appBarRight}>
            <TouchableOpacity
              style={[styles.appBarButton, { backgroundColor: colors.surface }]}
              onPress={() => setShowAdvancedFilters(true)}
            >
              <Ionicons name="options-outline" size={20} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.appBarButton, { backgroundColor: colors.surface }]}
              onPress={() => (navigation as any).navigate("Notifications")}
            >
              <Ionicons
                name="notifications-outline"
                size={20}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Meetups List */}
      <FlatList
        ref={flatListRef}
        data={filteredMeetups}
        renderItem={renderMeetup}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        style={[
          styles.meetupsList,
          { paddingTop: DataService.isInDeveloperMode() ? 70 : 0 },
        ]}
        contentContainerStyle={styles.meetupsContent}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
            />
          ) : undefined
        }
        ListHeaderComponent={() => (
          <View>{headerComponent && headerComponent()}</View>
        )}
      />

      {renderAdvancedFiltersModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  stickyAppBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
    zIndex: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  appBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 2,
    justifyContent: "flex-start",
  },
  appBarAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  appBarRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  appBarButton: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 2,
  },
  stickyFilterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    borderRadius: 12,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
  },
  primaryFilters: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: 24,
    padding: 6,
  },
  primaryFilter: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 18,
    minWidth: 90,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  primaryFilterText: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  meetupsList: {
    flex: 1,
  },
  meetupsContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 20,
  },
  meetupWrapper: {
    marginBottom: 20, // This creates the gap between meetups
  },
  meetupCard: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  advancedFiltersModal: {
    height: height * 0.7,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  advancedFiltersContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  filterChipsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterChipWrapper: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
