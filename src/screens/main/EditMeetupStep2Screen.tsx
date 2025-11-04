import { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  Modal,
  Animated,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from "react-native-maps";
import { useThemeStore } from "../../hooks/useThemeStore";
import LocationSearchInput from "../../components/LocationSearchInput";

const DURATION_OPTIONS = [
  { label: "30 minutes", value: "30" },
  { label: "1 hour", value: "60" },
  { label: "1.5 hours", value: "90" },
  { label: "2 hours", value: "120" },
  { label: "3 hours", value: "180" },
  { label: "4 hours", value: "240" },
  { label: "Half day (4+ hours)", value: "300" },
  { label: "Full day (8+ hours)", value: "480" },
];

const AGE_RANGE_OPTIONS = [
  "18-25",
  "25-35",
  "35-45",
  "45-55",
  "55+",
  "All ages",
];

interface EditMeetupStep2ScreenProps {
  navigation: any;
  route: {
    params: {
      meetupId: string;
      formData: any;
      onUpdate?: (data: any) => void;
    };
  };
}

export default function EditMeetupStep2Screen({
  navigation,
  route,
}: EditMeetupStep2ScreenProps) {
  const { colors } = useThemeStore();
  const { meetupId, formData: initialData, onUpdate } = route.params;

  const [formData, setFormData] = useState({
    ...initialData,
    locationName: initialData?.locationName || "",
    address: initialData?.address || "",
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    time: initialData?.time || "",
    duration: initialData?.duration || "",
    maxParticipants: initialData?.maxParticipants || "",
    ageRange: initialData?.ageRange || "",
    verificationRequired: initialData?.verificationRequired || false,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    initialData?.time ? new Date(initialData.time) : new Date()
  );
  const [showDurationModal, setShowDurationModal] = useState(false);
  const [showAgeRangeModal, setShowAgeRangeModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Animation values for date picker
  const datePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const datePickerSlideAnim = useRef(new Animated.Value(300)).current;

  // Animation values for map modal
  const mapModalFadeAnim = useRef(new Animated.Value(0)).current;
  const mapModalSlideAnim = useRef(new Animated.Value(500)).current;

  const updateFormData = (field: string, value: any) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate?.(newData);
  };

  // Animation functions for date picker
  const openDatePicker = () => {
    setShowDatePicker(true);
    Animated.parallel([
      Animated.timing(datePickerFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(datePickerSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDatePicker = () =>
    Animated.parallel([
      Animated.timing(datePickerFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(datePickerSlideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowDatePicker(false);
      // Reset animation values for next time
      datePickerFadeAnim.setValue(0);
      datePickerSlideAnim.setValue(300);
    });

  // Animation functions for map modal
  const openMapModal = () => {
    setShowMapModal(true);
    Animated.parallel([
      Animated.timing(mapModalFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(mapModalSlideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeMapModal = () => {
    Animated.parallel([
      Animated.timing(mapModalFadeAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(mapModalSlideAnim, {
        toValue: 500,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowMapModal(false);
      // Reset animation values for next time
      mapModalFadeAnim.setValue(0);
      mapModalSlideAnim.setValue(500);
    });
  };

  const formatDateTime = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;

    return `${day}, ${month} ${dayNum}, ${year} at ${hours}:${minutesStr} ${ampm}`;
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      updateFormData("time", selectedDate.toISOString());
    }
  };

  const handleNext = () => {
    if (!formData.locationName.trim() || !formData.time || !formData.duration) {
      return;
    }
    navigation.navigate("EditMeetupStep4", { meetupId, formData, onUpdate });
  };

  const handleBack = () => {
    navigation.goBack();
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
            borderColor: colors.border,
            color: colors.text,
          },
          multiline && styles.multilineInput,
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={String(formData[field] || "")}
        onChangeText={(value) => updateFormData(field as string, value)}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderSelector = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    onPress: () => void
  ) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.selector,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
        onPress={onPress}
      >
        <Text
          style={[
            styles.selectorText,
            {
              color: formData[field] ? colors.text : colors.textSecondary,
            },
          ]}
        >
          {formData[field] || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderDatePickerModal = () => (
    <Modal
      visible={showDatePicker}
      transparent={true}
      animationType="none"
      onRequestClose={closeDatePicker}
    >
      <Animated.View
        style={[styles.modalOverlay, { opacity: datePickerFadeAnim }]}
      >
        <TouchableOpacity
          style={StyleSheet.absoluteFillObject}
          activeOpacity={1}
          onPress={closeDatePicker}
        />
        <Animated.View
          style={[
            styles.modal,
            {
              backgroundColor: colors.surface,
              transform: [{ translateY: datePickerSlideAnim }],
            },
          ]}
        >
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Date & Time
            </Text>
            <TouchableOpacity onPress={closeDatePicker}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
              textColor={Platform.OS === "ios" ? "#FFFFFF" : undefined}
              themeVariant={Platform.OS === "ios" ? "dark" : undefined}
            />
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  const renderDurationModal = () => (
    <Modal
      visible={showDurationModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowDurationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Duration
            </Text>
            <TouchableOpacity onPress={() => setShowDurationModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {DURATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionItem,
                  {
                    backgroundColor:
                      formData.duration === option.value
                        ? colors.primary + "20"
                        : "transparent",
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => {
                  updateFormData("duration", option.value);
                  setShowDurationModal(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        formData.duration === option.value
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {formData.duration === option.value && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  const renderAgeRangeModal = () => (
    <Modal
      visible={showAgeRangeModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowAgeRangeModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          <View
            style={[styles.modalHeader, { borderBottomColor: colors.border }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Select Age Range
            </Text>
            <TouchableOpacity onPress={() => setShowAgeRangeModal(false)}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.optionsList}>
            {AGE_RANGE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  {
                    backgroundColor:
                      formData.ageRange === option
                        ? colors.primary + "20"
                        : "transparent",
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={() => {
                  updateFormData("ageRange", option);
                  setShowAgeRangeModal(false);
                }}
              >
                <Text
                  style={[
                    styles.optionText,
                    {
                      color:
                        formData.ageRange === option
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {option}
                </Text>
                {formData.ageRange === option && (
                  <Ionicons name="checkmark" size={20} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
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
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Edit Meetup</Text>
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepText, { color: colors.textSecondary }]}>
            Step 2 of 2
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderInput(
            "Location *",
            "locationName",
            "Where will it take place?"
          )}
          {/* Location Search Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Location</Text>
            <LocationSearchInput
              value={formData.locationName || formData.address}
              onChangeText={(text) => {
                // Batch all updates together when clearing
                if (!text.trim()) {
                  const newData = {
                    ...formData,
                    address: "",
                    locationName: "",
                    latitude: null,
                    longitude: null,
                  };
                  setFormData(newData);
                  onUpdate(newData);
                } else {
                  // Update locationName when user is typing
                  updateFormData("locationName", text);
                }
              }}
              onPlaceSelect={(place) => {
                // Use the description as locationName (it's already the place name from the API)
                const locationName = place.description.split(",")[0]; // Get first part before comma for safety
                const newData = {
                  ...formData,
                  locationName: locationName,
                  address: place.address,
                  latitude: place.latitude,
                  longitude: place.longitude,
                };
                setFormData(newData);
                onUpdate(newData);
              }}
              placeholder="Search for a location..."
              style={styles.locationSearchInput}
            />
            {formData.latitude && formData.longitude && (
              <TouchableOpacity
                style={[
                  styles.mapPreviewContainer,
                  { borderColor: colors.border },
                ]}
                activeOpacity={0.8}
                onPress={openMapModal}
              >
                <View
                  style={[
                    styles.mapPreviewHeader,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <View style={styles.mapPreviewHeaderLeft}>
                    <Ionicons
                      name="location"
                      size={16}
                      color={colors.primary}
                    />
                    <Text
                      style={[styles.mapPreviewLabel, { color: colors.text }]}
                    >
                      {formData.locationName || "Selected Location"}
                    </Text>
                  </View>
                  <Ionicons
                    name="expand-outline"
                    size={18}
                    color={colors.textSecondary}
                  />
                </View>
                <MapView
                  key={`map-${formData.latitude}-${formData.longitude}`}
                  style={styles.mapPreview}
                  initialRegion={{
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  toolbarEnabled={false}
                  loadingEnabled={true}
                >
                  <Marker
                    key={`marker-${formData.latitude}-${formData.longitude}`}
                    coordinate={{
                      latitude: formData.latitude,
                      longitude: formData.longitude,
                    }}
                    title={formData.locationName}
                    description={formData.address}
                    pinColor="red"
                  />
                </MapView>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Date & Time *
            </Text>
            <TouchableOpacity
              style={[
                styles.selector,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={openDatePicker}
            >
              <Text
                style={[
                  styles.selectorText,
                  { color: formData.time ? colors.text : colors.textSecondary },
                ]}
              >
                {formData.time
                  ? formatDateTime(selectedDate)
                  : "Select date and time"}
              </Text>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {renderSelector(
            "Duration *",
            "duration",
            "How long will it last?",
            () => setShowDurationModal(true)
          )}

          {renderInput(
            "Max Participants",
            "maxParticipants",
            "10",
            false,
            "numeric"
          )}

          {renderSelector("Age Range", "ageRange", "Select age range", () =>
            setShowAgeRangeModal(true)
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                formData.locationName.trim() &&
                formData.time &&
                formData.duration
                  ? colors.primary
                  : colors.textSecondary,
            },
          ]}
          onPress={handleNext}
          disabled={
            !formData.locationName.trim() ||
            !formData.time ||
            !formData.duration
          }
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {renderDatePickerModal()}
      {renderDurationModal()}
      {renderAgeRangeModal()}

      {/* Map Modal */}
      <Modal
        visible={showMapModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeMapModal}
      >
        <Animated.View
          style={[styles.modalOverlay, { opacity: mapModalFadeAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeMapModal}
          />
          <Animated.View
            style={[
              styles.mapModal,
              {
                backgroundColor: colors.surface,
                transform: [{ translateY: mapModalSlideAnim }],
              },
            ]}
          >
            <View
              style={[styles.modalHeader, { borderBottomColor: colors.border }]}
            >
              <View style={styles.mapModalHeaderLeft}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={[styles.modalTitle, { color: colors.text }]}>
                  {formData.locationName || "Selected Location"}
                </Text>
              </View>
              <TouchableOpacity onPress={closeMapModal}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            {formData.address && (
              <View
                style={[
                  styles.mapModalAddressContainer,
                  { borderBottomColor: colors.border },
                ]}
              >
                <Text
                  style={[
                    styles.mapModalAddress,
                    { color: colors.textSecondary },
                  ]}
                >
                  {formData.address}
                </Text>
              </View>
            )}
            <View style={styles.mapModalContent}>
              <MapView
                key={`map-modal-${formData.latitude}-${formData.longitude}`}
                style={styles.mapModalMap}
                initialRegion={{
                  latitude: formData.latitude,
                  longitude: formData.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={true}
                rotateEnabled={true}
                toolbarEnabled={false}
                loadingEnabled={true}
              >
                <Marker
                  key={`marker-modal-${formData.latitude}-${formData.longitude}`}
                  coordinate={{
                    latitude: formData.latitude,
                    longitude: formData.longitude,
                  }}
                  title={formData.locationName}
                  description={formData.address}
                  pinColor="red"
                />
              </MapView>
            </View>
          </Animated.View>
        </Animated.View>
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
  datePickerContainer: {
    padding: 20,
    alignItems: "center",
  },
  optionsList: {
    maxHeight: 400,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
  },
  locationSearchInput: {
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  mapPreviewContainer: {
    marginTop: 12,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  mapPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  mapPreviewHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  mapPreviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  mapPreview: {
    height: 120,
    width: "100%",
  },
  mapModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
    height: "80%",
  },
  mapModalHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  mapModalAddressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  mapModalAddress: {
    fontSize: 14,
  },
  mapModalContent: {
    flex: 1,
    overflow: "hidden",
  },
  mapModalMap: {
    flex: 1,
    width: "100%",
  },
});
