import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar-wrapper">
      <nav className="navbar" tabIndex={0}>
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/skills">Skills</NavLink>
        <NavLink to="/combos">Combos</NavLink>
        <NavLink to="/quests">Quests</NavLink>
        <NavLink to="/achievements">Achievements</NavLink>
        <NavLink to="/learned-skills">Learned Skills</NavLink>
        <NavLink to="/skill-tree">Skill Tree</NavLink>
        <NavLink to="/timeline">Timeline</NavLink>

      </nav>
    </div>
  );
}