# 🦑 Feed the Kraken

An incremental/idle browser game built with React + Vite + Tailwind CSS.

## Concept
You manage a deep sea food chain, feeding the ancient Kraken before it starves. 
Build up a production chain from plankton to krill, earn Void Pearls, and unlock 
upgrades to keep the Kraken fed as its hunger grows with each level.

## Game Loop
- Click to collect plankton manually
- Buy buildings to automate production
- Convert plankton → krill via Krill Clusters
- Feed krill to the Kraken to fill its hunger bar
- Don't let hunger hit 0 or it's game over
- Level up the Kraken to increase the challenge
- Earn Void Pearls to unlock Baits and Boosts

## Tech Stack
- React 19
- Vite 8
- Tailwind CSS v4

## Running Locally
```bash
npm install
npm run dev
```

## Planned Features
- Small fish resource tier
- More bait unlocks and boost upgrades
- Save/load via localStorage
- Godot port for visual layer