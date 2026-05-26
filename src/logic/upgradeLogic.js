import { UPGRADES } from "../constants/upgrades";

export function canAffordUpgrade(voidPearls, upgradeId) {
  const upgrade = findUpgrade(upgradeId);
  if (!upgrade) return false;
  return voidPearls >= upgrade.cost;
}

export function buyUpgrade(prev, upgradeId) {
  if (prev.upgrades.purchased.includes(upgradeId)) return prev;
  const upgrade = findUpgrade(upgradeId);
  if (!upgrade) return prev;
  if (prev.resources.voidPearls < upgrade.cost) return prev;

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