interface UnsplashImage {
  id: string;
  urls: {
    small: string;
    regular: string;
    thumb: string;
  };
  alt_description?: string;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashResponse {
  results: UnsplashImage[];
  total: number;
  total_pages: number;
}

export class UnsplashService {
  private static readonly API_BASE = "https://api.unsplash.com";
  private static readonly ACCESS_KEY =
    "76pHSqE8phIx0BPYO5qJ3ikiVyuZ7qJuRauB1PhGI4o"; // Your actual API key

  /**
   * Extract keywords from meetup title and activity type for image search
   */
  private static extractKeywords(title: string, activityType?: string): string {
    if (!title || title.trim().length === 0) {
      return "";
    }

    // Common words to filter out
    const stopWords = new Set([
      "with",
      "and",
      "for",
      "the",
      "a",
      "an",
      "in",
      "on",
      "at",
      "to",
      "of",
      "is",
      "are",
      "was",
      "were",
      "be",
      "been",
      "being",
      "have",
      "has",
      "had",
      "do",
      "does",
      "did",
      "will",
      "would",
      "could",
      "should",
      "may",
      "might",
      "must",
      "can",
      "shall",
      "friends",
      "people",
      "group",
      "team",
      "club",
      "meetup",
      "event",
      "activity",
      "session",
      "class",
      "workshop",
      "meeting",
      "gathering",
      "party",
      "celebration",
    ]);

    // Combine title and activity type for better search results
    const combinedText = activityType ? `${title} ${activityType}` : title;

    // Extract meaningful words
    const words = combinedText
      .toLowerCase()
      .replace(/[^\w\s]/g, " ") // Remove punctuation
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));

    // Return the first few meaningful words as search query
    return words.slice(0, 3).join(" ");
  }

  /**
   * Search for images on Unsplash based on meetup title and activity type
   */
  static async searchImages(
    title: string,
    count: number = 5,
    activityType?: string
  ): Promise<UnsplashImage[]> {
    try {
      const keywords = this.extractKeywords(title, activityType);

      if (!keywords) {
        console.log("No meaningful keywords extracted from title");
        return [];
      }

      console.log(`Searching Unsplash for: "${keywords}"`);

      const response = await fetch(
        `${this.API_BASE}/search/photos?query=${encodeURIComponent(
          keywords
        )}&per_page=${count}&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${this.ACCESS_KEY}`,
            "Accept-Version": "v1",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Unsplash API error: ${response.status} ${response.statusText}`
        );
      }

      const data: UnsplashResponse = await response.json();

      console.log(`Found ${data.results.length} images for "${keywords}"`);

      return data.results.map((image) => ({
        id: image.id,
        urls: {
          small: image.urls.small,
          regular: image.urls.regular,
          thumb: image.urls.thumb,
        },
        alt_description: image.alt_description,
        user: {
          name: image.user.name,
          username: image.user.username,
        },
        links: {
          html: image.links.html,
        },
      }));
    } catch (error) {
      console.error("Error fetching images from Unsplash:", error);
      return [];
    }
  }

  /**
   * Get attribution text for an image
   */
  static getAttribution(image: UnsplashImage): string {
    return `Photo by ${image.user.name} on Unsplash`;
  }

  /**
   * Check if API key is configured
   */
  static isConfigured(): boolean {
    console.log(
      "🔑 Unsplash API Key:",
      this.ACCESS_KEY.substring(0, 10) + "..."
    );
    return this.ACCESS_KEY !== "YOUR_UNSPLASH_ACCESS_KEY";
  }
}
