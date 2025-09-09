/**
 * Utility functions for handling image data (Buffer and base64)
 */

const BACKEND_URL = 'http://localhost:3000';

/**
 * Get image URL for Buffer-based images stored in database
 * @param userId - The user ID to fetch image for
 * @returns Full URL to the image endpoint
 */
export function getImageUrl(userId: string | undefined | null): string {
  if (!userId || typeof userId !== 'string') return '';
  return `${BACKEND_URL}/users/${userId}/profile/image`;
}

/**
 * Convert base64 string to data URL for display
 * @param base64 - Base64 encoded image string
 * @param contentType - MIME type of the image
 * @returns Data URL for image display
 */
export function base64ToDataUrl(base64: string, contentType: string = 'image/jpeg'): string {
  return `data:${contentType};base64,${base64}`;
}

/**
 * Check if user has a profile image
 * @param userId - The user ID to check
 * @returns Whether the user ID is valid for image fetching
 */
export function isValidImageUrl(userId: string | undefined | null): boolean {
  return Boolean(userId && typeof userId === 'string' && userId.trim() !== '');
}
