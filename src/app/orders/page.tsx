import { AppHeader } from "@/components/app-header";
import { OrdersView } from "@/components/orders-view";

export default function OrdersPage() {
  return (
    <>
      <AppHeader title="Orders" />
      <OrdersView />
    </>
  );
}
