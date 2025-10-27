
import { AppHeader } from "@/components/app-header";
import { PositionsView } from "@/components/positions-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function PositionsPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Positions" />
      <PositionsView />
    </ProtectedRoute>
  );
}
