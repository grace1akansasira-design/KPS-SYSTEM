import { Bell, Search, Menu, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { ManagementSheet } from "./ManagementSheet";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      department_head: "Head Teacher",
      lecturer: "Teacher",
      student: "Pupil",
    };
    return roleMap[role] || role;
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <SidebarTrigger className="navbar-trigger" />
        <div className="navbar-search">
          <Search className="navbar-search-icon" />
          <Input 
            placeholder="Search teachers, subjects, pupils..." 
            className="navbar-search-input"
          />
        </div>
      </div>

      <div className="navbar-right">
        {/* Global Management Console */}
        <ManagementSheet />

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="navbar-icon-btn"
          onClick={() => navigate("/notifications")}
        >
          <Bell className="w-5 h-5" />
          <Badge className="navbar-notification-badge">
            3
          </Badge>
        </Button>

        {/* Term Info */}
        <div className="navbar-term-info">
          <p className="navbar-term-title">Term 1, 2026</p>
          <p className="navbar-term-subtitle">Week 51 of 52</p>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="navbar-user-btn">
              <Avatar className="navbar-avatar">
                <AvatarImage src={user?.avatar_url} className="object-cover" />
                <AvatarFallback className="navbar-avatar-fallback">
                  {user ? getInitials(user.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="navbar-user-info">
                <span className="navbar-user-name">{user?.name || "User"}</span>
                <span className="navbar-user-role">{user ? getRoleDisplay(user.role) : ""}</span>
              </div>
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              Profile Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/notifications")}>
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive">
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
