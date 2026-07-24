import React from 'react';
import { FootballCard } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';
import { Shield, Sparkles, Star, Library } from 'lucide-react';

interface CardItemProps {
  card: FootballCard;
  inCollection?: boolean;
  onClick: (card: FootballCard) => void;
}

export function CardItem({ card, inCollection, onClick }: CardItemProps) {
  const isHolo = card.rarity !== 'Base';
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onClick(card)}
      className="group cursor-pointer relative"
    >
      {/* Card Body */}
      <div className="relative aspect-[750/1050] bg-white rounded-none border-2 border-black overflow-hidden flex flex-col transition-colors group-hover:border-[#D4FF00]">
        
        {/* Holographic Overlay Effect */}
        {isHolo && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[linear-gradient(105deg,transparent_20%,rgba(212,255,0,0.1)_25%,transparent_30%)] transition-opacity duration-700 ease-out z-20 pointer-events-none" />
        )}

        {/* Collection Badge */}
        {inCollection && (
          <div className="absolute top-2 right-2 z-30 bg-[#D4FF00] p-1.5 border-2 border-black text-black">
            <Library size={14} />
          </div>
        )}

        <div className="h-2/3 relative flex items-center justify-center bg-white border-b-2 border-black">
          <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-tr", card.imageGradient)}></div>
          
          {card.imageUrl ? (
            <div className="absolute inset-0 z-10 p-2">
               <img src={card.imageUrl} alt={card.player} className="w-full h-full object-cover grayscale mix-blend-multiply opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
            </div>
          ) : (
            <div className="z-10 text-black/50 group-hover:text-black transition-colors drop-shadow-xl">
               {card.rarity === '1-of-1 Shield' ? <Shield size={80} /> : card.rarity === 'Gold Autograph' ? <Star size={80} /> : <Sparkles size={80} />}
            </div>
          )}
          
          <div className={cn(
              "absolute bottom-2 left-2 px-2 py-1 bg-white border-2 rounded-none text-[10px] font-black uppercase tracking-widest",
              card.rarity === 'Base' && "border-black/50 text-black",
              card.rarity === 'Silver Refractor' && "border-slate-400 text-slate-600",
              card.rarity === 'Gold Autograph' && "border-amber-500 text-amber-600",
              card.rarity === '1-of-1 Shield' && "border-[#D4FF00] text-black bg-black"
            )}>
              {card.rarity.toUpperCase()}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col justify-end bg-white relative z-10">
          <div className="text-[10px] text-neutral-500 font-black uppercase tracking-widest truncate">{card.team} • {card.position}</div>
          <div className="text-xl font-black uppercase text-black truncate">{card.player}</div>
          <div className="text-[9px] text-neutral-500 font-black uppercase mt-1 tracking-widest truncate">{card.year} {card.set} {card.edition && `• ${card.edition}`}</div>
        </div>
      </div>
      
      {/* Price tag below card */}
      <div className="mt-4 flex justify-between items-center px-1">
        <span className="text-xs font-black uppercase tracking-widest text-neutral-500">{card.cardNumber}</span>
        <span className="text-sm font-black text-black group-hover:text-neutral-700 transition-colors">{formatCurrency(card.currentPrice)}</span>
      </div>
    </motion.div>
  );
}
