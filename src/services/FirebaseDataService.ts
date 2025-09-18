import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase.config";
import { User, Meetup, MessageRoom, ActivityItem } from "../types";
import {
  convertFirebaseUserToUser,
  convertFirebaseMeetupToMeetup,
  convertFirebaseActivityToActivity,
} from "../utils/firebaseDataConverter";
import {
  filterAppDocuments,
  isAppDocument,
  addAppVersionInfo,
} from "../utils/firebaseAppFilter";

export class FirebaseDataService {
  // User Data Methods
  static async getUser(
    uid: string
  ): Promise<{ user: User | null; error: string | null }> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        const rawData = userDoc.data();

        // Filter out old app data
        if (!isAppDocument(rawData)) {
          return { user: null, error: "User data from old app version" };
        }

        const userData = convertFirebaseUserToUser(rawData);
        return { user: userData, error: null };
      } else {
        return { user: null, error: "User not found" };
      }
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  static async createUser(
    userData: Partial<User>,
    userUid?: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const uid = userUid || userData.uid;
      if (!uid) {
        return { success: false, error: "No user UID provided" };
      }

      // Add app version info before saving
      const appUserData = addAppVersionInfo(userData);

      const userDoc = {
        ...appUserData,
        uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        onboardingComplete: false,
        isVerified: "pending",
        isPaused: false,
        lastActive: serverTimestamp(),
        profileViews: 0,
        uniqueViewers: 0,
        viewsThisWeek: 0,
        averageViewDuration: 0,
      };

      await setDoc(doc(db, "users", uid), userDoc);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async updateUser(
    uid: string,
    updates: Partial<User>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      await updateDoc(doc(db, "users", uid), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Meetup Data Methods
  static async getMeetups(): Promise<{
    meetups: Meetup[];
    error: string | null;
  }> {
    try {
      const meetupsRef = collection(db, "meetups");
      const q = query(meetupsRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const allMeetups: any[] = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        allMeetups.push({
          id: doc.id,
          ...rawData,
        });
      });

      // Filter to only app documents
      const appMeetups = filterAppDocuments(allMeetups);

      const meetups: Meetup[] = [];
      appMeetups.forEach((meetupData) => {
        const meetup = convertFirebaseMeetupToMeetup(meetupData);
        meetups.push(meetup);
      });

      return { meetups, error: null };
    } catch (error: any) {
      return { meetups: [], error: error.message };
    }
  }

  static async createMeetup(
    meetupData: Partial<Meetup>
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const meetupDoc = {
        ...meetupData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        status: "active",
        currentParticipants: 1,
      };

      await setDoc(doc(collection(db, "meetups")), meetupDoc);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Message Data Methods
  static async getMessageRooms(
    userId: string
  ): Promise<{ rooms: MessageRoom[]; error: string | null }> {
    try {
      const roomsRef = collection(db, "messageRooms");
      const q = query(
        roomsRef,
        where("participants", "array-contains", userId),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const rooms: MessageRoom[] = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() } as MessageRoom);
      });

      return { rooms, error: null };
    } catch (error: any) {
      return { rooms: [], error: error.message };
    }
  }

  // Activity Feed Methods
  static async getActivityFeed(
    page: number = 0,
    limitCount: number = 5
  ): Promise<{ activities: ActivityItem[]; error: string | null }> {
    try {
      const activityRef = collection(db, "activity");
      const q = query(
        activityRef,
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);

      const allActivities: any[] = [];
      querySnapshot.forEach((doc) => {
        const rawData = doc.data();
        allActivities.push({
          id: doc.id,
          ...rawData,
        });
      });

      // Filter to only app documents
      const appActivities = filterAppDocuments(allActivities);

      const activities: ActivityItem[] = [];
      appActivities.forEach((activityData) => {
        const activity = convertFirebaseActivityToActivity(activityData);
        activities.push(activity);
      });

      return { activities, error: null };
    } catch (error: any) {
      return { activities: [], error: error.message };
    }
  }

  // Real-time Listeners
  static setupUserListener(
    uid: string,
    callback: (user: User | null) => void
  ): () => void {
    const userDoc = doc(db, "users", uid);

    const unsubscribe = onSnapshot(
      userDoc,
      (doc) => {
        if (doc.exists()) {
          const userData = { id: doc.id, ...doc.data() } as unknown as User;
          callback(userData);
        } else {
          callback(null);
        }
      },
      (error) => {
        console.error("User listener error:", error);
        callback(null);
      }
    );

    return unsubscribe;
  }

  static setupMeetupsListener(
    callback: (meetups: Meetup[]) => void
  ): () => void {
    const meetupsRef = collection(db, "meetups");
    const q = query(meetupsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const meetups: Meetup[] = [];
        querySnapshot.forEach((doc) => {
          meetups.push({ id: doc.id, ...doc.data() } as Meetup);
        });
        callback(meetups);
      },
      (error) => {
        console.error("Meetups listener error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  static setupMessagesListener(
    userId: string,
    callback: (rooms: MessageRoom[]) => void
  ): () => void {
    const roomsRef = collection(db, "messageRooms");
    const q = query(
      roomsRef,
      where("participants", "array-contains", userId),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const rooms: MessageRoom[] = [];
        querySnapshot.forEach((doc) => {
          rooms.push({ id: doc.id, ...doc.data() } as MessageRoom);
        });
        callback(rooms);
      },
      (error) => {
        console.error("Messages listener error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  static setupActivityListener(
    callback: (activities: ActivityItem[]) => void
  ): () => void {
    const activityRef = collection(db, "activity");
    const q = query(activityRef, orderBy("timestamp", "desc"), limit(20));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const activities: ActivityItem[] = [];
        querySnapshot.forEach((doc) => {
          activities.push({ id: doc.id, ...doc.data() } as ActivityItem);
        });
        callback(activities);
      },
      (error) => {
        console.error("Activity listener error:", error);
        callback([]);
      }
    );

    return unsubscribe;
  }

  // Data Migration Methods
  static async importFromGoogle(
    user: any
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "google",
        importedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static async importFromApple(
    user: any
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        provider: "apple",
        importedAt: serverTimestamp(),
      };

      await setDoc(doc(db, "users", user.uid), userData);
      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Data Export Methods
  static async exportUserData(
    uid: string
  ): Promise<{ data: any; error: string | null }> {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        return { data: null, error: "User not found" };
      }

      const userData = userDoc.data();

      // Get user's meetups
      const meetupsRef = collection(db, "meetups");
      const userMeetupsQuery = query(meetupsRef, where("creatorId", "==", uid));
      const meetupsSnapshot = await getDocs(userMeetupsQuery);
      const meetups = meetupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Get user's messages
      const messagesRef = collection(db, "messageRooms");
      const userMessagesQuery = query(
        messagesRef,
        where("participants", "array-contains", uid)
      );
      const messagesSnapshot = await getDocs(userMessagesQuery);
      const messages = messagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const exportData = {
        user: userData,
        meetups,
        messages,
        exportedAt: new Date().toISOString(),
      };

      return { data: exportData, error: null };
    } catch (error: any) {
      return { data: null, error: error.message };
    }
  }

  // Account Deletion
  static async deleteUserAccount(
    uid: string
  ): Promise<{ success: boolean; error: string | null }> {
    try {
      // Delete user document
      await deleteDoc(doc(db, "users", uid));

      // Delete user's meetups
      const meetupsRef = collection(db, "meetups");
      const userMeetupsQuery = query(meetupsRef, where("creatorId", "==", uid));
      const meetupsSnapshot = await getDocs(userMeetupsQuery);

      for (const meetupDoc of meetupsSnapshot.docs) {
        await deleteDoc(doc(db, "meetups", meetupDoc.id));
      }

      // Delete user's messages
      const messagesRef = collection(db, "messageRooms");
      const userMessagesQuery = query(
        messagesRef,
        where("participants", "array-contains", uid)
      );
      const messagesSnapshot = await getDocs(userMessagesQuery);

      for (const messageDoc of messagesSnapshot.docs) {
        await deleteDoc(doc(db, "messageRooms", messageDoc.id));
      }

      return { success: true, error: null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // Notifications Methods
  static async getNotifications(
    uid: string
  ): Promise<{ notifications: any[]; error: string | null }> {
    try {
      // For now, return empty notifications since we don't have notifications collection yet
      return { notifications: [], error: null };
    } catch (error: any) {
      return { notifications: [], error: error.message };
    }
  }

  // User Stats Methods
  static async getUserStats(
    uid: string
  ): Promise<{ stats: any | null; error: string | null }> {
    try {
      // For now, return null stats since we don't have stats collection yet
      return { stats: null, error: null };
    } catch (error: any) {
      return { stats: null, error: error.message };
    }
  }
}
