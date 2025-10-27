import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useThemeStore } from "../hooks/useThemeStore";
import { PushNotificationService } from "../services/PushNotificationService";
import AnimatedButton from "./AnimatedButton";

interface NotificationPermissionModalProps {
  visible: boolean;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
  onSkip: () => void;
}

export default function NotificationPermissionModal({
  visible,
  onPermissionGranted,
  onPermissionDenied,
  onSkip,
}: NotificationPermissionModalProps) {
  const { colors } = useThemeStore();
  const [loading, setLoading] = useState(false);

  const handleRequestPermission = async () => {
    setLoading(true);
    try {
      const permission = await PushNotificationService.requestPermissions();

      if (permission.status === "granted") {
        // Save the push token
        await PushNotificationService.refreshPushToken();
        onPermissionGranted();
      } else {
        onPermissionDenied();
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      onPermissionDenied();
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.container}>
          <View style={[styles.modal, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.primary + "20" },
                ]}
              >
                <Ionicons
                  name="notifications"
                  size={32}
                  color={colors.primary}
                />
              </View>
              <Text style={[styles.title, { color: colors.text }]}>
                Stay Connected
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Get notified about new meetups, messages, and activities from
                people you're interested in.
              </Text>
            </View>

            {/* Benefits */}
            <View style={styles.benefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="calendar" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  New meetup invitations
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="chatbubble" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  Direct messages
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="heart" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  Activity updates
                </Text>
              </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <AnimatedButton
                title={loading ? "Requesting..." : "Enable Notifications"}
                onPress={handleRequestPermission}
                variant="primary"
                disabled={loading}
                loading={loading}
                style={styles.primaryButton}
              />

              <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipButton}
                disabled={loading}
              >
                <Text
                  style={[styles.skipText, { color: colors.textSecondary }]}
                >
                  Maybe Later
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modal: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  benefits: {
    marginBottom: 32,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    marginBottom: 8,
  },
  skipButton: {
    paddingVertical: 12,
    alignItems: "center",
  },
  skipText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
