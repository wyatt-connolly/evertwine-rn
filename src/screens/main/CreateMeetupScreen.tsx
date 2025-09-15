import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import * as ImagePicker from "expo-image-picker";

// Predefined images for different meetup types
const PREDEFINED_IMAGES = {
  drinks: [
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400",
    "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400",
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=400",
    "https://images.unsplash.com/photo-1571613316887-6f8d5cbf7ef7?w=400",
  ],
  coffee: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400",
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400",
  ],
  sports: [
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400",
  ],
  food: [
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
    "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    "https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=400",
    "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
  ],
  outdoor: [
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
  ],
  general: [
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400",
    "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400",
    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400",
  ],
};

export default function CreateMeetupScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const { createMeetup } = useMeetupStore();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    locationName: "",
    address: "",
    activity: "",
    activityCategory: "",
    tags: "",
    maxParticipants: "",
    time: "",
    duration: "60",
    isRecurring: false,
    verificationRequired: false,
    coverImage: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<string>("general");

  const handleImageUpload = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll permissions to upload a photo."
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setFormData((prev) => ({
          ...prev,
          coverImage: result.assets[0].uri,
        }));
        setShowImageModal(false);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload image. Please try again.");
      console.error("Image upload error:", error);
    }
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: imageUrl,
    }));
    setShowImageModal(false);
  };

  const getImagesForCategory = (category: string) => {
    const categoryKey =
      category.toLowerCase() as keyof typeof PREDEFINED_IMAGES;
    return PREDEFINED_IMAGES[categoryKey] || PREDEFINED_IMAGES.general;
  };

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.locationName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const meetupData = {
      ...formData,
      maxParticipants: parseInt(formData.maxParticipants) || 10,
      duration: parseInt(formData.duration),
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      time: formData.time ? new Date(formData.time) : new Date(),
      location: {
        latitude: 37.7749, // Default SF coordinates
        longitude: -122.4194,
      },
      creatorId: "current_user", // This would come from auth
      creatorRef: "users/current_user",
      status: "active" as const,
      currentParticipants: 1,
      participants: ["current_user"],
      waitlist: [],
      declinedUsers: [],
      views: 0,
      joinRequests: 0,
      completionRate: 0,
      engagementScore: 0,
      timezone: "America/Los_Angeles", // Default timezone
      connectionType: "casual", // Default connection type
      requirements: {
        verificationRequired: formData.verificationRequired,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    createMeetup(meetupData);
    Alert.alert("Success", "Meetup created successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
  };

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    multiline = false,
    keyboardType: any = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            borderColor: colors.border,
          },
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textTertiary}
        value={String(formData[field])}
        onChangeText={(value) => updateFormData(field, value)}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderSwitch = (label: string, field: keyof typeof formData) => (
    <View style={styles.switchContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Switch
        value={formData[field] as boolean}
        onValueChange={(value) => updateFormData(field, value)}
        trackColor={{ false: colors.border, true: colors.primary + "50" }}
        thumbColor={formData[field] ? colors.primary : colors.textTertiary}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Create Meetup
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveButton, { color: colors.primary }]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderInput("Title *", "title", "Enter meetup title")}
          {renderInput(
            "Description *",
            "description",
            "Describe your meetup",
            true
          )}

          {/* Cover Image Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Cover Image
            </Text>
            <TouchableOpacity
              style={[
                styles.imageSelector,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowImageModal(true)}
            >
              {formData.coverImage ? (
                <Image
                  source={{ uri: formData.coverImage }}
                  style={styles.selectedImage}
                />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons
                    name="image-outline"
                    size={32}
                    color={colors.textTertiary}
                  />
                  <Text
                    style={[
                      styles.placeholderText,
                      { color: colors.textTertiary },
                    ]}
                  >
                    Select an image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {renderInput(
            "Location *",
            "locationName",
            "Where will it take place?"
          )}
          {renderInput("Address", "address", "Full address")}
          {renderInput("Activity", "activity", "What activity?")}
          {renderInput(
            "Category",
            "activityCategory",
            "e.g., Fitness, Social, Professional"
          )}
          {renderInput("Tags", "tags", "Comma-separated tags")}
          {renderInput(
            "Max Participants",
            "maxParticipants",
            "10",
            false,
            "numeric"
          )}
          {renderInput("Date & Time", "time", "2024-09-20T18:00")}
          {renderInput(
            "Duration (minutes)",
            "duration",
            "60",
            false,
            "numeric"
          )}

          <View style={styles.divider} />

          {renderSwitch("Recurring Event", "isRecurring")}
          {renderSwitch("Verification Required", "verificationRequired")}
        </View>
      </ScrollView>

      {/* Image Selection Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: colors.surface }]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Select Cover Image
              </Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            {/* Category Tabs */}
            <View style={styles.categoryTabs}>
              {Object.keys(PREDEFINED_IMAGES).map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryTab,
                    {
                      backgroundColor:
                        selectedImageType === category
                          ? colors.primary
                          : colors.background,
                    },
                  ]}
                  onPress={() => setSelectedImageType(category)}
                >
                  <Text
                    style={[
                      styles.categoryTabText,
                      {
                        color:
                          selectedImageType === category
                            ? colors.onPrimary
                            : colors.text,
                      },
                    ]}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Upload Button */}
            <TouchableOpacity
              style={[styles.uploadButton, { backgroundColor: colors.primary }]}
              onPress={handleImageUpload}
            >
              <Ionicons
                name="camera-outline"
                size={20}
                color={colors.onPrimary}
              />
              <Text
                style={[styles.uploadButtonText, { color: colors.onPrimary }]}
              >
                Upload Your Own
              </Text>
            </TouchableOpacity>

            {/* Image Grid */}
            <FlatList
              data={getImagesForCategory(selectedImageType)}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.imageItem}
                  onPress={() => handleImageSelect(item)}
                >
                  <Image source={{ uri: item }} style={styles.gridImage} />
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.imageGrid}
            />
          </View>
        </View>
      </Modal>
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
    minHeight: 100,
    textAlignVertical: "top",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  // Image Selection Styles
  imageSelector: {
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    maxHeight: "80%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  categoryTabs: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 10,
    gap: 8,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  categoryTabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  imageGrid: {
    padding: 20,
  },
  imageItem: {
    flex: 1,
    margin: 4,
    borderRadius: 8,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: 120,
  },
});
