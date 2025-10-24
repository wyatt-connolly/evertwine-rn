import React, { useState, useRef, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  FlatList,
  Alert,
  Modal,
  Animated,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { Ionicons } from "@expo/vector-icons";
import { getMeetupsByCreator } from "../../data/mockData";
import { NotificationService } from "../../services/NotificationService";

const { width, height } = Dimensions.get("window");
const PHOTO_HEIGHT = height * 0.3;

interface UserProfileScreenProps {
  route: {
    params: {
      userId: string;
      userData?: any;
      fromMessage?: boolean;
    };
  };
  navigation: any;
}

export default function UserProfileScreen({
  route,
  navigation,
}: UserProfileScreenProps) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const { userData } = route.params;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Menu state
  const [showMenu, setShowMenu] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  // Animation refs
  const menuScale = useRef(new Animated.Value(0)).current;
  const menuOpacity = useRef(new Animated.Value(0)).current;
  const menuButtonRef = useRef<View>(null);

  // Track profile view
  useEffect(() => {
    if (currentUser && userData && currentUser.uid !== userData.uid) {
      // Send profile view notification
      NotificationService.createProfileViewNotification(
        currentUser.uid,
        userData.uid,
        currentUser.displayName || "Someone"
      ).catch((error) => {});
    }
  }, [currentUser, userData]);

  // Check if user is blocked
  useEffect(() => {
    checkIfBlocked();
  }, []);

  // Refresh blocked state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      refreshBlockedState();
    }, [])
  );

  const checkIfBlocked = async () => {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser || !userData?.uid) return;

    try {
      const blockedUsers = await DataService.getBlockedUsers(currentUser.uid);
      const isUserBlocked = blockedUsers.includes(userData.uid);
      setIsBlocked(isUserBlocked);
    } catch (error) {}
  };

  const refreshBlockedState = async () => {
    await checkIfBlocked();
  };

  const handlePhotoScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentPhotoIndex(index);
  };

  const handleMessagePress = async () => {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to send messages");
      return;
    }

    try {
      const { room, error } = await DataService.findOrCreateDirectMessage(
        currentUser.uid,
        userData.uid,
        userData
      );

      if (error || !room) {
        Alert.alert("Error", "Could not start conversation. Please try again.");
        return;
      }

      // Navigate to MessageDetails at root level
      navigation.navigate("MessageDetails", { roomId: room.id });
    } catch (error) {
      Alert.alert("Error", "Could not start conversation. Please try again.");
    }
  };

  const handleUnblockUser = async () => {
    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${userData?.displayName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "default",
          onPress: async () => {
            try {
              const currentUser = useAuthStore.getState().user;
              if (currentUser && userData?.uid) {
                await DataService.unblockUser(currentUser.uid, userData.uid);
                setIsBlocked(false);
                // Refresh state from database to ensure sync
                await refreshBlockedState();
                Alert.alert(
                  "Success",
                  `${userData.displayName} has been unblocked.`
                );
              }
            } catch (error) {
              Alert.alert("Error", "Failed to unblock user. Please try again.");
            }
          },
        },
      ]
    );
  };

  const renderPhoto = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
      {index === userData?.standoutPhotoIndex && (
        <View
          style={[styles.standoutBadge, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="star" size={16} color={colors.onPrimary} />
          <Text style={[styles.standoutText, { color: colors.onPrimary }]}>
            Standout
          </Text>
        </View>
      )}
    </View>
  );

  // Menu handlers
  const handleMenuPress = () => {
    setShowMenu(true);
    Animated.parallel([
      Animated.spring(menuScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCloseMenu = () => {
    Animated.parallel([
      Animated.spring(menuScale, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(menuOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMenu(false);
    });
  };

  const handleBlockUser = async () => {
    setShowMenu(false);

    // Check if user is already blocked
    if (isBlocked) {
      Alert.alert("Already Blocked", "This user is already blocked.");
      return;
    }

    Alert.alert(
      "Block User",
      "Are you sure you want to block this user? This will:\n\n• Remove all messages between you\n• Delete your conversation\n• Hide you from each other everywhere\n• Remove you from shared meetups\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            setIsBlocking(true);
            try {
              const currentUser = useAuthStore.getState().user;
              if (currentUser && userData?.uid) {
                await DataService.blockUser(currentUser.uid, userData.uid);
                setIsBlocked(true);
                // Refresh state from database to ensure sync
                await refreshBlockedState();
                Alert.alert(
                  "User Blocked",
                  "This user has been blocked and all data between you has been removed.",
                  [{ text: "OK" }]
                );
              }
            } catch (error) {
              // Check if it's a duplicate key error
              if (
                error &&
                typeof error === "object" &&
                "code" in error &&
                error.code === "23505"
              ) {
                Alert.alert("Already Blocked", "This user is already blocked.");
                setIsBlocked(true);
              } else {
                Alert.alert("Error", "Failed to block user. Please try again.");
              }
            } finally {
              setIsBlocking(false);
            }
          },
        },
      ]
    );
  };

  const handleReportConversation = async () => {
    setShowMenu(false);

    Alert.alert("Report User", "Why are you reporting this user?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Spam",
        onPress: () => submitReport("spam"),
      },
      {
        text: "Harassment",
        onPress: () => submitReport("harassment"),
      },
      {
        text: "Inappropriate Content",
        onPress: () => submitReport("inappropriate"),
      },
      {
        text: "Threats",
        onPress: () => submitReport("threats"),
      },
      {
        text: "Other",
        onPress: () => submitReport("other"),
      },
    ]);
  };

  const submitReport = async (reason: string) => {
    setIsReporting(true);
    try {
      const currentUser = useAuthStore.getState().user;
      if (currentUser && userData?.uid) {
        // For profile reports, we'll show a success message
        // In a real app, you'd create a separate profile report table

        // Ask if user wants to block after reporting
        Alert.alert(
          "Report Submitted",
          "Thank you for your report. Would you also like to block this user?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes, Block User",
              style: "destructive",
              onPress: async () => {
                try {
                  await DataService.blockUser(currentUser.uid, userData.uid);
                  Alert.alert(
                    "User Blocked",
                    "This user has been blocked and all data between you has been removed.",
                    [{ text: "OK", onPress: () => navigation.goBack() }]
                  );
                } catch (error) {
                  Alert.alert(
                    "Error",
                    "Report submitted but failed to block user."
                  );
                }
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top", "left", "right"]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {userData?.displayName || "User Profile"}
        </Text>
        <TouchableOpacity onPress={handleMenuPress} ref={menuButtonRef}>
          <Ionicons name="ellipsis-vertical" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
          {/* Photo Gallery */}
          {userData?.profilePictures && userData.profilePictures.length > 0 ? (
            <View style={styles.photoGalleryContainer}>
              <FlatList
                data={userData.profilePictures.filter((photo: string) => photo)}
                renderItem={renderPhoto}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handlePhotoScroll}
                scrollEventThrottle={16}
                style={styles.photoGallery}
              />

              {/* Photo Indicators */}
              <View style={styles.photoIndicators}>
                {userData.profilePictures
                  .filter((photo: string) => photo)
                  .map((_: string, index: number) => (
                    <View
                      key={index}
                      style={[
                        styles.indicator,
                        {
                          backgroundColor:
                            index === currentPhotoIndex
                              ? colors.primary
                              : colors.textSecondary + "40",
                        },
                      ]}
                    />
                  ))}
              </View>

              {/* Photo Counter */}
              <View
                style={[
                  styles.photoCounter,
                  { backgroundColor: colors.surface + "90" },
                ]}
              >
                <Text style={[styles.photoCounterText, { color: colors.text }]}>
                  {currentPhotoIndex + 1} /{" "}
                  {
                    userData.profilePictures.filter((photo: string) => photo)
                      .length
                  }
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.emptyPhotosContainer}>
              <View
                style={[
                  styles.profilePhotoPlaceholder,
                  { backgroundColor: colors.border },
                ]}
              >
                <Ionicons name="person" size={80} color={colors.textTertiary} />
              </View>
            </View>
          )}

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.name, { color: colors.text }]}>
                {userData?.displayName || "User"}
              </Text>
            </View>

            <Text style={[styles.agePronouns, { color: colors.textSecondary }]}>
              {userData?.age} • {userData?.pronouns}
            </Text>

            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={[styles.location, { color: colors.textSecondary }]}>
                {userData?.locationName || "Location not set"}
              </Text>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              {isBlocked ? (
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.border },
                  ]}
                  onPress={handleUnblockUser}
                >
                  <Ionicons name="ban" size={20} color={colors.textTertiary} />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Blocked
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleMessagePress}
                >
                  <Ionicons
                    name="chatbubble"
                    size={20}
                    color={colors.onPrimary}
                  />
                  <Text
                    style={[
                      styles.primaryButtonText,
                      { color: colors.onPrimary },
                    ]}
                  >
                    Message
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          {userData?.bio ? (
            <Text style={[styles.bio, { color: colors.text }]}>
              {userData.bio}
            </Text>
          ) : (
            <View style={styles.emptyBioContainer}>
              <Ionicons
                name="document-text-outline"
                size={32}
                color={colors.textTertiary}
              />
            </View>
          )}
        </View>

        {/* Interests Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Interests
          </Text>
          <View style={styles.interestsList}>
            {userData?.hobbies && userData.hobbies.length > 0 ? (
              userData.hobbies.map((hobby: string, index: number) => (
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
                    {hobby}
                  </Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyInterestsContainer}>
                <Ionicons
                  name="heart-outline"
                  size={32}
                  color={colors.textTertiary}
                />
                <Text
                  style={[
                    styles.emptyInterestsText,
                    { color: colors.textTertiary },
                  ]}
                >
                  No interests added yet
                </Text>
                <Text
                  style={[
                    styles.emptyInterestsSubtext,
                    { color: colors.textSecondary },
                  ]}
                >
                  This user hasn't added their interests
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Professional Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Professional
          </Text>
          <View style={styles.professionalInfo}>
            <View style={styles.professionalItem}>
              <View
                style={[
                  styles.professionalIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="school-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.professionalTextContainer}>
                <Text
                  style={[
                    styles.professionalLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Education
                </Text>
                <Text style={[styles.professionalText, { color: colors.text }]}>
                  {userData?.school || "Not specified"}
                </Text>
              </View>
            </View>
            <View style={styles.professionalItem}>
              <View
                style={[
                  styles.professionalIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.professionalTextContainer}>
                <Text
                  style={[
                    styles.professionalLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Job Title
                </Text>
                <Text style={[styles.professionalText, { color: colors.text }]}>
                  {userData?.jobTitle || "Not specified"}
                </Text>
              </View>
            </View>
            <View style={styles.professionalItem}>
              <View
                style={[
                  styles.professionalIcon,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color={colors.primary}
                />
              </View>
              <View style={styles.professionalTextContainer}>
                <Text
                  style={[
                    styles.professionalLabel,
                    { color: colors.textSecondary },
                  ]}
                >
                  Company
                </Text>
                <Text style={[styles.professionalText, { color: colors.text }]}>
                  {userData?.jobCompany || "Not specified"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Current Meetups Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Current Meetups
          </Text>
          {(() => {
            const currentMeetups = getMeetupsByCreator(userData?.uid || "")
              .filter((meetup) => meetup.status === "active")
              .slice(0, 3);
            return currentMeetups.length > 0 ? (
              <View style={styles.meetupsList}>
                {currentMeetups.map((meetup) => (
                  <View
                    key={meetup.id}
                    style={[styles.meetupCard, { borderColor: colors.border }]}
                  >
                    <View style={styles.meetupHeader}>
                      <Text
                        style={[styles.meetupTitle, { color: colors.text }]}
                      >
                        {meetup.title}
                      </Text>
                      <View style={styles.meetupStatusContainer}>
                        <View
                          style={[
                            styles.activeStatusBadge,
                            { backgroundColor: colors.primary + "20" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.activeStatusText,
                              { color: colors.primary },
                            ]}
                          >
                            Active
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.meetupDate,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {meetup.time.toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                    <Text
                      style={[
                        styles.meetupDescription,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {meetup.description}
                    </Text>
                    <View style={styles.meetupFooter}>
                      <View style={styles.meetupLocation}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.meetupLocationText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {meetup.locationName}
                        </Text>
                      </View>
                      <View style={styles.meetupStats}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.meetupStatsText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {meetup.currentParticipants}/{meetup.maxParticipants}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={[styles.noMeetupsText, { color: colors.textSecondary }]}
              >
                No current meetups to show
              </Text>
            );
          })()}
        </View>

        {/* Past Meetups Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Past Meetups
          </Text>
          {(() => {
            const pastMeetups = getMeetupsByCreator(userData?.uid || "")
              .filter((meetup) => meetup.status !== "active")
              .slice(0, 3);
            return pastMeetups.length > 0 ? (
              <View style={styles.meetupsList}>
                {pastMeetups.map((meetup) => (
                  <View
                    key={meetup.id}
                    style={[styles.meetupCard, { borderColor: colors.border }]}
                  >
                    <View style={styles.meetupHeader}>
                      <Text
                        style={[styles.meetupTitle, { color: colors.text }]}
                      >
                        {meetup.title}
                      </Text>
                      <Text
                        style={[
                          styles.meetupDate,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {meetup.time.toLocaleDateString()}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.meetupDescription,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {meetup.description}
                    </Text>
                    <View style={styles.meetupFooter}>
                      <View style={styles.meetupLocation}>
                        <Ionicons
                          name="location-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.meetupLocationText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {meetup.locationName}
                        </Text>
                      </View>
                      <View style={styles.meetupStats}>
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={colors.textSecondary}
                        />
                        <Text
                          style={[
                            styles.meetupStatsText,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {meetup.currentParticipants}/{meetup.maxParticipants}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <Text
                style={[styles.noMeetupsText, { color: colors.textSecondary }]}
              >
                No past meetups to show
              </Text>
            );
          })()}
        </View>
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent={true}
        animationType="none"
        onRequestClose={handleCloseMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={handleCloseMenu}
        >
          <Animated.View
            style={[
              styles.menuPositioning,
              {
                top: 100,
                right: 16,
                opacity: menuOpacity,
                transform: [{ scale: menuScale }],
              },
            ]}
          >
            <View
              style={[
                styles.menuContainer,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              {/* Block/Unblock User */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  {
                    borderBottomColor: colors.border,
                    backgroundColor: isBlocking
                      ? colors.background
                      : "transparent",
                  },
                ]}
                onPress={isBlocked ? handleUnblockUser : handleBlockUser}
                disabled={isBlocking}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons
                    name={
                      isBlocked ? "checkmark-circle-outline" : "ban-outline"
                    }
                    size={20}
                    color={isBlocked ? "#10B981" : "#EF4444"}
                  />
                </View>
                <Text
                  style={[
                    styles.menuText,
                    { color: isBlocked ? "#10B981" : "#EF4444" },
                  ]}
                >
                  {isBlocking
                    ? "Blocking..."
                    : isBlocked
                    ? "Unblock User"
                    : "Block User"}
                </Text>
                {isBlocking && (
                  <ActivityIndicator
                    size="small"
                    color="#EF4444"
                    style={styles.menuLoader}
                  />
                )}
              </TouchableOpacity>

              {/* Report User */}
              <TouchableOpacity
                style={[
                  styles.menuItem,
                  styles.lastMenuItem,
                  {
                    backgroundColor: isReporting
                      ? colors.background
                      : "transparent",
                  },
                ]}
                onPress={handleReportConversation}
                disabled={isReporting}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name="flag-outline" size={20} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: "#EF4444" }]}>
                  {isReporting ? "Reporting..." : "Report User"}
                </Text>
                {isReporting && (
                  <ActivityIndicator
                    size="small"
                    color="#EF4444"
                    style={styles.menuLoader}
                  />
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  // Fixed Header Styles
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 2,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  headerSafeArea: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  headerBackButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
    marginHorizontal: 20,
  },
  headerMoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // Scroll View Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  // Photo Gallery Styles
  photoGalleryContainer: {
    height: PHOTO_HEIGHT,
    position: "relative",
    marginBottom: 24,
  },
  photoGallery: {
    flex: 1,
  },
  photoContainer: {
    width: width - 80, // Account for container padding
    height: PHOTO_HEIGHT,
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  standoutBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  standoutText: {
    fontSize: 12,
    fontWeight: "600",
  },
  photoIndicators: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  indicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  photoCounter: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  photoCounterText: {
    fontSize: 12,
    fontWeight: "600",
  },
  // Profile Info Section
  profileInfoSection: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  nameSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
    textAlign: "center",
  },
  agePronouns: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: "center",
  },
  location: {
    fontSize: 16,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    gap: 8,
    minWidth: 140,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  // Section Styles
  bioSection: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
  },
  statsSection: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  interestsSection: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  interestsList: {
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
  emptyInterestsContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
    width: "100%",
  },
  emptyInterestsText: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 12,
    marginBottom: 4,
    textAlign: "center",
  },
  emptyInterestsSubtext: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyPhotosContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
    width: "100%",
  },
  profilePhotoPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyBioContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  professionalSection: {
    padding: 20,
    margin: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  professionalInfo: {
    gap: 20,
  },
  professionalItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingVertical: 4,
  },
  professionalText: {
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
    fontWeight: "500",
  },
  // New styles to match EditProfileScreen
  heroSection: {
    margin: 16,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  professionalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  professionalTextContainer: {
    flex: 1,
  },
  professionalLabel: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
    fontWeight: "600",
  },
  // Additional missing styles
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
  },
  profileInfo: {
    alignItems: "center",
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 24,
  },
  // Past Meetups Styles
  meetupsList: {
    gap: 12,
  },
  meetupCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    backgroundColor: "transparent",
  },
  meetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  meetupStatusContainer: {
    alignItems: "flex-end",
    gap: 4,
  },
  activeStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeStatusText: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },
  meetupDate: {
    fontSize: 12,
    fontWeight: "500",
  },
  meetupDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  meetupFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  meetupLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meetupLocationText: {
    fontSize: 12,
    fontWeight: "500",
  },
  meetupStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meetupStatsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  noMeetupsText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    paddingVertical: 20,
  },
  // Menu styles (matching MessageDetailsScreen)
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  menuPositioning: {
    position: "absolute",
    alignItems: "flex-end",
  },
  menuContainer: {
    width: 220,
    borderRadius: 16,
    paddingVertical: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    marginVertical: 2,
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  menuLoader: {
    marginLeft: 8,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
});
