'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  Search, 
  Filter,
  CheckCircle2,
  MapPin,
  ChevronRight,
  ArrowRight,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Calendar,
  Phone,
  MessageSquare,
  Zap,
  Info,
  Clock,
  LayoutGrid,
  List as ListIcon,
  Tag
} from 'lucide-react';
import dynamic from 'next/dynamic';
const AreaChart = dynamic(() => import('recharts').then(mod => mod.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(mod => mod.Area), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getMarketAdvice } from '@/lib/gemini';

// Mock Data for Price Trends
const priceHistory = [
  { name: 'Mon', wheat: 2100, soy: 4800, corn: 1900 },
  { name: 'Tue', wheat: 2150, soy: 4950, corn: 1850 },
  { name: 'Wed', wheat: 2300, soy: 5100, corn: 1950 },
  { name: 'Thu', wheat: 2280, soy: 5000, corn: 2100 },
  { name: 'Fri', wheat: 2400, soy: 5200, corn: 2050 },
  { name: 'Sat', wheat: 2450, soy: 5350, corn: 2150 },
  { name: 'Sun', wheat: 2500, soy: 5300, corn: 2200 },
];

const tickerData = [
  { crop: 'Wheat', price: '₹2,450', change: '+2.4%', up: true },
  { crop: 'Soybean', price: '₹5,300', change: '-1.1%', up: false },
  { crop: 'Corn', price: '₹2,200', change: '+5.7%', up: true },
  { crop: 'Rice', price: '₹3,850', change: '+0.8%', up: true },
  { crop: 'Cotton', price: '₹6,100', change: '-2.3%', up: false },
];

const listings = [
  { 
    id: 'LIST-101', 
    crop: 'Premium Sharbati Wheat', 
    qty: '120 Quintals', 
    price: 2450, 
    farmer: 'Vikram Singh', 
    location: 'Hoshangabad, MP', 
    grade: 'A+', 
    moisture: '11.2%',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'LIST-102', 
    crop: 'Organic Yellow Soybean', 
    qty: '45 Quintals', 
    price: 5200, 
    farmer: 'Rajesh Kumar', 
    location: 'Dewas, MP', 
    grade: 'A', 
    moisture: '10.5%',
    image: 'https://images.unsplash.com/photo-1599549338274-569d6596b46f?auto=format&fit=crop&q=80&w=800'
  },
  { 
    id: 'LIST-103', 
    crop: 'Desi Chana (Chickpeas)', 
    qty: '80 Quintals', 
    price: 4900, 
    farmer: 'Amit Patel', 
    location: 'Vidisha, MP', 
    grade: 'B+', 
    moisture: '12.0%',
    image: 'https://images.unsplash.com/photo-1515544867663-1509a250320a?auto=format&fit=crop&q=80&w=800'
  }
];

const MandiPage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sell' | 'buy'>('sell');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Form State
  const [form, setForm] = useState({
    crop: 'Wheat (MP Sharbati)',
    quantity: '',
    price: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real Data State
  const [allListings, setAllListings] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [marketAdvice, setMarketAdvice] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('Wheat');

  useEffect(() => {
    if (!authLoading && (!user || !profile)) {
      router.push('/login');
    }
  }, [user, profile, authLoading, router]);

  // Real-time Listings Listener
  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[];
      setAllListings(docs);
      
      if (user) {
        setMyListings(docs.filter(d => d.userId === user.uid));
      }
    });

    return () => unsubscribe();
  }, [db, user]);

  const handlePublish = async () => {
    if (!db || !user || !profile) return;
    if (!form.quantity || !form.price) {
      alert("Please fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'listings'), {
        userId: user.uid,
        farmer: profile.name,
        location: profile.state || 'India',
        crop: form.crop,
        qty: `${form.quantity} Quintals`,
        price: parseInt(form.price),
        grade: 'A+',
        moisture: '11.2%',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=800',
        createdAt: serverTimestamp()
      });
      setShowPostModal(false);
      setForm({ ...form, quantity: '', price: '' });
    } catch (error) {
      console.error("Failed to publish:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetAdvice = async () => {
    setIsAnalyzing(true);
    try {
      const advice = await getMarketAdvice(selectedCrop, priceHistory);
      setMarketAdvice(advice);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (authLoading) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-40">
      
      {/* 1. Market Ticker */}
      <div className="relative -mx-4 md:-mx-8 lg:-mx-16 overflow-hidden bg-slate-900 py-4">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-12 px-4"
        >
          {[...tickerData, ...tickerData].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-slate-400 font-black text-[10px] uppercase tracking-widest">{item.crop}</span>
              <span className="text-white font-bold text-sm">{item.price}</span>
              <span className={`text-[10px] font-bold flex items-center ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.up ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                {item.change}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* 2. Header & Tab Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100">
            <Zap size={12} fill="currentColor" />
            Live Marketplace
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-outfit text-slate-900 tracking-tight">Smart Mandi</h1>
          <p className="text-slate-500 font-medium max-w-md">Connect directly with buyers and sellers on India's ONDC network.</p>
        </div>

        <div className="flex bg-white p-1.5 rounded-[2rem] shadow-xl border border-slate-100 w-full md:w-auto self-start">
           <button 
             onClick={() => setActiveTab('sell')}
             className={`px-8 py-4 rounded-[1.5rem] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'sell' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <Tag size={18} />
             FOR FARMERS
           </button>
           <button 
             onClick={() => setActiveTab('buy')}
             className={`px-8 py-4 rounded-[1.5rem] font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'buy' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
           >
             <ShoppingBag size={18} />
             MARKETPLACE
           </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'sell' ? (
          <motion.div 
            key="sell"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Sell View: Farmer Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Market Analytics */}
              <div className="lg:col-span-2 glass-card p-8 bg-white relative overflow-hidden border-none shadow-xl">
                 <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                       <h3 className="text-2xl font-black text-slate-800 font-outfit">Price Forecasting</h3>
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">AI-Powered Price Trend Analysis</p>
                    </div>
                    <div className="flex gap-2">
                       {['Wheat', 'Soy', 'Corn'].map(crop => (
                         <button 
                           key={crop} 
                           onClick={() => setSelectedCrop(crop)}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${selectedCrop === crop ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 border-slate-100'}`}
                         >
                           {crop}
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={priceHistory}>
                          <defs>
                             <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <Area type="monotone" dataKey="wheat" stroke="#10B981" strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                          <Tooltip 
                             contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                          />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#94a3b8' }} dy={10} />
                          <YAxis hide domain={['dataMin - 100', 'dataMax + 100']} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50">
                    <div className="text-center">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Avg. Demand</p>
                       <p className="text-lg font-black text-slate-800">High</p>
                    </div>
                    <div className="text-center border-x border-slate-50">
                       <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Peak Price</p>
                       <p className="text-lg font-black text-emerald-600">₹2,500</p>
                    </div>
                     <div className="text-center">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Recommendation</p>
                        <button 
                          onClick={handleGetAdvice}
                          disabled={isAnalyzing}
                          className="text-lg font-black text-blue-600 hover:underline flex items-center gap-1 mx-auto"
                        >
                          {isAnalyzing ? '...' : (marketAdvice ? 'Refine' : 'Get AI Tip')}
                        </button>
                     </div>
                  </div>

                  {marketAdvice && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3"
                    >
                      <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
                        <Zap size={20} className="text-white" fill="currentColor" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest">Gemini Market Advisor</p>
                        <p className="text-sm font-medium text-blue-900 leading-relaxed">{marketAdvice}</p>
                      </div>
                    </motion.div>
                  )}
              </div>

              {/* Action Sidebar */}
              <div className="space-y-6">
                 <button 
                   onClick={() => setShowPostModal(true)}
                   className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95 text-left group"
                 >
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-90 transition-transform">
                       <Plus size={28} />
                    </div>
                    <h4 className="text-2xl font-black font-outfit leading-tight">Create New <br />Sale Listing</h4>
                    <p className="text-emerald-100 text-sm mt-2 font-medium">Link with AI Grade report for 20% higher offers.</p>
                 </button>

                 <div className="glass-card p-8 space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="font-bold text-slate-800">Your Active Sales</h4>
                       <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">{myListings.length} ACTIVE</span>
                    </div>
                    <div className="space-y-4">
                       {myListings.length > 0 ? myListings.map((listing, idx) => (
                         <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                            <div className="flex justify-between items-start">
                               <div className="flex items-center gap-3">
                                  <div className="p-2 bg-white rounded-lg shadow-sm">
                                     <Package size={16} className="text-blue-500" />
                                  </div>
                                  <span className="font-bold text-sm text-slate-800">{listing.crop.split(' ')[0]}</span>
                               </div>
                               <span className="text-[10px] font-black text-emerald-600">LIVE</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 w-full" />
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Price: ₹{listing.price}/Q</p>
                         </div>
                       )) : (
                         <p className="text-center text-[10px] text-slate-400 py-4 italic">No active sales</p>
                       )}
                    </div>
                 </div>
              </div>
            </div>

            {/* Buyer Discovery Section */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-2xl font-black text-slate-800 font-outfit uppercase tracking-tight">Direct Buyer Offers</h3>
                  <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 hover:underline">
                    View All <ChevronRight size={16} />
                  </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { name: 'ITC Agri-Business', location: 'Indore, MP', offer: '₹2,480', type: 'Corporate', verified: true },
                    { name: 'Reliance Retail', location: 'Bhopal, MP', offer: '₹2,420', type: 'Corporate', verified: true },
                    { name: 'Shiva Food Processing', location: 'Sehore, MP', offer: '₹2,510', type: 'Factory', verified: false },
                  ].map((buyer, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -5 }}
                      className="glass-card p-6 bg-white border-none shadow-lg hover:shadow-2xl transition-all group"
                    >
                       <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center font-black text-slate-400 border border-slate-100">
                             {buyer.name[0]}
                          </div>
                          <div className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${buyer.verified ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400'}`}>
                             {buyer.verified ? 'Verified Buyer' : 'Pending'}
                          </div>
                       </div>
                       <div className="space-y-1">
                          <h5 className="font-black text-lg text-slate-800 font-outfit">{buyer.name}</h5>
                          <div className="flex items-center text-xs text-slate-400 font-medium">
                             <MapPin size={12} className="mr-1" />
                             {buyer.location}
                          </div>
                       </div>
                       <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                          <div>
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Current Offer</p>
                             <p className="text-xl font-black text-emerald-600">{buyer.offer}<span className="text-xs text-slate-400 ml-1 font-bold">/Q</span></p>
                          </div>
                          <button className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-all shadow-lg group-hover:scale-110">
                             <ArrowRight size={18} />
                          </button>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="buy"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-10"
          >
            {/* Buy View: The Marketplace */}
            <div className="flex flex-col md:flex-row gap-6">
               <div className="flex-1 glass-card px-8 py-5 flex items-center gap-4 border-none shadow-2xl focus-within:ring-4 focus-within:ring-emerald-500/10 transition-all">
                  <Search size={24} className="text-slate-300" />
                  <input 
                    type="text" 
                    placeholder="Search for Wheat, Soy, Cotton or Farmer name..." 
                    className="bg-transparent border-none outline-none text-lg w-full font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex gap-3">
                  <button className="glass-card px-6 flex items-center gap-2 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                     <Filter size={20} />
                     FILTER
                  </button>
                  <div className="flex bg-slate-100 p-1 rounded-2xl shadow-inner">
                     <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}>
                        <LayoutGrid size={20} />
                     </button>
                     <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-emerald-600' : 'text-slate-400'}`}>
                        <ListIcon size={20} />
                     </button>
                  </div>
               </div>
            </div>

            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
               {[...allListings, ...listings].map((item, i) => (
                 <motion.div 
                   key={item.id}
                   whileHover={{ y: -10 }}
                   className="glass-card bg-white overflow-hidden border-none shadow-xl hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.15)] transition-all group"
                 >
                    <div className="relative aspect-[4/3] overflow-hidden">
                       <img 
                          src={item.image} 
                          loading="lazy" 
                          decoding="async"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          alt={item.crop} 
                       />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black text-slate-900 border border-white shadow-lg flex items-center gap-1.5">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          AI GRADED {item.grade}
                       </div>
                       <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between">
                          <div>
                             <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Available Now</p>
                             <h5 className="text-white font-black text-xl font-outfit">{item.crop}</h5>
                          </div>
                          <div className="text-right">
                             <p className="text-white/60 text-[8px] font-black uppercase tracking-[0.2em] mb-1">Quality Score</p>
                             <p className="text-emerald-400 font-black text-xl">94/100</p>
                          </div>
                       </div>
                    </div>

                    <div className="p-8 space-y-6">
                       <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center font-black text-slate-400 text-xs shadow-inner">
                                {item.farmer[0]}
                             </div>
                             <div>
                                <p className="text-xs font-black text-slate-800">{item.farmer}</p>
                                <p className="text-[10px] text-slate-400 font-medium flex items-center">
                                   <MapPin size={10} className="mr-1" />
                                   {item.location}
                                </p>
                             </div>
                          </div>
                          <div className="text-right">
                             <p className="text-2xl font-black text-slate-900 font-outfit">₹{item.price}<span className="text-xs text-slate-400 ml-1 font-bold">/Q</span></p>
                             <p className="text-[10px] text-emerald-600 font-bold">{item.qty} Stock</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-3">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                             <Droplets size={14} className="text-blue-500" />
                             <span className="text-[10px] font-bold text-slate-600">{item.moisture} Moist.</span>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2">
                             <Clock size={14} className="text-amber-500" />
                             <span className="text-[10px] font-bold text-slate-600">Fresh Harvest</span>
                          </div>
                       </div>

                       <div className="flex gap-3 pt-2">
                          <button className="flex-[2] bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition-all text-sm shadow-xl shadow-slate-900/20 active:scale-95">
                             SEND INQUIRY
                          </button>
                          <button className="flex-1 bg-emerald-50 text-emerald-600 font-black py-4 rounded-2xl hover:bg-emerald-100 transition-all flex items-center justify-center">
                             <Phone size={18} />
                          </button>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </div>

            {/* Buy Tab CTA */}
            <div className="glass-card p-12 bg-slate-900 text-white rounded-[3rem] text-center space-y-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 to-transparent opacity-50" />
               <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                  <h3 className="text-4xl font-black font-outfit">Bulk Procurement?</h3>
                  <p className="text-slate-400 font-medium">Get custom quotes from the top 1% of farmers across multiple states. AI-verified quality guaranteed.</p>
                  <button className="px-12 py-5 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-2xl text-lg shadow-2xl shadow-emerald-500/40 transition-all hover:scale-105 active:scale-95">
                     Post Bulk RFP
                  </button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Listing Modal Simulation */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)} />
           <motion.div 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             className="relative bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl space-y-8"
           >
              <div className="flex justify-between items-center">
                 <h3 className="text-3xl font-black text-slate-800 font-outfit">List Your Crop</h3>
                 <button onClick={() => setShowPostModal(false)} className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200">
                    <ChevronRight className="rotate-90 text-slate-400" />
                 </button>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Commodity</label>
                    <select 
                      value={form.crop}
                      onChange={(e) => setForm({...form, crop: e.target.value})}
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all"
                    >
                       <option>Wheat (MP Sharbati)</option>
                       <option>Soybean (Yellow)</option>
                       <option>Corn (Yellow)</option>
                    </select>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Quantity (Quintals)</label>
                       <input 
                         type="number" 
                         value={form.quantity}
                         onChange={(e) => setForm({...form, quantity: e.target.value})}
                         placeholder="e.g. 50" 
                         className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Expected Price/Q</label>
                       <input 
                         type="number" 
                         value={form.price}
                         onChange={(e) => setForm({...form, price: e.target.value})}
                         placeholder="₹ 2,450" 
                         className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:border-emerald-500 transition-all" 
                       />
                    </div>
                 </div>
                 <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <CheckCircle2 className="text-emerald-500" size={24} />
                       <div>
                          <p className="text-xs font-black text-emerald-900">AI Quality Verified</p>
                          <p className="text-[10px] text-emerald-700 font-medium">Link Scan ID: SC-9428-A</p>
                       </div>
                    </div>
                    <span className="text-[10px] bg-white px-2 py-1 rounded-lg font-black text-emerald-600 shadow-sm">GRADE A+</span>
                 </div>
                 <button 
                   onClick={handlePublish}
                   disabled={isSubmitting}
                   className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
                 >
                    {isSubmitting ? 'PROCESSING...' : 'PUBLISH TO ONDC NETWORK'}
                 </button>
              </div>
           </motion.div>
        </div>
      )}

    </div>
  );
};

const Droplets = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
  </svg>
);

export default MandiPage;
