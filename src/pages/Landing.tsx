import PentagonStats from "../components/PentagonStats";
import Timeline from "../components/Timeline";
import "./Landing.css";

const Landing = () => (
  <div className="landing">
    <h1>Welcome to Your Martial Arts Journey!</h1>
    <PentagonStats />
    <Timeline />
  </div>
);

export default Landing;