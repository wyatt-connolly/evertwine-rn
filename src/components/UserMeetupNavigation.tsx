import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import {
  getUserUpcomingMeetups,
  getUserLiveMeetups,
  getUserPastMeetups,
  getUserMeetupStats,
  UserMeetup,
} from "../data/userMeetups";

const { width, height } = Dimensions.get("window");

interface UserMeetupNavigationProps {
  userId: string;
  onMeetupPress: (meetupId: string) => void;
  style?: any;
  compact?: boolean;
}

export default function UserMeetupNavigation({
  userId,
  onMeetupPress,
  style,
  compact = false,
}: UserMeetupNavigationProps) {
  const { colors } = useThemeStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"upcoming" | "live" | "past">(
    "upcoming"
  );

  const upcomingMeetups = getUserUpcomingMeetups(userId);
  const liveMeetups = getUserLiveMeetups(userId);
  const pastMeetups = getUserPastMeetups(userId);
  const stats = getUserMeetupStats(userId);

  const renderMeetupItem = (userMeetup: UserMeetup) => (
    <TouchableOpacity
      key={userMeetup.meetup.id}
      style={[styles.meetupItem, { backgroundColor: colors.surface }]}
      onPress={() => {
        onMeetupPress(userMeetup.meetup.id);
        setModalVisible(false);
      }}
    >
      <Image
        source={{ uri: userMeetup.meetup.coverImage }}
        style={styles.meetupImage}
      />
      <View style={styles.meetupContent}>
        <View style={styles.meetupHeader}>
          <Text
            style={[styles.meetupTitle, { color: colors.text }]}
            numberOfLines={2}
          >
            {userMeetup.meetup.title}
          </Text>
          <View style={styles.headerRight}>
            {userMeetup.status === "live" && (
              <View
                style={[
                  styles.liveIndicator,
                  { backgroundColor: colors.secondary },
                ]}
              >
                <View
                  style={[
                    styles.liveDot,
                    { backgroundColor: colors.onPrimary },
                  ]}
                />
                <Text style={[styles.liveText, { color: colors.onPrimary }]}>
                  LIVE
                </Text>
              </View>
            )}
            <View
              style={[
                styles.roleTag,
                {
                  backgroundColor:
                    userMeetup.role === "creator"
                      ? colors.primary
                      : colors.secondary,
                },
              ]}
            >
              <Text style={[styles.roleText, { color: colors.onPrimary }]}>
                {userMeetup.role === "creator" ? "Host" : "Joined"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.meetupDetails}>
          <View style={styles.detailRow}>
            <Ionicons
              name="calendar-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {userMeetup.meetup.time.toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="location-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text
              style={[styles.detailText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {userMeetup.meetup.locationName}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons
              name="people-outline"
              size={14}
              color={colors.textSecondary}
            />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {userMeetup.meetup.currentParticipants} participants
            </Text>
          </View>
        </View>

        {userMeetup.status === "completed" && userMeetup.rating && (
          <View style={styles.ratingContainer}>
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= userMeetup.rating! ? "star" : "star-outline"}
                  size={12}
                  color="#FFD700"
                />
              ))}
            </View>
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              Your rating
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderStats = () => (
    <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {stats.upcoming}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Upcoming
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.secondary }]}>
          {stats.past}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Past
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.primary }]}>
          {stats.created}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Hosted
        </Text>
      </View>
      <View style={styles.statItem}>
        <Text style={[styles.statNumber, { color: colors.secondary }]}>
          {stats.joined}
        </Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
          Joined
        </Text>
      </View>
    </View>
  );

  if (compact) {
    return (
      <TouchableOpacity
        style={[
          styles.compactButton,
          { backgroundColor: colors.primary },
          style,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="calendar" size={16} color={colors.onPrimary} />
        <Text style={[styles.compactButtonText, { color: colors.onPrimary }]}>
          My Meetups ({stats.upcoming + stats.past})
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity
        style={[
          styles.navigationButton,
          { backgroundColor: colors.surface },
          style,
        ]}
        onPress={() => setModalVisible(true)}
      >
        <View style={styles.navigationContent}>
          <View style={styles.navigationHeader}>
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={[styles.navigationTitle, { color: colors.text }]}>
              My Meetups
            </Text>
            <Ionicons
              name="chevron-forward"
              size={16}
              color={colors.textSecondary}
            />
          </View>
          <Text
            style={[styles.navigationSubtitle, { color: colors.textSecondary }]}
          >
            {stats.upcoming} upcoming • {stats.past} past
          </Text>
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable
            style={[
              styles.modalContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <View
              style={[styles.modalHeader, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                My Meetups
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {renderStats()}

            <View style={styles.tabContainer}>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      selectedTab === "upcoming"
                        ? colors.primary
                        : colors.surface,
                  },
                ]}
                onPress={() => setSelectedTab("upcoming")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        selectedTab === "upcoming"
                          ? colors.onPrimary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Upcoming ({upcomingMeetups.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      selectedTab === "live"
                        ? colors.secondary
                        : colors.surface,
                  },
                ]}
                onPress={() => setSelectedTab("live")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        selectedTab === "live"
                          ? colors.onPrimary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Live ({liveMeetups.length})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.tabButton,
                  {
                    backgroundColor:
                      selectedTab === "past" ? colors.primary : colors.surface,
                  },
                ]}
                onPress={() => setSelectedTab("past")}
              >
                <Text
                  style={[
                    styles.tabText,
                    {
                      color:
                        selectedTab === "past"
                          ? colors.onPrimary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  Past ({pastMeetups.length})
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.meetupsList}
              showsVerticalScrollIndicator={false}
            >
              {selectedTab === "upcoming" ? (
                upcomingMeetups.length > 0 ? (
                  upcomingMeetups.map(renderMeetupItem)
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="calendar-outline"
                      size={48}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.emptyText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No upcoming meetups
                    </Text>
                    <Text
                      style={[
                        styles.emptySubtext,
                        { color: colors.textTertiary },
                      ]}
                    >
                      Join or create a meetup to get started
                    </Text>
                  </View>
                )
              ) : selectedTab === "live" ? (
                liveMeetups.length > 0 ? (
                  liveMeetups.map(renderMeetupItem)
                ) : (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="radio-outline"
                      size={48}
                      color={colors.textTertiary}
                    />
                    <Text
                      style={[
                        styles.emptyText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      No live meetups
                    </Text>
                    <Text
                      style={[
                        styles.emptySubtext,
                        { color: colors.textTertiary },
                      ]}
                    >
                      Currently ongoing meetups will appear here
                    </Text>
                  </View>
                )
              ) : pastMeetups.length > 0 ? (
                pastMeetups.map(renderMeetupItem)
              ) : (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={48}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[styles.emptyText, { color: colors.textSecondary }]}
                  >
                    No past meetups
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtext,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Your completed meetups will appear here
                  </Text>
                </View>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  navigationButton: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  navigationContent: {
    flex: 1,
  },
  navigationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  navigationTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    flex: 1,
  },
  navigationSubtitle: {
    fontSize: 14,
    marginLeft: 28,
  },
  compactButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  compactButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  statsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  meetupsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  meetupItem: {
    flexDirection: "row",
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  meetupImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  meetupContent: {
    flex: 1,
  },
  meetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "600",
  },
  roleTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  meetupDetails: {
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stars: {
    flexDirection: "row",
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: "center",
  },
});
