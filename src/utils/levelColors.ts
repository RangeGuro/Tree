/**
 * Returns the color and gradient for a given percent progress (0-100).
 * If percent is 100, returns diamond; if >=80 emerald, >=60 sapphire, >=40 gold, >=20 silver, >0 bronze.
 */
export function getColorForPercent(percent: number): { color: string, gradient?: string } {
  if (percent >= 100) return { color: "#b9f2ff", gradient: "diamond" };    // Diamond
  if (percent >= 80)  return { color: "#50c878", gradient: "emerald" };    // Emerald
  if (percent >= 60)  return { color: "#0f52ba", gradient: "sapphire" };   // Sapphire
  if (percent >= 40)  return { color: "#ffd700", gradient: "gold" };       // Gold
  if (percent >= 20)  return { color: "#c0c0c0", gradient: "silver" };     // Silver
  if (percent > 0)    return { color: "#cd7f32", gradient: "bronze" };     // Bronze
  return { color: "#eee" };
}

/**
 * Returns the color and gradient for a given absolute level.
 */
export function getColorForLevel(level: number): { color: string, gradient?: string } {
  if (level >= 20) return { color: "#b9f2ff", gradient: "diamond" };
  if (level >= 16) return { color: "#50c878", gradient: "emerald" };
  if (level >= 12) return { color: "#0f52ba", gradient: "sapphire" };
  if (level >= 8)  return { color: "#ffd700", gradient: "gold" };
  if (level >= 4)  return { color: "#c0c0c0", gradient: "silver" };
  if (level > 0)   return { color: "#cd7f32", gradient: "bronze" };
  return { color: "#eee" };
}

export function getMaxLevel() {
  return 20;
}