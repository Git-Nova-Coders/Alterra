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
        contrast = 1.05;
        hueRotate = '10deg';
        break;
      case 'noon':
        brightness = 1.1;
        contrast = 1.1;
        saturate = 1.1;
        break;
      case 'twilight':
        brightness = 1.0;
        contrast = 1.05;
        hueRotate = '-10deg';
        saturate = 1.15;
        break;
      case 'night':
        brightness = 1.0;
        contrast = 1.0;
        hueRotate = '0deg';
        break;
      case 'storm':
        brightness = 0.95;
        contrast = 1.1;
        saturate = 0.95;
        break;
      default:
        break;
    }

    return {
      filter: `brightness(${brightness}) contrast(${contrast}) hue-rotate(${hueRotate}) saturate(${saturate})`
    };
  }
};
