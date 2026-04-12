/**
 * Extracts a GitHub username from a raw input string.
 * Supports:
 * - Raw username (e.g., "navmaan07")
 * - Profile URL (e.g., "https://github.com/navmaan07")
 * - Profile URL with trailing slash (e.g., "https://github.com/navmaan07/")
 * - Profile URL with query params (e.g., "https://github.com/navmaan07?tab=repositories")
 * 
 * @param {string} input - The raw input from the user
 * @returns {string|null} - The extracted username or null if invalid
 */
export const extractUsername = (input) => {
  if (!input || typeof input !== 'string') return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  // Regular expression to check if it's a URL
  const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)?github\.com\/([^/?#]+)/i;
  const match = trimmed.match(urlPattern);

  if (match) {
    // It's a GitHub URL, return the username group
    return match[3];
  }

  // If it contains a protocol or domain but doesn't match GitHub pattern, it's an invalid URL
  if (trimmed.includes('://') || trimmed.includes('.')) {
    // Check if it's just a raw username with a dot (uncommon but possible)
    // Most URLs will have a '/' after the domain. 
    // If it has 'github.com' but failed the regex, or has another domain, it's invalid.
    return null; 
  }

  // Fallback: assume it's a raw username
  return trimmed;
};

/**
 * Validates if an input is either a valid GitHub username or a valid GitHub URL.
 * 
 * @param {string} input 
 * @returns {boolean}
 */
export const isValidGitHubInput = (input) => {
  const username = extractUsername(input);
  if (!username) return false;

  // Basic GitHub username validation (alphanumeric and single hyphens, 1-39 chars)
  const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
  return githubUsernameRegex.test(username);
};
