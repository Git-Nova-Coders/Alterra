# PRD — Alterra
## AI-Powered Interactive World & Game Experience

**Version:** 3.0  
**Date:** 21 September 2026  
**Product Type:** Interactive browser game / AI-powered web experience

---

# 1. Product Vision

## Alterra

**Tagline:** *Your World. Your Choices. Your Reality.*

Alterra is a short, visually immersive AI-powered browser game where the player first **creates/customizes a world**, then **enters that world and plays inside it**.

The core experience is:

```text
CREATE
  ↓
MORPH
  ↓
ENTER
  ↓
PLAY
  ↓
CHOOSE
  ↓
CHANGE THE WORLD
  ↓
SOLVE
  ↓
GET YOUR REALITY
```

Alterra should feel like an interactive digital reality rather than a conventional website.

The player's choices should genuinely affect the game world, gameplay events, available interactions, and final outcome.

---

# 2. Competition Requirements

Alterra MUST satisfy the five competition requirements:

1. **AI:** AI creates or transforms at least one part of the final output.
2. **User Choice:** The final result depends on user choices.
3. **AI Visual:** At least one AI-generated visual is deliberately selected and integrated.
4. **Communication:** The concept should be understandable primarily through the experience rather than long explanatory text.
5. **Interaction:** A meaningful portion of the project must be interactive rather than purely visual.

---

# 3. Core Product Concept

The key differentiator is:

> **The world the player creates becomes the game they play.**

Instead of:

```text
Choose a theme
↓
View a generated webpage
```

Alterra uses:

```text
Choose a world
↓
Customize its atmosphere
↓
AI transforms the world
↓
Enter the world
↓
Play inside it
↓
Make decisions
↓
World reacts
↓
Receive a personalized ending
```

The world is therefore not merely a background.

**The world is the game board.**

---

# 4. Target User

The primary user during the competition is the **judge**.

The judge should be able to:

- Understand the concept almost immediately.
- Select a world.
- Modify its atmosphere.
- Trigger an AI transformation.
- Enter the generated world.
- Interact with objects.
- Make meaningful choices.
- Play a short mini-game.
- See visible consequences.
- Receive a unique ending.
- Replay with a different path.

---

# 5. User Journey

```text
LANDING
   ↓
CHOOSE WORLD
   ↓
WORLD DIRECTOR
   ↓
MORPH WORLD
   ↓
ENTER WORLD
   ↓
CHOOSE ROLE
   ↓
CHOOSE TRAIT
   ↓
EXPLORE
   ↓
COLLECT / DISCOVER
   ↓
FIRST ENCOUNTER
   ↓
CONSEQUENCE
   ↓
DISCOVER ARTIFACT
   ↓
SAVE / CONTROL / DESTROY
   ↓
WORLD REACTS
   ↓
MINI-GAME
   ↓
ESCAPE / STAY
   ↓
AI PERSONALIZED ENDING
   ↓
YOUR REALITY
   ↓
REPLAY
```

---

# 6. World Selector

Initial worlds:

## Cyber

- Neon city
- Digital ruins
- Holograms
- Robots
- Security systems
- Artifact: **Quantum Core**

## Fantasy

- Ancient forest
- Magic
- Ruins
- Glowing plants
- Mystical creatures
- Artifact: **Heart of the Forest**

## Mystery

- Abandoned station
- Hidden rooms
- Strange signals
- Unknown entity
- Artifact: **Signal Key**

The architecture should allow more worlds to be added later.

---

# 7. World Director

After choosing a world, the player sees:

## YOU ARE THE DIRECTOR

Controls:

- Mood
- Intensity
- Chaos
- Atmosphere

Example:

```text
WORLD
[CYBER] [FANTASY] [MYSTERY]

MOOD
[CALM] [DARK] [JOY] [ENERGY]

INTENSITY
────────●──────

CHAOS
───────●───────

ATMOSPHERE
[DAWN] [DAY] [NIGHT]

       ✦ MORPH WORLD
```

Every major setting must have a visible effect.

Examples:

```text
Higher intensity
→ stronger lighting
→ faster particles
→ stronger visual effects

Higher chaos
→ less predictable movement
→ visual distortion
→ more dynamic objects

Dark mood
→ darker environment
→ fog
→ reduced ambient light
```

---

# 8. AI Morph

When the user clicks **MORPH WORLD**:

1. Capture the current world settings.
2. Show a short cinematic transition.
3. Generate or select the corresponding AI visual state.
4. Generate a world identity/title/tagline if AI is available.
5. Apply visual transformations.
6. Reveal **ENTER THE WORLD**.

Example:

```text
WORLD INITIALIZING...
       ↓
ATMOSPHERE SYNCHRONIZING...
       ↓
AI SIGNATURE GENERATED...
       ↓
REALITY STABILIZED
```

Example result:

**THE SILENT ORBIT**

*Somewhere between discovery and darkness.*

---

# 9. Game System

After the world is created, it becomes the playable game environment.

The player chooses:

### Role

- Explorer
- Hacker
- Guardian

### Trait

- Brave
- Curious
- Cautious

Then enters the interactive scene.

---

# 10. Exploration

The environment should contain approximately 3–5 interactive objects.

Example:

```text
┌───────────────────────────────┐
│           GAME WORLD          │
│                               │
│  [TERMINAL]      [DOOR]       │
│                               │
│            PLAYER             │
│                               │
│  [CHEST]       [ARTIFACT]     │
└───────────────────────────────┘
```

Objects may:

- Reveal clues.
- Give items.
- Trigger animations.
- Unlock paths.
- Start choices.
- Change game state.

---

# 11. Inventory

Keep the inventory simple.

Example:

```text
INVENTORY

🔑 Key
💾 Data Chip
💎 Crystal
```

The important principle is:

> An earlier interaction should have a later consequence.

Example:

```text
Find Data Chip
       ↓
Terminal
       ↓
Hidden route
```

---

# 12. First Encounter

Introduce one short event.

Example:

```text
A damaged traveler is trapped.

WHAT DO YOU DO?

[HELP] [HIDE] [TAKE]
```

Choices must change state.

Example:

```text
HELP
 ↓
NPC trusts player
 ↓
Clue received
```

```text
HIDE
 ↓
Lose one clue
 ↓
Discover alternate route
```

```text
TAKE
 ↓
Gain item
 ↓
Trigger danger
```

---

# 13. Artifact

Each world has a unique artifact.

```text
Cyber   → Quantum Core
Fantasy → Heart of the Forest
Mystery → Signal Key
```

The artifact is the main turning point.

```text
THE ARTIFACT HAS AWAKENED.

[SAVE] [CONTROL] [DESTROY]
```

---

# 14. World Reaction

The world must visibly react.

### SAVE

- Environment stabilizes.
- Lighting becomes brighter.
- Particles increase.
- Atmosphere becomes calmer.

### CONTROL

- Glitches appear.
- Objects move.
- Warning effects appear.
- Environment becomes unstable.

### DESTROY

- Cracks appear.
- Screen shakes.
- Particles fall.
- Environment begins collapsing.
- Exit becomes available.

This is intended to be one of Alterra's strongest WOW moments.

---

# 15. Mini-Game

The player completes a 10–30 second challenge.

Recommended:

## Symbol Sequence

Display:

```text
▲  ●  ◆  ★
```

Then hide it.

Prompt:

```text
REPEAT THE SEQUENCE
```

Player selects:

```text
▲ → ● → ◆ → ★
```

Possible outcomes:

```text
SUCCESS
→ positive modifier

FAILURE
→ negative modifier
```

Alternative mini-games:

- Memory sequence
- Click targets
- Unlock code
- Drag item
- Pattern matching

---

# 16. Final Decision

After the challenge:

```text
THE GATEWAY IS OPEN.

[ESCAPE]       [STAY]
```

The final outcome depends on the complete journey.

```text
World
+
Mood
+
Intensity
+
Chaos
+
Role
+
Trait
+
Exploration
+
Inventory
+
Encounter
+
Artifact Decision
+
Challenge Result
+
Final Decision
```

---

# 17. AI-Personalized Ending

Runtime AI should be used primarily for the final short narrative.

Example input:

```text
World: Mystery
Mood: Dark
Role: Hacker
Trait: Curious
Encounter: Help
Artifact: Control
Challenge: Success
Final Decision: Stay
```

Prompt:

```text
Create a 30-word cinematic ending based on the following player journey:
[world], [mood], [role], [trait], [encounter],
[artifact decision], [challenge result], [final decision].
```

The AI should return a concise cinematic ending.

---

# 18. Your Reality

Final screen:

```text
YOUR REALITY

WORLD       MYSTERY
ROLE        HACKER
TRAIT       CURIOUS

ENDING
THE SIGNAL KEEPER

[AI-GENERATED ENDING]

[PLAY AGAIN]
```

Optional World DNA:

```text
WORLD DNA

MYSTERY      █████████░ 90%
CHAOS        ███████░░░ 70%
RISK         ██████░░░░ 60%
CURIOSITY    █████████░ 85%
```

---

# 19. Hidden WOW Element

Add one optional secret object to the world.

When discovered:

```text
SECRET DISCOVERED
```

Then show a short message such as:

> This reality remembers choices you haven't made yet.

The Easter egg should not be required to complete the game.

---

# 20. Replay

After the ending:

```text
YOUR REALITY

[PLAY AGAIN]
[TRY DIFFERENT PATH]
```

Replay must reset the game state.

The judge should be encouraged to try a different major decision and see a different outcome.

---

# 21. Scope

The competition version should remain small.

### MUST HAVE

- 3 worlds
- World customization
- AI-generated visuals
- 3 roles
- 3 traits
- Interactive exploration
- 3–5 interactive objects
- Simple inventory
- 1 encounter
- 1 artifact decision
- 1 mini-game
- 1 final decision
- AI ending
- Multiple endings
- Replay

### CAN REMOVE IF TIME IS LIMITED

- Complex inventory
- Multiple NPCs
- Advanced physics
- Multiplayer
- Large backend
- Complex 3D graphics
- Live image generation on every interaction

---

# 22. Competition Demo

Recommended 2-minute flow:

```text
LANDING
 ↓
Judge selects MYSTERY
 ↓
Mood → DARK
 ↓
Chaos → 80%
 ↓
MORPH WORLD
 ↓
AI world appears
 ↓
ENTER THE WORLD
 ↓
Choose HACKER
 ↓
Explore
 ↓
Find Data Chip
 ↓
Encounter
 ↓
Choose HELP
 ↓
Find Signal Key
 ↓
Choose DESTROY
 ↓
WORLD COLLAPSES
 ↓
Mini-game
 ↓
ESCAPE
 ↓
AI ENDING
 ↓
YOUR REALITY
```

Then replay quickly:

```text
Same world
+
Different artifact choice
=
Different reality
```

This proves that the user's choices actually matter.

---

# 23. Success Metrics

Alterra succeeds if:

- A new user can start without explanation.
- The judge immediately understands the world-creation concept.
- The judge can alter the world.
- The created world becomes playable.
- Choices change the game.
- The environment visibly reacts.
- AI visibly contributes.
- The AI-generated visual is intentionally integrated.
- The mini-game is functional.
- Different paths produce different endings.
- The entire demo can be completed quickly.

---

# 24. Final Product Statement

> **Alterra is an AI-powered reality creator where you don't just design a world — you enter it, play it, change it, and discover the reality your choices create.**
