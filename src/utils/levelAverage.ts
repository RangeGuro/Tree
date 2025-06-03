import type { SkillNode } from "../data/skills";

export function getLeafLevels(node: SkillNode): number[] {
  if (!node.children || node.children.length === 0) {
    return [node.level];
  }
  return node.children.flatMap(child => getLeafLevels(child));
}

export function computeAverageLevel(node: SkillNode): number {
  const leafLevels = getLeafLevels(node);
  if (leafLevels.length === 0) return 0;
  return Math.round(leafLevels.reduce((a, b) => a + b, 0) / leafLevels.length);
}