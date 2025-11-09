

import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { InvoiceTrendChart } from "@/components/charts/InvoiceTrendChart";
import { SpendByVendorChart } from "@/components/charts/SpendByVendorChart";
import { SpendByCategoryChart } from "@/components/charts/SpendByCategoryChart";
import { CashOutflowChart } from "@/components/charts/CashOutflowChart";
import { InvoicesTable } from "@/components/dashboard/InvoicesTable";

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <OverviewCards />
      
      {/* Top Row Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 h-[350px]">
          <InvoiceTrendChart />
        </div>
        <div className="lg:col-span-1 h-[350px]">
          <SpendByVendorChart />
        </div>
      </div>

      {/* Bottom Row Charts and Table */}
      <div className="grid gap-6 lg:grid-cols-4">
        {/* Spend by Category and Cash Outflow combined in one column to match design */}
        <div className="lg:col-span-2 space-y-6">
            <div className="h-[300px]">
                <SpendByCategoryChart />
            </div>
            <div className="h-[300px]">
                <CashOutflowChart />
            </div>
        </div>

        {/* Invoices Table */}
        <div className="lg:col-span-2 h-[636px]"> 
          <InvoicesTable />
        </div>
      </div>
    </div>
  );
}