"use client";

import { DataTable } from "@/components/manager/ui/DataTable";
import { UserSquare2, Clock } from "lucide-react";
import { AnalyticsCard } from "@/components/ui/AnalyticsCard";

const mockStaff = [
  { id: "STF-01", name: "Budi Santoso", role: "Cashier", shift: "Morning", status: "Active", loginTime: "07:45 AM" },
  { id: "STF-02", name: "Siti Aminah", role: "Kitchen", shift: "Morning", status: "Active", loginTime: "07:50 AM" },
  { id: "STF-03", name: "Andi Wijaya", role: "Kitchen", shift: "Evening", status: "Inactive", loginTime: "-" },
  { id: "STF-04", name: "Dewi Lestari", role: "Cashier", shift: "Evening", status: "Inactive", loginTime: "-" },
];

export default function StaffMonitoringPage() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto">
      <div>
        <h1 className="text-3xl font-serif font-bold tracking-tight flex items-center gap-2">
          <UserSquare2 className="w-8 h-8 text-primary" /> Staff Monitoring
        </h1>
        <p className="text-muted-foreground mt-1">Track staff attendance, shifts, and performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnalyticsCard title="Active Staff" value="2/4" icon={UserSquare2} />
        <AnalyticsCard title="Avg Kitchen Prep Time" value="12m" icon={Clock} trend={-1.5} description="vs yesterday" />
      </div>

      <DataTable 
        title="Staff Attendance"
        columns={[
          { header: "Staff ID", accessorKey: "id" },
          { header: "Name", accessorKey: "name" },
          { header: "Role", accessorKey: "role" },
          { header: "Shift", accessorKey: "shift" },
          { header: "Login Time", accessorKey: "loginTime" },
          { 
            header: "Status", 
            accessorKey: "status",
            cell: (row) => (
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                ${row.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}
              >
                {row.status}
              </span>
            )
          },
        ]}
        data={mockStaff}
        searchPlaceholder="Search staff name or role..."
      />
    </div>
  );
}
