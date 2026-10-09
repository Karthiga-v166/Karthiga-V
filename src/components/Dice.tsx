import React from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';

interface DiceProps {
  value: number;
  isRolling: boolean;
  disabled: boolean;
  onRoll: () => void;
  activePlayerName: string;
  activePlayerColor: string;
}

export const Dice: React.FC<DiceProps> = ({
  value,
  isRolling,
  disabled,
  onRoll,
  activePlayerName,
  activePlayerColor,
}) => {
  // Render authentic dice pips
  const renderPips = (val: number) => {
    switch (val) {
      case 1:
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-600 shadow-inner" />
          </div>
        );
      case 2:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 self-end shadow-inner" />
          </div>
        );
      case 3:
        return (
          <div className="w-full h-full flex justify-between p-2">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 self-center shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 self-end shadow-inner" />
          </div>
        );
      case 4:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 p-2 gap-2 place-items-center">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 shadow-inner" />
          </div>
        );
      case 5:
        return (
          <div className="w-full h-full grid grid-cols-3 grid-rows-3 p-1.5 place-items-center">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 col-start-1 row-start-1" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 col-start-3 row-start-1" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-rose-600 col-start-2 row-start-2" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 col-start-1 row-start-3" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800 col-start-3 row-start-3" />
          </div>
        );
      case 6:
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-3 p-1.5 gap-y-1 gap-x-2 place-items-center">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-slate-800" />
          </div>
        );
      default:
        return (
          <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs">
            ?
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 3D Rolling Dice Cube */}
      <div
        onClick={() => !disabled && onRoll()}
        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white via-slate-50 to-slate-200 border-2 border-slate-300 shadow-xl flex items-center justify-center cursor-pointer select-none transition-all duration-200 ${
          disabled
            ? 'opacity-80 cursor-not-allowed'
            : 'hover:scale-105 active:scale-95 hover:shadow-2xl hover:border-amber-400'
        } ${isRolling ? 'animate-spin' : ''}`}
        title={disabled ? 'Moving token...' : 'Click to roll dice'}
      >
        {/* Soft bevel and surface gloss */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/80 to-transparent pointer-events-none" />

        {/* Dice pips */}
        <div className="w-12 h-12 sm:w-16 sm:h-16 relative">
          {renderPips(value)}
        </div>
      </div>

      {/* Primary Roll Button */}
      <button
        onClick={onRoll}
        disabled={disabled}
        className={`w-full py-3 px-6 rounded-xl font-extrabold text-base sm:text-lg tracking-wide shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
          disabled
            ? 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none'
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-xl active:scale-98 border border-amber-400/50'
        }`}
      >
        {isRolling ? (
          <>
            <span className="inline-block animate-bounce">🎲</span>
            <span>Rolling...</span>
          </>
        ) : (
          <>
            <span>🎲</span>
            <span>Roll Dice ({activePlayerName})</span>
          </>
        )}
      </button>

      {/* Result announcement */}
      <div className="text-xs sm:text-sm font-semibold text-slate-600 text-center flex items-center gap-1.5">
        <span>Last roll:</span>
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs">
          {value || '-'}
        </span>
      </div>
    </div>
  );
};
