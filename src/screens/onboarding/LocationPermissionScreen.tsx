import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StackNavigationProp } from "@react-navigation/stack";
import { OnboardingStackParamList } from "../../navigation/OnboardingStack";
// import { FirestoreService } from "../../services/firebase"; // Removed Firebase
import { useAuthStore } from "../../hooks/useAuthStore";
import { useThemeStore } from "../../hooks/useThemeStore";
import GradientBackground from "../../components/GradientBackground";
import AnimatedButton from "../../components/AnimatedButton";
import AnimatedCard from "../../components/AnimatedCard";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";

type LocationPermissionScreenNavigationProp = StackNavigationProp<
  OnboardingStackParamList,
  "LocationPermission"
>;

interface Props {
  navigation: LocationPermissionScreenNavigationProp;
}

export default function LocationPermissionScreen({ navigation }: Props) {
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, updateUserProfile } = useAuthStore();
  const { colors } = useThemeStore();

  const requestLocationPermission = async () => {
    setLoading(true);

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        setPermissionGranted(true);

        try {
          const location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.Balanced,
          });

          const locationData = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          };

          updateUserProfile({
            location: locationData,
          });

          if (user?.uid) {
            await FirestoreService.updateUser(user.uid, {
              location: locationData,
            });
          }

          Alert.alert(
            "Location Access Granted",
            "Great! We can now show you nearby meetups and events.",
            [{ text: "Continue", onPress: handleContinue }]
          );
        } catch (locationError) {
          console.error("Error getting location:", locationError);
          Alert.alert(
            "Location Error",
            "We got permission but couldn't get your current location. You can still use the app and set your location manually.",
            [{ text: "Continue", onPress: handleContinue }]
          );
        }
      } else {
        Alert.alert(
          "Location Permission Denied",
          "You can still use Evertwine, but we won't be able to show you nearby meetups. You can enable location access later in your device settings.",
          [
            { text: "Skip", onPress: handleSkip },
            { text: "Try Again", onPress: () => setLoading(false) },
          ]
        );
      }
    } catch (error) {
      console.error("Location permission error:", error);
      Alert.alert(
        "Error",
        "Something went wrong while requesting location permission. Please try again.",
        [{ text: "OK", onPress: () => setLoading(false) }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigation.navigate("OnboardingComplete");
  };

  const handleSkip = () => {
    navigation.navigate("OnboardingComplete");
  };

  return (
    <GradientBackground variant="primary">
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.content}>
          <AnimatedCard delay={200} direction="up">
            <View style={styles.iconContainer}>
              <Ionicons name="location" size={80} color={colors.primary} />
            </View>

            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.text }]}>
                Enable Location Services
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Allow Evertwine to access your location to show you nearby
                meetups and events
              </Text>
            </View>
          </AnimatedCard>

          <AnimatedCard delay={400} direction="up">
            <View style={styles.benefits}>
              <View style={styles.benefitItem}>
                <Ionicons name="people" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  Find meetups near you
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="map" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  Discover local events
                </Text>
              </View>
              <View style={styles.benefitItem}>
                <Ionicons name="time" size={20} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>
                  Get location-based recommendations
                </Text>
              </View>
            </View>
          </AnimatedCard>

          <View style={styles.buttonContainer}>
            <AnimatedButton
              title={loading ? "Requesting..." : "Allow Location Access"}
              onPress={requestLocationPermission}
              variant="primary"
              disabled={loading}
              loading={loading}
              style={styles.button}
            />

            <AnimatedButton
              title="Skip for Now"
              onPress={handleSkip}
              variant="secondary"
              disabled={loading}
              style={styles.button}
            />
          </View>

          <AnimatedCard delay={600} direction="up">
            <Text style={[styles.privacyText, { color: colors.textSecondary }]}>
              Your location data is only used to show you relevant meetups and
              is never shared with other users without your permission.
            </Text>
          </AnimatedCard>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    justifyContent: "space-between",
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  benefits: {
    marginBottom: 20,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  benefitText: {
    fontSize: 16,
    marginLeft: 12,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    marginBottom: 16,
  },
  privacyText: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});
