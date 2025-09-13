import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { getMockUsers } from "../../data/mockData";
import { User } from "../../types";

export default function ComposeMessageScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [messageText, setMessageText] = useState("");

  const allUsers = getMockUsers();
  const filteredUsers = allUsers.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) &&
    !selectedUsers.find(selected => selected.uid === user.uid)
  );

  const handleUserSelect = (user: User) => {
    setSelectedUsers(prev => [...prev, user]);
  };

  const handleUserRemove = (userId: string) => {
    setSelectedUsers(prev => prev.filter(user => user.uid !== userId));
  };

  const handleSendMessage = () => {
    if (selectedUsers.length === 0) {
      Alert.alert("No Recipients", "Please select at least one person to message.");
      return;
    }
    
    if (!messageText.trim()) {
      Alert.alert("Empty Message", "Please enter a message.");
      return;
    }

    Alert.alert(
      "Message Sent", 
      `Message sent to ${selectedUsers.length} recipient${selectedUsers.length > 1 ? 's' : ''}!`,
      [{ text: "OK", onPress: () => navigation.goBack() }]
    );
  };

  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, { backgroundColor: colors.surface }]}
      onPress={() => handleUserSelect(item)}
    >
      <Image source={{ uri: item.profilePictures[0] }} style={styles.userAvatar} />
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: colors.text }]}>
          {item.displayName}
        </Text>
        <Text style={[styles.userBio, { color: colors.textSecondary }]}>
          {item.bio}
        </Text>
      </View>
      <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );

  const renderSelectedUser = (user: User) => (
    <View key={user.uid} style={[styles.selectedUserChip, { backgroundColor: colors.primary }]}>
      <Image source={{ uri: user.profilePictures[0] }} style={styles.selectedUserAvatar} />
      <Text style={[styles.selectedUserName, { color: colors.onPrimary }]}>
        {user.displayName}
      </Text>
      <TouchableOpacity onPress={() => handleUserRemove(user.uid)}>
        <Ionicons name="close" size={16} color={colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Message</Text>
        <TouchableOpacity 
          style={[styles.sendButton, { backgroundColor: colors.primary }]}
          onPress={handleSendMessage}
        >
          <Ionicons name="send" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>

      {/* Selected Users */}
      {selectedUsers.length > 0 && (
        <View style={[styles.selectedUsersContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.selectedUsersLabel, { color: colors.textSecondary }]}>
            To:
          </Text>
          <View style={styles.selectedUsersList}>
            {selectedUsers.map(renderSelectedUser)}
          </View>
        </View>
      )}

      {/* Message Input */}
      <View style={[styles.messageInputContainer, { backgroundColor: colors.surface }]}>
        <TextInput
          style={[styles.messageInput, { color: colors.text }]}
          placeholder="Type your message..."
          placeholderTextColor={colors.textTertiary}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <View style={styles.messageActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="image-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="camera-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="mic-outline" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
        <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search people..."
          placeholderTextColor={colors.textTertiary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.uid}
        style={styles.usersList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color={colors.textTertiary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No users found
            </Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
              Try adjusting your search
            </Text>
          </View>
        }
      />
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
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  selectedUsersContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  selectedUsersLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectedUsersList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedUserChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedUserAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
  },
  selectedUserName: {
    fontSize: 12,
    fontWeight: "500",
    marginRight: 6,
  },
  messageInputContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  messageInput: {
    fontSize: 16,
    minHeight: 40,
    maxHeight: 120,
    marginBottom: 12,
  },
  messageActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
  },
  actionButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  usersList: {
    flex: 1,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
  },
});
