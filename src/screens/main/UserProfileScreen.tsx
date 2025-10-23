import { useState } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { Ionicons } from "@expo/vector-icons";
import { getMeetupsByCreator } from "../../data/mockData";

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
  const { userData } = route.params;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);


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

      // Navigate to Messages tab first, then to MessageDetails
      navigation.navigate("MainTabs", {
        screen: "Messages",
        params: {
          screen: "MessageDetails",
          params: { roomId: room.id },
        },
      });
    } catch (error) {
      console.error("Error starting conversation:", error);
      Alert.alert("Error", "Could not start conversation. Please try again.");
    }
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
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={[styles.content, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { backgroundColor: colors.surface }]}>
          {/* Photo Gallery */}
          {userData?.profilePictures && userData.profilePictures.length > 0 && (
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
            </View>
          </View>
        </View>

        {/* Bio Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {userData?.bio || "No bio available"}
          </Text>
        </View>

        {/* Interests Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Interests
          </Text>
          <View style={styles.interestsList}>
            {userData?.hobbies?.map((hobby: string, index: number) => (
              <View
                key={index}
                style={[
                  styles.interestTag,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Text style={[styles.interestText, { color: colors.primary }]}>
                  {hobby}
                </Text>
              </View>
            ))}
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
});
