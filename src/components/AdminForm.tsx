import React, { useState, useRef } from 'react';
import { FootballCard, Rarity } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { ImagePlus, TrendingUp } from 'lucide-react';

interface AdminFormProps {
  onAdd: (card: FootballCard) => void;
  totalCards: number;
  totalMarketCap: number;
}

export function AdminForm({ onAdd, totalCards, totalMarketCap }: AdminFormProps) {
  const [formData, setFormData] = useState({
    player: '',
    team: '',
    position: '',
    year: new Date().getFullYear().toString(),
    set: '',
    edition: '1st Edition',
    rarity: 'Base' as Rarity,
    cardNumber: '',
    currentPrice: '1000'
  });
  
  const [imageUrl, setImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate simple price history
    const history = [];
    const basePrice = Number(formData.currentPrice);
    const now = new Date();
    
    for (let i = 24; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i * 7);
      history.push({
        date: date.toISOString().split('T')[0],
        price: basePrice * (0.8 + Math.random() * 0.4) // Random variation
      });
    }
    history[history.length - 1].price = basePrice; // Ensure current price matches

    // Determine gradient based on rarity
    let gradient = 'from-zinc-300 via-gray-400 to-zinc-300';
    if (formData.rarity === 'Gold Autograph') gradient = 'from-amber-300 via-yellow-500 to-amber-700';
    if (formData.rarity === '1-of-1 Shield') gradient = 'from-zinc-900 via-zinc-600 to-zinc-900';
    if (formData.rarity === 'Silver Refractor') gradient = 'from-slate-200 via-gray-300 to-slate-200';

    const newCard: FootballCard = {
      id: `custom-${Date.now()}`,
      player: formData.player,
      team: formData.team,
      position: formData.position,
      year: parseInt(formData.year, 10),
      set: formData.set,
      edition: formData.edition,
      rarity: formData.rarity,
      cardNumber: formData.cardNumber,
      imageUrl: imageUrl || undefined,
      imageGradient: gradient,
      priceHistory: history,
      currentPrice: basePrice
    };

    onAdd(newCard);
    
    // Reset form
    setFormData({
      player: '',
      team: '',
      position: '',
      year: new Date().getFullYear().toString(),
      set: '',
      edition: '1st Edition',
      rarity: 'Base',
      cardNumber: '',
      currentPrice: '1000'
    });
    setImageUrl('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const inputClasses = "w-full bg-white border-2 border-black focus:border-[#D4FF00] focus:ring-2 focus:ring-[#D4FF00] text-black px-4 py-3 outline-none transition-colors uppercase font-black text-sm";
  const labelClasses = "block text-xs font-black text-neutral-500 mb-2 uppercase tracking-widest";

  return (
    <div className="space-y-8">
      {/* Dashboard Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-black text-white p-6 border-2 border-black">
          <p className="text-xs font-black text-neutral-400 mb-2 uppercase tracking-widest">Total Cards</p>
          <p className="text-4xl font-black tracking-tighter text-[#D4FF00]">{totalCards}</p>
        </div>
        <div className="bg-[#D4FF00] text-black p-6 border-2 border-black">
          <p className="text-xs font-black text-black/60 mb-2 uppercase tracking-widest">Total Market Cap (৳)</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={24} />
            <p className="text-3xl font-black tracking-tighter">{formatCurrency(totalMarketCap)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-black mb-6 border-b-2 border-black pb-4">
          Add New Card
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Image Upload Area */}
          <div>
             <label className={labelClasses}>Card Image</label>
             <div 
               onClick={() => fileInputRef.current?.click()}
               className="w-full h-40 border-2 border-dashed border-black bg-neutral-50 flex items-center justify-center cursor-pointer hover:bg-neutral-100 transition-colors relative overflow-hidden"
             >
               {imageUrl ? (
                 <img src={imageUrl} alt="Preview" className="h-full object-contain mix-blend-multiply" />
               ) : (
                 <div className="flex flex-col items-center text-neutral-400">
                   <ImagePlus size={32} className="mb-2" />
                   <span className="text-sm font-black uppercase tracking-widest">Upload Image</span>
                 </div>
               )}
               <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleImageUpload} 
                 accept="image/*" 
                 className="hidden" 
               />
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Player Name</label>
              <input required type="text" name="player" value={formData.player} onChange={handleChange} className={inputClasses} placeholder="LIONEL MESSI" />
            </div>
            <div>
              <label className={labelClasses}>Team</label>
              <input required type="text" name="team" value={formData.team} onChange={handleChange} className={inputClasses} placeholder="MIAMI FC" />
            </div>
            
            <div>
              <label className={labelClasses}>Position</label>
              <input required type="text" name="position" value={formData.position} onChange={handleChange} className={inputClasses} placeholder="FWD" />
            </div>
            <div>
              <label className={labelClasses}>Year</label>
              <input required type="number" name="year" value={formData.year} onChange={handleChange} className={inputClasses} placeholder="2024" />
            </div>

            <div>
              <label className={labelClasses}>Set / Brand</label>
              <input required type="text" name="set" value={formData.set} onChange={handleChange} className={inputClasses} placeholder="TOPPS CHROME" />
            </div>
            <div>
              <label className={labelClasses}>Card Number</label>
              <input required type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className={inputClasses} placeholder="TC-LM" />
            </div>
            
            <div>
              <label className={labelClasses}>Edition</label>
              <input required type="text" name="edition" value={formData.edition} onChange={handleChange} className={inputClasses} placeholder="1st Edition" />
            </div>
            <div>
              <label className={labelClasses}>Rarity</label>
              <select name="rarity" value={formData.rarity} onChange={handleChange} className={inputClasses}>
                <option value="Base">Base</option>
                <option value="Silver Refractor">Silver Refractor</option>
                <option value="Gold Autograph">Gold Autograph</option>
                <option value="1-of-1 Shield">1-of-1 Shield</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelClasses}>Market Price (৳)</label>
              <input required type="number" min="0" step="1" name="currentPrice" value={formData.currentPrice} onChange={handleChange} className={inputClasses} placeholder="1000" />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#D4FF00] hover:bg-black hover:text-white text-black font-black uppercase tracking-widest py-4 border-2 border-black transition-colors mt-8 text-lg"
          >
            Publish Card to Database
          </button>
        </form>
      </div>
    </div>
  );
}
