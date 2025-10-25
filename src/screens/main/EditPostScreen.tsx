import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { DataService } from "../../services/DataService";
import { SupabaseDataService } from "../../services/SupabaseDataService";
import * as ImagePicker from "expo-image-picker";

interface EditPostScreenProps {
  navigation: any;
  route: {
    params: {
      postId: string;
    };
  };
}

export default function EditPostScreen({
  navigation,
  route,
}: EditPostScreenProps) {
  const { postId } = route.params;
  const { colors } = useThemeStore();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    images: [] as string[],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPostData();
  }, [postId]);

  const loadPostData = async () => {
    try {
      setIsLoading(true);
      const post = await SupabaseDataService.getPost(postId);

      if (post) {
        setFormData({
          title: post.title,
          message: post.message,
          images: post.images || [],
        });
      } else {
        Alert.alert("Error", "Post not found.");
        navigation.goBack();
      }
    } catch (error) {
      console.error("Error loading post:", error);
      Alert.alert("Error", "Failed to load post data.");
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.message.trim()) {
      Alert.alert("Error", "Please fill in both title and message.");
      return;
    }

    setIsSaving(true);

    try {
      const updates = {
        title: formData.title.trim(),
        message: formData.message.trim(),
        images: formData.images,
      };

      const result = await DataService.updatePost(postId, updates);

      if (result.success) {
        Alert.alert("Success", "Post updated successfully!", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Home", { refresh: true }),
          },
        ]);
      } else {
        Alert.alert("Error", result.error || "Failed to update post.");
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "Failed to update post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const result = await DataService.deletePost(postId);

              if (result.success) {
                Alert.alert("Success", "Post deleted successfully!", [
                  {
                    text: "OK",
                    onPress: () =>
                      navigation.navigate("Home", { refresh: true }),
                  },
                ]);
              } else {
                Alert.alert("Error", result.error || "Failed to delete post.");
              }
            } catch (error) {
              console.error("Error deleting post:", error);
              Alert.alert("Error", "Failed to delete post. Please try again.");
            }
          },
        },
      ]
    );
  };

  const handleAddImage = async () => {
    if (formData.images.length >= 3) {
      Alert.alert("Maximum Images", "You can only add up to 3 images.");
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, result.assets[0].uri],
        }));
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image.");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Loading post...
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Post</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#FF6B35" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave} disabled={isSaving}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="Enter post title"
              placeholderTextColor={colors.textTertiary}
              value={formData.title}
              onChangeText={(value) => updateFormData("title", value)}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Message *
            </Text>
            <TextInput
              style={[
                styles.input,
                styles.multilineInput,
                {
                  backgroundColor: colors.surface,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textTertiary}
              value={formData.message}
              onChangeText={(value) => {
                // Limit consecutive line breaks to maximum of 2 (one extra line)
                const limitedText = value.replace(/\n{3,}/g, "\n\n");
                updateFormData("message", limitedText);
              }}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.imagesSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Images ({formData.images.length}/3)
            </Text>

            <View style={styles.imagesContainer}>
              {formData.images.map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image source={{ uri: image }} style={styles.imagePreview} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                  >
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}

              {formData.images.length < 3 && (
                <TouchableOpacity
                  style={[
                    styles.addImageButton,
                    { borderColor: colors.border },
                  ]}
                  onPress={handleAddImage}
                >
                  <Ionicons
                    name="camera"
                    size={24}
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.addImageText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Add Image
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteButton: {
    marginRight: 16,
    padding: 4,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 120,
    textAlignVertical: "top",
  },
  imagesSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  imageContainer: {
    position: "relative",
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
    backgroundColor: "#FF6B35",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageButton: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderStyle: "dashed",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addImageText: {
    fontSize: 12,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    marginTop: 16,
  },
});
