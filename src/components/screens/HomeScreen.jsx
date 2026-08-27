import { Compass, Sparkles, ArrowRight } from 'lucide-react';

const DESTINATIONS = [
  {
    id: 'lagos',
    name: 'Lagos',
    state: 'Lagos State',
    price: 'From ₦35,000/day',
    img: 'https://images.unsplash.com/photo-1618828665347-d870c38c95c7?w=400&h=300&fit=crop&auto=format',
    tag: 'Arts & Coast',
  },
  {
    id: 'abuja',
    name: 'Abuja',
    state: 'FCT',
    price: 'From ₦30,000/day',
    img: 'https://images.unsplash.com/photo-1537372023620-37161b1ad8ac?w=400&h=300&fit=crop&auto=format',
    tag: 'Parks & Monoliths',
  },
  {
    id: 'abeokuta',
    name: 'Abeokuta',
    state: 'Ogun State',
    price: 'From ₦20,000/day',
    img: 'https://images.unsplash.com/photo-1569706971306-de5d78f6418e?w=400&h=300&fit=crop&auto=format',
    tag: 'Rock & Heritage',
  },
];

export function HomeScreen({ setScreen, setSelectedDestination }) {
  const handleSelectDestination = (destId) => {
    if (setSelectedDestination) {
      setSelectedDestination(destId);
    }
    setScreen('setup');
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f5f2ed]">
      {/* Top Header */}
      <div className="px-5 pt-12 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1f4a35] flex items-center justify-center text-white">
            <Compass size={18} />
          </div>
          <span className="font-800 text-lg text-[#111110] tracking-tight">BudgetTrip</span>
        </div>
        <span className="text-[11px] font-700 bg-[#e8f0ec] text-[#1f4a35] px-2.5 py-1 rounded-full">
          Nigeria MVP
        </span>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-5 pb-28 space-y-6">
        {/* Tag Pill */}
        <div className="inline-flex items-center gap-1.5 bg-[#e8f0ec] rounded-full px-3 py-1 text-xs font-700 text-[#1f4a35]">
          <Sparkles size={13} />
          <span>Budget-first travel planning</span>
        </div>

        {/* Hero Title */}
        <div>
          <h1 className="text-3xl font-800 text-[#111110] leading-tight tracking-tight">
            Plan your trip without guessing the cost.
          </h1>
          <p className="text-sm text-[#8a8680] font-500 mt-2 leading-relaxed">
            Discover hotels, food, and things to do in Nigeria that fit your exact budget.
          </p>
        </div>

        {/* Hero Image Card */}
        <div className="relative rounded-2xl overflow-hidden h-52 bg-[#e8f0ec] shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1618828665011-0abd973f7bb8?w=800&h=600&fit=crop&auto=format"
            alt="Lagos Coastline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
            <div className="text-white">
              <span className="text-[11px] font-700 uppercase tracking-wider text-white/80">Featured Experience</span>
              <p className="font-700 text-sm">Explore West Africa on your own terms</p>
            </div>
          </div>
        </div>

        {/* Destination Picker Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-700 text-[#111110] uppercase tracking-wider">
              Where do you want to go?
            </h2>
          </div>

          <div className="space-y-3">
            {DESTINATIONS.map((dest) => (
              <div
                key={dest.id}
                onClick={() => handleSelectDestination(dest.id)}
                className="bg-white rounded-[16px] border border-[#e4e1db] p-3.5 flex items-center gap-3.5 hover:border-[#1f4a35] transition-all cursor-pointer shadow-sm group"
              >
                <img
                  src={dest.img}
                  alt={dest.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-700 text-[#111110] text-base group-hover:text-[#1f4a35] transition-colors">
                      {dest.name}
                    </h3>
                    <span className="text-[11px] font-600 px-2 py-0.5 rounded-full bg-[#f0ece6] text-[#8a8680]">
                      {dest.tag}
                    </span>
                  </div>
                  <p className="text-xs text-[#8a8680] font-500 mt-0.5">{dest.state}</p>
                  <p className="text-xs font-700 text-[#1f4a35] mt-1">{dest.price}</p>
                </div>
                <ArrowRight size={16} className="text-[#8a8680] group-hover:text-[#1f4a35] group-hover:translate-x-0.5 transition-all" />
              </div>
            ))}
          </div>
        </div>

        {/* Start Planning Primary CTA */}
        <div className="pt-2">
          <button
            onClick={() => setScreen('setup')}
            className="w-full bg-[#1f4a35] text-white rounded-xl py-4 font-700 text-sm shadow-md active:opacity-90 transition-opacity cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Start Planning</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
