'use client'
import { TradeView } from "@/components/trade-view";
import { AppHeader } from "@/components/app-header";
import { useCryptoData } from "@/hooks/use-crypto-data";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function TradePage({ params }: { params: { ticker: string } }) {
  const { allCryptos, loading } = useCryptoData();
  const router = useRouter();
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
