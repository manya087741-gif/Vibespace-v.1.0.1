import React, { useState } from 'react';
import { X, Gift, Sparkles, Plus, Wallet, Check, AlertCircle } from 'lucide-react';
import { VirtualGift, CreatorWallet, User } from '../types';
import { CURRENT_USER } from '../data/mockData';
import { socialStore } from '../utils/socialStore';
import { sound } from '../utils/audioSynth';

interface VirtualGiftsModalProps {
  creator: User;
  context: 'live_stream' | 'reel' | 'post' | 'profile';
  onClose: () => void;
  onGiftSent?: (gift: VirtualGift) => void;
}

export const VirtualGiftsModal: React.FC<VirtualGiftsModalProps> = ({
  creator,
  context,
  onClose,
  onGiftSent,
}) => {
  const [gifts] = useState<VirtualGift[]>(socialStore.getVirtualGifts());
  const [wallet, setWallet] = useState<CreatorWallet>(socialStore.getCreatorWallet());
  const [selectedGift, setSelectedGift] = useState<VirtualGift>(gifts[0]);
  const [showBuyCoins, setShowBuyCoins] = useState(false);
  const [successAnimation, setSuccessAnimation] = useState<VirtualGift | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSendGift = () => {
    setErrorMsg(null);
    if (wallet.userCoinBalance < selectedGift.coinCost) {
      setErrorMsg(`You need ${selectedGift.coinCost - wallet.userCoinBalance} more coins to send this gift.`);
      return;
    }

    sound.playSparkle();
    const res = socialStore.sendVirtualGift(creator.id, selectedGift.id, context);
    if (res.success) {
      setSuccessAnimation(selectedGift);
      setWallet(socialStore.getCreatorWallet());
      if (onGiftSent) onGiftSent(selectedGift);

      setTimeout(() => {
        setSuccessAnimation(null);
        onClose();
      }, 1600);
    } else {
      setErrorMsg(res.message || 'Failed to send gift');
    }
  };

  const handleBuyCoinPack = (coins: number, priceINR: number) => {
    sound.playSparkle();
    socialStore.buyCoinPack(coins, priceINR);
    setWallet(socialStore.getCreatorWallet());
    setShowBuyCoins(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-5 space-y-4 shadow-2xl relative overflow-hidden">
        
        {/* Animated Flying Gift Explosion Overlay */}
        {successAnimation && (
          <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center animate-in zoom-in-50 duration-300">
            <div className="text-7xl animate-bounce mb-2">{successAnimation.icon}</div>
            <h3 className="text-lg font-bold text-white">Gift Sent to {creator.fullName}!</h3>
            <p className="text-xs text-amber-300 font-mono mt-1">🪙 {successAnimation.coinCost} Coins Delivered</p>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 text-slate-950 font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Send Gift to @{creator.username}</h4>
              <span className="text-[10px] text-slate-400">100% of cash value supports creator directly</span>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Coin Balance & Top Up Bar */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">Your Balance:</span>
            <span className="text-amber-300 font-bold text-sm">🪙 {wallet.userCoinBalance} Coins</span>
          </div>
          <button
            onClick={() => setShowBuyCoins(!showBuyCoins)}
            className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-slate-950 font-bold text-[11px] transition-colors border border-amber-500/30 flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buy Coins</span>
          </button>
        </div>

        {/* Buy Coins Store */}
        {showBuyCoins && (
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-amber-500/30 space-y-2.5 animate-in fade-in duration-150">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-white">Instant Coin Top Up (UPI / Card)</span>
              <span className="text-[10px] text-slate-400">Zero Fees</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { coins: 100, price: 99 },
                { coins: 350, price: 299 },
                { coins: 1200, price: 899 },
              ].map((pack, idx) => (
                <button
                  key={idx}
                  onClick={() => handleBuyCoinPack(pack.coins, pack.price)}
                  className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-400 text-center space-y-0.5 transition-all"
                >
                  <div className="font-mono font-bold text-amber-300 text-xs">🪙 {pack.coins}</div>
                  <div className="font-mono font-bold text-white text-[11px]">₹{pack.price}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Gifts Selector Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5 pt-1">
          {gifts.map((gift) => {
            const isSelected = selectedGift.id === gift.id;
            return (
              <button
                key={gift.id}
                onClick={() => {
                  sound.playHeartPop();
                  setSelectedGift(gift);
                  setErrorMsg(null);
                }}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1 transition-all ${
                  isSelected
                    ? 'border-amber-400 bg-amber-400/10 shadow-md shadow-amber-950/40 scale-105'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <span className="text-3xl">{gift.icon}</span>
                <span className="text-[11px] font-bold text-white line-clamp-1">{gift.name}</span>
                <span className="text-[10px] font-mono text-amber-300 font-bold">🪙 {gift.coinCost}</span>
              </button>
            );
          })}
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Send Action CTA */}
        <div className="pt-2">
          <button
            onClick={handleSendGift}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 hover:brightness-110 text-white font-bold text-xs shadow-lg shadow-rose-950/50 transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Send {selectedGift.name} ({selectedGift.icon})</span>
            <span className="font-mono opacity-90">• 🪙 {selectedGift.coinCost} coins</span>
          </button>
        </div>

      </div>
    </div>
  );
};
