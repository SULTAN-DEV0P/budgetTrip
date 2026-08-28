import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Bed,
  Sun,
  Sunset,
  Moon,
  Plus,
  Trash2,
  Edit3,
  DollarSign,
  RefreshCw,
  Share2,
  Check,
  Navigation,
} from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { calculateTripBudget } from '../../services/budgetService';

function generateSlotId() {
  return 'slot-' + Date.now().toString(36) + '-' + Math.floor(Math.random() * 1000).toString(36);
}

export function ItineraryScreen({
  setScreen,
  trip,
  onUpdateTrip,
  placesCatalog,
  onOpenPlaceDetail,
  onOpenOptimizer,
}) {
  const [activeDayNumber, setActiveDayNumber] = useState(1);
  const [isChangingStay, setIsChangingStay] = useState(false);
  const [isAddingPlace, setIsAddingPlace] = useState(false);
  const [addPlaceTimeOfDay, setAddPlaceTimeOfDay] = useState('morning');
  const [editingCostSlotId, setEditingCostSlotId] = useState(null);
  const [customCostInput, setCustomCostInput] = useState('');
  const [editingNotesSlotId, setEditingNotesSlotId] = useState(null);
  const [notesInput, setNotesInput] = useState('');

  if (!trip || !trip.destinationId) {
    return (
      <div className="flex flex-col min-h-full bg-[#f8f7f4] p-6 pt-20 pb-28 items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center shadow-xs">
          <Calendar size={32} />
        </div>
        <div className="space-y-1 max-w-xs">
          <h2 className="text-xl font-800 text-[#111110]">No Active Trip Yet</h2>
          <p className="text-xs text-[#8a8680] font-500 leading-relaxed">
            Create your personalized itinerary with budget limits, places to stay, and curated activities.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setScreen && setScreen('setup')}
          className="px-6 py-3.5 bg-[#1f4a35] hover:bg-[#163526] text-white rounded-2xl font-800 text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 active:scale-95"
        >
          <Plus size={16} />
          <span>Create New Trip</span>
        </button>
      </div>
    );
  }

  const numDays = trip.totalDays || 1;
  const travelers = trip.travelers || 1;
  const nights = Math.max(1, numDays - 1);
  const cur = trip.currency || 'USD';

  const breakdown = calculateTripBudget(trip);
  const activeDay = trip.days?.find((d) => d.dayNumber === activeDayNumber) || trip.days?.[0] || { dayNumber: 1, slots: [] };

  const availableHotels = placesCatalog.filter((p) => p.type === 'hotel');

  const handleSelectHotel = (hotel) => {
    onUpdateTrip({
      ...trip,
      selectedHotel: hotel,
    });
    setIsChangingStay(false);
  };

  const handleRemoveSlot = (slotId) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== activeDayNumber) return day;
      return {
        ...day,
        slots: day.slots.filter((s) => s.slotId !== slotId),
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleSaveCustomCost = (slotId) => {
    const parsed = customCostInput.trim() === '' ? undefined : Number(customCostInput);
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== activeDayNumber) return day;
      return {
        ...day,
        slots: day.slots.map((s) => (s.slotId === slotId ? { ...s, customCost: parsed } : s)),
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
    setEditingCostSlotId(null);
  };

  const handleSaveNotes = (slotId) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== activeDayNumber) return day;
      return {
        ...day,
        slots: day.slots.map((s) => (s.slotId === slotId ? { ...s, notes: notesInput } : s)),
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
    setEditingNotesSlotId(null);
  };

  const _handleMoveSlotTime = (slotId, newTime) => {
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== activeDayNumber) return day;
      return {
        ...day,
        slots: day.slots.map((s) => (s.slotId === slotId ? { ...s, timeOfDay: newTime } : s)),
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  const handleAddPlaceToSlot = (place) => {
    const newSlot = {
      slotId: generateSlotId(),
      timeOfDay: addPlaceTimeOfDay,
      place,
      notes: '',
    };
    const updatedDays = trip.days.map((day) => {
      if (day.dayNumber !== activeDayNumber) return day;
      return {
        ...day,
        slots: [...day.slots, newSlot],
      };
    });
    onUpdateTrip({ ...trip, days: updatedDays });
    setIsAddingPlace(false);
  };

  const timeSections = [
    { id: 'morning', label: 'Morning (8:00 AM – 12:00 PM)', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'afternoon', label: 'Afternoon (12:00 PM – 5:00 PM)', icon: Sunset, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'evening', label: 'Evening & Night (5:00 PM – Late)', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed] p-5 pt-12 pb-28 space-y-5">
      {/* Header Banner */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-700 uppercase tracking-wider bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-0.5 rounded-full">
              Trip Itinerary
            </span>
            <span className="text-xs text-[#8a8680] font-600">{trip.country}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-800 text-[#111110] tracking-tight">
            {trip.destinationName}
          </h1>
          <p className="text-xs text-[#8a8680] font-500 mt-1 flex items-center gap-1.5">
            <Calendar size={13} className="text-[#1f4a35]" />
            <span>
              {trip.startDate} → {trip.endDate} ({numDays} Days, {travelers} {travelers === 1 ? 'Guest' : 'Guests'})
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setScreen && setScreen('setup')}
            className="px-3 py-2 bg-white border border-[#e4e1db] hover:border-[#1f4a35] text-[#111110] rounded-xl text-xs font-700 transition-all shadow-2xs cursor-pointer flex items-center gap-1 active:scale-95"
            title="Create a new trip"
          >
            <Plus size={13} className="text-[#1f4a35]" />
            <span>New Trip</span>
          </button>

          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(
                `Trip to ${trip.destinationName} (${numDays} Days) • Total Budget: ${formatCurrency(trip.totalBudget, cur)}`
              );
              alert('Itinerary summary copied to clipboard!');
            }}
            className="p-2.5 rounded-xl bg-white border border-[#e4e1db] text-[#111110] hover:border-[#1f4a35] transition-colors shadow-2xs cursor-pointer active:scale-95"
            title="Share Itinerary"
          >
            <Share2 size={16} />
          </button>
        </div>
      </div>

      {/* Over budget banner */}
      {breakdown.isOverBudget && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-2 shadow-2xs">
          <div className="text-xs">
            <span className="font-800 text-rose-700">Over Budget by {formatCurrency(breakdown.overAmount, cur)}!</span>
            <p className="text-[11px] text-rose-600 mt-0.5">Use the auto-optimizer to swap high-cost items.</p>
          </div>
          <button
            onClick={onOpenOptimizer}
            className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-700 hover:bg-rose-700 transition-colors shrink-0 cursor-pointer"
          >
            Fix Budget
          </button>
        </div>
      )}

      {/* Hotel Stay Card */}
      <div className="bg-white rounded-2xl border border-[#e4e1db] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#e4e1db] pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center">
              <Bed size={15} />
            </div>
            <span className="text-xs font-700 uppercase tracking-wider text-[#111110]">
              Accommodation ({nights} {nights === 1 ? 'Night' : 'Nights'})
            </span>
          </div>

          <button
            onClick={() => setIsChangingStay(true)}
            className="text-xs font-700 text-[#1f4a35] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw size={12} />
            <span>Change Stay</span>
          </button>
        </div>

        {trip.selectedHotel ? (
          <div className="flex items-center justify-between gap-3">
            <div
              onClick={() => onOpenPlaceDetail(trip.selectedHotel)}
              className="flex items-center gap-3 min-w-0 cursor-pointer group flex-1"
            >
              <img
                src={trip.selectedHotel.imageUrl}
                alt={trip.selectedHotel.name}
                className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <h4 className="font-800 text-sm text-[#111110] group-hover:text-[#1f4a35] truncate">
                  {trip.selectedHotel.name}
                </h4>
                <p className="text-[11px] text-[#8a8680] truncate mt-0.5 flex items-center gap-1">
                  <MapPin size={11} className="shrink-0 text-[#1f4a35]" />
                  <span>{trip.selectedHotel.location?.address || trip.selectedHotel.location?.neighborhood}</span>
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-amber-500 font-700 text-xs flex items-center gap-0.5">
                    ★ {trip.selectedHotel.rating?.toFixed(1) || '4.8'}
                  </span>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      trip.selectedHotel.name + ' ' + (trip.selectedHotel.location?.address || '')
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[10px] font-800 text-[#1f4a35] hover:underline bg-[#e8f0ec] px-2 py-0.5 rounded-md cursor-pointer"
                  >
                    <Navigation size={10} />
                    <span>Directions</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-800 text-[#1f4a35]">
                {formatCurrency(trip.selectedHotel.estimatedPrice * nights, cur)}
              </div>
              <span className="text-[10px] text-[#8a8680]">
                {formatCurrency(trip.selectedHotel.estimatedPrice, cur)} / night
              </span>
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#8a8680]">No hotel selected.</p>
        )}
      </div>

      {/* Day Switcher Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-700 uppercase tracking-wider text-[#8a8680]">
            Daily Schedule
          </span>
          <span className="text-xs font-700 text-[#1f4a35]">
            Day {activeDayNumber} of {numDays}
          </span>
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
          {trip.days?.map((day) => {
            const isDayActive = day.dayNumber === activeDayNumber;
            return (
              <button
                key={day.dayNumber}
                onClick={() => setActiveDayNumber(day.dayNumber)}
                className={`flex-1 min-w-[80px] py-2.5 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isDayActive
                    ? 'bg-[#1f4a35] text-white border-[#1f4a35] shadow-xs'
                    : 'bg-white text-[#111110] border-[#e4e1db] hover:border-[#8a8680]'
                }`}
              >
                <div className="text-[10px] font-700 uppercase tracking-wider opacity-80">Day {day.dayNumber}</div>
                <div className="text-xs font-800 mt-0.5">
                  {day.slots?.length || 0} {(day.slots?.length || 0) === 1 ? 'spot' : 'spots'}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Schedule Time Slots */}
      <div className="space-y-4">
        {timeSections.map((section) => {
          const slots = activeDay.slots?.filter((s) => s.timeOfDay === section.id) || [];
          const Icon = section.icon;

          return (
            <div key={section.id} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-md ${section.bg} ${section.color} flex items-center justify-center`}>
                    <Icon size={13} />
                  </div>
                  <span className="text-xs font-700 uppercase tracking-wider text-[#111110]">
                    {section.label}
                  </span>
                </div>

                <button
                  onClick={() => {
                    setAddPlaceTimeOfDay(section.id);
                    setIsAddingPlace(true);
                  }}
                  className="text-[11px] font-700 text-[#1f4a35] bg-[#e8f0ec] hover:bg-[#d8e6df] px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Plus size={12} />
                  <span>Add Spot</span>
                </button>
              </div>

              {slots.length === 0 ? (
                <div
                  onClick={() => {
                    setAddPlaceTimeOfDay(section.id);
                    setIsAddingPlace(true);
                  }}
                  className="border-2 border-dashed border-[#e4e1db] hover:border-[#1f4a35] rounded-xl p-3.5 text-center cursor-pointer transition-colors bg-white/40"
                >
                  <span className="text-xs text-[#8a8680] font-500">+ Schedule a spot or dining for {section.id}</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {slots.map((slot) => {
                    const place = slot.place;
                    if (!place) return null;

                    const standardCost = (place.estimatedPrice || 0) * travelers;
                    const activeCost = slot.customCost !== undefined ? slot.customCost : standardCost;

                    return (
                      <div
                        key={slot.slotId}
                        className="bg-white rounded-xl border border-[#e4e1db] p-3.5 shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            onClick={() => onOpenPlaceDetail(place)}
                            className="flex items-start gap-3 min-w-0 cursor-pointer flex-1 group"
                          >
                            <img
                              src={place.imageUrl}
                              alt={place.name}
                              className="w-14 h-14 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <span className="text-[10px] font-700 uppercase tracking-wider bg-[#f0ece6] text-[#111110] px-2 py-0.2 rounded-md">
                                  {place.category}
                                </span>
                              </div>
                              <h4 className="font-800 text-sm text-[#111110] group-hover:text-[#1f4a35] truncate">
                                {place.name}
                              </h4>
                              <p className="text-[11px] text-[#8a8680] truncate mt-0.5 flex items-center gap-1">
                                <MapPin size={11} className="shrink-0 text-[#1f4a35]" />
                                <span>{place.location?.address || place.location?.neighborhood}</span>
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <a
                                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                    place.name + ' ' + (place.location?.address || '')
                                  )}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center gap-1 text-[10px] font-800 text-[#1f4a35] hover:underline bg-[#e8f0ec] px-2 py-0.5 rounded-md cursor-pointer"
                                >
                                  <Navigation size={10} />
                                  <span>Directions</span>
                                </a>
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0 flex flex-col items-end justify-between">
                            <div className="text-xs font-800 text-[#111110]">
                              {activeCost === 0 ? 'Free' : formatCurrency(activeCost, cur)}
                            </div>
                            <span className="text-[10px] text-[#8a8680]">
                              {slot.customCost !== undefined ? 'Custom' : `Est. (${travelers} pax)`}
                            </span>

                            <div className="flex items-center gap-1 mt-2">
                              <button
                                onClick={() => {
                                  setEditingCostSlotId(editingCostSlotId === slot.slotId ? null : slot.slotId);
                                  setCustomCostInput(activeCost.toString());
                                }}
                                className="p-1 text-[#8a8680] hover:text-[#1f4a35] rounded-md hover:bg-[#f5f2ed] transition-colors cursor-pointer"
                                title="Edit Cost"
                              >
                                <DollarSign size={13} />
                              </button>

                              <button
                                onClick={() => {
                                  setEditingNotesSlotId(editingNotesSlotId === slot.slotId ? null : slot.slotId);
                                  setNotesInput(slot.notes || '');
                                }}
                                className="p-1 text-[#8a8680] hover:text-[#111110] rounded-md hover:bg-[#f5f2ed] transition-colors cursor-pointer"
                                title="Edit Notes"
                              >
                                <Edit3 size={13} />
                              </button>

                              <button
                                onClick={() => handleRemoveSlot(slot.slotId)}
                                className="p-1 text-[#8a8680] hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Remove Slot"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Inline Cost edit */}
                        {editingCostSlotId === slot.slotId && (
                          <div className="pt-2 border-t border-[#e4e1db] flex items-center gap-2 text-xs">
                            <span className="text-[#8a8680] font-600">Custom ({cur}):</span>
                            <input
                              type="number"
                              value={customCostInput}
                              onChange={(e) => setCustomCostInput(e.target.value)}
                              className="w-24 text-[16px] sm:text-xs font-700 px-2 py-1 border border-[#e4e1db] rounded-lg focus:outline-none focus:border-[#1f4a35]"
                            />
                            <button
                              onClick={() => handleSaveCustomCost(slot.slotId)}
                              className="px-2.5 py-1 bg-[#1f4a35] text-white rounded-lg text-xs font-700 cursor-pointer"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setCustomCostInput('');
                                handleSaveCustomCost(slot.slotId);
                              }}
                              className="text-[11px] text-[#8a8680] hover:underline cursor-pointer"
                            >
                              Reset
                            </button>
                          </div>
                        )}

                        {/* Inline Notes edit */}
                        {editingNotesSlotId === slot.slotId && (
                          <div className="pt-2 border-t border-[#e4e1db] space-y-1.5 text-xs">
                            <textarea
                              value={notesInput}
                              onChange={(e) => setNotesInput(e.target.value)}
                              placeholder="Booking notes, table reservation time..."
                              className="w-full text-xs p-2 rounded-lg border border-[#e4e1db] bg-white focus:outline-none focus:border-[#1f4a35]"
                              rows={2}
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingNotesSlotId(null)}
                                className="text-xs text-[#8a8680] cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveNotes(slot.slotId)}
                                className="px-3 py-1 bg-[#111110] text-white rounded-lg text-xs font-700 cursor-pointer"
                              >
                                Save Note
                              </button>
                            </div>
                          </div>
                        )}

                        {slot.notes && editingNotesSlotId !== slot.slotId && (
                          <div className="pt-1 text-[11px] text-[#8a8680] italic bg-[#fbf9f6] p-1.5 rounded-md">
                            "{slot.notes}"
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Select Hotel Modal */}
      {isChangingStay && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsChangingStay(false)} />
          <div className="relative w-full max-w-lg bg-[#f5f2ed] rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-[#e4e1db] bg-white flex items-center justify-between">
              <h3 className="font-800 text-base text-[#111110]">Choose Hotel in {trip.destinationName}</h3>
              <button onClick={() => setIsChangingStay(false)} className="text-[#8a8680] hover:text-[#111110]">
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5">
              {availableHotels.map((h) => (
                <div
                  key={h.id}
                  onClick={() => handleSelectHotel(h)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    trip.selectedHotel?.id === h.id
                      ? 'bg-[#e8f0ec] border-[#1f4a35] ring-1 ring-[#1f4a35]'
                      : 'bg-white border-[#e4e1db] hover:border-[#1f4a35]'
                  }`}
                >
                  <img src={h.imageUrl} alt={h.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h5 className="font-700 text-xs sm:text-sm text-[#111110] truncate">{h.name}</h5>
                    <p className="text-[11px] text-[#8a8680] truncate">{h.category}</p>
                    <span className="text-xs font-700 text-[#1f4a35]">
                      {formatCurrency(h.estimatedPrice * nights, cur)} ({formatCurrency(h.estimatedPrice, cur)}/night)
                    </span>
                  </div>
                  {trip.selectedHotel?.id === h.id && <Check size={16} className="text-[#1f4a35]" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Place to Schedule Modal */}
      {isAddingPlace && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setIsAddingPlace(false)} />
          <div className="relative w-full max-w-lg bg-[#f5f2ed] rounded-t-3xl sm:rounded-2xl border border-[#e4e1db] shadow-2xl z-10 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-[#e4e1db] bg-white flex items-center justify-between">
              <h3 className="font-800 text-base text-[#111110]">
                Add to Day {activeDayNumber} ({addPlaceTimeOfDay})
              </h3>
              <button onClick={() => setIsAddingPlace(false)} className="text-[#8a8680] hover:text-[#111110]">
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto space-y-2.5">
              {placesCatalog
                .filter((p) => p.type !== 'hotel')
                .map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleAddPlaceToSlot(p)}
                    className="p-3 rounded-xl border border-[#e4e1db] bg-white hover:border-[#1f4a35] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-2xs group"
                  >
                    <img src={p.imageUrl} alt={p.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-700 text-xs sm:text-sm text-[#111110] group-hover:text-[#1f4a35] truncate">
                        {p.name}
                      </h5>
                      <span className="text-[11px] text-[#8a8680] truncate">{p.category}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-800 text-[#1f4a35]">
                        {p.estimatedPrice === 0 ? 'Free' : formatCurrency(p.estimatedPrice * travelers, cur)}
                      </div>
                      <span className="text-[10px] text-[#8a8680]">Est. total</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
