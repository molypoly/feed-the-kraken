export const UPGRADES = {
  baits: {
    glowingLure: {
      id: "glowingLure",
      name: "Glowing Lure",
      description: "Unlocks the Anglerfish Trap — passively attracts small fish.",
      cost: 5,
      type: "bait",
    },
    deepSeaChum: {
      id: "deepSeaChum",
      name: "Deep Sea Chum",
      description: "Unlocks the Chum Disperser — boosts krill production.",
      cost: 8,
      type: "bait",
    },
  },
  boosts: {
    tidalSurge: {
      id: "tidalSurge",
      name: "Tidal Surge",
      description: "2x plankton production for 15 seconds. Stackable.",
      cost: 3,
      type: "boost",
      consumable: true,
    },
    feedingFrenzy: {
      id: "feedingFrenzy",
      name: "Feeding Frenzy",
      description: "Krill feeds give +10 hunger instead of +5.",
      cost: 6,
      type: "boost",
    },
    pearlDiver: {
      id: "pearlDiver",
      name: "Pearl Diver",
      description: "Passive Void Pearl trickle is 1.5x faster.",
      cost: 5,
      type: "boost",
    },
  },
};