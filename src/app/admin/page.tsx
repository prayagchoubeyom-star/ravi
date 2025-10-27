
import { AdminView } from "@/components/admin-view";
import { AppHeader } from "@/components/app-header";
import { ProtectedRoute } from "@/components/protected-route";
import { AdminProvider } from "@/context/admin-context";

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Admin Panel" />
      <AdminProvider>
        <AdminView />
      </AdminProvider>
    </ProtectedRoute>
  );
}
