import React, { useState, useEffect, useRef } from 'react';

interface HUDProps {
  wallet: number;
  bet: number;
}

export const HUD: React.FC<HUDProps> = ({ wallet, bet }) => {
  const [walletChange, setWalletChange] = useState<'' | 'increase' | 'decrease'>('');
  const [betChange, setBetChange] = useState<'increase' | ''>('');

  const prevWalletRef = useRef(wallet);
  const prevBetRef = useRef(bet);

  useEffect(() => {
    if (wallet > prevWalletRef.current) {
      setWalletChange('increase');
    } else if (wallet < prevWalletRef.current) {
      setWalletChange('decrease');
    }

    if (wallet !== prevWalletRef.current) {
      const timer = setTimeout(() => setWalletChange(''), 500);
      prevWalletRef.current = wallet;
      return () => clearTimeout(timer);
    }
  }, [wallet]);

  useEffect(() => {
    if (bet > prevBetRef.current) {
      setBetChange('increase');
    }
    
    if (bet !== prevBetRef.current) {
      const timer = setTimeout(() => setBetChange(''), 500);
      prevBetRef.current = bet;
      return () => clearTimeout(timer);
    }
  }, [bet]);

  const getWalletClasses = () => {
    let classes = 'text-2xl md:text-3xl font-black transition-all duration-300 ease-in-out';
    if (walletChange === 'increase') return `${classes} text-green-400 scale-110`;
    if (walletChange === 'decrease') return `${classes} text-red-500 scale-90`;
    return `${classes} text-white`;
  }
  
  const getBetClasses = () => {
    let classes = 'text-2xl md:text-3xl font-black transition-all duration-300 ease-in-out';
    if (betChange === 'increase') return `${classes} text-yellow-300 scale-110`;
    return `${classes} text-yellow-400`;
  }

  return (
    <div className="absolute top-4 left-4 md:top-6 md:left-6 flex flex-col md:flex-row gap-4 md:gap-6 text-white p-3 md:p-4 bg-black/50 rounded-xl backdrop-blur-sm border border-emerald-500/30 shadow-lg">
      <div className="text-center md:text-left">
        <h3 className="text-sm font-bold uppercase text-emerald-300 tracking-wider">Wallet</h3>
        <p className={getWalletClasses()}>${wallet}</p>
      </div>
      {bet > 0 && (
        <div className="text-center md:text-left">
          <h3 className="text-sm font-bold uppercase text-emerald-300 tracking-wider">Current Bet</h3>
          <p className={getBetClasses()}>${bet}</p>
        </div>
      )}
    </div>
  );
};
