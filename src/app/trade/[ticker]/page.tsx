
'use client'
import { TradeView } from "@/components/trade-view";
import { AppHeader } from "@/components/app-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchAllCryptoData } from "@/services/crypto-service";
import type { Crypto } from "@/lib/data";
import { useRouter } from "next/navigation";

export default function TradePage({ params }: { params: { ticker: string } }) {
  const [allCryptos, setAllCryptos] = useState<Crypto[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchAllCryptoData();
        setAllCryptos(data);
      } catch (error) {
        console.error("Failed to fetch crypto data", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);
  
  const crypto = allCryptos.find(c => c.ticker === params.ticker.toUpperCase());
  
  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!crypto) {
    return (
        <div className="p-4 text-center">
            <p>Crypto currency not found.</p>
            <Button onClick={() => router.back()} className="mt-4">Go Back</Button>
        </div>
    );
  }

  return (
    <>
      <AppHeader title={`Trade ${params.ticker.toUpperCase()}`} hasBack />
      <TradeView crypto={crypto} onClose={() => router.back()} />
    </>
  );
}
