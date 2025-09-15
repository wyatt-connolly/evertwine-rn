import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 100;
const PHOTO_HEIGHT = height * 0.6;

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
  const scrollY = useRef(new Animated.Value(0)).current;
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [headerVisible, setHeaderVisible] = useState(false);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setHeaderVisible(offsetY > 50);
  };

  const handlePhotoScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentPhotoIndex(index);
  };

  const renderPhoto = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.photoContainer}>
      <Image source={{ uri: item }} style={styles.photo} />
      {index === userData?.standoutPhotoIndex && (
        <View
          style={[styles.standoutBadge, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="star" size={20} color={colors.onPrimary} />
          <Text style={[styles.standoutText, { color: colors.onPrimary }]}>
            Standout
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <Animated.View
        style={[
          styles.fixedHeader,
          {
            backgroundColor: colors.background + "95",
            opacity: headerOpacity,
          },
        ]}
      >
        <SafeAreaView style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {userData?.displayName || "User Profile"}
            </Text>
            <TouchableOpacity style={styles.headerMoreButton}>
              <Ionicons
                name="ellipsis-horizontal"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Animated.View>

      {/* Scrollable Content */}
      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        onScroll={onScroll}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Photo Gallery */}
        {userData?.profilePictures && userData.profilePictures.length > 0 && (
          <View style={styles.photoGalleryContainer}>
            <FlatList
              data={userData.profilePictures}
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
              {userData.profilePictures.map((_: string, index: number) => (
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
                {currentPhotoIndex + 1} / {userData.profilePictures.length}
              </Text>
            </View>
          </View>
        )}

        {/* Profile Info Section */}
        <View
          style={[
            styles.profileInfoSection,
            { backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.nameSection}>
            <Text style={[styles.name, { color: colors.text }]}>
              {userData?.displayName || "User"}
            </Text>
            <Text style={[styles.agePronouns, { color: colors.textSecondary }]}>
              {userData?.age} • {userData?.pronouns}
            </Text>
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              📍 {userData?.locationName || "Location not set"}
            </Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                { backgroundColor: colors.primary },
              ]}
            >
              <Ionicons name="chatbubble" size={20} color={colors.onPrimary} />
              <Text
                style={[styles.primaryButtonText, { color: colors.onPrimary }]}
              >
                Message
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.secondaryButton,
                { borderColor: colors.primary, borderWidth: 1 },
              ]}
            >
              <Ionicons name="heart" size={20} color={colors.primary} />
              <Text
                style={[styles.secondaryButtonText, { color: colors.primary }]}
              >
                Like
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bio Section */}
        <View style={[styles.bioSection, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {userData?.bio || "No bio available"}
          </Text>
        </View>

        {/* Stats Section */}
        <View
          style={[styles.statsSection, { backgroundColor: colors.surface }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Stats
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {userData?.hobbies?.length || 0}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Interests
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {userData?.locationName ? "📍" : "❓"}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Location
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.text }]}>
                {userData?.professionalLevel || "N/A"}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Level
              </Text>
            </View>
          </View>
        </View>

        {/* Interests Section */}
        <View
          style={[styles.interestsSection, { backgroundColor: colors.surface }]}
        >
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
        <View
          style={[
            styles.professionalSection,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Professional
          </Text>
          <View style={styles.professionalInfo}>
            <View style={styles.professionalItem}>
              <Ionicons
                name="school-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.professionalText, { color: colors.text }]}>
                {userData?.school || "Not specified"}
              </Text>
            </View>
            <View style={styles.professionalItem}>
              <Ionicons
                name="briefcase-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.professionalText, { color: colors.text }]}>
                {userData?.jobTitle || "Not specified"}
              </Text>
            </View>
            <View style={styles.professionalItem}>
              <Ionicons
                name="business-outline"
                size={20}
                color={colors.primary}
              />
              <Text style={[styles.professionalText, { color: colors.text }]}>
                {userData?.jobCompany || "Not specified"}
              </Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // Fixed Header Styles
  fixedHeader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
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
  },
  photoGallery: {
    flex: 1,
  },
  photoContainer: {
    width: width,
    height: PHOTO_HEIGHT,
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  standoutBadge: {
    position: "absolute",
    top: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  standoutText: {
    fontSize: 14,
    fontWeight: "600",
  },
  photoIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  photoCounter: {
    position: "absolute",
    top: 20,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  photoCounterText: {
    fontSize: 14,
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
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
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
    gap: 12,
  },
  professionalItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  professionalText: {
    fontSize: 16,
    flex: 1,
  },
});
