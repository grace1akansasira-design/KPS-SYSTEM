import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, User, BookOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface RecentActivityProps {
  activities: {
    id: string;
    type: 'teacher' | 'pupil' | 'subject' | 'timeslot';
    action: string;
    timestamp: string;
    user?: string;
  }[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'teacher': return User;
      case 'pupil': return User;
      case 'subject': return BookOpen;
      case 'timeslot': return Clock;
      default: return Activity;
    }
  };

  const getVariantStyles = (type: string) => {
    switch (type) {
      case 'teacher': return 'bg-success/10 text-success border-success/20';
      case 'pupil': return 'bg-primary/10 text-primary border-primary/20';
      case 'subject': return 'bg-accent/10 text-accent-foreground border-accent/20';
      case 'timeslot': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'teacher': return 'Faculty';
      case 'pupil': return 'Pupil';
      case 'subject': return 'Curriculum';
      case 'timeslot': return 'Schedule';
      default: return 'System';
    }
  };

  return (
    <Card className="overflow-hidden border-border/40 shadow-xl h-full bg-card/60 backdrop-blur-md group/recent hover:shadow-2xl transition-all duration-500">
      <CardHeader className="pb-4 bg-gradient-to-br from-accent/[0.08] via-transparent to-transparent border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-accent/20 text-accent-foreground shadow-lg shadow-accent/10 transition-transform duration-500 group-hover/recent:rotate-12">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl tracking-tight text-blue-600">Recent Activity</CardTitle>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Live Updates</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/10 max-h-[450px] overflow-y-auto no-scrollbar">
          {activities.length > 0 ? (
            activities.map((activity) => {
              const Icon = getIcon(activity.type);
              return (
                <div key={activity.id} className="p-5 flex items-start gap-4 hover:bg-muted/30 transition-colors group/item">
                  <div className={cn("p-2.5 rounded-xl border shrink-0 transition-transform group-hover/item:scale-110", getVariantStyles(activity.type))}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={cn("text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border", getVariantStyles(activity.type))}>
                        {getActivityLabel(activity.type)}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-1.5 shrink-0">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-foreground leading-snug">
                      {activity.action}
                    </p>
                    {activity.user && (
                      <p className="text-[10px] text-muted-foreground font-medium flex items-center gap-1 uppercase tracking-widest">
                        <User className="w-3 h-3" /> {activity.user}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center mx-auto">
                <Activity className="w-8 h-8 text-muted-foreground/30" />
              </div>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">No activities recorded yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
