import { NextResponse } from 'next/server';
import prisma from '@/prisma'; 
import { startOfYear, format } from 'date-fns';


export async function GET() {
  try {
    const now = new Date();
    const startOfYTD = startOfYear(now); 

    // Total Spend (YTD)
    const totalSpendResult = await prisma.invoice.aggregate({
      _sum: {
        invoice_total: true,
      },
      where: {
        invoice_date: {
          gte: startOfYTD,
        },
      },
    });
    const totalSpend = totalSpendResult._sum.invoice_total || 0;

    // Total Invoices Processed
    const totalInvoicesProcessed = await prisma.invoice.count();

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const documentsUploaded = await prisma.invoice.count({
        where: {
            invoice_date: {
                gte: oneMonthAgo,
            }
        }
    });

    // Average Invoice Value
    const avgInvoiceValueResult = await prisma.invoice.aggregate({
      _avg: {
        invoice_total: true,
      },
    });
    const avgInvoiceValue = avgInvoiceValueResult._avg.invoice_total || 0;

    return NextResponse.json({
      totalSpend: parseFloat(totalSpend.toFixed(2)),
      totalInvoicesProcessed,
      documentsUploaded,
      averageInvoiceValue: parseFloat(avgInvoiceValue.toFixed(2)),
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch statistics' }), { status: 500 });
  }
}