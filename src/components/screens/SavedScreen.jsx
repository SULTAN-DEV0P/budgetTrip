import React, { useState } from 'react';
import { Bookmark, Plus } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { AddToDayModal } from '../modals/AddToDayModal';

export function SavedScreen({
  setScreen,
  setDetailItem,
  savedPlaces = [],
  totalDays = 3,
  onToggleSave,
  onAddToTrip,
}) {
  const [activeTab, setActiveTab] = useState('all');
  const [placeToAddToDay, setPlaceToAddToDay] = useState(null);

  const defaultSaved = [
    {
      id: 'lag-hotel-1',
      name: 'Nordic Hotel Lagos',
      rating: 4.7,
      category: 'Boutique Hotel',
      type: 'hotel',
      estimatedPrice: 75000,
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop&auto=format',
      location: { neighborhood: 'Victoria Island', address: 'Victoria Island, Lagos' },
      description: 'Scandinavian-designed boutique luxury in Victoria Island with an exquisite pool and gourmet dining.',
    },
    {
      id: 'lag-rest-1',
      name: 'Shiro Restaurant & Bar',
      rating: 4.7,
      category: 'Pan-Asian',
      type: 'restaurant',
      estimatedPrice: 18000,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=400&fit=crop&auto=format',
      location: { neighborhood: 'Oniru', address: 'Oniru Estate, Lagos' },
      description: 'Striking high-ceiling Asian eatery overlooking the Atlantic with exquisite sushi and cocktails.',
    },
    {
      id: 'lag-act-1',
      name: 'Nike Art Gallery',
      rating: 4.8,
      category: 'Art & Culture',
      type: 'activity',
      estimatedPrice: 3000,
      imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&h=400&fit=crop&auto=format',
      location: { neighborhood: 'Lekki', address: 'Lekki Phase 1, Lagos' },
      description: 'West Africa’s largest art gallery showcasing over 25,000 African contemporary paintings and sculptures.',
    },
  ];

  const items = savedPlaces.length > 0 ? savedPlaces : defaultSaved;

  const filteredItems = activeTab === 'all'
    ? items
    : items.filter((p) => {
        const cat = p.type === 'hotel' ? 'stay' : p.type === 'restaurant' ? 'eat' : 'do';
        return cat === activeTab;
      });

  const handleCardClick = (place) => {
    if (setDetailItem) {
      setDetailItem(place);
      setScreen('detail');
    }
  };

  const handleConfirmAddToDay = (place, dayNum, slotTime) => {
    if (onAddToTrip) {
      onAddToTrip(place, dayNum, slotTime);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header & Tabs */}
      <div className="bg-white border-b border-[#e4e1db] px-5 pt-12 pb-4">
        <h1 className="text-xl font-800 text-[#111110]">Saved Places</h1>

        <div className="flex gap-5 mt-4">
          {[
            { id: 'all', label: 'All' },
            { id: 'stay', label: 'Stay' },
            { id: 'eat', label: 'Eat' },
            { id: 'do', label: 'Things To Do' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-sm font-700 pb-1.5 border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#1f4a35] text-[#1f4a35]'
                  : 'border-transparent text-[#8a8680] hover:text-[#111110]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Places List */}
      <div className="flex-1 overflow-y-auto px-5 py-5 pb-28">
        {filteredItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#e8f0ec] flex items-center justify-center mb-4">
              <Bookmark size={24} className="text-[#1f4a35]" />
            </div>
            <h3 className="font-700 text-[#111110] mb-2">Nothing saved yet</h3>
            <p className="text-sm text-[#8a8680] font-500 max-w-xs mb-6">
              Save places while exploring and they'll appear here.
            </p>
            <button
              onClick={() => setScreen('results')}
              className="bg-[#1f4a35] text-white rounded-xl px-6 py-3 font-700 text-sm active:opacity-90 transition-opacity cursor-pointer"
            >
              Explore places
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleCardClick(item)}
                className="bg-white rounded-[16px] border border-[#e4e1db] overflow-hidden flex shadow-sm hover:border-[#1f4a35]/40 transition-all cursor-pointer"
              >
                <div className="w-24 flex-shrink-0 bg-[#e8f0ec]">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h3 className="font-700 text-sm text-[#111110] leading-snug">{item.name}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onToggleSave) onToggleSave(item);
                        }}
                        className="cursor-pointer"
                      >
                        <Bookmark size={14} fill="#1f4a35" className="text-[#1f4a35]" />
                      </button>
                    </div>
                    <div className="mt-1">
                      <RatingStars rating={item.rating} />
                    </div>
                  </div>

                  <div className="flex items-end justify-between pt-1">
                    <p className="text-xs font-700 text-[#111110]">
                      ₦{item.estimatedPrice?.toLocaleString()}
                      <span className="text-[10px] font-500 text-[#8a8680]">
                        {item.type === 'hotel' ? ' / night' : ' / person'}
                      </span>
                    </p>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setPlaceToAddToDay(item);
                      }}
                      className="bg-[#1f4a35] text-white rounded-lg px-2.5 py-1 text-xs font-700 flex items-center gap-1 cursor-pointer active:opacity-90"
                    >
                      <Plus size={12} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add to Day Modal */}
      <AddToDayModal
        isOpen={!!placeToAddToDay}
        onClose={() => setPlaceToAddToDay(null)}
        place={placeToAddToDay}
        totalDays={totalDays}
        onConfirmAdd={handleConfirmAddToDay}
      />
    </div>
  );
}
