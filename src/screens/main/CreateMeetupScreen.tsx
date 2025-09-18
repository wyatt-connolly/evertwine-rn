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
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";
import * as ImagePicker from "expo-image-picker";

// Predefined options for quick selection
const ACTIVITY_PRESETS = [
  // Business & Networking
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

  // Social & Friendship
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
  "Cooking Class",
  "Wine Tasting",
  "Photography Walk",
  "Book Club",
  "Language Exchange",
  "Volunteering",
  "Farmers Market",
  "Shopping Spree",

  // Dating & Romance
  "Romantic Dinner",
  "Sunset Walk",
  "Wine Bar Date",
  "Art Gallery Date",
  "Cooking Class Date",
  "Dance Class",
  "Concert Date",
  "Beach Sunset",
  "Picnic Date",
  "Museum Date",
  "Coffee Date",
  "Brunch Date",
  "Hiking Date",
  "Boat Ride",
  "Spa Day",
  "Comedy Show Date",

  // Fitness & Wellness
  "Yoga Session",
  "Gym Workout",
  "Running Group",
  "Cycling Tour",
  "Tennis Match",
  "Basketball Game",
  "Soccer Match",
  "Volleyball",
  "Swimming",
  "Rock Climbing",
  "Pilates Class",
  "Meditation Group",
  "Hiking Group",
  "Dance Fitness",
  "Boxing Class",
  "CrossFit",
];

const CATEGORY_PRESETS = [
  "Business & Networking",
  "Dating & Romance",
  "Social & Friendship",
  "Fitness & Wellness",
  "Food & Drink",
  "Arts & Culture",
  "Sports & Recreation",
  "Learning & Education",
  "Professional Development",
  "Volunteering & Community",
  "Outdoor & Adventure",
  "Entertainment & Nightlife",
  "Technology & Innovation",
  "Health & Wellness",
  "Travel & Exploration",
  "Creative & Hobbies",
];

const DURATION_PRESETS = [
  { label: "30 minutes", value: 30 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
  { label: "3 hours", value: 180 },
  { label: "Half day (4 hours)", value: 240 },
  { label: "Full day (8 hours)", value: 480 },
];

const PARTICIPANT_PRESETS = [
  { label: "2-4 people", value: 4 },
  { label: "5-8 people", value: 8 },
  { label: "10-15 people", value: 15 },
  { label: "20-30 people", value: 30 },
  { label: "50+ people", value: 50 },
];

const POPULAR_LOCATIONS = [
  "Golden Gate Park",
  "Mission District",
  "SOMA",
  "Marina District",
  "Castro District",
  "Haight-Ashbury",
  "North Beach",
  "Chinatown",
  "Financial District",
  "Union Square",
  "Fisherman's Wharf",
  "Presidio",
];

const AGE_RANGE_PRESETS = [
  { label: "18-25", value: "18-25" },
  { label: "21-30", value: "21-30" },
  { label: "25-35", value: "25-35" },
  { label: "30-40", value: "30-40" },
  { label: "35-45", value: "35-45" },
  { label: "40-50", value: "40-50" },
  { label: "50+", value: "50+" },
  { label: "All ages", value: "all" },
];

const SKILL_LEVEL_PRESETS = [
  { label: "Beginner", value: "beginner" },
  { label: "Intermediate", value: "intermediate" },
  { label: "Advanced", value: "advanced" },
  { label: "All levels", value: "all" },
];

const CONNECTION_TYPE_PRESETS = [
  { label: "Business Networking", value: "business" },
  { label: "Professional Development", value: "professional" },
  { label: "Dating & Romance", value: "dating" },
  { label: "Friendship & Social", value: "friendship" },
  { label: "Casual Meetup", value: "casual" },
  { label: "Mentorship", value: "mentorship" },
  { label: "Collaboration", value: "collaboration" },
  { label: "Learning & Education", value: "learning" },
];

const RECURRING_PRESETS = [
  { label: "One-time event", value: "none" },
  { label: "Daily", value: "daily" },
  { label: "Weekly", value: "weekly" },
  { label: "Bi-weekly", value: "biweekly" },
  { label: "Monthly", value: "monthly" },
];

const INDUSTRY_PRESETS = [
  "Technology",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Marketing & Advertising",
  "Real Estate",
  "Legal",
  "Consulting",
  "Startups & Entrepreneurship",
  "Non-Profit",
  "Government",
  "Media & Entertainment",
  "Retail & E-commerce",
  "Manufacturing",
  "Energy & Utilities",
  "Transportation",
  "All Industries",
];

const DRESS_CODE_PRESETS = [
  { label: "Casual", value: "casual" },
  { label: "Business Casual", value: "business_casual" },
  { label: "Business Formal", value: "business_formal" },
  { label: "Smart Casual", value: "smart_casual" },
  { label: "Cocktail Attire", value: "cocktail" },
  { label: "Formal", value: "formal" },
  { label: "Athletic Wear", value: "athletic" },
  { label: "No Dress Code", value: "none" },
];

const COST_PRESETS = [
  { label: "Free", value: "free" },
  { label: "Under $10", value: "under_10" },
  { label: "$10-25", value: "10_25" },
  { label: "$25-50", value: "25_50" },
  { label: "$50-100", value: "50_100" },
  { label: "$100+", value: "over_100" },
  { label: "Pay at venue", value: "pay_venue" },
];

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
    ageRange: "",
    skillLevel: "",
    connectionType: "casual",
    recurringPattern: undefined,
    industry: "",
    dressCode: "",
    cost: "",
    isRecurring: false,
    verificationRequired: false,
    coverImage: "",
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageType, setSelectedImageType] = useState<string>("general");
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showParticipantsModal, setShowParticipantsModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showAgeRangeModal, setShowAgeRangeModal] = useState(false);
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [showConnectionTypeModal, setShowConnectionTypeModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showIndustryModal, setShowIndustryModal] = useState(false);
  const [showDressCodeModal, setShowDressCodeModal] = useState(false);
  const [showCostModal, setShowCostModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes === 60) {
      return "1 hour";
    } else if (minutes < 120) {
      return `${minutes / 60} hours`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      if (remainingMinutes === 0) {
        return `${hours} hours`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const formatDateTime = (date: Date) => {
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      updateFormData("time", selectedDate.toISOString());
    }
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

  const renderSelectionButton = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    onPress: () => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selectionButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.selectionButtonText,
            {
              color: formData[field] ? colors.text : colors.textTertiary,
            },
          ]}
        >
          {formData[field] || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textTertiary} />
      </TouchableOpacity>
    </View>
  );

  const renderSelectionModal = (
    visible: boolean,
    title: string,
    data: any[],
    onSelect: (item: any) => void,
    onClose: () => void,
    renderItem: (item: any) => React.ReactNode
  ) => (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[styles.modalContent, { backgroundColor: colors.surface }]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.selectionItem,
                  { borderBottomColor: colors.border },
                ]}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                {renderItem(item)}
              </TouchableOpacity>
            )}
          />
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

          {renderSelectionButton(
            "Location *",
            "locationName",
            "Select a popular location",
            () => setShowLocationModal(true)
          )}
          {renderInput("Address", "address", "Full address (optional)")}
          {renderSelectionButton(
            "Activity *",
            "activity",
            "Choose an activity",
            () => setShowActivityModal(true)
          )}
          {renderSelectionButton(
            "Category *",
            "activityCategory",
            "Select a category",
            () => setShowCategoryModal(true)
          )}
          {renderInput("Tags", "tags", "Comma-separated tags (optional)")}
          {renderSelectionButton(
            "Max Participants",
            "maxParticipants",
            "Choose group size",
            () => setShowParticipantsModal(true)
          )}
          {renderSelectionButton(
            "Date & Time",
            "time",
            "Select date and time",
            () => setShowDatePicker(true)
          )}
          {renderSelectionButton(
            "Duration",
            "duration",
            formData.duration
              ? formatDuration(parseInt(formData.duration))
              : "Select duration",
            () => setShowDurationModal(true)
          )}

          <View style={styles.divider} />

          {/* Additional Meetup Features */}
          {renderSelectionButton(
            "Age Range",
            "ageRange",
            "Select age range",
            () => setShowAgeRangeModal(true)
          )}
          {renderSelectionButton(
            "Skill Level",
            "skillLevel",
            "Select skill level",
            () => setShowSkillLevelModal(true)
          )}
          {renderSelectionButton(
            "Connection Type",
            "connectionType",
            "Select connection type",
            () => setShowConnectionTypeModal(true)
          )}
          {renderSelectionButton(
            "Recurring",
            "recurringPattern",
            "Select recurrence",
            () => setShowRecurringModal(true)
          )}

          <View style={styles.divider} />

          {/* Professional & Business Features */}
          {renderSelectionButton(
            "Industry Focus",
            "industry",
            "Select target industry",
            () => setShowIndustryModal(true)
          )}
          {renderSelectionButton(
            "Dress Code",
            "dressCode",
            "Select dress code",
            () => setShowDressCodeModal(true)
          )}
          {renderSelectionButton(
            "Cost Range",
            "cost",
            "Select cost range",
            () => setShowCostModal(true)
          )}

          <View style={styles.divider} />

          {/* Safety & Verification */}
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

      {/* Activity Selection Modal */}
      {renderSelectionModal(
        showActivityModal,
        "Select Activity",
        ACTIVITY_PRESETS,
        (activity) => updateFormData("activity", activity),
        () => setShowActivityModal(false),
        (activity) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {activity}
          </Text>
        )
      )}

      {/* Category Selection Modal */}
      {renderSelectionModal(
        showCategoryModal,
        "Select Category",
        CATEGORY_PRESETS,
        (category) => updateFormData("activityCategory", category),
        () => setShowCategoryModal(false),
        (category) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {category}
          </Text>
        )
      )}

      {/* Duration Selection Modal */}
      {renderSelectionModal(
        showDurationModal,
        "Select Duration",
        DURATION_PRESETS,
        (duration) => updateFormData("duration", duration.value.toString()),
        () => setShowDurationModal(false),
        (duration) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {duration.label}
          </Text>
        )
      )}

      {/* Participants Selection Modal */}
      {renderSelectionModal(
        showParticipantsModal,
        "Select Group Size",
        PARTICIPANT_PRESETS,
        (participants) =>
          updateFormData("maxParticipants", participants.value.toString()),
        () => setShowParticipantsModal(false),
        (participants) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {participants.label}
          </Text>
        )
      )}

      {/* Location Selection Modal */}
      {renderSelectionModal(
        showLocationModal,
        "Select Location",
        POPULAR_LOCATIONS,
        (location) => updateFormData("locationName", location),
        () => setShowLocationModal(false),
        (location) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {location}
          </Text>
        )
      )}

      {/* Age Range Selection Modal */}
      {renderSelectionModal(
        showAgeRangeModal,
        "Select Age Range",
        AGE_RANGE_PRESETS,
        (ageRange) => updateFormData("ageRange", ageRange.value),
        () => setShowAgeRangeModal(false),
        (ageRange) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {ageRange.label}
          </Text>
        )
      )}

      {/* Skill Level Selection Modal */}
      {renderSelectionModal(
        showSkillLevelModal,
        "Select Skill Level",
        SKILL_LEVEL_PRESETS,
        (skillLevel) => updateFormData("skillLevel", skillLevel.value),
        () => setShowSkillLevelModal(false),
        (skillLevel) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {skillLevel.label}
          </Text>
        )
      )}

      {/* Connection Type Selection Modal */}
      {renderSelectionModal(
        showConnectionTypeModal,
        "Select Connection Type",
        CONNECTION_TYPE_PRESETS,
        (connectionType) =>
          updateFormData("connectionType", connectionType.value),
        () => setShowConnectionTypeModal(false),
        (connectionType) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {connectionType.label}
          </Text>
        )
      )}

      {/* Recurring Selection Modal */}
      {renderSelectionModal(
        showRecurringModal,
        "Select Recurrence",
        RECURRING_PRESETS,
        (recurring) => updateFormData("recurringPattern", recurring.value),
        () => setShowRecurringModal(false),
        (recurring) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {recurring.label}
          </Text>
        )
      )}

      {/* Industry Selection Modal */}
      {renderSelectionModal(
        showIndustryModal,
        "Select Industry Focus",
        INDUSTRY_PRESETS,
        (industry) => updateFormData("industry", industry),
        () => setShowIndustryModal(false),
        (industry) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {industry}
          </Text>
        )
      )}

      {/* Dress Code Selection Modal */}
      {renderSelectionModal(
        showDressCodeModal,
        "Select Dress Code",
        DRESS_CODE_PRESETS,
        (dressCode) => updateFormData("dressCode", dressCode.value),
        () => setShowDressCodeModal(false),
        (dressCode) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {dressCode.label}
          </Text>
        )
      )}

      {/* Cost Selection Modal */}
      {renderSelectionModal(
        showCostModal,
        "Select Cost Range",
        COST_PRESETS,
        (cost) => updateFormData("cost", cost.value),
        () => setShowCostModal(false),
        (cost) => (
          <Text style={[styles.selectionItemText, { color: colors.text }]}>
            {cost.label}
          </Text>
        )
      )}

      {/* Date Time Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="datetime"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          minimumDate={new Date()}
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
  // Selection Button Styles
  selectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  selectionButtonText: {
    fontSize: 16,
    flex: 1,
  },
  selectionItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
  selectionItemText: {
    fontSize: 16,
  },
});
