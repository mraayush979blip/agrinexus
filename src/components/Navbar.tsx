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

  if (pathname === '/' || pathname === '/login' || pathname === '/onboarding') return null;

  let navItems = [
    { icon: Home, label: 'Home', href: '/dashboard' },
  ];

  if (profile?.role === 'Farmer') {
    navItems.push(
      { icon: Search, label: 'Scan', href: '/scan' },
      { icon: ShoppingBag, label: 'Mandi', href: '/mandi' },
      { icon: Leaf, label: 'Vault', href: '/vault' }
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

  return (
    <nav className="nav-blur">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center space-y-1 transition-all duration-300",
              isActive ? "text-emerald-900 scale-110" : "text-slate-400 hover:text-emerald-600"
            )}
          >
            <div className={cn(
              "p-2 rounded-xl transition-all",
              isActive && "bg-emerald-100 shadow-inner"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default Navbar;
