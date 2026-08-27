import React from 'react';
import { MapPin, Check } from 'lucide-react';
import { DESTINATIONS_DATA } from '../../data/mockDestinations';

export function DestinationSelector({ selectedDestinationId, onSelect }) {
  const destinations = Object.values(DESTINATIONS_DATA);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <MapPin className="w-4 h-4 text-amber-400" />
          <span>Select Destination</span>
        </label>
        <span className="text-xs text-slate-400">Nigeria MVP Coverage</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {destinations.map(dest => {
          const isSelected = selectedDestinationId === dest.id;

          return (
            <div
              key={dest.id}
              onClick={() => onSelect(dest.id)}
              className={`group relative rounded-2xl border transition-all duration-200 overflow-hidden cursor-pointer ${
                isSelected
                  ? 'border-amber-400 bg-slate-900 ring-2 ring-amber-400/40 shadow-lg shadow-amber-950/20'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Image Banner */}
              <div className="relative h-28 w-full overflow-hidden bg-slate-950">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-md animate-in zoom-in-75 duration-150">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Destination Name on Image */}
                <div className="absolute bottom-2 left-3 right-3">
                  <h4 className="font-bold text-base text-white tracking-tight leading-tight">
                    {dest.name}
                  </h4>
                  <p className="text-[11px] text-amber-300 font-medium">
                    {dest.state}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 space-y-2">
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {dest.tagLine}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {dest.popularTags.slice(0, 3).map(tag => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/50"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
