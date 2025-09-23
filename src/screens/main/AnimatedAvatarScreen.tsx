import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { mockUsers, getMockUsers } from "../../data/mockData";
import AnimatedAvatar from "../../components/AnimatedAvatar";
import { DataService } from "../../services/DataService";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface AvatarPosition {
  id: string;
  x: number;
  y: number;
  size: number;
}

export default function AnimatedAvatarScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [users, setUsers] = useState(getMockUsers());
  const [avatarPositions, setAvatarPositions] = useState<AvatarPosition[]>([]);

  // Generate random positions for avatars
  useEffect(() => {
    if (DataService.isInDeveloperMode()) {
      const positions: AvatarPosition[] = users.map((user, index) => {
        const size = 60 + Math.random() * 20; // Random size between 60-80
        return {
          id: user.uid,
          x: Math.random() * (screenWidth - size),
          y: Math.random() * (screenHeight - 200 - size), // Leave space for header/footer
          size,
        };
      });
      setAvatarPositions(positions);
      console.log(
        "🧪 DEV MODE: Generated positions for",
        users.length,
        "mock users"
      );
    }
  }, [users]);

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
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Community
          </Text>
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
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Community
        </Text>
        <TouchableOpacity>
          <Ionicons name="refresh" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      {/* Animated Avatars Container */}
      <View style={styles.avatarsContainer}>
        {avatarPositions.map((position) => {
          const user = users.find((u) => u.uid === position.id);
          if (!user) return null;

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
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
