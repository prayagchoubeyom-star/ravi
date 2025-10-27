
import { AppHeader } from "@/components/app-header";
import { ProtectedRoute } from "@/components/protected-route";
import { WatchlistView } from "@/components/watchlist-view";

export default function WatchlistPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Marketwatch" />
      <WatchlistView />
    </ProtectedRoute>
  );
}
