export default function Resources({ resources, productionRates }) {
  const resourceList = [
    { key: "plankton", label: "🟢 Plankton" },
    { key: "krill", label: "🦐 Krill" },
    { key: "smallFish", label: "🐟 Small Fish" },
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h2 className="text-cyan-400 font-bold mb-3">Resources</h2>

      {resourceList.map(({ key, label }) => {
        const amount = resources[key] ?? 0;
        const rate = productionRates[key] ?? 0;

        return (
          <div key={key} className="flex justify-between text-sm mb-2" key={key}>
            <span>{label}</span>
            <span className="flex gap-3 items-center">
              {rate > 0 && (
                <span className="text-cyan-600 text-xs">+{rate.toFixed(1)}/s</span>
              )}
              <span>{Math.floor(amount)}</span>
            </span>
          </div>
        );
      })}

      <div className="flex justify-between text-sm mt-3 pt-3 border-t border-slate-700">
        <span>💎 Void Pearls</span>
        <span>{Math.floor(resources.voidPearls)}</span>
      </div>
    </div>
  );
}