export default function HungerBar({ kraken }) {
  const hungerPct = (kraken.hunger / kraken.maxHunger) * 100;
  const isLow = hungerPct < 25;

  return (
    <div className="max-w-xl mx-auto mb-8">
      <div className="flex justify-between text-sm mb-1">
        <span>
          Kraken Hunger
          <span className="ml-2 text-slate-400 text-xs">Level {kraken.level}</span>
        </span>
        <span className={isLow ? "text-red-400 font-bold" : ""}>
          {Math.floor(kraken.hunger)} / {kraken.maxHunger}
        </span>
      </div>
      <div className="w-full bg-slate-700 rounded-full h-4">
        <div
          className={`h-4 rounded-full transition-all ${isLow ? "bg-red-500" : "bg-cyan-500"}`}
          style={{ width: `${hungerPct}%` }}
        />
      </div>
      {isLow && (
        <p className="text-red-400 text-xs mt-1 text-center animate-pulse">
          ⚠️ The Kraken grows restless... feed it!
        </p>
      )}
    </div>
  );
}