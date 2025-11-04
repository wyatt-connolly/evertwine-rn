import React, { useState, useRef } from "react";
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

interface CreateMeetupStep2ScreenProps {
  navigation: any;
  route: {
    params: {
      formData: any;
      onUpdate?: (data: any) => void;
    };
  };
}

export default function CreateMeetupStep2Screen({
  navigation,
  route,
}: CreateMeetupStep2ScreenProps) {
  const { colors } = useThemeStore();
  const { formData: initialData, onUpdate } = route.params;

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

  const closeDatePicker = () => {
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
  };

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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      updateFormData("time", selectedDate.toISOString());
    }
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

  const formatDuration = (minutes: string) => {
    const mins = parseInt(minutes);
    if (mins < 60) {
      return `${mins} minutes`;
    } else if (mins === 60) {
      return "1 hour";
    } else if (mins < 120) {
      return `${mins / 60} hours`;
    } else {
      const hours = Math.floor(mins / 60);
      const remainingMinutes = mins % 60;
      if (remainingMinutes === 0) {
        return `${hours} hours`;
      } else {
        return `${hours}h ${remainingMinutes}m`;
      }
    }
  };

  const handleNext = () => {
    if (!formData.address.trim() || !formData.time || !formData.duration) {
      return;
    }
    navigation.navigate("CreateMeetupStep4", { formData });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderDurationModal = () => (
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
        <ScrollView style={styles.durationList}>
          {DURATION_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.durationItem,
                {
                  borderBottomColor: colors.border,
                  backgroundColor:
                    formData.duration === option.value
                      ? colors.primary + "20"
                      : "transparent",
                },
              ]}
              onPress={() => {
                updateFormData("duration", option.value);
                setShowDurationModal(false);
              }}
            >
              <Text style={[styles.durationText, { color: colors.text }]}>
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
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>When & Where</Text>
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
          {/* Location Search Input */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Location *
            </Text>
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

          {/* Date & Time Selection */}
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

          {/* Duration Selection */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>Duration</Text>
            <TouchableOpacity
              style={[
                styles.selector,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
              onPress={() => setShowDurationModal(true)}
            >
              <Text
                style={[
                  styles.selectorText,
                  {
                    color: formData.duration
                      ? colors.text
                      : colors.textSecondary,
                  },
                ]}
              >
                {formData.duration
                  ? formatDuration(formData.duration)
                  : "Select duration"}
              </Text>
              <Ionicons
                name="chevron-down"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {/* Max Participants */}
          <View style={styles.inputContainer}>
            <Text style={[styles.label, { color: colors.text }]}>
              Max Participants
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              placeholder="e.g., 10"
              placeholderTextColor={colors.textSecondary}
              value={
                formData.maxParticipants ? String(formData.maxParticipants) : ""
              }
              onChangeText={(text) => updateFormData("maxParticipants", text)}
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor:
                formData.address.trim() && formData.time && formData.duration
                  ? colors.primary
                  : colors.textSecondary,
            },
          ]}
          onPress={handleNext}
          disabled={
            !formData.address.trim() || !formData.time || !formData.duration
          }
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="none"
        onRequestClose={closeDatePicker}
      >
        <Animated.View
          style={[styles.datePickerOverlay, { opacity: datePickerFadeAnim }]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeDatePicker}
          />
          <Animated.View
            style={[
              styles.datePickerModal,
              {
                backgroundColor: colors.surface,
                transform: [{ translateY: datePickerSlideAnim }],
              },
            ]}
          >
            <View
              style={[
                styles.datePickerHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <Text style={[styles.datePickerTitle, { color: colors.text }]}>
                Select Date & Time
              </Text>
              <TouchableOpacity onPress={closeDatePicker}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <DateTimePicker
              value={selectedDate}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
              minimumDate={new Date()}
              style={styles.datePicker}
              textColor={Platform.OS === "ios" ? "#FFFFFF" : undefined}
              themeVariant={Platform.OS === "ios" ? "dark" : undefined}
            />
            <View style={styles.datePickerFooter}>
              <TouchableOpacity
                style={[
                  styles.datePickerButton,
                  { backgroundColor: colors.primary },
                ]}
                onPress={closeDatePicker}
              >
                <Text
                  style={[
                    styles.datePickerButtonText,
                    { color: colors.onPrimary },
                  ]}
                >
                  Done
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>

      {showDurationModal && renderDurationModal()}

      {/* Map Modal */}
      <Modal
        visible={showMapModal}
        transparent={true}
        animationType="none"
        onRequestClose={closeMapModal}
      >
        <Animated.View
          style={[styles.datePickerOverlay, { opacity: mapModalFadeAnim }]}
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
              style={[
                styles.datePickerHeader,
                { borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.mapModalHeaderLeft}>
                <Ionicons name="location" size={20} color={colors.primary} />
                <Text style={[styles.datePickerTitle, { color: colors.text }]}>
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
    height: 80,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
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
  durationList: {
    maxHeight: 300,
  },
  locationSearchInput: {
    marginTop: 8,
  },
  coordinatesText: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: "italic",
  },
  durationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  durationText: {
    fontSize: 16,
  },
  datePickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  datePickerModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  datePicker: {
    height: 200,
  },
  datePickerFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  datePickerButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: "600",
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
