import React from 'react';

/**
 * Procedural AI Visual Canvas Component
 * Deliberately integrates bespoke SVG visuals for Cyber, Fantasy, and Mystery worlds.
 * Visibly responds to:
 * - world theme (cyber/fantasy/mystery)
 * - atmosphere (dawn/noon/twilight/night/storm)
 * - mood (serene/mysterious/dramatic/apocalyptic)
 * - intensity (brightness, pulse rate, particle density)
 * - chaos (visual distortion, jitter, angle tilt, scanline chaos)
 */
export default function WorldCanvasVisual({ world, mood, intensity = 50, chaos = 50, atmosphere = 'night', className = '' }) {
  const worldId = world?.id || 'cyber';

  // Compute reactive dynamic parameters
  const pulseSpeed = Math.max(0.8, (120 - intensity) / 40);
  const chaosJitter = (chaos / 100) * 8;
  const chaosOpacity = 0.2 + (chaos / 100) * 0.6;
  const filterGlow = `drop-shadow(0 0 ${4 + (intensity / 10)}px ${world?.accentColor || '#00f0ff'})`;

  // Render dedicated world SVGs
  const renderWorldGraphic = () => {
    switch (worldId) {
      case 'cyber':
        return (
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full object-cover select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="cyberSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#040814" />
                <stop offset="60%" stopColor="#0a1226" />
                <stop offset="100%" stopColor="#0f2648" />
              </linearGradient>

              <linearGradient id="neonCyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>

              <linearGradient id="cyberBuildingGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#030712" />
              </linearGradient>

              <filter id="cyberGlow">
                <feGaussianBlur stdDeviation={2 + intensity / 25} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sky */}
            <rect width="1000" height="600" fill="url(#cyberSky)" />

            {/* Cyber City Perspective Grid Floor */}
            <g opacity="0.35">
              {Array.from({ length: 15 }).map((_, i) => (
                <line
                  key={`h-${i}`}
                  x1="0"
                  y1={380 + i * 16}
                  x2="1000"
                  y2={380 + i * 16}
                  stroke="#00f0ff"
                  strokeWidth="1"
                  strokeOpacity={(i + 1) / 15}
                />
              ))}
              {[-300, -150, 0, 150, 300, 450, 550, 700, 850, 1000, 1150, 1300].map((x, i) => (
                <line
                  key={`v-${i}`}
                  x1="500"
                  y1="380"
                  x2={x}
                  y2="600"
                  stroke="#00f0ff"
                  strokeWidth="1.2"
                  strokeOpacity="0.4"
                />
              ))}
            </g>

            {/* Distant Skyscrapers */}
            <rect x="60" y="160" width="90" height="260" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />
            <rect x="180" y="110" width="110" height="310" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />
            <rect x="320" y="200" width="80" height="220" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />
            <rect x="600" y="140" width="130" height="280" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />
            <rect x="760" y="90" width="100" height="330" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />
            <rect x="880" y="220" width="90" height="200" fill="url(#cyberBuildingGrad)" stroke="#1e293b" />

            {/* Fore-Center Megastructure */}
            <polygon points="440,420 440,180 500,100 560,180 560,420" fill="#090e1a" stroke="#00f0ff" strokeWidth="2" filter="url(#cyberGlow)" />
            <circle cx="500" cy="180" r="28" fill="#00f0ff" fillOpacity="0.15" stroke="#00f0ff" strokeWidth="2" filter="url(#cyberGlow)" />
            <circle cx="500" cy="180" r="8" fill="#00f0ff" />

            {/* Animated Neon Window Grids */}
            <g opacity={0.6 + intensity / 250}>
              {Array.from({ length: 8 }).map((_, row) => (
                <line
                  key={`win-${row}`}
                  x1="465"
                  y1={240 + row * 18}
                  x2="535"
                  y2={240 + row * 18}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              ))}
            </g>

            {/* Neon Billboards & Flying Vehicles */}
            <rect x="200" y="150" width="70" height="25" fill="#f43f5e" fillOpacity="0.8" filter="url(#cyberGlow)" />
            <text x="205" y="167" fill="#ffffff" fontSize="11" fontFamily="monospace" fontWeight="bold">SYNTH-NET</text>

            <rect x="620" y="180" width="90" height="20" fill="#00f0ff" fillOpacity="0.8" filter="url(#cyberGlow)" />
            <text x="628" y="195" fill="#050a14" fontSize="11" fontFamily="monospace" fontWeight="bold">QUANTUM // 99</text>

            {/* High Chaos Glitch Spikes */}
            {chaos > 35 && (
              <g opacity={chaosOpacity}>
                <rect x={100 + chaosJitter * 10} y="220" width="300" height="4" fill="#00f0ff" />
                <rect x={550 - chaosJitter * 8} y="310" width="260" height="3" fill="#ec4899" />
                <line x1="0" y1="280" x2="1000" y2="280" stroke="#f43f5e" strokeWidth="1" strokeDasharray="12 8" />
              </g>
            )}

            {/* Digital Rain Particles */}
            {Array.from({ length: Math.floor(12 + intensity / 5) }).map((_, i) => {
              const xPos = (i * 73) % 980;
              const yPos = 40 + ((i * 47) % 360);
              return (
                <line
                  key={`rain-${i}`}
                  x1={xPos}
                  y1={yPos}
                  x2={xPos}
                  y2={yPos + 18 + (intensity / 10)}
                  stroke="#00f0ff"
                  strokeWidth={1 + (i % 2)}
                  strokeOpacity={0.3 + (i % 5) * 0.12}
                />
              );
            })}
          </svg>
        );

      case 'fantasy':
        return (
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full object-cover select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#04120a" />
                <stop offset="50%" stopColor="#062618" />
                <stop offset="100%" stopColor="#0c3823" />
              </linearGradient>

              <linearGradient id="woodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a3826" />
                <stop offset="100%" stopColor="#06180f" />
              </linearGradient>

              <filter id="sylvanGlow">
                <feGaussianBlur stdDeviation={3 + intensity / 20} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Sky / Deep Canopy */}
            <rect width="1000" height="600" fill="url(#forestSky)" />

            {/* Distant Ancient Moon / Core Mana Orb */}
            <circle cx="500" cy="160" r={60 + (intensity / 8)} fill="#34d399" fillOpacity="0.25" filter="url(#sylvanGlow)" />
            <circle cx="500" cy="160" r="32" fill="#10b981" fillOpacity="0.7" filter="url(#sylvanGlow)" />

            {/* Giant World Tree Trunk & Roots */}
            <path
              d="M420,600 C430,420 440,320 450,220 C460,140 480,80 500,40 C520,80 540,140 550,220 C560,320 570,420 580,600 Z"
              fill="url(#woodGrad)"
              stroke="#059669"
              strokeWidth="2"
            />

            {/* Sprawling Massive Branches */}
            <path
              d="M480,180 C360,140 240,160 120,240 C220,220 340,220 460,240 Z"
              fill="#062215"
              stroke="#10b981"
              strokeWidth="1.5"
            />
            <path
              d="M520,180 C640,140 760,160 880,240 C780,220 660,220 540,240 Z"
              fill="#062215"
              stroke="#10b981"
              strokeWidth="1.5"
            />

            {/* Gnarled Root Floor */}
            <path
              d="M0,480 Q250,440 500,490 T1000,470 L1000,600 L0,600 Z"
              fill="#05140b"
            />

            {/* Floating Bioluminescent Runes & Spores */}
            {Array.from({ length: Math.floor(16 + intensity / 4) }).map((_, i) => {
              const cx = (i * 61 + 35) % 960;
              const cy = (i * 41 + 60) % 520;
              const radius = 2 + (i % 4);
              return (
                <circle
                  key={`spore-${i}`}
                  cx={cx + (chaos > 50 ? chaosJitter : 0)}
                  cy={cy}
                  r={radius}
                  fill={i % 2 === 0 ? '#34d399' : '#fef08a'}
                  fillOpacity={0.6 + (i % 4) * 0.1}
                  filter="url(#sylvanGlow)"
                />
              );
            })}

            {/* Ancient Arcane Altar in Center Foreground */}
            <polygon points="460,540 540,540 525,470 475,470" fill="#09291b" stroke="#10b981" strokeWidth="2" filter="url(#sylvanGlow)" />
            <circle cx="500" cy="450" r="14" fill="#34d399" fillOpacity="0.8" filter="url(#sylvanGlow)" />
          </svg>
        );

      case 'mystery':
        return (
          <svg
            viewBox="0 0 1000 600"
            className="w-full h-full object-cover select-none"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="spaceVoid" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#07040d" />
                <stop offset="50%" stopColor="#130822" />
                <stop offset="100%" stopColor="#1e0a36" />
              </linearGradient>

              <filter id="voidGlow">
                <feGaussianBlur stdDeviation={3 + intensity / 22} result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Cosmic Void Canvas */}
            <rect width="1000" height="600" fill="url(#spaceVoid)" />

            {/* Distant Stars Field */}
            {Array.from({ length: 30 }).map((_, i) => (
              <circle
                key={`star-${i}`}
                cx={(i * 37) % 1000}
                cy={(i * 29) % 600}
                r={(i % 3) + 1}
                fill="#ffffff"
                fillOpacity={0.4 + (i % 5) * 0.12}
              />
            ))}

            {/* Gravitational Black Hole / Singularity Rift */}
            <circle cx="500" cy="220" r="95" fill="#000000" stroke="#a855f7" strokeWidth="3" filter="url(#voidGlow)" />
            <circle cx="500" cy="220" r="140" fill="none" stroke="#c084fc" strokeWidth="1.5" strokeDasharray="14 10" opacity="0.6" />
            <ellipse cx="500" cy="220" rx="220" ry="45" fill="none" stroke="#e879f9" strokeWidth="2.5" opacity="0.75" filter="url(#voidGlow)" />

            {/* Derelict Station Hull Frames & Bulkheads */}
            <path
              d="M0,0 L240,140 L240,460 L0,600 Z"
              fill="#0c0716"
              stroke="#6b21a8"
              strokeWidth="2"
            />
            <path
              d="M1000,0 L760,140 L760,460 L1000,600 Z"
              fill="#0c0716"
              stroke="#6b21a8"
              strokeWidth="2"
            />

            {/* Observation Deck Crossbeam struts */}
            <line x1="240" y1="140" x2="760" y2="140" stroke="#4c1d95" strokeWidth="3" />
            <line x1="240" y1="460" x2="760" y2="460" stroke="#4c1d95" strokeWidth="4" />
            <line x1="500" y1="460" x2="500" y2="600" stroke="#6b21a8" strokeWidth="3" />

            {/* Central Tachyon Pedestal */}
            <polygon points="460,560 540,560 520,440 480,440" fill="#180c2e" stroke="#c084fc" strokeWidth="2" filter="url(#voidGlow)" />
            <circle cx="500" cy="415" r="12" fill="#c084fc" filter="url(#voidGlow)" />

            {/* Alert / Distress Beacons */}
            <circle cx="280" cy="160" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="720" cy="160" r="5" fill="#ef4444" className="animate-ping" style={{ animationDuration: '2s' }} />

            {/* Chaos Temporal Glitch Displacements */}
            {chaos > 40 && (
              <g opacity={chaosOpacity}>
                <line x1="200" y1="210" x2="800" y2="210" stroke="#a855f7" strokeWidth="2" strokeDasharray="20 15" />
                <rect x="400" y="190" width="200" height="60" fill="none" stroke="#e879f9" strokeWidth="1" strokeDasharray="6 6" />
              </g>
            )}
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative w-full h-full overflow-hidden rounded-xl border border-cyan-500/30 ${className}`}>
      {/* Visual Canvas */}
      <div
        className="w-full h-full transition-all duration-700"
        style={{
          filter: `brightness(${0.8 + (intensity / 180)}) contrast(${0.9 + (intensity / 200)})`,
          transform: chaos > 60 ? `scale(${1 + (chaos - 60) * 0.001})` : 'none'
        }}
      >
        {renderWorldGraphic()}
      </div>

      {/* Atmospheric Scanline / Vignette Layer */}
      <div className="absolute inset-0 pointer-events-none scanline opacity-60" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05070d] via-transparent to-[#05070d]/60" />

      {/* HUD Telemetry Overlay on Canvas */}
      <div className="absolute top-3 left-3 z-10 flex items-center space-x-2 font-mono text-[11px] bg-black/75 px-2.5 py-1 rounded border border-cyan-500/30 backdrop-blur-sm">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <span className="text-cyan-300 font-bold uppercase">{world?.name || 'SIMULATION CORE'}</span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-300 capitalize">{atmosphere}</span>
        <span className="text-slate-400">|</span>
        <span className="text-purple-300">Chaos {chaos}%</span>
      </div>

      {/* World Identity Watermark */}
      <div className="absolute bottom-3 right-3 z-10 font-mono text-[10px] text-slate-400 bg-black/70 px-2 py-0.5 rounded border border-slate-800">
        AI SHADER GENESIS v3.2
      </div>
    </div>
  );
}
