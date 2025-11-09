

'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface TrendData {
  month: string;
  count: number;
  totalSpend: number;
}

export function InvoiceTrendChart() {
  const { data, error, isLoading } = useSWR<TrendData[]>('/invoice-trends', fetcher);

  if (error) return <div>Failed to load data</div>;

  return (
    <ChartCard title="Invoice Volume + Value Trend" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data || []} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} tickLine={false} axisLine={false} orientation="left" />
          <YAxis yAxisId="right" stroke="#82ca9d" fontSize={12} tickLine={false} axisLine={false} orientation="right" />
          <Tooltip 
            formatter={(value: number, name: string) => {
              if (name === 'Volume') return `${value.toFixed(0)} Invoices`;
              return `€${value.toFixed(2)} Spend`;
            }}
          />
          <Line yAxisId="left" type="monotone" dataKey="totalSpend" stroke="#8884d8" name="Total Spend" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="count" stroke="#82ca9d" name="Volume" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}