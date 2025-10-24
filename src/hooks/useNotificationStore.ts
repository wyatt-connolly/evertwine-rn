import { create } from "zustand";
import { Notification } from "../types";
import { SupabaseDataService } from "../services/SupabaseDataService";
import { useAuthStore } from "./useAuthStore";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  subscription: (() => void) | null;
}

interface NotificationActions {
  // Data fetching
  loadNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;

  // Real-time subscription
  startSubscription: () => void;
  stopSubscription: () => void;

  // Notification actions
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;

  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Computed values
  getUnreadCount: () => number;
  getNotificationsByType: (type: string) => Notification[];
}

type NotificationStore = NotificationState & NotificationActions;

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  subscription: null,

  // Data fetching
  loadNotifications: async () => {
    console.log("🔔 useNotificationStore: loadNotifications called");
    const { user } = useAuthStore.getState();
    console.log("🔔 useNotificationStore: user from auth store:", user?.uid);
    if (!user?.uid) {
      console.log("🔔 useNotificationStore: No user, returning early");
      return;
    }

    console.log("🔔 useNotificationStore: Setting loading state");
    set({ isLoading: true, error: null });

    try {
      console.log(
        "🔔 useNotificationStore: Fetching notifications from Supabase"
      );
      const notifications = await SupabaseDataService.getNotifications(
        user.uid
      );
      console.log(
        "🔔 useNotificationStore: Fetched notifications:",
        notifications.length
      );
      const unreadCount = notifications.filter((n) => !n.isRead).length;
      console.log("🔔 useNotificationStore: Unread count:", unreadCount);

      set({
        notifications,
        unreadCount,
        isLoading: false,
      });
      console.log(
        "🔔 useNotificationStore: State updated successfully - this might trigger re-render"
      );
    } catch (error) {
      console.error(
        "🔔 useNotificationStore: Error loading notifications:",
        error
      );
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to load notifications",
        isLoading: false,
      });
    }
  },

  refreshNotifications: async () => {
    await get().loadNotifications();
  },

  // Real-time subscription
  startSubscription: () => {
    console.log("🔔 useNotificationStore: startSubscription called");
    const { user } = useAuthStore.getState();
    console.log("🔔 useNotificationStore: user for subscription:", user?.uid);
    if (!user?.uid) {
      console.log(
        "🔔 useNotificationStore: No user for subscription, returning"
      );
      return;
    }

    console.log("🔔 useNotificationStore: Stopping existing subscription");
    // Stop existing subscription if any
    get().stopSubscription();

    console.log(
      "🔔 useNotificationStore: Setting up new notification listener"
    );
    const subscription = SupabaseDataService.setupNotificationListener(
      user.uid,
      (notifications) => {
        console.log(
          "🔔 useNotificationStore: Real-time notification received:",
          notifications.length
        );
        const unreadCount = notifications.filter((n) => !n.isRead).length;
        console.log(
          "🔔 useNotificationStore: Setting state from real-time update - this might trigger re-render"
        );
        set({ notifications, unreadCount });
      }
    );

    set({ subscription });
    console.log("🔔 useNotificationStore: Subscription set successfully");
  },

  stopSubscription: () => {
    console.log("🔔 useNotificationStore: stopSubscription called");
    const { subscription } = get();
    if (subscription) {
      console.log("🔔 useNotificationStore: Unsubscribing from notifications");
      subscription();
      set({ subscription: null });
    } else {
      console.log("🔔 useNotificationStore: No active subscription to stop");
    }
  },

  // Notification actions
  markAsRead: async (notificationId: string) => {
    try {
      await SupabaseDataService.markNotificationAsRead(notificationId);

      // Optimistically update local state
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("Error marking notification as read:", error);
      set({ error: "Failed to mark notification as read" });
    }
  },

  markAllAsRead: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.uid) return;

    try {
      await SupabaseDataService.markAllNotificationsAsRead(user.uid);

      // Optimistically update local state
      set((state) => ({
        notifications: state.notifications.map((n) => ({
          ...n,
          isRead: true,
          readAt: new Date(),
        })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      set({ error: "Failed to mark all notifications as read" });
    }
  },

  deleteNotification: async (notificationId: string) => {
    try {
      await SupabaseDataService.deleteNotification(notificationId);

      // Optimistically update local state
      set((state) => {
        const notification = state.notifications.find(
          (n) => n.id === notificationId
        );
        const wasUnread = notification && !notification.isRead;

        return {
          notifications: state.notifications.filter(
            (n) => n.id !== notificationId
          ),
          unreadCount: wasUnread
            ? Math.max(0, state.unreadCount - 1)
            : state.unreadCount,
        };
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      set({ error: "Failed to delete notification" });
    }
  },

  // State management
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  // Computed values
  getUnreadCount: () => {
    return get().notifications.filter((n) => !n.isRead).length;
  },

  getNotificationsByType: (type: string) => {
    return get().notifications.filter((n) => n.notificationType === type);
  },
}));

// Note: Auto-initialization is handled by individual components
// to avoid hooks violations at module level
