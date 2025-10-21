import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";

export default function CreatePostScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handlePost = () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in both title and message."
      );
      return;
    }

    // Here you would implement the actual post creation logic

    // Show success message and navigate back
    Alert.alert(
      "Post Created!",
      "Your post has been shared with the community.",
      [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const handleAddImage = () => {
    // Here you would implement image picker functionality
    Alert.alert(
      "Add Image",
      "Image picker functionality would be implemented here."
    );
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Create Post
        </Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            {
              backgroundColor:
                title.trim() && message.trim()
                  ? colors.accentSecondary
                  : colors.textTertiary,
            },
          ]}
          onPress={handlePost}
          disabled={!title.trim() || !message.trim()}
        >
          <Text
            style={[
              styles.postButtonText,
              {
                color:
                  title.trim() && message.trim()
                    ? colors.onAccent
                    : colors.textSecondary,
              },
            ]}
          >
            Post
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* User Info */}
          <View style={styles.userInfo}>
            <Image
              source={{
                uri:
                  currentUser?.profilePictures?.[0] ||
                  "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {currentUser?.displayName || "You"}
              </Text>
              <Text
                style={[styles.userLocation, { color: colors.textSecondary }]}
              >
                {currentUser?.locationName || "San Francisco, CA"}
              </Text>
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Title
            </Text>
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text
              style={[styles.characterCount, { color: colors.textTertiary }]}
            >
              {title.length}/100
            </Text>
          </View>

          {/* Description Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>
              Description
            </Text>
            <TextInput
              style={[styles.messageInput, { color: colors.text }]}
              placeholder="Share your thoughts, experiences, or ask a question..."
              placeholderTextColor={colors.textTertiary}
              value={message}
              onChangeText={setMessage}
              multiline
              textAlignVertical="top"
              maxLength={1000}
            />
            <Text
              style={[styles.characterCount, { color: colors.textTertiary }]}
            >
              {message.length}/1000
            </Text>
          </View>

          {/* Images Section */}
          {images.length > 0 && (
            <View style={styles.imagesSection}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Images ({images.length})
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {images.map((image, index) => (
                  <View key={index} style={styles.imageContainer}>
                    <Image
                      source={{ uri: image }}
                      style={styles.imagePreview}
                    />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => handleRemoveImage(index)}
                    >
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Add Image Button */}
          <TouchableOpacity
            style={[styles.addImageButton, { borderColor: colors.border }]}
            onPress={handleAddImage}
          >
            <Ionicons name="camera" size={24} color={colors.textSecondary} />
            <Text
              style={[styles.addImageText, { color: colors.textSecondary }]}
            >
              Add Photo
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  userLocation: {
    fontSize: 14,
    marginTop: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  titleInput: {
    fontSize: 20,
    fontWeight: "600",
    paddingVertical: 12,
    paddingHorizontal: 0,
  },
  messageInput: {
    fontSize: 16,
    lineHeight: 24,
    paddingVertical: 12,
    paddingHorizontal: 0,
    minHeight: 120,
  },
  characterCount: {
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  imagesSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
    marginRight: 12,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removeImageButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "white",
    borderRadius: 10,
  },
  addImageButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    marginBottom: 20,
  },
  addImageText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 8,
  },
});
