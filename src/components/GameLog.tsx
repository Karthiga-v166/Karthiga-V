import React from 'react';
import { GameLogEntry } from '../types';
import { MapPin } from 'lucide-react';

interface GameLogProps {
  logs: GameLogEntry[];
  selectedLogId?: string | null;
  onSelectEntry?: (entry: GameLogEntry) => void;
}

export const GameLog: React.FC<GameLogProps> = ({
  logs,
  selectedLogId,
  onSelectEntry,
}) => {
  return (
    <div className="bg-white/90 rounded-2xl border border-slate-200 p-3.5 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Game Feed
          </h4>
          <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-medium">
            Click to review
          </span>
        </div>
        <span className="text-[11px] text-slate-400 font-medium">
          {logs.length} moves
        </span>
      </div>

      <div className="space-y-1.5 max-h-44 overflow-y-auto text-xs pr-1">
        {logs.length === 0 ? (
          <div className="text-slate-400 text-center py-4 italic text-xs">
            Game started! Roll dice to make the first move.
          </div>
        ) : (
          logs.slice(0, 15).map((log) => {
            const isP1 = log.playerId === 1;
            const isSelected = selectedLogId === log.id;
            const targetSquare = log.square ?? log.fromSquare;

            return (
              <div
                key={log.id}
                onClick={() => onSelectEntry?.(log)}
                title={
                  targetSquare
                    ? `Click to highlight Square ${targetSquare} on board for 2 seconds`
                    : 'Click to review'
                }
                className={`p-1.5 rounded-xl border transition-all duration-150 flex items-start gap-2 cursor-pointer leading-snug select-none ${
                  isSelected
                    ? 'bg-amber-100/90 border-amber-400 ring-2 ring-amber-300 text-slate-900 shadow-xs'
                    : 'bg-slate-50/60 border-slate-100 hover:bg-amber-50/50 hover:border-amber-200 text-slate-700'
                }`}
              >
                {/* Player dot / Avatar */}
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${
                    isP1 ? 'bg-rose-500 ring-1 ring-rose-200' : 'bg-blue-500 ring-1 ring-blue-200'
                  }`}
                />

                {/* Text description */}
                <div className="flex-1 min-w-0">
                  <span className="text-slate-800">
                    <strong className={isP1 ? 'text-rose-700' : 'text-blue-700'}>
                      {log.playerName}
                    </strong>{' '}
                    {log.text}
                  </span>
                </div>

                {/* Highlighted square indicator badge */}
                {targetSquare && (
                  <span
                    className={`shrink-0 text-[10px] font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 transition-colors ${
                      isSelected
                        ? 'bg-amber-500 text-white shadow-xs animate-pulse'
                        : 'bg-white text-slate-600 border border-slate-200 group-hover:border-amber-300'
                    }`}
                  >
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{targetSquare}</span>
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

