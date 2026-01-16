'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTabStore } from '@/store/tabStore';
import { tanukis, getTanukiById, drunkLevelEmoji, DrunkLevel, getDrunkLevel } from '@/data/tanukis';
import { getSakeById } from '@/data/sake';
import { cn } from '@/lib/utils';

// Drunk speech for each level
const drunkSpeech: Record<number, string[]> = {
  0: ['...', '🍵', '...zzz'],
  1: ['♪', 'Hehe~', '🎵'],
  2: ['ポンポコ~♪', 'More sake!', '🎶'],
  3: ['Woooo!', '*hiccup*', 'I love you~'],
  4: ['*stumble*', 'Am I... teapot?', '...huh?'],
  5: ['💀', 'zzz...', '*thud*'],
};

const drunkLevelIndex: Record<DrunkLevel, number> = {
  'sober': 0,
  'tipsy': 1,
  'merry': 2,
  'drunk': 3,
  'plastered': 4,
  'blacked-out': 5,
};

interface TanukiCharacterProps {
  tanukiId: string;
  position: { x: number; y: number };
  delay: number;
}

function TanukiCharacter({ tanukiId, position, delay }: TanukiCharacterProps) {
  const [speech, setSpeech] = useState('');
  const [showSpeech, setShowSpeech] = useState(false);
  
  const tanuki = getTanukiById(tanukiId);
  
  // Use a single selector to get the tab for this tanuki
  const tab = useTabStore((state) => 
    state.tabs.find((t) => t.tanukiId === tanukiId && t.isOpen)
  );
  
  const hasTab = !!tab;
  
  // Calculate drunk points and level from the tab data directly
  const { drunkPoints, drunkLevel } = useMemo(() => {
    if (!tab || !tanuki) return { drunkPoints: 0, drunkLevel: 'sober' as DrunkLevel };
    
    const points = tab.orders.reduce((sum, order) => {
      const sake = getSakeById(order.sakeId);
      return sum + (sake ? sake.drunkPoints * order.quantity : 0);
    }, 0);
    
    return {
      drunkPoints: points,
      drunkLevel: getDrunkLevel(tanuki, points),
    };
  }, [tab, tanuki]);
  
  const levelIdx = drunkLevelIndex[drunkLevel];
  
  // Random speech bubbles
  useEffect(() => {
    if (!hasTab) return;
    
    const interval = setInterval(() => {
      const speeches = drunkSpeech[levelIdx];
      setSpeech(speeches[Math.floor(Math.random() * speeches.length)]);
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), 2000);
    }, 4000 + Math.random() * 3000);
    
    return () => clearInterval(interval);
  }, [hasTab, levelIdx]);

  if (!tanuki) return null;

  // Animation intensity based on drunk level
  const wobbleClass = levelIdx === 0 ? '' : 
    levelIdx <= 2 ? 'animate-wobble-light' :
    levelIdx <= 4 ? 'animate-wobble-heavy' :
    'animate-passed-out';

  const cheekOpacity = Math.min(levelIdx * 0.2, 1);
  const eyeScale = 1 - (levelIdx * 0.12);

  return (
    <div
      className={cn(
        'absolute transition-all duration-500',
        wobbleClass,
        !hasTab && 'opacity-40 grayscale'
      )}
      style={{
        left: `${position.x}%`,
        bottom: `${position.y}%`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Speech bubble */}
      <div
        className={cn(
          'absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-gray-800 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 z-10',
          showSpeech ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
        )}
      >
        {speech}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
      </div>

      {/* Tanuki body */}
      <div className="relative w-20 h-[70px]">
        {/* Ears */}
        <div className="absolute -top-2 left-2 w-5 h-5 bg-[#8b5a2b] rounded-t-full -rotate-[20deg]" />
        <div className="absolute -top-2 right-2 w-5 h-5 bg-[#8b5a2b] rounded-t-full rotate-[20deg]" />
        
        {/* Body */}
        <div className="absolute inset-0 bg-gradient-radial from-[#8b5a2b] to-[#5a3a1a] rounded-[50%_50%_45%_45%]" />
        
        {/* Face */}
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[60px] h-[50px] bg-gradient-radial from-[#f5e6c8] to-[#e6d4a8] rounded-full">
          {/* Eye masks */}
          <div className="absolute top-3 left-1 w-[18px] h-[22px] bg-[#3a2a1a] rounded-[50%_50%_30%_30%] -rotate-[10deg]" />
          <div className="absolute top-3 right-1 w-[18px] h-[22px] bg-[#3a2a1a] rounded-[50%_50%_30%_30%] rotate-[10deg]" />
          
          {/* Eyes */}
          <div
            className="absolute top-[18px] left-3 w-3 h-3.5 bg-[#1a1a1a] rounded-full transition-transform duration-300"
            style={{ transform: `scaleY(${eyeScale})` }}
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          <div
            className="absolute top-[18px] right-3 w-3 h-3.5 bg-[#1a1a1a] rounded-full transition-transform duration-300"
            style={{ transform: `scaleY(${eyeScale})` }}
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white rounded-full" />
          </div>
          
          {/* Cheeks (blush when drunk) */}
          <div
            className="absolute top-7 left-1.5 w-3 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: `rgba(255, 100, 100, ${cheekOpacity})`,
              boxShadow: cheekOpacity > 0.3 ? `0 0 8px rgba(255, 100, 100, ${cheekOpacity * 0.5})` : 'none',
            }}
          />
          <div
            className="absolute top-7 right-1.5 w-3 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor: `rgba(255, 100, 100, ${cheekOpacity})`,
              boxShadow: cheekOpacity > 0.3 ? `0 0 8px rgba(255, 100, 100, ${cheekOpacity * 0.5})` : 'none',
            }}
          />
          
          {/* Nose */}
          <div className="absolute top-7 left-1/2 -translate-x-1/2 w-2.5 h-2 bg-[#1a1a1a] rounded-full" />
        </div>
        
        {/* Belly */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-[50px] h-[35px] bg-gradient-radial from-[#f5e6c8] to-[#e6d4a8] rounded-full" />
        
        {/* Kintama (legendary tanuki balls - grow with drunkenness) */}
        {hasTab && levelIdx > 0 && (
          <div 
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-0.5 transition-all duration-500"
            style={{
              transform: `translateX(-50%) scale(${0.6 + levelIdx * 0.25})`,
            }}
          >
            <div 
              className="w-4 h-5 rounded-full bg-gradient-radial from-[#d4a853] to-[#a67c3d] shadow-lg animate-kintama-left"
              style={{
                boxShadow: levelIdx > 2 ? '0 0 10px rgba(212, 168, 83, 0.5)' : 'none',
              }}
            />
            <div 
              className="w-4 h-5 rounded-full bg-gradient-radial from-[#d4a853] to-[#a67c3d] shadow-lg animate-kintama-right"
              style={{
                boxShadow: levelIdx > 2 ? '0 0 10px rgba(212, 168, 83, 0.5)' : 'none',
              }}
            />
          </div>
        )}
        
        {/* Tail */}
        <div className="absolute bottom-4 -right-3 w-[30px] h-[25px] bg-gradient-to-r from-[#8b5a2b] via-[#5a3a1a] to-[#8b5a2b] rounded-full -rotate-[30deg] animate-wag" />
        
        {/* Sake bottle (if has tab) */}
        {hasTab && (
          <div className="absolute -bottom-1 -right-6 w-4 h-8">
            <div className="absolute bottom-0 w-full h-7 bg-gradient-to-b from-[#4a4a4a] to-[#2a2a2a] rounded-[3px_3px_5px_5px]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2.5 bg-[#3a3a3a] rounded-sm" />
          </div>
        )}
      </div>
      
      {/* Name tag */}
      <div className="text-center mt-1">
        <span className="text-xs font-medium text-[var(--palace-gold)]">
          {tanuki.name}
        </span>
        {hasTab && (
          <span className="ml-1 text-xs">
            {drunkLevelEmoji[drunkLevel]}
          </span>
        )}
      </div>
    </div>
  );
}

export function TanukiBar() {
  const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);
  
  // Generate stars on mount
  useEffect(() => {
    setStars(
      Array.from({ length: 30 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 3,
      }))
    );
  }, []);

  // Tanuki positions along the bar
  const positions = [
    { x: 8, y: 5 },
    { x: 25, y: 8 },
    { x: 45, y: 3 },
    { x: 62, y: 10 },
    { x: 82, y: 6 },
  ];

  return (
    <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-b from-[#0a0a1a] via-[#1a1a3a] to-[#2d1b4e]">
      {/* Stars */}
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#fffef0] animate-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
      
      {/* Moon */}
      <div className="absolute top-4 right-8 w-12 h-12 rounded-full bg-gradient-radial from-[#fffef0] via-[#f0e68c] to-[#daa520] shadow-[0_0_30px_10px_rgba(255,254,240,0.3)]" />
      
      {/* Lanterns */}
      <div className="absolute top-8 left-[15%] animate-sway">
        <div className="w-1 h-4 bg-[#333] mx-auto" />
        <div className="w-6 h-7 bg-gradient-to-b from-[#cc3300] via-[#ff6b35] to-[#cc3300] rounded shadow-[0_0_15px_3px_rgba(255,107,53,0.4)]" />
      </div>
      <div className="absolute top-6 right-[20%] animate-sway" style={{ animationDelay: '1s' }}>
        <div className="w-1 h-4 bg-[#333] mx-auto" />
        <div className="w-6 h-7 bg-gradient-to-b from-[#cc3300] via-[#ff6b35] to-[#cc3300] rounded shadow-[0_0_15px_3px_rgba(255,107,53,0.4)]" />
      </div>
      
      {/* Bar counter */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-[#5a3a1a] to-[#3a2a1a] border-t-2 border-[#8b5a2b]">
        <div className="absolute top-1 left-0 right-0 h-1 bg-[#6a4a2a] opacity-50" />
      </div>
      
      {/* Tanukis */}
      {tanukis.map((tanuki, i) => (
        <TanukiCharacter
          key={tanuki.id}
          tanukiId={tanuki.id}
          position={positions[i]}
          delay={i * 0.5}
        />
      ))}
      
      {/* Title overlay */}
      <div className="absolute top-3 left-4">
        <h2 className="text-lg font-bold text-[var(--palace-gold)] drop-shadow-lg">
          🏮 The Bar
        </h2>
      </div>
    </div>
  );
}
