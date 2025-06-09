import React from "react";
import Timeline from "../components/Timeline";

const TimelinePage = () => (
  <div className="timeline-page" style={{
    maxWidth: 900,
    margin: "2em auto",
    padding: "2em",
    background: "#222a33",
    borderRadius: 16,
    color: "#fff",
    minHeight: "80vh",
    boxShadow: "0 8px 40px #0006"
  }}>
    <h1 style={{
      textAlign: "center",
      fontWeight: "bold",
      marginBottom: "1.5em",
      fontSize: "2.3em",
      background: "linear-gradient(135deg, #ffffff 0%, #b9f2ff 60%, #78c5d6 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent"
    }}>
      Your Martial Arts Timeline
    </h1>
    <Timeline />
  </div>
);

export default TimelinePage;