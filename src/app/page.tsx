
import { AppHeader } from "@/components/app-header";
import { ProtectedRoute } from "@/components/protected-route";
import { WatchlistView } from "@/components/watchlist-view";
import { fetchAllCryptoData } from "@/services/crypto-service";

export default async function WatchlistPage() {
  const initialCryptoData = await fetchAllCryptoData();
  return (
    <ProtectedRoute>
      <AppHeader title="Marketwatch" />
      <WatchlistView initialData={initialCryptoData} />
    </ProtectedRoute>
  );
}
