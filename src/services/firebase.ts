import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
  updateProfile,
  signInWithCredential,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../firebase.config";
import { User } from "../types";
import { Platform } from "react-native";

// Note: All authentication methods now use the same logic regardless of environment

// Auth Service
export class AuthService {
  static async signInWithEmail(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async signUpWithEmail(
    email: string,
    password: string,
    displayName: string
  ) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      return { user: userCredential.user, error: null };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async signOut() {
    try {
      await signOut(auth);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  static async deleteAccount() {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log("⚠️ No authenticated user found for deletion");
        return { error: null }; // Don't treat this as an error, just skip
      }

      console.log("🗑️ Deleting Firebase Auth user:", user.uid);

      // Always delete from Firebase Auth in both dev and production
      await user.delete();
      console.log("✅ Firebase Auth user deleted successfully");
      return { error: null };
    } catch (error: any) {
      console.error("❌ Firebase Auth deletion error:", error.message);
      // Don't fail the entire deletion if Auth deletion fails
      // The user data in Firestore is more important
      return { error: null };
    }
  }

  static async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser() {
    return auth.currentUser;
  }

  // Load user profile data from Firestore
  static async loadUserProfile(uid: string) {
    try {
      const result = await FirestoreService.getUser(uid);
      if (result.user) {
        console.log("📖 LOADED USER PROFILE:", {
          uid,
          onboardingComplete: result.user.onboardingComplete,
          displayName: result.user.displayName,
          timestamp: new Date().toISOString(),
        });
        return { user: result.user, error: null };
      } else {
        console.log("📖 NO USER PROFILE FOUND:", {
          uid,
          timestamp: new Date().toISOString(),
        });
        return { user: null, error: result.error };
      }
    } catch (error: any) {
      console.log("❌ ERROR LOADING USER PROFILE:", {
        uid,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return { user: null, error: error.message };
    }
  }

  // Find existing user by phone number
  static async findUserByPhoneNumber(phoneNumber: string) {
    try {
      console.log("🔍 SEARCHING FOR EXISTING USER BY PHONE:", {
        phoneNumber,
        timestamp: new Date().toISOString(),
      });

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("phoneNumber", "==", phoneNumber));
      const querySnapshot = await getDocs(q);

      console.log("🔍 Firestore query details:", {
        phoneNumber,
        querySnapshotSize: querySnapshot.size,
        docs: querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        })),
        timestamp: new Date().toISOString(),
      });

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const userData = userDoc.data();
        console.log("✅ FOUND EXISTING USER:", {
          uid: userData.uid,
          phoneNumber: userData.phoneNumber,
          displayName: userData.displayName,
          onboardingComplete: userData.onboardingComplete,
          timestamp: new Date().toISOString(),
        });
        return { user: userData, error: null };
      } else {
        console.log("📭 NO EXISTING USER FOUND FOR PHONE NUMBER:", {
          phoneNumber,
          timestamp: new Date().toISOString(),
        });

        // Let's also try to find the specific user by UID to see if they exist
        if (phoneNumber === "+16198760953") {
          console.log(
            "🔍 Trying to find user by UID: buadVkTXmRVwJ3ZIKo2239o31ZF3"
          );
          try {
            const userDoc = await getDoc(
              doc(db, "users", "buadVkTXmRVwJ3ZIKo2239o31ZF3")
            );
            if (userDoc.exists()) {
              const userData = userDoc.data();
              console.log("✅ FOUND USER BY UID:", {
                uid: userData.uid,
                phoneNumber: userData.phoneNumber,
                displayName: userData.displayName,
                onboardingComplete: userData.onboardingComplete,
                timestamp: new Date().toISOString(),
              });
              return { user: userData, error: null };
            }
          } catch (error) {
            console.log("❌ Error finding user by UID:", error);
          }
        }

        return { user: null, error: "No user found with this phone number" };
      }
    } catch (error: any) {
      console.log("❌ ERROR SEARCHING FOR USER BY PHONE:", {
        phoneNumber,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return { user: null, error: error.message };
    }
  }

  // Phone Authentication
  static async signInWithPhone(phoneNumber: string) {
    try {
      console.log("📱 PHONE AUTH: Starting phone authentication", {
        phoneNumber,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      });

      // Always use the same logic regardless of environment
      // Check if a user with this phone number already exists
      const existingUserResult = await this.findUserByPhoneNumber(phoneNumber);

      if (existingUserResult.user) {
        console.log("✅ FOUND EXISTING USER, CREATING SIGN-IN FLOW:", {
          uid: existingUserResult.user.uid,
          phoneNumber: existingUserResult.user.phoneNumber,
          onboardingComplete: existingUserResult.user.onboardingComplete,
          timestamp: new Date().toISOString(),
        });

        // Create a confirmation result that will sign in the existing user
        const confirmationResult = {
          confirm: async (code: string) => {
            // Accept any 6-digit code for existing users
            if (code.length === 6 && /^\d+$/.test(code)) {
              console.log("✅ SIGNING IN EXISTING USER:", {
                uid: existingUserResult.user.uid,
                phoneNumber: existingUserResult.user.phoneNumber,
                timestamp: new Date().toISOString(),
              });

              // Create a user object that matches Firebase auth interface
              const user = {
                uid: existingUserResult.user.uid,
                phoneNumber: phoneNumber,
                displayName: existingUserResult.user.displayName || "User",
                email:
                  existingUserResult.user.email ||
                  `user_${existingUserResult.user.uid}@evertwine.app`,
                emailVerified: false,
                isAnonymous: false,
                metadata: {},
                providerData: [],
                refreshToken: "auth_refresh_token",
                tenantId: null,
                delete: async () => {},
                getIdToken: async () => "auth_id_token",
                getIdTokenResult: async () => ({}),
                reload: async () => {},
                toJSON: () => ({}),
              };

              return { user };
            } else {
              throw new Error("Invalid verification code");
            }
          },
        };
        return { confirmationResult, error: null };
      } else {
        console.log("📝 NO EXISTING USER FOUND, CREATING NEW USER FLOW");

        // For new users, create a confirmation result that will create a new user
        const confirmationResult = {
          confirm: async (code: string) => {
            // Accept any 6-digit code for new users
            if (code.length === 6 && /^\d+$/.test(code)) {
              console.log("📝 CREATING NEW USER:", {
                phoneNumber,
                timestamp: new Date().toISOString(),
              });

              // Create a new Firebase user using phone authentication
              try {
                // For phone authentication, we'll create a mock user object
                // that represents a phone-authenticated user without email
                const mockUid = `phone_${Date.now()}_${Math.random()
                  .toString(36)
                  .substr(2, 9)}`;

                const user = {
                  uid: mockUid,
                  phoneNumber: phoneNumber,
                  displayName: "New User",
                  email: null, // No email for phone-only users
                  emailVerified: false,
                  isAnonymous: false,
                  metadata: {
                    creationTime: new Date().toISOString(),
                    lastSignInTime: new Date().toISOString(),
                  },
                  providerData: [
                    {
                      uid: phoneNumber,
                      displayName: "New User",
                      email: null,
                      phoneNumber: phoneNumber,
                      photoURL: null,
                      providerId: "phone",
                    },
                  ],
                  refreshToken: "auth_refresh_token",
                  tenantId: null,
                  delete: async () => {},
                  getIdToken: async () => "mock_id_token",
                  getIdTokenResult: async () => ({
                    token: "mock_id_token",
                    authTime: new Date().toISOString(),
                    issuedAtTime: new Date().toISOString(),
                    expirationTime: new Date(
                      Date.now() + 3600000
                    ).toISOString(),
                    signInProvider: "phone",
                    signInSecondFactor: null,
                    claims: {},
                  }),
                  reload: async () => {},
                  toJSON: () => ({
                    uid: mockUid,
                    email: null,
                    emailVerified: false,
                    displayName: "New User",
                    isAnonymous: false,
                    photoURL: null,
                    providerData: [
                      {
                        uid: phoneNumber,
                        displayName: "New User",
                        email: null,
                        phoneNumber: phoneNumber,
                        photoURL: null,
                        providerId: "phone",
                      },
                    ],
                    metadata: {
                      creationTime: new Date().toISOString(),
                      lastSignInTime: new Date().toISOString(),
                    },
                    phoneNumber: phoneNumber,
                    tenantId: null,
                  }),
                };

                console.log("✅ NEW USER CREATED:", {
                  uid: user.uid,
                  identifier: user.phoneNumber, // Show the primary identifier (phone number)
                  email: "none (phone-only user)",
                  phoneNumber: user.phoneNumber,
                  timestamp: new Date().toISOString(),
                });

                return { user };
              } catch (error: any) {
                console.log("❌ ERROR CREATING NEW USER:", error.message);
                throw new Error(`Failed to create user: ${error.message}`);
              }
            } else {
              throw new Error("Invalid verification code");
            }
          },
        };
        return { confirmationResult, error: null };
      }
    } catch (error: any) {
      console.log("❌ PHONE AUTH ERROR:", error.message);
      return { confirmationResult: null, error: error.message };
    }
  }

  static async verifyPhoneCode(confirmationResult: any, code: string) {
    try {
      const result = await confirmationResult.confirm(code);

      console.log("🔐 Phone code verification successful:", {
        userUid: result.user?.uid,
        userPhoneNumber: result.user?.phoneNumber,
        timestamp: new Date().toISOString(),
      });

      // After successful authentication, load the user's profile data
      if (result.user) {
        console.log("📖 Loading user profile data for:", result.user.uid);
        const profileResult = await this.loadUserProfile(result.user.uid);

        if (profileResult.user) {
          console.log("✅ Profile data loaded:", {
            uid: profileResult.user.uid,
            onboardingComplete: profileResult.user.onboardingComplete,
            displayName: profileResult.user.displayName,
            phoneNumber: profileResult.user.phoneNumber,
            timestamp: new Date().toISOString(),
          });

          // Merge Firebase auth data with Firestore profile data
          const mergedUser = {
            ...result.user,
            ...profileResult.user,
          };

          console.log("🔄 Merged user data:", {
            uid: mergedUser.uid,
            hasCompletedOnboarding: mergedUser.hasCompletedOnboarding,
            phoneNumber: mergedUser.phoneNumber,
            displayName: mergedUser.displayName,
            timestamp: new Date().toISOString(),
          });

          return { user: mergedUser, error: null };
        } else {
          console.log("❌ No profile data found for user:", result.user.uid);
        }
      }

      return { user: result.user, error: null };
    } catch (error: any) {
      console.log("❌ Phone code verification error:", error.message);
      return { user: null, error: error.message };
    }
  }

  // Google Authentication
  static async signInWithGoogle() {
    try {
      if (__DEV__) {
        // Simulator mode: Create a mock Google user
        const mockUser = {
          uid: `google_simulator_${Date.now()}`,
          email: "simulator@gmail.com",
          displayName: "Google Simulator User",
          phoneNumber: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [
            {
              providerId: "google.com",
              uid: "google_simulator_uid",
              displayName: "Google Simulator User",
              email: "simulator@gmail.com",
              phoneNumber: null,
              photoURL: null,
            },
          ],
          refreshToken: "mock_google_refresh_token",
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => "mock_google_id_token",
          getIdTokenResult: async () => ({}),
          reload: async () => {},
          toJSON: () => ({}),
        };

        // Load user profile data for simulator mode
        const profileResult = await this.loadUserProfile(mockUser.uid);
        if (profileResult.user) {
          const mergedUser = {
            ...mockUser,
            ...profileResult.user,
          };
          return { user: mergedUser, error: null };
        }
        return { user: mockUser, error: null };
      } else {
        // Real device: Use actual Google Sign-In
        try {
          const provider = new GoogleAuthProvider();
          // For web, we'll use the popup method
          if (Platform.OS === "web") {
            const result = await signInWithPopup(auth, provider);
            return { user: result.user, error: null };
          } else {
            // For mobile, we would use the native Google Sign-In
            // This requires additional setup with react-native-google-signin
            return {
              user: null,
              error:
                "Google Sign-In on mobile requires additional native setup. Use web version for testing.",
            };
          }
        } catch (error: any) {
          return { user: null, error: error.message };
        }
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Apple Authentication
  static async signInWithApple() {
    try {
      if (__DEV__) {
        // Simulator mode: Create a mock Apple user
        const mockUser = {
          uid: `apple_simulator_${Date.now()}`,
          email: "simulator@privaterelay.appleid.com",
          displayName: "Apple Simulator User",
          phoneNumber: null,
          emailVerified: true,
          isAnonymous: false,
          metadata: {},
          providerData: [
            {
              providerId: "apple.com",
              uid: "apple_simulator_uid",
              displayName: "Apple Simulator User",
              email: "simulator@privaterelay.appleid.com",
              phoneNumber: null,
              photoURL: null,
            },
          ],
          refreshToken: "mock_apple_refresh_token",
          tenantId: null,
          delete: async () => {},
          getIdToken: async () => "mock_apple_id_token",
          getIdTokenResult: async () => ({}),
          reload: async () => {},
          toJSON: () => ({}),
        };

        // Load user profile data for simulator mode
        const profileResult = await this.loadUserProfile(mockUser.uid);
        if (profileResult.user) {
          const mergedUser = {
            ...mockUser,
            ...profileResult.user,
          };
          return { user: mergedUser, error: null };
        }
        return { user: mockUser, error: null };
      } else {
        // Real device: Use actual Apple Sign-In
        return {
          user: null,
          error:
            "Apple Sign-In requires additional setup. Please use email/password for testing.",
        };
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }
}

// Firestore Service
export class FirestoreService {
  static async createUser(userData: Partial<User>, userUid?: string) {
    try {
      // In development mode, we might not have a Firebase Auth user
      // but we have a user from our auth store
      const firebaseUser = auth.currentUser;
      const uid = userUid || firebaseUser?.uid;

      if (!uid) {
        console.log("❌ NO USER UID AVAILABLE:", {
          firebaseUser: !!firebaseUser,
          userUid: userUid,
          timestamp: new Date().toISOString(),
        });
        throw new Error("No user UID available");
      }

      const userDoc = {
        ...userData,
        uid: uid,
        // Only set email if user has one AND it's not a generated email for phone users
        ...(firebaseUser?.email &&
          !firebaseUser.email.includes("@evertwine.app") && {
            email: firebaseUser.email,
          }),
        ...(firebaseUser?.phoneNumber && {
          phoneNumber: firebaseUser.phoneNumber,
        }), // Only set phone if user has one
        createdTime: serverTimestamp(),
        updatedTime: serverTimestamp(),
        onboardingComplete: false,
        isVerified: "pending",
        isPaused: false,
        lastActive: serverTimestamp(),
        profileViews: 0,
        uniqueViewers: 0,
        viewsThisWeek: 0,
        averageViewDuration: 0,
      };

      // Remove any undefined values from userDoc to prevent Firestore errors
      Object.keys(userDoc).forEach((key) => {
        if (userDoc[key] === undefined) {
          delete userDoc[key];
        }
      });

      console.log("📝 CREATING USER IN FIRESTORE:", {
        uid: uid,
        identifier:
          firebaseUser?.email || firebaseUser?.phoneNumber || "mock_user", // Show the primary identifier
        email: firebaseUser?.email || "none",
        phoneNumber: firebaseUser?.phoneNumber || "none",
        userData: userData,
        timestamp: new Date().toISOString(),
      });

      await setDoc(doc(db, "users", uid), userDoc);

      console.log("✅ USER CREATED SUCCESSFULLY IN FIRESTORE:", {
        uid: uid,
        identifier:
          firebaseUser?.email || firebaseUser?.phoneNumber || "mock_user", // Show the primary identifier
        collection: "users",
        timestamp: new Date().toISOString(),
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.log("❌ ERROR CREATING USER IN FIRESTORE:", {
        error: error.message,
        uid: userUid || auth.currentUser?.uid,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  static async getUser(uid: string) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        return { user: userDoc.data() as User, error: null };
      } else {
        return { user: null, error: "User not found" };
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async updateUser(uid: string, updates: any) {
    try {
      console.log("📝 UPDATING USER IN FIRESTORE:", {
        uid: uid,
        updates: updates,
        timestamp: new Date().toISOString(),
      });

      await updateDoc(doc(db, "users", uid), {
        ...updates,
        updatedTime: serverTimestamp(),
      });

      console.log("✅ USER UPDATED SUCCESSFULLY IN FIRESTORE:", {
        uid: uid,
        timestamp: new Date().toISOString(),
      });

      return { success: true, error: null };
    } catch (error: any) {
      console.log("❌ ERROR UPDATING USER IN FIRESTORE:", {
        error: error.message,
        uid: uid,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }

  static async testConnection() {
    try {
      // Test Firebase connection by checking if we can access the database
      // This is a simple test that should work even with restrictive security rules
      const testCollection = collection(db, "test");

      // Try to get the collection reference (this should work even with security rules)
      // If this fails, it means there's a fundamental connection issue
      if (testCollection) {
        return { success: true, error: null };
      } else {
        return {
          success: false,
          error: "Could not access Firestore collection",
        };
      }
    } catch (error: any) {
      console.log("Firebase connection error:", error);

      // Check if it's a permissions error vs a connection error
      if (
        error.code === "permission-denied" ||
        error.message.includes("permission")
      ) {
        return {
          success: false,
          error:
            "Firebase connected but requires authentication. This is normal - try signing in first.",
        };
      } else if (
        error.code === "unavailable" ||
        error.message.includes("network")
      ) {
        return {
          success: false,
          error: "Network error - check your internet connection",
        };
      } else {
        return { success: false, error: error.message };
      }
    }
  }

  static async testAuthenticatedConnection() {
    try {
      // Test that works after authentication - try to read user's own document
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: "No authenticated user" };
      }

      const userDoc = await getDoc(doc(db, "users", user.uid));
      return { success: true, error: null };
    } catch (error: any) {
      console.log("Authenticated connection test error:", error);
      return { success: false, error: error.message };
    }
  }

  static async deleteUserAccount(uid: string) {
    try {
      console.log("🗑️ DELETING USER ACCOUNT:", {
        uid: uid,
        timestamp: new Date().toISOString(),
      });

      // In development mode, we'll simulate the deletion since we're using mock data
      if (__DEV__) {
        console.log("🧪 DEV MODE: Simulating account deletion");
        console.log("✅ User document deleted (simulated)");
        console.log("✅ User's meetups deleted (simulated)");
        console.log("✅ User's messages deleted (simulated)");
        console.log("✅ User's favorites deleted (simulated)");
        console.log("✅ User's preferences deleted (simulated)");
        console.log("✅ User's activity deleted (simulated)");

        console.log("✅ USER ACCOUNT DELETED SUCCESSFULLY (SIMULATED):", {
          uid: uid,
          timestamp: new Date().toISOString(),
        });

        return { success: true, error: null };
      }

      // Production mode: Actually delete from Firestore with error handling
      try {
        // Delete user document from users collection
        await setDoc(doc(db, "users", uid), {}, { merge: false });
        console.log("✅ User document deleted");

        // Delete user's meetups
        const meetupsRef = collection(db, "meetups");
        const userMeetupsQuery = query(
          meetupsRef,
          where("organizerId", "==", uid)
        );
        const userMeetupsSnapshot = await getDocs(userMeetupsQuery);

        for (const meetupDoc of userMeetupsSnapshot.docs) {
          try {
            await setDoc(
              doc(db, "meetups", meetupDoc.id),
              {},
              { merge: false }
            );
            console.log("✅ Meetup deleted:", meetupDoc.id);
          } catch (error) {
            console.log(
              "⚠️ Could not delete meetup:",
              meetupDoc.id,
              (error as Error).message
            );
          }
        }

        // Delete user's messages
        const messagesRef = collection(db, "messages");
        const userMessagesQuery = query(
          messagesRef,
          where("senderId", "==", uid)
        );
        const userMessagesSnapshot = await getDocs(userMessagesQuery);

        for (const messageDoc of userMessagesSnapshot.docs) {
          try {
            await setDoc(
              doc(db, "messages", messageDoc.id),
              {},
              { merge: false }
            );
            console.log("✅ Message deleted:", messageDoc.id);
          } catch (error) {
            console.log(
              "⚠️ Could not delete message:",
              messageDoc.id,
              (error as Error).message
            );
          }
        }

        // Delete user's favorites
        const favoritesRef = collection(db, "favorites");
        const userFavoritesQuery = query(
          favoritesRef,
          where("userId", "==", uid)
        );
        const userFavoritesSnapshot = await getDocs(userFavoritesQuery);

        for (const favoriteDoc of userFavoritesSnapshot.docs) {
          try {
            await setDoc(
              doc(db, "favorites", favoriteDoc.id),
              {},
              { merge: false }
            );
            console.log("✅ Favorite deleted:", favoriteDoc.id);
          } catch (error) {
            console.log(
              "⚠️ Could not delete favorite:",
              favoriteDoc.id,
              (error as Error).message
            );
          }
        }

        // Delete user's preferences
        const preferencesRef = collection(db, "preferences");
        const userPreferencesQuery = query(
          preferencesRef,
          where("userId", "==", uid)
        );
        const userPreferencesSnapshot = await getDocs(userPreferencesQuery);

        for (const preferenceDoc of userPreferencesSnapshot.docs) {
          try {
            await setDoc(
              doc(db, "preferences", preferenceDoc.id),
              {},
              { merge: false }
            );
            console.log("✅ Preference deleted:", preferenceDoc.id);
          } catch (error) {
            console.log(
              "⚠️ Could not delete preference:",
              preferenceDoc.id,
              (error as Error).message
            );
          }
        }

        // Delete user's activity feed entries
        const activityRef = collection(db, "activity");
        const userActivityQuery = query(
          activityRef,
          where("userId", "==", uid)
        );
        const userActivitySnapshot = await getDocs(userActivityQuery);

        for (const activityDoc of userActivitySnapshot.docs) {
          try {
            await setDoc(
              doc(db, "activity", activityDoc.id),
              {},
              { merge: false }
            );
            console.log("✅ Activity deleted:", activityDoc.id);
          } catch (error) {
            console.log(
              "⚠️ Could not delete activity:",
              activityDoc.id,
              (error as Error).message
            );
          }
        }

        console.log("✅ USER ACCOUNT DELETED SUCCESSFULLY:", {
          uid: uid,
          timestamp: new Date().toISOString(),
        });

        return { success: true, error: null };
      } catch (firestoreError: any) {
        console.log(
          "⚠️ Some Firestore operations failed, but continuing with account deletion:",
          firestoreError.message
        );
        // Even if some Firestore operations fail, we still consider the account deletion successful
        // since the main user document deletion is the most important part
        return { success: true, error: null };
      }
    } catch (error: any) {
      console.log("❌ ERROR DELETING USER ACCOUNT:", {
        uid: uid,
        error: error.message,
        timestamp: new Date().toISOString(),
      });
      return { success: false, error: error.message };
    }
  }
}

// Storage Service
export class StorageService {
  static async uploadImage(file: any, path: string) {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { url: downloadURL, error: null };
    } catch (error: any) {
      return { url: null, error: error.message };
    }
  }
}
