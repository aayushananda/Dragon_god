#!/usr/bin/env node

import cliCursor from "cli-cursor";
import { colorize } from "./colorUtils.js";
import readline from "readline";
import { dragonLines, dragonWidth, dragonHeight } from "./dragon.js";
import { FireSystem } from "./fire.js";

function exitGracefully() {
  cliCursor.show();
  process.stdout.write("\x1b[2J\x1b[3J\x1b[H"); // Clear full screen and history, move to top
  process.exit(0);
}

process.on("SIGINT", exitGracefully);
process.on("SIGTERM", exitGracefully);

let width = process.stdout.columns || 80;
let height = process.stdout.rows || 24;

const fire = new FireSystem(width, height);

// Dragon starting position (bottom centered)
let dragonX = (width - dragonWidth) / 2;
let dragonY = height;

// Movement speeds (frames)
let dy = 0.5;

// Prepare color function for dragon
const colorDragon = (char) => colorize("#22c55e", char);

cliCursor.hide();

function render() {
  // Update dimensions in case of resize
  const newWidth = process.stdout.columns || 80;
  const newHeight = process.stdout.rows || 24;

  if (width !== newWidth || height !== newHeight) {
    width = newWidth;
    height = newHeight;
    fire.resize(width, height);
  }

  // Clear buffer (2D array of spaces)
  const buffer = [];
  for (let y = 0; y < height; y++) {
    buffer.push(new Array(width).fill(" "));
  }

  // Update logic
  fire.update();

  // Keep horizontally centered
  dragonX = (width - dragonWidth) / 2;

  // Move up until centered vertically
  const targetY = (height - dragonHeight) / 2;
  if (dragonY > targetY) {
    dragonY -= dy;
    if (dragonY < targetY) dragonY = targetY;
  }

  // Draw fire
  fire.draw(buffer);

  // Draw dragon over rain
  const drX = Math.floor(dragonX);
  const drY = Math.floor(dragonY);

  for (let r = 0; r < dragonHeight; r++) {
    const screenY = drY + r;
    if (screenY >= 0 && screenY < height) {
      const line = dragonLines[r];
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        // Treat both space and Braille blank pattern as transparent
        if (char !== " " && char !== "⠀") {
          const screenX = drX + c;
          if (screenX >= 0 && screenX < width) {
            buffer[screenY][screenX] = colorDragon(char);
          }
        }
      }
    }
  }

  // Create frame string
  let frame = "";
  for (let y = 0; y < height; y++) {
    frame += buffer[y].join("") + (y === height - 1 ? "" : "\n");
  }

  // Render to screen by clearing and writing frame
  // \x1b[H moves cursor to 0,0. It's faster and less flickery than clearing screen entirely.
  process.stdout.write("\x1b[H" + frame);
}

// Clear screen once before loop
process.stdout.write("\x1b[2J\x1b[3J\x1b[H");

setInterval(render, 53); // ~30 FPS
