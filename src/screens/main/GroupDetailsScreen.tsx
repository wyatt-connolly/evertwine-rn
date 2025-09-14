import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";

interface GroupDetailsScreenProps {
  route: {
    params: {
      groupId: string;
      groupData?: {
        id: string;
        name: string;
        description: string;
        members: string[];
        memberCount: number;
        admins: string[];
      };
    };
  };
  navigation: any;
}

// Mock user data (same as in MessageDetailsScreen)
const mockUsers: Record<string, any> = {
  user1: {
    id: "user1",
    name: "You",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    bio: "Adventure seeker and coffee enthusiast",
    location: "San Francisco, CA",
    interests: ["Hiking", "Photography", "Coffee"],
    isOnline: true,
  },
  user6: {
    id: "user6",
    name: "Emma Davis",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400",
    bio: "Professional photographer and travel blogger",
    location: "San Francisco, CA",
    interests: ["Photography", "Travel", "Art"],
    isOnline: true,
  },
  user7: {
    id: "user7",
    name: "David Kim",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400",
    bio: "Amateur photographer and tech worker",
    location: "San Francisco, CA",
    interests: ["Photography", "Technology", "Hiking"],
    isOnline: false,
  },
  user8: {
    id: "user8",
    name: "Lisa Park",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
    bio: "Creative director and photography enthusiast",
    location: "San Francisco, CA",
    interests: ["Photography", "Design", "Art"],
    isOnline: true,
  },
};

export default function GroupDetailsScreen({
  route,
  navigation,
}: GroupDetailsScreenProps) {
  const { colors } = useThemeStore();
  const { groupId, groupData } = route.params;

  console.log("👥 GroupDetailsScreen loaded:", { groupId, groupData });

  const renderMember = ({ item }: { item: string }) => {
    const user = mockUsers[item];
    if (!user) return null;

    return (
      <TouchableOpacity
        style={[styles.memberItem, { backgroundColor: colors.surface }]}
        onPress={() => {
          console.log("👤 Member clicked:", user.name);
          navigation.navigate("UserProfile", {
            userId: user.id,
            userData: user,
          });
        }}
      >
        <Image source={{ uri: user.avatar }} style={styles.memberAvatar} />
        <View style={styles.memberInfo}>
          <Text style={[styles.memberName, { color: colors.text }]}>
            {user.name}
          </Text>
          <Text style={[styles.memberBio, { color: colors.textSecondary }]}>
            {user.bio}
          </Text>
        </View>
        <View style={styles.memberStatus}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: user.isOnline
                  ? "#4CAF50"
                  : colors.textTertiary,
              },
            ]}
          />
        </View>
      </TouchableOpacity>
    );
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Group Details
        </Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.content}>
        <View style={[styles.groupInfo, { backgroundColor: colors.surface }]}>
          <View style={styles.groupHeader}>
            <Ionicons name="people" size={48} color={colors.primary} />
            <View style={styles.groupText}>
              <Text style={[styles.groupName, { color: colors.text }]}>
                {groupData?.name || "Group"}
              </Text>
              <Text
                style={[styles.memberCount, { color: colors.textSecondary }]}
              >
                {groupData?.memberCount || 0} members
              </Text>
            </View>
          </View>
          {groupData?.description && (
            <Text style={[styles.groupDescription, { color: colors.text }]}>
              {groupData.description}
            </Text>
          )}
        </View>

        <View style={styles.membersSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Members
          </Text>
          <FlatList
            data={groupData?.members || []}
            renderItem={renderMember}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  groupInfo: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  groupText: {
    marginLeft: 16,
    flex: 1,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberCount: {
    fontSize: 16,
  },
  groupDescription: {
    fontSize: 16,
    lineHeight: 22,
  },
  membersSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  memberBio: {
    fontSize: 14,
  },
  memberStatus: {
    alignItems: "center",
    justifyContent: "center",
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
