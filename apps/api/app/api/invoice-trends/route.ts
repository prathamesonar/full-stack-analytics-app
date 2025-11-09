import { NextResponse } from 'next/server';
import prisma from '@/prisma'; // <-- FIX
import { format, parseISO } from 'date-fns';


export async function GET() {
  try {
    const rawInvoices = await prisma.invoice.findMany({
      select: {
        invoice_date: true,
        invoice_total: true,
        document_type: true,
      },
      where: {
        invoice_date: {
          not: null,
        },
      },
    });

    const monthlyDataMap = new Map<string, { month: string, count: number, totalSpend: number }>();

    for (const invoice of rawInvoices) {
      if (invoice.invoice_date) {
        const date = invoice.invoice_date; 
        const monthKey = format(date, 'MMM yyyy'); 
        const total = invoice.invoice_total;

        if (!monthlyDataMap.has(monthKey)) {
          monthlyDataMap.set(monthKey, { month: monthKey, count: 0, totalSpend: 0 });
        }

        const current = monthlyDataMap.get(monthKey)!;
        current.count += 1;
        current.totalSpend += total;
      }
    }
    
    const parseMonthString = (monthString: string): Date => {
      const [monthAbbr, year] = monthString.split(' ');
      const monthIndex = new Date(Date.parse(monthAbbr +" 1, 2012")).getMonth();
      return new Date(parseInt(year), monthIndex);
    };

    const monthlyData = Array.from(monthlyDataMap.values())
      .sort((a, b) => parseMonthString(a.month).getTime() - parseMonthString(b.month).getTime())
      .map(item => ({
        ...item,
        totalSpend: parseFloat(item.totalSpend.toFixed(2)),
      }));

    return NextResponse.json(monthlyData);
  } catch (error) {
    console.error('Error fetching invoice trends:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch invoice trends' }), { status: 500 });
  }
}