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

## 🔜 Phase 2 Roadmap & Extension Points

Phase 2 will directly plug into the existing architecture:
1. **Interactive Object Exploration (`GameScene.jsx`, `InteractiveObject.jsx`)**: Connects to `state.discoveredObjects` and `state.inventory`.
2. **Entity Confrontation (`Encounter.jsx`)**: Consumes `state.role` and `state.mood`.
3. **Artifact Sanctum & World Reaction (`Artifact.jsx`, `WorldReaction.jsx`)**: Visual engine reacts dynamically using `VisualService`.
4. **Mini-Challenge (`MiniChallenge.jsx`)**: Reflex/puzzle mini-game updating `challengeScore`.
5. **AI Ending Dossier (`Ending.jsx`, `WorldDNA.jsx`)**: Consumes `AIService.generateEnding(state)`.
