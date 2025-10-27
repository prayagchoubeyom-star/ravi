
import type { Crypto } from "@/lib/data";

export async function fetchAllCryptoData(): Promise<Crypto[]> {
    try {
        // Fetch data from our own API route
        const response = await fetch('/api/crypto');

        if (!response.ok) {
            console.error(`Failed to fetch from internal API: ${response.statusText}`);
            return [];
        }
        
        const data: Crypto[] = await response.json();
        return data;

    } catch (error) {
        console.error("Error fetching all crypto data:", error);
        return [];
    }
}
