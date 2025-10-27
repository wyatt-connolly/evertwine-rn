import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  ScrollView,
  Animated,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupFilterStore } from "../../hooks/useMeetupFilterStore";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
// import { useMeetupStore } from "../../hooks/useMeetupStore"; // No longer needed
import { Meetup } from "../../types";
import MeetupCard from "../../components/MeetupCard";
import { SupabaseDataService } from "../../services/SupabaseDataService";

const { height } = Dimensions.get("window");

// Filter options to match MeetupsCarousel
const filterOptions = [
  { id: "non-alcoholic", label: "Non-alcoholic", type: "alcohol" },
  { id: "wine", label: "Wine & Cocktails", type: "alcohol" },
  { id: "outdoor", label: "Outdoor", type: "activity" },
  { id: "indoor", label: "Indoor", type: "activity" },
  { id: "downtown", label: "Downtown", type: "location" },
  { id: "golden-gate", label: "Golden Gate Park", type: "location" },
  { id: "today", label: "Today", type: "time" },
  { id: "weekend", label: "This Weekend", type: "time" },
];

export default function AllMeetupsScreen() {
  const navigation = useNavigation();
  const { colors } = useThemeStore();
  const { activeFilter, selectedFilters, setActiveFilter, setSelectedFilters } =
    useMeetupFilterStore();
  // const { meetups: localMeetups } = useMeetupStore(); // No longer needed
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [allMeetups, setAllMeetups] = useState<Meetup[]>([]);
  // const [loading, setLoading] = useState(true); // Not used in UI
  const [refreshing, setRefreshing] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Load meetups from Supabase
  const loadMeetups = async () => {
    try {
      const meetupsData = await SupabaseDataService.getMeetups();
      setAllMeetups(meetupsData || []);
    } catch (error) {
      console.error("Error loading meetups:", error);
      setAllMeetups([]);
    }
  };

  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const meetupsData = await SupabaseDataService.getMeetups();
      setAllMeetups(meetupsData || []);
    } catch (error) {
      console.error("Error refreshing meetups:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadMeetups();
  }, []);

  // Refresh data when screen comes into focus (only when needed)
  useFocusEffect(
    React.useCallback(() => {
      // Check if we need to refresh based on route params
      const currentRoute = navigation
        .getState()
        ?.routes?.find((route: any) => route.name === "AllMeetups");
      const shouldRefresh = (currentRoute?.params as any)?.refresh;

      if (shouldRefresh) {
        loadMeetups();
        // Clear the refresh flag
        navigation.setParams({ refresh: false } as any);
      }
    }, [navigation])
  );

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

  // Meetups are now loaded from Supabase in useEffect

  const getFilteredMeetups = () => {
    let filtered = [...allMeetups];

    // Filter out past meetups
    const now = new Date();
    filtered = filtered.filter((meetup) => {
      const meetupTime = new Date(meetup.time);
      return meetupTime.getTime() > now.getTime();
    });

    // Apply primary filter
    if (activeFilter === "following") {
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

  const renderMeetup = ({ item }: { item: Meetup }) => (
    <MeetupCard
      key={item.id}
      meetup={item}
      onPress={() =>
        navigation.navigate("MeetupDetails", {
          meetupId: item.id,
          meetupData: item,
        })
      }
      style={[styles.meetupCard, { backgroundColor: colors.surface }]}
    />
  );

  const renderFilterButton = (
    filter: "for-you" | "following",
    label: string
  ) => (
    <TouchableOpacity
      key={filter}
      style={[
        styles.filterButton,
        {
          backgroundColor:
            activeFilter === filter ? colors.primary : colors.surface,
          borderColor: colors.border,
        },
      ]}
      onPress={() => setActiveFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          {
            color: activeFilter === filter ? colors.onPrimary : colors.text,
          },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderFilterChip = ({ item }: { item: (typeof filterOptions)[0] }) => {
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
        onPress={() => {
          const newFilters = selectedFilters.includes(item.id)
            ? selectedFilters.filter((id) => id !== item.id)
            : [...selectedFilters, item.id];
          setSelectedFilters(newFilters);
        }}
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

  const renderActiveFilterChip = ({
    item,
  }: {
    item: (typeof filterOptions)[0];
  }) => (
    <View
      key={item.id}
      style={[
        styles.activeFilterChip,
        { backgroundColor: colors.primary + "20", borderColor: colors.primary },
      ]}
    >
      <Text style={[styles.activeFilterText, { color: colors.primary }]}>
        {item.label}
      </Text>
      <TouchableOpacity
        onPress={() => {
          const newFilters = selectedFilters.filter((id) => id !== item.id);
          setSelectedFilters(newFilters);
        }}
        style={styles.removeFilterButton}
      >
        <Ionicons name="close" size={14} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const getActiveFilters = () => {
    return filterOptions.filter((filter) =>
      selectedFilters.includes(filter.id)
    );
  };

  const activeFilters = getActiveFilters();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          All Meetups{" "}
          {selectedFilters.length > 0 && `(${selectedFilters.length} filters)`}
        </Text>
        <View style={styles.headerRight} />
      </View>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <View
          style={[
            styles.activeFiltersContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.activeFiltersTitle, { color: colors.text }]}>
            Active Filters:
          </Text>
          <FlatList
            data={activeFilters}
            renderItem={renderActiveFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.activeFiltersList}
            ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          />
        </View>
      )}

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {/* Filter Button */}
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: showAdvancedFilters
                ? colors.primary
                : colors.surface,
              borderColor: colors.border,
            },
          ]}
          onPress={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          <Ionicons
            name="options-outline"
            size={16}
            color={showAdvancedFilters ? colors.onPrimary : colors.text}
          />
          <Text
            style={[
              styles.filterButtonText,
              {
                color: showAdvancedFilters ? colors.onPrimary : colors.text,
              },
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>

        {/* Primary Filter Buttons */}
        {renderFilterButton("for-you", "For You")}
        {renderFilterButton("following", "Following")}
      </View>

      {/* Advanced Filters Modal */}
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
                <Text
                  style={[styles.filterSectionTitle, { color: colors.text }]}
                >
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
                <Text
                  style={[styles.filterSectionTitle, { color: colors.text }]}
                >
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
                <Text
                  style={[styles.filterSectionTitle, { color: colors.text }]}
                >
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
                <Text
                  style={[styles.filterSectionTitle, { color: colors.text }]}
                >
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

      {/* Meetups List */}
      <FlatList
        data={filteredMeetups}
        renderItem={renderMeetup}
        keyExtractor={(item) => item.id}
        style={styles.meetupsList}
        contentContainerStyle={styles.meetupsContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="people-outline"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Meetups Found
            </Text>
            <Text
              style={[styles.emptySubtitle, { color: colors.textSecondary }]}
            >
              Try adjusting your filters or create a new meetup to get started.
            </Text>
            <TouchableOpacity
              style={[styles.createButton, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate("Create")}
            >
              <Text
                style={[styles.createButtonText, { color: colors.onPrimary }]}
              >
                Create Meetup
              </Text>
            </TouchableOpacity>
          </View>
        }
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  headerRight: {
    width: 40,
  },
  activeFiltersContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  activeFiltersTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  activeFiltersList: {
    flexDirection: "row",
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 6,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "500",
  },
  removeFilterButton: {
    padding: 2,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
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
  meetupsList: {
    flex: 1,
  },
  meetupsContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  meetupCard: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 40,
    marginBottom: 24,
  },
  createButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
