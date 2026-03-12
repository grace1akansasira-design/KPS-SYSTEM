import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Clock, User, BookOpen, Sparkles, Calendar } from "lucide-react";
import { useTodaySchedule } from "@/hooks/useSupabaseData";
import { cn } from "@/lib/utils";

export function TodaySchedule() {
  const { data: schedule, isLoading } = useTodaySchedule();
  const today = format(new Date(), 'EEEE, MMMM do');

  const getTimeStatus = (startTime: string) => {
    const now = new Date();
    const [hours, minutes] = startTime.split(':').map(Number);
    const sessionTime = new Date();
    sessionTime.setHours(hours, minutes, 0);

    if (now > sessionTime) return 'past';
    
    const diffHours = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (diffHours < 1) return 'soon';
    
    return 'upcoming';
  };

  const statusStyles = {
    past: "opacity-40 grayscale-[0.5]",
    soon: "ring-2 ring-primary ring-offset-2 scale-[1.02] shadow-xl",
    upcoming: "opacity-100"
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <Card className="overflow-hidden border-border/40 shadow-xl bg-card/60 backdrop-blur-md group/schedule hover:shadow-2xl transition-all duration-500 rounded-[2rem]">
      <CardHeader className="pb-4 bg-gradient-to-br from-primary/[0.08] via-transparent to-transparent border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/20 text-primary shadow-lg shadow-primary/10 transition-transform duration-500 group-hover/schedule:rotate-12">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="text-xl tracking-tight uppercase text-blue-600">Today's Schedule</CardTitle>
              <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em] mt-0.5">Academic Agenda</p>
            </div>
          </div>
          <Badge variant="outline" className="font-black text-[10px] uppercase tracking-widest bg-primary/5 border-primary/20 text-primary px-3 py-1 rounded-full shadow-sm">
            {today}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedule && schedule.length > 0 ? (
            schedule.map((slot) => {
              const status = getTimeStatus(slot.start_time);
              return (
                <div 
                  key={slot.id} 
                  className={cn(
                    "p-6 rounded-2xl border bg-card/50 transition-all duration-300 group/item relative overflow-hidden",
                    statusStyles[status as keyof typeof statusStyles]
                  )}
                >
                  <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-xl border border-border/10">
                        <Clock className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-black tracking-tight">
                          {slot.start_time} - {slot.end_time}
                        </span>
                      </div>
                      {status === 'soon' && (
                        <span className="flex h-2 w-2 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-foreground uppercase tracking-tight leading-tight">
                        {slot.subjects?.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-2">
                        <User className="w-3 h-3" />
                        {slot.teachers?.name}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-2 pt-4 border-t border-border/5">
                      <div className="p-1.5 rounded-lg bg-accent/20">
                        <BookOpen className="w-3 h-3 text-accent-foreground" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/item:text-primary transition-colors">
                        Room {slot.rooms?.name}
                      </span>
                    </div>
                  </div>
                  
                  {/* Decorative background number */}
                  <div className="absolute -bottom-4 -right-2 text-8xl font-black text-foreground/[0.03] italic -rotate-12 pointer-events-none group-hover/item:scale-110 transition-transform">
                    {slot.start_time.split(':')[0]}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center space-y-4 bg-muted/10 rounded-[2rem] border border-dashed border-border/50">
              <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center mx-auto ring-8 ring-muted/10">
                <Calendar className="w-10 h-10 text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-black text-muted-foreground/50 uppercase tracking-tight">No Classes Scheduled</p>
                <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.3em]">Enjoy the break!</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
