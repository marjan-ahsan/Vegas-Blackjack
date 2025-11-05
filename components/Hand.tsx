import React, { useRef, useEffect } from 'react';
import { Card as CardComponent } from './Card';
import { Hand as HandType } from '../types';

interface HandProps {
  hand: HandType;
  title: string;
  isDealer?: boolean;
  isPlayerTurn?: boolean;
}

export const Hand: React.FC<HandProps> = ({ hand, title, isDealer = false, isPlayerTurn = false }) => {
  const prevCardCountRef = useRef(hand.cards.length);

  useEffect(() => {
    prevCardCountRef.current = hand.cards.length;
  });

  const cardCount = hand.cards.length;
  const prevCardCount = prevCardCountRef.current;
  const cardsAdded = cardCount > prevCardCount;

  return (
    <div className="flex flex-col items-center space-y-2 md:space-y-4 min-h-[12rem] md:min-h-[14rem]">
      <div className="text-center">
        <h2 className="text-xl md:text-2xl font-bold text-emerald-300 tracking-wider uppercase">{title}</h2>
        {hand.cards.length > 0 && (
          <p className="text-2xl md:text-3xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]">
            {isDealer && isPlayerTurn ? '?' : hand.score}
          </p>
        )}
      </div>
      <div className="flex justify-center items-center h-44">
        {hand.cards.map((card, index) => {
          const shouldAnimate = cardsAdded && index >= prevCardCount;
          return (
            <div
              key={index}
              className="transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${index * 70}%)`, zIndex: index }}
            >
              <div
                className={shouldAnimate ? 'animate-deal-in' : ''}
                style={{ animationDelay: shouldAnimate ? `${(index - prevCardCount) * 100}ms` : '0s' }}
              >
                <CardComponent card={card} hidden={isDealer && index === 0 && isPlayerTurn} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};