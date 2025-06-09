import type { Achievement } from "../data/achievements";

/**
 * Returns the current unlocked stage index, percent progress to next stage, and value for the achievement.
 */
export function getAchievementProgress(
  a: Achievement,
  skills: Record<string, { level: number; xp: number }>
) {
  const skill = skills[a.skillCriteria.skillId];
  const value = skill ? skill[a.skillCriteria.metric] || 0 : 0;
  let stageIdx = -1;
  let percent = 0;
  for (let i = 0; i < a.stages.length; ++i) {
    if (value >= a.stages[i].goal) stageIdx = i;
  }
  if (stageIdx < a.stages.length - 1) {
    const prevGoal = stageIdx >= 0 ? a.stages[stageIdx].goal : 0;
    const nextGoal = a.stages[stageIdx + 1].goal;
    percent = Math.min(100, ((value - prevGoal) / (nextGoal - prevGoal)) * 100);
  } else if (a.stages.length > 0) {
    percent = 100;
  }
  return {
    stageIdx,
    percent,
    value
  };
}