import type { SkillNode } from "../data/skills";
import { skillTree } from "../data/skills";

// Helper to recursively find all skills
function findAllSkills(node: SkillNode): SkillNode[] {
  let skills: SkillNode[] = [node];
  if (node.children) {
    node.children.forEach(child => {
      skills = skills.concat(findAllSkills(child));
    });
  }
  return skills;
}

function isSkillFavorite(skillId: string): boolean {
  return localStorage.getItem(`skill-favorite-${skillId}`) === "1";
}

interface FavoritesPanelProps {
  onSelectSkill: (skill: SkillNode) => void;
}

export function FavoritesPanel({ onSelectSkill }: FavoritesPanelProps) {
  const allSkills = findAllSkills(skillTree);
  const favorites = allSkills.filter(s => isSkillFavorite(s.id));
  if (!favorites.length) return null;
  return (
    <div style={{ background: "#fffbe7", border: "1px solid #fff3cd", borderRadius: 10, padding: 20, margin: "20px 0" }}>
      <h3 style={{ marginTop: 0 }}>⭐ Favorites</h3>
      <ul>
        {favorites.map(skill =>
          <li key={skill.id}>
            <button style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer" }}
              onClick={() => onSelectSkill(skill)}
            >{skill.name}</button>
          </li>
        )}
      </ul>
    </div>
  );
}