// Google Places API Configuration
// Get your API key from environment variables
export const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

// Validate API key
if (!GOOGLE_PLACES_API_KEY) {
  console.warn(
    "Google Places API key not configured. Please add EXPO_PUBLIC_GOOGLE_PLACES_API_KEY to your .env.local file"
  );
}

// API endpoints
export const GOOGLE_PLACES_ENDPOINTS = {
  AUTOCOMPLETE: "https://maps.googleapis.com/maps/api/place/autocomplete/json",
  DETAILS: "https://maps.googleapis.com/maps/api/place/details/json",
  NEARBY_SEARCH: "https://maps.googleapis.com/maps/api/place/nearbysearch/json",
  TEXT_SEARCH: "https://maps.googleapis.com/maps/api/place/textsearch/json",
};

// API configuration
export const GOOGLE_PLACES_CONFIG = {
  TYPES: "establishment", // Include businesses, restaurants, gyms, etc.
  COMPONENTS: "country:us", // Restrict to US locations only
  RADIUS: 50000, // 50km radius for nearby places
  LOCATION: "32.7157,-117.1611", // San Diego coordinates for bias
  STRICT_BOUNDS: false, // Allow results slightly outside bounds for better search
  // San Diego County bounds for bias (not strict filtering)
  BOUNDS: {
    northeast: { lat: 33.0, lng: -116.9 },
    southwest: { lat: 32.5, lng: -117.3 },
  },
};
