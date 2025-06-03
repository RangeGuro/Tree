export function getColorForLevel(level: number) {
  switch (level) {
    case 0: return { color: "#808080", gradient: undefined }; // gray
    case 1: return { color: "#cd7f32", gradient: "bronze" }; // bronze
    case 2: return { color: "#c0c0c0", gradient: "silver" }; // silver
    case 3: return { color: "#ffd700", gradient: "gold" }; // gold
    case 4: return { color: "#50c878", gradient: "emerald" }; // emerald
    case 5: return { color: "#0f52ba", gradient: "sapphire" }; // sapphire
    case 6: return { color: "#e0115f", gradient: "ruby" }; // ruby
    case 7: return { color: "#b9f2ff", gradient: "diamond" }; // diamond
    default: return { color: "#23283a", gradient: undefined };
  }
}