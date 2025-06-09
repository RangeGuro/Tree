import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import type { SkillNode } from "../data/skills";

interface CustomSkillModalProps {
  parents: SkillNode[];
  onSave: (newSkill: SkillNode, parentId: string | null) => void;
  onClose: () => void;
  initialSkill?: SkillNode; // For editing
  initialParentId?: string | null;
}

export function CustomSkillModal({
  parents,
  onSave,
  onClose,
  initialSkill,
  initialParentId,
}: CustomSkillModalProps) {
  const [name, setName] = useState(initialSkill?.name || "");
  const [description, setDescription] = useState(initialSkill?.description || "");
  const [guide, setGuide] = useState<string[]>(initialSkill?.guide || []);
  const [guideInput, setGuideInput] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState(initialSkill?.youtubeUrl || "");
  const [parentId, setParentId] = useState<string | null>(
    initialParentId !== undefined ? initialParentId : null
  );

  useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name || "");
      setDescription(initialSkill.description || "");
      setGuide(initialSkill.guide || []);
      setYoutubeUrl(initialSkill.youtubeUrl || "");
    }
    if (initialParentId !== undefined) setParentId(initialParentId);
  }, [initialSkill, initialParentId]);

  const addGuideStep = () => {
    if (guideInput.trim()) {
      setGuide([...guide, guideInput.trim()]);
      setGuideInput("");
    }
  };

  const removeGuideStep = (idx: number) => {
    setGuide(guide.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newSkill: SkillNode = {
      ...((initialSkill as SkillNode) || {}),
      id: initialSkill?.id || "custom_" + Date.now(),
      name: name.trim(),
      level: initialSkill?.level ?? 0,
      description: description.trim() || undefined,
      guide: guide.length > 0 ? guide : undefined,
      youtubeUrl: youtubeUrl.trim() || undefined,
    };
    onSave(newSkill, parentId);
  };

  const modalContent = (
    <div className="modal-overlay" style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10001
    }}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        style={{
          background: "#fff", borderRadius: 10, padding: 24, minWidth: 340, boxShadow: "0 8px 32px #0006"
        }}
      >
        <h2>{initialSkill ? "Edit Custom Skill" : "Add Custom Skill"}</h2>
        <label>
          Name<br/>
          <input value={name} onChange={e => setName(e.target.value)} required style={{ width: "100%" }} />
        </label>
        <label>
          Description<br/>
          <textarea value={description} onChange={e => setDescription(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Optional: YouTube URL<br/>
          <input value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Optional: Step-by-step Guide<br/>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={guideInput}
              onChange={e => setGuideInput(e.target.value)}
              placeholder="Add a step..."
              style={{ flex: 1 }}
            />
            <button type="button" onClick={addGuideStep}>Add</button>
          </div>
          <ol>
            {guide.map((step, idx) => (
              <li key={idx} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {step}
                <button type="button" onClick={() => removeGuideStep(idx)} style={{ color: "red", marginLeft: 6 }}>×</button>
              </li>
            ))}
          </ol>
        </label>
        <label>
          Parent Skill<br/>
          <select value={parentId ?? ""} onChange={e => setParentId(e.target.value || null)} style={{ width: "100%" }}>
            <option value="">(No parent, top-level custom skill)</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 16 }}>
          <button type="button" onClick={onClose}>Cancel</button>
          <button type="submit" disabled={!name.trim()}>Save</button>
        </div>
      </form>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}