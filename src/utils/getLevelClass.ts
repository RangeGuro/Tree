export function getLevelClass(level: number): string {
  const spectrum = [
    "bg-gray",    // 0
    "bg-red",     // 1
    "bg-orange",  // 2
    "bg-amber",   // 3
    "bg-yellow",  // 4
    "bg-lime",    // 5
    "bg-green",   // 6
    "bg-teal",    // 7
    "bg-cyan",    // 8
    "bg-skyblue", // 9
    "bg-blue",    // 10
    "bg-indigo",  // 11
    "bg-violet",  // 12
    "bg-magenta", // 13
    "bg-pink",    // 14
    "bg-bronze",   // 15
    "bg-iron",     // 16
    "bg-silver",   // 17
    "bg-steel",    // 18
    "bg-gold",     // 19
    "bg-platinum", // 20
    "bg-emerald",  // 21
    "bg-ruby",     // 22
    "bg-sapphire", // 23
    "bg-diamond",  // 24+
  ];
  if (level <= 0) return spectrum[0];
  if (level < spectrum.length) return spectrum[level];
  return spectrum[spectrum.length - 1];
}