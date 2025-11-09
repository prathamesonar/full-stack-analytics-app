import { NextResponse } from 'next/server';
import prisma from '@/prisma'; 

export async function GET() {
  try {
    const topVendors = await prisma.vendor.findMany({
      select: {
        name: true,
        _count: {
          select: { invoices: true },
        },
        invoices: {
          select: {
            invoice_total: true,
          },
        },
      },
    });

    const vendorSpendMap = topVendors.map(vendor => ({
      vendor: vendor.name,
      totalSpend: vendor.invoices.reduce((sum, inv) => sum + inv.invoice_total, 0),
      invoiceCount: vendor._count.invoices,
    }))
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10)
    .map(v => ({
        ...v,
        totalSpend: parseFloat(v.totalSpend.toFixed(2))
    }));


    return NextResponse.json(vendorSpendMap);
  } catch (error) {
    console.error('Error fetching top 10 vendors:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch top vendors' }), { status: 500 });
  }
}
