import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { mockUsers, getMockUsers } from "../../data/mockData";
import AnimatedAvatar from "../../components/AnimatedAvatar";
import { DataService } from "../../services/DataService";
import LoadingIndicator from "../../components/LoadingIndicator";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AvatarPosition {
  id: string;
  x: number;
  y: number;
  size: number;
}

export default function AnimatedAvatarScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [users, setUsers] = useState(() => generateMoreUsers());
  const [avatarPositions, setAvatarPositions] = useState<AvatarPosition[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Generate more users for a more lively community screen
  function generateMoreUsers() {
    const baseUsers = getMockUsers();
    const additionalUsers = [];

    // Create variations of existing users with different names and photos
    const names = [
      "Emma",
      "Liam",
      "Olivia",
      "Noah",
      "Ava",
      "William",
      "Sophia",
      "James",
      "Isabella",
      "Benjamin",
      "Charlotte",
      "Lucas",
      "Amelia",
      "Henry",
      "Mia",
      "Alexander",
      "Harper",
      "Mason",
      "Evelyn",
      "Michael",
      "Abigail",
      "Ethan",
      "Emily",
      "Daniel",
      "Elizabeth",
      "Jacob",
      "Sofia",
      "Logan",
      "Avery",
      "Jackson",
      "Ella",
      "Levi",
      "Madison",
      "Sebastian",
      "Scarlett",
      "Mateo",
      "Victoria",
      "Jack",
      "Aria",
      "Owen",
      "Grace",
      "Theodore",
      "Chloe",
      "Aiden",
      "Camila",
      "Samuel",
      "Penelope",
      "Joseph",
      "Riley",
      "John",
    ];

    const profilePics = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    ];

    // Generate 10 additional users (total of 13 avatars)
    for (let i = 0; i < 10; i++) {
      const randomUser = baseUsers[i % baseUsers.length];
      additionalUsers.push({
        ...randomUser,
        uid: `avatar_${i + 4}`,
        displayName: names[i],
        profilePictures: [profilePics[i % profilePics.length]],
        age: 22 + (i % 15), // Ages between 22-36
      });
    }

    return [...baseUsers, ...additionalUsers];
  }

  // Generate random positions for avatars
  useEffect(() => {
    if (DataService.isInDeveloperMode()) {
      const positions: AvatarPosition[] = users.map((user, index) => {
        const size = 80 + Math.random() * 30; // Random size between 80-110 (larger circles)
        return {
          id: user.uid,
          x: Math.random() * (screenWidth - size),
          y: Math.random() * (screenHeight - 300 - size), // Leave more space for header
          size,
        };
      });
      setAvatarPositions(positions);
      console.log(
        "🧪 DEV MODE: Generated positions for",
        users.length,
        "avatar bubbles (3 original + 10 generated)"
      );
      console.log(
        "🧪 Users array:",
        users.map((u) => u.displayName)
      );
      console.log("🧪 Avatar positions:", positions.length);
    }
  }, [users]);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setUsers(generateMoreUsers());
      setRefreshing(false);
    }, 1000);
  };

  const handleAvatarPress = (user: any) => {
    // Navigate directly to user profile
    navigation.navigate("UserProfile", {
      userId: user.uid,
      userData: user,
    });
  };

  if (!DataService.isInDeveloperMode()) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={["top"]}
      >
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Community
            </Text>
            <Text
              style={[styles.headerSubtitle, { color: colors.textSecondary }]}
            >
              Interactive avatar bubbles with mock users
            </Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons
            name="people-outline"
            size={64}
            color={colors.textTertiary}
          />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            Community View
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            This feature is only available in developer mode
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={["top"]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Community
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: colors.textSecondary }]}
          >
            Interactive avatar bubbles with mock users
          </Text>
        </View>
        <TouchableOpacity onPress={onRefresh} disabled={refreshing}>
          {refreshing ? (
            <LoadingIndicator size={24} />
          ) : (
            <Ionicons name="refresh" size={24} color={colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      {/* Animated Avatars Container */}
      <View style={styles.avatarsContainer}>
        {avatarPositions.map((position, index) => {
          const user = users.find((u) => u.uid === position.id);
          if (!user) {
            console.log(
              `🧪 Avatar ${index}: No user found for position ${position.id}`
            );
            return null;
          }

          console.log(
            `🧪 Rendering avatar ${index + 1}/${avatarPositions.length}: ${
              user.displayName
            } at (${position.x}, ${position.y})`
          );

          // Get other avatars' positions for collision detection
          const otherAvatars = avatarPositions.filter(
            (p) => p.id !== position.id
          );

          return (
            <AnimatedAvatar
              key={user.uid}
              user={user}
              size={position.size}
              onPress={() => handleAvatarPress(user)}
              otherAvatars={otherAvatars}
            />
          );
        })}
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
    textAlign: "center",
  },
  avatarsContainer: {
    flex: 1,
    position: "relative",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
    lineHeight: 20,
  },
});
