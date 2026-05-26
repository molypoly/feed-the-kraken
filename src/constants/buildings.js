export const BUILDINGS = {
  planktonBloom: {
    name: "Plankton Bloom",
    description: "Slowly generates plankton.",
    baseCost: { plankton: 5 },
    production: { plankton: 1 },
  },
  krillCluster: {
    name: "Krill Cluster",
    description: "Converts plankton into krill.",
    baseCost: { plankton: 50 },
    production: { krill: 1, plankton: -5 },
  },
  anglerTrap: {
    name: "Angler Trap",
    description: "Lures small fish using bioluminescent light. Consumes krill.",
    baseCost: { krill: 20 },
    production: { smallFish: 1, krill: -3 },
    requiresUpgrade: "glowingLure",
  },
};