import { getColorForPercent } from "./levelColors";

/**
 * Returns the color/gradient for an achievement or skill based on percent progress.
 */
export function getAchievementColorByPercent(percent: number): { color: string, gradient?: string } {
  return getColorForPercent(percent);
}