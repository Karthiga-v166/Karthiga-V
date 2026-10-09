import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Sparkles, PartyPopper } from 'lucide-react';
import { Player } from '../types';
import { sound } from '../utils/audio';

interface WinnerModalProps {
  winner: Player;
  turnCount: number;
  onPlayAgain: () => void;
  onCelebrateMore?: () => void;
}

export const WinnerModal: React.FC<WinnerModalProps> = ({
  winner,
  turnCount,
  onPlayAgain,
  onCelebrateMore,
}) => {
  useEffect(() => {
    sound.playWin();
  }, []);

  const isP1 = winner.id === 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-amber-400 text-center z-10 animate-scale-up">
        {/* Glow Trophy decoration */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
          <Trophy className="w-12 h-12 text-amber-900 drop-shadow" />
        </div>

        <div className="mt-8 mb-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Victory Celebration
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {winner.name} Wins!
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Reached Square 100 with an exact roll to win the crown!
          </p>
        </div>

        {/* Winner Token Badge */}
        <div className="flex items-center justify-center gap-3 my-4 py-2.5 px-4 rounded-2xl bg-amber-50/90 border border-amber-200">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xl shadow-md border-2 ${
              isP1
                ? 'bg-gradient-to-br from-red-500 to-rose-700 border-red-200'
                : 'bg-gradient-to-br from-blue-500 to-indigo-700 border-blue-200'
            }`}
          >
            {winner.avatar ? <span>{winner.avatar}</span> : <span className="text-white text-sm">#{winner.id}</span>}
          </div>
          <div className="text-left">
            <div className="text-sm font-bold text-slate-800">{winner.name}</div>
            <div className="text-xs text-slate-500">Board Champion</div>
          </div>
        </div>

        {/* Match Statistics */}
        <div className="grid grid-cols-3 gap-2.5 my-4 text-center">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="text-lg font-black text-slate-800">{turnCount}</div>
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              Total Turns
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-lg font-black text-emerald-700">
              {winner.laddersClimbed}
            </div>
            <div className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider">
              🪜 Ladders
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-lg font-black text-rose-700">
              {winner.snakesEncountered}
            </div>
            <div className="text-[10px] font-semibold text-rose-600 uppercase tracking-wider">
              🐍 Snakes
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 mt-5">
          {onCelebrateMore && (
            <button
              onClick={onCelebrateMore}
              className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <PartyPopper className="w-4 h-4 text-amber-700" />
              Blast More Confetti! 🎉
            </button>
          )}

          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 px-6 rounded-2xl font-black text-base sm:text-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer border border-emerald-400"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </button>
        </div>
      </div>
    </div>
  );
};
