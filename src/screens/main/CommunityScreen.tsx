import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { User } from "../../types";
import CommunityUserCard from "../../components/CommunityUserCard";

export default function CommunityScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [newMembers, setNewMembers] = useState<User[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  // Helper function to filter out current user from community lists
  const filterOutCurrentUser = (users: User[]): User[] => {
    if (!currentUser) return users;
    return users.filter((user) => user.uid !== currentUser.uid);
  };

  const loadCommunityData = async () => {
    try {
      setIsLoading(true);

      const [featured, active, newUsers] = await Promise.all([
        DataService.getFeaturedUsers(),
        DataService.getActiveUsers(),
        DataService.getNewMembers(),
      ]);

      // Filter out current user from all lists
      setFeaturedUsers(filterOutCurrentUser(featured));
      setActiveUsers(filterOutCurrentUser(active));
      setNewMembers(filterOutCurrentUser(newUsers));
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadCommunityData();
    setIsRefreshing(false);
  };

  const handleUserPress = (user: User) => {
    navigation.navigate("UserProfile", {
      userId: user.uid,
      userData: user,
    });
  };

  const renderFeaturedUser = ({ item }: { item: User }) => (
    <CommunityUserCard
      user={item}
      variant="large"
      onPress={() => handleUserPress(item)}
      showBadge={true}
      badgeText="Featured"
      badgeColor="#8B5CF6"
    />
  );

  const renderActiveUser = ({ item }: { item: User }) => (
    <CommunityUserCard
      user={item}
      variant="small"
      onPress={() => handleUserPress(item)}
      showBadge={true}
      badgeText="Active"
      badgeColor="#10B981"
    />
  );

  // const renderNewMember = ({ item }: { item: User }) => (
  //   <CommunityUserCard
  //     user={item}
  //     variant="grid"
  //     onPress={() => handleUserPress(item)}
  //     showBadge={true}
  //     badgeText="New"
  //     badgeColor="#F59E0B"
  //   />
  // );

  const renderSectionHeader = (title: string, subtitle: string) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>
        <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
    </View>
  );

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyState}>
      <Ionicons name="people-outline" size={48} color={colors.textTertiary} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {message}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        {/* App Bar */}
        <View
          style={[
            styles.appBar,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.appBarTitle, { color: colors.text }]}>
            Featured Members
          </Text>
          <Text
            style={[styles.appBarSubtitle, { color: colors.textSecondary }]}
          >
            Standout community members this week
          </Text>
        </View>

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading community...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* App Bar */}
      <View
        style={[
          styles.appBar,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.appBarTitle, { color: colors.text }]}>
          Featured Members
        </Text>
        <Text style={[styles.appBarSubtitle, { color: colors.textSecondary }]}>
          Standout community members this week
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Featured Members Section */}
        <View style={styles.section}>
          {featuredUsers.length > 0 ? (
            <FlatList
              data={featuredUsers}
              renderItem={renderFeaturedUser}
              keyExtractor={(item) => item.uid}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            renderEmptyState("No featured members yet")
          )}
        </View>

        {/* Active This Week Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Active This Week",
            "Members who've been active recently"
          )}

          {activeUsers.length > 0 ? (
            <FlatList
              data={activeUsers}
              renderItem={renderActiveUser}
              keyExtractor={(item) => item.uid}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            renderEmptyState("No active members this week")
          )}
        </View>

        {/* New Members Section */}
        <View style={styles.section}>
          {renderSectionHeader("New Members", "Recently joined the community")}

          {newMembers.length > 0 ? (
            <FlatList
              data={newMembers}
              renderItem={({ item }) => (
                <CommunityUserCard
                  user={item}
                  variant="small"
                  onPress={() => handleUserPress(item)}
                  showBadge={true}
                  badgeText="New"
                  badgeColor="#F59E0B"
                />
              )}
              keyExtractor={(item) => item.uid}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          ) : (
            renderEmptyState("No new members yet")
          )}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  appBarTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  appBarSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  horizontalList: {
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});
