
import { AppHeader } from "@/components/app-header";
import { ChartsView } from "@/components/charts-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function ChartsPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Charts" />
      <ChartsView />
    </ProtectedRoute>
  );
}
