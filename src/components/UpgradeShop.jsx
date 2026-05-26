import { useState } from "react";
import { UPGRADES } from "../constants/upgrades";

export default function UpgradeShop({ voidPearls, purchased, onBuy, tidalSurgeSeconds }) {
  const [activeTab, setActiveTab] = useState("baits");

  const currentUpgrades = UPGRADES[activeTab];

  return (
    <div className="bg-slate-800 rounded-xl p-4 h-full">
      <h2 className="text-cyan-400 font-bold mb-1">Upgrade Shop</h2>
      <p className="text-xs text-slate-400 mb-3">💎 {Math.floor(voidPearls)} Void Pearls</p>

      {/* Tabs */}
      <div className="flex mb-4">
        <button
          onClick={() => setActiveTab("baits")}
          className={`flex-1 text-xs py-1 rounded-l ${
            activeTab === "baits"
              ? "bg-cyan-700 text-white"
              : "bg-slate-700 text-slate-400 hover:bg-slate-600"
          }`}
        >
          🎣 Baits
        </button>
        <button
          onClick={() => setActiveTab("boosts")}
          className={`flex-1 text-xs py-1 rounded-r ${
            activeTab === "boosts"
              ? "bg-purple-700 text-white"
              : "bg-slate-700 text-slate-400 hover:bg-slate-600"
          }`}
        >
          ⚡ Boosts
        </button>
      </div>

      {/* Upgrades */}
      {Object.values(currentUpgrades).map((upgrade) => {
        const isPurchased = purchased.includes(upgrade.id);
        const canAfford = voidPearls >= upgrade.cost;
        const isActive = upgrade.consumable && tidalSurgeSeconds > 0;

        return (
          <div key={upgrade.id} className="mb-3 border border-slate-700 rounded-lg p-2">
            <div className="flex justify-between text-sm mb-1">
              <span className={isPurchased ? "text-slate-500 line-through" : ""}>{upgrade.name}</span>
              <span className="text-xs text-yellow-400">💎 {upgrade.cost}</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">{upgrade.description}</p>

            {/* Show countdown for consumable upgrades */}
            {upgrade.consumable && isActive && (
              <p className="text-xs text-cyan-400 mb-1 animate-pulse">
                ⚡ Active: {tidalSurgeSeconds}s remaining
              </p>
            )}

            <button
              onClick={() => onBuy(upgrade.id)}
              disabled={isPurchased || !canAfford}
              className={`w-full text-xs py-1 px-2 rounded ${
                isPurchased
                  ? "bg-slate-700 text-slate-500 cursor-not-allowed"
                  : canAfford
                  ? "bg-cyan-700 hover:bg-cyan-600 cursor-pointer"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              {isPurchased ? "Purchased" : `Buy — ${upgrade.cost} Void Pearls`}
            </button>
          </div>
        );
      })}
    </div>
  );
}