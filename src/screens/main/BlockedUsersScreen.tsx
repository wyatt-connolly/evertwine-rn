import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { User } from "../../types";

export default function BlockedUsersScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user } = useAuthStore();
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [unblockingUserId, setUnblockingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadBlockedUsers();
  }, []);

  const loadBlockedUsers = async () => {
    if (!user?.uid) return;

    try {
      setIsLoading(true);
      const blockedUserIds = await DataService.getBlockedUsers(user.uid);

      if (blockedUserIds.length > 0) {
        const users = await DataService.getUsersByIds(blockedUserIds);
        setBlockedUsers(users);
      } else {
        setBlockedUsers([]);
      }
    } catch (error) {
      console.error("Error loading blocked users:", error);
      Alert.alert("Error", "Failed to load blocked users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnblockUser = async (blockedUser: User) => {
    if (!user?.uid) return;

    Alert.alert(
      "Unblock User",
      `Are you sure you want to unblock ${blockedUser.displayName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unblock",
          style: "destructive",
          onPress: async () => {
            setUnblockingUserId(blockedUser.uid);
            try {
              await DataService.unblockUser(user.uid, blockedUser.uid);
              Alert.alert(
                "Success",
                `${blockedUser.displayName} has been unblocked.`
              );
              // Reload the list
              await loadBlockedUsers();
            } catch (error) {
              console.error("Error unblocking user:", error);
              Alert.alert("Error", "Failed to unblock user. Please try again.");
            } finally {
              setUnblockingUserId(null);
            }
          },
        },
      ]
    );
  };

  const renderBlockedUser = ({ item }: { item: User }) => (
    <View style={[styles.userItem, { backgroundColor: colors.surface }]}>
      <View style={styles.userInfo}>
        <View
          style={[styles.avatarContainer, { backgroundColor: colors.border }]}
        >
          {item.profilePictures && item.profilePictures.length > 0 ? (
            <Ionicons name="person" size={24} color={colors.textTertiary} />
          ) : (
            <Ionicons name="person" size={24} color={colors.textTertiary} />
          )}
        </View>
        <View style={styles.userDetails}>
          <Text style={[styles.userName, { color: colors.text }]}>
            {item.displayName}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.unblockButton, { backgroundColor: colors.primary }]}
        onPress={() => handleUnblockUser(item)}
        disabled={unblockingUserId === item.uid}
      >
        {unblockingUserId === item.uid ? (
          <ActivityIndicator size="small" color={colors.onPrimary} />
        ) : (
          <Text style={[styles.unblockButtonText, { color: colors.onPrimary }]}>
            Unblock
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shield-checkmark" size={64} color={colors.textTertiary} />
      <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
        No Blocked Users
      </Text>
      <Text
        style={[styles.emptyStateSubtitle, { color: colors.textSecondary }]}
      >
        You haven't blocked any users yet.
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>
            Blocked Users
          </Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading blocked users...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          Blocked Users
        </Text>
        <View style={styles.placeholder} />
      </View>

      {blockedUsers.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={blockedUsers}
          renderItem={renderBlockedUser}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  loadingText: {
    fontSize: 16,
  },
  listContainer: {
    padding: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  unblockButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  unblockButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
});
