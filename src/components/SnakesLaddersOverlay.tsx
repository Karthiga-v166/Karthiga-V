import React from 'react';
import { LADDERS, SNAKES, getSquareCenterCoords } from '../constants/board';
import { SnakeOrLadder } from '../types';

interface SnakesLaddersOverlayProps {
  activeSquare?: number | null;
  onHoverSquare?: (square: number | null) => void;
}

export const SnakesLaddersOverlay: React.FC<SnakesLaddersOverlayProps> = ({
  activeSquare,
}) => {
  return (
    <svg
      viewBox="0 0 1000 1000"
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
    >
      <defs>
        {/* Shadow filter for realistic board game depth */}
        <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.28" floodColor="#0f172a" />
        </filter>
        <filter id="glow-highlight" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Ladder gradients */}
        <linearGradient id="ladder-wood-amber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B45309" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#92400E" />
        </linearGradient>

        <linearGradient id="ladder-rail-highlight" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Snake body gradients */}
        <linearGradient id="snake-green" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803D" />
          <stop offset="50%" stopColor="#22C55E" />
          <stop offset="100%" stopColor="#166534" />
        </linearGradient>
        <linearGradient id="snake-red" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#B91C1C" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>
        <linearGradient id="snake-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B21A8" />
          <stop offset="50%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#581C87" />
        </linearGradient>
        <linearGradient id="snake-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C2410C" />
          <stop offset="50%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#9A3412" />
        </linearGradient>
      </defs>

      {/* RENDER LADDERS */}
      <g id="ladders-group">
        {LADDERS.map((ladder, idx) => (
          <LadderElement
            key={`ladder-${ladder.from}-${ladder.to}`}
            ladder={ladder}
            index={idx}
            isHighlighted={activeSquare === ladder.from || activeSquare === ladder.to}
          />
        ))}
      </g>

      {/* RENDER SNAKES */}
      <g id="snakes-group">
        {SNAKES.map((snake, idx) => (
          <SnakeElement
            key={`snake-${snake.from}-${snake.to}`}
            snake={snake}
            index={idx}
            isHighlighted={activeSquare === snake.from || activeSquare === snake.to}
          />
        ))}
      </g>
    </svg>
  );
};

/**
 * Individual Ladder Graphic with wooden rails, rungs, and highlight
 */
const LadderElement: React.FC<{
  ladder: SnakeOrLadder;
  index: number;
  isHighlighted: boolean;
}> = ({ ladder, isHighlighted }) => {
  const start = getSquareCenterCoords(ladder.from); // Bottom
  const end = getSquareCenterCoords(ladder.to); // Top

  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return null;

  // Normal vector perpendicular to ladder rails
  const nx = -dy / dist;
  const ny = dx / dist;
  const halfWidth = 14;

  // Rail 1: left
  const r1StartX = start.x - nx * halfWidth;
  const r1StartY = start.y - ny * halfWidth;
  const r1EndX = end.x - nx * halfWidth;
  const r1EndY = end.y - ny * halfWidth;

  // Rail 2: right
  const r2StartX = start.x + nx * halfWidth;
  const r2StartY = start.y + ny * halfWidth;
  const r2EndX = end.x + nx * halfWidth;
  const r2EndY = end.y + ny * halfWidth;

  // Rungs
  const numRungs = Math.max(3, Math.floor(dist / 32));
  const rungs = [];
  for (let i = 1; i <= numRungs; i++) {
    const t = i / (numRungs + 1);
    const mx = start.x + dx * t;
    const my = start.y + dy * t;
    rungs.push({
      x1: mx - nx * (halfWidth - 1),
      y1: my - ny * (halfWidth - 1),
      x2: mx + nx * (halfWidth - 1),
      y2: my + ny * (halfWidth - 1),
    });
  }

  return (
    <g
      filter="url(#drop-shadow)"
      className={`transition-all duration-300 ${
        isHighlighted ? 'opacity-100 scale-102 filter drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]' : 'opacity-90 hover:opacity-100'
      }`}
    >
      {/* Glow if highlighted */}
      {isHighlighted && (
        <path
          d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
          stroke="#4ADE80"
          strokeWidth="36"
          strokeLinecap="round"
          opacity="0.5"
        />
      )}

      {/* Shadow layer underneath rungs */}
      {rungs.map((r, i) => (
        <line
          key={`shadow-rung-${i}`}
          x1={r.x1}
          y1={r.y1 + 2}
          x2={r.x2}
          y2={r.y2 + 2}
          stroke="#78350F"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.4"
        />
      ))}

      {/* Wooden Rungs */}
      {rungs.map((r, i) => (
        <line
          key={`rung-${i}`}
          x1={r.x1}
          y1={r.y1}
          x2={r.x2}
          y2={r.y2}
          stroke="#D97706"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      ))}

      {/* Rung highlight shine */}
      {rungs.map((r, i) => (
        <line
          key={`rung-shine-${i}`}
          x1={r.x1 + 1}
          y1={r.y1 - 0.5}
          x2={r.x2 - 1}
          y2={r.y2 - 0.5}
          stroke="#FDE68A"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Ladder Rails */}
      <line
        x1={r1StartX}
        y1={r1StartY}
        x2={r1EndX}
        y2={r1EndY}
        stroke="#92400E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1={r1StartX}
        y1={r1StartY}
        x2={r1EndX}
        y2={r1EndY}
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <line
        x1={r2StartX}
        y1={r2StartY}
        x2={r2EndX}
        y2={r2EndY}
        stroke="#92400E"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <line
        x1={r2StartX}
        y1={r2StartY}
        x2={r2EndX}
        y2={r2EndY}
        stroke="#F59E0B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Ladder end caps */}
      <circle cx={r1StartX} cy={r1StartY} r="4" fill="#B45309" stroke="#78350F" strokeWidth="1" />
      <circle cx={r2StartX} cy={r2StartY} r="4" fill="#B45309" stroke="#78350F" strokeWidth="1" />
      <circle cx={r1EndX} cy={r1EndY} r="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
      <circle cx={r2EndX} cy={r2EndY} r="4" fill="#FDE68A" stroke="#B45309" strokeWidth="1" />
    </g>
  );
};

/**
 * Individual Snake Graphic with wavy slithering body, head with eyes/tongue, and tail
 */
const SnakeElement: React.FC<{
  snake: SnakeOrLadder;
  index: number;
  isHighlighted: boolean;
}> = ({ snake, index, isHighlighted }) => {
  const headPos = getSquareCenterCoords(snake.from); // Higher square (head)
  const tailPos = getSquareCenterCoords(snake.to); // Lower square (tail)

  const dx = tailPos.x - headPos.x;
  const dy = tailPos.y - headPos.y;
  const dist = Math.hypot(dx, dy);
  if (dist === 0) return null;

  // Perpendicular vector for snake sways
  const nx = -dy / dist;
  const ny = dx / dist;

  // Calculate organic wavy path with multiple control points
  const bends = Math.max(2, Math.min(4, Math.round(dist / 140)));
  const steps = bends * 4;
  const points: Array<{ x: number; y: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Envelope: 0 at head, sways in middle, tapered at tail
    const envelope = Math.sin(t * Math.PI) * (1 - t * 0.35);
    const wave = Math.sin(t * Math.PI * bends * 2);
    // Alternate side bias based on index
    const sideSign = index % 2 === 0 ? 1 : -1;
    const offset = sideSign * wave * 26 * envelope;

    const px = headPos.x + dx * t + nx * offset;
    const py = headPos.y + dy * t + ny * offset;
    points.push({ x: px, y: py });
  }

  // Construct SVG cubic path through points
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    pathD += ` Q ${prev.x} ${prev.y} ${mx} ${my}`;
  }
  const last = points[points.length - 1];
  pathD += ` L ${last.x} ${last.y}`;

  // Snake color themes
  const colorThemes = [
    { body: '#DC2626', belly: '#FCA5A5', spots: '#991B1B', eye: '#FEF08A' }, // Crimson
    { body: '#16A34A', belly: '#86EFAC', spots: '#14532D', eye: '#FEF08A' }, // Emerald
    { body: '#9333EA', belly: '#E9D5FF', spots: '#581C87', eye: '#FDE047' }, // Purple
    { body: '#EA580C', belly: '#FDBA74', spots: '#9A3412', eye: '#FEF08A' }, // Orange
    { body: '#0284C7', belly: '#BAE6FD', spots: '#075985', eye: '#FDE047' }, // Blue
  ];
  const theme = colorThemes[index % colorThemes.length];

  // Calculate head direction angle
  const headAngle = (Math.atan2(points[1].y - points[0].y, points[1].x - points[0].x) * 180) / Math.PI;

  return (
    <g
      filter="url(#drop-shadow)"
      className={`transition-all duration-300 ${
        isHighlighted ? 'opacity-100 scale-102 filter drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]' : 'opacity-90 hover:opacity-100'
      }`}
    >
      {/* Danger glow if active */}
      {isHighlighted && (
        <path
          d={pathD}
          fill="none"
          stroke="#EF4444"
          strokeWidth="34"
          strokeLinecap="round"
          opacity="0.45"
        />
      )}

      {/* Snake Body Shadow */}
      <path
        d={pathD}
        fill="none"
        stroke="#0f172a"
        strokeWidth="18"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.25"
        transform="translate(2, 4)"
      />

      {/* Main Snake Body */}
      <path
        d={pathD}
        fill="none"
        stroke={theme.body}
        strokeWidth="15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Belly stripe (slightly thinner lighter stroke) */}
      <path
        d={pathD}
        fill="none"
        stroke={theme.belly}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />

      {/* Pattern stripes / scales along body */}
      <path
        d={pathD}
        fill="none"
        stroke={theme.spots}
        strokeWidth="10"
        strokeDasharray="4 16"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Tail rattle/tip */}
      <circle cx={tailPos.x} cy={tailPos.y} r="4.5" fill={theme.spots} />
      <circle cx={tailPos.x} cy={tailPos.y} r="2.5" fill="#FEF08A" />

      {/* Snake Head at snake.from (start square) */}
      <g transform={`translate(${headPos.x}, ${headPos.y}) rotate(${headAngle - 180})`}>
        {/* Forked tongue pointing out */}
        <path
          d="M 12 0 L 22 -4 M 12 0 L 22 4 M 0 0 L 12 0"
          stroke="#EF4444"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Head shape */}
        <ellipse cx="2" cy="0" rx="14" ry="11" fill={theme.body} stroke={theme.spots} strokeWidth="1.5" />
        <ellipse cx="0" cy="0" rx="8" ry="6" fill={theme.belly} opacity="0.4" />

        {/* Left eye */}
        <circle cx="3" cy="-6" r="3.5" fill={theme.eye} stroke="#18181B" strokeWidth="0.8" />
        <circle cx="4" cy="-6" r="1.8" fill="#18181B" />
        <circle cx="4.5" cy="-6.5" r="0.7" fill="#FFFFFF" />

        {/* Right eye */}
        <circle cx="3" cy="6" r="3.5" fill={theme.eye} stroke="#18181B" strokeWidth="0.8" />
        <circle cx="4" cy="6" r="1.8" fill="#18181B" />
        <circle cx="4.5" cy="5.5" r="0.7" fill="#FFFFFF" />

        {/* Nostrils */}
        <circle cx="10" cy="-2.5" r="0.8" fill="#450A0A" />
        <circle cx="10" cy="2.5" r="0.8" fill="#450A0A" />
      </g>
    </g>
  );
};
