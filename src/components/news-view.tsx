
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const newsItems = [
  {
    id: 1,
    title: "Bitcoin Surges Past $70,000 as Market Sentiment Improves",
    source: "Crypto News Daily",
    date: "2 hours ago",
    description: "Bitcoin has seen a significant price increase, breaking the $70,000 resistance level amidst a wave of positive institutional news.",
    link: "#"
  },
  {
    id: 2,
    title: "Ethereum's Dencun Upgrade: Lower Fees and Enhanced Scalability",
    source: "ETH Times",
    date: "1 day ago",
    description: "The recent Dencun upgrade on the Ethereum network has led to a dramatic reduction in transaction fees for Layer 2 solutions.",
    link: "#"
  },
  {
    id: 3,
    title: "Solana DeFi Ecosystem Hits New All-Time High in TVL",
    source: "DeFi Pulse",
    date: "3 days ago",
    description: "The total value locked in Solana's decentralized finance protocols has exceeded previous records, signaling strong developer and user activity.",
    link: "#"
  },
   {
    id: 4,
    title: "Regulatory Landscape for Crypto Clarifies in Europe",
    source: "Blockchain Ledger",
    date: "4 days ago",
    description: "New MiCA regulations are set to provide a comprehensive framework for crypto-assets in the European Union, potentially boosting adoption.",
    link: "#"
  },
];

export function NewsView() {
  return (
    <div className="p-4 space-y-4">
      {newsItems.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">{item.title}</CardTitle>
            <CardDescription>{item.source} - {item.date}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <Button variant="outline" asChild>
                <a href={item.link} target="_blank" rel="noopener noreferrer">Read More</a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
