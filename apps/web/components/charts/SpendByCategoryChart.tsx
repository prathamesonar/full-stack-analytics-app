

'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartCard } from './ChartCard';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

interface CategorySpend {
  category: string;
  value: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export function SpendByCategoryChart() {
  const { data, error, isLoading } = useSWR<CategorySpend[]>('/category-spend', fetcher);

  if (error) return <div>Failed to load data</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || data.length === 0) return <div>No data available</div>;

  const totalSpend = data.reduce((sum, item) => sum + (item.value || 0), 0);
  
  const formattedData = data.map(item => ({
    ...item,
    value: item.value || 0,
    name: `${item.category} (€${(item.value || 0).toFixed(2)})`,
  }));

  return (
    <ChartCard title="Spend by Category" isLoading={isLoading}>
      <div className="flex flex-row items-center justify-between h-full gap-8 pt-4">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={formattedData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {formattedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => `${(value / totalSpend * 100).toFixed(1)}%`}
                labelFormatter={() => `Total: €${totalSpend.toFixed(2)}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col space-y-2 text-sm min-w-fit">
          {formattedData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2 whitespace-nowrap">
              <div 
                className="h-3 w-3 rounded-full flex-shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <span>{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}