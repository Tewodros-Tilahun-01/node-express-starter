import { prisma } from '@/config/prisma';

/**
 * Generate a username from name
 * Format: cleaned name + random suffix
 */
export const generateUsername = (name: string): string => {
  // Clean name: remove special chars, spaces, convert to lowercase
  const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';

  // Add random suffix (4 digits)
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);

  return `${cleanName}${randomSuffix}`;
};

/**
 * Generate a unique username with database check
 * Keeps trying until a unique username is found
 */
export const generateUniqueUsername = async (name: string): Promise<string> => {
  let username = generateUsername(name);
  let attempts = 0;
  const maxAttempts = 10;

  // Keep generating until we find a unique username
  while (await checkUsernameExists(username)) {
    attempts++;
    if (attempts >= maxAttempts) {
      // If we've tried too many times, add timestamp
      username = `${name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}${Date.now()}`;
      break;
    }
    // Generate new username with different random suffix
    username = generateUsername(name);
  }

  return username;
};

/**
 * Check if username already exists in database
 */
const checkUsernameExists = async (username: string): Promise<boolean> => {
  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !!existing;
};
