import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Navbar } from "./Navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex-1">
          {/* Top Navbar */}
          <Navbar />

          {/* Page Content */}
          <main className="dashboard-content">
            {(title || description) && (
              <div className="dashboard-header">
                {title && <h1 className="page-header">{title}</h1>}
                {description && <p className="page-description">{description}</p>}
              </div>
            )}
            <div className="content-fade-in">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}