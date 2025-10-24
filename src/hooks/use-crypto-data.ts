'use client';

import { useState, useEffect } from 'react';
import type { Crypto } from '@/lib/data';
import { fetchCryptoData } from '@/services/crypto-service';

export function useCryptoData() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchCryptoData();
        setCryptos(data);
      } catch (error) {
        console.error("Failed to fetch crypto data", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();

    const interval = setInterval(loadData, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return { cryptos, loading };
}
