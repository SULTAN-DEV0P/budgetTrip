import React, { useState } from 'react';
import {
  BedDouble,
  Utensils,
  Compass,
  Navigation,
  Clock,
  Trash2,
  Plus,
  Share2,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';
import { ShareModal } from '../modals/ShareModal';
import { formatDateReadable } from '../../utils/date';

export function MyTripScreen({
  setScreen,
  currentTrip,
  onRemoveSlot,
  onReorderSlots,
}) {
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const destinationName = currentTrip?.destinationName || 'Lagos';
  const travelers = currentTrip?.travelers || 2;
  const totalBudget = currentTrip?.totalBudget || 150000;

  // Real estimated spending from breakdown
  const estimatedCost = currentTrip?.breakdown?.totalEstimated || 127500;
  const remaining = currentTrip?.breakdown?.remaining ?? (totalBudget - estimatedCost);

  const getItemIcon = (type) => {
    if (type === 'hotel') return BedDouble;
    if (type === 'restaurant') return Utensils;
    if (type === 'transport') return Navigation;
    return Compass;
  };

  const handleMoveUp = (dayNumber, index) => {
    if (index > 0 && onReorderSlots) {
      onReorderSlots(dayNumber, index, index - 1);
    }
  };

  const handleMoveDown = (dayNumber, index, totalSlots) => {
    if (index < totalSlots - 1 && onReorderSlots) {
      onReorderSlots(dayNumber, index, index + 1);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header & Spending Chips */}
      <div className="bg-white border-b border-[#e4e1db] px-5 pt-12 pb-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-800 text-[#111110]">My Trip</h1>
            <p className="text-xs text-[#8a8680] font-500 mt-0.5">
              {destinationName} · {formatDateReadable(currentTrip?.startDate)} – {formatDateReadable(currentTrip?.endDate)}
            </p>
          </div>

          <button
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e4e1db] bg-[#f5f2ed] hover:border-[#1f4a35] text-xs font-700 text-[#111110] transition-colors cursor-pointer"
          >
            <Share2 size={13} className="text-[#1f4a35]" />
            <span>Share</span>
          </button>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 bg-[#f5f2ed] rounded-xl p-3 border border-[#e4e1db]">
            <p className="text-xs text-[#8a8680] font-500">Estimated Spend</p>
            <p className="text-lg font-800 text-[#111110]">
              ₦{estimatedCost.toLocaleString()}
            </p>
          </div>
          <div className={`flex-1 rounded-xl p-3 border ${
            remaining < 0
              ? 'bg-[#fdf0eb] border-[#c24a1e]/20 text-[#c24a1e]'
              : 'bg-[#e8f0ec] border-[#1f4a35]/15 text-[#1f4a35]'
          }`}>
            <p className="text-xs font-500">
              {remaining < 0 ? 'Over Budget' : 'Remaining'}
            </p>
            <p className="text-lg font-800">
              ₦{Math.abs(remaining).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Itinerary Schedule Content */}
      <div className="flex-1 overflow-y-auto px-5 py-6 pb-28 space-y-6">
        {/* Selected Hotel Banner */}
        {currentTrip?.selectedHotel && (
          <div className="bg-white rounded-[16px] border border-[#e4e1db] p-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center">
                <BedDouble size={18} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1f4a35]">Hotel / Stay</span>
                <h4 className="font-700 text-sm text-[#111110]">{currentTrip.selectedHotel.name}</h4>
                <p className="text-xs text-[#8a8680]">₦{currentTrip.selectedHotel.estimatedPrice?.toLocaleString()} / night</p>
              </div>
            </div>
            <button
              onClick={() => setScreen('results')}
              className="text-xs font-700 text-[#1f4a35] hover:underline cursor-pointer"
            >
              Change
            </button>
          </div>
        )}

        {/* Days List */}
        {currentTrip?.days?.map((day) => (
          <div key={day.dayNumber} className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-700 text-[#8a8680] uppercase tracking-wider">
                Day {day.dayNumber} — {formatDateReadable(day.date)}
              </h2>
              <span className="text-xs font-700 text-[#111110]">
                Day Est: ₦{day.dailyEstimatedCost?.toLocaleString()}
              </span>
            </div>

            <div className="space-y-2">
              {day.slots.map((slot, index) => {
                const Icon = getItemIcon(slot.place.type);
                const cost = slot.cost || (slot.place.estimatedPrice * travelers);

                return (
                  <div
                    key={slot.slotId}
                    className="bg-white rounded-[14px] border border-[#e4e1db] p-3.5 flex items-center gap-2.5 shadow-sm hover:border-[#1f4a35]/30 transition-all"
                  >
                    {/* Reorder Arrows */}
                    <div className="flex flex-col gap-0.5 text-[#8a8680]">
                      <button
                        onClick={() => handleMoveUp(day.dayNumber, index)}
                        disabled={index === 0}
                        className="hover:text-[#111110] disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(day.dayNumber, index, day.slots.length)}
                        disabled={index === day.slots.length - 1}
                        className="hover:text-[#111110] disabled:opacity-20 cursor-pointer"
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* Icon Box */}
                    <div className="w-8 h-8 rounded-lg bg-[#f0ece6] flex items-center justify-center flex-shrink-0">
                      <Icon size={15} className="text-[#1f4a35]" />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <p className="font-600 text-sm text-[#111110] truncate">{slot.place.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <div className="flex items-center gap-1 text-[#8a8680]">
                          <Clock size={11} />
                          <span className="text-xs font-500">{slot.timeLabel || slot.timeOfDay}</span>
                        </div>
                        <span className="text-xs font-700 text-[#111110]">
                          ₦{cost?.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Delete Slot Button */}
                    <button
                      onClick={() => onRemoveSlot && onRemoveSlot(slot.slotId)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[#8a8680] hover:text-[#c24a1e] hover:bg-[#fdf0eb] transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => setScreen('results')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#e4e1db] text-[#1f4a35] font-700 text-xs hover:bg-white transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>Add Place to Day {day.dayNumber}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={currentTrip}
      />
    </div>
  );
}
