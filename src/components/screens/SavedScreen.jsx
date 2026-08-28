import React, { useState } from 'react';
import {
  Bookmark,
  CalendarPlus,
  Trash2,
  MapPin,
  Star,
  Check,
  Heart,
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';

export function SavedScreen({
  savedPlaces,
  onToggleSave,
  onOpenPlaceDetail,
  trip,
  onUpdateTrip,
  currency,
}) {
  const [filterType, setFilterType] = useState('all');
  const [placeToSlot, setPlaceToSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('morning');

  const cur = currency || trip.currency || 'USD';

  const filtered = savedPlaces.filter((place) => {
    if (filterType === 'all') return true;
    if (filterType === 'stays') return place.type === 'hotel';
    if (filterType === 'dining') return place.type === 'restaurant';
    if (filterType === 'activities') return place.type === 'activity';
    return true;
  });

  const handleConfirmSlotIn = () => {
    if (!placeToSlot) return;

    if (placeToSlot.type === 'hotel') {
      onUpdateTrip({
        ...trip,
        selectedHotel: placeToSlot,
      });
    } else {
      const newSlot = {
        slotId: `slot-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        timeOfDay: selectedTimeOfDay,
        place: placeToSlot,
        notes: '',
      };
      const updatedDays = trip.days.map((day) => {
        if (day.dayNumber !== selectedDay) return day;
        return {
          ...day,
          slots: [...(day.slots || []), newSlot],
        };
      });
      onUpdateTrip({ ...trip, days: updatedDays });
    }

    setPlaceToSlot(null);
  };

  const tabs = [
    { id: 'all', label: 'All', count: savedPlaces.length },
    { id: 'stays', label: 'Stays', count: savedPlaces.filter((p) => p.type === 'hotel').length },
    { id: 'dining', label: 'Dining', count: savedPlaces.filter((p) => p.type === 'restaurant').length },
    { id: 'activities', label: 'Activities', count: savedPlaces.filter((p) => p.type === 'activity').length },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed] p-5 pt-12 pb-28 space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-700 uppercase tracking-wider bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-0.5 rounded-full">
              Wishlist & Bookmarks
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-800 text-[#111110] tracking-tight">
            Saved Places
          </h1>
          <p className="text-xs text-[#8a8680] font-500 mt-1">
            Bookmark interesting spots while exploring and slot them directly into your itinerary.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      {savedPlaces.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-700 whitespace-nowrap transition-all cursor-pointer ${
                filterType === tab.id
                  ? 'bg-[#1f4a35] text-white shadow-xs'
                  : 'bg-white text-[#8a8680] border border-[#e4e1db] hover:border-[#8a8680]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${filterType === tab.id ? 'bg-white/20 text-white' : 'bg-[#f0ece6] text-[#111110]'}`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Places List */}
      {filtered.length > 0 ? (
        <div className="space-y-2.5">
          {filtered.map((place) => (
            <div
              key={place.id}
              className="bg-white rounded-2xl border border-[#e4e1db] p-3.5 shadow-2xs flex items-center justify-between gap-3 group"
            >
              <div
                onClick={() => onOpenPlaceDetail(place)}
                className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
              >
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-700 uppercase tracking-wider bg-[#f0ece6] text-[#111110] px-2 py-0.2 rounded-md">
                      {place.category}
                    </span>
                    <span className="text-amber-500 text-xs font-700 flex items-center gap-0.5">
                      ★ {place.rating?.toFixed(1)}
                    </span>
                  </div>

                  <h4 className="font-700 text-sm text-[#111110] group-hover:text-[#1f4a35] truncate">
                    {place.name}
                  </h4>
                  <p className="text-[11px] text-[#8a8680] truncate mt-0.5">{place.location?.neighborhood}</p>
                  <div className="text-xs font-800 text-[#1f4a35] mt-1">
                    {place.estimatedPrice === 0 ? 'Free' : formatCurrency(place.estimatedPrice, cur)}
                    <span className="text-[10px] text-[#8a8680] font-500"> / {place.priceUnit}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => setPlaceToSlot(place)}
                  className="px-2.5 py-1.5 bg-[#1f4a35] text-white rounded-xl text-xs font-700 hover:bg-[#183a2a] transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Add to Itinerary"
                >
                  <CalendarPlus size={13} />
                  <span className="hidden sm:inline">Add</span>
                </button>

                <button
                  onClick={() => onToggleSave(place)}
                  className="p-2 rounded-xl text-[#8a8680] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remove from saved"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-12 px-4 text-center rounded-2xl bg-white border border-[#e4e1db] shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center mx-auto">
            <Bookmark size={22} />
          </div>
          <h3 className="font-800 text-base text-[#111110]">No Saved Places Yet</h3>
          <p className="text-xs text-[#8a8680] max-w-xs mx-auto">
            Explore world destinations and bookmark hotels, dining spots, and cultural sights to plan here.
          </p>
        </div>
      )}

      {/* Quick Slotting Modal */}
      {placeToSlot && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setPlaceToSlot(null)} />
          <div className="relative w-full max-w-md bg-[#f5f2ed] rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-800 text-base text-[#111110]">Add to Trip Itinerary</h3>
              <button onClick={() => setPlaceToSlot(null)} className="text-[#8a8680] hover:text-[#111110]">
                ✕
              </button>
            </div>

            <div className="p-3 bg-white rounded-xl border border-[#e4e1db] flex items-center gap-3">
              <img src={placeToSlot.imageUrl} alt={placeToSlot.name} className="w-12 h-12 rounded-lg object-cover" />
              <div className="min-w-0">
                <h5 className="font-700 text-xs text-[#111110] truncate">{placeToSlot.name}</h5>
                <p className="text-[10px] text-[#8a8680]">{placeToSlot.category}</p>
              </div>
            </div>

            {placeToSlot.type === 'hotel' ? (
              <p className="text-xs text-[#1f4a35] bg-[#e8f0ec] p-2.5 rounded-xl font-600">
                This is a hotel. Adding it will set it as your primary accommodation for the entire trip.
              </p>
            ) : (
              <>
                <div>
                  <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] block mb-1.5">
                    Select Day
                  </label>
                  <div className="flex gap-1.5">
                    {trip.days?.map((d) => (
                      <button
                        key={d.dayNumber}
                        onClick={() => setSelectedDay(d.dayNumber)}
                        className={`flex-1 py-2 rounded-lg text-xs font-700 border transition-all ${
                          selectedDay === d.dayNumber
                            ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                            : 'bg-white text-[#111110] border-[#e4e1db]'
                        }`}
                      >
                        Day {d.dayNumber}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-700 uppercase tracking-wider text-[#8a8680] block mb-1.5">
                    Time of Day
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['morning', 'afternoon', 'evening'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setSelectedTimeOfDay(t)}
                        className={`py-2 rounded-lg text-xs font-700 capitalize border transition-all ${
                          selectedTimeOfDay === t
                            ? 'bg-[#1f4a35] text-white border-[#1f4a35]'
                            : 'bg-white text-[#111110] border-[#e4e1db]'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPlaceToSlot(null)}
                className="px-3 py-2 text-xs font-700 text-[#8a8680] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSlotIn}
                className="px-4 py-2 bg-[#1f4a35] text-white rounded-xl text-xs font-700 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Check size={14} />
                <span>Confirm & Slot In</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
