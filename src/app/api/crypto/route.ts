
import { NextResponse } from 'next/server';
import { getLiveCryptoData } from '@/services/crypto-service';

// This API route now uses the shared data fetching logic.
export async function GET() {
  try {
    const data = await getLiveCryptoData();
    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// This tells Next.js to treat this route as dynamic, ensuring it's not cached incorrectly.
export const dynamic = 'force-dynamic';
