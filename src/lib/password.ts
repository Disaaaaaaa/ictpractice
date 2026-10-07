export const MIN_PASSWORD_LENGTH = 8;

/** Returns an error message, or null when the new password is acceptable. */
export function validateNewPassword(password: string, confirm: string, username: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > 72) return "Use at most 72 characters.";
  if (password !== confirm) return "The two passwords do not match.";
  if (/^(\d)\1+$/.test(password) || password === "11111111" || password === "12345678") {
    return "This password is too easy to guess.";
  }
  if (password.toLowerCase().includes(username.toLowerCase())) return "Do not include your username in the password.";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "Use both letters and numbers.";
  return null;
}
