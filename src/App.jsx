// App.jsx
import { tick, tickPearls, buyBuilding, feedKraken, feedKrakenFish, manualCollect } from "./logic/gameLogic";
import { useState, useEffect } from "react";
import { INITIAL_STATE } from "./state/initialState";
import { buyUpgrade } from "./logic/upgradeLogic";
import HungerBar from "./components/HungerBar";
import Resources from "./components/Resources";
import Buildings from "./components/Buildings";
import ActionButtons from "./components/ActionButtons";
import UpgradeShop from "./components/UpgradeShop";
import { saveGame, loadGame, deleteSave } from "./logic/saveLoad";


const TICK_RATE = 1000;
const PEARL_TICK_RATE = 90000;

export default function App() {
  const [state, setState] = useState(() => loadGame() || INITIAL_STATE);
  const [gameOver, setGameOver] = useState(false);
  const [, setResetKey] = useState(0); // Used to reset intervals in child components

  // Main game tick
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setState((prev) => {
        const next = tick(prev);
        if (next.kraken.hunger <= 0) {
          setGameOver(true);
        }
        return next;
      });
    }, TICK_RATE);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Krill tick - runs every 3 seconds
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.buildings.krillCluster === 0) return prev;
        const newResources = { ...prev.resources };
        const count = prev.buildings.krillCluster;
        const available = newResources.plankton ?? 0;
        const affordableCount = Math.min(count, Math.floor(available / 3));
        const krillRate = count / 5;
        if (affordableCount === 0) return { ...prev, productionRates: { ...prev.productionRates, krill: krillRate } };
        newResources.plankton = Math.max(0, newResources.plankton - 3 * affordableCount);
        newResources.krill = (newResources.krill ?? 0) + affordableCount;
        return { ...prev, resources: newResources, productionRates: { ...prev.productionRates, krill: krillRate } };
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Pearl trickle tick
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setState((prev) => tickPearls(prev));
    }, PEARL_TICK_RATE);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Save game on every state change
  useEffect(() => {
    saveGame(state);
  }, [state]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-900 text-cyan-100 flex flex-col items-center justify-center font-mono">
        <h1 className="text-5xl font-bold text-red-500 mb-4">💀 The Kraken Has Starved</h1>
        <p className="text-slate-400 mb-8">The deep grows silent. You have failed your master.</p>
        <button
          onClick={() => { deleteSave(); setState(INITIAL_STATE); setGameOver(false); setResetKey(k => k + 1); }}
          className="bg-cyan-800 hover:bg-cyan-700 px-8 py-4 rounded-xl font-bold"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { resources, buildings, kraken, upgrades } = state;

  return (
    <div className="min-h-screen bg-slate-900 text-cyan-100 p-6 font-mono">
      {/* Header */}
      <h1 className="text-3xl font-bold text-center text-cyan-400 mb-2">🦑 Feed the Kraken</h1>
      <p className="text-center text-slate-400 mb-4 text-sm">The deep hungers. Obey.</p>
      <div className="text-center mb-6">
        <button
          onClick={() => { deleteSave(); setState(INITIAL_STATE); setGameOver(false); setResetKey(k => k + 1); }}
          className="text-xs text-slate-600 hover:text-slate-400 underline"
        >
          Reset Game
        </button>
      </div>

      {/* Hunger Bar */}
      <HungerBar kraken={kraken} />

      {/* Action Buttons */}
      <ActionButtons
        onCollect={() => setState((prev) => manualCollect(prev))}
        onFeed={() => setState((prev) => feedKraken(prev))}
        onFeedFish={() => setState((prev) => feedKrakenFish(prev))}
        krillCount={resources.krill}
        fishCount={resources.smallFish}
      />

      {/* Main layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        <Resources resources={resources} productionRates={state.productionRates} />
        <Buildings
          resources={resources}
          buildings={buildings}
          onBuy={(key) => setState((prev) => buyBuilding(prev, key))}
          purchased={upgrades.purchased}
        />
        <UpgradeShop
          voidPearls={resources.voidPearls}
          purchased={upgrades.purchased}
          onBuy={(id) => setState((prev) => buyUpgrade(prev, id))}
          tidalSurgeSeconds={kraken.tidalSurgeSeconds}
        />
      </div>
    </div>
  );
}