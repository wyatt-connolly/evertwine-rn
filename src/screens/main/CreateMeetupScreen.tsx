import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";

export default function CreateMeetupScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [formData, setFormData] = useState({});

  const handleUpdate = (data: any) => {
    setFormData(data);
  };

  const handleStart = () => {
    navigation.navigate("CreateMeetupStep1", {
      formData: {},
      onUpdate: handleUpdate,
    });
  };

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
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.welcomeContainer}>
          <Ionicons name="people-outline" size={64} color={colors.primary} />
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>
            Create Your Meetup
          </Text>
          <Text
            style={[styles.welcomeDescription, { color: colors.textSecondary }]}
          >
            We'll guide you through creating your meetup in just a few simple
            steps.
          </Text>
        </View>

        <View style={styles.stepsContainer}>
          <View style={styles.stepItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.stepNumberText, { color: colors.onPrimary }]}
              >
                1
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                Basic Info
              </Text>
              <Text
                style={[
                  styles.stepDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Title, description, activity type, and cover image
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.stepNumberText, { color: colors.onPrimary }]}
              >
                2
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                When & Where
              </Text>
              <Text
                style={[
                  styles.stepDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Date, time, duration, and location details
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.stepNumberText, { color: colors.onPrimary }]}
              >
                3
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                Settings
              </Text>
              <Text
                style={[
                  styles.stepDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Participants, age range, requirements, and preferences
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View
              style={[styles.stepNumber, { backgroundColor: colors.primary }]}
            >
              <Text
                style={[styles.stepNumberText, { color: colors.onPrimary }]}
              >
                4
              </Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>
                Review & Publish
              </Text>
              <Text
                style={[
                  styles.stepDescription,
                  { color: colors.textSecondary },
                ]}
              >
                Review all details and publish your meetup
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={handleStart}
        >
          <Text style={[styles.startButtonText, { color: colors.onPrimary }]}>
            Get Started
          </Text>
          <Ionicons name="arrow-forward" size={20} color={colors.onPrimary} />
        </TouchableOpacity>
      </View>
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
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeDescription: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  stepsContainer: {
    gap: 24,
  },
  stepItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
