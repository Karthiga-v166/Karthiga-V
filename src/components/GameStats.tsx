import React from 'react';
import { BarChart3, TrendingUp, RotateCcw, Trophy } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

export interface SessionStats {
  totalRolls: number;
  totalSnakes: number;
  totalLadders: number;
  gamesPlayed: number;
  p1Wins: number;
  p2Wins: number;
}

interface GameStatsProps {
  stats: SessionStats;
  onResetStats: () => void;
  p1Name?: string;
  p2Name?: string;
  p1Avatar?: string;
  p2Avatar?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: {
      player: string;
      wins: number;
      winRate: number;
      color: string;
    };
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 text-white px-2.5 py-1.5 rounded-lg shadow-xl border border-slate-700 text-xs">
        <div className="font-bold flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: data.color }}
          />
          {data.player}
        </div>
        <div className="text-[11px] text-slate-300 mt-0.5">
          Wins: <strong className="text-white">{data.wins}</strong> ({data.winRate}%)
        </div>
      </div>
    );
  }
  return null;
};

export const GameStats: React.FC<GameStatsProps> = ({
  stats,
  onResetStats,
  p1Name = 'Player 1',
  p2Name = 'Player 2',
  p1Avatar = '🦁',
  p2Avatar = '🐯',
}) => {
  const luckScore =
    stats.totalSnakes + stats.totalLadders > 0
      ? Math.round((stats.totalLadders / (stats.totalSnakes + stats.totalLadders)) * 100)
      : 50;

  const totalWins = stats.p1Wins + stats.p2Wins;
  const p1Rate = totalWins > 0 ? Math.round((stats.p1Wins / totalWins) * 100) : 0;
  const p2Rate = totalWins > 0 ? Math.round((stats.p2Wins / totalWins) * 100) : 0;

  // Chart data formatted for recharts horizontal bars
  const chartData = [
    {
      player: p1Name,
      label: `${p1Avatar} ${p1Name.split(' ')[0]}`,
      wins: stats.p1Wins,
      winRate: p1Rate,
      color: '#EF4444',
    },
    {
      player: p2Name,
      label: `${p2Avatar} ${p2Name.split(' ')[0]}`,
      wins: stats.p2Wins,
      winRate: p2Rate,
      color: '#3B82F6',
    },
  ];

  const maxWins = Math.max(stats.p1Wins, stats.p2Wins, 1);

  return (
    <div className="bg-white/95 rounded-2xl border border-emerald-900/10 p-3.5 sm:p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-emerald-600" />
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-700">
            Game Statistics
          </h4>
        </div>
        <button
          onClick={onResetStats}
          className="text-[10px] text-slate-400 hover:text-slate-700 flex items-center gap-1 transition-colors cursor-pointer"
          title="Reset lifetime statistics"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Total Rolls */}
        <div className="p-2 rounded-xl bg-amber-50/70 border border-amber-100 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-tight">
            Total Rolls
          </span>
          <span className="text-xl font-black text-amber-950 mt-0.5">
            {stats.totalRolls}
          </span>
          <span className="text-[9px] text-amber-700/80 font-medium mt-0.5">
            🎲 session
          </span>
        </div>

        {/* Ladders Climbed */}
        <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-tight">
            Ladders
          </span>
          <span className="text-xl font-black text-emerald-700 mt-0.5">
            {stats.totalLadders}
          </span>
          <span className="text-[9px] text-emerald-600/90 font-medium mt-0.5">
            🪜 climbed
          </span>
        </div>

        {/* Snakes Encountered */}
        <div className="p-2 rounded-xl bg-rose-50/70 border border-rose-100 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-tight">
            Snakes
          </span>
          <span className="text-xl font-black text-rose-700 mt-0.5">
            {stats.totalSnakes}
          </span>
          <span className="text-[9px] text-rose-600/90 font-medium mt-0.5">
            🐍 bitten
          </span>
        </div>
      </div>

      {/* RECHARTS BAR CHART: Win Ratio Visualization */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <div className="flex items-center gap-1 font-bold text-slate-700">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            <span>Win Ratio (Head-to-Head)</span>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">
            {totalWins === 0 ? 'No wins yet' : `${totalWins} total wins`}
          </span>
        </div>

        {/* Recharts Container */}
        <div className="h-24 w-full bg-slate-50/70 rounded-xl p-1.5 border border-slate-100">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 4, right: 28, left: 4, bottom: 4 }}
            >
              <XAxis
                type="number"
                domain={[0, maxWins]}
                hide
              />
              <YAxis
                type="category"
                dataKey="label"
                width={85}
                tick={{ fontSize: 11, fill: '#334155', fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.04)' }} />
              <Bar
                dataKey="wins"
                radius={[0, 6, 6, 0]}
                barSize={14}
                animationDuration={600}
                label={{
                  position: 'right',
                  fontSize: 10,
                  fontWeight: 800,
                  fill: '#475569',
                  formatter: (val) => `${val} (${val === stats.p1Wins ? p1Rate : p2Rate}%)`,
                }}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`bar-cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="font-medium text-slate-500">Games Completed:</span>
          <span className="font-black text-slate-800">{stats.gamesPlayed}</span>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span>Luck Index:</span>
          <span
            className={`font-black ${
              luckScore >= 50 ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {luckScore}%
          </span>
        </div>
      </div>
    </div>
  );
};
