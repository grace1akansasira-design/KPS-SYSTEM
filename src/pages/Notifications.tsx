import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, BookOpen, Clock, CheckCheck, Trash2, Loader2 } from "lucide-react";
import { useSystemNotifications } from "@/hooks/useSupabaseData";

const getTypeIcon = (type: string) => {
  switch (type) {
    case "timetable":
      return Calendar;
    case "class":
      return BookOpen;
    case "reminder":
      return Clock;
    case "system":
      return Bell;
    default:
      return Bell;
  }
};

const getTypeBadge = (type: string) => {
  switch (type) {
    case "timetable":
      return { label: "Timetable", className: "bg-primary/10 text-primary border-primary/20" };
    case "class":
      return { label: "Class", className: "bg-secondary/10 text-secondary-foreground border-secondary/20" };
    case "reminder":
      return { label: "Reminder", className: "bg-warning/10 text-warning border-warning/20" };
    case "system":
      return { label: "System", className: "bg-muted text-muted-foreground border-muted" };
    default:
      return { label: "General", className: "bg-muted text-muted-foreground" };
  }
};

const Notifications = () => {
  const { data: notificationsData, isLoading } = useSystemNotifications();
  
  const DEFAULT_NOTIFICATIONS = [
    {
      id: "not-1",
      title: "Timetable Generated",
      message: "The academic timetable for Term 1 2025 has been successfully generated and published.",
      type: "timetable",
      read: false,
      time: "2 hours ago"
    },
    {
      id: "not-2",
      title: "New Teacher Added",
      message: "Mr. Robert Mukasa has been added to the faculty registry and assigned to Primary 1.",
      type: "class",
      read: true,
      time: "5 hours ago"
    },
    {
      id: "not-3",
      title: "Maintenance Reminder",
      message: "The Science Lab is scheduled for infrastructure maintenance this Saturday at 10:00 AM.",
      type: "reminder",
      read: false,
      time: "Yesterday"
    },
    {
      id: "not-4",
      title: "System Update",
      message: "KPS School Management System has been updated to version 2.4.0 with new dashboard analytics.",
      type: "system",
      read: true,
      time: "2 days ago"
    }
  ];

  const notifications = notificationsData && notificationsData.length > 0 ? notificationsData : DEFAULT_NOTIFICATIONS;
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="Notifications" description="Manages system alerts and messages — timetable updates, class changes, reminders, and school-wide announcements.">
      <div className="space-y-10">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <CheckCheck className="w-4 h-4" />
              Mark all as read
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4" />
              Clear all
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Notifications</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Unread</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-success/10">
                  <CheckCheck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{notifications.length - unreadCount}</p>
                  <p className="text-sm text-muted-foreground">Read</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notifications List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-1">
              <CardTitle>Recent Notifications</CardTitle>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {notifications.length} notifications
              </div>
            </div>
            <CardDescription>Click on a notification to view details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground font-black uppercase tracking-widest text-[10px]">
                No new notifications found.
              </div>
            ) : (
              notifications.map((notification) => {
                const Icon = getTypeIcon(notification.type);
                const badge = getTypeBadge(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-primary/5 border-primary/20" : "bg-background"
                    }`}
                  >
                    <div className={`p-2 rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                      <Icon className={`w-5 h-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                          {notification.title}
                        </h4>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{notification.message}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant="outline" className={badge.className}>
                          {badge.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
