/**
 * Firebase App Data Filtering Utilities
 * Ensures only data from this specific app version is loaded
 */

// App version identifier - change this when you want to filter data
export const APP_VERSION = "evertwine-v2.0";
export const APP_IDENTIFIER = "evertwine-mobile-rn";
export const APP_LAUNCH_DATE = new Date("2024-09-01"); // Set your app launch date

/**
 * Check if a document belongs to this app version
 */
export function isAppDocument(docData: any): boolean {
  if (!docData) return false;

  // Check for app version field
  if (docData.appVersion === APP_VERSION) return true;

  // Check for app identifier
  if (docData.appIdentifier === APP_IDENTIFIER) return true;

  // Check for createdTime (only documents created after app launch)
  if (docData.createdTime && docData.createdTime.toDate) {
    const docDate = docData.createdTime.toDate();
    return docDate >= APP_LAUNCH_DATE;
  }

  // Check for updatedTime
  if (docData.updatedTime && docData.updatedTime.toDate) {
    const docDate = docData.updatedTime.toDate();
    return docDate >= APP_LAUNCH_DATE;
  }

  // Check for createdAt field
  if (docData.createdAt && docData.createdAt.toDate) {
    const docDate = docData.createdAt.toDate();
    return docDate >= APP_LAUNCH_DATE;
  }

  // Check for updatedAt field
  if (docData.updatedAt && docData.updatedAt.toDate) {
    const docDate = docData.updatedAt.toDate();
    return docDate >= APP_LAUNCH_DATE;
  }

  // If no version info, assume it's old data and filter out
  return false;
}

/**
 * Filter array of documents to only include app documents
 */
export function filterAppDocuments<T>(documents: T[]): T[] {
  return documents.filter((doc: any) => isAppDocument(doc));
}

/**
 * Add app version info to a document before saving
 */
export function addAppVersionInfo(docData: any): any {
  return {
    ...docData,
    appVersion: APP_VERSION,
    appIdentifier: APP_IDENTIFIER,
    createdTime: docData.createdTime || new Date(),
    updatedTime: new Date(),
  };
}

/**
 * Create a Firestore query that only gets app documents
 */
export function createAppQuery(
  collectionRef: any,
  additionalFilters: any[] = []
) {
  return collectionRef
    .where("appVersion", "==", APP_VERSION)
    .where(additionalFilters);
}

/**
 * Get app-specific user stats
 */
export function getAppUserStats(userStats: any): any {
  if (!userStats) return null;

  // Filter out old stats and only return current app stats
  if (userStats.appVersion !== APP_VERSION) {
    return {
      userId: userStats.userId,
      level: 1,
      experience: 0,
      points: 0,
      achievements: [],
      streak: 0,
      lastActive: new Date(),
      appVersion: APP_VERSION,
      appIdentifier: APP_IDENTIFIER,
    };
  }

  return userStats;
}

/**
 * Get app-specific meetups count
 */
export function getAppMeetupsCount(meetups: any[]): number {
  return filterAppDocuments(meetups).length;
}

/**
 * Get app-specific events count
 */
export function getAppEventsCount(events: any[]): number {
  return filterAppDocuments(events).length;
}

/**
 * Get app-specific connections count
 */
export function getAppConnectionsCount(connections: any[]): number {
  return filterAppDocuments(connections).length;
}

/**
 * Validate and clean Firebase data for this app
 */
export function validateAppData(data: any, dataType: string): any {
  if (!data) return null;

  switch (dataType) {
    case "user":
      return isAppDocument(data) ? data : null;
    case "meetup":
      return isAppDocument(data) ? data : null;
    case "event":
      return isAppDocument(data) ? data : null;
    case "message":
      return isAppDocument(data) ? data : null;
    case "notification":
      return isAppDocument(data) ? data : null;
    default:
      return isAppDocument(data) ? data : null;
  }
}

/**
 * Get app launch date for filtering
 */
export function getAppLaunchDate(): Date {
  return APP_LAUNCH_DATE;
}

/**
 * Check if a timestamp is from this app version
 */
export function isAppTimestamp(timestamp: any): boolean {
  if (!timestamp) return false;

  const appLaunchDate = getAppLaunchDate();
  let docDate: Date;

  if (timestamp.toDate) {
    docDate = timestamp.toDate();
  } else if (timestamp instanceof Date) {
    docDate = timestamp;
  } else {
    docDate = new Date(timestamp);
  }

  return docDate >= appLaunchDate;
}
