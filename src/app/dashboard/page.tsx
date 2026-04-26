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
  Plus,
  Navigation,
  Satellite,
  Zap,
  Info,
  BarChart3,
  CloudRain
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface WeatherData {
  temp: number;
  wind: number;
  soilMoisture: number;
  rainChance: number;
  nextRainDay: string | null;
  humidity: number;
  locationName: string;
}

const Dashboard = () => {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  // Real weather and soil state
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [coords, setCoords] = useState({ lat: 23.2599, lon: 77.4126 }); // Default Bhopal

  useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    // Attempt to get real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => {
          console.log("Using default location (Bhopal) due to permission denial or error.");
        }
      );
    }
  }, []);

  useEffect(() => {
    const fetchAgriData = async () => {
      try {
        setWeatherLoading(true);
        // Open-Meteo API for Weather + Soil Moisture + Precipitation
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true&hourly=soil_moisture_0_to_7cm,precipitation_probability,relative_humidity_2m&daily=precipitation_probability_max&timezone=auto`;
        
        const res = await fetch(url);
        const data = await res.json();
        
        // Find next rain day (chance > 30%)
        const nextRainIndex = data.daily.precipitation_probability_max.findIndex((p: number, i: number) => i > 0 && p > 30);
        const days = ['Today', 'Tomorrow', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const today = new Date().getDay();
        
        let nextRainDay = null;
        if (nextRainIndex !== -1) {
          const targetDay = (today + nextRainIndex) % 7;
          nextRainDay = days[targetDay];
        }

        setWeather({
          temp: data.current_weather.temperature,
          wind: data.current_weather.windspeed,
          soilMoisture: data.hourly.soil_moisture_0_to_7cm[0], // current hour
          humidity: data.hourly.relative_humidity_2m[0],
          rainChance: data.daily.precipitation_probability_max[0],
          nextRainDay: nextRainDay,
          locationName: coords.lat === 23.2599 ? "Bhopal (Default)" : "Your Farm"
        });
      } catch (error) {
        console.error("Failed to fetch agri data", error);
      } finally {
        setWeatherLoading(false);
      }
    };
    
    fetchAgriData();
  }, [coords]);

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
        {/* Farm Insights Card - Satellite Driven */}
        <motion.div variants={item} className="glass-card p-6 bg-white overflow-hidden border-none shadow-xl relative">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Satellite className="text-blue-500" size={20} />
              Satellite Farm Insights
            </h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
              Live Satellite Link
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Soil Moisture Visualizer */}
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-slate-500 font-medium">Soil Moisture (Surface)</p>
                  <p className="text-3xl font-bold text-slate-800">
                    {weatherLoading ? '...' : `${(weather?.soilMoisture! * 100).toFixed(1)}%`}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase">Status</p>
                  <p className={`text-xs font-bold ${weather?.soilMoisture! < 0.2 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {weather?.soilMoisture! < 0.2 ? 'Needs Irrigation' : 'Optimal Level'}
                  </p>
                </div>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(weather?.soilMoisture! * 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-full ${weather?.soilMoisture! < 0.2 ? 'bg-amber-400' : 'bg-blue-500'}`}
                />
              </div>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Info size={10} />
                Calculated via microwave remote sensing models. No device needed.
              </p>
            </div>

            {/* Rain Prediction */}
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <CloudRain className="text-blue-500" size={20} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Rain Forecast</p>
                  <p className="text-sm font-bold text-slate-800">
                    {weather?.rainChance! > 50 ? 'High probability of rain' : 'Mostly dry today'}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-600 font-medium">Next Rain:</span>
                  <span className={`text-[10px] font-bold ${weather?.nextRainDay ? 'text-blue-600' : 'text-slate-500'}`}>
                    {weatherLoading ? '...' : (weather?.nextRainDay || 'No rain soon')}
                  </span>
                </div>
                <div className={`p-2.5 rounded-xl border text-[10px] font-medium flex items-center gap-2 ${weather?.rainChance! > 30 ? 'bg-amber-50 border-amber-100 text-amber-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                  <Info size={12} />
                  {weather?.rainChance! > 30 ? 'Avoid spraying pesticides today.' : 'Safe to apply fertilizers.'}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <CloudSun size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Temp</p>
              <p className="text-sm font-bold">{weatherLoading ? '...' : `${weather?.temp}°C`}</p>
            </div>
          </motion.div>
          
          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
              <Wind size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Wind</p>
              <p className="text-sm font-bold">{weatherLoading ? '...' : `${weather?.wind} km/h`}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-xl flex items-center justify-center">
              <Droplets size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Humidity</p>
              <p className="text-sm font-bold">{weatherLoading ? '...' : `${weather?.humidity}%`}</p>
            </div>
          </motion.div>

          <motion.div variants={item} className="glass-card p-4 flex flex-col justify-between h-32">
            <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center">
              <Navigation size={20} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Location</p>
              <p className="text-[10px] font-bold truncate">{weather?.locationName}</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Column: Primary Modules */}
      <div className="space-y-6">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest pl-1">Primary Modules</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <Link href="/scan" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block border-l-4 border-emerald-500">
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

          <Link href="/mandi" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center">
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h5 className="font-bold text-slate-800">Smart Mandi</h5>
                  <p className="text-xs text-slate-500">Direct sales & market stats</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          </Link>

          <Link href="/schemes" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block border-2 border-amber-200 shadow-amber-100 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-amber-400 text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap size={28} />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="font-bold text-slate-800">Scheme Matcher</h5>
                    <span className="text-[8px] bg-amber-100 text-amber-600 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter">AI Powered</span>
                  </div>
                  <p className="text-xs text-slate-500">Find personalized subsidies</p>
                </div>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-amber-500 transition-colors" />
            </div>
          </Link>
          
          <Link href="/rental" className="glass-card p-5 group cursor-pointer hover:bg-white/90 transition-all block opacity-60">
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
             <img 
               src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.name}`} 
               loading="lazy"
               decoding="async"
               alt="Profile" 
               className="w-full h-full object-cover" 
             />
          </div>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {profile.role === 'Farmer' && renderFarmerDashboard()}
        {profile.role === 'Buyer' && renderBuyerDashboard()}
        {profile.role === 'Renter' && renderRenterDashboard()}
      </div>
    </motion.div>
  );
};

export default Dashboard;

