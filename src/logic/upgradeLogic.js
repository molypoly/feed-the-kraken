import { UPGRADES } from "../constants/upgrades";

export function canAffordUpgrade(voidPearls, upgradeId) {
  const upgrade = findUpgrade(upgradeId);
  if (!upgrade) return false;
  return voidPearls >= upgrade.cost;
}

export function buyUpgrade(prev, upgradeId) {
  const upgrade = findUpgrade(upgradeId);
  if (!upgrade) return prev;
  if (prev.resources.voidPearls < upgrade.cost) return prev;

  // Consumable upgrades add time instead of going into purchased array
  if (upgrade.consumable) {
    return {
      ...prev,
      resources: {
        ...prev.resources,
        voidPearls: prev.resources.voidPearls - upgrade.cost,
      },
      kraken: {
        ...prev.kraken,
        tidalSurgeSeconds: prev.kraken.tidalSurgeSeconds + 15,
      },
    };
  }

  // Permanent upgrades
  if (prev.upgrades.purchased.includes(upgradeId)) return prev;

  return {
    ...prev,
    resources: {
      ...prev.resources,
      voidPearls: prev.resources.voidPearls - upgrade.cost,
    },
    upgrades: {
      ...prev.upgrades,
      purchased: [...prev.upgrades.purchased, upgradeId],
    },
  };
}

function findUpgrade(upgradeId) {
  for (const category of Object.values(UPGRADES)) {
    if (category[upgradeId]) return category[upgradeId];
  }
  return null;
}