
import { AppHeader } from "@/components/app-header";
import { ContactView } from "@/components/contact-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function ContactPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Contact Us" hasBack />
      <ContactView />
    </ProtectedRoute>
  );
}
