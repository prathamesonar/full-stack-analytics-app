
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Upload, TrendingUp, Zap, Loader2 } from "lucide-react";
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { cn } from '@/lib/utils';

interface StatsData {
  totalSpend: number;
  totalInvoicesProcessed: number;
  documentsUploaded: number;
  averageInvoiceValue: number;
}

const overviewCardsData = [
  {
    key: 'totalSpend',
    title: "Total Spend (YTD)",
    icon: DollarSign,
    format: (value: number) => `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
    trend: "+8.2%", 
    trendLabel: "from last month",
    trendColor: "text-green-500",
  },
  {
    key: 'totalInvoicesProcessed',
    title: "Total Invoices Processed",
    icon: FileText,
    format: (value: number) => `${value.toLocaleString()}`,
    trend: "+8.2%", 
    trendLabel: "from last month",
    trendColor: "text-green-500",
  },
  {
    key: 'documentsUploaded',
    title: "Documents Uploaded (This Month)",
    icon: Upload,
    format: (value: number) => `${value.toLocaleString()}`,
    trend: "-8 less", 
    trendLabel: "from last month",
    trendColor: "text-red-500",
  },
  {
    key: 'averageInvoiceValue',
    title: "Average Invoice Value",
    icon: Zap,
    format: (value: number) => `€ ${value.toLocaleString('de-DE', { minimumFractionDigits: 2 })}`,
    trend: "+8.2%", 
    trendLabel: "from last month",
    trendColor: "text-green-500",
  },
];

export function OverviewCards() {
  const { data, error, isLoading } = useSWR<StatsData>('/stats', fetcher);

  if (error) return <div>Failed to load overview data.</div>;
  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {overviewCardsData.map((card) => (
                <Card key={card.key}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">...</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {overviewCardsData.map((card) => {
        const value = data ? (data as any)[card.key] : 0;
        const Icon = card.icon;
        
        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {card.format(value)}
              </div>
              <p className={cn("text-xs pt-1", card.trendColor)}>
                {card.trend} {card.trendLabel}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}