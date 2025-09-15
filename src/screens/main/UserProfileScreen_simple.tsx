import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeStore } from "../../hooks/useThemeStore";
import { Ionicons } from "@expo/vector-icons";

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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {userData?.displayName || "User Profile"}
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View
          style={[styles.profileSection, { backgroundColor: colors.surface }]}
        >
          {userData?.profilePictures && userData.profilePictures.length > 0 && (
            <Image
              source={{ uri: userData.profilePictures[0] }}
              style={styles.profileImage}
            />
          )}
          <Text style={[styles.name, { color: colors.text }]}>
            {userData?.displayName || "User"}
          </Text>
          <Text style={[styles.age, { color: colors.textSecondary }]}>
            {userData?.age} • {userData?.pronouns}
          </Text>
          <Text style={[styles.bio, { color: colors.text }]}>
            {userData?.bio || "No bio available"}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: colors.primary }]}
            onPress={() => {
              if (route.params?.fromMessage) {
                navigation.goBack();
              } else {
                navigation.navigate("MessageDetails", {
                  conversationId: `conv_${userData?.uid}`,
                  otherUser: userData,
                });
              }
            }}
          >
            <Text
              style={[styles.primaryButtonText, { color: colors.onPrimary }]}
            >
              Message
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.secondaryButton, { borderColor: colors.primary }]}
          >
            <Text
              style={[styles.secondaryButtonText, { color: colors.primary }]}
            >
              Follow
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Professional
          </Text>
          <View style={styles.infoItem}>
            <Ionicons
              name="briefcase-outline"
              size={20}
              color={colors.primary}
            />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {userData?.jobTitle && userData?.jobCompany
                ? `${userData.jobTitle} at ${userData.jobCompany}`
                : userData?.jobTitle || userData?.jobCompany || "Not specified"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="school-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {userData?.school || "Not specified"}
            </Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Personal
          </Text>
          <View style={styles.infoItem}>
            <Ionicons name="home-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              From {userData?.hometown || "Unknown"}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="star-outline" size={20} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              {userData?.starSign || "Unknown"}
            </Text>
          </View>
        </View>

        {userData?.hobbies && userData.hobbies.length > 0 && (
          <View style={[styles.section, { backgroundColor: colors.surface }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Interests
            </Text>
            <View style={styles.tagContainer}>
              {userData.hobbies.map((hobby: string, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.tag,
                    { backgroundColor: colors.primary + "20" },
                  ]}
                >
                  <Text style={[styles.tagText, { color: colors.primary }]}>
                    {hobby}
                  </Text>
                </View>
              ))}
            </View>
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
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  moreButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    padding: 20,
    alignItems: "center",
    margin: 16,
    borderRadius: 12,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  age: {
    fontSize: 16,
    marginBottom: 12,
  },
  bio: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 16,
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  section: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
