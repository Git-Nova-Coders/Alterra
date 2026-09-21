/**
 * Visual & Atmospheric Audio/FX service
 * Coordinates color themes, CSS variable morphing, and procedural ambient audio triggers
 */

export const VisualService = {
  /**
   * Derives CSS backdrop and lighting filter based on game state
   */
  getAtmosphericFilter(atmosphere, mood, intensity) {
    let brightness = 1.0;
    let contrast = 1.0;
    let hueRotate = '0deg';
    let saturate = 1.0;

    switch (atmosphere) {
      case 'dawn':
        brightness = 1.05;
        contrast = 1.1;
        hueRotate = '15deg';
        break;
      case 'noon':
        brightness = 1.2;
        contrast = 1.25;
        saturate = 1.2;
        break;
      case 'twilight':
        brightness = 0.9;
        contrast = 1.15;
        hueRotate = '-20deg';
        saturate = 1.3;
        break;
      case 'night':
        brightness = 0.75;
        contrast = 1.2;
        hueRotate = '-10deg';
        break;
      case 'storm':
        brightness = 0.7;
        contrast = 1.4;
        saturate = 0.85;
        break;
      default:
        break;
    }

    // Adjust by intensity (0 - 100)
    const intensityFactor = (intensity || 50) / 50;
    contrast = Number((contrast * intensityFactor).toFixed(2));

    return {
      filter: `brightness(${brightness}) contrast(${contrast}) hue-rotate(${hueRotate}) saturate(${saturate})`,
      transition: 'filter 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
    };
  }
};
