import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare } from 'lucide-react';

export function ShareModal({
  isOpen,
  onClose,
  trip,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !trip) return null;

  const generatePlainText = () => {
    let text = `🧭 *BudgetTrip Itinerary — ${trip.destinationName}, ${trip.state}*\n`;
    text += `📅 Dates: ${trip.startDate} to ${trip.endDate} (${trip.totalDays} Days)\n`;
    text += `👥 Travelers: ${trip.travelers}\n`;
    text += `💰 Budget: ₦${trip.totalBudget?.toLocaleString()}\n`;
    if (trip.selectedHotel) {
      text += `🏨 Stay: ${trip.selectedHotel.name} (₦${trip.selectedHotel.estimatedPrice?.toLocaleString()}/night)\n`;
    }
    text += `\n*DAY-BY-DAY SCHEDULE:*\n`;

    trip.days?.forEach((day) => {
      text += `\n📌 *Day ${day.dayNumber} (${day.date}):*\n`;
      day.slots.forEach((slot) => {
        text += `• ${slot.timeLabel || ''} — ${slot.place.name} (₦${(slot.cost || slot.place.estimatedPrice)?.toLocaleString()})\n`;
      });
    });

    text += `\n✨ Generated with BudgetTrip — Smart travel on exact budget!`;
    return text;
  };

  const handleCopy = () => {
    const text = generatePlainText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(generatePlainText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl border-t sm:border border-[#e4e1db] animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e1db]">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-[#1f4a35]" />
            <h3 className="font-800 text-base text-[#111110]">Share Itinerary</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ece6] flex items-center justify-center text-[#8a8680] hover:text-[#111110] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Text Preview Box */}
        <div className="bg-[#f5f2ed] rounded-xl p-3.5 border border-[#e4e1db] max-h-48 overflow-y-auto font-mono text-xs text-[#111110] whitespace-pre-wrap leading-relaxed">
          {generatePlainText()}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={handleCopy}
            className="py-3 px-4 rounded-xl border border-[#1f4a35] text-[#1f4a35] font-700 text-xs flex items-center justify-center gap-2 hover:bg-[#e8f0ec] transition-colors cursor-pointer"
          >
            {copied ? <Check size={16} className="text-[#1f4a35]" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Text'}</span>
          </button>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="py-3 px-4 rounded-xl bg-[#25D366] text-white font-700 text-xs flex items-center justify-center gap-2 hover:brightness-105 transition-all cursor-pointer shadow-sm"
          >
            <MessageSquare size={16} />
            <span>WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
