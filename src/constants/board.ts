import { SnakeOrLadder } from '../types';

export const LADDERS: SnakeOrLadder[] = [
  { from: 4, to: 14, color: '#D97706' }, // Amber
  { from: 9, to: 31, color: '#059669' }, // Emerald
  { from: 20, to: 38, color: '#2563EB' }, // Blue
  { from: 28, to: 84, color: '#7C3AED' }, // Violet (Super ladder!)
  { from: 40, to: 59, color: '#D97706' }, // Amber
  { from: 51, to: 67, color: '#059669' }, // Emerald
  { from: 63, to: 81, color: '#2563EB' }, // Blue
  { from: 71, to: 91, color: '#D97706' }, // Amber
];

export const SNAKES: SnakeOrLadder[] = [
  { from: 17, to: 7, color: '#E11D48' }, // Rose/Crimson
  { from: 54, to: 34, color: '#EA580C' }, // Orange
  { from: 62, to: 19, color: '#7E22CE' }, // Purple
  { from: 64, to: 60, color: '#16A34A' }, // Green viper
  { from: 87, to: 24, color: '#DC2626' }, // Red (Giant danger!)
  { from: 93, to: 73, color: '#0891B2' }, // Cyan
  { from: 95, to: 75, color: '#D97706' }, // Amber
  { from: 99, to: 78, color: '#BE123C' }, // Deep Crimson (Final hurdle!)
];

export const LADDER_MAP = new Map<number, number>(
  LADDERS.map((l) => [l.from, l.to])
);

export const SNAKE_MAP = new Map<number, number>(
  SNAKES.map((s) => [s.from, s.to])
);

/**
 * Returns the column (0-9 from left to right) and row (0-9 from bottom to top)
 * for a square number (1-100).
 * Bottom row (1-10): Left -> Right (col 0..9)
 * Row 2 (11-20): Right -> Left (col 9..0)
 * ...
 * Top row (91-100): Right -> Left (col 9..0, so 100 is at col 0, top left)
 */
export function getSquareGridPos(square: number): { col: number; row: number; visualRow: number } {
  const row = Math.floor((square - 1) / 10); // 0 (bottom) to 9 (top)
  const isRowEven = row % 2 === 0;
  const col = isRowEven ? (square - 1) % 10 : 9 - ((square - 1) % 10);
  const visualRow = 9 - row; // 0 (top) to 9 (bottom) for screen rendering
  return { col, row, visualRow };
}

/**
 * Returns (x, y) center coordinate in a 1000x1000 coordinate system
 */
export function getSquareCenterCoords(square: number): { x: number; y: number } {
  const { col, visualRow } = getSquareGridPos(square);
  const x = col * 100 + 50;
  const y = visualRow * 100 + 50;
  return { x, y };
}

export const CELL_COLOR_PALETTES = [
  'bg-amber-50/90 text-amber-950 hover:bg-amber-100',
  'bg-emerald-50/90 text-emerald-950 hover:bg-emerald-100',
  'bg-sky-50/90 text-sky-950 hover:bg-sky-100',
  'bg-rose-50/90 text-rose-950 hover:bg-rose-100',
  'bg-violet-50/90 text-violet-950 hover:bg-violet-100',
];
