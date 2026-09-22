import React from 'react';

/**
 * Roblox / Voxel Style 3D Character Renderer
 * Pure CSS-3D / Canvas boxy aesthetic:
 * - Blocky Head with blinking pixel eyes & styled hair/cap
 * - Boxy Torso with world/theme emblem
 * - Articulated Left & Right Arms that swing while walking
 * - Articulated Left & Right Legs that alternate stride
 * - Floating zero-G idle drift or grounded shadow
 */
export default function VoxelCharacter({
  isWalking = false,
  direction = 'down', // 'up' | 'down' | 'left' | 'right'
  isFloating = false,
  eyesClosed = false,
  isSleeping = false,
  isNudgingEyes = false,
  colorScheme = {
    skin: '#ffdbac',
    shirt: '#2563eb',
    pants: '#1e293b',
    hair: '#451a03',
    shoes: '#0f172a'
  },
  scale = 1
}) {
  // Rotation style based on direction and state
  const getRotation = () => {
    if (isSleeping) {
      return 'rotateX(75deg) rotateZ(10deg)';
    }
    switch (direction) {
      case 'up': return 'rotateY(180deg)';
      case 'left': return 'rotateY(90deg)';
      case 'right': return 'rotateY(-90deg)';
      default: return 'rotateY(0deg)';
    }
  };

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        perspective: '800px'
      }}
    >
      {/* Ground Shadow or Space Glow */}
      <div
        className={`w-16 h-5 rounded-full mx-auto transition-all duration-500 ${
          isSleeping
            ? 'bg-cyan-500/10 blur-xl scale-125 animate-pulse'
            : isFloating
            ? 'bg-cyan-500/20 blur-md scale-75 animate-pulse'
            : 'bg-black/50 blur-sm scale-100'
        }`}
        style={{ marginTop: '90px' }}
      />

      {/* Floating Zzz micro-particles if sleeping */}
      {isSleeping && (
        <div className="absolute -top-10 right-0 z-30 flex flex-col items-center pointer-events-none select-none">
          <span className="text-cyan-300 font-bold text-xs animate-bounce" style={{ animationDuration: '2s' }}>
            z
          </span>
          <span className="text-cyan-400 font-black text-sm animate-pulse -mr-3" style={{ animationDuration: '1.5s' }}>
            Z
          </span>
          <span className="text-cyan-200 font-black text-base animate-bounce -mr-6" style={{ animationDuration: '2.5s' }}>
            Z
          </span>
        </div>
      )}

      {/* 3D Character Container */}
      <div
        className={`absolute inset-0 flex flex-col items-center transition-all duration-500 ${
          isSleeping ? 'animate-sleeping' : isFloating ? 'animate-float' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: getRotation(),
          height: '95px',
          width: '64px',
          left: 'calc(50% - 32px)',
          top: 0
        }}
      >
        {/* Head */}
        <div
          className="relative w-8 h-8 rounded-sm shadow-md transition-all duration-200"
          style={{
            backgroundColor: colorScheme.skin,
            border: '2px solid rgba(0,0,0,0.15)',
            zIndex: 10
          }}
        >
          {/* Hair / Cap */}
          <div
            className="absolute -top-1 -left-0.5 -right-0.5 h-3 rounded-t-sm"
            style={{ backgroundColor: colorScheme.hair }}
          />

          {/* Face Elements */}
          {!eyesClosed ? (
            <div className="absolute top-3 left-1 right-1 flex justify-between px-1">
              {/* Left Eye */}
              <div className="w-1.5 h-2 bg-slate-900 rounded-xs flex flex-col justify-between">
                <div className="w-1 h-1 bg-white/90 rounded-full" />
              </div>
              {/* Right Eye */}
              <div className="w-1.5 h-2 bg-slate-900 rounded-xs flex flex-col justify-between">
                <div className="w-1 h-1 bg-white/90 rounded-full" />
              </div>
            </div>
          ) : (
            /* Closed Eyes / Sleeping */
            <div className="absolute top-4 left-1 right-1 flex justify-between px-1">
              <div className="w-1.5 h-0.5 bg-slate-800" />
              <div className="w-1.5 h-0.5 bg-slate-800" />
            </div>
          )}

          {/* Subtle Mouth */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-0.5 bg-amber-900/40 rounded-full" />
        </div>

        {/* Torso & Arms Container */}
        <div className="relative flex items-start mt-0.5" style={{ zIndex: 8 }}>
          {/* Left Arm (Swings when walking, rubs eye when nudging) */}
          <div
            className={`w-2.5 h-7 rounded-xs shadow-sm origin-top transition-transform ${
              isNudgingEyes
                ? 'animate-rub-left'
                : isWalking
                ? 'animate-arm-left'
                : isSleeping
                ? 'rotate-45'
                : isFloating
                ? 'rotate-12'
                : ''
            }`}
            style={{
              backgroundColor: colorScheme.shirt,
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* Hand */}
            <div
              className="absolute bottom-0 inset-x-0 h-2"
              style={{ backgroundColor: colorScheme.skin }}
            />
          </div>

          {/* Torso */}
          <div
            className="w-7 h-8 mx-0.5 rounded-xs shadow-sm relative flex flex-col items-center justify-center"
            style={{
              backgroundColor: colorScheme.shirt,
              border: '1.5px solid rgba(0,0,0,0.15)'
            }}
          >
            {/* Chest Emblem / Core Light */}
            <div className="w-2.5 h-2.5 rounded-xs bg-cyan-300/80 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            {/* Belt */}
            <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-950/60" />
          </div>

          {/* Right Arm (Swings inversely, rubs eye when nudging) */}
          <div
            className={`w-2.5 h-7 rounded-xs shadow-sm origin-top transition-transform ${
              isNudgingEyes
                ? 'animate-rub-right'
                : isWalking
                ? 'animate-arm-right'
                : isSleeping
                ? '-rotate-45'
                : isFloating
                ? '-rotate-12'
                : ''
            }`}
            style={{
              backgroundColor: colorScheme.shirt,
              border: '1px solid rgba(0,0,0,0.1)'
            }}
          >
            {/* Hand */}
            <div
              className="absolute bottom-0 inset-x-0 h-2"
              style={{ backgroundColor: colorScheme.skin }}
            />
          </div>
        </div>

        {/* Legs Container */}
        <div className="flex justify-center -mt-0.5" style={{ zIndex: 6 }}>
          {/* Left Leg */}
          <div
            className={`w-3 h-7 mx-0.5 rounded-b-xs shadow-sm origin-top transition-transform ${
              isWalking ? 'animate-leg-left' : isFloating ? 'rotate-6' : ''
            }`}
            style={{
              backgroundColor: colorScheme.pants,
              border: '1px solid rgba(0,0,0,0.15)'
            }}
          >
            {/* Shoe */}
            <div
              className="absolute bottom-0 inset-x-0 h-2.5"
              style={{ backgroundColor: colorScheme.shoes }}
            />
          </div>

          {/* Right Leg */}
          <div
            className={`w-3 h-7 mx-0.5 rounded-b-xs shadow-sm origin-top transition-transform ${
              isWalking ? 'animate-leg-right' : isFloating ? '-rotate-6' : ''
            }`}
            style={{
              backgroundColor: colorScheme.pants,
              border: '1px solid rgba(0,0,0,0.15)'
            }}
          >
            {/* Shoe */}
            <div
              className="absolute bottom-0 inset-x-0 h-2.5"
              style={{ backgroundColor: colorScheme.shoes }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
