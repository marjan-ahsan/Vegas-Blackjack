
export enum Suit {
  Spades = '♠',
  Clubs = '♣',
  Hearts = '♥',
  Diamonds = '♦',
}

export enum Rank {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
}

export interface Card {
  suit: Suit;
  rank: Rank;
  value: number;
}

export interface Hand {
  cards: Card[];
  score: number;
}

export enum GamePhase {
  Betting = 'BETTING',
  PlayerTurn = 'PLAYER_TURN',
  DealerTurn = 'DEALER_TURN',
  Result = 'RESULT',
}
