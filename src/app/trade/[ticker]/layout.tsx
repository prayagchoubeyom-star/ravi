
import { cryptos } from "@/lib/data";

// This function generates the static paths for each crypto ticker at build time.
export async function generateStaticParams() {
  // We need to provide a list of all possible tickers so Next.js can pre-render them.
  return cryptos.map((crypto) => ({
    ticker: crypto.ticker,
  }));
}

export default function TradeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
