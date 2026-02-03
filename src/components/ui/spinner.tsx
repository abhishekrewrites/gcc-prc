import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
    className?: string;
}

export function Spinner({ size = 24, className, ...props }: SpinnerProps) {
    return (
        <Loader2
            className={cn("animate-spin text-muted-foreground", className)}
            size={size}
            {...props}
        />
    );
}
