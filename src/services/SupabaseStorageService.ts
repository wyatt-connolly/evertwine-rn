import { supabase } from "../config/supabase.config";
import * as FileSystem from "expo-file-system";

export class SupabaseStorageService {
  /**
   * Upload a profile picture
   */
  static async uploadProfilePicture(
    userId: string,
    uri: string,
    index: number
  ): Promise<string> {
    const fileName = `${userId}/profile_${index}_${Date.now()}.jpg`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("profile-pictures")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Upload a post image
   */
  static async uploadPostImage(postId: string, uri: string): Promise<string> {
    const fileName = `${postId}/${Date.now()}.jpg`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("post-images")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("post-images").getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Upload multiple post images
   */
  static async uploadPostImages(
    postId: string,
    uris: string[]
  ): Promise<string[]> {
    const uploadPromises = uris.map((uri) => this.uploadPostImage(postId, uri));
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a meetup image
   */
  static async uploadMeetupImage(
    meetupId: string,
    uri: string
  ): Promise<string> {
    const fileName = `${meetupId}/${Date.now()}.jpg`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("meetup-images")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("meetup-images").getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Upload multiple meetup images
   */
  static async uploadMeetupImages(
    meetupId: string,
    uris: string[]
  ): Promise<string[]> {
    const uploadPromises = uris.map((uri) =>
      this.uploadMeetupImage(meetupId, uri)
    );
    return Promise.all(uploadPromises);
  }

  /**
   * Upload a happy hour image
   */
  static async uploadHappyHourImage(
    eventId: string,
    uri: string
  ): Promise<string> {
    const fileName = `${eventId}/${Date.now()}.jpg`;

    // Read file as base64
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convert base64 to blob
    const arrayBuffer = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

    const { error } = await supabase.storage
      .from("happy-hour-images")
      .upload(fileName, arrayBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("happy-hour-images").getPublicUrl(fileName);

    return publicUrl;
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) throw error;
  }

  /**
   * Delete multiple files from storage
   */
  static async deleteFiles(bucket: string, paths: string[]): Promise<void> {
    const { error } = await supabase.storage.from(bucket).remove(paths);

    if (error) throw error;
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(bucket: string, path: string): string {
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);
    return publicUrl;
  }

  /**
   * Delete all profile pictures for a user
   */
  static async deleteUserProfilePictures(userId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting profile pictures for user: ${userId}`);

      // List all files in the user's profile pictures folder
      const { data: files, error: listError } = await supabase.storage
        .from("profile-pictures")
        .list(userId);

      if (listError) {
        console.error("Error listing profile pictures:", listError);
        throw listError;
      }

      if (files && files.length > 0) {
        // Delete all files in the user's folder
        const filePaths = files.map((file) => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from("profile-pictures")
          .remove(filePaths);

        if (deleteError) {
          console.error("Error deleting profile pictures:", deleteError);
          throw deleteError;
        }

        console.log(
          `✅ Deleted ${files.length} profile pictures for user: ${userId}`
        );
      } else {
        console.log(`ℹ️ No profile pictures found for user: ${userId}`);
      }
    } catch (error) {
      console.error("Error in deleteUserProfilePictures:", error);
      throw error;
    }
  }

  /**
   * Delete all post images for a user
   */
  static async deleteUserPostImages(userId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting post images for user: ${userId}`);

      // List all files in the user's post images folder
      const { data: files, error: listError } = await supabase.storage
        .from("post-images")
        .list(userId);

      if (listError) {
        console.error("Error listing post images:", listError);
        throw listError;
      }

      if (files && files.length > 0) {
        // Delete all files in the user's folder
        const filePaths = files.map((file) => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from("post-images")
          .remove(filePaths);

        if (deleteError) {
          console.error("Error deleting post images:", deleteError);
          throw deleteError;
        }

        console.log(
          `✅ Deleted ${files.length} post images for user: ${userId}`
        );
      } else {
        console.log(`ℹ️ No post images found for user: ${userId}`);
      }
    } catch (error) {
      console.error("Error in deleteUserPostImages:", error);
      throw error;
    }
  }

  /**
   * Delete all meetup images for a user
   */
  static async deleteUserMeetupImages(userId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting meetup images for user: ${userId}`);

      // List all files in the user's meetup images folder
      const { data: files, error: listError } = await supabase.storage
        .from("meetup-images")
        .list(userId);

      if (listError) {
        console.error("Error listing meetup images:", listError);
        throw listError;
      }

      if (files && files.length > 0) {
        // Delete all files in the user's folder
        const filePaths = files.map((file) => `${userId}/${file.name}`);
        const { error: deleteError } = await supabase.storage
          .from("meetup-images")
          .remove(filePaths);

        if (deleteError) {
          console.error("Error deleting meetup images:", deleteError);
          throw deleteError;
        }

        console.log(
          `✅ Deleted ${files.length} meetup images for user: ${userId}`
        );
      } else {
        console.log(`ℹ️ No meetup images found for user: ${userId}`);
      }
    } catch (error) {
      console.error("Error in deleteUserMeetupImages:", error);
      throw error;
    }
  }

  /**
   * Delete all files for a user across all buckets
   */
  static async deleteAllUserFiles(userId: string): Promise<void> {
    try {
      console.log(`🗑️ Deleting all files for user: ${userId}`);

      // Delete from all storage buckets
      await Promise.all([
        this.deleteUserProfilePictures(userId),
        this.deleteUserPostImages(userId),
        this.deleteUserMeetupImages(userId),
      ]);

      console.log(`✅ Successfully deleted all files for user: ${userId}`);
    } catch (error) {
      console.error("Error in deleteAllUserFiles:", error);
      throw error;
    }
  }
}
