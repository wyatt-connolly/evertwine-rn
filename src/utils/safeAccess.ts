/**
 * Utility functions for safe property access to prevent null/undefined errors
 */

/**
 * Safely access nested object properties
 * @param obj - The object to access
 * @param path - Dot notation path (e.g., 'user.profilePictures.0')
 * @param defaultValue - Value to return if path doesn't exist
 */
export function safeGet<T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T | undefined {
  if (!obj || !path) return defaultValue;

  const keys = path.split(".");
  let current = obj;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return defaultValue;
    }
    current = current[key];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Safely access array elements
 * @param arr - The array to access
 * @param index - The index to access
 * @param defaultValue - Value to return if index doesn't exist
 */
export function safeArrayGet<T = any>(
  arr: T[] | null | undefined,
  index: number,
  defaultValue?: T
): T | undefined {
  if (!arr || !Array.isArray(arr) || index < 0 || index >= arr.length) {
    return defaultValue;
  }
  return arr[index];
}

/**
 * Safely access object property with type checking
 * @param obj - The object to access
 * @param key - The property key
 * @param defaultValue - Value to return if property doesn't exist
 */
export function safeProp<T = any>(
  obj: any,
  key: string,
  defaultValue?: T
): T | undefined {
  if (!obj || typeof obj !== "object") return defaultValue;
  return obj[key] !== undefined ? obj[key] : defaultValue;
}

/**
 * Test if a value is safe to use (not null/undefined)
 */
export function isSafe(value: any): boolean {
  return value !== null && value !== undefined;
}

/**
 * Test if an object has a specific property safely
 */
export function hasProperty(obj: any, key: string): boolean {
  return isSafe(obj) && typeof obj === "object" && key in obj;
}

/**
 * Create a safe user object with defaults
 */
export function createSafeUser(user: any): any {
  return {
    uid: user?.uid || "",
    displayName: user?.displayName || "User",
    profilePictures: user?.profilePictures || [],
    standoutPhotoIndex: user?.standoutPhotoIndex || 0,
    bio: user?.bio || "",
    age: user?.age || 25,
    gender: user?.gender || "Prefer not to say",
    pronouns: user?.pronouns || "they/them",
    location: user?.location || { latitude: 0, longitude: 0 },
    locationName: user?.locationName || "",
    phoneNumber: user?.phoneNumber || "",
    school: user?.school || "",
    jobTitle: user?.jobTitle || "",
    isVerified: user?.isVerified || "pending",
    onboardingComplete: user?.onboardingComplete || false,
    lastActive: user?.lastActive || new Date(),
    createdTime: user?.createdTime || new Date(),
    updatedTime: user?.updatedTime || new Date(),
  };
}
