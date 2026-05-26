import { BUILDINGS } from "../constants/buildings";
import { getBuildingCost, canAffordResources } from "../logic/gameLogic";

export default function Buildings({ resources, buildings, onBuy }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h2 className="text-cyan-400 font-bold mb-3">Buildings</h2>
      {Object.entries(BUILDINGS).map(([key, building]) => {
        const cost = getBuildingCost(key, buildings[key]);
        const affordable = canAffordResources(resources, cost);
        return (
          <div key={key} className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>{building.name}</span>
              <span className="text-slate-400">owned: {buildings[key]}</span>
            </div>
            <p className="text-xs text-slate-500 mb-1">{building.description}</p>
            <button
              onClick={() => onBuy(key)}
              disabled={!affordable}
              className={`w-full text-xs py-1 px-2 rounded ${
                affordable
                  ? "bg-cyan-700 hover:bg-cyan-600 cursor-pointer"
                  : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
            >
              Cost: {Object.entries(cost).map(([r, amt]) => `${amt} ${r}`).join(", ")}
            </button>
          </div>
        );
      })}
    </div>
  );
}