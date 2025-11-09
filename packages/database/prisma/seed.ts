
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const rawDataString = fs.readFileSync(path.join(__dirname, '../Analytics_Test_Data.json'), 'utf-8');
const rawData: any[] = JSON.parse(rawDataString); // Parse the string into an array

const prisma = new PrismaClient();

const getNestedValue = (obj: any, path: string) => {
    if (!obj) return undefined;
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return undefined;
        }
    }
    if (value && typeof value === 'object' && 'value' in value) {
        return value.value;
    }
    if (value !== null && value !== undefined) {
      return value;
    }
    return undefined;
};

const parseValidDate = (dateString: string | null | undefined): Date | null => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

const normalizeInvoiceData = (item: any) => {
    if (!item.extractedData || !item.extractedData.llmData) {
      console.warn(`Skipping item with missing llmData: ${item._id}`);
      return null;
    }
    const extractedData = item.extractedData.llmData;

    const vendorName = getNestedValue(extractedData, 'vendor.value.vendorName');
    const invoiceNumber = getNestedValue(extractedData, 'invoice.value.invoiceId');
    const invoiceTotal = getNestedValue(extractedData, 'summary.value.invoiceTotal');

    if (!vendorName || !invoiceNumber || invoiceTotal === undefined) {
        console.warn(`Skipping record with missing essential data (Vendor/ID/Total): ${item._id}`);
        return null;
    }

    const invoice: any = {
        doc_id: item._id, 
        invoice_number: invoiceNumber,
        invoice_date: parseValidDate(getNestedValue(extractedData, 'invoice.value.invoiceDate')),
        delivery_date: parseValidDate(getNestedValue(extractedData, 'invoice.value.deliveryDate')),
        sub_total: getNestedValue(extractedData, 'summary.value.subTotal') || 0,
        total_tax: getNestedValue(extractedData, 'summary.value.totalTax') || 0,
        invoice_total: invoiceTotal,
        currency_symbol: getNestedValue(extractedData, 'summary.value.currencySymbol'),
        document_type: getNestedValue(extractedData, 'summary.value.documentType'),
        due_date: parseValidDate(getNestedValue(extractedData, 'payment.value.dueDate')),
        net_days: getNestedValue(extractedData, 'payment.value.netDays'),
    };

    const vendor = {
        name: vendorName,
        address: getNestedValue(extractedData, 'vendor.value.vendorAddress'),
        tax_id: getNestedValue(extractedData, 'vendor.value.vendorTaxId'),
    };

    const lineItems = getNestedValue(extractedData, 'lineItems.value.items.value') || [];
    
    const normalizedLineItems = lineItems.map((line: any, index: number) => ({
        sr_no: getNestedValue(line, 'srNo') || index + 1,
        description: getNestedValue(line, 'description') || 'No Description',
        quantity: getNestedValue(line, 'quantity') || 0,
        unit_price: getNestedValue(line, 'unitPrice') || 0,
        total_price: getNestedValue(line, 'totalPrice') || 0,
        sachkonto: getNestedValue(line, 'Sachkonto') ? String(getNestedValue(line, 'Sachkonto')) : null,
        bus_schluessel: getNestedValue(line, 'BUSchluessel') ? String(getNestedValue(line, 'BUSchluessel')) : null,
        vat_rate: getNestedValue(line, 'vatRate') || 0,
        vat_amount: getNestedValue(line, 'vatAmount') || 0,
    }));

    return { invoice, vendor, lineItems: normalizedLineItems };
};

async function main() {
    console.log('Start seeding...');

    await prisma.lineItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.vendor.deleteMany();
    console.log('Cleaned up existing records.');

    let processedCount = 0;
    for (const item of rawData) {
        const data = normalizeInvoiceData(item);

        if (data) {
            try {
                // Find or create Vendor
                let vendorRecord = await prisma.vendor.findUnique({
                    where: { name: data.vendor.name },
                });

                if (!vendorRecord) {
                    vendorRecord = await prisma.vendor.create({
                        data: {
                            name: data.vendor.name,
                            address: data.vendor.address,
                            tax_id: data.vendor.tax_id,
                        },
                    });
                }

                // Create Invoice
                const invoiceRecord = await prisma.invoice.create({
                    data: {
                        ...data.invoice,
                        vendor_id: vendorRecord.id,
                    },
                });

                // Create Line Items
                if (data.lineItems.length > 0) {
                    const lineItemData = data.lineItems.map(line => ({
                        ...line,
                        invoice_id: invoiceRecord.id,
                    }));
                    await prisma.lineItem.createMany({
                        data: lineItemData,
                    });
                }
                processedCount++;
            } catch (e) {
                console.error(`Failed to process item ${item._id}:`, e);
            }
        }
    }

    console.log(`Seeding finished successfully! Processed ${processedCount} valid records.`);
}

main()
    .catch((e) => {
        console.error('Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });