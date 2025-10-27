
'use client';

import { useState, useEffect, useRef } from 'react';
import type { Crypto } from '@/lib/data';
import { fetchAllCryptoData } from '@/services/crypto-service';

export function useCryptoData() {
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    async function loadData() {
        if(!isMounted.current) return;
      try {
        const data = await fetchAllCryptoData();
        if (isMounted.current) {
            setAllCryptos(data);
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

    const interval = setInterval(loadData, 1000); // Refresh every 1 second

    return () => {
        isMounted.current = false;
        clearInterval(interval);
    }
  }, []);

  return { allCryptos, loading };
}
