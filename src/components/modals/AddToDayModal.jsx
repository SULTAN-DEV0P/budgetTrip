import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Check, Plus } from 'lucide-react';

export function AddToDayModal({
  isOpen,
  onClose,
  place,
  totalDays = 3,
  onConfirmAdd,
}) {
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState('afternoon');

  useEffect(() => {
    if (isOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isOpen]);

  if (!isOpen || !place) return null;

  const handleAdd = () => {
    onConfirmAdd(place, selectedDay, selectedSlot);
    onClose();
  };

  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl p-5 space-y-4 shadow-2xl border-t sm:border border-[#e4e1db] overscroll-contain touch-pan-y animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#e4e1db]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center font-bold">
              <Plus size={16} />
            </div>
            <div>
              <h3 className="font-800 text-sm text-[#111110]">Add to Itinerary</h3>
              <p className="text-xs text-[#8a8680] truncate max-w-[220px]">{place.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#f0ece6] flex items-center justify-center text-[#8a8680] hover:text-[#111110] cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Select Day */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] flex items-center gap-1">
            <Calendar size={13} className="text-[#1f4a35]" />
            <span>Select Day</span>
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {days.map((dayNum) => (
              <button
                key={dayNum}
                type="button"
                onClick={() => setSelectedDay(dayNum)}
                className={`py-2 px-1 rounded-xl text-xs font-700 border transition-all cursor-pointer ${
                  selectedDay === dayNum
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                    : 'bg-[#f5f2ed] text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                Day {dayNum}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Select Time of Day */}
        <div className="space-y-2">
          <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] flex items-center gap-1">
            <Clock size={13} className="text-[#1f4a35]" />
            <span>Time of Day</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'morning', label: 'Morning', time: '9:30 AM' },
              { id: 'afternoon', label: 'Afternoon', time: '1:30 PM' },
              { id: 'evening', label: 'Evening', time: '6:30 PM' },
            ].map((slot) => (
              <button
                key={slot.id}
                type="button"
                onClick={() => setSelectedSlot(slot.id)}
                className={`p-2 rounded-xl text-center border transition-all cursor-pointer ${
                  selectedSlot === slot.id
                    ? 'bg-[#e8f0ec] border-[#1f4a35] text-[#1f4a35]'
                    : 'bg-[#f5f2ed] border-[#e4e1db] text-[#111110]'
                }`}
              >
                <p className="text-xs font-700">{slot.label}</p>
                <p className="text-[10px] text-[#8a8680] mt-0.5">{slot.time}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Confirm Action */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleAdd}
            className="w-full bg-[#1f4a35] text-white rounded-xl py-3.5 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer shadow-md flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Add to Day {selectedDay}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
