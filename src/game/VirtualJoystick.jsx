import React from 'react';

/**
 * Mobile Virtual Joystick & Action Pad
 * Provides smooth 360-degree touch navigation + Action button
 */
export default function VirtualJoystick({ onMove, onAction, actionLabel = 'ACT' }) {
  const [active, setActive] = React.useState(false);
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const baseRef = React.useRef(null);

  const handleTouchStart = (e) => {
    setActive(true);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    if (!active) return;
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    if (onMove) onMove({ x: 0, y: 0, isMoving: false });
  };

  const updateJoystick = (touch) => {
    if (!baseRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxRadius = rect.width / 2;

    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(distance, maxRadius);

    const x = Math.cos(angle) * (clampedDist / maxRadius);
    const y = Math.sin(angle) * (clampedDist / maxRadius);

    setPosition({
      x: Math.cos(angle) * clampedDist,
      y: Math.sin(angle) * clampedDist
    });

    if (onMove) {
      onMove({
        x,
        y,
        isMoving: distance > 10,
        direction: Math.abs(x) > Math.abs(y) ? (x > 0 ? 'right' : 'left') : (y > 0 ? 'down' : 'up')
      });
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 px-6 pointer-events-none z-50 flex items-center justify-between select-none">
      {/* Joystick Base */}
      <div
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="w-28 h-28 rounded-full bg-slate-900/60 border-2 border-cyan-500/40 backdrop-blur-md flex items-center justify-center pointer-events-auto shadow-[0_0_20px_rgba(6,182,212,0.2)] touch-none"
      >
        <div
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-cyan-400 border border-white/50 shadow-lg"
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            transition: active ? 'none' : 'transform 0.15s ease-out'
          }}
        />
      </div>

      {/* Action Button */}
      {onAction && (
        <button
          onClick={onAction}
          className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 border-2 border-amber-300 text-slate-950 font-black text-sm tracking-wider flex items-center justify-center pointer-events-auto shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-90 transition-transform"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
