import { 
  BookOpen, 
  Upload, 
  Brain,
  FileText,
  Star,
  Home
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: Home,
    description: "Overview & quick access"
  },
  { 
    title: "AI Tutors", 
    url: "/ai-tutors", 
    icon: Brain,
    description: "Chat with AI assistants"
  },
  { 
    title: "Upload Documents", 
    url: "/upload", 
    icon: Upload,
    description: "Add study materials"
  },
  { 
    title: "Study Library", 
    url: "/library", 
    icon: BookOpen,
    description: "Saved documents & notes"
  },
  { 
    title: "Quiz Generator", 
    url: "/quiz", 
    icon: FileText,
    description: "Practice questions"
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Sidebar 
      className={`${!open ? "w-16" : "w-72"} bg-card/80 backdrop-blur-sm border-r-2 border-notebook-line`}
      collapsible="icon"
    >
      <SidebarContent className="relative">
        {/* Notebook tab header */}
        <div className="p-6 border-b-2 border-notebook-line">
          <div className="doodle-border p-4 bg-accent/20">
            <h2 className="font-kalam text-lg font-bold text-center">
              📚 Study Tools
            </h2>
            {open && (
              <p className="text-xs text-muted-foreground text-center mt-1 font-inter">
                Your AI-powered learning companion
              </p>
            )}
          </div>
        </div>

        <SidebarGroup className="px-4">
          <SidebarGroupLabel className="font-kalam text-primary">
            Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {navigationItems.map((item) => {
                const isCurrentlyActive = isActive(item.url);
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url}
                        className={`
                          group relative flex items-center gap-3 p-3 rounded-doodle transition-all duration-300
                          ${isCurrentlyActive 
                            ? "bg-accent text-accent-foreground shadow-sticky sticky-note" 
                            : "hover:bg-muted/50 hover:shadow-notebook"
                          }
                        `}
                      >
                        <item.icon 
                          className={`
                            h-5 w-5 sketch-icon
                            ${isCurrentlyActive ? "text-primary" : "text-muted-foreground"}
                          `} 
                        />
                        
                        {open && (
                          <div className="flex-1">
                            <span className={`
                              font-medium font-inter
                              ${isCurrentlyActive ? "text-primary" : "text-foreground"}
                            `}>
                              {item.title}
                            </span>
                            <p className="text-xs text-muted-foreground font-inter">
                              {item.description}
                            </p>
                          </div>
                        )}
                        
                        {isCurrentlyActive && (
                          <Star className="h-4 w-4 text-accent-foreground animate-wiggle" />
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Decorative notebook elements */}
        {open && (
          <div className="absolute bottom-6 left-6 right-6">
            <div className="torn-edge bg-accent/10 p-4 text-center">
              <p className="text-xs font-kalam text-muted-foreground">
                💡 Tip: Upload your notes to get personalized AI tutoring!
              </p>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}