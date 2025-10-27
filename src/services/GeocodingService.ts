import * as Location from "expo-location";

export interface GeocodingResult {
  latitude: number;
  longitude: number;
  address: string;
  formattedAddress?: string;
}

export class GeocodingService {
  /**
   * Convert an address string to coordinates
   */
  static async geocodeAddress(
    address: string
  ): Promise<GeocodingResult | null> {
    try {
      if (!address.trim()) {
        throw new Error("Address cannot be empty");
      }

      const results = await Location.geocodeAsync(address);

      if (results.length === 0) {
        throw new Error("Address not found");
      }

      const { latitude, longitude } = results[0];

      // Reverse geocode to get a formatted address
      const reverseResults = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      const formattedAddress =
        reverseResults.length > 0
          ? this.formatAddress(reverseResults[0])
          : address;

      return {
        latitude,
        longitude,
        address: formattedAddress,
        formattedAddress,
      };
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  }

  /**
   * Convert coordinates to a formatted address
   */
  static async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<string> {
    try {
      const results = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (results.length === 0) {
        throw new Error("Address not found for coordinates");
      }

      return this.formatAddress(results[0]);
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  }

  /**
   * Validate if an address can be geocoded
   */
  static async validateAddress(address: string): Promise<boolean> {
    try {
      const result = await this.geocodeAddress(address);
      return result !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get current user location
   */
  static async getCurrentLocation(): Promise<GeocodingResult> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const address = await this.reverseGeocode(
        location.coords.latitude,
        location.coords.longitude
      );

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address,
      };
    } catch (error) {
      console.error("Get current location error:", error);
      throw error;
    }
  }

  /**
   * Format address object into a readable string
   */
  private static formatAddress(
    addressObj: Location.LocationGeocodedAddress
  ): string {
    const parts = [
      addressObj.street,
      addressObj.city,
      addressObj.region,
      addressObj.postalCode,
    ].filter(Boolean);

    return parts.join(", ");
  }

  /**
   * Calculate distance between two coordinates
   */
  static calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
