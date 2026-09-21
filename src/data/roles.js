/**
 * Character Archetypes / Roles & Traits available in Alterra
 * Standardized per PRD & SDD specifications
 */

export const ROLES = [
  {
    id: 'explorer',
    name: 'Explorer',
    title: 'Void Cartographer',
    category: 'Discovery & Sensing',
    description: 'Expert scout attuned to hidden spatial shifts and concealed chambers.',
    ability: 'Reveals hidden objects and anomalous caches automatically.',
    bonusStat: 'Perception +35%',
    icon: 'Compass',
    accentColor: '#38bdf8'
  },
  {
    id: 'hacker',
    name: 'Hacker',
    title: 'Cyber Specialist',
    category: 'Cryptography & Data',
    description: 'Master of encrypted protocols, neural taps, and security bypass matrices.',
    ability: 'Unlocks protected digital terminals and encrypted systems.',
    bonusStat: 'Decryption +40%',
    icon: 'Terminal',
    accentColor: '#00f0ff'
  },
  {
    id: 'guardian',
    name: 'Guardian',
    title: 'Aegis Vanguard',
    category: 'Defense & Preservation',
    description: 'Shield-bearer equipped with kinetic dampeners and barrier technology.',
    ability: 'Protects fragile relics and resists violent atmospheric surges.',
    bonusStat: 'Defense +40%',
    icon: 'Shield',
    accentColor: '#10b981'
  }
];

export const TRAITS = [
  {
    id: 'brave',
    name: 'Brave',
    tagline: 'High-risk, maximum-yield instinct',
    description: 'Unlocks audacious and high-stakes choices during encounters with maximum payoff.',
    badge: 'Kinetic',
    accentColor: '#ef4444'
  },
  {
    id: 'curious',
    name: 'Curious',
    tagline: 'Deep analytical insight',
    description: 'Reveals hidden lore, additional tactical clues, and unseen pathways in the world.',
    badge: 'Cognitive',
    accentColor: '#a855f7'
  },
  {
    id: 'cautious',
    name: 'Cautious',
    tagline: 'Calculated defensive mitigation',
    description: 'Significantly reduces negative consequences and safeguards inventory during conflicts.',
    badge: 'Tactical',
    accentColor: '#f59e0b'
  }
];
