export function colorize(hex, text) {
  if (!hex) return text;
  const hashLess = hex.startsWith('#') ? hex.slice(1) : hex;
  const r = parseInt(hashLess.slice(0, 2), 16);
  const g = parseInt(hashLess.slice(2, 4), 16);
  const b = parseInt(hashLess.slice(4, 6), 16);
  return `\x1b[38;2;${r};${g};${b}m${text}\x1b[39m`;
}
