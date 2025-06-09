import type { SkillNode } from "../data/skills";

/**
 * Recursively collect all skills from a skill tree.
 */
export function getAllSkills(node: SkillNode): SkillNode[] {
  const result: SkillNode[] = [node];
  if (node.children) {
    for (const child of node.children) {
      result.push(...getAllSkills(child));
    }
  }
  return result;
}

/**
 * Find a skill node by its id in the skill tree.
 */
export function findSkillById(node: SkillNode, id: string): SkillNode | undefined {
  if (node.id === id) return node;
  if (node.children) {
    for (const child of node.children) {
      const found = findSkillById(child, id);
      if (found) return found;
    }
  }
  return undefined;
}

/**
 * Return an array of all ids in the skill tree.
 */
export function getAllSkillIds(node: SkillNode): string[] {
  return getAllSkills(node).map(skill => skill.id);
}