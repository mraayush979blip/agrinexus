'use client';

import React from 'react';
import { Home, Search, ShoppingBag, Leaf, Truck } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Navbar = () => {
  const pathname = usePathname();
  const { profile } = useAuth();

  if (pathname === '/' || pathname === '/login' || pathname === '/onboarding' || pathname === '/team') return null;

  let navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
  ];

  if (profile?.role === 'Farmer') {
    navItems.push(
      { icon: Search, label: 'Scan', href: '/scan' },
      { icon: ShoppingBag, label: 'Mandi', href: '/mandi' },
      { icon: Leaf, label: 'Schemes', href: '/schemes' }
    );
  } else if (profile?.role === 'Buyer') {
    navItems.push(
      { icon: ShoppingBag, label: 'Mandi', href: '/mandi' }
    );
  } else if (profile?.role === 'Renter') {
    navItems.push(
      { icon: Truck, label: 'Equipment', href: '/rental' }
    );
  }

  // Always add Profile
  const profileItem = { 
    icon: () => (
      <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-200 shadow-sm">
        <img 
          src={profile?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name}`} 
          alt="P" 
          className="w-full h-full object-cover" 
        />
      </div>
    ), 
    label: 'Profile', 
    href: '/profile' 
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:bottom-8 md:left-1/2 md:-translate-x-1/2 w-full md:w-[90%] md:max-w-2xl h-20 md:h-16 backdrop-blur-2xl bg-white/80 border-t md:border border-slate-200 md:rounded-[2rem] flex items-center justify-around px-6 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-2xl">
      {[...navItems, profileItem].map((item: any) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all duration-300 flex-1 h-full",
              isActive ? "text-emerald-900" : "text-slate-400 hover:text-emerald-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all flex items-center justify-center",
              isActive && "bg-emerald-100 shadow-inner"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn("text-[9px] font-black uppercase tracking-tighter hidden md:block", isActive ? "text-emerald-900" : "text-slate-400")}>
               {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
