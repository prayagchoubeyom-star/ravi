
import { AppHeader } from "@/components/app-header";
import { NewsView } from "@/components/news-view";
import { ProtectedRoute } from "@/components/protected-route";

export default function NewsPage() {
  return (
    <ProtectedRoute>
      <AppHeader title="Crypto News" hasBack />
      <NewsView />
    </ProtectedRoute>
  );
}
