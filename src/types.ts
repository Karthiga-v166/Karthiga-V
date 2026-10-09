export type PlayerId = 1 | 2;

export interface Player {
  id: PlayerId;
  name: string;
  avatar: string;
  color: string;
  lightColor: string;
  borderColor: string;
  accentColor: string;
  tokenBg: string;
  position: number;
  snakesEncountered: number;
  laddersClimbed: number;
  isComputer: boolean;
}

export type GameMode = 'pvp' | 'ai';

export interface SnakeOrLadder {
  from: number;
  to: number;
  color?: string;
}

export interface GameLogEntry {
  id: string;
  playerId: PlayerId;
  playerName: string;
  text: string;
  type: 'roll' | 'step' | 'ladder' | 'snake' | 'bounce' | 'win' | 'bonus';
  timestamp: Date;
  square?: number;
  fromSquare?: number;
}

export interface MoveStep {
  position: number;
  isFinal?: boolean;
}
