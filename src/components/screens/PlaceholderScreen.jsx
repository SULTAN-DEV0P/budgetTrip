import React from 'react';

export function PlaceholderScreen({ title, subtitle, icon: Icon }) {
  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed] items-center justify-center px-6 py-20 text-center">
      <div className="w-16 h-16 rounded-2xl bg-[#e8f0ec] text-[#1f4a35] flex items-center justify-center mb-4 shadow-sm">
        {Icon && <Icon size={28} />}
      </div>
      <h1 className="text-2xl font-800 text-[#111110] mb-1">{title}</h1>
      <p className="text-sm text-[#8a8680] font-500 max-w-xs mb-6">
        {subtitle || 'This component is reserved for your collaborator to connect and build.'}
      </p>
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f0ece6] text-[#8a8680] border border-[#e4e1db]">
        Collaborator Placeholder
      </div>
    </div>
  );
}
