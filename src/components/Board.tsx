import React, { useMemo } from 'react';
import { Player } from '../types';
import {
  LADDER_MAP,
  SNAKE_MAP,
  getSquareGridPos,
} from '../constants/board';
import { SnakesLaddersOverlay } from './SnakesLaddersOverlay';

interface BoardProps {
  players: Player[];
  activePlayerId: 1 | 2;
  animatingPlayerId: (1 | 2) | null;
  movingSquare: number | null;
  hoveredSquare: number | null;
  onHoverSquare: (square: number | null) => void;
  winner: Player | null;
  historyHighlightSquare?: number | null;
  historyFromSquare?: number | null;
}

export const Board: React.FC<BoardProps> = ({
  players,
  activePlayerId,
  animatingPlayerId,
  movingSquare,
  hoveredSquare,
  onHoverSquare,
  winner,
  historyHighlightSquare = null,
  historyFromSquare = null,
}) => {
  // Generate the 100 squares sorted by visual row (0 at top to 9 at bottom)
  // Each visual row has 10 columns (0 to 9 left to right)
  const gridCells = useMemo(() => {
    const cells: Array<{
      square: number;
      col: number;
      row: number;
      visualRow: number;
    }> = [];

    for (let visualRow = 0; visualRow < 10; visualRow++) {
      const row = 9 - visualRow; // row 9 at top, row 0 at bottom
      const isRowEven = row % 2 === 0;

      for (let col = 0; col < 10; col++) {
        // If row is even: left to right (col 0 is square row*10 + 1)
        // If row is odd: right to left (col 0 is square row*10 + 10)
        const square = isRowEven
          ? row * 10 + col + 1
          : row * 10 + (10 - col);

        cells.push({ square, col, row, visualRow });
      }
    }
    return cells;
  }, []);

  // Compute token positions
  // If a player is animating and movingSquare is set for them, render them at movingSquare!
  const player1Pos =
    animatingPlayerId === 1 && movingSquare !== null
      ? movingSquare
      : players[0].position;

  const player2Pos =
    animatingPlayerId === 2 && movingSquare !== null
      ? movingSquare
      : players[1].position;

  const sameSquare = player1Pos === player2Pos;

  // Background color generator for chess-board / pastel game board pattern
  const getCellBgClass = (square: number, row: number, col: number) => {
    if (square === 100) return 'bg-amber-100/90 hover:bg-amber-200 border-amber-300';
    if (square === 1) return 'bg-emerald-100/90 hover:bg-emerald-200 border-emerald-300';

    const ladderDest = LADDER_MAP.get(square);
    if (ladderDest) return 'bg-emerald-50/80 hover:bg-emerald-100/90 border-emerald-200';

    const snakeDest = SNAKE_MAP.get(square);
    if (snakeDest) return 'bg-rose-50/80 hover:bg-rose-100/90 border-rose-200';

    // Playful checkerboard in soft warm pastels
    const isEvenCell = (row + col) % 2 === 0;
    if (isEvenCell) {
      return (square % 3 === 0)
        ? 'bg-amber-50/70 hover:bg-amber-100/80 border-amber-100'
        : 'bg-orange-50/60 hover:bg-orange-100/80 border-orange-100';
    } else {
      return (square % 3 === 0)
        ? 'bg-sky-50/70 hover:bg-sky-100/80 border-sky-100'
        : 'bg-violet-50/60 hover:bg-violet-100/80 border-violet-100';
    }
  };

  return (
    <div className="relative w-full max-w-[580px] aspect-square select-none mx-auto">
      {/* Board Outer Frame */}
      <div className="w-full h-full p-2.5 sm:p-3.5 bg-gradient-to-b from-[#38200f] via-[#143221] to-[#0a1f14] rounded-2xl sm:rounded-3xl shadow-[0_20px_60px_rgba(2,44,34,0.7)] ring-4 ring-emerald-500/30">
        {/* Inner Board Area */}
        <div className="relative w-full h-full bg-amber-50 rounded-xl sm:rounded-2xl overflow-hidden border-2 border-amber-950/40 shadow-inner">
          {/* 10x10 Grid */}
          <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
            {gridCells.map(({ square, row, col }) => {
              const ladderTarget = LADDER_MAP.get(square);
              const snakeTarget = SNAKE_MAP.get(square);
              const isLadderTop = Array.from(LADDER_MAP.values()).includes(square);
              const isSnakeTail = Array.from(SNAKE_MAP.values()).includes(square);
              const isP1Here = player1Pos === square;
              const isP2Here = player2Pos === square;
              const isTargeted = hoveredSquare === square;
              const isHistoryMain = historyHighlightSquare === square;
              const isHistoryFrom = historyFromSquare === square;
              const isHistoryTarget = isHistoryMain || isHistoryFrom;

              return (
                <div
                  key={`cell-${square}`}
                  data-square={square}
                  onMouseEnter={() => onHoverSquare(square)}
                  onMouseLeave={() => onHoverSquare(null)}
                  className={`relative flex flex-col justify-between p-0.5 sm:p-1 border border-stone-300/40 transition-all duration-200 cursor-pointer ${getCellBgClass(
                    square,
                    row,
                    col
                  )} ${
                    isHistoryTarget
                      ? 'ring-4 ring-amber-400 ring-inset bg-amber-200/95 shadow-xl z-20 scale-[1.04]'
                      : isTargeted
                      ? 'ring-2 ring-amber-500 z-10'
                      : ''
                  }`}
                >
                  {/* Ping effect when selected from Game Log */}
                  {isHistoryTarget && (
                    <span className="absolute inset-0 bg-amber-400/50 animate-ping rounded pointer-events-none z-10" />
                  )}

                  {/* Spotlight label on highlighted history square */}
                  {isHistoryMain && (
                    <div className="absolute -top-4 sm:-top-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                      <div className="bg-slate-900 text-amber-300 font-black text-[8px] sm:text-[10px] px-1.5 py-0.5 rounded-full shadow-xl border border-amber-400 whitespace-nowrap animate-bounce flex items-center gap-1">
                        <span>📍</span>
                        <span>Sq {square}</span>
                      </div>
                    </div>
                  )}

                  {/* Square Number */}
                  <div className="flex items-center justify-between leading-none">
                    <span
                      className={`text-[9px] sm:text-xs font-black tracking-tight ${
                        square === 100
                          ? 'text-amber-800 font-extrabold text-[11px] sm:text-sm'
                          : square === 1
                          ? 'text-emerald-800 font-extrabold'
                          : 'text-stone-700/85'
                      }`}
                    >
                      {square}
                    </span>

                    {/* Badge for special cells */}
                    {square === 100 && (
                      <span className="text-[10px] sm:text-xs animate-bounce" title="Goal!">
                        🏆
                      </span>
                    )}
                    {square === 1 && (
                      <span className="text-[8px] sm:text-[10px] font-bold text-emerald-700">
                        START
                      </span>
                    )}
                  </div>

                  {/* Cell Info Indicators (Subtle guides) */}
                  <div className="flex items-end justify-end mt-auto pointer-events-none">
                    {ladderTarget && (
                      <span
                        className="text-[7px] sm:text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-0.5 rounded leading-tight shadow-xs flex items-center gap-0.5"
                        title={`Ladder climbs to ${ladderTarget}`}
                      >
                        🪜<span className="hidden sm:inline">+{ladderTarget - square}</span>
                      </span>
                    )}
                    {snakeTarget && (
                      <span
                        className="text-[7px] sm:text-[9px] font-bold text-rose-700 bg-rose-100/80 px-0.5 rounded leading-tight shadow-xs flex items-center gap-0.5"
                        title={`Snake bites down to ${snakeTarget}`}
                      >
                        🐍<span className="hidden sm:inline">-{square - snakeTarget}</span>
                      </span>
                    )}
                    {isLadderTop && !ladderTarget && (
                      <span className="text-[7px] sm:text-[8px] text-emerald-600 font-semibold opacity-70">
                        ▲
                      </span>
                    )}
                    {isSnakeTail && !snakeTarget && (
                      <span className="text-[7px] sm:text-[8px] text-rose-600 font-semibold opacity-70">
                        ▼
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* SVG Snakes & Ladders Graphics Overlay */}
          <SnakesLaddersOverlay
            activeSquare={
              hoveredSquare ||
              movingSquare ||
              historyHighlightSquare ||
              historyFromSquare
            }
          />

          {/* PLAYER TOKENS OVERLAY */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Player 1 Token */}
            <PlayerToken
              player={players[0]}
              position={player1Pos}
              isActiveTurn={activePlayerId === 1 && !winner}
              isAnimating={animatingPlayerId === 1}
              offsetMode={sameSquare ? 'offset-left' : 'center'}
            />

            {/* Player 2 Token */}
            <PlayerToken
              player={players[1]}
              position={player2Pos}
              isActiveTurn={activePlayerId === 2 && !winner}
              isAnimating={animatingPlayerId === 2}
              offsetMode={sameSquare ? 'offset-right' : 'center'}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface PlayerTokenProps {
  player: Player;
  position: number;
  isActiveTurn: boolean;
  isAnimating: boolean;
  offsetMode: 'center' | 'offset-left' | 'offset-right';
}

const PlayerToken: React.FC<PlayerTokenProps> = ({
  player,
  position,
  isActiveTurn,
  isAnimating,
  offsetMode,
}) => {
  const { col, visualRow } = getSquareGridPos(position);

  // Percentage within the board
  const leftPct = col * 10 + 5;
  const topPct = visualRow * 10 + 5;

  let offsetX = 0;
  let offsetY = 0;
  if (offsetMode === 'offset-left') {
    offsetX = -7;
    offsetY = -5;
  } else if (offsetMode === 'offset-right') {
    offsetX = 7;
    offsetY = 5;
  }

  const isP1 = player.id === 1;

  return (
    <div
      className="absolute transition-all duration-200 ease-out will-change-transform"
      style={{
        left: `${leftPct}%`,
        top: `${topPct}%`,
        transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) ${
          isAnimating ? 'scale(1.28) translateY(-8px)' : 'scale(1)'
        }`,
      }}
    >
      <div className="relative group flex items-center justify-center">
        {/* Active player indicator halo */}
        {isActiveTurn && (
          <div
            className={`absolute -inset-1.5 rounded-full animate-ping opacity-60 ${
              isP1 ? 'bg-red-400' : 'bg-blue-400'
            }`}
          />
        )}

        {/* Token Coin / Pawn */}
        <div
          className={`w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-black text-xs sm:text-sm text-white shadow-lg border-2 transition-transform ${
            isP1
              ? 'bg-gradient-to-br from-red-500 via-rose-600 to-red-800 border-red-200 shadow-red-900/40'
              : 'bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-800 border-blue-200 shadow-blue-900/40'
          } ${isAnimating ? 'ring-2 ring-white ring-offset-1 shadow-xl' : ''}`}
        >
          {player.avatar ? (
            <span className="text-xs sm:text-sm drop-shadow-xs leading-none select-none">{player.avatar}</span>
          ) : (
            <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white/40 flex items-center justify-center bg-black/10 text-[10px]">
              <span>{player.id}</span>
            </div>
          )}
        </div>

        {/* Small shadow underneath token */}
        <div className="absolute -bottom-1 w-5 sm:w-6 h-1.5 bg-black/30 rounded-full blur-[1px] -z-10" />
      </div>
    </div>
  );
};
