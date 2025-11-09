
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ChartCardProps {
  title: string;
  className?: string;
  children: React.ReactNode;
  isLoading: boolean;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, className, children, isLoading }) => (
  <Card className={cn("h-full", className)}>
    <CardHeader className="pb-3">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="h-[calc(100%-70px)] pb-0">
      {isLoading ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        children
      )}
    </CardContent>
  </Card>
);