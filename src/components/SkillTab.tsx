import React, { useState, useEffect } from "react";
import type { SkillNode } from "../data/skills";
import { getColorForLevel } from "../utils/levelColors";
import { skillTree } from "../data/skills";

// --- FAVORITES ---
function isSkillFavorite(skillId: string): boolean {
  return localStorage.getItem(`skill-favorite-${skillId}`) === "1";
}
function setSkillFavorite(skillId: string, favored: boolean) {
  if (favored) {
    localStorage.setItem(`skill-favorite-${skillId}`, "1");
  } else {
    localStorage.removeItem(`skill-favorite-${skillId}`);
  }
}

// --- NOTES ---
function getSkillNote(skillId: string): string {
  return localStorage.getItem(`skill-note-${skillId}`) || "";
}
function setSkillNote(skillId: string, note: string) {
  if (note.trim()) {
    localStorage.setItem(`skill-note-${skillId}`, note);
  } else {
    localStorage.removeItem(`skill-note-${skillId}`);
  }
}

// --- LINKS ---
function getSkillLinks(skillId: string): { title: string; url: string }[] {
  try {
    return JSON.parse(localStorage.getItem(`skill-links-${skillId}`) || "[]");
  } catch {
    return [];
  }
}
function setSkillLinks(skillId: string, links: { title: string; url: string }[]) {
  localStorage.setItem(`skill-links-${skillId}`, JSON.stringify(links));
}

// --- TAGS ---
function getSkillTags(skillId: string): string[] {
  try {
    return JSON.parse(localStorage.getItem(`skill-tags-${skillId}`) || "[]");
  } catch {
    return [];
  }
}
function setSkillTags(skillId: string, tags: string[]) {
  localStorage.setItem(`skill-tags-${skillId}`, JSON.stringify(tags));
}

interface SkillTabProps {
  skill: SkillNode;
  path: string[];
  onClose: () => void;
  onSelectSkill?: (skill: SkillNode, newPath: string[]) => void;
  onDeleteSkill?: (skill: SkillNode) => void;
  onEditCustomSkill?: () => void;
}

const MAX_LEVEL = 20;
const XP_PER_LEVEL = 100;

function findParent(
  root: SkillNode,
  targetId: string,
  path: SkillNode[] = []
): { parent: SkillNode | null; path: SkillNode[] } {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === targetId) {
        return { parent: root, path: [...path, root] };
      }
      const found = findParent(child, targetId, [...path, root]);
      if (found.parent) return found;
    }
  }
  return { parent: null, path: [] };
}

function getTabBackgroundStyle(level: number): React.CSSProperties {
  const { color, gradient } = getColorForLevel(level);
  const gradients: Record<string, string> = {
    gold: "linear-gradient(135deg, #fff8d7 0%, #ffd700 60%, #bfa400 100%)",
    ruby: "linear-gradient(135deg, #ffe0ef 0%, #e0115f 65%, #6f0a26 100%)",
    sapphire: "linear-gradient(135deg, #e6f2ff 0%, #0f52ba 65%, #051540 100%)",
    emerald: "linear-gradient(135deg, #d6fff0 0%, #50c878 60%, #145a32 100%)",
    diamond: "linear-gradient(135deg, #ffffff 0%, #b9f2ff 60%, #78c5d6 100%)",
    silver: "linear-gradient(135deg, #ffffff 0%, #c0c0c0 60%, #8f8f8f 100%)",
    bronze: "linear-gradient(135deg, #ffecd2 0%, #cd7f32 70%, #a97142 100%)",
  };
  if (gradient && gradients[gradient]) {
    return {
      background: gradients[gradient],
      color: "#23283a",
      borderRadius: 16,
      boxShadow: "0 6px 32px #0003",
    };
  }
  return {
    background: color,
    color: "#23283a",
    borderRadius: 16,
    boxShadow: "0 6px 32px #0003",
  };
}

function isCustomSkill(skill: SkillNode) {
  return skill.id.startsWith("custom_");
}

export function SkillTab({
  skill,
  path,
  onClose,
  onSelectSkill,
  onDeleteSkill,
  onEditCustomSkill,
}: SkillTabProps) {
  const levelKey = `skill-level-${skill.id}`;
  const xpKey = `skill-xp-${skill.id}`;

  const [level, setLevel] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [xpChange, setXpChange] = useState<number>(10);

  // Notes state
  const [note, setNote] = useState<string>(getSkillNote(skill.id));
  const [editingNote, setEditingNote] = useState(false);

  // Favorite state
  const [favorite, setFavorite] = useState(isSkillFavorite(skill.id));

  // Links state
  const [links, setLinks] = useState(getSkillLinks(skill.id));
  const [editingLinks, setEditingLinks] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  // Tags state
  const [tags, setTags] = useState(getSkillTags(skill.id));
  const [editingTags, setEditingTags] = useState(false);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    setLevel(Number(localStorage.getItem(levelKey)) || 0);
    setXp(Number(localStorage.getItem(xpKey)) || 0);
    setNote(getSkillNote(skill.id));
    setEditingNote(false);
    setFavorite(isSkillFavorite(skill.id));
    setLinks(getSkillLinks(skill.id));
    setEditingLinks(false);
    setTags(getSkillTags(skill.id));
    setEditingTags(false);
    setNewLink({ title: "", url: "" });
    setNewTag("");
  }, [skill.id]);

  const addXp = (amount: number) => {
    let newXp = xp + amount;
    let newLevel = level;
    while (newXp >= XP_PER_LEVEL && newLevel < MAX_LEVEL) {
      newXp -= XP_PER_LEVEL;
      newLevel += 1;
    }
    if (newLevel >= MAX_LEVEL) {
      newLevel = MAX_LEVEL;
      newXp = 0;
    }
    setLevel(newLevel);
    setXp(newXp);
  };

  const removeXp = (amount: number) => {
    let newXp = xp - amount;
    let newLevel = level;
    while (newXp < 0 && newLevel > 0) {
      newLevel -= 1;
      newXp += XP_PER_LEVEL;
    }
    if (newLevel === 0 && newXp < 0) newXp = 0;
    setLevel(newLevel);
    setXp(newXp);
  };

  const handleSave = () => {
    localStorage.setItem(levelKey, String(level));
    localStorage.setItem(xpKey, String(xp));
    onClose();
  };

  const handleReset = () => {
    setLevel(0);
    setXp(0);
  };

  // Notes logic
  const handleNoteSave = () => {
    setSkillNote(skill.id, note);
    setEditingNote(false);
  };

  // Favorite logic
  const toggleFavorite = () => {
    setSkillFavorite(skill.id, !favorite);
    setFavorite(!favorite);
  };

  // Links logic
  const handleAddLink = () => {
    if (!newLink.url.trim()) return;
    const updated = [...links, { ...newLink }];
    setLinks(updated); setSkillLinks(skill.id, updated);
    setNewLink({ title: "", url: "" });
  };
  const handleRemoveLink = (idx: number) => {
    const updated = links.slice();
    updated.splice(idx, 1);
    setLinks(updated);
    setSkillLinks(skill.id, updated);
  };

  // Tags logic
  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag.trim())) return;
    const updated = [...tags, newTag.trim()];
    setTags(updated);
    setSkillTags(skill.id, updated);
    setNewTag("");
  };
  const handleRemoveTag = (idx: number) => {
    const updated = tags.filter((_, i) => i !== idx);
    setTags(updated);
    setSkillTags(skill.id, updated);
  };

  const { parent: prerequisite, path: parentPath } = findParent(skillTree, skill.id);
  let isLocked = false;
  let lockReason: string | null = null;
  const minLevel = skill.minLevel ?? 0;
  if (prerequisite && minLevel > 0) {
    const parentLevel = Number(localStorage.getItem(`skill-level-${prerequisite.id}`)) || prerequisite.level || 0;
    if (parentLevel < minLevel) {
      isLocked = true;
      lockReason = `Requires "${prerequisite.name}" at level ${minLevel} (currently ${parentLevel})`;
    }
  }

  const percent = Math.min(100, (xp / XP_PER_LEVEL) * 100);

  const showDescription = !!skill.description;
  const showGuide = !!skill.guide && skill.guide.length > 0;
  const showVideo = !!skill.youtubeUrl;
  const nextSteps = skill.children ?? [];

  return (
    <aside
      className="skill-tab-popup"
      style={{
        ...getTabBackgroundStyle(level),
        padding: 32,
        maxWidth: 480,
        margin: "0 auto",
        position: "relative",
        minHeight: 540,
        maxHeight: "90vh",
        overflow: "hidden"
      }}
    >
      <button
        className="skill-tab-back"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          background: "rgba(255,255,255,0.83)",
          border: "none",
          borderRadius: 9,
          fontWeight: "bold",
          fontSize: 18,
          padding: "2px 18px",
          cursor: "pointer",
          boxShadow: "0 1px 4px #0002",
          zIndex: 2,
          textShadow: "0 0 2px #fff, 0 0 4px #fff",
        }}
        aria-label="Back"
      >
        ← Back
      </button>
      {/* SCROLLABLE CONTENT */}
      <div
        style={{
          maxHeight: "calc(90vh - 100px)",
          overflowY: "auto",
          paddingRight: 8,
        }}
      >
        <div className="skill-tab-header" style={{ textAlign: "center", marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <span
            className="skill-tab-title"
            style={{
              fontSize: 28,
              fontWeight: "bold",
              marginBottom: 8,
              textShadow: "0 0 2px #fff, 0 0 4px #fff, 0 0 8px #fff",
              WebkitTextStroke: "1.5px #fff",
            }}
          >
            {skill.name}
          </span>
          <button
            onClick={toggleFavorite}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 28,
              padding: 0,
              marginLeft: 8,
              color: favorite ? "#ffd700" : "#ccc",
              textShadow: favorite ? "0 0 12px #ffd70099" : "none"
            }}
            title={favorite ? "Unstar" : "Star"}
            aria-label={favorite ? "Unstar" : "Star"}
          >
            {favorite ? "★" : "☆"}
          </button>
        </div>
        <div
          className="skill-tab-path"
          style={{
            marginBottom: 12,
            opacity: 0.85,
            textAlign: "center",
            textShadow: "0 0 2px #fff, 0 0 4px #fff",
          }}
        >
          {path.join(" > ")}
        </div>

        {/* PROGRESS BAR SECTION MOVED UP HERE */}
        <div className="skill-tab-section" style={{ marginBottom: 16 }}>
          <b>Your Level:</b>{" "}
          <span
            style={{
              fontWeight: "bold",
              fontSize: "1.2em",
              textShadow: "0 0 2px #fff, 0 0 4px #fff, 0 0 8px #fff",
              WebkitTextStroke: "1.5px #fff",
            }}
          >
            {level}
          </span>
          <div style={{ margin: "6px 0 10px" }}>
            <div
              className="progress-bar-bg"
              style={{
                background: "rgba(0,0,0,0.15)",
                borderRadius: 6,
                height: 12,
                width: "100%",
              }}>
              <div
                className="progress-bar-fill"
                style={{
                  width: `${percent}%`,
                  background: "#23283a",
                  height: "100%",
                  borderRadius: 6,
                  transition: "width 0.2s"
                }}
              />
            </div>
            <div style={{ fontSize: 13 }}>
              {xp} / {XP_PER_LEVEL} XP to next level
              {level >= MAX_LEVEL && <span style={{ marginLeft: 8, color: "gold", textShadow: "0 0 2px #fff, 0 0 4px #fff" }}>MAX LEVEL</span>}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, margin: "10px 0" }}>
            <input
              type="number"
              value={xpChange}
              min={1}
              max={XP_PER_LEVEL}
              step={1}
              onChange={e => setXpChange(Math.max(1, Math.min(XP_PER_LEVEL, Number(e.target.value) || 1)))}
              style={{ width: 60, fontSize: 16, borderRadius: 6, border: "1px solid #aaa", padding: "2px 6px" }}
            />
            <button
              onClick={() => removeXp(xpChange)}
              disabled={level === 0 && xp === 0}
              style={{
                background: "#fff",
                color: "#23283a",
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "6px 15px",
                cursor: (level === 0 && xp === 0) ? "not-allowed" : "pointer",
                opacity: (level === 0 && xp === 0) ? 0.5 : 1,
                textShadow: "0 0 2px #fff, 0 0 4px #fff",
              }}
            >- XP</button>
            <button
              onClick={() => addXp(xpChange)}
              disabled={level >= MAX_LEVEL}
              style={{
                background: "#fff",
                color: "#23283a",
                fontWeight: "bold",
                border: "none",
                borderRadius: 8,
                padding: "6px 15px",
                cursor: level >= MAX_LEVEL ? "not-allowed" : "pointer",
                opacity: level >= MAX_LEVEL ? 0.5 : 1,
                textShadow: "0 0 2px #fff, 0 0 4px #fff",
              }}
            >+ XP</button>
            <button
              onClick={handleReset}
              style={{
                background: "#b22222",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                padding: "6px 15px",
                fontWeight: 600,
                cursor: "pointer"
              }}
              title="Reset this skill's progress"
            >Reset</button>
          </div>
          {isLocked && (
            <div style={{
              color: "#b22222",
              background: "#fff7f7",
              border: "1px solid #eabbbb",
              borderRadius: 7,
              padding: "7px 12px",
              margin: "11px 0 0 0",
              display: "flex",
              alignItems: "center",
              gap: 7,
              fontSize: "1em"
            }}>
              <span style={{
                fontSize: "1.4em",
                verticalAlign: "middle"
              }}>🔒</span>
              <span>
                <b>Locked:</b> {lockReason}
              </span>
            </div>
          )}
        </div>
        {/* END PROGRESS BAR SECTION */}

        {prerequisite && (
          <div className="skill-tab-prereq" style={{ marginBottom: 10, textAlign: "center" }}>
            <b>Prerequisite: </b>
            <button
              onClick={() =>
                onSelectSkill &&
                onSelectSkill(
                  prerequisite,
                  parentPath.map((p) => p.name).concat(prerequisite.name)
                )
              }
              style={{
                background: "#fff",
                color: "#23283a",
                border: "1px solid #bbb",
                borderRadius: 6,
                padding: "2px 10px",
                fontWeight: "bold",
                marginLeft: 3,
                cursor: "pointer",
                textShadow: "0 0 2px #fff, 0 0 4px #fff",
              }}
            >
              {prerequisite.name}
            </button>
            {minLevel > 0 && (
              <span style={{ marginLeft: 6, fontSize: "0.97em" }}>
                (Level required: <b>{minLevel}</b>)
              </span>
            )}
          </div>
        )}

        {showDescription && (
          <div style={{ marginBottom: 14 }}>
            <b>Description:</b>
            <div>{skill.description}</div>
          </div>
        )}

        {showVideo && (
          <div style={{ marginBottom: 14 }}>
            <b>Video Tutorial:</b><br />
            <a
              href={skill.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "underline" }}
            >
              Watch on YouTube
            </a>
          </div>
        )}

        {showGuide && (
          <div style={{ marginBottom: 14 }}>
            <b>Step-by-step Guide:</b>
            <ol>
              {skill.guide!.map((step: string, idx: number) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Notes Section */}
        <div style={{ marginBottom: 18 }}>
          <b>Notes:</b>
          {!editingNote ? (
            <div>
              <div
                style={{
                  minHeight: 32,
                  background: "#f9f9f9",
                  borderRadius: 6,
                  padding: "7px 12px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {note || <span style={{ color: "#bbb" }}>(No notes yet)</span>}
              </div>
              <button
                style={{ marginTop: 6 }}
                onClick={() => setEditingNote(true)}
              >
                {note ? "Edit Note" : "Add Note"}
              </button>
            </div>
          ) : (
            <div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                style={{ width: "100%", borderRadius: 6, marginTop: 6 }}
                autoFocus
              />
              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button onClick={handleNoteSave} disabled={!note.trim()}>
                  Save
                </button>
                <button
                  onClick={() => {
                    setNote("");
                    setSkillNote(skill.id, "");
                    setEditingNote(false);
                  }}
                  style={{ color: "#b22222" }}
                  disabled={!note.trim()}
                >
                  Delete
                </button>
                <button onClick={() => { setNote(getSkillNote(skill.id)); setEditingNote(false); }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Links Section */}
        <div style={{ marginBottom: 18 }}>
          <b>Links & Resources:</b>
          <ul style={{ paddingLeft: 18 }}>
            {links.map((l, i) => (
              <li key={i}>
                <a href={l.url} target="_blank" rel="noopener noreferrer">{l.title || l.url}</a>
                {editingLinks && (
                  <button style={{ marginLeft: 8, color: "#b22222", background: "none", border: "none", cursor: "pointer" }}
                    onClick={() => handleRemoveLink(i)}
                    title="Remove link"
                  >×</button>
                )}
              </li>
            ))}
          </ul>
          {editingLinks ? (
            <div>
              <input
                placeholder="Title"
                value={newLink.title}
                onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                style={{ width: "40%", marginRight: 6 }}
              />
              <input
                placeholder="URL"
                value={newLink.url}
                onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                style={{ width: "40%", marginRight: 6 }}
              />
              <button
                onClick={handleAddLink}
                disabled={!newLink.url}
              >Add</button>
              <button onClick={() => setEditingLinks(false)} style={{ marginLeft: 6 }}>Done</button>
            </div>
          ) : (
            <button onClick={() => setEditingLinks(true)} style={{ marginTop: 6 }}>
              {links.length ? "Edit Links" : "Add Link"}
            </button>
          )}
        </div>

        {/* Tags Section */}
        <div style={{ marginBottom: 18 }}>
          <b>Tags:</b>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, margin: "7px 0" }}>
            {tags.map((t, i) => (
              <span key={i} style={{
                background: "#eee", borderRadius: 10, padding: "2px 10px", fontSize: 13, display: "flex", alignItems: "center"
              }}>
                {t}
                {editingTags && (
                  <button
                    onClick={() => handleRemoveTag(i)}
                    style={{ marginLeft: 3, color: "#b22222", background: "none", border: "none", cursor: "pointer" }}
                    title="Remove tag"
                  >×</button>
                )}
              </span>
            ))}
          </div>
          {editingTags ? (
            <div>
              <input
                placeholder="New tag"
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                style={{ width: "40%", marginRight: 6 }}
              />
              <button
                onClick={handleAddTag}
                disabled={!newTag.trim() || tags.includes(newTag.trim())}
              >Add</button>
              <button onClick={() => setEditingTags(false)} style={{ marginLeft: 6 }}>Done</button>
            </div>
          ) : (
            <button onClick={() => setEditingTags(true)} style={{ marginTop: 6 }}>
              {tags.length ? "Edit Tags" : "Add Tag"}
            </button>
          )}
        </div>

        {nextSteps.length > 0 && (
          <div className="skill-tab-nextsteps" style={{ marginBottom: 14 }}>
            <b>Next Steps:</b>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 4 }}>
              {nextSteps.map((child) => (
                <button
                  key={child.id}
                  onClick={() =>
                    onSelectSkill &&
                    onSelectSkill(
                      child,
                      path.concat(skill.name, child.name)
                    )
                  }
                  style={{
                    background: "#fff",
                    color: "#23283a",
                    border: "1px solid #bbb",
                    borderRadius: 6,
                    padding: "2px 10px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    textShadow: "0 0 2px #fff, 0 0 4px #fff",
                  }}
                >
                  {child.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {(onEditCustomSkill || onDeleteSkill) && isCustomSkill(skill) && (
          <div style={{ display: "flex", gap: 12, marginTop: 18, justifyContent: "center" }}>
            {onEditCustomSkill && (
              <button
                onClick={onEditCustomSkill}
                style={{
                  background: "#1a6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                ✏️ Edit
              </button>
            )}
            {onDeleteSkill && (
              <button
                onClick={() => {
                  if (window.confirm("Remove this custom skill? This cannot be undone.")) {
                    onDeleteSkill(skill);
                  }
                }}
                style={{
                  background: "#b22222",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontWeight: "bold",
                  cursor: "pointer"
                }}
              >
                🗑️ Remove
              </button>
            )}
          </div>
        )}
      </div>
      {/* END SCROLLABLE CONTENT */}

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 20 }}>
        <button onClick={onClose} style={{ marginTop: 12 }}>Cancel</button>
        <button onClick={handleSave} style={{ marginTop: 12 }}>Save</button>
      </div>
    </aside>
  );
}