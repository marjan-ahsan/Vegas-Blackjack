import React from 'react';
import { Card as CardType, Hand as HandType, Rank } from '../types';

interface CoachProps {
  playerHand: HandType;
  dealerUpCard?: CardType;
}

const getAdvice = (playerHand: HandType, dealerUpCard?: CardType): string => {
  if (!dealerUpCard) {
    return '...';
  }

  const playerScore = playerHand.score;
  const dealerValue = dealerUpCard.value;

  // Determine if the player's hand is "soft" (contains an Ace counted as 11)
  const nonAceValue = playerHand.cards
    .filter(card => card.rank !== Rank.Ace)
    .reduce((sum, card) => sum + card.value, 0);
  const aceCount = playerHand.cards.filter(card => card.rank === Rank.Ace).length;
  const isSoft = aceCount > 0 && (nonAceValue + 11 + (aceCount - 1) <= 21);

  if (isSoft) {
    // Basic strategy for soft hands
    if (playerScore >= 19) return 'Stand';
    if (playerScore === 18) {
      return (dealerValue >= 2 && dealerValue <= 8) ? 'Stand' : 'Hit';
    }
    // Soft 17 or less
    return 'Hit';
  } else {
    // Basic strategy for hard hands
    if (playerScore >= 17) return 'Stand';
    if (playerScore >= 13 && playerScore <= 16) {
      return (dealerValue >= 2 && dealerValue <= 6) ? 'Stand' : 'Hit';
    }
    if (playerScore === 12) {
      return (dealerValue >= 4 && dealerValue <= 6) ? 'Stand' : 'Hit';
    }
    // 11 or less
    return 'Hit';
  }
};

export const Coach: React.FC<CoachProps> = ({ playerHand, dealerUpCard }) => {
  const advice = getAdvice(playerHand, dealerUpCard);

  let adviceColor = 'text-yellow-300';
  if (advice === 'Stand') adviceColor = 'text-green-400';
  if (advice === 'Hit') adviceColor = 'text-sky-400';

  return (
    <div className="absolute bottom-24 md:bottom-28 mb-4 p-4 bg-black/60 rounded-xl border border-yellow-400/50 backdrop-blur-sm shadow-lg animate-fade-in-down z-20">
      <h3 className="text-sm font-bold uppercase text-yellow-400 tracking-wider text-center">Coach's Advice</h3>
      <p className={`text-3xl font-black text-center mt-1 ${adviceColor}`}>
        {advice}
      </p>
    </div>
  );
};
