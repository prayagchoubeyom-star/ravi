
'use client';
import { useCryptoData } from "@/hooks/use-crypto-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Skeleton } from "./ui/skeleton";
import { CryptoIcon } from "./crypto-icon";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function MarketMoversView() {
    const { allCryptos, loading } = useCryptoData();

    const sortedByChange = [...allCryptos].sort((a, b) => b.change24h - a.change24h);
    const topGainers = sortedByChange.slice(0, 10);
    const topLosers = sortedByChange.slice(-10).reverse();

    const renderMoverTable = (movers: typeof topGainers) => {
        if (loading) {
            return (
                <div className="space-y-2">
                    {Array.from({length: 5}).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
            )
        }
        
        if (movers.length === 0) {
            return <p className="text-muted-foreground text-center p-4">No data available.</p>;
        }

        return (
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Asset</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Change</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {movers.map(crypto => (
                             <TableRow key={crypto.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                    <CryptoIcon ticker={crypto.ticker} className="h-8 w-8" />
                                    <div>
                                        <div className="font-bold">{crypto.ticker}</div>
                                        <div className="text-sm text-muted-foreground">{crypto.name}</div>
                                    </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    ${crypto.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </TableCell>
                                <TableCell
                                    className={cn(
                                    'text-right font-medium',
                                    crypto.change24h >= 0 ? 'text-[hsl(142,76%,42%)]' : 'text-[hsl(0,84%,60%)]'
                                    )}
                                >
                                    {crypto.change24h >= 0 ? '+' : ''}
                                    {crypto.change24h.toFixed(2)}%
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <div className="p-4">
            <Tabs defaultValue="gainers">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
                    <TabsTrigger value="losers">Top Losers</TabsTrigger>
                </TabsList>
                <TabsContent value="gainers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 10 Gainers (24h)</CardTitle>
                             <CardDescription>Cryptocurrencies with the highest price increase in the last 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderMoverTable(topGainers)}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="losers">
                    <Card>
                        <CardHeader>
                            <CardTitle>Top 10 Losers (24h)</CardTitle>
                            <CardDescription>Cryptocurrencies with the largest price decrease in the last 24 hours.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {renderMoverTable(topLosers)}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
