import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressCardProps {
  subject: string;
  progress: number;
  color?: string;
  className?: string;
}

export function ProgressCard({
  subject,
  progress,
  color = "bg-primary",
  className,
}: ProgressCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-accent/30",
        className
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", color)} />
          <span className="truncate text-sm font-medium">{subject}</span>
        </div>
        <span className="shrink-0 text-sm font-semibold tabular-nums">{progress}%</span>
      </div>
      <Progress value={progress} className="h-1.5" />
    </div>
  );
}
