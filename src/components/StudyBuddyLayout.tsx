import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

interface StudyBuddyLayoutProps {
  children: React.ReactNode;
}

export function StudyBuddyLayout({ children }: StudyBuddyLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full notebook-paper">
        {/* Spiral binding effect */}
        <div className="spiral-binding" />
        
        <AppSidebar />
        
        <main className="flex-1 relative">
          {/* Header with notebook tab styling */}
          <header className="h-16 flex items-center justify-between px-6 border-b-2 border-notebook-line bg-card/50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="sketch-icon" />
              <h1 className="text-2xl font-kalam font-bold text-primary">
                📝 Study Buddy
              </h1>
            </div>
            
            {/* Decorative doodles */}
            <div className="hidden md:flex items-center gap-2 text-muted-foreground">
              <span className="text-sm font-kalam">✨ Happy Learning! ✨</span>
            </div>
          </header>
          
          {/* Main content area */}
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}