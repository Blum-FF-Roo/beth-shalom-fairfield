import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

// Generate a unique filename
function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 15);
  const extension = originalName.split('.').pop();
  return `hero-slider-${timestamp}-${randomString}.${extension}`;
}

// Upload an image to Firebase Storage
export async function uploadHeroSliderImage(file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const filename = generateUniqueFilename(file.name);
    const storageRef = ref(storage, `hero-slider/${filename}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Delete an image from Firebase Storage
export async function deleteHeroSliderImage(imageUrl: string): Promise<void> {
  try {
    // Extract the storage reference from the URL
    if (!imageUrl.includes('firebase')) {
      // Not a Firebase Storage URL, skip deletion
      return;
    }

    // Extract the file path from the Firebase Storage URL
    const url = new URL(imageUrl);
    const pathMatch = url.pathname.match(/\/o\/(.+)\?/);
    
    if (!pathMatch) {
      console.warn('Could not extract path from Firebase Storage URL:', imageUrl);
      return;
    }

    // Decode the path (Firebase encodes special characters)
    const filePath = decodeURIComponent(pathMatch[1]);
    
    // Create reference from the extracted path
    const storageRef = ref(storage, filePath);
    await deleteObject(storageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}

// Get file extension from URL
export function getFileExtensionFromUrl(url: string): string {
  try {
    const pathname = new URL(url).pathname;
    return pathname.split('.').pop() || '';
  } catch {
    return '';
  }
}

// Validate image URL
export function isValidImageUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}