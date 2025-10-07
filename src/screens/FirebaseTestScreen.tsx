import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from "react-native";
import { AuthService, FirestoreService } from "../services/firebase";
import { Platform } from "react-native";

export default function FirebaseTestScreen() {
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("password123");
  const [user, setUser] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>("Testing...");
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    // Test Firebase connection on mount
    testFirebaseConnection();

    // Listen for auth state changes
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
      addLog(`Auth state changed: ${user ? "Signed in" : "Signed out"}`);
    });

    return unsubscribe;
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const testFirebaseConnection = async () => {
    addLog("Testing Firebase connection...");
    const result = await FirestoreService.testConnection();
    if (result.success) {
      setConnectionStatus("✅ Connected");
      addLog("Firebase connection successful");
    } else {
      if (result.error.includes("requires authentication")) {
        setConnectionStatus("🔐 Auth Required");
        addLog("Firebase connected but needs authentication - this is normal!");
        addLog("Try signing in with email/password below");
      } else {
        setConnectionStatus("❌ Failed");
        addLog(`Firebase connection failed: ${result.error}`);
      }
    }
  };

  const handleSignUp = async () => {
    addLog("Attempting to sign up...");
    const result = await AuthService.signUpWithEmail(
      email,
      password,
      "Test User"
    );
    if (result.user) {
      addLog("Sign up successful");
      Alert.alert("Success", "User created successfully!");
    } else {
      addLog(`Sign up failed: ${result.error}`);
      Alert.alert("Error", result.error);
    }
  };

  const handleSignIn = async () => {
    addLog("Attempting to sign in...");
    const result = await AuthService.signInWithEmail(email, password);
    if (result.user) {
      addLog("Sign in successful");
      Alert.alert("Success", "Signed in successfully!");
    } else {
      addLog(`Sign in failed: ${result.error}`);
      Alert.alert("Error", result.error);
    }
  };

  const handleSignOut = async () => {
    addLog("Signing out...");
    const result = await AuthService.signOut();
    if (!result.error) {
      addLog("Sign out successful");
      Alert.alert("Success", "Signed out successfully!");
    } else {
      addLog(`Sign out failed: ${result.error}`);
      Alert.alert("Error", result.error);
    }
  };



  const handleGoogleSignIn = async () => {
    addLog("Attempting Google sign in...");
    const result = await AuthService.signInWithGoogle();
    if (result.user) {
      addLog("Google sign in successful");
      Alert.alert("Success", "Google authentication successful!");
    } else {
      addLog(`Google sign in failed: ${result.error}`);
      Alert.alert("Info", result.error);
    }
  };

  const handleAppleSignIn = async () => {
    addLog("Attempting Apple sign in...");
    const result = await AuthService.signInWithApple();
    if (result.user) {
      addLog("Apple sign in successful");
      Alert.alert("Success", "Apple authentication successful!");
    } else {
      addLog(`Apple sign in failed: ${result.error}`);
      Alert.alert("Info", result.error);
    }
  };

  const handleTestAuthenticatedConnection = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in first");
      return;
    }

    addLog("Testing authenticated connection...");
    const result = await FirestoreService.testAuthenticatedConnection();
    if (result.success) {
      addLog("Authenticated connection test successful!");
      Alert.alert(
        "Success",
        "Firebase is working correctly with authentication!"
      );
    } else {
      addLog(`Authenticated connection test failed: ${result.error}`);
      Alert.alert("Error", result.error);
    }
  };

  const handleCreateUser = async () => {
    if (!user) {
      Alert.alert("Error", "Please sign in first");
      return;
    }

    addLog("Creating user document...");
    const userData = {
      displayName: "Test User",
      age: 25,
      gender: "Other",
      bio: "This is a test user created from the React Native app",
      profilePictures: [],
      location: { latitude: 37.7749, longitude: -122.4194 },
      locationName: "San Francisco, CA",
      school: "Test University",
      jobTitle: "Software Developer",
      jobCompany: "Test Company",
      professionalLevel: "Mid-level",
      hometown: "Test City",
      starSign: "Aries",
      hobbies: ["coding", "testing"],
    };

    const result = await FirestoreService.createUser(userData);
    if (result.success) {
      addLog("User document created successfully");
      Alert.alert("Success", "User document created in Firestore!");
    } else {
      addLog(`User creation failed: ${result.error}`);
      Alert.alert("Error", result.error);
    }
  };

  // Check if we're in simulator mode
  const isSimulatorMode =
    Platform.OS === "web" || (__DEV__ && Platform.OS === "ios");

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔥 Firebase Test Screen</Text>

      {isSimulatorMode && (
        <View style={styles.simulatorBanner}>
          <Text style={styles.simulatorText}>
            🧪 Simulator Mode - All auth methods work for testing!
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connection Status</Text>
        <Text style={styles.status}>{connectionStatus}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={testFirebaseConnection}
        >
          <Text style={styles.buttonText}>Test Connection</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf]}
            onPress={handleSignUp}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf]}
            onPress={handleSignIn}
          >
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {user && (
          <View style={styles.userInfo}>
            <Text style={styles.userText}>
              Signed in as: {user.email}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>


      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔐 Social Authentication</Text>
        {isSimulatorMode ? (
          <Text style={styles.simulatorNote}>
            🧪 Simulator Mode: Google and Apple sign-in work with mock users
          </Text>
        ) : (
          <Text style={styles.realDeviceNote}>
            📱 Real Device: Requires OAuth setup. Use email/password for
            testing.
          </Text>
        )}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, styles.googleButton]}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.buttonText}>
              {isSimulatorMode ? "Google (Mock)" : "Google"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonHalf, styles.appleButton]}
            onPress={handleAppleSignIn}
          >
            <Text style={styles.buttonText}>
              {isSimulatorMode ? "Apple (Mock)" : "Apple"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Firestore Test</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleTestAuthenticatedConnection}
        >
          <Text style={styles.buttonText}>Test Authenticated Connection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
          <Text style={styles.buttonText}>Create User Document</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Activity Log</Text>
        {logs.map((log, index) => (
          <Text key={index} style={styles.logText}>
            {log}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#333",
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
  status: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#00BCD4",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonHalf: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  userInfo: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
  },
  userText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#333",
  },
  logText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontFamily: "monospace",
  },
  phoneVerification: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
  },
  googleButton: {
    backgroundColor: "#4285F4",
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  simulatorBanner: {
    backgroundColor: "#e8f5e8",
    padding: 10,
    marginBottom: 20,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  simulatorText: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  simulatorNote: {
    color: "#4CAF50",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  realDeviceNote: {
    color: "#FF9800",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 10,
    textAlign: "center",
  },
  recaptchaContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f0f8ff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4CAF50",
  },
  recaptchaNote: {
    color: "#2E7D32",
    fontSize: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
  recaptchaDiv: {
    height: 78,
    width: 304,
    marginTop: 10,
    alignSelf: "center",
  },
});
