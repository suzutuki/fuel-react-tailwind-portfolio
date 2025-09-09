import React from "react";
import { cn } from "@/lib/utils";

interface GridSectionProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3;
    className?: string;
    title?: string;
}

export const GridSection: React.FC<GridSectionProps> = ({ 
    children, 
    columns = 2, 
    className,
    title 
}) => {
    const gridColsClass = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-3"
    }[columns];

    return (
        <div className={className}>
            {title && (
                <h4 className="text-md font-medium mb-3">{title}</h4>
            )}
            <div className={cn("grid gap-4", gridColsClass)}>
                {children}
            </div>
        </div>
    );
};