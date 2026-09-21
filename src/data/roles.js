/**
 * Character Archetypes / Roles available in Alterra
 */

export const ROLES = [
  {
    id: 'infiltrator',
    codeName: 'HACKER',
    emoji: '⚡',
    name: 'Ghost Operative (Hacker)',
    category: 'Subterfuge & Data',
    description: 'Expert in stealth, cryptography, and bypassing sensory tripwires.',
    skill: 'Bypass Security Systems',
    bonusStat: 'Stealth +25%',
    icon: 'Terminal'
  },
  {
    id: 'archivist',
    codeName: 'EXPLORER',
    emoji: '🧭',
    name: 'Cosmic Chronicler (Explorer)',
    category: 'Lore & Analysis',
    description: 'Decipherer of ancient glyphs, lost frequencies, and anomalous anomalies.',
    skill: 'Translate Forgotten Tech',
    bonusStat: 'Perception +30%',
    icon: 'Compass'
  },
  {
    id: 'synthesizer',
    codeName: 'GUARDIAN',
    emoji: '🛡️',
    name: 'Aether Shaper (Guardian)',
    category: 'Engineering & Resonance',
    description: 'A conduit of mechanical and organic transmutation who can reshape raw energy.',
    skill: 'Transmute Relics',
    bonusStat: 'Resilience +20%',
    icon: 'Cpu'
  }
];

export const TRAITS = [
  {
    id: 'hyperfocused',
    codeName: 'CURIOUS',
    emoji: '🔮',
    name: 'Hyper-Vigilant (Curious)',
    effect: 'Detect hidden object signatures before entering rooms.',
    badge: 'Tactical'
  },
  {
    id: 'harmonic',
    codeName: 'CAUTIOUS',
    emoji: '🌿',
    name: 'Resonant Attunement (Cautious)',
    effect: 'Empathize with world ecosystems, calming aggressive entities.',
    badge: 'Mystic'
  },
  {
    id: 'daring',
    codeName: 'BRAVE',
    emoji: '⚔️',
    name: 'Overclocked Reflexes (Brave)',
    effect: 'High bonus during timed reaction mini-challenges.',
    badge: 'Kinetic'
  }
];
