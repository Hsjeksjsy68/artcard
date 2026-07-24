import React from 'react';
import { FootballCard } from '../types';
import { PriceChart } from './PriceChart';
import { formatCurrency, cn } from '../lib/utils';
import { X, TrendingUp, TrendingDown, Check, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CardModalProps {
  card: FootballCard | null;
  isOpen: boolean;
  onClose: () => void;
  inCollection: boolean;
  onToggleCollection: (cardId: string) => void;
}

export function CardModal({ card, isOpen, onClose, inCollection, onToggleCollection }: CardModalProps) {
  if (!card) return null;

  const firstPrice = card.priceHistory[0].price;
  const lastPrice = card.currentPrice;
  const priceChange = lastPrice - firstPrice;
  const priceChangePercent = (priceChange / firstPrice) * 100;
  const isPositive = priceChange >= 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-4xl bg-white border-2 border-black rounded-none shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 z-50 p-2 bg-white border-2 border-black hover:bg-[#D4FF00] hover:text-black hover:border-black rounded-none text-black transition-colors"
            >
              <X size={20} />
            </button>

            {/* Left Side: Card Visual */}
            <div className="w-full md:w-2/5 p-6 md:p-10 bg-neutral-100 flex items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-black relative overflow-hidden">
              <div className="relative w-full max-w-[280px] aspect-[750/1050] bg-white rounded-none border-2 border-black overflow-hidden flex flex-col transition-colors shadow-2xl">
                
                {card.imageUrl ? (
                  <img src={card.imageUrl} alt={card.player} className="absolute inset-0 w-full h-full object-cover z-10" />
                ) : (
                  <>
                    <div className="h-2/3 relative flex items-center justify-center bg-white border-b-2 border-black">
                      <div className={cn("absolute inset-0 opacity-20 bg-gradient-to-tr", card.imageGradient)}></div>
                      
                      <div className={cn(
                          "absolute bottom-2 left-2 px-2 py-1 bg-white border-2 rounded-none text-[10px] font-black uppercase tracking-widest z-20",
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
                  </>
                )}
              </div>
            </div>

            {/* Right Side: Details & Data */}
            <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col overflow-y-auto bg-white text-black">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-black mb-2">{card.player}</h2>
                  <div className="flex items-center gap-3">
                    <span className="text-neutral-500 text-xs uppercase font-black tracking-widest">{card.set}</span>
                    <span className="w-1.5 h-1.5 bg-black" />
                    <span className={cn(
                      "text-[10px] uppercase font-black tracking-widest px-2 py-1 border-2 border-black",
                      card.rarity === 'Base' && "bg-white text-black",
                      card.rarity === 'Silver Refractor' && "bg-slate-300 text-black border-black",
                      card.rarity === 'Gold Autograph' && "bg-amber-300 text-black border-black",
                      card.rarity === '1-of-1 Shield' && "bg-black text-[#D4FF00] border-black"
                    )}>
                      {card.rarity}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2">Market Value (৳)</p>
                  <p className="text-3xl font-black text-black tracking-tighter">{formatCurrency(card.currentPrice)}</p>
                </div>
                <div className="bg-white border-2 border-black p-6">
                  <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-2">6-Month Change</p>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-3xl font-black flex items-center gap-2 tracking-tighter",
                      isPositive ? "text-emerald-500" : "text-red-500"
                    )}>
                      {isPositive ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                      {Math.abs(priceChangePercent).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-8 flex-1 min-h-[250px] border-2 border-black p-4">
                <h4 className="text-xs font-black text-neutral-500 uppercase tracking-widest mb-4">Price History</h4>
                <PriceChart data={card.priceHistory} />
              </div>

              <div className="mt-auto pt-6 border-t-2 border-black">
                <button
                  onClick={() => onToggleCollection(card.id)}
                  className={cn(
                    "w-full py-4 px-6 border-2 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-colors",
                    inCollection 
                      ? "bg-neutral-200 text-black border-black hover:bg-neutral-300" 
                      : "bg-[#D4FF00] text-black border-black hover:bg-black hover:text-white"
                  )}
                >
                  {inCollection ? (
                    <>
                      <Check size={20} strokeWidth={3} />
                      IN COLLECTION
                    </>
                  ) : (
                    <>
                      <Plus size={20} strokeWidth={3} />
                      ADD TO COLLECTION
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
