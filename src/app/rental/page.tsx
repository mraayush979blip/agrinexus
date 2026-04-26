'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Search, 
  MapPin, 
  Star, 
  MessageCircle,
  Truck,
  Calendar,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useRentals } from '@/hooks/useAgriData';
import { useState } from 'react';

const RentalPage = () => {
  const { rentals: liveInventory, loading } = useRentals();
  const [activeTab, setActiveTab] = useState<'rent' | 'list'>('rent');

  const demoInventory = [
    { 
      name: 'John Deere 5050D', 
      type: 'Tractor', 
      price: '₹500/hr', 
      rating: 4.8, 
      owner: 'Rajesh K.',
      distance: '2.5 km away',
      img: 'https://images.unsplash.com/photo-1594411133547-49339e31d451?auto=format&fit=crop&q=80&w=400'
    },
    { 
      name: 'AgriSpray Drone V2', 
      type: 'Drone', 
      price: '₹1200/acre', 
      rating: 4.9, 
      owner: 'Digital Farm Svc.',
      distance: '5.1 km away',
      img: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const finalInventory = liveInventory.length > 0 ? liveInventory : demoInventory;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-xl transition-all">
            <ChevronLeft className="text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold font-outfit text-emerald-900">Equipment</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
         <button 
           onClick={() => setActiveTab('rent')} 
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'rent' ? 'bg-white shadow-sm text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}
         >
           Find Equipment
         </button>
         <button 
           onClick={() => setActiveTab('list')} 
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'list' ? 'bg-white shadow-sm text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}
         >
           List My Equipment
         </button>
      </div>

      {activeTab === 'rent' ? (
        <>
          {/* Search & Categories */}
      <div className="space-y-4">
        <div className="glass-card px-4 py-3 flex items-center space-x-2">
           <Search size={18} className="text-slate-400" />
           <input 
             type="text" 
             placeholder="Search tractor, drones..." 
             className="bg-transparent border-none outline-none text-sm w-full"
           />
        </div>

        <div className="flex space-x-3 overflow-x-auto pb-2">
           {['All', 'Tractors', 'Drones', 'Harvesters', 'Tillers'].map((cat, i) => (
             <button key={i} className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-emerald-900 text-white shadow-lg' : 'bg-white text-slate-500'}`}>
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        {finalInventory.map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative h-40 overflow-hidden">
               <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.name} />
               <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center space-x-1 shadow-sm">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  <span className="text-[10px] font-bold text-slate-800">{item.rating || '4.5'}</span>
               </div>
               <div className="absolute bottom-3 left-3 bg-emerald-900/80 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">{item.type}</span>
               </div>
            </div>
            
            <div className="p-4 space-y-3">
               <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-800">{item.name}</h3>
                    <div className="flex items-center text-[10px] text-slate-400 mt-1">
                       <MapPin size={10} className="mr-1" />
                       {item.distance || 'Near you'} • Owned by {item.owner}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-emerald-900">{item.price}</p>
                  </div>
               </div>

               <div className="flex gap-3">
                  <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all">
                    <Calendar size={14} />
                    <span>Check Availability</span>
                  </button>
                  <button className="flex-1 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 py-3 rounded-2xl text-xs font-bold flex items-center justify-center space-x-2 transition-all">
                    <MessageCircle size={14} />
                    <span>Chat on WhatsApp</span>
                  </button>
               </div>
            </div>
          </motion.div>
        ))}
        {loading && <p className="text-center text-xs text-slate-400 animate-pulse">Syncing equipment list...</p>}
      </div>
        </>
      ) : (
        <div className="space-y-4">
           <div className="glass-card p-6 border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-center">
             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-emerald-600" size={32} />
             </div>
             <h3 className="font-bold text-emerald-900 mb-2">Turn Idle Assets into Income</h3>
             <p className="text-sm text-slate-500 mb-4">List your tractor, drone, or harvester when you aren't using it and earn money.</p>
             <button className="w-full btn-primary py-3">List New Equipment</button>
           </div>

           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mt-6">My Active Listings</h4>
           <div className="glass-card p-8 text-center border-dashed border-2 border-slate-200">
              <p className="text-slate-500 text-sm">You haven't listed any equipment yet.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default RentalPage;
