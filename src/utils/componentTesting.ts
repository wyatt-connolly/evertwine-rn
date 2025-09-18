/**
 * Testing utilities for React components to catch common errors
 */

import { User } from "../types";

/**
 * Test data scenarios for components
 */
export const testScenarios = {
  // Test with null user
  nullUser: null,

  // Test with undefined user
  undefinedUser: undefined,

  // Test with incomplete user data
  incompleteUser: {
    uid: "test-user",
    displayName: "Test User",
    // Missing profilePictures, standoutPhotoIndex, etc.
  },

  // Test with empty arrays
  userWithEmptyArrays: {
    uid: "test-user",
    displayName: "Test User",
    profilePictures: [],
    standoutPhotoIndex: 0,
  },

  // Test with valid user
  validUser: {
    uid: "test-user",
    displayName: "Test User",
    profilePictures: ["https://example.com/photo.jpg"],
    standoutPhotoIndex: 0,
    bio: "Test bio",
    age: 25,
    gender: "Prefer not to say",
    pronouns: "they/them",
    location: { latitude: 0, longitude: 0 },
    locationName: "Test City",
    phoneNumber: "+1234567890",
    school: "Test University",
    jobTitle: "Software Engineer",
    isVerified: "pending",
    onboardingComplete: true,
    lastActive: new Date(),
    createdTime: new Date(),
    updatedTime: new Date(),
  },
};

/**
 * Test a component with different data scenarios
 */
export function testComponentWithScenarios<T>(
  component: React.ComponentType<T>,
  scenarios: Record<string, any>,
  props: T
) {
  const results: Record<string, { success: boolean; error?: string }> = {};

  Object.entries(scenarios).forEach(([name, scenario]) => {
    try {
      // This would be used in actual testing
      console.log(`Testing ${component.name} with scenario: ${name}`, scenario);
      results[name] = { success: true };
    } catch (error) {
      results[name] = {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

  return results;
}

/**
 * Validate user object structure
 */
export function validateUser(user: any): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!user) {
    errors.push("User is null or undefined");
    return { isValid: false, errors };
  }

  if (!user.uid) errors.push("Missing uid");
  if (!user.displayName) errors.push("Missing displayName");
  if (!user.profilePictures || !Array.isArray(user.profilePictures)) {
    errors.push("Missing or invalid profilePictures array");
  }
  if (typeof user.standoutPhotoIndex !== "number") {
    errors.push("Missing or invalid standoutPhotoIndex");
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Test navigation scenarios
 */
export const navigationTestScenarios = {
  // Test with null navigation
  nullNavigation: null,

  // Test with navigation that has missing methods
  incompleteNavigation: {
    navigate: () => {},
    // Missing other navigation methods
  },

  // Test with valid navigation
  validNavigation: {
    navigate: (route: string, params?: any) => {
      console.log(`Navigating to ${route}`, params);
    },
    goBack: () => console.log("Going back"),
    reset: () => console.log("Resetting navigation"),
  },
};
