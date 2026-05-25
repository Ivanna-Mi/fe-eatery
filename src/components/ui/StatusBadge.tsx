import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  let colorClass = "bg-gray-500/10 text-gray-500"; // default

  switch (status.toLowerCase()) {
    case "success":
    case "completed":
    case "paid":
      colorClass = "bg-green-500/10 text-green-600";
      break;
    case "pending":
    case "preparing":
      colorClass = "bg-orange-500/10 text-orange-600";
      break;
    case "failed":
    case "cancelled":
      colorClass = "bg-red-500/10 text-red-600";
      break;
    case "ready":
    case "confirmed":
      colorClass = "bg-blue-500/10 text-blue-600";
      break;
  }

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase", colorClass, className)}>
      {status}
    </span>
  );
}
