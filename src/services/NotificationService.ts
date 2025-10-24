import { SupabaseDataService } from "./SupabaseDataService";
import { Notification, NotificationType } from "../types";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export class NotificationService {
  // ==================== POST INTERACTIONS ====================
  static async createPostLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string,
    senderName: string,
    postTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      postRef: postId,
      title: "New Like",
      message: `${senderName} liked your post "${postTitle}"`,
      notificationType: NotificationType.postLiked,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://post/${postId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createPostCommentNotification(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
    senderName: string,
    postTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      postRef: postId,
      commentRef: commentId,
      title: "New Comment",
      message: `${senderName} commented on your post "${postTitle}"`,
      notificationType: NotificationType.postCommented,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://post/${postId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createCommentReplyNotification(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
    senderName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      postRef: postId,
      commentRef: commentId,
      title: "New Reply",
      message: `${senderName} replied to your comment`,
      notificationType: NotificationType.commentReply,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://post/${postId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createCommentLikeNotification(
    senderId: string,
    receiverId: string,
    postId: string,
    commentId: string,
    senderName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      postRef: postId,
      commentRef: commentId,
      title: "Comment Liked",
      message: `${senderName} liked your comment`,
      notificationType: NotificationType.commentLiked,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://post/${postId}`,
        priority: "low",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== MEETUP INTERACTIONS ====================
  static async createMeetupInviteNotification(
    senderId: string,
    receiverId: string,
    meetupId: string,
    senderName: string,
    meetupTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      meetupRef: meetupId,
      title: "Meetup Invitation",
      message: `${senderName} invited you to "${meetupTitle}"`,
      notificationType: NotificationType.meetupRequest,
      actionRequired: true,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createMeetupAcceptedNotification(
    senderId: string,
    receiverId: string,
    meetupId: string,
    senderName: string,
    meetupTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      meetupRef: meetupId,
      title: "Meetup Accepted",
      message: `${senderName} accepted your invitation to "${meetupTitle}"`,
      notificationType: NotificationType.meetupAccepted,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createMeetupDeclinedNotification(
    senderId: string,
    receiverId: string,
    meetupId: string,
    senderName: string,
    meetupTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      meetupRef: meetupId,
      title: "Meetup Declined",
      message: `${senderName} declined your invitation to "${meetupTitle}"`,
      notificationType: NotificationType.meetupDeclined,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createMeetupReminderNotification(
    userId: string,
    meetupId: string,
    meetupTitle: string,
    timeUntilMeetup: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      meetupRef: meetupId,
      title: "Meetup Reminder",
      message: `"${meetupTitle}" starts ${timeUntilMeetup}`,
      notificationType: NotificationType.meetupReminder,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createMeetupStartingSoonNotification(
    userId: string,
    meetupId: string,
    meetupTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      meetupRef: meetupId,
      title: "Meetup Starting Soon",
      message: `"${meetupTitle}" starts in 30 minutes!`,
      notificationType: NotificationType.meetupStartingSoon,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createMeetupCancelledNotification(
    userId: string,
    meetupId: string,
    meetupTitle: string,
    creatorName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      meetupRef: meetupId,
      title: "Meetup Cancelled",
      message: `${creatorName} cancelled "${meetupTitle}"`,
      notificationType: NotificationType.meetupCancelled,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://meetup/${meetupId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== MESSAGE INTERACTIONS ====================
  static async createNewMessageNotification(
    senderId: string,
    receiverId: string,
    roomId: string,
    senderName: string,
    messagePreview: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      title: "New Message",
      message: `${senderName}: ${messagePreview}`,
      notificationType: NotificationType.message,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://chat/${roomId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== PROFILE INTERACTIONS ====================
  static async createProfileViewNotification(
    viewerId: string,
    profileOwnerId: string,
    viewerName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: profileOwnerId,
      senderRef: viewerId,
      title: "Profile View",
      message: `${viewerName} viewed your profile`,
      notificationType: NotificationType.profileView,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://profile/${viewerId}`,
        priority: "low",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    // Don't send push notification for profile views to avoid spam
    return createdNotification;
  }

  static async createProfileLikeNotification(
    likerId: string,
    profileOwnerId: string,
    likerName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: profileOwnerId,
      senderRef: likerId,
      title: "Profile Liked",
      message: `${likerName} liked your profile`,
      notificationType: NotificationType.profileLike,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://profile/${likerId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      profileOwnerId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== SOCIAL FEATURES ====================
  static async createFollowerNotification(
    followerId: string,
    followedId: string,
    followerName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: followedId,
      senderRef: followerId,
      title: "New Follower",
      message: `${followerName} started following you`,
      notificationType: NotificationType.newFollower,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://profile/${followerId}`,
        priority: "medium",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      followedId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== HAPPY HOUR EVENTS ====================
  static async createHappyHourInviteNotification(
    senderId: string,
    receiverId: string,
    eventId: string,
    senderName: string,
    eventTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      senderRef: senderId,
      eventRef: eventId,
      title: "Happy Hour Invitation",
      message: `${senderName} invited you to "${eventTitle}"`,
      notificationType: NotificationType.happyHourInvite,
      actionRequired: true,
      metadata: {
        deepLink: `evertwine://event/${eventId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createHappyHourStartingSoonNotification(
    userId: string,
    eventId: string,
    eventTitle: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      eventRef: eventId,
      title: "Happy Hour Starting Soon",
      message: `"${eventTitle}" starts in 30 minutes!`,
      notificationType: NotificationType.happyHourStartingSoon,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://event/${eventId}`,
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== SYSTEM NOTIFICATIONS ====================
  static async createVerificationCompleteNotification(userId: string) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      title: "Verification Complete",
      message: "Your profile has been verified!",
      notificationType: NotificationType.verificationComplete,
      actionRequired: false,
      metadata: {
        priority: "high",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  static async createNewFeatureNotification(
    userId: string,
    featureName: string
  ) {
    const notification: Partial<Notification> = {
      receiverRef: userId,
      title: "New Feature Available",
      message: `Check out the new ${featureName} feature!`,
      notificationType: NotificationType.newFeature,
      actionRequired: false,
      metadata: {
        priority: "low",
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      userId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }

  // ==================== PUSH NOTIFICATION HELPERS ====================
  static async sendPushNotification(
    userId: string,
    title: string,
    body: string,
    data?: any
  ) {
    try {
      // Get user's push tokens
      const pushTokens = await SupabaseDataService.getUserPushTokens(userId);

      if (pushTokens.length === 0) {
        console.log("No push tokens found for user:", userId);
        return;
      }

      // Send push notification to all user's devices
      const messages = pushTokens.map((token) => ({
        to: token,
        sound: "default",
        title,
        body,
        data: data || {},
      }));

      const response = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: data || {},
        },
        trigger: null, // Send immediately
      });

      console.log("Push notification sent:", response);
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }

  // ==================== BATCH NOTIFICATIONS ====================
  static async createBatchLikeNotification(
    likerIds: string[],
    receiverId: string,
    postId: string,
    postTitle: string
  ) {
    if (likerIds.length === 0) return;

    const likerNames = likerIds.slice(0, 2); // Show first 2 names
    const remainingCount = likerIds.length - 2;

    let message: string;
    if (likerIds.length === 1) {
      message = `${likerNames[0]} liked your post "${postTitle}"`;
    } else if (likerIds.length === 2) {
      message = `${likerNames[0]} and ${likerNames[1]} liked your post "${postTitle}"`;
    } else {
      message = `${likerNames[0]}, ${likerNames[1]} and ${remainingCount} others liked your post "${postTitle}"`;
    }

    const notification: Partial<Notification> = {
      receiverRef: receiverId,
      postRef: postId,
      title: "Post Liked",
      message,
      notificationType: NotificationType.postLiked,
      actionRequired: false,
      metadata: {
        deepLink: `evertwine://post/${postId}`,
        priority: "medium",
        batchData: {
          likerIds,
          count: likerIds.length,
        },
      },
    };

    const createdNotification = await SupabaseDataService.createNotification(
      notification
    );
    await this.sendPushNotification(
      receiverId,
      notification.title!,
      notification.message!
    );
    return createdNotification;
  }
}
