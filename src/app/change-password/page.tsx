
import { AppHeader } from "@/components/app-header";
import { ChangePasswordView } from "@/components/change-password-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function ChangePasswordPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Change Password" hasBack />
      <ChangePasswordView />
    </ProtectedRoute>
  );
}
