import React from 'react';

export const ForestBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none">
      {/* Deep Forest Gradient Base */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#06241a] via-[#093526] to-[#041a12]" />

      {/* Atmospheric Dappled Sunbeams / God Rays */}
      <div className="absolute inset-0 opacity-25 mix-blend-screen pointer-events-none">
        <div
          className="absolute -top-32 right-1/4 w-[600px] h-[900px] bg-gradient-to-b from-amber-300/40 via-emerald-200/20 to-transparent transform rotate-[-25deg] blur-3xl"
        />
        <div
          className="absolute -top-20 left-10 w-[450px] h-[750px] bg-gradient-to-b from-yellow-200/30 via-emerald-300/15 to-transparent transform rotate-[15deg] blur-2xl"
        />
      </div>

      {/* Vector Jungle Canopy & Hanging Vines (Top Left & Right) */}
      <svg
        className="absolute top-0 left-0 w-full h-44 sm:h-64 opacity-80"
        viewBox="0 0 1200 300"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#064e3b" />
            <stop offset="100%" stopColor="#042f24" />
          </linearGradient>
          <linearGradient id="leafGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="100%" stopColor="#064e3b" />
          </linearGradient>
          <linearGradient id="leafGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>

        {/* Top left hanging vine cluster */}
        <path
          d="M-20 -10 C 60 50, 120 120, 90 200 C 80 160, 40 100, -20 60 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M40 -10 C 110 60, 180 140, 160 230 C 140 170, 90 110, 30 70 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M120 -10 C 190 70, 260 160, 230 250 C 200 180, 160 120, 100 80 Z"
          fill="url(#leafGrad3)"
          opacity="0.9"
        />

        {/* Monstera / Palm leaf fronds top left */}
        <path
          d="M-30 40 Q 90 80, 170 30 Q 110 110, 10 130 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M70 -10 Q 160 80, 240 70 Q 180 130, 90 120 Z"
          fill="url(#leafGrad1)"
        />

        {/* Top right hanging canopy & vine fronds */}
        <path
          d="M1220 -10 C 1140 60, 1070 140, 1100 240 C 1120 170, 1170 100, 1220 60 Z"
          fill="url(#leafGrad1)"
        />
        <path
          d="M1160 -10 C 1090 70, 1020 150, 1050 260 C 1070 180, 1120 120, 1180 70 Z"
          fill="url(#leafGrad2)"
        />
        <path
          d="M1080 -10 C 1010 60, 940 140, 970 230 C 990 160, 1030 110, 1090 60 Z"
          fill="url(#leafGrad3)"
        />
        <path
          d="M1230 50 Q 1110 90, 1030 40 Q 1090 120, 1190 140 Z"
          fill="url(#leafGrad1)"
        />

        {/* Gentle leaf silhouettes across center top */}
        <path
          d="M340 -10 Q 420 70, 500 50 Q 440 90, 360 80 Z"
          fill="url(#leafGrad2)"
          opacity="0.6"
        />
        <path
          d="M680 -10 Q 760 60, 840 40 Q 770 90, 700 70 Z"
          fill="url(#leafGrad3)"
          opacity="0.6"
        />
      </svg>

      {/* Bottom Jungle Ferns & Foliage Silhouettes */}
      <svg
        className="absolute bottom-0 left-0 w-full h-32 sm:h-48 opacity-65"
        viewBox="0 0 1200 220"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M-40 240 Q 80 120, 140 100 Q 120 160, 60 240 Z"
          fill="#022c22"
        />
        <path
          d="M90 240 Q 180 100, 260 90 Q 220 170, 160 240 Z"
          fill="#064e3b"
        />
        <path
          d="M200 240 Q 300 130, 380 110 Q 320 180, 270 240 Z"
          fill="#022c22"
        />

        {/* Bottom right lush ferns */}
        <path
          d="M1240 240 Q 1120 110, 1060 90 Q 1080 160, 1140 240 Z"
          fill="#022c22"
        />
        <path
          d="M1110 240 Q 1020 90, 940 80 Q 980 160, 1040 240 Z"
          fill="#064e3b"
        />
        <path
          d="M1000 240 Q 900 120, 820 100 Q 870 170, 920 240 Z"
          fill="#022c22"
        />
      </svg>

      {/* Bioluminescent Glowing Fireflies / Forest Spores */}
      <div className="absolute inset-0 pointer-events-none">
        <span
          className="absolute top-1/4 left-[12%] w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse opacity-75"
          style={{ animationDuration: '3.2s' }}
        />
        <span
          className="absolute top-1/3 left-[22%] w-2 h-2 rounded-full bg-amber-300 shadow-[0_0_10px_#fde047] animate-pulse opacity-85"
          style={{ animationDuration: '4.5s', animationDelay: '1.2s' }}
        />
        <span
          className="absolute top-1/2 left-[8%] w-1.5 h-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7] animate-pulse opacity-70"
          style={{ animationDuration: '2.8s', animationDelay: '0.8s' }}
        />
        <span
          className="absolute top-2/3 right-[14%] w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_12px_#fef08a] animate-pulse opacity-80"
          style={{ animationDuration: '3.8s', animationDelay: '2s' }}
        />
        <span
          className="absolute top-1/4 right-[20%] w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse opacity-85"
          style={{ animationDuration: '4.2s', animationDelay: '0.5s' }}
        />
        <span
          className="absolute top-3/4 left-[35%] w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24] animate-pulse opacity-70"
          style={{ animationDuration: '3.4s', animationDelay: '1.8s' }}
        />
        <span
          className="absolute top-[18%] right-[32%] w-2 h-2 rounded-full bg-lime-300 shadow-[0_0_9px_#bef264] animate-pulse opacity-80"
          style={{ animationDuration: '5s', animationDelay: '2.5s' }}
        />
      </div>
    </div>
  );
};
