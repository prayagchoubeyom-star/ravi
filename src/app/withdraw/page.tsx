import { AppHeader } from "@/components/app-header";
import { WithdrawView } from "@/components/withdraw-view";

export default function WithdrawPage() {
  return (
    <>
      <AppHeader title="Withdraw Funds" hasBack />
      <WithdrawView />
    </>
  );
}
