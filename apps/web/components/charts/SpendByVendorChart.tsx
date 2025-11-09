
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface VendorSpend {
  vendor: string;
  totalSpend: number;
  invoiceCount: number;
}

export function SpendByVendorChart() {
  const { data, error, isLoading } = useSWR<VendorSpend[]>('/vendors/top10', fetcher);

 
  if (isLoading) return <ChartCard title="Spend by Vendor (Top 10)" isLoading={isLoading}><div className="h-full"></div></ChartCard>;
  if (error || !data) return <ChartCard title="Spend by Vendor (Top 10)" isLoading={false}><div className="flex h-full items-center justify-center text-red-500">Failed to load data</div></ChartCard>;
  if (data.length === 0) return <ChartCard title="Spend by Vendor (Top 10)" isLoading={false}><div className="flex h-full items-center justify-center text-gray-500">No data available</div></ChartCard>;

  
  return (
    <ChartCard title="Spend by Vendor (Top 10)" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart layout="vertical" data={data} margin={{ top: 0, right: 20, left: 100, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis 
            type="number" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `€${value.toLocaleString()}`} 
          />
          <YAxis type="category" dataKey="vendor" fontSize={12} tickLine={false} axisLine={false} width={100} />
          <Tooltip 
            cursor={{ fill: 'hsl(var(--muted))' }}
            formatter={(value: number, name: string) => [`€${value.toFixed(2)}`, "Total Spend"]} 
          />
          <Bar dataKey="totalSpend" fill="hsl(var(--primary))" radius={[4, 4, 4, 4]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}