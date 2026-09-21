# ALTERA — "Your World. Your Choices. Your Reality."

> **An AI-powered interactive browser game experience.**  
> The judge creates a world, calibrates its atmosphere, triggers an AI reality morphosis, steps directly into the generated world, plays inside it, makes consequential choices, and receives a personalized reality chronicle.

---

## 🏛️ Phase 1 Architecture Overview

Phase 1 establishes the rock-solid foundation for Alterra, providing modular decoupling between state, presentation, services, and game engine rules.

```
alterra/
├── docs/                   # Full System PRD, SDD, and Developer Guides
├── public/                 # Static assets, sound stubs, and icons
├── src/
│   ├── components/         # Modular game view components & HUD
│   │   ├── HUD.jsx                     # Telemetry header (chaos, world, state)
│   │   ├── StageNavigator.jsx          # Matrix flow stepper & dev teleportation
│   │   ├── Landing.jsx                 # Cinematic entry screen
│   │   ├── WorldSelection.jsx          # 3 Archetypal biomes
│   │   ├── WorldDirector.jsx           # Atmosphere & entropy physics controls
│   │   ├── MorphTransition.jsx         # Procedural morphing & World DNA hashing
│   │   └── GenericStageViewer.jsx      # Reusable container for upcoming stages
│   ├── context/
│   │   └── GameStateContext.jsx        # Centralized Reducer & state machine
│   ├── data/
│   │   ├── gameState.js                # Canonical 18-stage machine & initial state
│   │   ├── worlds.js                   # Cyber, Fantasy & Mystery world presets
│   │   └── roles.js                    # Archetypal character roles & traits
│   ├── services/
│   │   ├── aiService.js                # Local neural fallback + optional Gemini API
│   │   └── visualService.js            # Atmospheric filter & dynamic shaders
│   ├── utils/
│   │   └── gameEngine.js               # State validation & World DNA generator
│   ├── App.jsx                         # Main shell & stage router
│   ├── main.jsx                        # React root entry
│   └── index.css                       # Cyberpunk/sci-fi theme & grid styling
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🕹️ Core State Schema

The central state (`src/data/gameState.js`) manages all parameters defined in the SDD:

| Field | Type | Description |
|---|---|---|
| `world` | `Object \| null` | Targeted world archetype |
| `mood` | `string` | Emotional resonance (`serene`, `mysterious`, `dramatic`, `apocalyptic`) |
| `intensity` | `number` (0-100) | Atmospheric pressure and environmental vigor |
| `chaos` | `number` (0-100) | Entropy and probability fluctuation index |
| `atmosphere` | `string` | Time/light envelope (`dawn`, `noon`, `twilight`, `night`, `storm`) |
| `role` | `Object \| null` | Selected consciousness avatar |
| `trait` | `Object \| null` | Specialized operative passive skill |
| `inventory` | `Array` | Discovered artifacts and tools |
| `discoveredObjects` | `Array` | Log of scanned objects in the biome |
| `encounterChoice` | `string \| null` | Consequential branching option |
| `artifact` | `string \| null` | World relic name/metadata |
| `artifactDecision` | `string \| null` | Action taken on the relic |
| `challengeScore` | `number` | Score in the mini-challenge |
| `challengeResult` | `string \| null` | Outcome rating |
| `finalDecision` | `string \| null` | Climax choice |
| `endingType` | `string \| null` | Calculated resolution archetype |
| `aiEnding` | `Object \| null` | AI synthesized epilogue & World DNA |

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---
## 🎮 Phase 2 & 3 Implementation Completed

### 1. World Creation (M5 — M9)
- **M5 World Selector (`WorldSelection.jsx`)**: Cyber (Neo-Kowloon 2099), Fantasy (Aethelgard Canopy), and Mystery (Orbital Station Tartarus) with full artifact and narrative presets.
- **M6 & M7 World Director (`WorldDirector.jsx`)**: Real-time interactive controls for Mood (Serene, Mysterious, Dramatic, Cataclysmic), Environmental Intensity (10-100%), Quantum Chaos (0-100%), and Atmospheric Envelopes (Dawn, Noon, Twilight, Night, Storm). All controls visibly and immediately modify the viewport shaders and physics.
- **M8 AI Morph Transition (`MorphTransition.jsx`)**: Cinematic compilation sequence executing:
  1. `WORLD INITIALIZING...`
  2. `ATMOSPHERE SYNCHRONIZING...`
  3. `AI SIGNATURE GENERATED...`
  4. `REALITY STABILIZED`
- **M9 AI Visual Integration (`WorldCanvasVisual.jsx`)**: Custom SVG shader canvases for each world that dynamically respond to lighting, glitch spikes, particle density, and color grading without requiring remote network calls.

### 2. Game Foundation (M10 — M16)
- **M10 Role Selection (`RoleSelection.jsx`)**: Explorer (reveals hidden objects/caches), Hacker (unlocks digital terminals), Guardian (protects fragile relics).
- **M11 Trait Selection (`TraitSelection.jsx`)**: Brave (bold high-risk payoffs), Curious (extra sensory radar & clues), Cautious (damage/consequence mitigation).
- **M12 & M13 Interactive Exploration & Objects (`GameScene.jsx`)**: 3-5 clickable hotspots per world mapped directly to the visual canvas, featuring role-dependent abilities and sequential puzzle unlocks (e.g., Terminal ➔ Encrypted Data Chip ➔ Nanosteel Locker ➔ Quantum Latch Key ➔ Quantum Core).
- **M14 Inventory System (`HUD.jsx`, `GameScene.jsx`)**: Collectible keycards, relics, and tools with reactive cross-object unlocking and persistence in central game state.
- **M15 & M16 First Encounter & Branching Consequences (`Encounter.jsx`, `Consequence.jsx`)**: Critical world encounters (Unit 734, Sylvan Chimera, Spatial Phantom) offering meaningful choices (**HELP / HIDE / TAKE**) that immediately alter world entropy, award unique inventory items, and shift environmental shaders.

---

## 🔜 Remaining Milestones (Phase 4)
- **M17 Artifact Sanctum & Harmonization Decision** (Save / Control / Destroy)
- **M18 World Reaction Engine** (dynamic biome shifts based on relic choice)
- **M19 Mini-Challenge** (neural overclock timed node mini-game)
- **M20 Final Decision** (Ascend / Stabilize / Diverge)
- **M21 AI Ending Chronicle & World DNA Dossier** (complete epilogue synthesis)
