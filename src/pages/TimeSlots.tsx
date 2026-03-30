import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTimeSlots, useAddTimeSlot, useDeleteTimeSlot, type TimeSlot } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, MoreHorizontal, Clock, Calendar, MapPin, User, Loader2, Plus, ListFilter, CalendarPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AddTimeSlotForm } from "@/components/forms/AddTimeSlotForm";
import { EditTimeSlotDialog } from "@/components/dialogs/EditTimeSlotDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const TimeSlots = () => {
  const { data: timeSlotsFromQuery = [], isLoading } = useTimeSlots();
  
  const DEFAULT_TIME_SLOTS: TimeSlot[] = [
    { 
      id: 'ts-def-1', 
      day: 'Monday', 
      start_time: '08:00', 
      end_time: '09:00', 
      subject: 'Mathematics', 
      teacher: 'Mr. Robert Mukasa', 
      room: 'Class A1', 
      type: 'lesson',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'ts-def-2', 
      day: 'Monday', 
      start_time: '09:00', 
      end_time: '10:00', 
      subject: 'Literacy', 
      teacher: 'Mrs. Musisi Sarah', 
      room: 'Class B2', 
      type: 'lesson',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'ts-def-3', 
      day: 'Tuesday', 
      start_time: '10:30', 
      end_time: '12:00', 
      subject: 'Science Lab', 
      teacher: 'Teacher Monica', 
      room: 'Science Lab', 
      type: 'practical',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const timeSlots = timeSlotsFromQuery.length > 0 ? timeSlotsFromQuery : DEFAULT_TIME_SLOTS;
  
  const deleteTimeSlot = useDeleteTimeSlot();
  const addTimeSlot = useAddTimeSlot();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedDay, setSelectedDay] = useState<string>('all');
  const [editSlot, setEditSlot] = useState<TimeSlot | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TimeSlot | null>(null);

  const filteredSlots = selectedDay === 'all' ? timeSlots : timeSlots.filter(slot => slot.day === selectedDay);

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'lesson': 'bg-primary/10 text-primary border-primary/20',
      'practical': 'bg-success/10 text-success border-success/20',
      'games': 'bg-warning/10 text-warning border-warning/20',
    };
    return <Badge variant="outline" className={`font-black uppercase text-[8px] tracking-widest px-2 py-0.5 ${colors[type] || ''}`}>{type}</Badge>;
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = { 'Monday': 'bg-primary', 'Tuesday': 'bg-secondary', 'Wednesday': 'bg-success', 'Thursday': 'bg-warning', 'Friday': 'bg-accent' };
    return colors[day] || 'bg-muted';
  };

  const uniqueRooms = new Set(timeSlots.map(s => s.room)).size;
  const uniqueTeachers = new Set(timeSlots.map(s => s.teacher)).size;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTimeSlot.mutateAsync(deleteTarget.id);
      toast({ title: "Time Slot Deleted", description: "The time slot has been removed." });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Schedule Management" description="Manages the daily timetable slots — lesson periods, teachers on duty, assigned rooms, and the full weekly academic schedule.">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10 shadow-inner"><Clock className="w-6 h-6 text-primary" /></div><div><p className="text-2xl font-black tracking-tight">{timeSlots.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Slots</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10 shadow-inner"><Calendar className="w-6 h-6 text-success" /></div><div><p className="text-2xl font-black tracking-tight">5</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Days Active</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-warning/10 shadow-inner"><MapPin className="w-6 h-6 text-warning" /></div><div><p className="text-2xl font-black tracking-tight">{uniqueRooms}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classes Used</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-accent/20 shadow-inner"><User className="w-6 h-6 text-accent-foreground" /></div><div><p className="text-2xl font-black tracking-tight">{uniqueTeachers}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Faculty On-Call</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/20 shadow-sm">
          <TabsTrigger value="list" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
            <ListFilter className="w-4 h-4 mr-2" /> Master Schedule
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <CalendarPlus className="w-4 h-4 mr-2" /> Create Slot
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="animate-in fade-in-50 duration-500 outline-none">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search schedule..." className="pl-10 h-11 border-border/40 bg-card/60 backdrop-blur-sm" /></div>
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-44 h-11 border-border/40 bg-card/60 backdrop-blur-sm font-black uppercase text-[10px] tracking-widest"><SelectValue placeholder="All academic days" /></SelectTrigger>
              <SelectContent className="bg-popover border-border/40 p-2 rounded-2xl shadow-2xl">
                <SelectItem value="all" className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-2.5">Full Week</SelectItem>
                {days.map(day => (<SelectItem key={day} value={day} className="rounded-xl font-bold uppercase text-[10px] tracking-widest py-2.5">{day}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <Card className="data-table border-border/40 shadow-2xl overflow-hidden rounded-[2rem] bg-card/40 backdrop-blur-md">
            <CardHeader className="bg-muted/30 border-b border-border/10 p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-black uppercase tracking-tighter">Academic Timeline</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {filteredSlots.length} time slots
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b border-border-20 transition-colors">
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Day</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Time Range</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Subject</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Instructor</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Location</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Nature</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSlots.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 bg-muted/5">
                        <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">No time slots mapped for this day</p>
                      </TableCell>
                    </TableRow>
                  ) : filteredSlots.map((slot) => (
                    <TableRow key={slot.id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/10 last:border-0">
                      <TableCell className="px-6 py-5 cursor-default">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full shadow-lg ${getDayColor(slot.day)}`} />
                          <span className="font-black text-xs uppercase tracking-tighter">{slot.day}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary/40" />
                          <span className="font-mono text-xs font-black tracking-widest">{slot.start_time} - {slot.end_time}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5"><Badge variant="outline" className="font-mono font-black text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20">{slot.subject}</Badge></TableCell>
                      <TableCell className="px-6 py-5 font-bold text-sm tracking-tight">{slot.teacher}</TableCell>
                      <TableCell className="px-6 py-5"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-muted-foreground" /><span className="font-black text-[11px] uppercase tracking-tighter text-muted-foreground">{slot.room}</span></div></TableCell>
                      <TableCell className="px-6 py-5">{getTypeBadge(slot.type)}</TableCell>
                      <TableCell className="px-6 py-5">
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-all"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/40 shadow-2xl rounded-2xl p-2 animate-in slide-in-from-top-1">
                              <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setEditSlot(slot)}>Edit Assignment</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setDeleteTarget(slot)}>Void Slot</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add" className="animate-in slide-in-from-right-4 fade-in-50 duration-500 outline-none">
            <Card className="border-primary/20 overflow-hidden rounded-[2rem] shadow-2xl bg-card/80 backdrop-blur-md relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 p-12">
                <CardTitle className="text-primary flex items-center gap-4 text-3xl font-black uppercase tracking-tight">
<span className="p-3.5 bg-primary/10 rounded-2xl shadow-xl"><CalendarPlus className="w-8 h-8 text-primary" /></span>
                  Period Assignment
                </CardTitle>
                <CardDescription className="text-base font-medium text-muted-foreground/80 ml-[4.5rem] uppercase tracking-[0.2em] text-[10px]">
                  Allocate teaching hours and synchronize class resources across the institute.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <AddTimeSlotForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <EditTimeSlotDialog open={!!editSlot} onOpenChange={(o) => !o && setEditSlot(null)} timeSlot={editSlot} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Time Slot" description="Are you sure you want to delete this time slot? This action cannot be undone." onConfirm={handleDelete} isPending={deleteTimeSlot.isPending} />
    </DashboardLayout>
  );
};

export default TimeSlots;
