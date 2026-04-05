import { colorize } from './colorUtils.js';

// 1. Softer character palette (Removed aggressive shapes)
const FIRE_CHARS = ' .,:;+*xX%#'.split('');

// 2. Warmer, subtler palette (More deep reds, peaks at warm amber, no harsh white)
const COLORS = [
  null,
  '#1a0000', '#330000', '#4d0000', '#660000', '#800000',
  '#991a00', '#b33300', '#cc4d00', '#e66600', '#ff8000',
  '#ff9933', '#ffb366', '#ffcc99' 
];

export class FireSystem {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    
    this.firePixels = new Array(this.width * this.height).fill(0);
    this.initBottomRow();
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.firePixels = new Array(this.width * this.height).fill(0);
    this.initBottomRow();
  }

  initBottomRow() {
    const bottomY = this.height - 1;
    const maxIntensity = COLORS.length - 1;
    
    for (let x = 0; x < this.width; x++) {
      this.firePixels[bottomY * this.width + x] = maxIntensity;
    }
  }

  update() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 1; y < this.height; y++) {
        const src = y * this.width + x;
        
        // 3. Decoupled physics: Heat drops gently but consistently
        // Drops by 1 about 60% of the time, resulting in shorter, smoother flames
        const heatLoss = Math.random() > 0.4 ? 1 : 0; 
        
        // 4. Subtler wind: mostly straight up, occasional gentle sway
        const windChance = Math.random();
        let shiftX = 0;
        if (windChance < 0.25) shiftX = -1; // Gentle drift left
        else if (windChance > 0.75) shiftX = 1; // Gentle drift right
        
        let destX = x + shiftX;
        
        // Boundary wrapping/clamping
        if (destX < 0) destX = 0;
        if (destX >= this.width) destX = this.width - 1;
        
        const dest = (y - 1) * this.width + destX;
        let pixel = this.firePixels[src] - heatLoss;
        
        if (pixel < 0) pixel = 0;
        
        this.firePixels[dest] = pixel;
      }
    }
    
    // 5. Softer base generation
    // Instead of a solid wall of max intensity, we poke "holes" in the bottom
    // row to create the illusion of individual, distinct flames swaying up.
    const bottomY = this.height - 1;
    for (let x = 0; x < this.width; x++) {
       if (Math.random() < 0.35) {
         // Drop intensity by 0 to 3 levels to create gaps
         const drop = Math.floor(Math.random() * 4); 
         this.firePixels[bottomY * this.width + x] = Math.max(0, (COLORS.length - 1) - drop);
       } else {
         this.firePixels[bottomY * this.width + x] = COLORS.length - 1;
       }
    }
  }

  draw(buffer) {
    const maxIntensity = COLORS.length - 1;
    for (let y = 0; y < this.height; y++) {
      if (!buffer[y]) buffer[y] = new Array(this.width).fill(' ');
      
      for (let x = 0; x < this.width; x++) {
        let intensity = this.firePixels[y * this.width + x];
        if (intensity < 0) intensity = 0;
        if (intensity > maxIntensity) intensity = maxIntensity;

        // Explicitly render empty space for 0 intensity to avoid artifacts
        if (intensity === 0) {
            buffer[y][x] = ' ';
            continue;
        }

        const charIndex = Math.floor((intensity / maxIntensity) * (FIRE_CHARS.length - 1));
        const char = FIRE_CHARS[charIndex];
        
        const colorHex = COLORS[intensity];
        if (colorHex) {
          buffer[y][x] = colorize(colorHex, char);
        } else {
          buffer[y][x] = char; 
        }
      }
    }
  }
}