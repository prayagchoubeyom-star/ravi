import { NextResponse } from 'next/server';
import type { BinanceTicker } from '@/lib/binance-types';

export const dynamic = 'force-dynamic'; // defaults to auto
// To handle a GET request to /api
export async function GET(request: Request) {
  try {
    const response = await fetch('https://api.binance.com/api/v3/ticker/24hr', {
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Binance API: ${response.statusText}`);
    }

    const data: BinanceTicker[] = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error in API route:", error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
