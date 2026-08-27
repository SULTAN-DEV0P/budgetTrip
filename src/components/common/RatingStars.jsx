import React from 'react';
import { Star } from 'lucide-react';

export function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            className={star <= Math.round(rating) ? 'fill-[#1f4a35] text-[#1f4a35]' : 'fill-[#e4e1db] text-[#e4e1db]'}
          />
        ))}
      </div>
      <span className="text-xs font-700 text-[#111110] ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}
