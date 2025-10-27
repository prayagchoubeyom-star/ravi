import { AppHeader } from "@/components/app-header";
import { ChartsView } from "@/components/charts-view";
import { fetchAllCryptoData } from "@/services/crypto-service";

export default async function ChartsPage() {
  const initialCryptoData = await fetchAllCryptoData();
  return (
    <>
      <AppHeader title="Charts" />
      <ChartsView initialData={initialCryptoData} />
    </>
  );
}
