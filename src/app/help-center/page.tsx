
import { AppHeader } from "@/components/app-header";
import { HelpCenterView } from "@/components/help-center-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function HelpCenterPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Help Center" hasBack />
      <HelpCenterView />
    </ProtectedRoute>
  );
}
