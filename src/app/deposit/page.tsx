import { AppHeader } from "@/components/app-header";
import { DepositView } from "@/components/deposit-view";

export default function DepositPage() {
  return (
    <>
      <AppHeader title="Deposit" hasBack />
      <DepositView />
    </>
  );
}
