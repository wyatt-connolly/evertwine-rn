import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { User } from "../../types";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface UserProfileDetailsScreenProps {
  user: User;
  visible: boolean;
  onClose: () => void;
}

export default function UserProfileDetailsScreen({
  user,
  visible,
  onClose,
}: UserProfileDetailsScreenProps) {
  const { colors } = useThemeStore();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getProfileImages = () => {
    if (user.profilePictures && user.profilePictures.length > 0) {
      return user.profilePictures;
    }
    return [
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
    ];
  };

  const handleMessage = () => {
    Alert.alert("Message", `Start a conversation with ${user.displayName}`);
    // TODO: Implement messaging functionality
  };

  const handleLike = () => {
    Alert.alert("Like", `You liked ${user.displayName}`);
    // TODO: Implement like functionality
  };

  const handleShare = () => {
    Alert.alert("Share", `Share ${user.displayName}'s profile`);
    // TODO: Implement share functionality
  };

  const renderImageCarousel = () => {
    const images = getProfileImages();

    return (
      <View style={styles.imageCarousel}>
        <Image
          source={{ uri: images[currentImageIndex] }}
          style={styles.mainImage}
          resizeMode="cover"
        />

        {images.length > 1 && (
          <View style={styles.imageIndicators}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.indicator,
                  {
                    backgroundColor:
                      index === currentImageIndex
                        ? colors.primary
                        : colors.border,
                  },
                ]}
                onPress={() => setCurrentImageIndex(index)}
              />
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderUserInfo = () => (
    <View style={styles.userInfo}>
      <View style={styles.nameRow}>
        <Text style={[styles.name, { color: colors.text }]}>
          {user.displayName}, {user.age}
        </Text>
        {user.isVerified === "verified" && (
          <View
            style={[styles.verifiedBadge, { backgroundColor: colors.primary }]}
          >
            <Ionicons name="checkmark" size={16} color={colors.onPrimary} />
          </View>
        )}
      </View>

      <Text style={[styles.location, { color: colors.textSecondary }]}>
        <Ionicons
          name="location-outline"
          size={14}
          color={colors.textSecondary}
        />{" "}
        {user.locationName}
      </Text>

      {user.pronouns && (
        <Text style={[styles.pronouns, { color: colors.textSecondary }]}>
          {user.pronouns}
        </Text>
      )}
    </View>
  );

  const renderBio = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
      <Text style={[styles.bio, { color: colors.textSecondary }]}>
        {user.bio || "No bio available"}
      </Text>
      {user.about && (
        <Text style={[styles.about, { color: colors.textSecondary }]}>
          {user.about}
        </Text>
      )}
    </View>
  );

  const renderInterests = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>
        Interests
      </Text>
      <View style={styles.interestsContainer}>
        {user.interests?.map((interest, index) => (
          <View
            key={index}
            style={[
              styles.interestTag,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.interestText, { color: colors.primary }]}>
              {interest}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHobbies = () =>
    user.hobbies &&
    user.hobbies.length > 0 && (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Hobbies
        </Text>
        <View style={styles.interestsContainer}>
          {user.hobbies.map((hobby, index) => (
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
    );

  const renderProfessionalInfo = () =>
    (user.school || user.jobTitle) && (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Professional
        </Text>
        {user.school && (
          <Text
            style={[styles.professionalText, { color: colors.textSecondary }]}
          >
            <Ionicons
              name="school-outline"
              size={16}
              color={colors.textSecondary}
            />{" "}
            {user.school}
          </Text>
        )}
        {user.jobTitle && (
          <Text
            style={[styles.professionalText, { color: colors.textSecondary }]}
          >
            <Ionicons
              name="briefcase-outline"
              size={16}
              color={colors.textSecondary}
            />{" "}
            {user.jobTitle} at {user.jobCompany}
          </Text>
        )}
      </View>
    );

  const renderLookingFor = () =>
    user.lookingFor &&
    user.lookingFor.length > 0 && (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Looking For
        </Text>
        <View style={styles.interestsContainer}>
          {user.lookingFor.map((item, index) => (
            <View
              key={index}
              style={[
                styles.interestTag,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.interestText, { color: colors.primary }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.border }]}
        onPress={handleMessage}
      >
        <Ionicons name="chatbubble-outline" size={20} color={colors.text} />
        <Text style={[styles.actionButtonText, { color: colors.text }]}>
          Message
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.primary }]}
        onPress={handleLike}
      >
        <Ionicons name="heart-outline" size={20} color={colors.onPrimary} />
        <Text style={[styles.actionButtonText, { color: colors.onPrimary }]}>
          Like
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: colors.border }]}
        onPress={handleShare}
      >
        <Ionicons name="share-outline" size={20} color={colors.text} />
        <Text style={[styles.actionButtonText, { color: colors.text }]}>
          Share
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Profile
          </Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {renderImageCarousel()}
          {renderUserInfo()}
          {renderBio()}
          {renderInterests()}
          {renderHobbies()}
          {renderProfessionalInfo()}
          {renderLookingFor()}
        </ScrollView>

        {renderActionButtons()}
      </SafeAreaView>
    </Modal>
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
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  imageCarousel: {
    height: screenHeight * 0.4,
    position: "relative",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 16,
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
  userInfo: {
    padding: 20,
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 8,
  },
  verifiedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    marginBottom: 4,
  },
  pronouns: {
    fontSize: 14,
    fontStyle: "italic",
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  about: {
    fontSize: 14,
    lineHeight: 20,
  },
  interestsContainer: {
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
  professionalText: {
    fontSize: 16,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
