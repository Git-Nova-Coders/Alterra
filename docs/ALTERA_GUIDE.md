# GUIDE — Alterra
## Development & Competition Guide

> **Alterra is not a normal website.**
>
> It is a short AI-powered browser game where the judge creates a world, enters it, plays inside it, changes it, and receives a unique reality.

---

# 1. The Core Idea

The entire project should communicate one sentence:

> **You don't just visit a world. You create it, play it, and change it.**

The ideal experience is:

```text
CREATE
 ↓
MORPH
 ↓
ENTER
 ↓
EXPLORE
 ↓
INTERACT
 ↓
DISCOVER
 ↓
DECIDE
 ↓
CONSEQUENCE
 ↓
SOLVE
 ↓
DECIDE AGAIN
 ↓
YOUR REALITY
```

---

# 2. What the Judge Should Feel

The judge should not feel like they are testing a website.

They should feel like they are:

1. Creating a reality.
2. Entering that reality.
3. Playing a game inside it.
4. Making meaningful decisions.
5. Watching their choices change the world.
6. Receiving a unique ending.

The judge should be able to understand the concept without reading a long explanation.

---

# 3. Golden Rule

Every major choice must answer:

> **"What changed because I made this choice?"**

Good:

```text
HELP
 ↓
NPC trusts player
 ↓
Player gets clue
 ↓
Hidden room opens
 ↓
Player gets item
 ↓
Item helps in final challenge
```

Bad:

```text
HELP
 ↓
Same screen
 ↓
Same route
 ↓
Same ending
```

---

# 4. Development Scope

Keep the competition version small.

Recommended:

```text
3 worlds
3 roles
3 traits
3–5 interactive objects
1 encounter
1 artifact
1 artifact decision
1 mini-game
1 final decision
multiple endings
```

Do not build a full RPG.

A polished 2-minute experience is more valuable than a large unfinished game.

---

# 5. Build Order

## Step 1 — Build the State

Before visual polish, make the game logic work.

```javascript
const gameState = {
  world: null,
  mood: null,
  intensity: 50,
  chaos: 50,
  atmosphere: "night",

  role: null,
  trait: null,

  inventory: [],
  discoveredObjects: [],

  encounterChoice: null,

  artifact: null,
  artifactDecision: null,

  challengeScore: 0,
  finalDecision: null,

  endingType: null,
  aiEnding: null
};
```

---

# 6. Step 2 — Build World Selection

Create three beautiful world cards:

```text
CYBER
FANTASY
MYSTERY
```

Each should have:

- AI-generated visual
- Short title
- Minimal description
- Hover/tap animation
- Selected state

Do not add paragraphs.

---

# 7. Step 3 — Build the World Director

Create:

## YOU ARE THE DIRECTOR

Controls:

```text
WORLD
MOOD
INTENSITY
CHAOS
ATMOSPHERE
```

Every control should have an immediate visible effect.

For example:

```text
Chaos ↑
 ↓
Particles become unpredictable
 ↓
Objects move more
 ↓
Visual distortion increases
```

---

# 8. Step 4 — Build the Morph Moment

The MORPH button is important.

Do not simply change the background instantly.

Use:

```text
MORPH MY WORLD
      ↓
WORLD INITIALIZING...
      ↓
ATMOSPHERE SYNCHRONIZING...
      ↓
REALITY STABILIZED
```

Then reveal the customized world.

This is the first major WOW moment.

---

# 9. Step 5 — Make the World Playable

This is the most important integration.

The generated world must become the game environment.

Example:

```text
┌──────────────────────────────┐
│         CYBER WORLD          │
│                              │
│ [TERMINAL]      [DOOR]       │
│                              │
│          PLAYER              │
│                              │
│ [CHEST]        [ARTIFACT]    │
└──────────────────────────────┘
```

Do not treat the AI image as a simple background.

Overlay interactive elements on it.

---

# 10. Step 6 — Role Selection

After the world is created:

```text
WHO ARE YOU?

[EXPLORER]
Find hidden objects.

[HACKER]
Unlock digital systems.

[GUARDIAN]
Protect important objects.
```

The role should actually affect interactions.

---

# 11. Step 7 — Trait Selection

Then:

```text
YOUR INSTINCT

[BRAVE]
Unlock risky options.

[CURIOUS]
Reveal clues.

[CAUTIOUS]
Reduce negative consequences.
```

Traits should modify the experience but never make the game impossible.

---

# 12. Step 8 — Exploration

Create approximately 3–5 clickable objects.

Examples:

```text
Terminal
Chest
Door
Hidden object
Artifact
```

When clicked:

```text
CLICK
 ↓
VALIDATE
 ↓
UPDATE STATE
 ↓
SHOW REACTION
 ↓
UNLOCK NEXT INTERACTION
```

Use animations and sound to communicate the result.

---

# 13. Step 9 — Inventory

Keep inventory tiny.

Example:

```text
INVENTORY

🔑 KEY
💾 DATA CHIP
💎 CRYSTAL
```

The inventory exists to prove that:

> Earlier actions matter later.

---

# 14. Step 10 — Encounter

Use one short encounter.

Example:

```text
A damaged traveler is trapped.

WHAT DO YOU DO?

[HELP] [HIDE] [TAKE]
```

Make all three options meaningful.

Possible implementation:

```text
HELP
→ gain trust
→ receive clue

HIDE
→ lose trust
→ unlock alternate route

TAKE
→ gain item
→ trigger danger
```

---

# 15. Step 11 — Artifact

The artifact is the central story/game object.

World examples:

```text
CYBER
Quantum Core

FANTASY
Heart of the Forest

MYSTERY
Signal Key
```

When discovered:

```text
THE ARTIFACT HAS AWAKENED.

[SAVE]
[CONTROL]
[DESTROY]
```

---

# 16. Step 12 — Make the World React

This should be one of the most impressive parts.

## SAVE

```text
Environment stabilizes
Lighting increases
Particles become calm
```

## CONTROL

```text
Glitches
Moving objects
Warning effects
Unstable environment
```

## DESTROY

```text
Cracks
Screen shake
Falling particles
Environment collapse
New exit
```

The judge should see the consequence immediately.

---

# 17. Step 13 — Mini-Game

Keep it short.

Recommended:

## Memory / Pattern Challenge

Show:

```text
▲ ● ◆ ★
```

Hide it.

Then:

```text
REPEAT THE SEQUENCE
```

Success:

```text
SYSTEM UNLOCKED
```

Failure:

```text
SYSTEM DAMAGED
```

Duration:

**10–30 seconds.**

---

# 18. Step 14 — Final Decision

Show:

```text
THE GATEWAY IS OPEN.

[ESCAPE]     [STAY]
```

This becomes the final player decision.

---

# 19. Step 15 — AI Ending

Only now use runtime AI.

Input:

```text
world
mood
role
trait
encounter
artifact decision
challenge result
final decision
```

Keep the prompt small.

Example:

```text
Create a 30-word cinematic ending.

World: Mystery
Role: Hacker
Trait: Curious
Encounter: Help
Artifact: Control
Challenge: Success
Final: Stay
```

---

# 20. Step 16 — Your Reality

End with:

```text
YOUR REALITY

THE SIGNAL KEEPER

[AI GENERATED ENDING]

WORLD: MYSTERY
ROLE: HACKER
TRAIT: CURIOUS

[PLAY AGAIN]
```

Optional:

```text
WORLD DNA

MYSTERY      █████████░
CHAOS        ███████░░░
RISK         ██████░░░░
CURIOSITY    █████████░
```

---

# 21. Hidden WOW Element

Add one secret object.

For example:

```text
[UNKNOWN SIGNAL]
```

The judge can discover it while exploring.

On click:

```text
SECRET DISCOVERED

"This reality remembers choices
you haven't made yet."
```

Do not make this mandatory.

It should reward curiosity.

---

# 22. AI Strategy

Do not make the whole game dependent on live AI.

## Pre-generate

- Cyber visual
- Fantasy visual
- Mystery visual
- Visual variations
- Icons
- Sound effects

## Runtime AI

Use it for:

- Short world title/tagline
- Final personalized ending

## Fallback

Always have local fallback endings.

```text
GAME
 ↓
AI REQUEST
 ↓
SUCCESS → AI ENDING
 ↓
FAILURE → LOCAL ENDING
```

The judge must never see an API error.

---

# 23. Prompt Engineering Strategy

The competition is about prompt engineering, so make the AI usage intentional.

Instead of:

```text
Make an ending.
```

Use structured context:

```text
You are the narrative engine for Alterra.

Generate a cinematic ending of 30 words or fewer.

PLAYER WORLD:
{world}

WORLD MOOD:
{mood}

PLAYER ROLE:
{role}

PLAYER TRAIT:
{trait}

ENCOUNTER:
{encounterChoice}

ARTIFACT DECISION:
{artifactDecision}

CHALLENGE RESULT:
{challengeResult}

FINAL DECISION:
{finalDecision}

Requirements:
- Reflect the player's choices.
- Do not introduce unrelated characters.
- Do not contradict the selected world.
- Make the ending feel unique.
- Maximum 30 words.
```

This demonstrates deliberate prompt engineering rather than simply calling an AI API.

---

# 24. Demo Strategy

## Opening

Show the landing page.

Say:

> **"Alterra lets you create a world — and then play inside the world you created."**

Do not explain for 30 seconds.

Immediately let the judge interact.

---

# 25. Recommended Live Demo

```text
CHOOSE WORLD
      ↓
MYSTERY
      ↓
MOOD = DARK
      ↓
CHAOS = 80%
      ↓
MORPH
      ↓
WORLD APPEARS
      ↓
ENTER
      ↓
HACKER
      ↓
CURIOUS
      ↓
EXPLORE
      ↓
DATA CHIP
      ↓
HELP
      ↓
SIGNAL KEY
      ↓
DESTROY
```

Then pause.

Let the world transform.

This is the key WOW moment.

Continue:

```text
WORLD COLLAPSES
      ↓
MINI-GAME
      ↓
ESCAPE
      ↓
AI ENDING
```

---

# 26. The Replay Trick

After the ending, say:

> **"Now let's change just one decision."**

Replay.

Keep everything else similar.

Change:

```text
DESTROY
```

to:

```text
SAVE
```

Then show the different world reaction and ending.

This is an extremely effective way to demonstrate:

**User choice → consequence → different outcome.**

---

# 27. What Judges Should Notice

Without explicitly explaining every criterion, the demo should visibly demonstrate:

### AI

AI-generated visual + AI-generated ending.

### User Choice

Judge controls the world and gameplay.

### AI Visual

The world is intentionally designed around the AI-generated visual.

### Communication

The world and reactions communicate the story.

### Interaction

The judge creates, explores, clicks, chooses and plays.

---

# 28. Visual Design

Recommended style:

**Cinematic + Futuristic + Premium**

Use:

- Dark environment
- Glass UI
- Large typography
- Subtle gradients
- Particles
- Parallax
- Smooth transitions
- Ambient lighting
- Minimal text

Avoid:

- Generic dashboard appearance
- Huge paragraphs
- Too many cards
- Stock images
- Excessive controls
- Unnecessary menus

---

# 29. The Three Most Important Screens

## Screen 1 — World Director

The judge creates their world.

## Screen 2 — Game World

The judge plays inside it.

## Screen 3 — Your Reality

The judge sees the consequence of everything they did.

These three screens should receive the most design effort.

---

# 30. Final Quality Checklist

## AI

- [ ] AI-generated visual included.
- [ ] AI contributes to final output.
- [ ] Prompt uses structured player context.
- [ ] AI failure has fallback.

## World Creation

- [ ] World selector works.
- [ ] Mood works.
- [ ] Intensity works.
- [ ] Chaos works.
- [ ] Atmosphere works.
- [ ] Morph animation works.

## Game

- [ ] Role changes gameplay.
- [ ] Trait changes gameplay.
- [ ] Objects are clickable.
- [ ] Inventory works.
- [ ] Encounter choices matter.
- [ ] Artifact exists.
- [ ] Artifact decisions matter.
- [ ] World visibly reacts.
- [ ] Mini-game works.
- [ ] Final decision works.

## Ending

- [ ] AI ending works.
- [ ] Fallback ending works.
- [ ] Ending reflects choices.
- [ ] Replay resets state.
- [ ] Different paths produce different results.

## Presentation

- [ ] No broken images.
- [ ] No console errors.
- [ ] Fast loading.
- [ ] Full-screen/projector friendly.
- [ ] Demo fits within approximately 2 minutes.

---

# 31. Final Rule

Do not try to impress judges by adding 50 features.

Make these five things excellent:

```text
1. BEAUTIFUL WORLD
2. REAL INTERACTION
3. MEANINGFUL CHOICES
4. VISIBLE CONSEQUENCES
5. MEMORABLE ENDING
```

The ideal judge reaction is:

> **"I created the world, played inside it, changed it, and got my own ending."**

That is **Alterra**.
