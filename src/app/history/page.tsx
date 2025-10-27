
import { AppHeader } from "@/components/app-header";
import { HistoryView } from "@/components/history-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Transaction History" hasBack />
      <HistoryView />
    </ProtectedRoute>
  );
}
