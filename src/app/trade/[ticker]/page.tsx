import { TradeView } from "@/components/trade-view";
import { AppHeader } from "@/components/app-header";

export default function TradePage({ params }: { params: { ticker: string } }) {
  return (
    <>
      <AppHeader title={`Trade ${params.ticker.toUpperCase()}`} hasBack />
      <TradeView ticker={params.ticker.toUpperCase()} />
    </>
  );
}
