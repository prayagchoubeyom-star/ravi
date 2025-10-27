
import { AdminView } from "@/components/admin-view";
import { AppHeader } from "@/components/app-header";
import { AdminProvider } from "@/context/admin-context";

export default function AdminPage() {
  return (
    <>
      <AppHeader title="Admin Panel" />
      <AdminProvider>
        <AdminView />
      </AdminProvider>
    </>
  );
}
