import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Suit, Rank, Card as CardType, Hand as HandType, GamePhase } from './types';
import { Hand } from './components/Hand';
import { HUD } from './components/HUD';
import Chip from './components/Chip';
import { GameResultDisplay } from './components/GameResultDisplay';
import { Coach } from './components/Coach';

const createDeck = (): CardType[] => {
  const suits = Object.values(Suit);
  const ranks = Object.values(Rank);
  const deck: CardType[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      let value = parseInt(rank);
      if (rank === Rank.Jack || rank === Rank.Queen || rank === Rank.King) value = 10;
      if (rank === Rank.Ace) value = 11;
      deck.push({ suit, rank, value });
    }
  }
  return deck;
};

const shuffleDeck = (deck: CardType[]): CardType[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const calculateScore = (cards: CardType[]): number => {
  let score = cards.reduce((sum, card) => sum + card.value, 0);
  let aces = cards.filter(card => card.rank === Rank.Ace).length;

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }
  return score;
};


const App: React.FC = () => {
  const [deck, setDeck] = useState<CardType[]>([]);
  const [playerHand, setPlayerHand] = useState<HandType>({ cards: [], score: 0 });
  const [dealerHand, setDealerHand] = useState<HandType>({ cards: [], score: 0 });
  const [wallet, setWallet] = useState(1000);
  const [currentBet, setCurrentBet] = useState(0);
  const [placedChips, setPlacedChips] = useState<number[]>([]);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.Betting);
  const [message, setMessage] = useState<string | null>(null);
  const [isDealingAnimation, setIsDealingAnimation] = useState(false);
  
  const resetHands = useCallback(() => {
    let currentDeck = deck;
    if (deck.length < 26) { // Reshuffle if deck is low
      currentDeck = shuffleDeck(createDeck());
    }
    const newPlayerHand = { cards: [currentDeck[0], currentDeck[2]], score: 0 };
    const newDealerHand = { cards: [currentDeck[1], currentDeck[3]], score: 0 };
    newPlayerHand.score = calculateScore(newPlayerHand.cards);
    newDealerHand.score = calculateScore(newDealerHand.cards);

    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDeck(currentDeck.slice(4));

    if (newPlayerHand.score === 21) {
      setGamePhase(GamePhase.Result);
    } else {
      setGamePhase(GamePhase.PlayerTurn);
    }
  }, [deck]);

  useEffect(() => {
    setDeck(shuffleDeck(createDeck()));
  }, []);

  useEffect(() => {
    if (gamePhase === GamePhase.DealerTurn) {
      const dealerInterval = setInterval(() => {
        setDealerHand(prevHand => {
          const currentScore = calculateScore(prevHand.cards);
          if (currentScore < 17) {
            const newCard = deck[0];
            const newHand = [...prevHand.cards, newCard];
            setDeck(deck.slice(1));
            return { cards: newHand, score: calculateScore(newHand) };
          } else {
            clearInterval(dealerInterval);
            setGamePhase(GamePhase.Result);
            return prevHand;
          }
        });
      }, 1000);
      return () => clearInterval(dealerInterval);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase, deck]);

  useEffect(() => {
    if (gamePhase === GamePhase.Result) {
      let finalMessage = '';
      const playerScore = playerHand.score;
      const dealerScore = dealerHand.score;
      
      if (playerScore > 21) finalMessage = 'Player Bust!';
      else if (dealerScore > 21) {
        finalMessage = 'Dealer Bust! You Win!';
        setWallet(w => w + currentBet * 2);
      } else if (playerScore === 21 && playerHand.cards.length === 2) {
        finalMessage = 'Blackjack! You Win!';
        setWallet(w => w + currentBet * 2.5);
      } else if (playerScore > dealerScore) {
        finalMessage = 'You Win!';
        setWallet(w => w + currentBet * 2);
      } else if (playerScore < dealerScore) {
        finalMessage = 'You Lose!';
      } else {
        finalMessage = 'Push!';
        setWallet(w => w + currentBet);
      }

      setMessage(finalMessage);
      setTimeout(() => {
        setGamePhase(GamePhase.Betting);
        setCurrentBet(0);
        setMessage(null);
        // Clear hands to allow for deal animation on next round
        setPlayerHand({ cards: [], score: 0 });
        setDealerHand({ cards: [], score: 0 });
      }, 3000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gamePhase]);
  
  const totalPlacedBet = placedChips.reduce((sum, val) => sum + val, 0);

  const handleAddChipToBet = (amount: number) => {
    if (wallet >= amount) {
      setPlacedChips(currentChips => [...currentChips, amount]);
      setWallet(w => w - amount);
    }
  };
  
  const handleRemoveChipFromBet = (chipIndex: number) => {
    const chipValue = placedChips[chipIndex];
    setWallet(w => w + chipValue);
    setPlacedChips(currentChips => currentChips.filter((_, index) => index !== chipIndex));
  };


  const handleDeal = () => {
    if (totalPlacedBet > 0) {
      setMessage(null);
      setCurrentBet(totalPlacedBet);
      setIsDealingAnimation(true);
      
      setTimeout(() => {
        resetHands();
        setIsDealingAnimation(false);
        setPlacedChips([]);
      }, 800);
    }
  };

  const handleHit = () => {
    const newCard = deck[0];
    const newHand = [...playerHand.cards, newCard];
    const newScore = calculateScore(newHand);
    setPlayerHand({ cards: newHand, score: newScore });
    setDeck(deck.slice(1));
    if (newScore > 21) {
      setGamePhase(GamePhase.Result);
    }
  };

  const handleStand = () => {
    setGamePhase(GamePhase.DealerTurn);
  };
  
  const bettingChips = useMemo(() => {
    const chips = [10, 25, 50, 100, 500, 1000];
    if (wallet >= 100000) chips.push(100000);
    if (wallet >= 1000000) chips.push(1000000);
    if (wallet >= 1000000000) chips.push(1000000000);
    if (wallet >= 1000000000000) chips.push(1000000000000);
    return chips;
  }, [wallet]);


  return (
    <>
    <style>{`
      @keyframes fade-in-out {
        0%, 100% { opacity: 0; transform: scale(0.9); }
        10%, 90% { opacity: 1; transform: scale(1); }
      }
      .animate-fade-in-out {
        animation: fade-in-out 3s ease-in-out forwards;
      }
      @keyframes fade-in-down {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      .animate-fade-in-down {
        animation: fade-in-down 0.3s ease-out forwards;
      }
      
      /* Card Animation Styles */
      .perspective-1000 { perspective: 1000px; }
      .transform-style-preserve-3d { transform-style: preserve-3d; }
      .rotate-y-180 { transform: rotateY(180deg); }
      .backface-hidden { 
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
      }

      @keyframes deal-in {
        from {
          opacity: 0;
          transform: translateY(-40px) rotateX(45deg) scale(0.8);
        }
        to {
          opacity: 1;
          transform: translateY(0) rotateX(0deg) scale(1);
        }
      }
      .animate-deal-in {
        animation: deal-in 0.4s ease-out backwards;
      }
      
      .shadow-inner-strong {
        box-shadow: inset 0 2px 4px rgba(0,0,0,0.5);
      }
      
      @keyframes chip-placed {
        from { transform: scale(0.8) translateY(20px); opacity: 0; }
        to { transform: scale(1) translateY(0); opacity: 1; }
      }
      .animate-chip-placed {
        animation: chip-placed 0.3s ease-out forwards;
      }

      @keyframes chip-to-dealer {
        to {
          transform: translateY(-25vh) scale(0.5);
          opacity: 0;
        }
      }
      .animate-chip-to-dealer {
        animation: chip-to-dealer 0.8s ease-in forwards;
      }
    `}</style>
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-emerald-950/80 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="absolute inset-0 bg-center bg-no-repeat opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23a0aec0\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>

      <HUD wallet={wallet} bet={gamePhase === GamePhase.Betting ? totalPlacedBet : currentBet} />
      <Coach playerHand={playerHand} dealerCard={dealerHand.cards[1]} isPlayerTurn={gamePhase === GamePhase.PlayerTurn} />

      <main className="z-10 w-full max-w-7xl flex flex-col items-center justify-between flex-grow">
        <Hand hand={dealerHand} title="Dealer" isDealer isPlayerTurn={gamePhase === GamePhase.PlayerTurn} />
        
        <div className="py-8 relative min-h-[5rem]">
            <GameResultDisplay message={message} />
            {gamePhase === GamePhase.Betting && placedChips.length > 0 && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center transition-transform duration-500 ${isDealingAnimation ? 'animate-chip-to-dealer' : ''}`}>
                    {placedChips.map((chipValue, index) => (
                        <div key={index} className="animate-chip-placed" style={{ transform: `translateY(${index * -4}px)`, zIndex: index }}>
                            <Chip value={chipValue} onClick={() => handleRemoveChipFromBet(index)} />
                        </div>
                    ))}
                </div>
            )}
        </div>

        <Hand hand={playerHand} title="Player" />

        <div className="w-full flex flex-col items-center justify-center py-6 md:py-8 min-h-[10rem] -translate-y-12">
          {gamePhase === GamePhase.Betting && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-lg md:text-xl font-bold text-yellow-300">Place Your Bet</p>
              <div className="flex space-x-2 md:space-x-4 flex-wrap justify-center gap-2">
                {bettingChips.map(chipValue => (
                  <Chip key={chipValue} value={chipValue} onClick={handleAddChipToBet} disabled={wallet < chipValue}/>
                ))}
              </div>
              <button 
                onClick={handleDeal} 
                disabled={totalPlacedBet === 0}
                className="mt-4 px-10 py-3 bg-yellow-500 text-black font-bold text-lg rounded-lg shadow-lg hover:bg-yellow-400 transition-all duration-200 transform hover:scale-105 disabled:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  Deal
              </button>
            </div>
          )}
          {gamePhase === GamePhase.PlayerTurn && (
            <div className="flex space-x-4">
              <button onClick={handleHit} className="px-10 py-3 bg-emerald-600 font-bold text-lg rounded-lg shadow-lg hover:bg-emerald-500 transition-all duration-200 transform hover:scale-105">
                Hit
              </button>
              <button onClick={handleStand} className="px-10 py-3 bg-red-700 font-bold text-lg rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200 transform hover:scale-105">
                Stand
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
};

export default App;