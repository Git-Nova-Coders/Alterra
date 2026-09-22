/**
 * RPG Dialogue & Inner Monologue Scripts
 * Guides the player through thoughts, exploration goals, and world lore.
 */

export const DIALOGUE_SCRIPTS = {
  AWAKENING_SLEEP: [
    {
      id: 'awk-1',
      speaker: 'Traveler',
      title: 'Inner Consciousness',
      avatar: 'wanderer',
      text: '...Where am I? The gravity... it feels completely gone. It feels like I am floating in an infinite zero-gravity void.',
      hint: 'Drag mouse to look around in 360°. Click on your character to awaken.'
    },
    {
      id: 'awk-2',
      speaker: 'Traveler',
      title: 'Drowsy Realization',
      avatar: 'wanderer',
      text: 'My eyelids feel so heavy. If I can just rub the sleep from my eyes, maybe I can see what lies in this darkness...',
      hint: 'Tap or press [SPACE] to rub your eyes.'
    }
  ],

  AWAKENING_AWAKE: [
    {
      id: 'awk-3',
      speaker: 'Traveler',
      title: 'Awoken State',
      avatar: 'wanderer',
      text: 'My vision is clear now! Look at these voxel blocks rising beneath my feet... the world is generating as I move!',
      hint: 'Use [W][A][S][D] or drag Joystick to roam. Approach the Reality Gates.'
    }
  ],

  NEXUS_GATES: [
    {
      id: 'nex-1',
      speaker: 'Traveler',
      title: 'Gateway Convergence',
      avatar: 'wanderer',
      text: 'Three dimensional portals stand before me. The monoliths are tuning the atmospheric parameters of each reality.',
      hint: 'Walk close to any gateway to resonate with its frequency, or interact with tuning monoliths.'
    }
  ],

  VOID_MANIFESTATION: [
    {
      id: 'void-1',
      speaker: 'Genesis Protocol',
      title: 'AI Architect',
      avatar: 'ai',
      text: 'Reality anchor initializing. Explore the boundless procedural terrain and collect 4 resonance shards to stabilize the vortex.',
      hint: 'Walk across the infinite chunks to locate glowing resonance seeds.'
    }
  ],

  LIVING_WORLD_CREATURE: [
    {
      id: 'world-1',
      speaker: 'Traveler',
      title: 'Anomaly Detected',
      avatar: 'wanderer',
      text: 'There is a massive creature resting on the voxel ridge. Its dimensional core is glowing with erratic energy... it looks hurt.',
      hint: 'Approach the creature to choose your action: Investigate, Defend, or Harmonize.'
    }
  ]
};
