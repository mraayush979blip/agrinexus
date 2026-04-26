'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Truck, 
  TrendingUp, 
  Zap, 
  ChevronRight,
  ArrowRight,
  Sparkles,
  Lock
} from 'lucide-react';
import Link from 'next/link';

const LandingPage = () => {
  return (
    <div className="space-y-32 pb-32 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] -mx-4 md:-mx-8 lg:-mx-16 flex flex-col justify-center px-8 md:px-16 lg:px-32 overflow-hidden lg:rounded-b-[5rem] shadow-2xl">
        <img 
          src="/hero.png" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Farmer with AI" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/40 to-transparent lg:bg-gradient-to-r lg:from-emerald-950 lg:via-emerald-900/60 lg:to-transparent" />
        
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="relative z-10 space-y-8 max-w-2xl"
        >
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
             <Sparkles size={20} className="text-amber-400" />
             <span className="text-sm font-bold text-white uppercase tracking-widest">Next-Gen Agritech</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold font-outfit text-white leading-[1.1]">
            The Future of Farming <br />
            <span className="text-emerald-400">is Here.</span>
          </h1>
          <p className="text-emerald-50/80 text-lg md:text-xl max-w-lg leading-relaxed">
            Empowering 100 Million Indian farmers with the Doctor-Manager-Broker ecosystem. Eliminate crop loss and maximize profit.
          </p>
          <div className="pt-4 flex flex-col md:flex-row gap-4">
             <Link href="/login" className="flex-1 md:flex-initial">
               <button 
                 className="btn-accent w-full md:px-12 py-6 flex items-center justify-center space-x-4 group"
               >
                  <span className="text-xl font-bold">GET STARTED</span>
                  <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
               </button>
             </Link>
             <button className="flex-1 md:flex-initial px-12 py-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold hover:bg-white/20 transition-all">
                WATCH DEMO
             </button>
          </div>
        </motion.div>
      </section>

      {/* The Mission Section */}
      <section className="space-y-16 max-w-6xl mx-auto px-4">
        <div className="text-center space-y-4">
           <h2 className="text-4xl md:text-5xl font-bold text-emerald-900 font-outfit">The AgriNexus Ecosystem</h2>
           <p className="text-slate-500 text-lg max-w-2xl mx-auto">One closed-loop platform that follows the farmer's entire 5-step journey.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              step: '01', 
              title: 'Health Doctor AI', 
              desc: 'Offline Edge AI diagnosis identifies diseases in seconds before they spread.',
              icon: ShieldCheck,
              color: 'bg-emerald-100 text-emerald-700'
            },
            { 
              step: '02', 
              title: 'Smart Manager', 
              desc: 'Uber for tractors & drones. Rental equipment at your fingertips with no middlemen.',
              icon: Truck,
              color: 'bg-blue-100 text-blue-700'
            },
            { 
              step: '03', 
              title: 'Global Broker', 
              desc: 'Direct ONDC market access. AI-graded produce listed for premium prices across India.',
              icon: TrendingUp,
              color: 'bg-amber-100 text-amber-700'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div 
                key={i}
                whileInView={{ y: 0, opacity: 1 }}
                initial={{ y: 20, opacity: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 flex flex-col items-center text-center space-y-6"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                   <Icon size={40} />
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col items-center space-y-1">
                      <span className="text-xs font-bold text-slate-300 tracking-[0.3em] uppercase">{item.step}</span>
                      <h4 className="text-2xl font-bold text-slate-800 font-outfit">{item.title}</h4>
                   </div>
                   <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust & Security Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-card p-12 md:p-20 text-center md:text-left bg-gradient-to-br from-emerald-950 to-emerald-800 text-white rounded-[3rem] overflow-hidden relative">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
             <div className="space-y-8">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md mx-auto md:mx-0">
                   <Lock size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold font-outfit leading-tight">Your Farm Data, <br /><span className="text-emerald-400">Encrypted.</span></h2>
                <p className="text-emerald-100/70 text-lg leading-relaxed max-w-md">
                   Using Google Cloud's military-grade security to protect land records, Aadhaar data, and yield history.
                </p>
                <div className="pt-4 flex flex-wrap gap-6 justify-center md:justify-start grayscale brightness-0 invert opacity-50">
                   <img src="https://www.gstatic.com/devrel-devsite/prod/v7b91959828d11e1337b3f9429a3977c570f807217596b99b50e30d1d23467657/firebase/images/lockup.png" className="h-10" alt="Firebase" />
                </div>
             </div>
             <div className="hidden lg:block relative">
                <div className="w-full h-80 bg-white/10 rounded-3xl border border-white/20 backdrop-blur-xl p-8 space-y-6">
                   <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-500 rounded-full" />
                      <div className="space-y-2">
                        <div className="w-32 h-3 bg-white/20 rounded" />
                        <div className="w-20 h-2 bg-white/10 rounded" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="w-full h-3 bg-white/5 rounded" />
                      <div className="w-full h-3 bg-white/5 rounded" />
                      <div className="w-2/3 h-3 bg-white/5 rounded" />
                   </div>
                   <div className="pt-4">
                      <div className="w-full h-12 bg-emerald-500/50 rounded-xl border border-emerald-400" />
                   </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-emerald-400/20 rounded-full blur-3xl -z-10" />
             </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center space-y-12 max-w-4xl mx-auto px-4">
         <div className="space-y-6">
            <h2 className="text-5xl font-bold text-emerald-900 font-outfit">Ready to Empower Your Farm?</h2>
            <p className="text-slate-500 text-lg">Join thousands of farmers already making 30% more profit with AI.</p>
         </div>
         <div className="flex justify-center">
            <Link href="/login" className="w-full md:w-auto">
              <button 
                className="btn-primary w-full md:px-20 py-7 text-xl shadow-2xl flex items-center justify-center space-x-4"
              >
                 <span>GET STARTED NOW</span>
                 <ArrowRight size={24} />
              </button>
            </Link>
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
