/**
 * Generate avatar URL from name using ui-avatars.com
 * Takes first two letters of the name
 */
export const generateAvatarUrl = (name: string): string => {
  // Get first two letters of name (or first letter if only one word)
  const initials = name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');

  // Generate avatar URL with custom colors
  return `https://ui-avatars.com/api/?name=${initials}&color=7F9CF5&background=EBF4FF`;
};
