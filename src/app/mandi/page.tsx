'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Search, 
  Filter,
  CheckCircle2,
  MapPin,
  ChevronRight,
  Plus
} from 'lucide-react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { useMandiPrices } from '@/hooks/useAgriData';
import { useState } from 'react';

const data = [
  { name: 'Mon', price: 2100 },
  { name: 'Tue', price: 2150 },
  { name: 'Wed', price: 2300 },
  { name: 'Thu', price: 2280 },
  { name: 'Fri', price: 2400 },
  { name: 'Sat', price: 2450 },
];

const MandiPage = () => {
  const { prices: buyerOffers, loading } = useMandiPrices();
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');

  // Fallback data for demo if DB is empty
  const demoOffers = [
    { name: 'ITC Agri-Business', location: 'Indore, MP', offer: '₹4,350', rating: '4.8' },
    { name: 'Reliance Retail', location: 'Bhopal, MP', offer: '₹4,280', rating: '4.6' },
  ];

  const finalOffers = buyerOffers.length > 0 ? buyerOffers : demoOffers;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-outfit text-emerald-900">Smart Mandi</h1>
        <button className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
           <Plus size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl">
         <button 
           onClick={() => setActiveTab('sell')} 
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'sell' ? 'bg-white shadow-sm text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}
         >
           Sell Produce
         </button>
         <button 
           onClick={() => setActiveTab('buy')} 
           className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'buy' ? 'bg-white shadow-sm text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}
         >
           Buy Produce
         </button>
      </div>

      {activeTab === 'sell' ? (
        <>
          {/* Price Chart Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-5"
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Market Price Trend</p>
            <h3 className="text-xl font-bold text-slate-800">Wheat (MP Quality)</h3>
          </div>
          <div className="flex items-center text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp size={14} className="mr-1" />
            +8.4%
          </div>
        </div>
        
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#10B981" 
                strokeWidth={3} 
                dot={false} 
              />
              <XAxis dataKey="name" hide />
              <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-between mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
           <span>Avg: ₹2280</span>
           <span>Today: ₹2450</span>
        </div>
      </motion.div>

      {/* Active Listing / Grade Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 border-l-4 border-l-amber-500"
      >
        <div className="flex justify-between items-center mb-3">
           <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">ACTIVE LISTING</span>
           <span className="text-[10px] text-slate-400">ID: AN-9482</span>
        </div>
        <div className="flex items-center space-x-4">
           <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center border border-slate-200">
              <ShoppingBag className="text-slate-400" size={24} />
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-slate-800">Soya Bean (Batch 04)</h4>
              <div className="flex items-center text-[10px] text-emerald-600 font-bold mt-1">
                 <CheckCircle2 size={12} className="mr-1" />
                 AI VERIFIED GRADE A
              </div>
           </div>
           <div className="text-right">
              <p className="text-sm font-bold text-slate-900">₹4,200</p>
              <p className="text-[10px] text-slate-500">per quintal</p>
           </div>
        </div>
      </motion.div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 glass-card px-4 py-3 flex items-center space-x-2">
           <Search size={18} className="text-slate-400" />
           <input 
             type="text" 
             placeholder="Search buyers..." 
             className="bg-transparent border-none outline-none text-sm w-full"
           />
        </div>
        <button className="glass-card p-3 text-slate-600">
           <Filter size={20} />
        </button>
      </div>

      {/* Buyer Offers */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Best Buyer Offers</h4>
        
        {finalOffers.map((buyer, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            className="glass-card p-4 group cursor-pointer hover:bg-emerald-50 transition-all border border-transparent hover:border-emerald-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-emerald-900 font-bold">
                  {buyer.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-sm">{buyer.name}</h5>
                  <div className="flex items-center text-[10px] text-slate-400 mt-0.5">
                    <MapPin size={10} className="mr-1" />
                    {buyer.location || 'Local Mandi'} • ⭐ {buyer.rating || '5.0'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-700">{buyer.offer || `₹${buyer.price}`}</p>
                <ChevronRight className="inline-block text-slate-300 group-hover:text-emerald-500 transition-colors" size={16} />
              </div>
            </div>
          </motion.div>
        ))}
        {loading && <p className="text-center text-xs text-slate-400 animate-pulse">Syncing with Live Mandi...</p>}
      </div>
        </>
      ) : (
        <div className="space-y-4">
           <div className="glass-card p-6 border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white text-center">
             <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="text-emerald-600" size={32} />
             </div>
             <h3 className="font-bold text-emerald-900 mb-2">Looking to Buy?</h3>
             <p className="text-sm text-slate-500 mb-4">Post your requirements and let farmers contact you directly with their best quotes.</p>
             <button className="w-full btn-primary py-3">Create Buying Request</button>
           </div>
           
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1 mt-6">Recent Farmer Listings</h4>
           {[
             { crop: 'Organic Wheat (Sharbati)', qty: '50 Quintal', price: '₹4,200/Q', farmer: 'Aayush S.' },
             { crop: 'Soybean (Grade A)', qty: '20 Quintal', price: '₹5,100/Q', farmer: 'Vikram K.' }
           ].map((listing, i) => (
             <div key={i} className="glass-card p-4 flex justify-between items-center">
               <div>
                 <h4 className="font-bold text-slate-800 text-sm">{listing.crop}</h4>
                 <p className="text-xs text-slate-500">Qty: {listing.qty} • By {listing.farmer}</p>
               </div>
               <div className="text-right">
                 <p className="text-sm font-bold text-emerald-700">{listing.price}</p>
                 <button className="text-[10px] font-bold text-white bg-emerald-600 px-3 py-1 rounded-lg mt-1 hover:bg-emerald-700">Contact</button>
               </div>
             </div>
           ))}
        </div>
      )}
    </div>
  );
};

export default MandiPage;
