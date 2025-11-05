import React from 'react';

interface ChipProps {
  value: number;
  onClick: (value: number) => void;
  disabled?: boolean;
}

const formatDisplayValue = (value: number): string => {
    if (value >= 1_000_000_000_000) return `$${value / 1_000_000_000_000}T`;
    if (value >= 1_000_000_000) return `$${value / 1_000_000_000}B`;
    if (value >= 1_000_000) return `$${value / 1_000_000}M`;
    if (value >= 1000) return `$${value / 1000}K`;
    return `$${value}`;
};


const Chip: React.FC<ChipProps> = ({ value, onClick, disabled }) => {
  const colors: { [key: number]: { base: string; shadow: string, activeShadow: string, textColor?: string, textSize?: string } } = {
    10: { base: 'bg-blue-500 hover:bg-blue-400', shadow: 'shadow-[0_6px_0_#1d4ed8,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#1d4ed8,0_3px_5px_rgba(0,0,0,0.4)]' },
    25: { base: 'bg-green-600 hover:bg-green-500', shadow: 'shadow-[0_6px_0_#166534,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#166534,0_3px_5px_rgba(0,0,0,0.4)]' },
    50: { base: 'bg-red-600 hover:bg-red-500', shadow: 'shadow-[0_6px_0_#991b1b,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#991b1b,0_3px_5px_rgba(0,0,0,0.4)]' },
    100: { base: 'bg-gray-800 hover:bg-gray-700', shadow: 'shadow-[0_6px_0_#1f2937,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#1f2937,0_3px_5px_rgba(0,0,0,0.4)]' },
    500: { base: 'bg-purple-600 hover:bg-purple-500', shadow: 'shadow-[0_6px_0_#6b21a8,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#6b21a8,0_3px_5px_rgba(0,0,0,0.4)]' },
    1000: { base: 'bg-orange-500 hover:bg-orange-400', shadow: 'shadow-[0_6px_0_#c2410c,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#c2410c,0_3px_5px_rgba(0,0,0,0.4)]' },
    
    // Premium chips
    100000: { base: 'bg-gradient-to-br from-yellow-400 to-amber-600 hover:from-yellow-300 hover:to-amber-500', shadow: 'shadow-[0_6px_0_#92400e,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#92400e,0_3px_5px_rgba(0,0,0,0.4)]', textColor: 'text-black', textSize: 'text-md' },
    1000000: { base: 'bg-gradient-to-br from-slate-300 to-slate-500 hover:from-slate-200 hover:to-slate-400', shadow: 'shadow-[0_6px_0_#334155,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#334155,0_3px_5px_rgba(0,0,0,0.4)]', textColor: 'text-black', textSize: 'text-md' },
    1000000000: { base: 'bg-gradient-to-br from-cyan-300 via-sky-400 to-violet-500 hover:brightness-110', shadow: 'shadow-[0_6px_0_#0c4a6e,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#0c4a6e,0_3px_5px_rgba(0,0,0,0.4)]', textColor: 'text-white', textSize: 'text-md' },
    1000000000000: { base: 'bg-gradient-to-br from-gray-900 via-purple-900 to-black hover:brightness-150', shadow: 'shadow-[0_6px_0_#2e1065,0_8px_10px_rgba(0,0,0,0.3)]', activeShadow: 'active:shadow-[0_2px_0_#2e1065,0_3px_5px_rgba(0,0,0,0.4)]', textColor: 'text-white', textSize: 'text-md' },
  };

  const color = colors[value] || { base: 'bg-gray-500', shadow: 'shadow-[0_6px_0_#4b5563]', activeShadow: 'active:shadow-[0_2px_0_#4b5563]' };
  const displayText = formatDisplayValue(value);
  const textColor = color.textColor || 'text-white';
  const textSize = color.textSize || 'text-lg';

  return (
    <button
      onClick={() => onClick(value)}
      disabled={disabled}
      className={`
        w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center font-bold
        transform transition-all duration-150
        focus:outline-none focus:ring-4 focus:ring-yellow-400 focus:ring-opacity-75
        disabled:opacity-50 disabled:cursor-not-allowed
        hover:-translate-y-1 active:translate-y-[2px] 
        disabled:transform-none disabled:shadow-md
        ${color.base} ${color.shadow} ${color.activeShadow} ${textColor} ${textSize}
      `}
    >
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border-4 border-white/50 flex items-center justify-center select-none shadow-inner-strong">
        {displayText}
      </div>
    </button>
  );
};

export default Chip;
