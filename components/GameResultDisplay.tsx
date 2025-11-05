
import React from 'react';

interface GameResultDisplayProps {
  message: string | null;
}

export const GameResultDisplay: React.FC<GameResultDisplayProps> = ({ message }) => {
  if (!message) return null;

  let messageColor = 'text-yellow-400';
  if (message.includes('Win')) messageColor = 'text-green-400';
  if (message.includes('Bust') || message.includes('Lose')) messageColor = 'text-red-500';

  return (
    <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-5xl md:text-7xl font-black uppercase drop-shadow-lg animate-fade-in-out" style={{textShadow: '0 4px 10px rgba(0,0,0,0.7)'}}>
            <span className={messageColor}>{message}</span>
        </div>
    </div>
  );
};

// Add keyframes to index.html or a global CSS file if you had one. 
// For this single-file setup, we can use a style tag in index.html,
// but for this project let's add it via tailwind.config.js if we could.
// As we can't, this will be defined in App.tsx style tag for simplicity.
