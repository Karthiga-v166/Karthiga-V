import React from 'react';
import { Player } from '../types';
import { Bot, Sparkles } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isActive: boolean;
  isMoving: boolean;
  onEditAvatar?: (player: Player) => void;
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  player,
  isActive,
  isMoving,
  onEditAvatar,
}) => {
  const isP1 = player.id === 1;
  const remaining = 100 - player.position;

  return (
    <div
      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 transition-all duration-200 ${
        isActive
          ? isP1
            ? 'bg-rose-50/95 border-rose-500 shadow-md ring-2 ring-rose-400/40'
            : 'bg-blue-50/95 border-blue-500 shadow-md ring-2 ring-blue-400/40'
          : 'bg-white/85 border-slate-200 opacity-90'
      }`}
    >
      {/* Active turn badge */}
      {isActive && (
        <span
          className={`absolute -top-2.5 right-3 text-[10px] font-black uppercase tracking-wider py-0.5 px-2 rounded-full text-white shadow-xs ${
            isP1 ? 'bg-rose-600' : 'bg-blue-600'
          }`}
        >
          {isMoving ? 'Moving...' : "It's Your Turn"}
        </span>
      )}

      <div className="flex items-center gap-3">
        {/* Token avatar with customize button */}
        <div
          onClick={() => onEditAvatar?.(player)}
          title="Click to customize avatar"
          className="relative group cursor-pointer"
        >
          <div
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-md border-2 transition-transform group-hover:scale-105 active:scale-95 ${
              isP1
                ? 'bg-gradient-to-br from-red-500 to-rose-700 border-red-200'
                : 'bg-gradient-to-br from-blue-500 to-indigo-700 border-blue-200'
            }`}
          >
            {player.avatar ? (
              <span>{player.avatar}</span>
            ) : player.isComputer ? (
              <Bot className="w-6 h-6 text-white" />
            ) : (
              <span className="text-white text-base">#{player.id}</span>
            )}
          </div>

          {/* Quick Edit Overlay Pin */}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white text-emerald-800 shadow-xs border border-emerald-300 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="w-2.5 h-2.5 text-amber-500" />
          </div>
        </div>

        {/* Player info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3
              onClick={() => onEditAvatar?.(player)}
              className="font-extrabold text-xs sm:text-sm text-slate-800 truncate cursor-pointer hover:underline"
              title="Click to edit name"
            >
              {player.name}
            </h3>
            {player.isComputer && (
              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                AI
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
            <span>
              Square <strong className="text-slate-900 font-black">{player.position}</strong>
            </span>
            <span>·</span>
            <span>{remaining === 0 ? 'Goal! 🏆' : `${remaining} to 100`}</span>
          </div>
        </div>
      </div>

      {/* Progress Bar towards 100 */}
      <div className="mt-3">
        <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isP1 ? 'bg-rose-500' : 'bg-blue-500'
            }`}
            style={{ width: `${player.position}%` }}
          />
        </div>
      </div>
    </div>
  );
};
