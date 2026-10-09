import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Player, GameMode, GameLogEntry, PlayerId } from './types';
import { Board } from './components/Board';
import { Dice } from './components/Dice';
import { PlayerCard } from './components/PlayerCard';
import { GameLog } from './components/GameLog';
import { WinnerModal } from './components/WinnerModal';
import { AvatarModal } from './components/AvatarModal';
import { RulesAndLegend } from './components/RulesAndLegend';
import { GameStats, SessionStats } from './components/GameStats';
import { ForestBackground } from './components/ForestBackground';
import { CelebrationCanvas, CelebrationCanvasHandle } from './components/CelebrationCanvas';
import { LADDER_MAP, SNAKE_MAP } from './constants/board';
import { sound } from './utils/audio';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Users,
  Bot,
  Zap,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Game Setup State
  const [gameMode, setGameMode] = useState<GameMode>('pvp');
  const [soundMuted, setSoundMuted] = useState(false);
  const [isFastSpeed, setIsFastSpeed] = useState(false);

  // Player State
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: 'Player 1 (Lion)',
      avatar: '🦁',
      color: '#EF4444',
      lightColor: '#FEE2E2',
      borderColor: '#DC2626',
      accentColor: '#B91C1C',
      tokenBg: 'from-red-500 to-rose-700',
      position: 1,
      snakesEncountered: 0,
      laddersClimbed: 0,
      isComputer: false,
    },
    {
      id: 2,
      name: 'Player 2 (Tiger)',
      avatar: '🐯',
      color: '#3B82F6',
      lightColor: '#DBEAFE',
      borderColor: '#2563EB',
      accentColor: '#1D4ED8',
      tokenBg: 'from-blue-500 to-indigo-700',
      position: 1,
      snakesEncountered: 0,
      laddersClimbed: 0,
      isComputer: false,
    },
  ]);

  // Custom Avatar Modal State
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  // Turn & Dice State
  const [activePlayerId, setActivePlayerId] = useState<PlayerId>(1);
  const [diceValue, setDiceValue] = useState<number>(1);
  const [isRolling, setIsRolling] = useState(false);
  const [isMoving, setIsMoving] = useState(false);
  const [movingSquare, setMovingSquare] = useState<number | null>(null);
  const [animatingPlayerId, setAnimatingPlayerId] = useState<PlayerId | null>(null);
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  // Match Status
  const [turnCount, setTurnCount] = useState(0);
  const [winner, setWinner] = useState<Player | null>(null);
  const [logs, setLogs] = useState<GameLogEntry[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Welcome! Roll the dice to start the game.'
  );

  // History Review Highlighting (2-second highlight on click)
  const [historyHighlightSquare, setHistoryHighlightSquare] = useState<number | null>(null);
  const [historyFromSquare, setHistoryFromSquare] = useState<number | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const historyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Victory Confetti Celebration
  const [isCelebrating, setIsCelebrating] = useState(false);
  const celebrationRef = useRef<CelebrationCanvasHandle | null>(null);

  // Global Session Game Statistics
  const [sessionStats, setSessionStats] = useState<SessionStats>(() => {
    try {
      const saved = localStorage.getItem('snakes_ladders_session_stats');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}
    return {
      totalRolls: 0,
      totalSnakes: 0,
      totalLadders: 0,
      gamesPlayed: 0,
      p1Wins: 0,
      p2Wins: 0,
    };
  });

  // Persist session stats
  useEffect(() => {
    try {
      localStorage.setItem('snakes_ladders_session_stats', JSON.stringify(sessionStats));
    } catch {}
  }, [sessionStats]);

  const handleResetStats = useCallback(() => {
    const emptyStats: SessionStats = {
      totalRolls: 0,
      totalSnakes: 0,
      totalLadders: 0,
      gamesPlayed: 0,
      p1Wins: 0,
      p2Wins: 0,
    };
    setSessionStats(emptyStats);
    try {
      localStorage.removeItem('snakes_ladders_session_stats');
    } catch {}
  }, []);

  // Refs to avoid stale closures in timeouts
  const isMovingRef = useRef(isMoving);
  isMovingRef.current = isMoving;
  const isRollingRef = useRef(isRolling);
  isRollingRef.current = isRolling;
  const winnerRef = useRef(winner);
  winnerRef.current = winner;

  // Clean up history timer on unmount
  useEffect(() => {
    return () => {
      if (historyTimerRef.current) {
        clearTimeout(historyTimerRef.current);
      }
    };
  }, []);

  // Handler for clicking previous entry in Game Log to temporarily highlight board square for 2 seconds
  const handleSelectLogEntry = useCallback((entry: GameLogEntry) => {
    const targetSquare = entry.square ?? entry.fromSquare;
    if (!targetSquare) return;

    // Reset previous timer if active
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }

    setSelectedLogId(entry.id);
    setHistoryHighlightSquare(entry.square ?? targetSquare);
    setHistoryFromSquare(entry.fromSquare ?? null);

    const desc = entry.fromSquare && entry.square
      ? `Squares ${entry.fromSquare} ➔ ${entry.square}`
      : `Square ${targetSquare}`;
    setStatusMessage(`Reviewing match history: ${entry.playerName} at ${desc}`);

    // Highlight for 2 seconds (2000 ms)
    historyTimerRef.current = setTimeout(() => {
      setHistoryHighlightSquare(null);
      setHistoryFromSquare(null);
      setSelectedLogId(null);
    }, 2000);
  }, []);

  // Toggle audio
  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setSoundMuted(muted);
  };

  // Switch Game Mode
  const handleModeChange = (newMode: GameMode) => {
    setGameMode(newMode);
    setPlayers((prev) => [
      prev[0],
      {
        ...prev[1],
        name: newMode === 'ai' ? 'Computer (AI)' : 'Player 2 (Tiger)',
        avatar: newMode === 'ai' ? '🤖' : '🐯',
        isComputer: newMode === 'ai',
      },
    ]);
    resetGame(newMode);
  };

  // Save Custom Avatar
  const handleSaveAvatar = (newAvatar: string, newName: string) => {
    if (!editingPlayer) return;
    setPlayers((prev) =>
      prev.map((p) =>
        p.id === editingPlayer.id
          ? { ...p, avatar: newAvatar, name: newName }
          : p
      )
    );
    addLog(
      editingPlayer.id,
      newName,
      `selected custom avatar ${newAvatar}!`,
      'bonus'
    );
    setStatusMessage(`${newName} is playing as ${newAvatar}!`);
  };

  // Reset Game
  const resetGame = (mode = gameMode) => {
    if (historyTimerRef.current) {
      clearTimeout(historyTimerRef.current);
      historyTimerRef.current = null;
    }
    setHistoryHighlightSquare(null);
    setHistoryFromSquare(null);
    setSelectedLogId(null);
    setIsCelebrating(false);
    celebrationRef.current?.clear();

    setPlayers((prev) => [
      {
        ...prev[0],
        position: 1,
        snakesEncountered: 0,
        laddersClimbed: 0,
      },
      {
        ...prev[1],
        position: 1,
        snakesEncountered: 0,
        laddersClimbed: 0,
        isComputer: mode === 'ai',
        name: mode === 'ai' ? 'Computer (AI)' : prev[1].name,
        avatar: mode === 'ai' ? '🤖' : prev[1].avatar,
      },
    ]);
    setActivePlayerId(1);
    setDiceValue(1);
    setIsRolling(false);
    setIsMoving(false);
    setMovingSquare(null);
    setAnimatingPlayerId(null);
    setTurnCount(0);
    setWinner(null);
    setLogs([]);
    setStatusMessage('Game reset! Roll the dice to make your move.');
  };

  // Append entry to game feed
  const addLog = useCallback(
    (
      pId: PlayerId,
      pName: string,
      text: string,
      type: GameLogEntry['type'],
      coords?: { square?: number; fromSquare?: number }
    ) => {
      setLogs((prev) => [
        {
          id: `${Date.now()}-${Math.random()}`,
          playerId: pId,
          playerName: pName,
          text,
          type,
          timestamp: new Date(),
          square: coords?.square,
          fromSquare: coords?.fromSquare,
        },
        ...prev,
      ]);
    },
    []
  );

  // Compute square-by-square path including bounce off 100
  const computeStepPath = (startPos: number, roll: number): number[] => {
    const path: number[] = [];
    let current = startPos;
    let direction = 1;

    for (let i = 0; i < roll; i++) {
      if (current === 100) {
        direction = -1; // bounce back
      }
      current += direction;
      path.push(current);
    }
    return path;
  };

  // Move token square by square
  const executeStepMovement = useCallback(
    async (pId: PlayerId, roll: number) => {
      setIsMoving(true);
      setAnimatingPlayerId(pId);

      const currentPlayer = players.find((p) => p.id === pId)!;
      const path = computeStepPath(currentPlayer.position, roll);
      const stepDuration = isFastSpeed ? 110 : 200;

      // Animate each hop in sequence
      for (let i = 0; i < path.length; i++) {
        const targetSquare = path[i];
        setMovingSquare(targetSquare);
        sound.playStep(1 + (i / path.length) * 0.3);
        await new Promise((resolve) => setTimeout(resolve, stepDuration));
      }

      const finalSquare = path[path.length - 1];
      const bounced = currentPlayer.position + roll > 100;

      if (bounced) {
        sound.playBounce();
        addLog(
          pId,
          currentPlayer.name,
          `bounced off 100 and landed on square ${finalSquare} (needs exact roll!)`,
          'bounce',
          { square: finalSquare, fromSquare: 100 }
        );
        setStatusMessage(
          `${currentPlayer.name} bounced off 100 and landed on ${finalSquare}. Exact roll needed!`
        );
      }

      let resolvedPosition = finalSquare;
      let climbed = false;
      let bitten = false;

      // Check for Ladder
      if (LADDER_MAP.has(finalSquare)) {
        const ladderEnd = LADDER_MAP.get(finalSquare)!;
        climbed = true;
        setStatusMessage(`🪜 Ladder! Climbing up to square ${ladderEnd}!`);
        await new Promise((resolve) => setTimeout(resolve, 350));
        sound.playLadderClimb();

        // Animate climbing
        setMovingSquare(ladderEnd);
        await new Promise((resolve) => setTimeout(resolve, 500));
        resolvedPosition = ladderEnd;

        addLog(
          pId,
          currentPlayer.name,
          `climbed a ladder from ${finalSquare} ➔ ${ladderEnd}! 🪜`,
          'ladder',
          { square: ladderEnd, fromSquare: finalSquare }
        );
        setSessionStats((prev) => ({
          ...prev,
          totalLadders: prev.totalLadders + 1,
        }));
      }
      // Check for Snake
      else if (SNAKE_MAP.has(finalSquare)) {
        const snakeEnd = SNAKE_MAP.get(finalSquare)!;
        bitten = true;
        setStatusMessage(`🐍 Bitten by a snake! Slithering down to ${snakeEnd}!`);
        await new Promise((resolve) => setTimeout(resolve, 350));
        sound.playSnakeSlide();

        // Animate sliding
        setMovingSquare(snakeEnd);
        await new Promise((resolve) => setTimeout(resolve, 550));
        resolvedPosition = snakeEnd;

        addLog(
          pId,
          currentPlayer.name,
          `was bitten by a snake at ${finalSquare} and slid to ${snakeEnd}! 🐍`,
          'snake',
          { square: snakeEnd, fromSquare: finalSquare }
        );
        setSessionStats((prev) => ({
          ...prev,
          totalSnakes: prev.totalSnakes + 1,
        }));
      }

      // Commit position update
      setPlayers((prev) =>
        prev.map((p) => {
          if (p.id !== pId) return p;
          return {
            ...p,
            position: resolvedPosition,
            laddersClimbed: p.laddersClimbed + (climbed ? 1 : 0),
            snakesEncountered: p.snakesEncountered + (bitten ? 1 : 0),
          };
        })
      );

      setMovingSquare(null);
      setAnimatingPlayerId(null);
      setIsMoving(false);

      // Check Victory Condition
      if (resolvedPosition === 100) {
        const victoriousPlayer = {
          ...currentPlayer,
          position: 100,
          laddersClimbed: currentPlayer.laddersClimbed + (climbed ? 1 : 0),
          snakesEncountered: currentPlayer.snakesEncountered + (bitten ? 1 : 0),
        };
        setIsCelebrating(true);
        celebrationRef.current?.celebrate();
        setWinner(victoriousPlayer);
        setSessionStats((prev) => ({
          ...prev,
          gamesPlayed: prev.gamesPlayed + 1,
          p1Wins: prev.p1Wins + (pId === 1 ? 1 : 0),
          p2Wins: prev.p2Wins + (pId === 2 ? 1 : 0),
        }));
        addLog(pId, currentPlayer.name, 'reached square 100 and WON THE GAME! 🏆', 'win', { square: 100 });
        setStatusMessage(`🎉 ${currentPlayer.name} has won the game!`);
        return;
      }

      // Check if roll was 6 (classic bonus turn rule)
      const rolledSix = roll === 6;
      if (rolledSix) {
        addLog(pId, currentPlayer.name, 'rolled a 6 and earned a BONUS TURN! 🎲', 'bonus', { square: resolvedPosition });
        setStatusMessage(`${currentPlayer.name} rolled a 6! Take another turn!`);
        // Keep active player the same
      } else {
        // Switch turn to the other player
        const nextPlayerId: PlayerId = pId === 1 ? 2 : 1;
        setActivePlayerId(nextPlayerId);
        const nextPlayer = players.find((p) => p.id === nextPlayerId)!;
        setStatusMessage(`It's now ${nextPlayer.name}'s turn.`);
      }
    },
    [players, isFastSpeed, addLog]
  );

  // Roll Dice Action
  const handleRollDice = useCallback(() => {
    if (isRollingRef.current || isMovingRef.current || winnerRef.current) return;

    setIsRolling(true);
    sound.playDiceRoll();

    // Visual dice rolling rattle (cycles numbers rapidly)
    let rollCycles = 0;
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCycles++;
      if (rollCycles >= 8) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 6) + 1;
        setDiceValue(finalRoll);
        setIsRolling(false);
        sound.playDiceLand();

        const currentP = players.find((p) => p.id === activePlayerId)!;
        addLog(
          activePlayerId,
          currentP.name,
          `rolled a ${finalRoll}. Moving square by square...`,
          'roll',
          { square: Math.min(100, currentP.position + finalRoll), fromSquare: currentP.position }
        );
        setTurnCount((prev) => prev + 1);
        setSessionStats((prev) => ({
          ...prev,
          totalRolls: prev.totalRolls + 1,
        }));

        // Begin step-by-step token movement
        executeStepMovement(activePlayerId, finalRoll);
      }
    }, 60);
  }, [activePlayerId, players, addLog, executeStepMovement]);

  // AI Turn Automator
  useEffect(() => {
    if (gameMode !== 'ai') return;
    if (activePlayerId !== 2) return;
    if (winner || isRolling || isMoving) return;

    const timer = setTimeout(() => {
      handleRollDice();
    }, 900);

    return () => clearTimeout(timer);
  }, [activePlayerId, gameMode, winner, isRolling, isMoving, handleRollDice]);

  // Keyboard shortcut: Spacebar to roll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        // Prevent default spacebar page scrolling
        if (
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement
        ) {
          return;
        }
        e.preventDefault();
        const activeP = players.find((p) => p.id === activePlayerId);
        if (!activeP?.isComputer) {
          handleRollDice();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRollDice, activePlayerId, players]);

  const activePlayer = players.find((p) => p.id === activePlayerId)!;
  const isButtonDisabled =
    isRolling || isMoving || winner !== null || (gameMode === 'ai' && activePlayerId === 2);

  return (
    <div className="min-h-screen relative text-slate-800 font-sans selection:bg-emerald-400 selection:text-emerald-950">
      {/* Vibrant Botanical Forest Background */}
      <ForestBackground />

      {/* Top Navigation Bar with Jungle Explorer Aesthetic */}
      <header className="border-b border-emerald-800/40 bg-emerald-950/85 backdrop-blur-md sticky top-0 z-30 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="Jungle Snakes and Ladders">
              🌴🪜🐍
            </span>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-emerald-50 leading-tight">
                Jungle Snakes & Ladders
              </h1>
              <span className="text-[10px] sm:text-xs text-emerald-300/80 font-medium hidden sm:inline">
                Lush Forest Edition · 10x10 Zigzag Board
              </span>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {/* Game Mode Selector */}
            <div className="flex items-center bg-emerald-900/60 p-0.5 rounded-xl border border-emerald-700/50 text-xs font-bold">
              <button
                onClick={() => handleModeChange('pvp')}
                className={`py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  gameMode === 'pvp'
                    ? 'bg-emerald-500 text-emerald-950 shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="2 Players on same screen"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">2 Players</span>
              </button>
              <button
                onClick={() => handleModeChange('ai')}
                className={`py-1 px-2.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer ${
                  gameMode === 'ai'
                    ? 'bg-emerald-500 text-emerald-950 shadow-xs'
                    : 'text-emerald-200 hover:text-white'
                }`}
                title="Single player vs Computer AI"
              >
                <Bot className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">vs AI</span>
              </button>
            </div>

            {/* Speed Toggle */}
            <button
              onClick={() => setIsFastSpeed(!isFastSpeed)}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                isFastSpeed
                  ? 'bg-amber-400 border-amber-300 text-amber-950 font-bold'
                  : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-200 hover:bg-emerald-800/60'
              }`}
              title={isFastSpeed ? 'Fast Animation Enabled' : 'Normal Speed'}
            >
              <Zap className={`w-4 h-4 ${isFastSpeed ? 'text-amber-900 fill-amber-900' : ''}`} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleToggleSound}
              className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
                soundMuted
                  ? 'bg-emerald-900/40 border-emerald-800/50 text-emerald-400'
                  : 'bg-emerald-900/60 border-emerald-700/50 text-emerald-200 hover:bg-emerald-800/60'
              }`}
              title={soundMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Reset Game */}
            <button
              onClick={() => resetGame()}
              className="p-1.5 rounded-xl bg-emerald-900/60 border border-emerald-700/50 text-emerald-200 hover:bg-emerald-800/60 transition-colors cursor-pointer"
              title="Reset Match"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Status Announcement Banner */}
        <div className="mb-4 text-center">
          <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-emerald-950/80 border border-emerald-600/40 shadow-xl text-xs sm:text-sm font-bold text-emerald-100 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{statusMessage}</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT: 10x10 Board */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <Board
              players={players}
              activePlayerId={activePlayerId}
              animatingPlayerId={animatingPlayerId}
              movingSquare={movingSquare}
              hoveredSquare={hoveredSquare}
              onHoverSquare={setHoveredSquare}
              winner={winner}
              historyHighlightSquare={historyHighlightSquare}
              historyFromSquare={historyFromSquare}
            />

            {/* Board Footnote / Tip */}
            <div className="mt-2.5 text-center text-[11px] text-emerald-200/80 flex items-center justify-center gap-3 drop-shadow-sm font-medium">
              <span>🎯 Exact roll of 100 needed to win</span>
              <span>·</span>
              <span>🎲 Rolling 6 gives bonus turn</span>
              <span>·</span>
              <span className="hidden sm:inline">⌨️ Press Space to Roll</span>
            </div>
          </div>

          {/* RIGHT: Controls, Dice, Statistics, Players, Feed */}
          <div className="lg:col-span-5 flex flex-col gap-3.5">
            {/* Players Status Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              <PlayerCard
                player={players[0]}
                isActive={activePlayerId === 1 && !winner}
                isMoving={animatingPlayerId === 1}
                onEditAvatar={setEditingPlayer}
              />
              <PlayerCard
                player={players[1]}
                isActive={activePlayerId === 2 && !winner}
                isMoving={animatingPlayerId === 2}
                onEditAvatar={setEditingPlayer}
              />
            </div>

            {/* Dice Roller Card */}
            <div className="bg-white/95 rounded-2xl border border-emerald-900/10 p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <span>Dice Roller</span>
                <span className="text-slate-400 font-normal lowercase">
                  turn #{turnCount + 1}
                </span>
              </div>

              <Dice
                value={diceValue}
                isRolling={isRolling}
                disabled={isButtonDisabled}
                onRoll={handleRollDice}
                activePlayerName={activePlayer.name}
                activePlayerColor={activePlayer.color}
              />
            </div>

            {/* Game Statistics Card (Global Session Metrics with Recharts Win Ratio Bar Chart) */}
            <GameStats
              stats={sessionStats}
              onResetStats={handleResetStats}
              p1Name={players[0].name}
              p2Name={players[1].name}
              p1Avatar={players[0].avatar}
              p2Avatar={players[1].avatar}
            />

            {/* Live Feed / Event Log with Click-to-Review */}
            <GameLog
              logs={logs}
              selectedLogId={selectedLogId}
              onSelectEntry={handleSelectLogEntry}
            />

            {/* Rules and Snakes/Ladders Legend */}
            <RulesAndLegend onHighlightSquare={setHoveredSquare} />
          </div>
        </div>
      </main>

      {/* Winner Celebration Modal */}
      {winner && (
        <WinnerModal
          winner={winner}
          turnCount={turnCount}
          onPlayAgain={() => resetGame()}
          onCelebrateMore={() => celebrationRef.current?.celebrate()}
        />
      )}

      {/* Custom Avatar Selector & Generator Modal */}
      {editingPlayer && (
        <AvatarModal
          player={editingPlayer}
          isOpen={editingPlayer !== null}
          onClose={() => setEditingPlayer(null)}
          onSave={handleSaveAvatar}
        />
      )}

      {/* Fullscreen Canvas Confetti Particle System */}
      <CelebrationCanvas ref={celebrationRef} isActive={isCelebrating} />
    </div>
  );
}
