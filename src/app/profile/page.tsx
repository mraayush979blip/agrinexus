'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, LogOut, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && (!user || !profile)) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || !profile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-emerald-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/dashboard" className="p-2 hover:bg-white/50 rounded-xl transition-all">
          <ChevronLeft className="text-slate-600" />
        </Link>
        <h1 className="text-2xl font-bold font-outfit text-emerald-900">My Profile</h1>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 text-center space-y-4"
      >
        <div className="w-24 h-24 mx-auto bg-emerald-100 rounded-[2.5rem] p-1 shadow-inner relative">
           <img src={user.photoURL || "https://api.dicebear.com/7.x/avataaars/svg?seed=Aayush"} className="w-full h-full rounded-[2.2rem] object-cover" alt="Profile" />
           {profile.verified && (
             <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <CheckCircle2 size={16} />
             </div>
           )}
        </div>
        <div>
           <h2 className="text-2xl font-bold text-slate-800 font-outfit">{profile.name}</h2>
           <p className="text-sm text-slate-500">{profile.email}</p>
        </div>
        <div className="inline-block bg-emerald-100 text-emerald-800 font-bold px-4 py-1 rounded-full text-sm">
           {profile.role}
        </div>
      </motion.div>

      <div className="space-y-4">
         <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Details</h4>
         <div className="glass-card p-6 space-y-4">
            <div className="flex justify-between border-b border-slate-100 pb-4">
               <span className="text-sm text-slate-500">State/Region</span>
               <span className="text-sm font-bold text-slate-800">{profile.state || 'Not Set'}</span>
            </div>
            {profile.role === 'Farmer' && (
              <div className="flex justify-between border-b border-slate-100 pb-4">
                 <span className="text-sm text-slate-500">Land Size</span>
                 <span className="text-sm font-bold text-slate-800">{profile.landSize ? `${profile.landSize} Acres` : 'Not Set'}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-slate-100 pb-4">
               <span className="text-sm text-slate-500">DigiLocker Status</span>
               <span className="text-sm font-bold text-emerald-600 flex items-center">
                  <CheckCircle2 size={14} className="mr-1" />
                  Verified
               </span>
            </div>
            <div className="flex justify-between">
               <span className="text-sm text-slate-500">User ID</span>
               <span className="text-sm font-mono text-slate-400">{user.uid.substring(0, 8)}...</span>
            </div>
         </div>
      </div>

      <div className="pt-8">
         <button 
           onClick={handleLogout}
           className="w-full bg-red-50 text-red-600 hover:bg-red-100 py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 transition-all"
         >
            <LogOut size={20} />
            <span>Logout</span>
         </button>
      </div>
    </div>
  );
};

export default ProfilePage;
