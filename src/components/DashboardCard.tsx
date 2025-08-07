import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  children?: ReactNode;
  variant?: "default" | "notebook" | "sticky" | "doodle";
  onClick?: () => void;
}

export function DashboardCard({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  variant = "default",
  onClick 
}: DashboardCardProps) {
  const getCardClasses = () => {
    switch (variant) {
      case "notebook":
        return "notebook-paper doodle-border bg-card hover:bg-card/80 shadow-notebook hover:shadow-xl";
      case "sticky":
        return "sticky-note bg-accent hover:bg-accent/90 shadow-sticky";
      case "doodle":
        return "torn-edge bg-muted/20 hover:bg-muted/30 border-2 border-dashed border-primary/30";
      default:
        return "bg-card hover:bg-card/80 border-2 border-border rounded-doodle shadow-notebook hover:shadow-xl";
    }
  };

  return (
    <div 
      className={`
        p-6 transition-all duration-300 cursor-pointer group
        ${getCardClasses()}
        ${onClick ? "hover:scale-105" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <Icon className={`
            h-8 w-8 sketch-icon 
            ${variant === "sticky" ? "text-accent-foreground" : "text-primary"}
            group-hover:animate-float
          `} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`
            font-bold text-lg mb-2
            ${variant === "sticky" ? "font-kalam text-accent-foreground" : "font-inter text-foreground"}
          `}>
            {title}
          </h3>
          
          <p className={`
            text-sm mb-4
            ${variant === "sticky" ? "text-accent-foreground/80" : "text-muted-foreground"}
          `}>
            {description}
          </p>
          
          {children}
        </div>
      </div>
    </div>
  );
}