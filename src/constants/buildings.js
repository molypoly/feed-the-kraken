export const BUILDINGS = {
  planktonBloom: {
    name: "Plankton Bloom",
    description: "Slowly generates plankton.",
    baseCost: { plankton: 10 },
    production: { plankton: 1 },
  },
  krillCluster: {
    name: "Krill Cluster",
    description: "Converts plankton into krill.",
    baseCost: { plankton: 50 },
    production: { krill: 1, plankton: -2 },
  },
};