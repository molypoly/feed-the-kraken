import { BUILDINGS } from "../constants/buildings";

export function tick(prev) {
  const newResources = { ...prev.resources };
  // Passive plankton trickle (1 every 10 seconds = 0.1 per tick)
  newResources.plankton = (newResources.plankton ?? 0) + 0.1;
  const newRates = { plankton: 0.0, krill: 0, smallFish: 0 };
  const newProgress = { ...prev.resourceProgress };

  // Production from buildings
  Object.entries(prev.buildings).forEach(([key, count]) => {
    if (count === 0) return;
    const prod = BUILDINGS[key].production;

    // Calculate how many of this building can actually produce
    let affordableCount = count;
    Object.entries(prod).forEach(([resource, amount]) => {
      if (amount < 0) {
        const available = newResources[resource] ?? 0;
        const maxCanRun = Math.floor(available / Math.abs(amount));
        affordableCount = Math.min(affordableCount, maxCanRun);
      }
    });

    if (affordableCount === 0) return;

    Object.entries(prod).forEach(([resource, amount]) => {
      let finalAmount = amount;

      // Apply tidal surge boost to plankton blooms
      if (key === "planktonBloom" && resource === "plankton" && prev.kraken.tidalSurgeSeconds > 0) {
        finalAmount *= 2;
      }

      newResources[resource] = (newResources[resource] ?? 0) + finalAmount * affordableCount;

      // Track progress toward next whole number
      if (finalAmount > 0 && resource in newProgress) {
        newProgress[resource] = (newProgress[resource] + finalAmount * affordableCount) % 1;
      }

      // Track positive production rates
      if (finalAmount > 0 && resource in newRates) {
        newRates[resource] += finalAmount * affordableCount;
      }
    });
  });

  // Prevent resources from going below 0
  Object.keys(newResources).forEach((r) => {
    if (r !== "voidPearls") newResources[r] = Math.max(0, newResources[r]);
  });

  // Hunger decay scales with level
  const newKraken = {
    ...prev.kraken,
    hunger: Math.max(0, prev.kraken.hunger - (0.1 + (prev.kraken.level - 1) * 0.05)),
    tidalSurgeSeconds: Math.max(0, prev.kraken.tidalSurgeSeconds - 1),
  };

  return { ...prev, resources: newResources, kraken: newKraken, productionRates: newRates, resourceProgress: newProgress };
}

export function buyBuilding(prev, key) {
  const cost = getBuildingCost(key, prev.buildings[key]);
  if (!canAffordResources(prev.resources, cost)) return prev;

  const newResources = { ...prev.resources };
  Object.entries(cost).forEach(([r, amt]) => {
    newResources[r] -= amt;
  });

  return {
    ...prev,
    resources: newResources,
    buildings: { ...prev.buildings, [key]: prev.buildings[key] + 1 },
  };
}

export function feedKraken(prev) {
  if (prev.resources.krill < 1) return prev;

  const hungerGain = prev.upgrades.purchased.includes("feedingFrenzy") ? 10 : 5;

  const newHunger = Math.min(prev.kraken.hunger + hungerGain, prev.kraken.maxHunger);
  const didLevelUp = newHunger >= prev.kraken.maxHunger;

  const pearlBonus = didLevelUp
    ? (prev.upgrades.purchased.includes("pearlDiver") ? 6 : 3)
    : 0;

  return {
    ...prev,
    resources: {
      ...prev.resources,
      krill: prev.resources.krill - 1,
      voidPearls: prev.resources.voidPearls + pearlBonus,
    },
    kraken: {
      ...prev.kraken,
      hunger: didLevelUp ? 0 : newHunger,
      maxHunger: didLevelUp ? prev.kraken.maxHunger + 25 : prev.kraken.maxHunger,
      level: didLevelUp ? prev.kraken.level + 1 : prev.kraken.level,
    },
  };
}

export function manualCollect(prev) {
  return {
    ...prev,
    resources: {
      ...prev.resources,
      plankton: prev.resources.plankton + 1,
    },
  };
}

export function getBuildingCost(key, owned) {
  const base = BUILDINGS[key].baseCost;
  return Object.fromEntries(
    Object.entries(base).map(([r, amt]) => [r, Math.floor(amt * Math.pow(1.15, owned))])
  );
}

export function canAffordResources(resources, cost) {
  return Object.entries(cost).every(([r, amt]) => (resources[r] ?? 0) >= amt);
}

export function tickPearls(prev) {
  const rate = prev.upgrades.purchased.includes("pearlDiver") ? 1.5 : 1;
  return {
    ...prev,
    resources: {
      ...prev.resources,
      voidPearls: prev.resources.voidPearls + rate,
    },
  };
}

export function feedKrakenFish(prev) {
  if (prev.resources.smallFish < 1) return prev;

  const hungerGain = 15;
  const newHunger = Math.min(prev.kraken.hunger + hungerGain, prev.kraken.maxHunger);
  const didLevelUp = newHunger >= prev.kraken.maxHunger;

  const pearlBonus = didLevelUp
    ? (prev.upgrades.purchased.includes("pearlDiver") ? 6 : 3)
    : 0;

  return {
    ...prev,
    resources: {
      ...prev.resources,
      smallFish: prev.resources.smallFish - 1,
      voidPearls: prev.resources.voidPearls + pearlBonus,
    },
    kraken: {
      ...prev.kraken,
      hunger: didLevelUp ? 0 : newHunger,
      maxHunger: didLevelUp ? prev.kraken.maxHunger + 25 : prev.kraken.maxHunger,
      level: didLevelUp ? prev.kraken.level + 1 : prev.kraken.level,
    },
  };
}