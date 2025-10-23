import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../../hooks/useThemeStore";
import Constants from "expo-constants";

export default function HelpSupportScreen({ navigation }: any) {
  const { colors } = useThemeStore();
  const [appVersion] = useState(Constants.expoConfig?.version || "1.0.0");

  const handleEmailSupport = async () => {
    try {
      const emailUrl =
        "mailto:support@evertwine.com?subject=Evertwine Support Request";
      const canOpen = await Linking.canOpenURL(emailUrl);

      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          "Email Not Available",
          "Please contact us at support@evertwine.com",
          [
            {
              text: "Copy Email",
              onPress: () => {
                // In a real app, you'd copy to clipboard here
                Alert.alert("Email Copied", "support@evertwine.com");
              },
            },
            { text: "OK" },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  const handleReportBug = async () => {
    try {
      const emailUrl =
        "mailto:support@evertwine.com?subject=Bug Report - Evertwine App";
      const canOpen = await Linking.canOpenURL(emailUrl);

      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          "Email Not Available",
          "Please send bug reports to support@evertwine.com",
          [
            {
              text: "Copy Email",
              onPress: () => {
                Alert.alert("Email Copied", "support@evertwine.com");
              },
            },
            { text: "OK" },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  const handleSendFeedback = async () => {
    try {
      const emailUrl =
        "mailto:support@evertwine.com?subject=Feedback - Evertwine App";
      const canOpen = await Linking.canOpenURL(emailUrl);

      if (canOpen) {
        await Linking.openURL(emailUrl);
      } else {
        Alert.alert(
          "Email Not Available",
          "Please send feedback to support@evertwine.com",
          [
            {
              text: "Copy Email",
              onPress: () => {
                Alert.alert("Email Copied", "support@evertwine.com");
              },
            },
            { text: "OK" },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open email client");
    }
  };

  const handleAbout = () => {
    Alert.alert(
      "About Evertwine",
      `Version ${appVersion}\n\nEvertwine helps you connect with people who share your interests through amazing meetups.\n\n© 2025 Evertwine. All rights reserved.`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>
          Help & Support
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Contact Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Contact Support
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleEmailSupport}
          >
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Email Support
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                support@evertwine.com
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Resources Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            App Information
          </Text>

          <View style={[styles.menuItem, { borderBottomColor: colors.border }]}>
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                App Version
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                {appVersion}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleAbout}
          >
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                About Evertwine
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                Learn more about our app
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
        </View>

        {/* Feedback Section */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Feedback
          </Text>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={handleReportBug}
          >
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Report a Bug
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                Help us improve the app
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={handleSendFeedback}
          >
            <View style={styles.menuItemText}>
              <Text style={[styles.menuText, { color: colors.text }]}>
                Send Feedback
              </Text>
              <Text
                style={[styles.menuSubtext, { color: colors.textSecondary }]}
              >
                Share your thoughts with us
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.textTertiary}
            />
          </TouchableOpacity>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    borderRadius: 12,
    marginBottom: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuItemText: {
    flex: 1,
  },
  menuText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  menuSubtext: {
    fontSize: 14,
  },
});
