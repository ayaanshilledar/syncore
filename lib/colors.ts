export const SOLID_CURSOR_COLORS = [
  "#3B82F6", // Electric Blue
  "#10B981", // Emerald Green
  "#F59E0B", // Vivid Amber
  "#EC4899", // Magenta Pink
  "#8B5CF6", // Royal Purple
  "#06B6D4", // Bright Cyan
  "#F97316", // Sunset Orange
  "#E11D48", // Crimson Rose
  "#14B8A6", // Vibrant Teal
  "#84CC16", // Lime Green
  "#6366F1", // Indigo
  "#D946EF", // Fuchsia
];

/**
 * Returns a deterministic solid color from the curated palette based on a user/guest ID,
 * or a random solid color if no ID is provided.
 */
export function getSolidColor(seed?: string | null): string {
  if (!seed) {
    return SOLID_CURSOR_COLORS[Math.floor(Math.random() * SOLID_CURSOR_COLORS.length)];
  }
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % SOLID_CURSOR_COLORS.length;
  return SOLID_CURSOR_COLORS[index];
}
