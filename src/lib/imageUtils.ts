
/**
 * Utilities for handling image uploads and processing
 */

// Maximum file size in bytes (5MB)
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Supported image formats
export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg", 
  "image/jpg", 
  "image/png", 
  "image/webp"
];

// Supported image formats as string for file input
export const ACCEPTED_IMAGE_EXTENSIONS = ".jpg,.jpeg,.png,.webp";

/**
 * Convert a File object to a Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Check if the file size is within limits
 */
export const isValidFileSize = (file: File): boolean => {
  return file.size <= MAX_FILE_SIZE;
};

/**
 * Check if the file type is supported
 */
export const isValidFileType = (file: File): boolean => {
  return ACCEPTED_IMAGE_TYPES.includes(file.type);
};

/**
 * Get a placeholder image URL based on the event category
 */
export const getCategoryPlaceholderImage = (category: string): string => {
  const placeholders: Record<string, string> = {
    "Tecnologia": "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop",
    "Música": "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop",
    "Arte": "https://images.unsplash.com/photo-1531243420551-511623338314?q=80&w=2070&auto=format&fit=crop",
    "Networking": "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop",
    "Gastronomia": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2187&auto=format&fit=crop",
    "Esportes": "https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=2049&auto=format&fit=crop"
  };
  
  return placeholders[category] || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop";
};
