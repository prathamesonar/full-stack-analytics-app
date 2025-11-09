
'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ChartCard } from './ChartCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface OutflowData {
  label: string;
  amount: number;
}

export function CashOutflowChart() {
  const { data, error, isLoading } = useSWR<OutflowData[]>('/cash-outflow', fetcher);

  if (error) return <div>Failed to load data</div>;

  // Custom colors - dark navy for data, light gray for empty
  const getBarColor = (index: number, value: number) => {
    return value > 0 ? '#1e1b4b' : '#e5e7eb'; // dark navy or light gray
  };

  return (
    <ChartCard title="Cash Outflow Forecast" isLoading={isLoading}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={data || []} 
          margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey="label" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            stroke="#9ca3af"
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `€${(value / 1000).toFixed(0)}k`}
            stroke="#9ca3af"
          />
          <Tooltip 
            formatter={(value: number) => [`€${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, 'Amount']}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb' }}
          />
          <Bar 
            dataKey="amount" 
            radius={[8, 8, 0, 0]}
            isAnimationActive={true}
          >
            {data?.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(index, entry.amount)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}