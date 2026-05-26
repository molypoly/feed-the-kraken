export default function ActionButtons({ onCollect, onFeed, onFeedFish, krillCount, fishCount }) {
  return (
    <div className="max-w-xl mx-auto mb-6 text-center flex justify-center gap-3">
      <button
        onClick={onCollect}
        className="bg-cyan-800 hover:bg-cyan-700 text-cyan-100 px-6 py-3 rounded-xl text-sm font-bold"
      >
        🌊 Collect Plankton
      </button>
      <button
        onClick={onFeed}
        disabled={krillCount < 1}
        className={`px-6 py-3 rounded-xl text-sm font-bold ${
          krillCount >= 1
            ? "bg-purple-800 hover:bg-purple-700 text-cyan-100 cursor-pointer"
            : "bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        🦑 Feed Krill
      </button>
      <button
        onClick={onFeedFish}
        disabled={fishCount < 1}
        className={`px-6 py-3 rounded-xl text-sm font-bold ${
          fishCount >= 1
            ? "bg-blue-800 hover:bg-blue-700 text-cyan-100 cursor-pointer"
            : "bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        🐟 Feed Fish
      </button>
    </div>
  );
}