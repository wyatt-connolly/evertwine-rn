import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";
import { getMockUserStats, mockBadges } from "../../data/mockData";
import { UserStats, Badge } from "../../types";

const { width } = Dimensions.get("window");

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
  const [activeTab, setActiveTab] = useState<"profile" | "badges" | "meetups">(
    "profile"
  );

  // Get user data from navigation params
  const { userId, userData, fromMessage } = route.params;

  console.log("👤 UserProfileScreen loaded:", {
    userId,
    userData: userData?.name || "Unknown",
  });

  const userStats = getMockUserStats(userId);
  const badges = mockBadges;

  const getBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "#4CAF50"; // Green
      case "rare":
        return "#2196F3"; // Blue
      case "epic":
        return "#9C27B0"; // Purple
      case "legendary":
        return "#FF9800"; // Orange
      default:
        return colors.primary;
    }
  };

  const handleBadgePress = (badge: Badge) => {
    navigation.navigate("BadgeDetails", { badge });
  };

  const handleMessage = () => {
    // Navigate to message with this user
    navigation.navigate("MainTabs", {
      screen: "Messages",
      params: {
        screen: "MessageDetails",
        params: {
          roomId: `room_${userId}`,
        },
      },
    });
  };

  const handleFollow = () => {
    Alert.alert("Follow", `Follow ${userData?.name || "User"}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Follow", onPress: () => console.log("Followed user") },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          {userData?.name || "Profile"}
        </Text>
        {!fromMessage && (
          <TouchableOpacity
            onPress={handleMessage}
            style={styles.messageButton}
          >
            <Ionicons
              name="chatbubble-outline"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Tab Navigation */}
      <View style={[styles.tabContainer, { backgroundColor: colors.surface }]}>
        {(["profile", "badges", "meetups"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && { backgroundColor: colors.primary },
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab ? colors.onPrimary : colors.text,
                },
              ]}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {activeTab === "profile" && (
          <>
            {/* Profile Header */}
            <View
              style={[
                styles.profileHeader,
                { backgroundColor: colors.surface },
              ]}
            >
              <View style={styles.photoContainer}>
                {userData?.avatar || userData?.photoURL ? (
                  <Image
                    source={{
                      uri: userData.avatar || userData.photoURL,
                    }}
                    style={styles.profilePhoto}
                  />
                ) : (
                  <View
                    style={[
                      styles.profilePhotoPlaceholder,
                      { backgroundColor: colors.surfaceVariant },
                    ]}
                  >
                    <Ionicons
                      name="person"
                      size={40}
                      color={colors.textSecondary}
                    />
                  </View>
                )}

                {/* Verification Badge */}
                <View
                  style={[
                    styles.verificationBadge,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Ionicons
                    name="checkmark"
                    size={16}
                    color={colors.onPrimary}
                  />
                </View>
              </View>

              <View style={styles.profileInfo}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {userData?.name || userData?.displayName || "User"}
                </Text>
                {userData?.bio && (
                  <Text style={[styles.bio, { color: colors.textSecondary }]}>
                    {userData.bio}
                  </Text>
                )}
                {userData?.location && (
                  <Text
                    style={[styles.location, { color: colors.textSecondary }]}
                  >
                    📍 {userData.location}
                  </Text>
                )}

                {/* Level and Points */}
                {userStats && (
                  <View style={styles.levelContainer}>
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: colors.primary },
                      ]}
                    >
                      <Text
                        style={[styles.levelText, { color: colors.onPrimary }]}
                      >
                        Lv. {userStats.level}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.pointsText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {userStats.points} points
                    </Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={[
                      styles.followButton,
                      { backgroundColor: colors.primary },
                    ]}
                    onPress={handleFollow}
                  >
                    <Ionicons
                      name="person-add"
                      size={16}
                      color={colors.onPrimary}
                    />
                    <Text
                      style={[
                        styles.followButtonText,
                        { color: colors.onPrimary },
                      ]}
                    >
                      Follow
                    </Text>
                  </TouchableOpacity>
                  {!fromMessage && (
                    <TouchableOpacity
                      style={[
                        styles.messageButton,
                        { borderColor: colors.primary },
                      ]}
                      onPress={handleMessage}
                    >
                      <Ionicons
                        name="chatbubble"
                        size={16}
                        color={colors.primary}
                      />
                      <Text
                        style={[
                          styles.messageButtonText,
                          { color: colors.primary },
                        ]}
                      >
                        Message
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Stats */}
            {userStats && (
              <View
                style={[
                  styles.statsContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {userStats.points}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Points
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {userStats.streak}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Day Streak
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statNumber, { color: colors.text }]}>
                    {userStats.badges.length}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: colors.textSecondary }]}
                  >
                    Badges
                  </Text>
                </View>
              </View>
            )}

            {/* About Section */}
            <View
              style={[
                styles.aboutContainer,
                { backgroundColor: colors.surface },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                About
              </Text>
              <View style={styles.aboutList}>
                {userData?.age && (
                  <View style={styles.aboutItem}>
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.aboutLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Age:
                    </Text>
                    <Text style={[styles.aboutValue, { color: colors.text }]}>
                      {userData.age}
                    </Text>
                  </View>
                )}
                {userData?.school && (
                  <View style={styles.aboutItem}>
                    <Ionicons
                      name="school-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.aboutLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Education:
                    </Text>
                    <Text style={[styles.aboutValue, { color: colors.text }]}>
                      {userData.school}
                    </Text>
                  </View>
                )}
                {userData?.job && (
                  <View style={styles.aboutItem}>
                    <Ionicons
                      name="briefcase-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.aboutLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Work:
                    </Text>
                    <Text style={[styles.aboutValue, { color: colors.text }]}>
                      {userData.job}
                    </Text>
                  </View>
                )}
                {userData?.joinedDate && (
                  <View style={styles.aboutItem}>
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.primary}
                    />
                    <Text
                      style={[
                        styles.aboutLabel,
                        { color: colors.textSecondary },
                      ]}
                    >
                      Joined:
                    </Text>
                    <Text style={[styles.aboutValue, { color: colors.text }]}>
                      {new Date(userData.joinedDate).toLocaleDateString()}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Social Links */}
            {userData?.socialLinks &&
              Object.keys(userData.socialLinks).length > 0 && (
                <View
                  style={[
                    styles.socialContainer,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>
                    Social Links
                  </Text>
                  <View style={styles.socialList}>
                    {Object.entries(userData.socialLinks).map(
                      ([platform, handle]) => (
                        <View key={platform} style={styles.socialItem}>
                          <Ionicons
                            name={
                              platform === "instagram"
                                ? "logo-instagram"
                                : platform === "twitter"
                                ? "logo-twitter"
                                : platform === "linkedin"
                                ? "logo-linkedin"
                                : platform === "youtube"
                                ? "logo-youtube"
                                : platform === "website"
                                ? "globe-outline"
                                : platform === "blog"
                                ? "document-text-outline"
                                : platform === "behance"
                                ? "logo-behance"
                                : "link-outline"
                            }
                            size={20}
                            color={colors.primary}
                          />
                          <Text
                            style={[
                              styles.socialPlatform,
                              { color: colors.textSecondary },
                            ]}
                          >
                            {platform.charAt(0).toUpperCase() +
                              platform.slice(1)}
                            :
                          </Text>
                          <Text
                            style={[
                              styles.socialHandle,
                              { color: colors.text },
                            ]}
                          >
                            {handle as string}
                          </Text>
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}

            {/* Interests */}
            {userData?.interests && userData.interests.length > 0 && (
              <View
                style={[
                  styles.interestsContainer,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Interests
                </Text>
                <View style={styles.interestsList}>
                  {userData.interests.map((interest: string, index: number) => (
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
                  ))}
                </View>
              </View>
            )}
          </>
        )}

        {activeTab === "badges" && (
          <View style={styles.badgesContainer}>
            <Text style={[styles.badgesTitle, { color: colors.text }]}>
              Badges
            </Text>
            {badges.map((badge, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.badgeItem, { backgroundColor: colors.surface }]}
                onPress={() => handleBadgePress(badge)}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    { backgroundColor: getBadgeColor(badge.rarity) },
                  ]}
                >
                  <Text style={styles.badgeEmoji}>{badge.icon}</Text>
                </View>
                <View style={styles.badgeInfo}>
                  <Text style={[styles.badgeName, { color: colors.text }]}>
                    {badge.name}
                  </Text>
                  <Text
                    style={[
                      styles.badgeDescription,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {badge.description}
                  </Text>
                  <Text
                    style={[
                      styles.badgeRarity,
                      { color: getBadgeColor(badge.rarity) },
                    ]}
                  >
                    {badge.rarity.toUpperCase()}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textTertiary}
                />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "meetups" && (
          <View style={styles.meetupsContainer}>
            <Text style={[styles.meetupsTitle, { color: colors.text }]}>
              Meetups
            </Text>
            {userData?.meetups && userData.meetups.length > 0 ? (
              userData.meetups.map((meetup: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.meetupItem,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <View style={styles.meetupHeader}>
                    <Text style={[styles.meetupTitle, { color: colors.text }]}>
                      {meetup.title}
                    </Text>
                    <View
                      style={[
                        styles.meetupStatus,
                        {
                          backgroundColor:
                            meetup.status === "upcoming"
                              ? colors.primary + "20"
                              : colors.textSecondary + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.meetupStatusText,
                          {
                            color:
                              meetup.status === "upcoming"
                                ? colors.primary
                                : colors.textSecondary,
                          },
                        ]}
                      >
                        {meetup.status === "upcoming" ? "Upcoming" : "Attended"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.meetupDate}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text
                      style={[
                        styles.meetupDateText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {new Date(meetup.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              ))
            ) : (
              <View
                style={[styles.emptyState, { backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: colors.textSecondary },
                  ]}
                >
                  No meetups yet
                </Text>
              </View>
            )}
          </View>
        )}

        {false && (
          <View style={styles.professionalContainer}>
            {userData?.linkedinData ? (
              <>
                {/* Professional Headline */}
                <View
                  style={[
                    styles.professionalHeader,
                    { backgroundColor: colors.surface },
                  ]}
                >
                  <Text
                    style={[
                      styles.professionalHeadline,
                      { color: colors.text },
                    ]}
                  >
                    {userData.linkedinData.headline}
                  </Text>
                </View>

                {/* Current Position */}
                {userData.linkedinData.currentPosition && (
                  <View
                    style={[
                      styles.sectionContainer,
                      { backgroundColor: colors.surface },
                    ]}
                  >
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>
                      Current Position
                    </Text>
                    <View style={styles.positionItem}>
                      <Text
                        style={[styles.positionTitle, { color: colors.text }]}
                      >
                        {userData.linkedinData.currentPosition.title}
                      </Text>
                      <Text
                        style={[
                          styles.positionCompany,
                          { color: colors.primary },
                        ]}
                      >
                        {userData.linkedinData.currentPosition.company}
                      </Text>
                      <Text
                        style={[
                          styles.positionLocation,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {userData.linkedinData.currentPosition.location}
                      </Text>
                      <Text
                        style={[
                          styles.positionDuration,
                          { color: colors.textSecondary },
                        ]}
                      >
                        {new Date(
                          userData.linkedinData.currentPosition.startDate
                        ).toLocaleDateString()}{" "}
                        - Present
                      </Text>
                      <Text
                        style={[
                          styles.positionDescription,
                          { color: colors.text },
                        ]}
                      >
                        {userData.linkedinData.currentPosition.description}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Experience */}
                {userData.linkedinData.experience &&
                  userData.linkedinData.experience.length > 0 && (
                    <View
                      style={[
                        styles.sectionContainer,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                      >
                        Experience
                      </Text>
                      {userData.linkedinData.experience.map(
                        (exp: any, index: number) => (
                          <View key={index} style={styles.experienceItem}>
                            <Text
                              style={[
                                styles.experienceTitle,
                                { color: colors.text },
                              ]}
                            >
                              {exp.title}
                            </Text>
                            <Text
                              style={[
                                styles.experienceCompany,
                                { color: colors.primary },
                              ]}
                            >
                              {exp.company}
                            </Text>
                            <Text
                              style={[
                                styles.experienceLocation,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {exp.location}
                            </Text>
                            <Text
                              style={[
                                styles.experienceDuration,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {new Date(exp.startDate).toLocaleDateString()} -{" "}
                              {exp.endDate
                                ? new Date(exp.endDate).toLocaleDateString()
                                : "Present"}
                            </Text>
                            <Text
                              style={[
                                styles.experienceDescription,
                                { color: colors.text },
                              ]}
                            >
                              {exp.description}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}

                {/* Education */}
                {userData.linkedinData.education &&
                  userData.linkedinData.education.length > 0 && (
                    <View
                      style={[
                        styles.sectionContainer,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                      >
                        Education
                      </Text>
                      {userData.linkedinData.education.map(
                        (edu: any, index: number) => (
                          <View key={index} style={styles.educationItem}>
                            <Text
                              style={[
                                styles.educationDegree,
                                { color: colors.text },
                              ]}
                            >
                              {edu.degree}
                            </Text>
                            <Text
                              style={[
                                styles.educationSchool,
                                { color: colors.primary },
                              ]}
                            >
                              {edu.school}
                            </Text>
                            <Text
                              style={[
                                styles.educationField,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {edu.field}
                            </Text>
                            <Text
                              style={[
                                styles.educationDuration,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {new Date(edu.startDate).getFullYear()} -{" "}
                              {new Date(edu.endDate).getFullYear()}
                            </Text>
                            {edu.description && (
                              <Text
                                style={[
                                  styles.educationDescription,
                                  { color: colors.text },
                                ]}
                              >
                                {edu.description}
                              </Text>
                            )}
                          </View>
                        )
                      )}
                    </View>
                  )}

                {/* Skills */}
                {userData.linkedinData.skills &&
                  userData.linkedinData.skills.length > 0 && (
                    <View
                      style={[
                        styles.sectionContainer,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                      >
                        Skills
                      </Text>
                      <View style={styles.skillsList}>
                        {userData.linkedinData.skills.map(
                          (skill: string, index: number) => (
                            <View
                              key={index}
                              style={[
                                styles.skillTag,
                                { backgroundColor: colors.primary + "20" },
                              ]}
                            >
                              <Text
                                style={[
                                  styles.skillText,
                                  { color: colors.primary },
                                ]}
                              >
                                {skill}
                              </Text>
                            </View>
                          )
                        )}
                      </View>
                    </View>
                  )}

                {/* Certifications */}
                {userData.linkedinData.certifications &&
                  userData.linkedinData.certifications.length > 0 && (
                    <View
                      style={[
                        styles.sectionContainer,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                      >
                        Certifications
                      </Text>
                      {userData.linkedinData.certifications.map(
                        (cert: any, index: number) => (
                          <View key={index} style={styles.certificationItem}>
                            <Text
                              style={[
                                styles.certificationName,
                                { color: colors.text },
                              ]}
                            >
                              {cert.name}
                            </Text>
                            <Text
                              style={[
                                styles.certificationIssuer,
                                { color: colors.primary },
                              ]}
                            >
                              {cert.issuer}
                            </Text>
                            <Text
                              style={[
                                styles.certificationDate,
                                { color: colors.textSecondary },
                              ]}
                            >
                              Issued{" "}
                              {new Date(cert.issueDate).toLocaleDateString()}
                            </Text>
                            {cert.credentialId && (
                              <Text
                                style={[
                                  styles.certificationId,
                                  { color: colors.textSecondary },
                                ]}
                              >
                                Credential ID: {cert.credentialId}
                              </Text>
                            )}
                          </View>
                        )
                      )}
                    </View>
                  )}

                {/* Languages */}
                {userData.linkedinData.languages &&
                  userData.linkedinData.languages.length > 0 && (
                    <View
                      style={[
                        styles.sectionContainer,
                        { backgroundColor: colors.surface },
                      ]}
                    >
                      <Text
                        style={[styles.sectionTitle, { color: colors.text }]}
                      >
                        Languages
                      </Text>
                      {userData.linkedinData.languages.map(
                        (lang: any, index: number) => (
                          <View key={index} style={styles.languageItem}>
                            <Text
                              style={[
                                styles.languageName,
                                { color: colors.text },
                              ]}
                            >
                              {lang.language}
                            </Text>
                            <Text
                              style={[
                                styles.languageProficiency,
                                { color: colors.textSecondary },
                              ]}
                            >
                              {lang.proficiency}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
              </>
            ) : (
              <View
                style={[styles.emptyState, { backgroundColor: colors.surface }]}
              >
                <Ionicons
                  name="briefcase-outline"
                  size={48}
                  color={colors.textSecondary}
                />
                <Text
                  style={[
                    styles.emptyStateText,
                    { color: colors.textSecondary },
                  ]}
                >
                  No professional information available
                </Text>
              </View>
            )}
          </View>
        )}
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 16,
    marginTop: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  profileHeader: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePhotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  verificationBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "white",
  },
  profileInfo: {
    alignItems: "center",
    width: "100%",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 12,
  },
  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  levelText: {
    fontSize: 12,
    fontWeight: "600",
  },
  pointsText: {
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  followButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  messageButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  messageButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsContainer: {
    flexDirection: "row",
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
  },
  interestsContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
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
  aboutContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  aboutList: {
    gap: 12,
  },
  aboutItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  aboutLabel: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 80,
  },
  aboutValue: {
    fontSize: 14,
    flex: 1,
  },
  socialContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  socialList: {
    gap: 12,
  },
  socialItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  socialPlatform: {
    fontSize: 14,
    fontWeight: "500",
    minWidth: 80,
  },
  socialHandle: {
    fontSize: 14,
    flex: 1,
  },
  badgesContainer: {
    marginBottom: 20,
  },
  meetupsContainer: {
    marginBottom: 20,
  },
  meetupsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  meetupItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  meetupHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  meetupTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  meetupStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  meetupStatusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  meetupDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  meetupDateText: {
    fontSize: 14,
  },
  emptyState: {
    padding: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 16,
    marginTop: 12,
  },
  badgesTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  professionalContainer: {
    marginBottom: 20,
  },
  professionalHeader: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  professionalHeadline: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 24,
  },
  sectionContainer: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  positionItem: {
    marginTop: 12,
  },
  positionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  positionCompany: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  positionLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  positionDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  positionDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  experienceItem: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  experienceTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  experienceCompany: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  experienceLocation: {
    fontSize: 14,
    marginBottom: 4,
  },
  experienceDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  educationItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  educationDegree: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  educationSchool: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  educationField: {
    fontSize: 14,
    marginBottom: 4,
  },
  educationDuration: {
    fontSize: 14,
    marginBottom: 8,
  },
  educationDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  skillsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  skillTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  certificationItem: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  certificationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  certificationIssuer: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  certificationDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  certificationId: {
    fontSize: 12,
    fontStyle: "italic",
  },
  languageItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  languageName: {
    fontSize: 16,
    fontWeight: "500",
  },
  languageProficiency: {
    fontSize: 14,
  },
  badgeItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  badgeEmoji: {
    fontSize: 24,
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  badgeRarity: {
    fontSize: 12,
    fontWeight: "600",
  },
});
