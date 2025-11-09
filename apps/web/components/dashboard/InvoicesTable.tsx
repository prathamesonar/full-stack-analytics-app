
'use client';

import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
  } from "@/components/ui/card";
  import {
    Table,
    TableHeader, 
    TableBody,
    TableRow,
    TableCell,
    TableHead,
    TableCaption,
  } from "@/components/ui/table";
  
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface Invoice {
    vendorName: string;
    invoiceDate: string;
    invoiceNumber: string;
    netValue: string;
    status: string;
}

export function InvoicesTable() {
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('invoice_date');
    const [order, setOrder] = useState<'asc' | 'desc'>('desc');

    const apiUrl = `/invoices?search=${search}&sort=${sort}&order=${order}`;
    const { data, error, isLoading } = useSWR<Invoice[]>(apiUrl, fetcher);

    const handleSort = (key: string) => {
        if (key === sort) {
            setOrder(order === 'asc' ? 'desc' : 'asc');
        } else {
            setSort(key);
            setOrder('desc');
        }
    };

    const SortIcon = ({ sortKey }: { sortKey: string }) => {
        if (sort !== sortKey) return null;
        return order === 'asc' ? <ChevronUp className="h-4 w-4 inline ml-1" /> : <ChevronDown className="h-4 w-4 inline ml-1" />;
    };

    return (
        <Card className="col-span-4 lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Invoices by Vendor</CardTitle>
                    <p className="text-sm text-muted-foreground">Recent payments and balances.</p>
                </div>
                <Input 
                    placeholder="Search vendor or invoice..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-xs"
                />
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                ) : error ? (
                    <div className="text-red-500">Error loading invoice data.</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('vendor.name')}>
                                    Vendor <SortIcon sortKey="vendor.name" />
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('invoice_number')}>
                                    # Invoice <SortIcon sortKey="invoice_number" />
                                </TableHead>
                                <TableHead className="cursor-pointer" onClick={() => handleSort('invoice_date')}>
                                    Date <SortIcon sortKey="invoice_date" />
                                </TableHead>
                                <TableHead className="text-right cursor-pointer" onClick={() => handleSort('invoice_total')}>
                                    Net Value <SortIcon sortKey="invoice_total" />
                                </TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data?.map((invoice, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{invoice.vendorName}</TableCell>
                                    <TableCell>{invoice.invoiceNumber}</TableCell>
                                    <TableCell>{invoice.invoiceDate}</TableCell>
                                    <TableCell className="text-right">{invoice.netValue}</TableCell>
                                    <TableCell className="text-right">
                                        <span className={invoice.status === 'Overdue' ? "text-red-500 font-medium" : "text-green-500"}>
                                            {invoice.status}
                                        </span>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </CardContent>
        </Card>
    );
}