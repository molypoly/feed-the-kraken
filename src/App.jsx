//app.jsx
import { useState, useEffect, useRef } from "react";

const TICK_RATE = 1000; // 1 second

const BUILDINGS = {
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

const INITIAL_STATE = {
  resources: {
    plankton: 0,
    krill: 0,
  },
  buildings: {
    planktonBloom: 0,
    krillCluster: 0,
  },
  kraken: {
    hunger: 0,
    maxHunger: 100,
  },
};

function canAfford(resources, cost) {
  return Object.entries(cost).every(([r, amt]) => (resources[r] ?? 0) >= amt);
}

function getBuildingCost(buildingKey, owned) {
  const base = BUILDINGS[buildingKey].baseCost;
  return Object.fromEntries(
    Object.entries(base).map(([r, amt]) => [r, Math.floor(amt * Math.pow(1.15, owned))])
  );
}

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // Game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const newResources = { ...prev.resources };

        // Production from buildings
        Object.entries(prev.buildings).forEach(([key, count]) => {
          const prod = BUILDINGS[key].production;
          Object.entries(prod).forEach(([resource, amount]) => {
            newResources[resource] = (newResources[resource] ?? 0) + amount * count;
          });
        });

        return { ...prev, resources: newResources };
      });
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, []);

  function buyBuilding(key) {
    setState((prev) => {
      const cost = getBuildingCost(key, prev.buildings[key]);
      if (!canAfford(prev.resources, cost)) return prev;

      const newResources = { ...prev.resources };
      Object.entries(cost).forEach(([r, amt]) => {
        newResources[r] -= amt;
      });

      return {
        ...prev,
        resources: newResources,
        buildings: { ...prev.buildings, [key]: prev.buildings[key] + 1 },
      };
    });
  }

  function manualCollect() {
    setState((prev) => ({
      ...prev,
      resources: {
        ...prev.resources,
        plankton: prev.resources.plankton + 1,
      },
    }));
  }

  function feedKraken() {
    setState((prev) => {
      if (prev.resources.krill < 1) return prev;
      return {
        ...prev,
        resources: {
          ...prev.resources,
          krill: prev.resources.krill - 1,
        },
        kraken: {
          ...prev.kraken,
          hunger: Math.min(prev.kraken.hunger + 5, prev.kraken.maxHunger),
        },
      };
    });
  }

  const { resources, buildings, kraken } = state;
  const hungerPct = (kraken.hunger / kraken.maxHunger) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-cyan-100 p-6 font-mono">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">🦑 Feed the Kraken</h1>
      <p className="text-center text-slate-400 mb-6 text-sm">The deep hungers. Obey.</p>

      {/* Kraken hunger bar */}
      <div className="max-w-xl mx-auto mb-8">
        <div className="flex justify-between text-sm mb-1">
          <span>Kraken Hunger</span>
          <span>{Math.floor(kraken.hunger)} / {kraken.maxHunger}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-4">
          <div
            className="bg-cyan-500 h-4 rounded-full transition-all"
            style={{ width: `${hungerPct}%` }}
          />
        </div>
      </div>

      <div className="max-w-xl mx-auto mb-6 text-center">
        <button
          onClick={manualCollect}
          className="bg-cyan-800 hover:bg-cyan-700 text-cyan-100 px-6 py-3 rounded-xl text-sm font-bold"
        >
          🌊 Collect Plankton
        </button>

        <button
  onClick={feedKraken}
  disabled={resources.krill < 1}
  className={`ml-3 px-6 py-3 rounded-xl text-sm font-bold ${
    resources.krill >= 1
      ? "bg-purple-800 hover:bg-purple-700 text-cyan-100 cursor-pointer"
      : "bg-slate-700 text-slate-500 cursor-not-allowed"
  }`}
>
  🦑 Feed Kraken
</button>
      </div>

      

      <div className="max-w-xl mx-auto grid grid-cols-2 gap-6">
        {/* Resources */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-cyan-400 font-bold mb-3">Resources</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>🟢 Plankton</span>
            <span>{Math.floor(resources.plankton)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>🦐 Krill</span>
            <span>{Math.floor(resources.krill)}</span>
          </div>
        </div>

        {/* Buildings */}
        <div className="bg-slate-800 rounded-xl p-4">
          <h2 className="text-cyan-400 font-bold mb-3">Buildings</h2>
          {Object.entries(BUILDINGS).map(([key, building]) => {
            const cost = getBuildingCost(key, buildings[key]);
            const affordable = canAfford(resources, cost);
            return (
              <div key={key} className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{building.name}</span>
                  <span className="text-slate-400">owned: {buildings[key]}</span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{building.description}</p>
                <button
                  onClick={() => buyBuilding(key)}
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
      </div>
    </div>
  );
}