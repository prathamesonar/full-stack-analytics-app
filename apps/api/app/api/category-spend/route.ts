import { NextResponse } from 'next/server';
import prisma from '@/prisma'; 

const mapSachkontoToCategory = (sachkonto: string | null) => {
  if (!sachkonto) return 'Uncategorized';
  
  if (sachkonto.startsWith('44')) return 'Services/Marketing';
  if (sachkonto.startsWith('34')) return 'Products/Goods';
  if (sachkonto.startsWith('42')) return 'Operating Expenses';
  if (sachkonto === '4925') return 'Subscription Fee';
  
  return 'Other Operations';
};

export async function GET() {
  try {
    const lineItems = await prisma.lineItem.findMany({
      select: {
        total_price: true,
        sachkonto: true,
      },
    });

    const categorySpendMap = new Map<string, number>();

    for (const item of lineItems) {
      const category = mapSachkontoToCategory(item.sachkonto);
      const spend = item.total_price;
      
      const currentSpend = categorySpendMap.get(category) || 0;
      categorySpendMap.set(category, currentSpend + spend);
    }

    const categoryData = Array.from(categorySpendMap.entries()).map(([category, total]) => ({
      category: category,
      value: parseFloat(total.toFixed(2)),
    }))
    .filter(item => item.value > 0);

    return NextResponse.json(categoryData);
  } catch (error) {
    console.error('Error fetching category spend:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch category spend' }), { status: 500 });
  }
}