import React, { useState } from 'react';
import { LADDERS, SNAKES } from '../constants/board';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface RulesAndLegendProps {
  onHighlightSquare?: (square: number | null) => void;
}

export const RulesAndLegend: React.FC<RulesAndLegendProps> = ({
  onHighlightSquare,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white/90 rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2.5 px-3.5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-600" />
          <span className="text-xs font-bold text-slate-700">
            Rules & Board Map
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {isOpen && (
        <div className="p-3.5 border-t border-slate-100 text-xs space-y-3 bg-slate-50/50">
          <div>
            <div className="font-bold text-slate-800 mb-1">How to Win:</div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Take turns rolling the dice. Tokens advance square by square. You must land <strong>exactly on 100</strong> to win! Any extra pips bounce back from 100.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {/* Ladders */}
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                🪜 Ladders (Climb UP)
              </div>
              <div className="space-y-0.5 text-emerald-700">
                {LADDERS.map((l) => (
                  <div
                    key={`l-${l.from}`}
                    onMouseEnter={() => onHighlightSquare?.(l.from)}
                    onMouseLeave={() => onHighlightSquare?.(null)}
                    className="hover:font-bold cursor-pointer transition-all"
                  >
                    {l.from} ➔ {l.to}
                  </div>
                ))}
              </div>
            </div>

            {/* Snakes */}
            <div className="p-2 rounded-xl bg-rose-50 border border-rose-100">
              <div className="font-bold text-rose-800 mb-1 flex items-center gap-1">
                🐍 Snakes (Slither DOWN)
              </div>
              <div className="space-y-0.5 text-rose-700">
                {SNAKES.map((s) => (
                  <div
                    key={`s-${s.from}`}
                    onMouseEnter={() => onHighlightSquare?.(s.from)}
                    onMouseLeave={() => onHighlightSquare?.(null)}
                    className="hover:font-bold cursor-pointer transition-all"
                  >
                    {s.from} ➔ {s.to}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
