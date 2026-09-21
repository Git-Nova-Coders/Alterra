/**
 * Character Archetypes / Roles available in Alterra
 */

export const ROLES = [
  {
    id: 'infiltrator',
    name: 'Ghost Operative',
    category: 'Subterfuge & Data',
    description: 'Expert in stealth, cryptography, and bypassing sensory tripwires.',
    skill: 'Bypass Security Systems',
    bonusStat: 'Stealth +25%',
    icon: 'Terminal'
  },
  {
    id: 'archivist',
    name: 'Cosmic Chronicler',
    category: 'Lore & Analysis',
    description: 'Decipherer of ancient glyphs, lost frequencies, and anomalous anomalies.',
    skill: 'Translate Forgotten Tech',
    bonusStat: 'Perception +30%',
    icon: 'Compass'
  },
  {
    id: 'synthesizer',
    name: 'Aether Shaper',
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
    name: 'Hyper-Vigilant',
    effect: 'Detect hidden object signatures before entering rooms.',
    badge: 'Tactical'
  },
  {
    id: 'harmonic',
    name: 'Resonant Attunement',
    effect: 'Empathize with world ecosystems, calming aggressive entities.',
    badge: 'Mystic'
  },
  {
    id: 'daring',
    name: 'Overclocked Reflexes',
    effect: 'High bonus during timed reaction mini-challenges.',
    badge: 'Kinetic'
  }
];
