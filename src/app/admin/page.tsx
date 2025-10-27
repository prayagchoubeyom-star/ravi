
import { AdminView } from "@/components/admin-view";
import { AppHeader } from "@/components/app-header";

export default function AdminPage() {
  return (
    <>
      <AppHeader title="Admin Panel" />
      <AdminView />
    </>
  );
}
