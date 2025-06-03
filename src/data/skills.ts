export interface SkillNode {
  id: string;
  name: string;
  // Level can be 0 or higher. Change to `number | undefined` if you want to allow no level.
  level: number; // Minimum level is 0
  children?: SkillNode[];
}

export const skillTree: SkillNode = {
  id: "foundation",
  name: "🧭 FOUNDATION",
  level: 0,
  children: [
    {
      id: "core-concepts",
      name: "Core Concepts",
      level: 0,
      children: [
        { id: "stance-balance", name: "Stance & Balance", level: 0 },
        { id: "southpaw-stance", name: "Southpaw stance (left lead)", level: 0 },
        { id: "weight-distribution", name: "Weight distribution", level: 0 },
        { id: "guard-positioning", name: "Guard positioning", level: 0 },
        {
          id: "footwork",
          name: "Footwork",
          level: 0,
          children: [
            { id: "basic-steps", name: "Basic steps: forward, backward, lateral", level: 0 },
            { id: "pivoting", name: "Pivoting", level: 0 },
            { id: "switching-stance", name: "Switching stance", level: 0 },
          ],
        },
        { id: "breathing-rhythm", name: "Breathing & Rhythm", level: 0 },
        {
          id: "basic-conditioning",
          name: "Basic Conditioning",
          level: 0,
          children: [
            { id: "leg-endurance", name: "Leg endurance", level: 0 },
            { id: "core-stability", name: "Core stability", level: 0 },
            { id: "shoulder-mobility", name: "Shoulder mobility", level: 0 },
          ],
        },
      ],
    },
    {
      id: "hand-strikes",
      name: "🥊 HAND STRIKES (Left-Dominant)",
      level: 0,
      children: [
        {
          id: "punches",
          name: "Punches",
          level: 0,
          children: [
            {
              id: "jab",
              name: "Jab (Lead Left Hand)",
              level: 0,
              children: [
                { id: "snap-jab", name: "Snap jab", level: 0 },
                { id: "power-jab", name: "Power jab", level: 0 },
                { id: "feint-jab", name: "Feint jab", level: 0 },
              ],
            },
            {
              id: "cross",
              name: "Cross (Rear Right Hand)",
              level: 0,
              children: [
                { id: "straight-cross", name: "Straight cross", level: 0 },
                { id: "step-in-cross", name: "Step-in cross", level: 0 },
                { id: "counter-cross", name: "Counter-cross", level: 0 },
              ],
            },
            {
              id: "hook",
              name: "Hook (Left-Hand Focus)",
              level: 0,
              children: [
                { id: "short-hook", name: "Short hook", level: 0 },
                { id: "long-hook", name: "Long hook", level: 0 },
                { id: "liver-shot", name: "Liver shot", level: 0 },
              ],
            },
            {
              id: "uppercut",
              name: "Uppercut",
              level: 0,
              children: [
                { id: "lead-uppercut", name: "Lead uppercut", level: 0 },
                { id: "rear-uppercut", name: "Rear uppercut", level: 0 },
              ],
            },
            {
              id: "overhand",
              name: "Overhand",
              level: 0,
              children: [
                { id: "overhand-left", name: "Overhand left", level: 0 },
                { id: "overhand-right", name: "Overhand right", level: 0 },
              ],
            },
            {
              id: "combinations",
              name: "Combinations",
              level: 0,
              children: [
                { id: "jab-cross", name: "Jab–Cross", level: 0 },
                { id: "jab-hook", name: "Jab–Hook", level: 0 },
                { id: "jab-uppercut", name: "Jab–Uppercut", level: 0 },
                { id: "cross-hook-cross", name: "Cross–Hook–Cross", level: 0 },
              ],
            },
            {
              id: "angles-setups",
              name: "Angles & Setups",
              level: 0,
              children: [
                { id: "lstep-jab", name: "L-step into jab", level: 0 },
                { id: "slip-jab", name: "Slip-jab", level: 0 },
                { id: "pivot-hook", name: "Pivot–hook", level: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "kicks",
      name: "🦵 KICKS (Leg-Dominant, Left-Side Emphasis)",
      level: 0,
      children: [
        {
          id: "basic-kicks",
          name: "Basic Kicks",
          level: 0,
          children: [
            {
              id: "front-kick",
              name: "Front Kick (Lead/Left Leg)",
              level: 0,
              children: [
                { id: "snap-kick", name: "Snap kick", level: 0 },
                { id: "push-kick", name: "Push kick (teep)", level: 0 },
              ],
            },
            {
              id: "roundhouse",
              name: "Roundhouse",
              level: 0,
              children: [
                { id: "lead-roundhouse", name: "Lead roundhouse", level: 0 },
                { id: "rear-roundhouse", name: "Rear roundhouse", level: 0 },
              ],
            },
            {
              id: "side-kick",
              name: "Side Kick",
              level: 0,
              children: [
                { id: "chambered-side", name: "Chambered side", level: 0 },
                { id: "stepping-side", name: "Stepping side", level: 0 },
              ],
            },
            { id: "back-kick", name: "Back Kick", level: 0 },
            {
              id: "knee-strikes",
              name: "Knee Strikes",
              level: 0,
              children: [
                { id: "straight-knee", name: "Straight knee", level: 0 },
                { id: "curved-knee", name: "Curved knee", level: 0 },
                { id: "jumping-knee", name: "Jumping knee", level: 0 },
              ],
            },
          ],
        },
        {
          id: "advanced-kicks",
          name: "Advanced Kicks",
          level: 0,
          children: [
            {
              id: "spinning-kicks",
              name: "Spinning Kicks",
              level: 0,
              children: [
                { id: "spinning-back-kick", name: "Spinning back kick", level: 0 },
                { id: "spinning-hook-kick", name: "Spinning hook kick", level: 0 },
                { id: "tornado-kick", name: "Tornado kick", level: 0 },
              ],
            },
            {
              id: "jump-kicks",
              name: "Jump Kicks",
              level: 0,
              children: [
                { id: "jumping-roundhouse", name: "Jumping roundhouse", level: 0 },
                { id: "flying-side-kick", name: "Flying side kick", level: 0 },
              ],
            },
            {
              id: "feints-combos",
              name: "Feints & Combos",
              level: 0,
              children: [
                { id: "teep-roundhouse", name: "Teep–Roundhouse", level: 0 },
                { id: "low-high-kick", name: "Low-high kick setup", level: 0 },
                { id: "feint-lead-kick-switch-knee", name: "Feint lead kick into switch knee", level: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "defense-countering",
      name: "🧷 DEFENSE & COUNTERING",
      level: 0,
      children: [
        {
          id: "guarding",
          name: "Guarding",
          level: 0,
          children: [
            { id: "high-guard", name: "High guard", level: 0 },
            { id: "cross-guard", name: "Cross guard", level: 0 },
            { id: "shell-guard", name: "Shell guard", level: 0 },
          ],
        },
        {
          id: "head-body-movement",
          name: "Head & Body Movement",
          level: 0,
          children: [
            { id: "slipping", name: "Slipping", level: 0 },
            { id: "bob-weave", name: "Bob and weave", level: 0 },
            { id: "ducking", name: "Ducking", level: 0 },
            { id: "leaning", name: "Leaning", level: 0 },
          ],
        },
        {
          id: "blocking",
          name: "Blocking",
          level: 0,
          children: [
            { id: "parry", name: "Parry", level: 0 },
            { id: "cover", name: "Cover", level: 0 },
            { id: "check-block", name: "Check/block (for kicks)", level: 0 },
            { id: "shin-block", name: "Shin block", level: 0 },
          ],
        },
        {
          id: "counter-techniques",
          name: "Counter Techniques",
          level: 0,
          children: [
            { id: "slip-jab-counter", name: "Slip–jab counter", level: 0 },
            { id: "catch-kick-sweep", name: "Catch kick–sweep", level: 0 },
            { id: "parry-cross", name: "Parry–cross", level: 0 },
            { id: "check-roundhouse", name: "Check–roundhouse", level: 0 },
          ],
        },
      ],
    },
    {
      id: "transitions-movement",
      name: "🔄 TRANSITIONS & MOVEMENT",
      level: 0,
      children: [
        {
          id: "footwork-techniques",
          name: "Footwork Techniques",
          level: 0,
          children: [
            { id: "shuffle-step", name: "Shuffle step", level: 0 },
            { id: "switch-step", name: "Switch step", level: 0 },
            { id: "pendulum-step", name: "Pendulum step", level: 0 },
            { id: "l-step", name: "L-step", level: 0 },
            { id: "step-through", name: "Step-through", level: 0 },
            { id: "pivot-entries", name: "Pivot entries", level: 0 },
          ],
        },
        {
          id: "angling",
          name: "Angling",
          level: 0,
          children: [
            { id: "off-line-entry", name: "Off-line entry", level: 0 },
            { id: "circle-out", name: "Circle out", level: 0 },
            { id: "step-to-outside", name: "Step to outside", level: 0 },
          ],
        },
      ],
    },
    {
      id: "mental-strategy",
      name: "🧠 MENTAL GAME & STRATEGY",
      level: 0,
      children: [
        {
          id: "fight-iq",
          name: "Fight IQ",
          level: 0,
          children: [
            { id: "reading-opponent", name: "Reading opponent", level: 0 },
            { id: "feinting-baiting", name: "Feinting and baiting", level: 0 },
            { id: "timing-speed", name: "Timing vs. speed", level: 0 },
            { id: "pattern-breaking", name: "Pattern breaking", level: 0 },
          ],
        },
        {
          id: "fight-scenarios",
          name: "Fight Scenarios",
          level: 0,
          children: [
            { id: "close-range", name: "Close range (clinch range)", level: 0 },
            { id: "mid-range", name: "Mid-range (punching)", level: 0 },
            { id: "long-range", name: "Long range (kicking)", level: 0 },
          ],
        },
        {
          id: "conditioning-mind",
          name: "Conditioning the Mind",
          level: 0,
          children: [
            { id: "pain-tolerance", name: "Pain tolerance", level: 0 },
            { id: "focus-fatigue", name: "Focus under fatigue", level: 0 },
            { id: "emotional-control", name: "Emotional control", level: 0 },
            { id: "nerves-management", name: "Pre-fight nerves management", level: 0 },
          ],
        },
      ],
    },
    {
      id: "clinch-control",
      name: "🛡️ CLINCH & CONTROL",
      level: 0,
      children: [
        {
          id: "clinch-entry",
          name: "Clinch Entry",
          level: 0,
          children: [
            { id: "collar-tie", name: "Collar tie", level: 0 },
            { id: "over-under", name: "Over-under", level: 0 },
            { id: "arm-drag", name: "Arm drag", level: 0 },
          ],
        },
        {
          id: "clinch-strikes",
          name: "Clinch Strikes",
          level: 0,
          children: [
            { id: "knees", name: "Knees", level: 0 },
            { id: "elbows", name: "Elbows", level: 0 },
            { id: "short-punches", name: "Short punches", level: 0 },
          ],
        },
        {
          id: "sweeps-takedowns",
          name: "Sweeps & Takedowns",
          level: 0,
          children: [
            { id: "trip-from-clinch", name: "Trip from clinch", level: 0 },
            { id: "hip-toss", name: "Hip toss (basic)", level: 0 },
            { id: "sweep-caught-kick", name: "Sweep from caught kick", level: 0 },
          ],
        },
      ],
    },
    {
      id: "conditioning-prep",
      name: "🧱 CONDITIONING & PHYSICAL PREP",
      level: 0,
      children: [
        {
          id: "strength-endurance",
          name: "Strength & Endurance",
          level: 0,
          children: [
            { id: "plyometrics", name: "Plyometrics", level: 0 },
            { id: "leg-drills", name: "Leg drills (squats, lunges, explosive hops)", level: 0 },
            { id: "shoulder-core", name: "Shoulder & core work", level: 0 },
          ],
        },
        {
          id: "mobility-recovery",
          name: "Mobility & Recovery",
          level: 0,
          children: [
            { id: "dynamic-stretching", name: "Dynamic stretching", level: 0 },
            { id: "cooldown", name: "Post-session cooldown", level: 0 },
            { id: "joint-conditioning", name: "Joint conditioning", level: 0 },
          ],
        },
      ],
    },
  ],
};