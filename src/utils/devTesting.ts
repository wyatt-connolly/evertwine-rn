/**
 * Development testing utilities to catch errors before they happen
 */

import { testScenarios, validateUser } from "./componentTesting";

/**
 * Test common error scenarios in development
 */
export function runDevTests() {
  console.log("🧪 Running development tests...");

  // Test user validation
  const testUsers = [
    null,
    undefined,
    {},
    { uid: "test" },
    { uid: "test", displayName: "Test" },
    testScenarios.validUser,
  ];

  testUsers.forEach((user, index) => {
    const result = validateUser(user);
    console.log(
      `User ${index}:`,
      result.isValid ? "✅ Valid" : "❌ Invalid",
      result.errors
    );
  });

  // Test safe access functions
  console.log("Testing safe access functions...");

  const testObj = {
    user: {
      profilePictures: ["https://example.com/photo.jpg"],
      standoutPhotoIndex: 0,
    },
  };

  const nullObj = null;
  const undefinedObj = undefined;

  // These should not throw errors
  try {
    console.log(
      "✅ Safe get with valid object:",
      testObj?.user?.profilePictures?.[0]
    );
    console.log(
      "✅ Safe get with null object:",
      nullObj?.user?.profilePictures?.[0]
    );
    console.log(
      "✅ Safe get with undefined object:",
      undefinedObj?.user?.profilePictures?.[0]
    );
  } catch (error) {
    console.error("❌ Safe access failed:", error);
  }

  console.log("🧪 Development tests completed");
}

/**
 * Test component with different data scenarios
 */
export function testComponentData(componentName: string, data: any) {
  console.log(`🧪 Testing ${componentName} with data:`, data);

  // Check for common issues
  const issues: string[] = [];

  if (!data) {
    issues.push("Data is null or undefined");
  } else {
    if (data.user && !data.user.profilePictures) {
      issues.push("User missing profilePictures");
    }
    if (data.user && typeof data.user.standoutPhotoIndex !== "number") {
      issues.push("User missing or invalid standoutPhotoIndex");
    }
    if (data.meetups && !Array.isArray(data.meetups)) {
      issues.push("Meetups is not an array");
    }
    if (data.notifications && !Array.isArray(data.notifications)) {
      issues.push("Notifications is not an array");
    }
  }

  if (issues.length > 0) {
    console.warn(`⚠️ ${componentName} has potential issues:`, issues);
  } else {
    console.log(`✅ ${componentName} data looks good`);
  }

  return issues;
}

/**
 * Test navigation scenarios
 */
export function testNavigation(navigation: any, route: string, params?: any) {
  console.log(`🧪 Testing navigation to ${route}`, params);

  if (!navigation) {
    console.error("❌ Navigation is null or undefined");
    return false;
  }

  if (typeof navigation.navigate !== "function") {
    console.error("❌ Navigation.navigate is not a function");
    return false;
  }

  try {
    // Don't actually navigate in tests, just validate
    console.log("✅ Navigation looks valid");
    return true;
  } catch (error) {
    console.error("❌ Navigation test failed:", error);
    return false;
  }
}

/**
 * Test Firebase data scenarios
 */
export function testFirebaseData(data: any, dataType: string) {
  console.log(`🧪 Testing Firebase ${dataType} data:`, data);

  const issues: string[] = [];

  if (!data) {
    issues.push(`${dataType} data is null or undefined`);
  } else {
    // Check for common Firebase data issues
    if (dataType === "user" && data) {
      if (!data.uid) issues.push("User missing uid");
      if (!data.displayName) issues.push("User missing displayName");
      if (!data.profilePictures || !Array.isArray(data.profilePictures)) {
        issues.push("User missing or invalid profilePictures");
      }
    }

    if (dataType === "meetups" && data) {
      if (!Array.isArray(data)) {
        issues.push("Meetups is not an array");
      } else {
        data.forEach((meetup: any, index: number) => {
          if (!meetup.id) issues.push(`Meetup ${index} missing id`);
          if (!meetup.title) issues.push(`Meetup ${index} missing title`);
        });
      }
    }
  }

  if (issues.length > 0) {
    console.warn(`⚠️ Firebase ${dataType} data has issues:`, issues);
  } else {
    console.log(`✅ Firebase ${dataType} data looks good`);
  }

  return issues;
}
