/**
 * Development testing utilities to catch errors before they happen
 */

import { testScenarios, validateUser } from "./componentTesting";

/**
 * Test common error scenarios in development
 */
export function runDevTests() {

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

  });

  // Test safe access functions

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


  } catch (error) {

  }

}

/**
 * Test component with different data scenarios
 */
export function testComponentData(componentName: string, data: any) {

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

  } else {

  }

  return issues;
}

/**
 * Test navigation scenarios
 */
export function testNavigation(navigation: any, route: string, params?: any) {

  if (!navigation) {

    return false;
  }

  if (typeof navigation.navigate !== "function") {

    return false;
  }

  try {
    // Don't actually navigate in tests, just validate

    return true;
  } catch (error) {

    return false;
  }
}

/**
 * Test backend data scenarios
 */
export function testBackendData(data: any, dataType: string) {

  const issues: string[] = [];

  if (!data) {
    issues.push(`${dataType} data is null or undefined`);
  } else {
    // Check for common data issues
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

  } else {

  }

  return issues;
}
