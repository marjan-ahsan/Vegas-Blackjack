
import React, { useState, useCallback } from 'react';
import { getBlackjackAdvice } from '../services/geminiService';
import { Hand } from '../types';

interface CoachProps {
  playerHand: Hand;
  dealerCard: Hand['cards'][0] | undefined;
  isPlayerTurn: boolean;
}

const BrainIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.197-5.975M15 11a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);


export const Coach: React.FC<CoachProps> = ({ playerHand, dealerCard, isPlayerTurn }) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAdvice = useCallback(async () => {
    if (!dealerCard) return;
    setIsLoading(true);
    setAdvice(null);
    const result = await getBlackjackAdvice(playerHand, dealerCard);
    setAdvice(result);
    setIsLoading(false);
    setTimeout(() => setAdvice(null), 8000); // Advice disappears after 8 seconds
  }, [playerHand, dealerCard]);

  if (!isPlayerTurn) {
    return null;
  }
  
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 flex flex-col items-end z-20">
        <button
          onClick={handleGetAdvice}
          disabled={isLoading}
          className="p-3 bg-emerald-700/50 text-emerald-200 rounded-full hover:bg-emerald-600/70 backdrop-blur-sm transition-all duration-200 flex items-center gap-2 shadow-lg border border-emerald-500/30 disabled:opacity-50 disabled:cursor-wait"
        >
          <BrainIcon/>
          <span className="hidden md:inline">{isLoading ? 'Thinking...' : 'AI Coach'}</span>
        </button>
        {advice && (
            <div className="mt-2 p-3 bg-black/70 border border-yellow-400/50 rounded-lg text-yellow-300 max-w-xs text-sm shadow-2xl animate-fade-in-down">
                <p className="font-bold">Coach says:</p>
                <p>{advice}</p>
            </div>
        )}
    </div>
  );
};
