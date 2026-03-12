import {
  Calendar,
  Users,
  GraduationCap,
  Building2,
  Clock,
  LayoutDashboard,
  Settings,
  LogOut,
  BookOpen,
  Bell
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Timetable", url: "/timetable", icon: Calendar },
  { title: "Subjects", url: "/subjects", icon: BookOpen },
  { title: "Teachers", url: "/teachers", icon: Users },
  { title: "Pupils", url: "/pupils", icon: GraduationCap },
  { title: "Classes", url: "/rooms", icon: Building2 },
  { title: "Time Slots", url: "/time-slots", icon: Clock },
];

const secondaryNavItems = [
  { title: "Notifications", url: "/notifications", icon: Bell, badge: 3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get role display name
  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      department_head: "Head Teacher",
      lecturer: "Teacher",
      student: "Pupil",
    };
    return roleMap[role] || role;
  };

  return (
    <Sidebar collapsible="icon" className="border-r-0 shadow-lg">
      <SidebarHeader className="p-4 border-b border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <div className="sidebar-header-logo bg-transparent shadow-none">
            <img src="/school%20budge.png.png" alt="KPS Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="sidebar-header-title">KPS</span>
              <span className="sidebar-header-subtitle">MANAGEMENT SYSTEM</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="sidebar-group-label">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="sidebar-nav-link"
                      activeClassName="sidebar-nav-link-active"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="font-medium">{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="sidebar-group-label">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <NavLink
                      to={item.url}
                      className="sidebar-nav-link"
                      activeClassName="sidebar-nav-link-active"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span className="flex-1 font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </Badge>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-sidebar-border bg-sidebar-accent/20">
        <div 
          className="sidebar-footer-user cursor-pointer hover:bg-sidebar-accent/50 rounded-xl transition-colors p-2"
          onClick={() => navigate("/settings")}
        >
          <Avatar className="sidebar-footer-avatar">
            <AvatarImage src={user?.avatar_url} className="object-cover" />
            <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="sidebar-footer-name truncate">{user?.name || "User"}</p>
              <p className="sidebar-footer-role truncate">{user ? getRoleDisplay(user.role) : ""}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={handleLogout}
              className="sidebar-logout-btn"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
