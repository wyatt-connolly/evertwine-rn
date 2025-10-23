import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { DataService } from "../../services/DataService";
import { User } from "../../types";
import CommunityUserCard from "../../components/CommunityUserCard";

export default function CommunityScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [featuredUsers, setFeaturedUsers] = useState<User[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [newMembers, setNewMembers] = useState<User[]>([]);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      setIsLoading(true);
      
      const [featured, active, newUsers] = await Promise.all([
        DataService.getFeaturedUsers(),
        DataService.getActiveUsers(),
        DataService.getNewMembers(),
      ]);

      setFeaturedUsers(featured);
      setActiveUsers(active);
      setNewMembers(newUsers);
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
      userData: user 
    });
  };

  const handleBrowseAll = () => {
    Alert.alert("Coming Soon", "Browse all members feature will be available soon!");
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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Discover Community
          </Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Discover Community
          </Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Featured Members Section */}
        <View style={styles.section}>
          {renderSectionHeader(
            "Featured Members",
            "Standout community members this week"
          )}
          
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
          {renderSectionHeader(
            "New Members",
            "Recently joined the community"
          )}
          
          {newMembers.length > 0 ? (
            <View style={styles.gridContainer}>
              {newMembers.map((user) => (
                <CommunityUserCard
                  key={user.uid}
                  user={user}
                  variant="grid"
                  onPress={() => handleUserPress(user)}
                  showBadge={true}
                  badgeText="New"
                  badgeColor="#F59E0B"
                />
              ))}
            </View>
          ) : (
            renderEmptyState("No new members yet")
          )}
        </View>

        {/* Browse All Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.browseAllButton, { backgroundColor: colors.primary }]}
            onPress={handleBrowseAll}
          >
            <Ionicons name="people" size={24} color="#FFFFFF" />
            <Text style={styles.browseAllText}>Browse All Members</Text>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  searchButton: {
    padding: 8,
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
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
  browseAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  browseAllText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 12,
  },
  bottomSpacing: {
    height: 20,
  },
});
