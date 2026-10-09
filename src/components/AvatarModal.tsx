import React, { useState } from 'react';
import { Player } from '../types';
import { Sparkles, Dices, X, Check } from 'lucide-react';

export const JUNGLE_AVATARS = [
  // Jungle Fauna
  { emoji: '🦁', label: 'Lion' },
  { emoji: '🐯', label: 'Tiger' },
  { emoji: '🐵', label: 'Monkey' },
  { emoji: '🦜', label: 'Parrot' },
  { emoji: '🐸', label: 'Tree Frog' },
  { emoji: '🦊', label: 'Forest Fox' },
  { emoji: '🐼', label: 'Panda' },
  { emoji: '🐻', label: 'Brown Bear' },
  { emoji: '🐘', label: 'Elephant' },
  { emoji: '🦅', label: 'Eagle' },
  { emoji: '🦥', label: 'Sloth' },
  { emoji: '🦒', label: 'Giraffe' },

  // Explorers & Adventurers
  { emoji: '🤠', label: 'Explorer' },
  { emoji: '👸', label: 'Queen' },
  { emoji: '🤴', label: 'King' },
  { emoji: '🧙', label: 'Wizard' },
  { emoji: '🥷', label: 'Ninja' },
  { emoji: '🤖', label: 'Cyborg' },

  // Power Totems
  { emoji: '⚡', label: 'Lightning' },
  { emoji: '🍀', label: 'Lucky Clover' },
  { emoji: '⭐', label: 'Star' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '💎', label: 'Gem' },
  { emoji: '🚀', label: 'Rocket' },
];

const FUN_NICKNAMES: Record<string, string[]> = {
  '🦁': ['Simba', 'Roaring Leo', 'Golden Mane'],
  '🐯': ['Striker', 'Tiger Claw', 'Shadow Fang'],
  '🐵': ['Banana Bandit', 'Curious George', 'Mischief Monkey'],
  '🦜': ['Captain Feathers', 'Echo', 'Macaw Flyer'],
  '🐸': ['Poison Dart', 'Hoppy', 'Lilypad Leaper'],
  '🦊': ['Swift Fox', 'Rusty', 'Foxy Fox'],
  '🐼': ['Bamboo Brawler', 'Panda Master', 'Zen Panda'],
  '🐻': ['Grizzly', 'Honey Bear', 'Big Ursus'],
  '🐘': ['Thunder Tusk', 'Babar', 'Titan Trunk'],
  '🦅': ['Sky Talon', 'Eagle Eye', 'Soaring Hawk'],
  '🤠': ['Indy Jones', 'Safari Sam', 'Lost Explorer'],
  '🤖': ['Robo Runner', 'Cyber 3000', 'Circuit Scout'],
  '⚡': ['Volt Runner', 'Thunderbolt', 'Static Shock'],
  '🍀': ['Lucky Charm', 'Shamrock', 'Fortune Finder'],
  '🔥': ['Blaze', 'Firestarter', 'Wildfire'],
};

interface AvatarModalProps {
  player: Player;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newAvatar: string, newName: string) => void;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  player,
  isOpen,
  onClose,
  onSave,
}) => {
  const [selectedAvatar, setSelectedAvatar] = useState(player.avatar || '🤠');
  const [playerName, setPlayerName] = useState(player.name);

  if (!isOpen) return null;

  const isP1 = player.id === 1;

  // Generate random avatar & title
  const handleRandomize = () => {
    const randomPick = JUNGLE_AVATARS[Math.floor(Math.random() * JUNGLE_AVATARS.length)];
    setSelectedAvatar(randomPick.emoji);

    const nicknames = FUN_NICKNAMES[randomPick.emoji];
    if (nicknames && nicknames.length > 0) {
      const pickedName = nicknames[Math.floor(Math.random() * nicknames.length)];
      setPlayerName(`${pickedName} (${isP1 ? 'P1' : 'P2'})`);
    } else {
      setPlayerName(`${randomPick.label} (${isP1 ? 'P1' : 'P2'})`);
    }
  };

  const handleConfirm = () => {
    onSave(selectedAvatar, playerName.trim() || player.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-emerald-400 text-left z-10 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Custom Avatar
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Player {player.id} Persona
          </h3>
          <p className="text-xs text-slate-500">
            Choose a jungle animal, hero token, or generate a lucky avatar.
          </p>
        </div>

        {/* Current Preview & Name Input */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-md border-2 shrink-0 ${
              isP1
                ? 'bg-gradient-to-br from-red-500 to-rose-700 border-red-200'
                : 'bg-gradient-to-br from-blue-500 to-indigo-700 border-blue-200'
            }`}
          >
            <span>{selectedAvatar}</span>
          </div>

          <div className="flex-1 min-w-0">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              maxLength={22}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full text-xs font-bold bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Enter name..."
            />
          </div>
        </div>

        {/* Generator Button */}
        <div className="mb-3">
          <button
            onClick={handleRandomize}
            className="w-full py-2 px-3 rounded-xl font-bold text-xs bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 shadow-xs"
          >
            <Dices className="w-4 h-4 text-amber-800" />
            <span>Roll Random Avatar & Nickname</span>
          </button>
        </div>

        {/* Avatar Selection Grid */}
        <div className="mb-4">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
            Select from Gallery
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-44 overflow-y-auto p-1 bg-slate-50 rounded-2xl border border-slate-200">
            {JUNGLE_AVATARS.map(({ emoji, label }) => {
              const isSelected = selectedAvatar === emoji;
              return (
                <button
                  key={`avatar-${emoji}`}
                  onClick={() => setSelectedAvatar(emoji)}
                  title={label}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-white shadow-md scale-110 ring-2 ring-emerald-400'
                      : 'hover:bg-white hover:shadow-xs'
                  }`}
                >
                  <span>{emoji}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Confirm Action Button */}
        <button
          onClick={handleConfirm}
          className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
        >
          <Check className="w-4 h-4" />
          <span>Save Player Avatar</span>
        </button>
      </div>
    </div>
  );
};
