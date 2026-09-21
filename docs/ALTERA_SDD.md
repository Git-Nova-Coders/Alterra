# SDD — Alterra
## Software/System Design Specification

**Version:** 3.0  
**Date:** 21 September 2026  
**System:** Alterra — Interactive AI World & Game

---

# 1. System Overview

Alterra is a browser-based interactive game combining:

- AI-generated visuals
- World customization
- Interactive exploration
- Branching decisions
- Inventory/items
- World reactions
- Mini-games
- Multiple endings
- AI-generated personalized endings

The system should feel like a game rather than a conventional website.

---

# 2. High-Level Architecture

```text
                         USER
                          │
                          ▼
                  ┌───────────────┐
                  │ React Frontend│
                  └───────┬───────┘
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
       World Director   Game UI      Assets
             │            │            │
             ▼            ▼            ▼
       World Config    Game State   AI Visuals
             │            │
             └──────┬─────┘
                    ▼
             Decision Engine
                    │
                    ▼
              Final Game State
                    │
                    ▼
                AI Service
                    │
                    ▼
           Personalized Ending
```

---

# 3. Recommended Technology

## Frontend

- React
- Vite
- JavaScript or TypeScript
- CSS or Tailwind CSS
- Framer Motion

## Visual Layer

Recommended options:

- CSS animations
- SVG
- HTML Canvas
- Optional Three.js for advanced effects

The game does not require complex 3D graphics.

## AI

Use AI only where it adds meaningful value:

- AI-generated visuals prepared before deployment.
- AI-generated world title/tagline.
- AI-generated final ending.

## Hosting

Possible:

- Vercel
- Netlify
- Render

---

# 4. Application Structure

```text
alterra/
│
├── public/
│   ├── images/
│   │   ├── cyber/
│   │   ├── fantasy/
│   │   └── mystery/
│   ├── sounds/
│   └── icons/
│
├── src/
│   ├── components/
│   │   ├── Landing.jsx
│   │   ├── WorldSelection.jsx
│   │   ├── WorldDirector.jsx
│   │   ├── MorphTransition.jsx
│   │   ├── WorldIntro.jsx
│   │   ├── RoleSelection.jsx
│   │   ├── TraitSelection.jsx
│   │   ├── GameScene.jsx
│   │   ├── InteractiveObject.jsx
│   │   ├── Inventory.jsx
│   │   ├── Encounter.jsx
│   │   ├── Artifact.jsx
│   │   ├── WorldReaction.jsx
│   │   ├── MiniChallenge.jsx
│   │   ├── FinalDecision.jsx
│   │   ├── Ending.jsx
│   │   ├── WorldDNA.jsx
│   │   └── Replay.jsx
│   │
│   ├── data/
│   │   ├── worlds.js
│   │   ├── roles.js
│   │   ├── traits.js
│   │   ├── objects.js
│   │   ├── events.js
│   │   └── endings.js
│   │
│   ├── services/
│   │   ├── aiService.js
│   │   └── visualService.js
│   │
│   ├── utils/
│   │   ├── gameEngine.js
│   │   ├── scoring.js
│   │   └── fallback.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
└── README.md
```

---

# 5. Application State Machine

```text
LANDING
   ↓
WORLD_SELECT
   ↓
WORLD_DIRECTOR
   ↓
MORPHING
   ↓
WORLD_READY
   ↓
ROLE_SELECT
   ↓
TRAIT_SELECT
   ↓
EXPLORATION
   ↓
ENCOUNTER
   ↓
CONSEQUENCE
   ↓
ARTIFACT
   ↓
ARTIFACT_DECISION
   ↓
WORLD_REACTION
   ↓
MINI_CHALLENGE
   ↓
FINAL_DECISION
   ↓
AI_ENDING
   ↓
RESULT
   ↓
REPLAY
```

---

# 6. Global Game State

```javascript
const initialGameState = {
  // World creation
  world: null,
  mood: "neutral",
  intensity: 50,
  chaos: 50,
  atmosphere: "night",

  // Character
  role: null,
  trait: null,

  // Exploration
  discoveredObjects: [],
  inventory: [],

  // Story
  encounterChoice: null,
  artifact: null,
  artifactDecision: null,

  // Challenge
  challengeScore: 0,
  challengeResult: null,

  // Final
  finalDecision: null,
  endingType: null,
  aiEnding: null
};
```

---

# 7. World Data

```javascript
const worlds = {
  cyber: {
    name: "Cyber City",
    visual: "/images/cyber/city.webp",
    artifact: "Quantum Core",
    theme: "digital"
  },

  fantasy: {
    name: "Enchanted Forest",
    visual: "/images/fantasy/forest.webp",
    artifact: "Heart of the Forest",
    theme: "magical"
  },

  mystery: {
    name: "Lost Station",
    visual: "/images/mystery/station.webp",
    artifact: "Signal Key",
    theme: "mysterious"
  }
};
```

---

# 8. World Director Data

```javascript
const worldConfig = {
  mood: "dark",
  intensity: 70,
  chaos: 60,
  atmosphere: "night"
};
```

The visual system derives effects from this state.

Example:

```javascript
function calculateVisualState(config) {
  return {
    brightness: config.intensity,
    particleSpeed: config.intensity,
    distortion: config.chaos,
    fog: config.mood === "dark",
    ambientLight: config.atmosphere
  };
}
```

---

# 9. Roles

```javascript
const roles = {
  explorer: {
    name: "Explorer",
    ability: "Reveal hidden objects"
  },

  hacker: {
    name: "Hacker",
    ability: "Unlock digital systems"
  },

  guardian: {
    name: "Guardian",
    ability: "Protect important objects"
  }
};
```

---

# 10. Traits

```javascript
const traits = {
  brave: {
    name: "Brave",
    effect: "Unlock risky options"
  },

  curious: {
    name: "Curious",
    effect: "Reveal additional clues"
  },

  cautious: {
    name: "Cautious",
    effect: "Reduce negative consequences"
  }
};
```

---

# 11. Interactive Objects

```javascript
const objects = [
  {
    id: "terminal",
    action: "inspect",
    reward: "data_chip"
  },
  {
    id: "chest",
    action: "open",
    reward: "key"
  },
  {
    id: "artifact",
    action: "discover",
    reward: "artifact"
  }
];
```

Interaction pipeline:

```text
CLICK
 ↓
Validate
 ↓
Check Role / Inventory
 ↓
Update Game State
 ↓
Trigger Animation
 ↓
Unlock Next Interaction
```

---

# 12. Inventory System

```javascript
inventory = [
  "key",
  "data_chip"
];
```

Items can unlock later interactions.

Example:

```text
Data Chip
   ↓
Terminal
   ↓
Hidden Route
```

---

# 13. Decision Engine

The decision engine calculates consequences from the current game state.

```javascript
function calculateOutcome(state) {

  let score = 0;

  if (state.trait === "brave") score += 1;
  if (state.trait === "curious") score += 1;

  if (state.encounterChoice === "help") score += 2;
  if (state.encounterChoice === "take") score -= 1;

  if (state.artifactDecision === "save") score += 2;
  if (state.artifactDecision === "destroy") score -= 2;

  score += state.challengeScore;

  if (state.finalDecision === "stay") score += 1;

  return score;
}
```

The exact scoring logic may be adjusted during implementation.

---

# 14. World Reaction System

```javascript
const reactions = {
  save: {
    brightness: 1.2,
    particleMode: "stable",
    distortion: 0
  },

  control: {
    brightness: 0.9,
    particleMode: "unstable",
    distortion: 0.5
  },

  destroy: {
    brightness: 0.7,
    particleMode: "collapse",
    distortion: 1
  }
};
```

The reaction should affect:

- Lighting
- Particles
- Animation
- Environment overlays
- Object movement
- Sound
- Available routes

---

# 15. Mini-Game

Recommended implementation:

## Symbol Sequence

```text
1. Generate sequence.
2. Display sequence.
3. Hide sequence.
4. Accept player input.
5. Compare input.
6. Calculate score.
7. Store challenge result.
```

Example:

```javascript
const sequence = ["▲", "●", "◆", "★"];

if (
  playerSequence.join("") === sequence.join("")
) {
  challengeScore = 2;
} else {
  challengeScore = -1;
}
```

Target duration: 10–30 seconds.

---

# 16. AI Service

Runtime AI should be deliberately small.

```javascript
async function generateEnding(state) {

  const prompt = `
Create a 30-word cinematic ending.

World: ${state.world}
Mood: ${state.mood}
Role: ${state.role}
Trait: ${state.trait}
Encounter: ${state.encounterChoice}
Artifact Decision: ${state.artifactDecision}
Challenge: ${state.challengeResult}
Final Decision: ${state.finalDecision}
`;

  return await callAI(prompt);
}
```

---

# 17. AI Failure Handling

The game must never depend on successful runtime AI.

```javascript
async function getEnding(state) {
  try {
    return await generateEnding(state);
  } catch (error) {
    return getFallbackEnding(state);
  }
}
```

Store fallback endings locally.

---

# 18. AI Visual Strategy

AI-generated visuals should normally be generated before the event.

Store:

```text
public/images/cyber/
public/images/fantasy/
public/images/mystery/
```

Use frontend transformations for:

- Mood
- Intensity
- Chaos
- Atmosphere
- World reaction

This makes the core experience reliable even if external AI services fail.

---

# 19. Component Responsibilities

## Landing.jsx

Displays:

- Alterra title
- Tagline
- Enter button

## WorldSelection.jsx

Handles:

- World cards
- World preview
- Selection

## WorldDirector.jsx

Handles:

- Mood
- Intensity
- Chaos
- Atmosphere
- Morph button

## MorphTransition.jsx

Handles:

- Loading state
- Cinematic transition
- AI world identity

## GameScene.jsx

Handles:

- Main environment
- Interactive objects
- Player state
- Environment effects

## InteractiveObject.jsx

Handles:

- Object clicks
- Object states
- Rewards
- Visual reactions

## Inventory.jsx

Displays collected items.

## Encounter.jsx

Handles the first major branching decision.

## Artifact.jsx

Handles artifact discovery.

## WorldReaction.jsx

Applies visual consequences.

## MiniChallenge.jsx

Runs the final gameplay challenge.

## FinalDecision.jsx

Handles:

- Escape
- Stay

## Ending.jsx

Displays:

- Final visual
- Ending title
- AI narrative

## WorldDNA.jsx

Displays the player's journey as a visual summary.

---

# 20. Security

Never expose API secrets in frontend code.

Do NOT:

```javascript
const API_KEY = "secret";
```

Use environment variables and a server/serverless function when runtime AI requires a secret.

---

# 21. Performance

- Compress images.
- Prefer WebP.
- Lazy-load non-critical assets.
- Keep AI responses short.
- Avoid unnecessary API calls.
- Avoid large video backgrounds.
- Keep animations bounded.
- Avoid excessive particle counts.
- Ensure the game loads quickly.

---

# 22. Testing

## Functional

- [ ] World selection works.
- [ ] World Director works.
- [ ] Morph works.
- [ ] Role selection works.
- [ ] Trait selection works.
- [ ] Objects react.
- [ ] Inventory works.
- [ ] Encounter choices change state.
- [ ] Artifact works.
- [ ] World reaction works.
- [ ] Mini-game works.
- [ ] Final decision works.
- [ ] Ending changes.
- [ ] Replay resets state.

## AI

- [ ] AI prompt is short.
- [ ] AI output is short.
- [ ] API failure has fallback.
- [ ] API key is protected.

## Visual

- [ ] AI visuals load.
- [ ] Text remains readable.
- [ ] Transitions work.
- [ ] World reaction is obvious.
- [ ] Projector/full-screen view works.

---

# 23. Definition of Done

```text
[ ] Player can start
[ ] Player can choose a world
[ ] Player can customize the world
[ ] Player can morph the world
[ ] Player can enter the world
[ ] Player can choose a role
[ ] Player can choose a trait
[ ] Player can explore
[ ] Player can collect an item
[ ] Player can make a meaningful choice
[ ] Player can discover the artifact
[ ] Artifact decision changes the world
[ ] Player can complete the mini-game
[ ] Player can make the final decision
[ ] AI creates the final short ending
[ ] Final result reflects the journey
[ ] Player can replay
[ ] AI fallback works
[ ] Website is deployed
```
