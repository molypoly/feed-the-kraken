export default function ActionButtons({ onCollect, onFeed, krillCount }) {
  return (
    <div className="max-w-xl mx-auto mb-6 text-center">
      <button
        onClick={onCollect}
        className="bg-cyan-800 hover:bg-cyan-700 text-cyan-100 px-6 py-3 rounded-xl text-sm font-bold"
      >
        🌊 Collect Plankton
      </button>
      <button
        onClick={onFeed}
        disabled={krillCount < 1}
        className={`ml-3 px-6 py-3 rounded-xl text-sm font-bold ${
          krillCount >= 1
            ? "bg-purple-800 hover:bg-purple-700 text-cyan-100 cursor-pointer"
            : "bg-slate-700 text-slate-500 cursor-not-allowed"
        }`}
      >
        🦑 Feed Kraken
      </button>
    </div>
  );
}