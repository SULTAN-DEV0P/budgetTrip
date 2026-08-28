import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Plug,
  FileCheck2,
  Languages,
  Clock,
  SunMedium,
  Coins,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { fetchCountryEssentials, WORLD_DESTINATIONS } from '../../services/destinationService';

export function CountryEssentialsCard({ destination }) {
  const [essentials, setEssentials] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const activeDestMeta =
    WORLD_DESTINATIONS.find((d) => d.id === destination.destinationId) ||
    WORLD_DESTINATIONS.find((d) => d.country.toLowerCase() === (destination.country || '').toLowerCase()) ||
    WORLD_DESTINATIONS[0];

  useEffect(() => {
    let isMounted = true;
    const countryName = destination.country || activeDestMeta.country || 'Nigeria';

    setLoading(true);
    fetchCountryEssentials(countryName)
      .then((data) => {
        if (isMounted) {
          setEssentials(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination.country, activeDestMeta.country]);

  return (
    <div className="bg-white rounded-2xl border border-[#e4e1db] p-4 sm:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e4e1db] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center font-bold text-sm">
            {activeDestMeta.flag || '🌍'}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-800 text-sm sm:text-base text-[#111110]">
                {activeDestMeta.country} Travel Essentials
              </h3>
              <span className="text-[10px] font-700 bg-[#e8f0ec] text-[#1f4a35] px-2 py-0.5 rounded-full">
                Live Guide
              </span>
            </div>
            <p className="text-[11px] text-[#8a8680] font-500">
              Entry rules, power plugs & local customs for {activeDestMeta.city}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[#8a8680] hover:text-[#111110] p-1.5 rounded-lg hover:bg-[#f5f2ed] transition-colors cursor-pointer"
        >
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Grid of Key Essentials */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* Visa Requirements */}
        <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#e4e1db]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-700 text-[#1f4a35]">
            <FileCheck2 size={14} />
            <span>Visa & Entry</span>
          </div>
          <p className="text-[11px] text-[#111110] font-600 line-clamp-2" title={activeDestMeta.visaInfo}>
            {activeDestMeta.visaInfo}
          </p>
        </div>

        {/* Plug & Voltage */}
        <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#e4e1db]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-700 text-[#1f4a35]">
            <Plug size={14} />
            <span>Power Adapter</span>
          </div>
          <p className="text-[11px] text-[#111110] font-600 line-clamp-2" title={activeDestMeta.plugType}>
            {activeDestMeta.plugType}
          </p>
        </div>

        {/* Best Time to Visit */}
        <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#e4e1db]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-700 text-[#1f4a35]">
            <SunMedium size={14} />
            <span>Best Season</span>
          </div>
          <p className="text-[11px] text-[#111110] font-600 line-clamp-2" title={activeDestMeta.bestTimeToVisit}>
            {activeDestMeta.bestTimeToVisit}
          </p>
        </div>

        {/* Tipping & Etiquette */}
        <div className="p-3 rounded-xl bg-[#fbf9f6] border border-[#e4e1db]/80 space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] font-700 text-[#1f4a35]">
            <Coins size={14} />
            <span>Tipping Norms</span>
          </div>
          <p className="text-[11px] text-[#111110] font-600 line-clamp-2" title={activeDestMeta.tippingCustom}>
            {activeDestMeta.tippingCustom}
          </p>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="pt-2 space-y-2.5 border-t border-[#e4e1db] text-xs animate-fadeIn">
          <div className="flex items-center justify-between text-[#8a8680]">
            <span className="flex items-center gap-1.5">
              <Languages size={14} className="text-[#1f4a35]" />
              <span>Official Languages:</span>
            </span>
            <span className="font-700 text-[#111110]">
              {essentials?.languages?.join(', ') || activeDestMeta.language}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#8a8680]">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-[#1f4a35]" />
              <span>Timezone:</span>
            </span>
            <span className="font-700 text-[#111110]">
              {essentials?.timezones?.[0] || 'Local Time'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[#8a8680]">
            <span className="flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-rose-600" />
              <span>Emergency Helpline:</span>
            </span>
            <span className="font-800 text-rose-700">
              {activeDestMeta.emergencyNumber}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
