import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  ScrollView,
} from "react-native";
import { SupabaseAuthService, SupabaseDataService } from "../services/supabase";

export default function TestScreen() {
  const [phoneNumber, setPhoneNumber] = useState("+1234567890");
  const [verificationCode, setVerificationCode] = useState("123456");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationId, setVerificationId] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testPhoneAuth = async () => {
    setLoading(true);
    try {
      console.log("🧪 TESTING PHONE AUTH...");
      const result = await SupabaseAuthService.signInWithPhone(phoneNumber);

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      setVerificationId(result.confirmationResult);
      setIsCodeSent(true);
      Alert.alert(
        "Success",
        "Verification code sent! Use any 6-digit code to test."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to send verification code");
      console.error("Phone auth error:", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!verificationId) {
      Alert.alert("Error", "No verification ID available");
      return;
    }

    setLoading(true);
    try {
      console.log("🧪 TESTING CODE VERIFICATION...");
      const result = await SupabaseAuthService.verifyPhoneOTP(
        verificationId,
        verificationCode
      );

      if (result.error) {
        Alert.alert("Error", result.error);
        return;
      }

      console.log("🧪 TESTING USER CREATION IN SUPABASE...");
      const userData = {
        displayName: "Test User",
        bio: "This is a test user created from the test screen",
        phoneNumber: result.user.phoneNumber,
      };

      const createResult = await SupabaseDataService.createUser(userData);

      if (createResult.error) {
        Alert.alert("Error", `Failed to create user: ${createResult.error}`);
        return;
      }

      Alert.alert(
        "Success!",
        `User created successfully!\n\nUID: ${result.user.uid}\nEmail: ${result.user.email}\nPhone: ${result.user.phoneNumber}\n\nCheck Supabase Dashboard to see the user!`
      );

      // Reset form
      setIsCodeSent(false);
      setVerificationId(null);
      setVerificationCode("123456");
    } catch (error) {
      Alert.alert("Error", "Failed to verify code");
      console.error("Verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    setLoading(true);
    try {
      console.log("🧪 TESTING SUPABASE CONNECTION...");
      const result = await SupabaseDataService.testConnection();

      if (result.success) {
        Alert.alert("Success", "Supabase connection is working!");
      } else {
        Alert.alert("Error", result.error || "Connection failed");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to test connection");
      console.error("Connection test error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Supabase Test Screen</Text>
      <Text style={styles.subtitle}>
        This screen helps you test Supabase authentication and database
        integration. Check the console logs for detailed information.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Test Supabase Connection</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={testSupabaseConnection}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Test Phone Authentication</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Phone number"
          keyboardType="phone-pad"
        />

        {!isCodeSent ? (
          <TouchableOpacity
            style={styles.button}
            onPress={testPhoneAuth}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Send Verification Code</Text>
          </TouchableOpacity>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={verificationCode}
              onChangeText={setVerificationCode}
              placeholder="Verification code (use any 6 digits)"
              keyboardType="number-pad"
              maxLength={6}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={verifyCode}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Verify Code & Create User</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instructions:</Text>
        <Text style={styles.instruction}>
          • Click "Test Connection" to verify Supabase is working
        </Text>
        <Text style={styles.instruction}>
          • Enter any phone number and click "Send Verification Code"
        </Text>
        <Text style={styles.instruction}>
          • Use any 6-digit code (like 123456) to verify
        </Text>
        <Text style={styles.instruction}>
          • The app will create a REAL Supabase user and save it to the database
        </Text>
        <Text style={styles.instruction}>
          • Check your Supabase Dashboard to see the created user
        </Text>
        <Text style={styles.instruction}>
          • Watch the console logs for detailed information
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#666",
    lineHeight: 22,
  },
  section: {
    backgroundColor: "white",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#00BCD4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  instruction: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
});
