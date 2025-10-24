import { useState, useEffect } from "react";
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
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useAuthStore } from "../../hooks/useAuthStore";
import { DataService } from "../../services/DataService";
import { User } from "../../types";

export default function CreatePostScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { user: currentUser } = useAuthStore();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!currentUser?.uid) {
        setIsLoadingProfile(false);
        return;
      }

      try {
        setIsLoadingProfile(true);
        const result = await DataService.getUser(currentUser.uid);

        if (result.user) {
          setUserProfile(result.user);
        } else {
          // If user doesn't exist in Supabase, use auth user data
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUserProfile(null);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [currentUser?.uid]);

  const handlePost = async () => {
    if (!title.trim() || !message.trim()) {
      Alert.alert(
        "Missing Information",
        "Please fill in both title and message."
      );
      return;
    }

    if (!currentUser) {
      Alert.alert("Error", "You must be logged in to create a post.");
      return;
    }

    setIsLoading(true);

    try {
      // Create the post data
      const postData = {
        userId: currentUser.uid,
        title: title.trim(),
        message: message.trim(),
        images: images,
        likes: [],
        isAnnouncement: false,
      };

      // Create the post using DataService
      const result = await DataService.createPost(postData);

      if (result.success) {
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
      } else {
        Alert.alert("Error", result.error || "Failed to create post.");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddImage = async () => {
    // Check if we already have the maximum number of images
    if (images.length >= 5) {
      Alert.alert("Maximum Images", "You can only add up to 5 images.");
      return;
    }

    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your photo library."
      );
      return;
    }

    // Show action sheet for image selection
    Alert.alert(
      "Add Image",
      "Choose an option",
      [
        {
          text: "Camera",
          onPress: () => openCamera(),
        },
        {
          text: "Photo Library",
          onPress: () => openImageLibrary(),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant permission to access your camera."
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const openImageLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      allowsMultipleSelection: false,
    });

    if (!result.canceled && result.assets[0]) {
      setImages([...images, result.assets[0].uri]);
    }
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
                title.trim() && message.trim() && !isLoading
                  ? colors.accentSecondary
                  : colors.textTertiary,
            },
          ]}
          onPress={handlePost}
          disabled={!title.trim() || !message.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.onAccent} />
          ) : (
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
          )}
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
                uri: currentUser?.photoURL || "https://via.placeholder.com/40",
              }}
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text style={[styles.userName, { color: colors.text }]}>
                {userProfile?.displayName || currentUser?.displayName || "You"}
              </Text>
              <Text
                style={[styles.userLocation, { color: colors.textSecondary }]}
              >
                {isLoadingProfile
                  ? "Loading..."
                  : userProfile?.locationName
                  ? userProfile.locationName
                  : "Location not set"}
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
