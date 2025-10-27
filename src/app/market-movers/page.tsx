
import { AppHeader } from "@/components/app-header";
import { MarketMoversView } from "@/components/market-movers-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function MarketMoversPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Market Movers" hasBack />
      <MarketMoversView />
    </ProtectedRoute>
  );
}
