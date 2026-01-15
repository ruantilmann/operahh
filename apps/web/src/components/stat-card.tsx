import { Card } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: string
        positive: boolean
    }
    variant?: "default" | "success" | "warning" | "destructive"
    className?: string
}

export function StatCard({
    title,
    value,
    icon: Icon,
    trend,
    variant = "default",
    className,
}: StatCardProps) {
    const variantStyles = {
        default: "border-l-primary",
        success: "border-l-success",
        warning: "border-l-warning",
        destructive: "border-l-destructive",
    }

    return (
        <Card
            className={cn(
                "p-6 border-l-4 transition-all hover:shadow-md",
                variantStyles[variant],
                className
            )}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                        {title}
                    </p>
                    <p className="text-3xl font-bold text-foreground">{value}</p>
                    {trend && (
                        <p
                            className={cn(
                                "text-sm mt-2",
                                trend.positive ? "text-success" : "text-destructive"
                            )}
                        >
                            {trend.value}
                        </p>
                    )}
                </div>
                <div className="h-12 w-12 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                </div>
            </div>
        </Card>
    )
}
