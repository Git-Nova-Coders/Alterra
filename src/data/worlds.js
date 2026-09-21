/**
 * Alterra World Definitions
 * Initial 3 Archetypal Worlds per PRD / SDD
 */

export const WORLDS = {
  cyber: {
    id: 'cyber',
    name: 'Neo-Kowloon 2099',
    subtitle: 'Cybernetic Megacity',
    tagline: 'High tech, deep shadows, and digital sovereignty',
    theme: 'digital',
    iconEmoji: '🏙️',
    artifactEmoji: '🧊',
    accentColor: '#00f0ff',
    bgGradient: 'from-cyan-950/70 via-slate-900/80 to-blue-950/70',
    borderColor: 'border-cyan-500/30',
    glowClass: 'shadow-glow-cyan',
    artifact: 'Quantum Core',
    artifactDescription: 'A self-contained zero-point energy cube humming with computational sentience.',
    previewVisual: 'linear-gradient(135deg, #091a28 0%, #032b44 50%, #081220 100%)',
    audioAtmosphere: 'neon_hum',
    initialAtmosphere: 'night',
    defaultIntensity: 65,
    defaultChaos: 40,
    tags: ['Cyberpunk', 'AI Singularity', 'Neon Grid'],
    environmentalEffects: ['Data Rain', 'Holocrowds', 'Neural Interference'],
  },
  fantasy: {
    id: 'fantasy',
    name: 'Aethelgard Canopy',
    subtitle: 'Enchanted Primeval Grove',
    tagline: 'Ancient biorhythms, living roots, and forbidden arcana',
    theme: 'magical',
    iconEmoji: '🌲',
    artifactEmoji: '💚',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/70 via-slate-900/80 to-teal-950/70',
    borderColor: 'border-emerald-500/30',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    artifact: 'Heart of the Forest',
    artifactDescription: 'A petrified emerald nucleus holding the dormant memories of an elder ecosystem.',
    previewVisual: 'linear-gradient(135deg, #092015 0%, #063d27 50%, #081510 100%)',
    audioAtmosphere: 'sylvan_whisper',
    initialAtmosphere: 'twilight',
    defaultIntensity: 45,
    defaultChaos: 30,
    tags: ['Solarpunk Fantasy', 'Living Biosphere', 'Rune Magic'],
    environmentalEffects: ['Bioluminescent Spores', 'Root Pulse', 'Mana Mist'],
  },
  mystery: {
    id: 'mystery',
    name: 'Orbital Station Tartarus',
    subtitle: 'Silent Deep-Space Derelict',
    tagline: 'Vacuum silence, flickering warning lights, and lost crew logs',
    theme: 'cosmic',
    iconEmoji: '🛰️',
    artifactEmoji: '🗝️',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950/70 via-slate-900/80 to-indigo-950/70',
    borderColor: 'border-purple-500/30',
    glowClass: 'shadow-glow-purple',
    artifact: 'Signal Key',
    artifactDescription: 'A gravimetric resonator that deciphers unknown subspace transmissions across timelines.',
    previewVisual: 'linear-gradient(135deg, #1c0f2e 0%, #2b1148 50%, #0c0816 100%)',
    audioAtmosphere: 'void_drone',
    initialAtmosphere: 'storm',
    defaultIntensity: 75,
    defaultChaos: 60,
    tags: ['Cosmic Sci-Fi', 'Anomalous Void', 'Derelict Station'],
    environmentalEffects: ['Gravity Fluctuations', 'Hull Groans', 'Event Horizon Echoes'],
  }
};

export const MOODS = [
  { id: 'serene', label: 'Serene', description: 'Calm, contemplative, subtle resonances', icon: 'Sun' },
  { id: 'mysterious', label: 'Mysterious', description: 'Veiled in enigmas and hidden signals', icon: 'Eye' },
  { id: 'dramatic', label: 'Dramatic', description: 'Tense, high-stakes, pulsing with danger', icon: 'Flame' },
  { id: 'apocalyptic', label: 'Cataclysmic', description: 'Fractured reality near collapse threshold', icon: 'AlertTriangle' }
];

export const ATMOSPHERES = [
  { id: 'dawn', label: 'Ion Dawn', description: 'Crisp light breaking through particle fog' },
  { id: 'noon', label: 'Solar Zenith', description: 'Harsh clarity exposing every detail' },
  { id: 'twilight', label: 'Biolum Twilight', description: 'Atmospheric glow from synthetic flora' },
  { id: 'night', label: 'Zero Midnight', description: 'Deep contrast pierced by point lights' },
  { id: 'storm', label: 'Electromagnetic Storm', description: 'Arcing discharges and sensory disruption' }
];
