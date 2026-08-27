import React, { useState } from 'react';
import { ArrowLeft, Bookmark, MapPin, Navigation } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { AddToDayModal } from '../modals/AddToDayModal';

export function PlaceDetailScreen({
  setScreen,
  item,
  isSaved = false,
  totalDays = 3,
  onToggleSave,
  onAddToTrip,
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const place = item || {
    id: 'lag-act-1',
    name: 'Nike Art Gallery',
    rating: 4.8,
    type: 'activity',
    location: { address: 'Lekki, Lagos', neighborhood: 'Lekki' },
    distanceKm: 2.8,
    estimatedPrice: 3000,
    priceUnit: 'ticket',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&h=600&fit=crop&auto=format',
    description: "A vibrant contemporary art space featuring over 25,000 works from Nigerian and African artists across 5 storeys. One of Lagos's most iconic cultural destinations.",
  };

  const handleConfirmAddToDay = (placeToAdd, dayNum, slotTime) => {
    if (onAddToTrip) {
      onAddToTrip(placeToAdd, dayNum, slotTime);
    }
    setScreen('mytrip');
  };

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Hero Photo with Floating Buttons */}
      <div className="relative h-72 bg-[#e8f0ec]">
        <img
          src={place.imageUrl}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setScreen('results')}
          className="absolute top-12 left-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <ArrowLeft size={18} className="text-[#111110]" />
        </button>
        <button
          onClick={() => {
            if (onToggleSave) onToggleSave(place);
          }}
          className="absolute top-12 right-5 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <Bookmark
            size={18}
            fill={isSaved ? '#1f4a35' : 'none'}
            className="text-[#1f4a35]"
          />
        </button>
      </div>

      {/* Place Details Body */}
      <div className="flex-1 p-5 pb-36 space-y-4">
        <div className="flex items-start justify-between mb-2">
          <h1 className="text-2xl font-800 text-[#111110] leading-tight flex-1 mr-3">
            {place.name}
          </h1>
          <RatingStars rating={place.rating} />
        </div>

        <div className="flex items-center gap-4 text-[#8a8680]">
          <div className="flex items-center gap-1">
            <MapPin size={13} />
            <span className="text-sm font-500">
              {place.location?.neighborhood || place.location?.address || 'Lagos'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Navigation size={13} />
            <span className="text-sm font-500">
              {place.distanceKm ? `${place.distanceKm} km away` : '2.8 km away'}
            </span>
          </div>
        </div>

        <div>
          <p className="text-2xl font-800 text-[#111110]">
            ₦{place.estimatedPrice?.toLocaleString()}
            <span className="text-sm font-500 text-[#8a8680]">
              {place.type === 'hotel' ? ' / night' : ' / person'}
            </span>
          </p>
        </div>

        <p className="text-sm text-[#8a8680] font-500 leading-relaxed">
          {place.description}
        </p>

        {/* Why this fits your budget highlight */}
        <div className="bg-[#e8f0ec] rounded-[16px] p-4 space-y-1.5 border border-[#1f4a35]/10">
          <p className="text-xs font-700 uppercase tracking-wider text-[#1f4a35]">
            Why this fits your budget
          </p>
          <p className="text-sm text-[#1f4a35] font-500 leading-relaxed">
            This option is affordable and leaves more of your travel budget available for dining and authentic local experiences.
          </p>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-5 bg-white border-t border-[#e4e1db] space-y-3 z-40">
        <div className="max-w-md mx-auto space-y-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full bg-[#1f4a35] text-white rounded-xl py-4 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer shadow-md"
          >
            Add to My Trip
          </button>
          <button
            onClick={() => {
              if (onToggleSave) onToggleSave(place);
            }}
            className="w-full bg-white border border-[#e4e1db] text-[#111110] rounded-xl py-3 font-600 text-sm hover:bg-[#f5f2ed] transition-colors cursor-pointer"
          >
            {isSaved ? 'Saved in Bookmarks' : 'Save Place'}
          </button>
        </div>
      </div>

      {/* Add to Day Modal */}
      <AddToDayModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        place={place}
        totalDays={totalDays}
        onConfirmAdd={handleConfirmAddToDay}
      />
    </div>
  );
}
