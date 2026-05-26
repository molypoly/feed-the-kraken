export default function Resources({ resources }) {
  return (
    <div className="bg-slate-800 rounded-xl p-4">
      <h2 className="text-cyan-400 font-bold mb-3">Resources</h2>
      <div className="flex justify-between text-sm mb-2">
        <span>🟢 Plankton</span>
        <span>{Math.floor(resources.plankton)}</span>
      </div>
      <div className="flex justify-between text-sm mb-2">
        <span>🦐 Krill</span>
        <span>{Math.floor(resources.krill)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>💎 Void Pearls</span>
        <span>{Math.floor(resources.voidPearls)}</span>
      </div>
    </div>
  );
}