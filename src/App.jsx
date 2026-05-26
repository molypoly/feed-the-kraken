import { useState, useEffect } from "react";
import { INITIAL_STATE } from "./state/initialState";
import { tick, tickPearls, buyBuilding, feedKraken, manualCollect } from "./logic/gameLogic";
import { buyUpgrade } from "./logic/upgradeLogic";
import HungerBar from "./components/HungerBar";
import Resources from "./components/Resources";
import Buildings from "./components/Buildings";
import ActionButtons from "./components/ActionButtons";
import UpgradeShop from "./components/UpgradeShop";

const TICK_RATE = 1000;
const PEARL_TICK_RATE = 45000;

export default function App() {
  const [state, setState] = useState(INITIAL_STATE);
  const [gameOver, setGameOver] = useState(false);

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

  // Pearl trickle tick
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setState((prev) => tickPearls(prev));
    }, PEARL_TICK_RATE);
    return () => clearInterval(interval);
  }, [gameOver]);

  if (gameOver) {
    return (
      <div className="min-h-screen bg-slate-900 text-cyan-100 flex flex-col items-center justify-center font-mono">
        <h1 className="text-5xl font-bold text-red-500 mb-4">💀 The Kraken Has Starved</h1>
        <p className="text-slate-400 mb-8">The deep grows silent. You have failed your master.</p>
        <button
          onClick={() => { setState(INITIAL_STATE); setGameOver(false); }}
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
      <p className="text-center text-slate-400 mb-6 text-sm">The deep hungers. Obey.</p>

      {/* Hunger Bar */}
      <HungerBar kraken={kraken} />

      {/* Action Buttons */}
      <ActionButtons
        onCollect={() => setState((prev) => manualCollect(prev))}
        onFeed={() => setState((prev) => feedKraken(prev))}
        krillCount={resources.krill}
      />

      {/* Main layout */}
      <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6">
        <Resources resources={resources} />
        <Buildings
          resources={resources}
          buildings={buildings}
          onBuy={(key) => setState((prev) => buyBuilding(prev, key))}
        />
        <UpgradeShop
          voidPearls={resources.voidPearls}
          purchased={upgrades.purchased}
          onBuy={(id) => setState((prev) => buyUpgrade(prev, id))}
        />
      </div>
    </div>
  );
}