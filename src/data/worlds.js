/**
 * Alterra World Definitions
 * Initial 3 Archetypal Worlds per PRD / SDD
 * Supports: Cyber, Fantasy, and Mystery with dedicated visual and interactive themes
 */

export const WORLDS = {
  cyber: {
    id: 'cyber',
    name: 'Neo-Kowloon 2099',
    subtitle: 'Cybernetic Megacity',
    tagline: 'High tech, deep shadows, and digital sovereignty',
    theme: 'digital',
    accentColor: '#00f0ff',
    bgGradient: 'from-cyan-950/80 via-slate-900/90 to-blue-950/80',
    borderColor: 'border-cyan-500/40',
    glowClass: 'shadow-glow-cyan',
    artifact: 'Quantum Core',
    artifactDescription: 'A self-contained zero-point energy cube humming with computational sentience.',
    previewVisual: 'linear-gradient(135deg, #051424 0%, #032b44 50%, #081220 100%)',
    audioAtmosphere: 'neon_hum',
    initialAtmosphere: 'night',
    defaultIntensity: 65,
    defaultChaos: 40,
    tags: ['Cyberpunk', 'AI Singularity', 'Neon Grid'],
    environmentalEffects: ['Data Rain', 'Holocrowds', 'Neural Interference'],
    // Interactive game scene descriptors
    sceneTitle: 'Sector 7: Lower Slums & Mainframe Spine',
    sceneDescription: 'Torrential neon rain glistens against obsidian carbon fiber. Hologram advertisements pulse erratically through dense industrial steam.',
    aiTitleFallback: 'CYBER ARCHIVE 2099: QUANTUM BREACH',
    aiTaglineFallback: 'Where artificial souls whisper through fiber-optic rain.',
  },
  fantasy: {
    id: 'fantasy',
    name: 'Aethelgard Canopy',
    subtitle: 'Enchanted Primeval Grove',
    tagline: 'Ancient biorhythms, living roots, and forbidden arcana',
    theme: 'magical',
    accentColor: '#10b981',
    bgGradient: 'from-emerald-950/80 via-slate-900/90 to-teal-950/80',
    borderColor: 'border-emerald-500/40',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    artifact: 'Heart of the Forest',
    artifactDescription: 'A petrified emerald nucleus holding the dormant memories of an elder ecosystem.',
    previewVisual: 'linear-gradient(135deg, #061e12 0%, #063d27 50%, #081510 100%)',
    audioAtmosphere: 'sylvan_whisper',
    initialAtmosphere: 'twilight',
    defaultIntensity: 45,
    defaultChaos: 30,
    tags: ['Solarpunk Fantasy', 'Living Biosphere', 'Rune Magic'],
    environmentalEffects: ['Bioluminescent Spores', 'Root Pulse', 'Mana Mist'],
    sceneTitle: 'Heartwood Sanctum: Elder Roots',
    sceneDescription: 'Towering ironwood boughs weave a verdant sky overhead. Bioluminescent moss breathes in synchronized waves with the pulse of the ancient soil.',
    aiTitleFallback: 'AETHELGARD: THE SYLVAN GENESIS',
    aiTaglineFallback: 'Roots that remember what the stars have long forgotten.',
  },
  mystery: {
    id: 'mystery',
    name: 'Orbital Station Tartarus',
    subtitle: 'Silent Deep-Space Derelict',
    tagline: 'Vacuum silence, flickering warning lights, and lost crew logs',
    theme: 'mysterious',
    accentColor: '#a855f7',
    bgGradient: 'from-purple-950/80 via-slate-900/90 to-indigo-950/80',
    borderColor: 'border-purple-500/40',
    glowClass: 'shadow-glow-purple',
    artifact: 'Signal Key',
    artifactDescription: 'A gravimetric shard that vibrates inversely to real-world spacetime, transmitting on an unknown carrier band.',
    previewVisual: 'linear-gradient(135deg, #180928 0%, #2b1148 50%, #0c0816 100%)',
    audioAtmosphere: 'void_drone',
    initialAtmosphere: 'storm',
    defaultIntensity: 75,
    defaultChaos: 60,
    tags: ['Cosmic Sci-Fi', 'Anomalous Void', 'Derelict Station'],
    environmentalEffects: ['Gravity Fluctuations', 'Hull Groans', 'Event Horizon Echoes'],
    sceneTitle: 'Compartment 0-Alpha: Deep Observatory',
    sceneDescription: 'Red emergency strobes sweep over empty cryo-stasis pods. Outside the pressurized viewport, a supermassive gravity anomaly bends starlight.',
    aiTitleFallback: 'TARTARUS PROTOCOL: VOID RESONANCE',
    aiTaglineFallback: 'In the silence between the stars, something answered back.',
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
