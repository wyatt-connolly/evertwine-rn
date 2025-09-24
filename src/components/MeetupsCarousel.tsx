import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { useNavigation } from "@react-navigation/native";
import MeetupCard from "./MeetupCard";
import { Meetup } from "../types";
import { getMockMeetups } from "../data/mockData";
import { DataService } from "../services/DataService";

const { height: screenHeight } = Dimensions.get("window");

interface MeetupsCarouselProps {
  onMeetupPress?: (meetup: Meetup) => void;
  onRefresh?: () => void;
  refreshing?: boolean;
  headerComponent?: () => React.ReactElement;
}

type FilterType = "for-you" | "following";

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
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState<FilterType>("for-you");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Mock data for meetups
  const allMeetups = DataService.isInDeveloperMode() ? getMockMeetups() : [];

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
        return selectedFilters.some((filterId) => {
          const filter = filterOptions.find((opt) => opt.id === filterId);
          if (!filter) return false;

          switch (filter.type) {
            case "alcohol":
              return (
                meetup.title.toLowerCase().includes("happy hour") ||
                meetup.title.toLowerCase().includes("wine") ||
                meetup.title.toLowerCase().includes("beer")
              );
            case "activity":
              return meetup.activityCategory === filter.label;
            case "location":
              return meetup.locationName
                ?.toLowerCase()
                .includes(filter.label.toLowerCase());
            case "time":
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
      });
    }

    return filtered;
  };

  const filteredMeetups = getFilteredMeetups();

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

  const toggleFilter = (filterId: string) => {
    setSelectedFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
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
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View
        style={[styles.modalContainer, { backgroundColor: colors.background }]}
      >
        <View
          style={[styles.modalHeader, { borderBottomColor: colors.border }]}
        >
          <TouchableOpacity onPress={() => setShowAdvancedFilters(false)}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            Advanced Filters
          </Text>
          <TouchableOpacity onPress={() => setSelectedFilters([])}>
            <Text style={[styles.clearButton, { color: colors.primary }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
            Alcohol Preference
          </Text>
          <FlatList
            data={filterOptions.filter((opt) => opt.type === "alcohol")}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          />

          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
            Activity Type
          </Text>
          <FlatList
            data={filterOptions.filter((opt) => opt.type === "activity")}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          />

          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
            Location
          </Text>
          <FlatList
            data={filterOptions.filter((opt) => opt.type === "location")}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          />

          <Text style={[styles.filterSectionTitle, { color: colors.text }]}>
            Time
          </Text>
          <FlatList
            data={filterOptions.filter((opt) => opt.type === "time")}
            renderItem={renderFilterChip}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          />
        </ScrollView>
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
        snapToInterval={screenHeight * 0.6}
        snapToAlignment="start"
        decelerationRate="fast"
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
  modalContainer: {
    flex: 1,
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
    fontSize: 18,
    fontWeight: "600",
  },
  clearButton: {
    fontSize: 16,
    fontWeight: "500",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 20,
  },
  filterRow: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
