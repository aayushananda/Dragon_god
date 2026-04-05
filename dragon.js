import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dragonArt = fs.readFileSync(join(__dirname, 'dragon.txt'), 'utf8');
export const dragonLines = dragonArt.split('\n');

export const dragonWidth = Math.max(...dragonLines.map(l => l.length));
export const dragonHeight = dragonLines.length;
