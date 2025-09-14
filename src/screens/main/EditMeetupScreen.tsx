import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import { useMeetupStore } from "../../hooks/useMeetupStore";

export default function EditMeetupScreen({ navigation, route }: any) {
  const { meetupId } = route.params;
  const { colors } = useThemeStore();
  const { getMeetup, updateMeetup, deleteMeetup } = useMeetupStore();

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
  });

  useEffect(() => {
    const meetup = getMeetup(meetupId);
    if (meetup) {
      setFormData({
        title: meetup.title,
        description: meetup.description,
        locationName: meetup.locationName,
        address: meetup.address,
        activity: meetup.activity,
        activityCategory: meetup.activityCategory,
        tags: meetup.tags.join(", "),
        maxParticipants: meetup.maxParticipants.toString(),
        time: meetup.time.toISOString(),
        duration: meetup.duration.toString(),
        isRecurring: meetup.isRecurring,
        verificationRequired: meetup.requirements.verificationRequired,
      });
    }
  }, [meetupId, getMeetup]);

  const handleSave = () => {
    if (!formData.title || !formData.description || !formData.locationName) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const updates = {
      title: formData.title,
      description: formData.description,
      locationName: formData.locationName,
      address: formData.address,
      activity: formData.activity,
      activityCategory: formData.activityCategory,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag),
      maxParticipants: parseInt(formData.maxParticipants) || 10,
      duration: parseInt(formData.duration),
      time: formData.time ? new Date(formData.time) : new Date(),
      isRecurring: formData.isRecurring,
      requirements: {
        verificationRequired: formData.verificationRequired,
      },
    };

    updateMeetup(meetupId, updates);
    Alert.alert("Success", "Meetup updated successfully!", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);
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
          onPress: () => {
            deleteMeetup(meetupId);
            navigation.goBack();
          },
        },
      ]
    );
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
        <Text style={[styles.title, { color: colors.text }]}>Edit Meetup</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={20} color="#FF4444" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSave}>
            <Text style={[styles.saveButton, { color: colors.primary }]}>
              Save
            </Text>
          </TouchableOpacity>
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
});
