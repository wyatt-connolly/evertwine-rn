import { useState, useRef, useEffect } from "react";
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
  Animated,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import * as ImagePicker from "expo-image-picker";
import { UnsplashService } from "../../services/UnsplashService";

// Predefined activity options (same as create meetup)
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

interface EditMeetupStep1ScreenProps {
  navigation: any;
  route: {
    params: {
      meetupId: string;
      formData?: any;
      onUpdate: (data: any) => void;
    };
  };
}

export default function EditMeetupStep1Screen({
  navigation,
  route,
}: EditMeetupStep1ScreenProps) {
  const { colors } = useThemeStore();
  const { deleteMeetup } = useMeetupStore();
  const { meetupId, onUpdate } = route.params;

  const [formData, setFormData] = useState({
    title: route.params?.formData?.title || "",
    description: route.params?.formData?.description || "",
    activity: route.params?.formData?.activity || "",
    activityCategory: route.params?.formData?.activityCategory || "",
    coverImage: route.params?.formData?.coverImage || "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [suggestedImages, setSuggestedImages] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;

  // Fetch suggested images when modal opens
  useEffect(() => {
    if (showImageModal && formData.title.trim()) {
      fetchSuggestedImages();
    }
  }, [showImageModal, formData.title]);

  const updateFormData = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  // Animation functions
  const openActivityModal = () => {
    setShowActivityModal(true);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeActivityModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowActivityModal(false);
      // Reset animation values for next time
      fadeAnim.setValue(0);
      slideAnim.setValue(300);
    });
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [3, 2],
      quality: 1,
    });

    if (!result.canceled) {
      updateFormData("coverImage", result.assets[0].uri);
      setShowImageModal(false);
    }
  };

  const takePhoto = async () => {
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

  const fetchSuggestedImages = async () => {
    if (!formData.title.trim() || !UnsplashService.isConfigured()) {
      return;
    }

    setLoadingSuggestions(true);
    try {
      const images = await UnsplashService.searchImages(formData.title, 5);
      setSuggestedImages(images);
    } catch (error) {
      console.error("Error fetching suggested images:", error);
      setSuggestedImages([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const selectSuggestedImage = (image: any) => {
    updateFormData("coverImage", image.urls.regular);
    setShowImageModal(false);
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Meetup",
      "Are you sure you want to delete this meetup? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteMeetup(meetupId);
              Alert.alert("Success", "Meetup deleted successfully!", [
                {
                  text: "OK",
                  onPress: () => navigation.navigate("Home", { refresh: true }),
                },
              ]);
            } catch (error) {
              console.error("Error deleting meetup:", error);
              Alert.alert(
                "Error",
                "Failed to delete meetup. Please try again.",
                [{ text: "OK" }]
              );
            }
          },
        },
      ]
    );
  };

  const handleNext = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      return;
    }
    navigation.navigate("EditMeetupStep2", { meetupId, formData, onUpdate });
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
      animationType="none"
      onRequestClose={closeActivityModal}
    >
      <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={closeActivityModal}
        />
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Activity
            </Text>
            <TouchableOpacity onPress={closeActivityModal}>
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
                  closeActivityModal();
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
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const renderSuggestedImages = () => {
    if (!UnsplashService.isConfigured() || !formData.title.trim()) {
      return null;
    }

    return (
      <View style={styles.suggestedImagesContainer}>
        <Text style={[styles.suggestedImagesTitle, { color: colors.text }]}>
          Suggested Images
        </Text>
        {loadingSuggestions ? (
          <View style={styles.suggestedImagesLoading}>
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Finding images...
            </Text>
          </View>
        ) : suggestedImages.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.suggestedImagesScroll}
          >
            {suggestedImages.map((image) => (
              <TouchableOpacity
                key={image.id}
                style={styles.suggestedImageContainer}
                onPress={() => selectSuggestedImage(image)}
              >
                <Image
                  source={{ uri: image.urls.thumb }}
                  style={styles.suggestedImage}
                />
                <Text
                  style={[
                    styles.attributionText,
                    { color: colors.textSecondary },
                  ]}
                >
                  {UnsplashService.getAttribution(image)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}
      </View>
    );
  };

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

          <ScrollView style={styles.modalContent}>
            {renderSuggestedImages()}

            <View style={styles.imageOptions}>
              <Text style={[styles.uploadSectionTitle, { color: colors.text }]}>
                Or upload your own
              </Text>
              <TouchableOpacity
                style={[
                  styles.imageOption,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => pickImage()}
              >
                <Ionicons
                  name="image-outline"
                  size={32}
                  color={colors.primary}
                />
                <Text style={[styles.imageOptionText, { color: colors.text }]}>
                  Choose from Gallery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.imageOption,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => takePhoto()}
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
          </ScrollView>
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
        <Text style={[styles.title, { color: colors.text }]}>Edit Meetup</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="#FF6B35" />
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
              onPress={openActivityModal}
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
  modalContent: {
    maxHeight: 500,
  },
  suggestedImagesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  suggestedImagesTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  suggestedImagesLoading: {
    paddingVertical: 20,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 14,
  },
  suggestedImagesScroll: {
    marginBottom: 8,
  },
  suggestedImageContainer: {
    marginRight: 12,
    width: 120,
  },
  suggestedImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  attributionText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: "center",
  },
  uploadSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 8,
  },
});
