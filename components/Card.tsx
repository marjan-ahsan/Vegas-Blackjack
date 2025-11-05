
import React from 'react';
import { Card as CardType, Suit } from '../types';

interface CardProps {
  card?: CardType;
  hidden?: boolean;
}

const SuitIcon: React.FC<{ suit: Suit }> = ({ suit }) => {
  const isRed = suit === Suit.Hearts || suit === Suit.Diamonds;
  return <span className={`text-2xl md:text-3xl ${isRed ? 'text-red-500' : 'text-gray-800'}`}>{suit}</span>;
};

export const Card: React.FC<CardProps> = ({ card, hidden = false }) => {
  if (!card) {
    return (
      <div className="w-24 h-36 md:w-28 md:h-44 rounded-lg bg-emerald-800 border-2 border-emerald-600 flex items-center justify-center shadow-lg transition-all duration-300">
        <div className="w-16 h-24 rounded bg-emerald-900/50"></div>
      </div>
    );
  }

  const { suit, rank } = card;
  const isRed = suit === Suit.Hearts || suit === Suit.Diamonds;
  const textColor = isRed ? 'text-red-500' : 'text-gray-800';

  const cardBack = (
    <div className="absolute inset-0 w-full h-full rounded-lg bg-emerald-800 border-2 border-emerald-600 flex items-center justify-center shadow-lg backface-hidden">
      <div className="w-16 h-24 rounded bg-emerald-900/50"></div>
    </div>
  );
  
  const cardFront = (
    <div className="absolute inset-0 w-full h-full rounded-lg bg-gray-50 border border-gray-200 p-2 flex flex-col justify-between shadow-lg overflow-hidden backface-hidden rotate-y-180">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 opacity-50"></div>
      <div className="relative">
        <div className={`text-2xl font-bold ${textColor}`}>{rank}</div>
        <SuitIcon suit={suit} />
      </div>
      <div className="self-center">
        <span className={`text-5xl md:text-6xl ${textColor}`}>{suit}</span>
      </div>
      <div className="relative self-end transform rotate-180">
        <div className={`text-2xl font-bold ${textColor}`}>{rank}</div>
        <SuitIcon suit={suit} />
      </div>
    </div>
  );

  return (
    <div className="w-24 h-36 md:w-28 md:h-44 perspective-1000 transition-transform duration-300 hover:-translate-y-2">
      <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${!hidden ? 'rotate-y-180' : ''}`}>
        {cardBack}
        {cardFront}
      </div>
    </div>
  );
};
