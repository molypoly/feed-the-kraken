export const INITIAL_STATE = {
  resources: {
    plankton: 0,
    krill: 0,
    smallFish: 0,
    voidPearls: 0,
  },
  resourceProgress: {
    plankton: 0,
    krill: 0,
    smallFish: 0,
  },
  buildings: {
    planktonBloom: 0,
    krillCluster: 0,
    anglerTrap: 0,
  },
  kraken: {
    hunger: 50,
    maxHunger: 100,
    level: 1,
    tidalSurgeSeconds: 0,
  },
  upgrades: {
    purchased: [],
  },
  productionRates: {
    plankton: 0,
    krill: 0,
    smallFish: 0,
  },
};