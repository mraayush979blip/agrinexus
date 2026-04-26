'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const LoginPage = () => {
  const { user, profile, loginWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState<'Farmer' | 'Buyer' | 'Renter'>('Farmer');

  useEffect(() => {
    if (user && profile) {
      if (profile.onboarded) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, profile, router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F0FDF4]">
      <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F0FDF4] px-6 py-12">
      {/* Back to Landing */}
      <Link href="/" className="flex items-center text-slate-500 hover:text-emerald-900 transition-colors mb-20 group">
         <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
         <span className="text-sm font-medium">Back to Home</span>
      </Link>

      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-100 rounded-[2.5rem] flex items-center justify-center shadow-inner"
        >
          <ShieldCheck className="text-emerald-900" size={48} />
        </motion.div>

        <div className="space-y-4">
          <h1 className="text-4xl font-bold font-outfit text-emerald-900">Sign in to AgriNexus</h1>
          <p className="text-slate-500 max-w-xs mx-auto">Select your role to access your personalized ecosystem.</p>
        </div>

        <div className="w-full max-w-sm space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl w-full">
            {['Farmer', 'Buyer', 'Renter'].map((r) => (
               <button 
                 key={r}
                 onClick={() => setRole(r as any)} 
                 className={`flex-1 py-3 text-xs font-bold rounded-xl transition-all ${role === r ? 'bg-white shadow-sm text-emerald-900' : 'text-slate-500 hover:text-slate-700'}`}
               >
                 {r}
               </button>
            ))}
          </div>

          <button 
            onClick={() => loginWithGoogle(role)}
            className="w-full btn-primary flex items-center justify-center space-x-3 py-5 shadow-2xl transition-all active:scale-95"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.png" className="w-5 h-5 bg-white rounded-full p-0.5" alt="Google" />
            <span>Continue with Google</span>
          </button>
          
          <div className="relative py-4">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
             <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-slate-400"><span className="bg-[#F0FDF4] px-4">Secure & Encrypted</span></div>
          </div>

          <button 
            className="w-full bg-white border border-slate-200 text-slate-400 py-4 rounded-2xl text-sm font-medium cursor-not-allowed opacity-50"
            disabled
          >
            Phone / OTP (Coming Soon)
          </button>
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest pt-12">
           Part of the Google Cloud Community Hackathon 2026
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
