import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Modal,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import * as ImagePicker from "expo-image-picker";

// Predefined activity options
const ACTIVITY_PRESETS = [
  "Coffee & Networking",
  "Business Lunch",
  "Happy Hour Networking",
  "Industry Meetup",
  "Startup Pitch Event",
  "Professional Workshop",
  "Conference Networking",
  "Mentorship Session",
  "Business Book Club",
  "Entrepreneur Meetup",
  "Tech Talk",
  "Investment Discussion",
  "Coffee & Chat",
  "Brunch with Friends",
  "Game Night",
  "Movie Night",
  "Hiking Adventure",
  "Beach Day",
  "Picnic in the Park",
  "Art Gallery Visit",
  "Museum Tour",
  "Concert",
  "Comedy Show",
  "Dance Class",
  "Yoga Session",
  "Fitness Workout",
  "Cooking Class",
  "Wine Tasting",
  "Food Tour",
  "Photography Walk",
  "Language Exchange",
  "Book Club",
  "Study Group",
  "Volunteer Work",
  "Community Service",
  "Sports Game",
  "Tennis Match",
  "Golf Outing",
  "Bike Ride",
  "Running Group",
  "Swimming",
  "Rock Climbing",
  "Skiing",
  "Snowboarding",
  "Surfing",
  "Kayaking",
  "Camping Trip",
  "Travel Planning",
  "Cultural Event",
  "Festival",
  "Other",
];

interface CreateMeetupStep1ScreenProps {
  navigation: any;
  route: {
    params: {
      formData?: any;
      onUpdate: (data: any) => void;
    };
  };
}

export default function CreateMeetupStep1Screen({
  navigation,
  route,
}: CreateMeetupStep1ScreenProps) {
  const { colors } = useThemeStore();
  const { onUpdate } = route.params;

  const [formData, setFormData] = useState({
    title: route.params?.formData?.title || "",
    description: route.params?.formData?.description || "",
    activity: route.params?.formData?.activity || "",
    activityCategory: route.params?.formData?.activityCategory || "",
    coverImage: route.params?.formData?.coverImage || "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<string>("general");
  const [showActivityModal, setShowActivityModal] = useState(false);

  const updateFormData = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  const pickImage = async (type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: [ImagePicker.MediaType.Images],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      updateFormData("coverImage", result.assets[0].uri);
      setShowImageModal(false);
    }
  };

  const takePhoto = async (type: string) => {
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      updateFormData("coverImage", result.assets[0].uri);
      setShowImageModal(false);
    }
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    navigation.navigate("CreateMeetupStep2", { formData, onUpdate });
  };

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            color: colors.text,
          },
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field] as string}
        onChangeText={(text) => updateFormData(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
    </View>
  );

  const renderActivityModal = () => (
    <Modal
      visible={showActivityModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowActivityModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Activity
            </Text>
            <TouchableOpacity onPress={() => setShowActivityModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={ACTIVITY_PRESETS}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.activityItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  updateFormData("activity", item);
                  setShowActivityModal(false);
                }}
              >
                <Text style={[styles.activityText, { color: colors.text }]}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            style={styles.activityList}
          />
        </View>
      </View>
    </Modal>
  );

  const renderImageModal = () => (
    <Modal
      visible={showImageModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowImageModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add Cover Image
            </Text>
            <TouchableOpacity onPress={() => setShowImageModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.imageOptions}>
            <TouchableOpacity
              style={[
                styles.imageOption,
                { backgroundColor: colors.background },
              ]}
              onPress={() => pickImage("general")}
            >
              <Ionicons name="image-outline" size={32} color={colors.primary} />
              <Text style={[styles.imageOptionText, { color: colors.text }]}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.imageOption,
                { backgroundColor: colors.background },
              ]}
              onPress={() => takePhoto("general")}
            >
              <Ionicons
                name="camera-outline"
                size={32}
                color={colors.primary}
              />
              <Text style={[styles.imageOptionText, { color: colors.text }]}>
                Take Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
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
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepText, { color: colors.textSecondary }]}>
            Step 1 of 2
          </Text>
        </View>
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

          {/* Activity Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Activity Type *
            </Text>
            <TouchableOpacity
              style={[
                styles.selector,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowActivityModal(true)}
            >
              <Text
                style={[
                  styles.selectorText,
                  {
                    color: formData.activity
                      ? colors.text
                      : colors.textSecondary,
                  },
                ]}
              >
                {formData.activity || "Select activity type"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

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
                    color={colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.imagePlaceholderText,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Add cover image
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                formData.title.trim() && formData.description.trim()
                  ? colors.primary
                  : colors.textSecondary,
            },
          ]}
          onPress={handleNext}
          disabled={!formData.title.trim() || !formData.description.trim()}
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {renderActivityModal()}
      {renderImageModal()}
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
  stepIndicator: {
    alignItems: "center",
  },
  stepText: {
    fontSize: 12,
    fontWeight: "500",
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
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  selector: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectorText: {
    fontSize: 16,
    flex: 1,
  },
  imageSelector: {
    borderWidth: 1,
    borderRadius: 12,
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  imagePlaceholderText: {
    fontSize: 14,
    marginTop: 8,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  nextButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  activityList: {
    maxHeight: 400,
  },
  activityItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  activityText: {
    fontSize: 16,
  },
  imageOptions: {
    padding: 20,
    gap: 16,
  },
  imageOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  imageOptionText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
