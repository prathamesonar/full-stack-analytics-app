import { NextResponse } from 'next/server';
import prisma from '@/prisma'; 
import { format, parseISO } from 'date-fns';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || 'invoice_date';
    const sortOrder = searchParams.get('order') === 'asc' ? 'asc' : 'desc';

    const whereClause: any = {
      document_type: {
        not: 'creditNote' 
      }
    };

    if (search) {
      whereClause.OR = [
        {
          vendor: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          invoice_number: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        vendor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      take: 10, 
    });

    const formattedInvoices = invoices.map(inv => ({
      vendorName: inv.vendor.name,
      invoiceDate: inv.invoice_date ? format(inv.invoice_date, 'dd.MM.yyyy') : 'N/A',
      invoiceNumber: inv.invoice_number,
      netValue: `${inv.currency_symbol || '€'} ${inv.invoice_total.toFixed(2)}`,
      status: inv.due_date && inv.due_date < new Date() ? 'Overdue' : 'Due',
    }));

    return NextResponse.json(formattedInvoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to fetch invoices' }), { status: 500 });
  }
}