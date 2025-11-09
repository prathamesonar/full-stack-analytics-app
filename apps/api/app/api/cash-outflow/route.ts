
import { NextResponse } from 'next/server';
import prisma from '@/prisma';
import { differenceInDays } from 'date-fns';

const BUCKET_RANGES = [
  { label: 'Overdue', maxDays: -1 }, 
  { label: '0 - 7 days', maxDays: 7 },
  { label: '8 - 30 days', maxDays: 30 },
  { label: '31 - 60 days', maxDays: 60 },
  { label: '60+ days', maxDays: Infinity },
];

export async function GET() {
  try {
    const today = new Date();

    const buckets: { [key: string]: number } = BUCKET_RANGES.reduce((acc, range) => {
      acc[range.label] = 0;
      return acc;
    }, {} as { [key: string]: number });

    const overdueInvoices = await prisma.invoice.findMany({
      where: {
        due_date: {
          lt: today,
          not: null,
        },
        document_type: 'invoice',
      },
    });

    const forthcomingInvoices = await prisma.invoice.findMany({
      where: {
        due_date: {
          gte: today,
          not: null,
        },
        document_type: 'invoice',
      },
    });

    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + inv.invoice_total, 0);
    buckets['Overdue'] = parseFloat(overdueTotal.toFixed(2));

    for (const invoice of forthcomingInvoices) {
      if (invoice.due_date) {
        const daysUntilDue = differenceInDays(invoice.due_date, today);
        const total = invoice.invoice_total;

        let assigned = false;
        for (const range of BUCKET_RANGES) {
          if (range.label === 'Overdue') continue; 

          if (daysUntilDue <= range.maxDays) {
            buckets[range.label] += total;
            assigned = true;
            break;
          }
        }

        if (!assigned) {
          buckets['60+ days'] += total;
        }
      }
    }

    const finalData = BUCKET_RANGES.map(range => ({
      label: range.label,
      amount: parseFloat(buckets[range.label].toFixed(2)),
    }));

    return NextResponse.json(finalData);
  } catch (error) {
    console.error('Error fetching cash outflow forecast:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch cash outflow forecast' }),
      { status: 500 }
    );
  }
}