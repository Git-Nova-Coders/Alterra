/**
 * Interactive Objects and Encounters Data
 * Custom tailored to each of the 3 worlds: Cyber, Fantasy, Mystery
 * Directly implements M12-M16:
 * - 3-5 clickable interactive objects per world
 * - Role & Trait dependencies
 * - Inventory collection & cross-object unlocking
 * - Meaningful encounter with HELP / HIDE / TAKE branching
 */

export const WORLD_OBJECTS = {
  cyber: [
    {
      id: 'cyber_terminal',
      name: 'Mainframe Uplink Console',
      type: 'terminal',
      icon: 'Terminal',
      description: 'An encrypted glass-pane computer pulsing with military-grade firewall subroutines.',
      unlockedDescription: 'The console is decrypted. Core telemetry is flowing.',
      requiresItem: null,
      requiresRole: null,
      bonusRole: 'hacker', // Hacker can bypass without extra step
      rewardItem: {
        id: 'data_chip',
        name: 'Encrypted Data Chip',
        type: 'keycard',
        description: 'Contains decrypted security credentials for the central server vault.',
        icon: 'Cpu'
      },
      actionText: 'Interface Console',
      inspectLog: 'Console scanned: Access port requires high-frequency cipher or Hacker archetype.'
    },
    {
      id: 'cyber_chest',
      name: 'Reinforced Nanosteel Locker',
      type: 'chest',
      icon: 'Box',
      description: 'A pressurized lockbox sealed with an electromagnetic servo latch.',
      unlockedDescription: 'The locker is unsealed and empty.',
      requiresItem: 'data_chip', // Needs the data chip from terminal
      requiresRole: null,
      bonusRole: 'explorer',
      rewardItem: {
        id: 'access_key',
        name: 'Quantum Latch Key',
        type: 'key',
        description: 'Physical override key capable of disengaging the primary core containment field.',
        icon: 'Key'
      },
      actionText: 'Disengage Servo Latch',
      inspectLog: 'Electromagnetic sensor detected: Requires Encrypted Data Chip credentials.'
    },
    {
      id: 'cyber_hidden_drone',
      name: 'Concealed Recon Drone',
      type: 'hidden',
      icon: 'Eye',
      description: 'A dormant surveillance unit camouflaged into the rusted ceiling struts.',
      unlockedDescription: 'The drone has been rebooted and provides tactical aerial feed.',
      requiresItem: null,
      requiresRole: null,
      revealedByRole: 'explorer', // Automatically revealed or easier for explorer
      rewardItem: {
        id: 'scanner_lens',
        name: 'Optical Scanner Lens',
        type: 'tool',
        description: 'Amplifies low-light neural signals and thermal fluctuations.',
        icon: 'Sparkles'
      },
      actionText: 'Reactivate Drone Feed',
      inspectLog: 'Subtle infrared beacon blinking in the shadows.'
    },
    {
      id: 'cyber_artifact_vault',
      name: 'Quantum Core Containment Chamber',
      type: 'artifact',
      icon: 'Zap',
      description: 'A magnetic levitation dais housing the legendary Quantum Core Matrix.',
      unlockedDescription: 'The containment field is neutralized. The Quantum Core pulses in your grasp.',
      requiresItem: 'access_key',
      requiresRole: null,
      bonusRole: 'guardian',
      rewardItem: {
        id: 'artifact_core',
        name: 'Quantum Core',
        type: 'artifact',
        description: 'The central power matrix of Neo-Kowloon, humming with zero-point energy.',
        icon: 'Zap'
      },
      actionText: 'Extract Quantum Core',
      inspectLog: 'Primary forcefield active. Requires Quantum Latch Key.'
    }
  ],

  fantasy: [
    {
      id: 'fantasy_shrine',
      name: 'Rune-Carved Ancient Altar',
      type: 'terminal',
      icon: 'Compass',
      description: 'A moss-covered monolith pulsing with faint druidic illumination.',
      unlockedDescription: 'The arcane runes glow in harmonic alignment.',
      requiresItem: null,
      requiresRole: null,
      bonusRole: 'hacker', // interpreted as glyph decipherer
      rewardItem: {
        id: 'sylvan_crystal',
        name: 'Resonant Sylvan Crystal',
        type: 'keycard',
        description: 'A warm peridot gem vibrating with the vegetative heartbeat of the forest.',
        icon: 'Sparkles'
      },
      actionText: 'Channel Ancient Runes',
      inspectLog: 'The altar responds to bio-electric resonance or mystical analysis.'
    },
    {
      id: 'fantasy_hollow',
      name: 'Bramble Hollow Cache',
      type: 'chest',
      icon: 'Box',
      description: 'Thick thorned vines protect an amber-sealed wooden coffer.',
      unlockedDescription: 'The brambles have parted, revealing the hollow.',
      requiresItem: 'sylvan_crystal',
      requiresRole: null,
      bonusRole: 'guardian',
      rewardItem: {
        id: 'golden_sap_key',
        name: 'Elder Sap Relic Key',
        type: 'key',
        description: 'Hardened petrified resin fashioned into an ancient key.',
        icon: 'Key'
      },
      actionText: 'Dispel Bramble Barrier',
      inspectLog: 'Thorns are rigid like tempered steel. Requires Sylvan Crystal resonance.'
    },
    {
      id: 'fantasy_hidden_spores',
      name: 'Luminescent Spore Colony',
      type: 'hidden',
      icon: 'Eye',
      description: 'A cluster of subterranean fungi emitting shimmering golden dust.',
      unlockedDescription: 'The spores circulate gently around you, sharpening your senses.',
      requiresItem: null,
      requiresRole: null,
      revealedByRole: 'explorer',
      rewardItem: {
        id: 'biolum_dust',
        name: 'Vial of Starlight Spores',
        type: 'tool',
        description: 'Illuminates hidden magical ley lines in total darkness.',
        icon: 'Sun'
      },
      actionText: 'Harvest Spore Essences',
      inspectLog: 'Faint phosphorescence visible between deep root clefts.'
    },
    {
      id: 'fantasy_artifact_grove',
      name: 'Sanctum of the World Tree',
      type: 'artifact',
      icon: 'Zap',
      description: 'Gnarled golden roots enclose the living Heart of the Forest.',
      unlockedDescription: 'The Heart of the Forest rests safely in your hands.',
      requiresItem: 'golden_sap_key',
      requiresRole: null,
      bonusRole: 'guardian',
      rewardItem: {
        id: 'artifact_heart',
        name: 'Heart of the Forest',
        type: 'artifact',
        description: 'The primeval seedling containing the primordial genetic memory of Alterra.',
        icon: 'Sparkles'
      },
      actionText: 'Commune with Root Sanctum',
      inspectLog: 'Locked behind elder bark shields. Requires Elder Sap Relic Key.'
    }
  ],

  mystery: [
    {
      id: 'mystery_terminal',
      name: 'Derelict Diagnostics Terminal',
      type: 'terminal',
      icon: 'Terminal',
      description: 'An amber CRT screen displaying emergency decompression warning codes.',
      unlockedDescription: 'Subsystems restored. Station schematic decrypted.',
      requiresItem: null,
      requiresRole: null,
      bonusRole: 'hacker',
      rewardItem: {
        id: 'station_log_chip',
        name: 'Chief Science Officer Log',
        type: 'keycard',
        description: 'Audio records documenting the sudden appearance of the spatial anomaly.',
        icon: 'Cpu'
      },
      actionText: 'Override Terminal Lockout',
      inspectLog: 'Auxiliary backup battery active. Needs terminal override.'
    },
    {
      id: 'mystery_vault',
      name: 'Hazardous Isolation Safe',
      type: 'chest',
      icon: 'Box',
      description: 'A heavy titanium containment safe built to resist orbital vacuum collapse.',
      unlockedDescription: 'Pressure seal equalized. Isolation safe opened.',
      requiresItem: 'station_log_chip',
      requiresRole: null,
      bonusRole: 'guardian',
      rewardItem: {
        id: 'magnetic_passkey',
        name: 'Gravimetric Passkey',
        type: 'key',
        description: 'Biometric authorization card tuned to Tartarus command deck.',
        icon: 'Key'
      },
      actionText: 'Input Security Clearance',
      inspectLog: 'Requires Chief Science Officer security bypass.'
    },
    {
      id: 'mystery_hidden_vent',
      name: 'Sealed Maintenance Hatch',
      type: 'hidden',
      icon: 'Eye',
      description: 'A recessed bulkhead grating concealing an unmapped service crawlway.',
      unlockedDescription: 'Maintenance hatch unbolted, granting vantage point over the void.',
      requiresItem: null,
      requiresRole: null,
      revealedByRole: 'explorer',
      rewardItem: {
        id: 'void_beacon',
        name: 'Sub-Space Distress Beacon',
        type: 'tool',
        description: 'Pulsing transmitter capable of echoing through the singularity horizon.',
        icon: 'Activity'
      },
      actionText: 'Pry Open Bulkhead',
      inspectLog: 'Draft of freezing void air whistling through a loose hinge.'
    },
    {
      id: 'mystery_artifact_pedestal',
      name: 'Singularity Calibration Array',
      type: 'artifact',
      icon: 'Zap',
      description: 'A floating magnetic pedestal holding the vibrating Signal Key shard.',
      unlockedDescription: 'The Signal Key has been secured.',
      requiresItem: 'magnetic_passkey',
      requiresRole: null,
      bonusRole: 'guardian',
      rewardItem: {
        id: 'artifact_signal',
        name: 'Signal Key',
        type: 'artifact',
        description: 'An impossible cosmic mineral tuned to an ancient extra-dimensional transmission.',
        icon: 'Radio'
      },
      actionText: 'Synchronize Signal Key',
      inspectLog: 'Tachyon field prevents direct handling without Gravimetric Passkey.'
    }
  ]
};

/**
 * Meaningful World Encounters (M15 & M16)
 * Explicitly provides HELP / HIDE / TAKE with deep consequences
 */
export const WORLD_ENCOUNTERS = {
  cyber: {
    entityName: 'Rogue Android Courtesan "Unit 734"',
    entitySubtitle: 'Leaking coolant, clutching an illegal AI firmware backup',
    sceneImage: 'cyber_encounter',
    description: 'Behind an alley of dripping conduit pipes, an obsolete android clutches its sparking chest chassis. Corporate hunter-drones circle the skylights above.',
    dilemma: 'The synthetic entity detects your presence and raises a trembling, damaged hand.',
    options: [
      {
        id: 'help',
        title: 'HELP THE SYNTHETIC',
        actionLabel: 'HELP',
        icon: 'HeartHandshake',
        color: 'emerald',
        description: 'Use your skills/supplies to repair its coolant leak and upload an obfuscation spoof to mislead the hunter drones.',
        consequence: {
          summary: 'Unit 734 grants you an Overclock Cipher and will disable sector alarm sensors during later phases.',
          chaosChange: -15,
          statBonus: 'Alliance Formed',
          rewardItem: {
            id: 'overclock_cipher',
            name: 'Overclock Cipher',
            description: 'Gifted by Unit 734: Grants instantaneous reflex during neural challenges.',
            icon: 'Cpu'
          },
          worldReaction: 'The drones depart. Local neon lights settle into a calm, harmonious cerulean pulse.'
        }
      },
      {
        id: 'hide',
        title: 'HIDE IN THE SHADOWS',
        actionLabel: 'HIDE',
        icon: 'EyeOff',
        color: 'amber',
        description: 'Slip into the steam vents and observe quietly. Avoid drawing corporate hunter attention.',
        consequence: {
          summary: 'You remain undetected, maintaining pristine stealth reserves and scanning patrol schedules.',
          chaosChange: 0,
          statBonus: 'Stealth Preserved',
          rewardItem: {
            id: 'patrol_route_map',
            name: 'Hunter Drone Route Data',
            description: 'Tactical flight corridors observed from the shadows.',
            icon: 'Compass'
          },
          worldReaction: 'The hunter drones sweep the alley without noticing you. Ambient tension remains steady.'
        }
      },
      {
        id: 'take',
        title: 'APPROPRIATE THE FIRMWARE',
        actionLabel: 'TAKE',
        icon: 'ZapOff',
        color: 'red',
        description: 'Forcefully extract the android’s black-market memory drive for your own neural enhancement.',
        consequence: {
          summary: 'You harvest raw forbidden processing power, but trigger city-wide corporate alert sirens.',
          chaosChange: +25,
          statBonus: 'Hostile Grid Triggered',
          rewardItem: {
            id: 'black_market_core',
            name: 'Stolen Black-Market Firmware',
            description: 'Raw computational power extracted at great moral cost.',
            icon: 'Zap'
          },
          worldReaction: 'Red emergency strobes violently flare across all skyscrapers. High chaos alert sirens echo.'
        }
      }
    ]
  },

  fantasy: {
    entityName: 'Wounded Sylvan Chimera',
    entitySubtitle: 'Living antlered guardian tangled in corrupted iron thorns',
    sceneImage: 'fantasy_encounter',
    description: 'At the foot of the weeping elder willow, a majestic stag-chimera with moss-covered antlers thrashes weakly in blackened iron barbs left by poachers.',
    dilemma: 'Its iridescent eyes lock onto yours, sensing whether you come as healer or predator.',
    options: [
      {
        id: 'help',
        title: 'TEND AND FREE THE BEAST',
        actionLabel: 'HELP',
        icon: 'HeartHandshake',
        color: 'emerald',
        description: 'Gently sever the iron barbs and soothe the beast with harmonic botanical empathy.',
        consequence: {
          summary: 'The chimera blesses your aura with Sylvan Grace, guiding you through dangerous briars.',
          chaosChange: -15,
          statBonus: 'Forest Harmony',
          rewardItem: {
            id: 'chimera_feather',
            name: 'Luminescent Chimera Feather',
            description: 'A glowing plume that repels dark environmental corruptions.',
            icon: 'Sparkles'
          },
          worldReaction: 'The surrounding canopy blooms with golden petals. Bioluminescent moss pulses gently.'
        }
      },
      {
        id: 'hide',
        title: 'CONCEAL YOURSELF IN FOLIAGE',
        actionLabel: 'HIDE',
        icon: 'EyeOff',
        color: 'amber',
        description: 'Mask your scent with damp fern leaves and monitor the forest clearance without interfering.',
        consequence: {
          summary: 'You avoid the thrashing horns and uncover a secluded druidic path around the grove.',
          chaosChange: 0,
          statBonus: 'Prudent Neutrality',
          rewardItem: {
            id: 'druid_herb',
            name: 'Ghost Fern Leaf',
            description: 'Masks bodily presence from predators and hostile spirits.',
            icon: 'Shield'
          },
          worldReaction: 'The forest maintains its muted twilight hum. No ripple disturbs the grove.'
        }
      },
      {
        id: 'take',
        title: 'HARVEST THE HORN ESSENCE',
        actionLabel: 'TAKE',
        icon: 'ZapOff',
        color: 'red',
        description: 'Cut away the chimera’s crystallizing velvet antlers to harness ancient primordial mana.',
        consequence: {
          summary: 'You claim immense magical voltage, but anger the forest consciousness, awakening root tremors.',
          chaosChange: +25,
          statBonus: 'Grove Curse Active',
          rewardItem: {
            id: 'crystallized_horn',
            name: 'Petrified Velvet Antler',
            description: 'Concentrated natural magic thrumming with dangerous wild vitality.',
            icon: 'Zap'
          },
          worldReaction: 'Thorny brambles violently sprout across the paths. Sky clouds darken with mana lightning.'
        }
      }
    ]
  },

  mystery: {
    entityName: 'Unstable Spatial Phantom',
    entitySubtitle: 'Quantum after-image of Commander Vance flickering between dimensions',
    sceneImage: 'mystery_encounter',
    description: 'Inside the depressurized airlock chamber, a luminous human silhouette phases through bulkheads, trapped in a recurring time-dilation loop.',
    dilemma: 'The phantom repeats the words: "...emergency broadcast... do not let the core collapse..."',
    options: [
      {
        id: 'help',
        title: 'STABILIZE CHRONO-ANCHOR',
        actionLabel: 'HELP',
        icon: 'HeartHandshake',
        color: 'emerald',
        description: 'Use your suit energy to synchronize temporal frequencies, releasing Vance’s consciousness.',
        consequence: {
          summary: 'Vance passes peacefully, transferring his master station access codes and calming the anomaly.',
          chaosChange: -15,
          statBonus: 'Quantum Resonance',
          rewardItem: {
            id: 'commander_insignia',
            name: 'Commander Vance Insignia',
            description: 'Master access token unlocking hidden telemetry across Tartarus.',
            icon: 'Shield'
          },
          worldReaction: 'Gravity dampeners stabilize. The station hull ceases groaning under spatial shear.'
        }
      },
      {
        id: 'hide',
        title: 'SEAL AIRLOCK AND MONITOR',
        actionLabel: 'HIDE',
        icon: 'EyeOff',
        color: 'amber',
        description: 'Drop behind the blast door and observe the phantom’s dimensional fluctuation cycle.',
        consequence: {
          summary: 'You record the singularity phase patterns safely without depleting your suit reserves.',
          chaosChange: 0,
          statBonus: 'Telemetry Recorded',
          rewardItem: {
            id: 'singularity_telemetry',
            name: 'Temporal Frequency Readout',
            description: 'Precise coordinates of dimensional safe zones inside the station.',
            icon: 'Compass'
          },
          worldReaction: 'The phantom flickers into another dimension. The station drifts in cosmic silence.'
        }
      },
      {
        id: 'take',
        title: 'SIPHON ZERO-POINT ANOMALY',
        actionLabel: 'TAKE',
        icon: 'ZapOff',
        color: 'red',
        description: 'Deploy a gravimetric siphon to drain the phantom’s dimensional energy into your battery.',
        consequence: {
          summary: 'You store immense tachyon charges, but destabilize the local event horizon, accelerating station decay.',
          chaosChange: +25,
          statBonus: 'Spatial Breach Alert',
          rewardItem: {
            id: 'tachyon_capsule',
            name: 'Overcharged Tachyon Battery',
            description: 'Volatile energy capable of warping reality parameters.',
            icon: 'Zap'
          },
          worldReaction: 'Gravitational anomalies tear through the station. Bulkhead lights strobe in violent crimson.'
        }
      }
    ]
  }
};
