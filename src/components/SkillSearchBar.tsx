import React from "react";

interface SkillSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function SkillSearchBar({ value, onChange, placeholder, style }: SkillSearchBarProps) {
  return (
    <div style={{
      // Remove sticky for now, or adjust top as needed:
      // position: "sticky",
      // top: 64, // Adjust this value to match your navbar height if you want sticky
      background: "#181a21",
      zIndex: 10,
      paddingBottom: 6,
      paddingTop: 10,
      ...style
    }}>
      <input
        type="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder || "Search skills..."}
        style={{
          width: "100%",
          fontSize: 18,
          padding: "8px 12px",
          borderRadius: 8,
          border: "1px solid #bbb",
          background: "#222",
          color: "#fff",
          boxShadow: "0 2px 8px #0002"
        }}
        aria-label="Search skills"
      />
    </div>
  );
}