
import { GoogleGenAI } from "@google/genai";
import { Hand } from '../types';
import { Rank } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. AI Coach will not work.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const cardRankToString = (rank: Rank): string => {
  switch (rank) {
    case Rank.Ace: return 'Ace';
    case Rank.King: return 'King';
    case Rank.Queen: return 'Queen';
    case Rank.Jack: return 'Jack';
    default: return rank;
  }
};

export const getBlackjackAdvice = async (playerHand: Hand, dealerCard: Hand['cards'][0]): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Key is not configured. The AI Coach is unavailable.";
  }

  const playerHandString = playerHand.cards.map(c => cardRankToString(c.rank)).join(' and ');
  const dealerCardString = cardRankToString(dealerCard.rank);

  const prompt = `You are a blackjack strategy expert providing concise advice based on standard basic strategy. The player has a hand of ${playerHandString} (total value: ${playerHand.score}). The dealer is showing a ${dealerCardString}. Should the player hit or stand? Provide a direct recommendation (e.g., "You should HIT.") followed by a very brief one-sentence explanation.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching advice from Gemini API:", error);
    return "Couldn't get advice from the coach right now. Please try again.";
  }
};
