import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { SupabaseDataService } from "./SupabaseDataService";
import { useAuthStore } from "../hooks/useAuthStore";

// Configure how notifications are handled when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class PushNotificationService {
  private static expoPushToken: string | null = null;

  // ==================== INITIALIZATION ====================
  static async initialize() {
    try {
      // Request permissions
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return false;
      }

      // Get the push token
      if (Device.isDevice) {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: "your-expo-project-id", // Replace with your actual project ID
        });
        this.expoPushToken = token.data;

        // Save token to Supabase
        const { user } = useAuthStore.getState();
        if (user?.uid && this.expoPushToken) {
          await this.savePushToken(user.uid, this.expoPushToken);
        }
      } else {
        return false;
      }

      // Set up notification listeners
      this.setupNotificationListeners();

      return true;
    } catch (error) {
      return false;
    }
  }

  // ==================== TOKEN MANAGEMENT ====================
  static async savePushToken(userId: string, expoPushToken: string) {
    try {
      const deviceInfo = {
        platform: Platform.OS,
        version: Platform.Version,
        deviceName: Device.deviceName,
        deviceType: Device.deviceType,
        osName: Device.osName,
        osVersion: Device.osVersion,
      };

      await SupabaseDataService.savePushToken(
        userId,
        expoPushToken,
        deviceInfo
      );
    } catch (error) {}
  }

  static async removePushToken(userId: string, expoPushToken: string) {
    try {
      await SupabaseDataService.deactivatePushToken(userId, expoPushToken);
    } catch (error) {}
  }

  // ==================== NOTIFICATION LISTENERS ====================
  static setupNotificationListeners() {
    // Handle notifications received while app is in foreground
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        // You can show a custom in-app notification here
        this.handleForegroundNotification(notification);
      }
    );

    // Handle notification taps (when user taps on notification)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        this.handleNotificationTap(response);
      });

    // Return cleanup function
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }

  // ==================== NOTIFICATION HANDLERS ====================
  private static handleForegroundNotification(
    notification: Notifications.Notification
  ) {
    // Show in-app notification toast
    // This will be handled by the NotificationToast component
  }

  private static handleNotificationTap(
    response: Notifications.NotificationResponse
  ) {
    const data = response.notification.request.content.data;

    if (data?.deepLink) {
      // Handle deep linking
      this.handleDeepLink(data.deepLink);
    }
  }

  private static handleDeepLink(deepLink: string) {
    // Parse deep link and navigate to appropriate screen

    // Example deep link formats:
    // evertwine://post/123
    // evertwine://meetup/456
    // evertwine://chat/789
    // evertwine://profile/abc
    // evertwine://event/def

    const url = new URL(deepLink);
    const path = url.pathname;
    const segments = path.split("/");

    if (segments.length >= 2) {
      const type = segments[1]; // post, meetup, chat, profile, event
      const id = segments[2];

      // Navigate to the appropriate screen
      // This would need to be integrated with your navigation system
    }
  }

  // ==================== SCHEDULED NOTIFICATIONS ====================
  static async scheduleMeetupReminder(
    meetupId: string,
    meetupTitle: string,
    reminderTime: Date
  ) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Meetup Reminder",
          body: `"${meetupTitle}" starts soon!`,
          data: {
            meetupId,
            deepLink: `evertwine://meetup/${meetupId}`,
          },
        },
        trigger: {
          date: reminderTime,
        },
      });

      return notificationId;
    } catch (error) {}
  }

  static async scheduleHappyHourReminder(
    eventId: string,
    eventTitle: string,
    reminderTime: Date
  ) {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Happy Hour Reminder",
          body: `"${eventTitle}" starts soon!`,
          data: {
            eventId,
            deepLink: `evertwine://event/${eventId}`,
          },
        },
        trigger: {
          date: reminderTime,
        },
      });

      return notificationId;
    } catch (error) {}
  }

  // ==================== CANCEL NOTIFICATIONS ====================
  static async cancelNotification(notificationId: string) {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {}
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {}
  }

  // ==================== BADGE MANAGEMENT ====================
  static async setBadgeCount(count: number) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {}
  }

  static async clearBadge() {
    try {
      await Notifications.setBadgeCountAsync(0);
    } catch (error) {}
  }

  // ==================== PERMISSION HELPERS ====================
  static async getPermissionStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  static async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }

  static async hasPermission(): Promise<boolean> {
    const { status } = await this.getPermissionStatus();
    return status === "granted";
  }

  // ==================== UTILITY METHODS ====================
  static getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  static async refreshPushToken() {
    if (Device.isDevice) {
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: "your-expo-project-id", // Replace with your actual project ID
        });
        this.expoPushToken = token.data;

        // Update token in Supabase
        const { user } = useAuthStore.getState();
        if (user?.uid && this.expoPushToken) {
          await this.savePushToken(user.uid, this.expoPushToken);
        }

        return this.expoPushToken;
      } catch (error) {
        return null;
      }
    }
    return null;
  }

  // ==================== TESTING ====================
  static async sendTestNotification() {
    if (!this.expoPushToken) {
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Test Notification",
          body: "This is a test notification from Evertwine!",
          data: { test: true },
        },
        trigger: null, // Send immediately
      });
    } catch (error) {}
  }
}
