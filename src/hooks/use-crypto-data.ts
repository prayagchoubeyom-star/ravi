'use client';

import { useState, useEffect, useRef } from 'react';
import type { Crypto } from '@/lib/data';
import { fetchCryptoData } from '@/services/crypto-service';

export function useCryptoData() {
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    async function loadData() {
      try {
        const data = await fetchCryptoData();
        if (isMounted.current) {
            setCryptos(data);
        }
      } catch (error) {
        console.error("Failed to fetch crypto data", error);
      } finally {
        if (isMounted.current) {
            setLoading(false);
        }
      }
    }

    loadData();

    const interval = setInterval(loadData, 2000); // Refresh every 2 seconds

    return () => {
        isMounted.current = false;
        clearInterval(interval);
    }
  }, []);

  return { cryptos, loading };
}
