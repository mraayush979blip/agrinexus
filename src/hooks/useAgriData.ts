import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Hook for Live Mandi Prices
export function useMandiPrices() {
  const [prices, setPrices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'mandi_prices'), orderBy('price', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const priceData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPrices(priceData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { prices, loading };
}

// Hook for Equipment Rentals
export function useRentals() {
  const [rentals, setRentals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'rentals'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const rentalData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRentals(rentalData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { rentals, loading };
}
