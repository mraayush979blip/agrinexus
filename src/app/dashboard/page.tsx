'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CloudSun, 
  TrendingUp, 
  AlertCircle, 
  ShieldCheck, 
  ChevronRight,
  Droplets,
  Wind,
  Truck,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  // Real weather state
  const [weather, setWeather] = useState<{ temp: number, wind: number } | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    // Fetch real weather data for Bhopal (Example central coordinate, could use Geolocation)
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current_weather=true');
        const data = await res.json();
        setWeather({
          temp: data.current_weather.temperature,
          wind: data.current_weather.windspeed
        });
      } catch (error) {
        console.error("Failed to fetch weather", error);
      } finally {
        setWeatherLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading || !profile || !user) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Render Farmer Dashboard
  const renderFarmerDashboard = () => (
    <>
      {/* Left Column: Health Overview & Stats */}
      <div className="lg:col-span-2 space-y-6">
        {/* Health Overview Card - Real Data Check */}
        <motion.div variants={item} className="glass-card p-8 bg-gradient-to-br from-emerald-900 to-emerald-800 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-200 text-sm font-medium">Overall Farm Health</p>
                <h3 className="text-4xl md:text-5xl font-bold mt-2">Awaiting Data</h3>
              </div>
              <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-md">
                <AlertCircle size={32} />
              </div>
            </div>
            <div className="mt-8 flex items-center space-x-4">
              <p className="text-emerald-100 text-sm bg-black/20 p-3 rounded-xl border border-white/10">
                Upload a crop photo via the <strong>Health Doctor</strong> to calculate your farm's health score.
              </p>
            </div>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl" />
        </motion.div>

        {/* Quick Stats Grid - Real API */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <CloudSun size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Weather</p>
              <p className="text-sm font-bold">{weatherLoading ? 'Loading...' : `${weather?.temp}°C`}</p>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
              <Wind size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Wind</p>
              <p className="text-sm font-bold">{weatherLoading ? 'Loading...' : `${weather?.wind} km/h`}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32 opacity-50">
            <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Soil Moisture</p>
              <p className="text-[10px] font-bold text-slate-400">Needs Satellite Link</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Alerts</p>
              <p className="text-sm font-bold">No Alerts</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Primary Modules */}
      <div className="space-y-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Modules</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <Link href="/scan" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={28} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Health Doctor AI</h5>
                  <p className="text-xs text-slate-500">Scan & diagnose diseases</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>

          <Link href="/rental" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-blue-100 text-blue-700 rounded-2xl flex items-center justify-center">
                  <Truck size={28} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Equipment Rental</h5>
                  <p className="text-xs text-slate-500">Book tractors & drones</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>

          <Link href="/mandi" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Smart Mandi (ONDC)</h5>
                  <p className="text-xs text-slate-500">Direct sales & market stats</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </>
  );

  // Render Buyer Dashboard
  const renderBuyerDashboard = () => (
    <div className="lg:col-span-3 space-y-6">
       <div className="glass-card p-8 text-center space-y-4">
          <TrendingUp className="mx-auto text-emerald-600" size={48} />
          <h2 className="text-2xl font-bold font-outfit text-emerald-900">Wholesale Buyer Portal</h2>
          <p className="text-slate-500 max-w-md mx-auto">Access direct listings from farmers across the region without middlemen.</p>
          <Link href="/mandi" className="inline-block mt-4">
             <button className="btn-primary py-3 px-8">Go to Smart Mandi</button>
          </Link>
       </div>
    </div>
  );

  // Render Renter Dashboard
  const renderRenterDashboard = () => (
    <div className="lg:col-span-3 space-y-6">
       <div className="glass-card p-8 text-center space-y-4">
          <Truck className="mx-auto text-blue-600" size={48} />
          <h2 className="text-2xl font-bold font-outfit text-blue-900">Equipment Management</h2>
          <p className="text-slate-500 max-w-md mx-auto">Manage your listings, view bookings, and track your agricultural assets.</p>
          <Link href="/rental" className="inline-block mt-4">
             <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl py-3 px-8 transition-all">Manage Equipment</button>
          </Link>
       </div>
    </div>
  );

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header with Clickable Profile Icon */}
      <motion.div variants={item} className="flex items-center justify-between">
        <div>
          <h2 className="text-slate-500 font-medium">Namaste,</h2>
          <h1 className="text-3xl md:text-4xl font-bold font-outfit text-emerald-900">{profile.name.split(' ')[0]}</h1>
        </div>
        <Link href="/profile">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border-2 border-white shadow-sm overflow-hidden cursor-pointer hover:scale-105 transition-transform">
             <img src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush"} alt="Profile" className="w-full h-full object-cover" />
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {profile.role === 'Farmer' && renderFarmerDashboard()}
        {profile.role === 'Buyer' && renderBuyerDashboard()}
        {profile.role === 'Renter' && renderRenterDashboard()}
      </div>
    </motion.div>
  );
};

export default Dashboard;
