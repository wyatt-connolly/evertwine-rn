import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";

const AGE_RANGE_OPTIONS = [
  "18-25",
  "25-35",
  "35-45",
  "45-55",
  "55+",
  "All ages",
];

const SKILL_LEVEL_OPTIONS = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "All levels",
];

const CONNECTION_TYPE_OPTIONS = [
  "Casual",
  "Professional",
  "Networking",
  "Friendship",
  "Mentorship",
  "Any",
];

interface CreateMeetupStep3ScreenProps {
  navigation: any;
  route: {
    params: {
      formData: any;
      onUpdate: (data: any) => void;
    };
  };
}

export default function CreateMeetupStep3Screen({
  navigation,
  route,
}: CreateMeetupStep3ScreenProps) {
  const { colors } = useThemeStore();
  const { formData: initialData, onUpdate } = route.params;

  const [formData, setFormData] = useState({
    ...initialData,
    maxParticipants: initialData?.maxParticipants || "",
    ageRange: initialData?.ageRange || "",
    skillLevel: initialData?.skillLevel || "",
    connectionType: initialData?.connectionType || "casual",
    verificationRequired: initialData?.verificationRequired || false,
    cost: initialData?.cost || "",
  });

  const [showAgeRangeModal, setShowAgeRangeModal] = useState(false);
  const [showSkillLevelModal, setShowSkillLevelModal] = useState(false);
  const [showConnectionTypeModal, setShowConnectionTypeModal] = useState(false);

  const updateFormData = (field: string, value: string | boolean) => {
    const newData = { ...formData, [field]: value };
    setFormData(newData);
    onUpdate(newData);
  };

  const handleNext = () => {
    navigation.navigate("CreateMeetupStep4", { formData, onUpdate });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const renderInput = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
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
        ]}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        value={formData[field] as string}
        onChangeText={(text) => updateFormData(field, text)}
        keyboardType={keyboardType}
      />
    </View>
  );

  const renderSelector = (
    label: string,
    field: keyof typeof formData,
    placeholder: string,
    onPress: () => void,
    value?: string
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
            { color: value ? colors.text : colors.textSecondary },
          ]}
        >
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderModal = (
    visible: boolean,
    title: string,
    options: string[],
    selectedValue: string,
    onSelect: (value: string) => void,
    onClose: () => void
  ) => (
    <View style={[styles.modalOverlay, { display: visible ? "flex" : "none" }]}>
      <View style={[styles.modal, { backgroundColor: colors.surface }]}>
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
        <ScrollView style={styles.optionsList}>
          {options.map((option) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionItem,
                {
                  borderBottomColor: colors.border,
                  backgroundColor:
                    selectedValue === option
                      ? colors.primary + "20"
                      : "transparent",
                },
              ]}
              onPress={() => {
                onSelect(option);
                onClose();
              }}
            >
              <Text style={[styles.optionText, { color: colors.text }]}>
                {option}
              </Text>
              {selectedValue === option && (
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
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
        <View style={styles.stepIndicator}>
          <Text style={[styles.stepText, { color: colors.textSecondary }]}>
            Step 3 of 4
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {renderInput(
            "Max Participants",
            "maxParticipants",
            "e.g., 10",
            "numeric"
          )}
          {renderInput("Cost (optional)", "cost", "e.g., $10, Free", "default")}

          {renderSelector(
            "Age Range",
            "ageRange",
            "Select age range",
            () => setShowAgeRangeModal(true),
            formData.ageRange
          )}

          {renderSelector(
            "Skill Level",
            "skillLevel",
            "Select skill level",
            () => setShowSkillLevelModal(true),
            formData.skillLevel
          )}

          {renderSelector(
            "Connection Type",
            "connectionType",
            "Select connection type",
            () => setShowConnectionTypeModal(true),
            formData.connectionType
          )}

          {/* Verification Required Toggle */}
          <View style={styles.toggleContainer}>
            <View style={styles.toggleLabel}>
              <Text style={[styles.label, { color: colors.text }]}>
                Verification Required
              </Text>
              <Text
                style={[
                  styles.toggleDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Require identity verification to join
              </Text>
            </View>
            <Switch
              value={formData.verificationRequired}
              onValueChange={(value) =>
                updateFormData("verificationRequired", value)
              }
              trackColor={{ false: colors.border, true: colors.primary + "40" }}
              thumbColor={
                formData.verificationRequired
                  ? colors.primary
                  : colors.textSecondary
              }
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: colors.primary }]}
          onPress={handleNext}
        >
          <Text style={[styles.nextButtonText, { color: colors.onPrimary }]}>
            Next
          </Text>
        </TouchableOpacity>
      </View>

      {renderModal(
        showAgeRangeModal,
        "Select Age Range",
        AGE_RANGE_OPTIONS,
        formData.ageRange,
        (value) => updateFormData("ageRange", value),
        () => setShowAgeRangeModal(false)
      )}

      {renderModal(
        showSkillLevelModal,
        "Select Skill Level",
        SKILL_LEVEL_OPTIONS,
        formData.skillLevel,
        (value) => updateFormData("skillLevel", value),
        () => setShowSkillLevelModal(false)
      )}

      {renderModal(
        showConnectionTypeModal,
        "Select Connection Type",
        CONNECTION_TYPE_OPTIONS,
        formData.connectionType,
        (value) => updateFormData("connectionType", value),
        () => setShowConnectionTypeModal(false)
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
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  toggleLabel: {
    flex: 1,
    marginRight: 16,
  },
  toggleDescription: {
    fontSize: 14,
    marginTop: 4,
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
  optionsList: {
    maxHeight: 300,
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
});
