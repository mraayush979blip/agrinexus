'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock,
  Satellite,
  Globe,
  Users,
  Sprout,
  BarChart3,
  Search,
  CheckCircle2,
  Volume2
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const stats = [
    { label: 'Farmers Empowered', value: '100K+', icon: Users, color: 'text-blue-500' },
    { label: 'Crop Loss Reduced', value: '35%', icon: Sprout, color: 'text-emerald-500' },
    { label: 'Avg. Profit Increase', value: '42%', icon: TrendingUp, color: 'text-amber-500' },
    { label: 'Satellite Accuracy', value: '98.4%', icon: Satellite, color: 'text-indigo-500' },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-40 pb-40 overflow-x-hidden selection:bg-emerald-200 selection:text-emerald-900">
      
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-emerald-100/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-blue-100/40 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      {/* Hero Section: The "Winner" Reveal */}
      <section className="relative min-h-[95vh] flex flex-col justify-center items-center px-4 pt-20">
        <motion.div 
          style={{ opacity, scale }}
          className="text-center space-y-8 max-w-5xl relative z-10"
        >
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-xl px-5 py-2 rounded-full border border-emerald-100 shadow-xl shadow-emerald-900/5"
          >
             <span className="text-xs font-black text-emerald-900 uppercase tracking-[0.2em]">The Future of Agriculture is Autonomous</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black font-outfit text-slate-900 leading-[1] tracking-tight"
          >
            Empowering the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-blue-600">Digital Farmer.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-lg md:text-2xl max-w-3xl mx-auto leading-relaxed font-medium"
          >
            AgriNexus is the world's first closed-loop AI ecosystem designed to eliminate crop loss and maximize profit for 100 Million+ farmers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-10 flex flex-col md:flex-row items-center justify-center gap-6"
          >
             <Link href="/login" className="group w-full md:w-auto">
               <button className="relative w-full px-12 py-6 rounded-[2rem] bg-slate-900 text-white font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-slate-900/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    START YOUR JOURNEY <ArrowRight size={24} />
                  </span>
               </button>
             </Link>
             <Link href="/team" className="w-full md:w-auto">
               <button className="w-full px-12 py-6 rounded-[2rem] bg-white border-2 border-slate-100 text-slate-800 font-bold text-xl hover:bg-slate-50 transition-all shadow-lg flex items-center justify-center gap-3">
                  <Users size={24} className="text-emerald-500" />
                  OUR TEAM
               </button>
             </Link>
          </motion.div>
        </motion.div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-20 w-full max-w-6xl px-4"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-card border-none overflow-hidden aspect-[16/9] shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2070" 
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                alt="AgriNexus Dashboard" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-12 left-12 space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <Satellite size={24} className="text-white" />
                  </div>
                  <h4 className="text-white font-bold text-2xl uppercase tracking-widest font-outfit">Live Satellite Monitoring</h4>
                </div>
                <p className="text-emerald-100/60 text-sm font-medium">Processing real-time field data for localized insights.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Impact Stats: Proof of Winning */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 text-center space-y-4 hover:shadow-2xl transition-all"
              >
                <div className={`w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mx-auto shadow-inner ${stat.color}`}>
                  <Icon size={32} />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 font-outfit">{stat.value}</h3>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* The Closed-Loop Ecosystem Walkthrough */}
      <section className="max-w-7xl mx-auto px-4 space-y-32">
        <div className="text-center space-y-4">
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 font-outfit">A Full-Stack Solution.</h2>
           <p className="text-slate-500 text-xl font-medium max-w-2xl mx-auto">From seed to sale, AgriNexus follows the entire farmer's journey.</p>
        </div>

        <div className="grid grid-cols-1 gap-40">
          {/* Step 1: Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -50, opacity: 0 }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/10">
                <Satellite size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tight">01. Satellite Intelligence</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  We use microwave remote sensing to track soil moisture, crop health, and precipitation directly from space. No expensive hardware or physical devices required on the farm.
                </p>
              </div>
              <ul className="space-y-4">
                {['Real-time soil moisture monitoring', 'Localized rain forecasting', 'Actionable irrigation alerts'].map((tip, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                    <CheckCircle2 className="text-emerald-500" size={20} />
                    {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="relative">
               <div className="absolute inset-0 bg-blue-500/10 rounded-[3rem] blur-3xl" />
               <img 
                 src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&q=80&w=1000" 
                 className="relative z-10 w-full rounded-[3rem] shadow-2xl border-4 border-white" 
                 alt="Satellite Farm Intelligence" 
               />
            </div>
          </div>

          {/* Step 2: AI Doctor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="order-2 lg:order-1 relative">
               <div className="absolute inset-0 bg-emerald-500/10 rounded-[3rem] blur-3xl" />
               <img 
                 src="https://images.unsplash.com/photo-1592419044706-39796d40f98c?auto=format&fit=crop&q=80&w=1000" 
                 className="relative z-10 w-full rounded-[3rem] shadow-2xl border-4 border-white" 
                 alt="AI Health Doctor" 
               />
            </div>
            <motion.div 
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: 50, opacity: 0 }}
              className="space-y-8 order-1 lg:order-2"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-lg shadow-emerald-500/10">
                <ShieldCheck size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tight">02. Health Doctor AI</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  Scan any crop with your mobile camera. Our proprietary Edge AI identifies thousands of diseases in seconds and prescribes targeted treatments immediately.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 glass-card bg-white space-y-2">
                   <Zap className="text-amber-500" size={24} />
                   <p className="text-lg font-black text-slate-800">Instant</p>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Diagnosis</p>
                </div>
                <div className="p-6 glass-card bg-white space-y-2">
                   <Volume2 className="text-blue-500" size={24} />
                   <p className="text-lg font-black text-slate-800">Audio</p>
                   <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Support</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Step 3: Marketplace */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              whileInView={{ x: 0, opacity: 1 }}
              initial={{ x: -50, opacity: 0 }}
              className="space-y-8"
            >
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center shadow-lg shadow-amber-500/10">
                <TrendingUp size={32} />
              </div>
              <div className="space-y-4">
                <h3 className="text-4xl font-black text-slate-900 font-outfit uppercase tracking-tight">03. Smart Mandi (ONDC)</h3>
                <p className="text-xl text-slate-500 leading-relaxed font-medium">
                  Skip the middlemen. List your graded produce directly on India's ONDC network. Reach wholesale buyers across the country and get paid premium prices.
                </p>
              </div>
              <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <ArrowRight className="text-white rotate-[-45deg]" size={40} />
                 </div>
                 <h5 className="text-emerald-400 font-bold text-sm uppercase tracking-widest mb-2">Direct Profit</h5>
                 <p className="text-white text-3xl font-black font-outfit leading-tight">Eliminate 20% Middlemen Fees Instantly.</p>
              </div>
            </motion.div>
            <div className="relative">
               <div className="absolute inset-0 bg-amber-500/10 rounded-[3rem] blur-3xl" />
               <img 
                 src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000" 
                 className="relative z-10 w-full rounded-[3rem] shadow-2xl border-4 border-white" 
                 alt="Smart Mandi Marketplace" 
               />
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security: "Winner" Grade Security */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-card p-12 md:p-24 bg-slate-900 text-white rounded-[4rem] relative overflow-hidden border-none">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-emerald-500/20 to-transparent" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-10">
                <div className="inline-flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
                   <Lock size={18} className="text-emerald-400" />
                   <span className="text-xs font-bold uppercase tracking-widest">Bank-Grade Security</span>
                </div>
                <h2 className="text-5xl md:text-6xl font-black font-outfit leading-[1.1] tracking-tight">Your Farm Data, <br /><span className="text-emerald-400 underline decoration-white/20 underline-offset-8">Fortified.</span></h2>
                <p className="text-emerald-50/70 text-xl font-medium leading-relaxed max-w-lg">
                   We use end-to-end encryption to protect your identity, land records, and financial transactions. Your data stays yours.
                </p>
                <div className="flex items-center gap-8 pt-4 grayscale brightness-0 invert opacity-40">
                   <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/DigiLocker_logo.png" className="h-12" alt="DigiLocker" />
                   <div className="w-px h-12 bg-white/10" />
                   <img src="https://www.gstatic.com/devrel-devsite/prod/v7b91959828d11e1337b3f9429a3977c570f807217596b99b50e30d1d23467657/firebase/images/lockup.png" className="h-10" alt="Firebase" />
                </div>
             </div>
             <div className="relative hidden lg:block">
                <motion.div 
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] space-y-8 shadow-2xl"
                >
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <ShieldCheck size={32} />
                         </div>
                         <div className="space-y-1">
                            <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Active Protection</p>
                            <p className="text-lg font-bold">Secure Vault 2.0</p>
                         </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-500/30">
                        Live
                      </div>
                   </div>
                   <div className="space-y-3">
                      {[1, 2, 3].map((_, i) => (
                        <div key={i} className="h-4 bg-white/5 rounded-full w-full relative overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              whileInView={{ width: '70%' }}
                              transition={{ duration: 2, delay: i * 0.2 }}
                              className="absolute h-full bg-emerald-500/40" 
                           />
                        </div>
                      ))}
                   </div>
                </motion.div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA: The Winner's Choice */}
      <section className="text-center space-y-12 max-w-5xl mx-auto px-4">
         <motion.div 
            whileInView={{ scale: 1, opacity: 1 }}
            initial={{ scale: 0.95, opacity: 0 }}
            className="space-y-8"
          >
            <h2 className="text-6xl md:text-7xl font-black text-slate-900 font-outfit leading-[1.1] tracking-tight">Ready to Re-Nexus <br />Your Farm?</h2>
            <p className="text-slate-500 text-xl md:text-2xl font-medium max-w-2xl mx-auto leading-relaxed">
              Join the agritech revolution. Sign up today and experience the power of the Digital Farmer ecosystem.
            </p>
         </motion.div>
         <div className="flex flex-col items-center gap-6 pt-10">
            <Link href="/login" className="w-full max-w-md">
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-black py-7 rounded-[2.5rem] text-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 group">
                 <span>GET STARTED FOR FREE</span>
                 <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </Link>
            <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">No Credit Card Required • No Hardware Needed</p>
         </div>
      </section>

    </div>
  );
};

export default LandingPage;

