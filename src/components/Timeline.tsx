import React from "react";

const sampleEvents = [
  { date: "2025-05-22", desc: "Started Jab training" },
  { date: "2025-05-24", desc: "Unlocked Cross" },
  { date: "2025-05-28", desc: "Completed first combo" }
];

const Timeline: React.FC = () => (
  <div style={{margin: "2em auto", maxWidth: 700}}>
    <h2 style={{color: "#ffdf58"}}>Timeline</h2>
    <ul style={{paddingLeft: 0, listStyle: "none"}}>
      {sampleEvents.map((ev, i) => (
        <li key={i} style={{
          margin: "1em 0",
          padding: "0.7em 1.2em",
          background: "#23283a",
          borderRadius: 8,
          color: "#fff"
        }}>
          <b>{ev.date}:</b> {ev.desc}
        </li>
      ))}
    </ul>
  </div>
);

export default Timeline;