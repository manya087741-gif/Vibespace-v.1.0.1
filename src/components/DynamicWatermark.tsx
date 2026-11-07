import React, { useState, useEffect } from 'react';
import { CURRENT_USER } from '../data/mockData';

interface DynamicWatermarkProps {
  enabled: boolean;
  opacity?: number;
  mode?: 'discrete' | 'grid' | 'corner';
}

export const DynamicWatermark: React.FC<DynamicWatermarkProps> = ({
  enabled,
  opacity = 0.28,
  mode = 'discrete',
}) => {
  const [timestamp, setTimestamp] = useState<string>('');
  const [hashToken, setHashToken] = useState<string>('7f4c9a12');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const iso = now.toISOString().replace('T', ' ').substring(0, 19);
      setTimestamp(iso);
      // Generate rotating micro-hash for viewer session validation
      const hash = Math.abs(Math.sin(now.getTime() / 10000)).toString(16).substring(2, 10);
      setHashToken(hash);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!enabled) return null;

  const watermarkText = `@${CURRENT_USER.username} · ${timestamp} · #${hashToken}`;

  if (mode === 'grid') {
    return (
      <div 
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden select-none flex flex-wrap gap-8 items-center justify-around p-4"
        style={{ opacity }}
        aria-hidden="true"
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="transform -rotate-12 text-[10px] font-mono tracking-widest text-white/90 drop-shadow-sm border border-white/20 px-2 py-0.5 rounded backdrop-blur-[1px]"
          >
            {watermarkText}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-3 z-20 flex justify-center select-none"
      style={{ opacity }}
      aria-hidden="true"
    >
      <div className="text-[10px] font-mono tracking-wider text-white/90 drop-shadow-md bg-black/40 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-white/10">
        🔒 {watermarkText}
      </div>
    </div>
  );
};
