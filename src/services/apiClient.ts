// src/services/apiClient.ts

export interface ApiBannerData {
  imageUrl: string;    // Fully qualified URL for the image
  altText?: string;     // Optional alt text from API
  linkUrl?: string;     // Optional fully qualified link URL
  originalUrl?: string; // The original relative URL from the API, for reference
  // Include any other properties from the API item you want to use
  [key: string]: any; // Allows other properties from the source item to be carried over
}

const API_BASE_URL = 'http://192.168.2.9:9999';
const BANNER_API_ENDPOINT = '/standalones/photo/details?type=1';

/**
 * Fetches banner details from the API.
 * Expects the API response to be an object with a 'data' key containing an array of items.
 * Each item in the array should have a 'url' property for the image.
 */
export async function fetchBannerDetails(): Promise<ApiBannerData[]> { // Consistently returns an array
  try {
    const response = await fetch(`${API_BASE_URL}${BANNER_API_ENDPOINT}`);

    if (!response.ok) {
      let errorDetail = '';
      try {
        const errorData = await response.json();
        errorDetail = errorData.message ? ` - ${errorData.message}` : (typeof errorData === 'string' ? ` - ${errorData}` : '');
      } catch (e) { /* Ignore if error response is not JSON */ }
      throw new Error(`HTTP error! Status: ${response.status}${errorDetail}`);
    }

    const rawApiResponse = await response.json();

    // Check if the response has a 'data' field that is an array
    if (!rawApiResponse || !Array.isArray(rawApiResponse.data)) {
      console.warn('Banner API response does not contain a "data" array or is malformed:', rawApiResponse);
      return []; // Return empty array if the expected structure isn't found
    }

    const itemsCollection: any[] = rawApiResponse.data;

    if (itemsCollection.length === 0) {
      console.warn('Banner API returned an empty collection in "data" field.');
      return [];
    }

    const processedBanners: ApiBannerData[] = itemsCollection.map(item => {
      // Ensure item is an object and has a 'url' property of type string
      if (!item || typeof item !== 'object' || typeof item.url !== 'string') {
        console.warn('Invalid banner item in collection or missing "url" string:', item);
        return null; // This item will be filtered out
      }

      // Construct the full image URL
      const fullImageUrl = item.url.startsWith('http')
        ? item.url // Already a full URL
        : `${API_BASE_URL}${item.url.startsWith('/') ? '' : '/'}${item.url}`; // Prepend baseURL

      // Process linkUrl if it exists and needs similar treatment
      let fullLinkUrl = item.linkUrl;
      if (item.linkUrl && typeof item.linkUrl === 'string' && !item.linkUrl.startsWith('http') && !item.linkUrl.startsWith('/#')) {
        fullLinkUrl = `${API_BASE_URL}${item.linkUrl.startsWith('/') ? '' : '/'}${item.linkUrl}`;
      }

      return {
        ...item, // Spread other properties from the original item (e.g., altText, title)
        imageUrl: fullImageUrl, // Override with the fully qualified URL
        linkUrl: fullLinkUrl,   // Override with processed linkUrl if it existed
        originalUrl: item.url,  // Keep the original relative URL for reference
      };
    }).filter(banner => banner !== null) as ApiBannerData[]; // Filter out any items that were invalid

    return processedBanners;

  } catch (error: any) {
    console.error('Error in fetchBannerDetails service:', error);
    if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to the API server. Please check your connection and the API endpoint.');
    }
    throw error; // Re-throw for the component to handle
  }
}