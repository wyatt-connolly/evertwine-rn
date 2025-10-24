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
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";

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
      onUpdate: (data: any) => void;
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

  // Animation values for date picker
  const datePickerFadeAnim = useRef(new Animated.Value(0)).current;
  const datePickerSlideAnim = useRef(new Animated.Value(300)).current;

  const updateFormData = (field: string, value: string) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
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

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setSelectedDate(selectedDate);
      updateFormData("time", selectedDate.toISOString());
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
    if (!formData.locationName.trim() || !formData.time || !formData.duration) {
      return;
    }
    navigation.navigate("CreateMeetupStep4", { formData });
  };

  const handleBack = () => {
    navigation.goBack();
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
        value={formData[field] ? String(formData[field]) : ""}
        onChangeText={(text) => updateFormData(field, text)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

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
          {renderInput(
            "Location Name *",
            "locationName",
            "e.g., Central Park, Starbucks, etc."
          )}
          {renderInput("Address", "address", "Full address (optional)", true)}

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
          {renderInput("Max Participants", "maxParticipants", "e.g., 10")}
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
});
