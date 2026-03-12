import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Clock } from "lucide-react"; 
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUpdateTimeSlot, useTeachers, useSubjects, useRooms, type TimeSlot } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  day: z.string().min(1),
  section: z.enum(SECTIONS),
  class: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  room: z.string().min(1),
  type: z.enum(["lesson", "practical", "games"]),
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface Props { open: boolean; onOpenChange: (open: boolean) => void; timeSlot: TimeSlot | null; }

export function EditTimeSlotDialog({ open, onOpenChange, timeSlot }: Props) {
  const updateSlot = useUpdateTimeSlot();
  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();
  const { data: rooms = [] } = useRooms();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (timeSlot) {
      form.reset({
        day: timeSlot.day,
        // @ts-ignore
        section: (timeSlot.section as Section) || "Primary",
        // @ts-ignore
        class: timeSlot.class || "",
        start_time: timeSlot.start_time,
        end_time: timeSlot.end_time,
        subject: timeSlot.subject,
        teacher: timeSlot.teacher,
        room: timeSlot.room,
        type: timeSlot.type as any
      });
    }
  }, [timeSlot]);

  const selectedSection = form.watch("section") as Section;
  const selectedClass = form.watch("class");
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const filteredSubjects = subjects.filter(s => {
    // @ts-ignore
    const sSection = s.section || "Primary";
    const sClass = s.class;
    return sSection === selectedSection && sClass === selectedClass;
  });

  const filteredTeachers = teachers.filter(t => {
    const isActive = t.status === 'active';
    // @ts-ignore
    const tSection = t.section || "Primary";
    const tClass = t.class;
    // Only show active teachers in this section
    if (tSection !== selectedSection) return false;
    if (!isActive) return false;
    
    // If a class is selected, show teachers for that class or general section teachers
    if (selectedClass) {
      return !tClass || tClass === selectedClass;
    }
    
    return true;
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!timeSlot) return;
    try {
      await updateSlot.mutateAsync({
        id: timeSlot.id,
        ...data,
        // @ts-ignore
        section: data.section,
        // @ts-ignore
        class: data.class,
      });
      toast({ title: "Time Slot Updated", description: "Schedule has been updated." });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-t-primary">
        <DialogHeader className="pb-6 border-b border-border/50 flex flex-col items-center">
          <div className="p-3.5 rounded-[1.5rem] bg-primary/10 ring-4 ring-primary/5 mb-4 animate-in zoom-in duration-500">
            <Clock className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-[0.2em] text-primary text-center">
            EDIT TIME SLOT
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="day" render={({ field }) => (<FormItem><FormLabel>Day</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="section" render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={(val) => { field.onChange(val); form.setValue("class", ""); form.setValue("subject", ""); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Section" /></SelectTrigger></FormControl>
                    <SelectContent>{SECTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="class" render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={(val) => { field.onChange(val); form.setValue("subject", ""); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Class" /></SelectTrigger></FormControl>
                    <SelectContent>{availableClasses.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="lesson">Lesson</SelectItem><SelectItem value="practical">Practical</SelectItem><SelectItem value="games">Games</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="start_time" render={({ field }) => (<FormItem><FormLabel>Start</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="end_time" render={({ field }) => (<FormItem><FormLabel>End</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass}>
                    <FormControl><SelectTrigger><SelectValue placeholder={selectedClass ? "Select subject" : "Select class first"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {filteredSubjects.length > 0 ? (
                        [...new Set(filteredSubjects.map(s => s.name))].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)
                      ) : (
                        <SelectItem value="_none" disabled>No subjects for this class</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="teacher" render={({ field }) => (
                <FormItem>
                  <FormLabel>Teacher</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClass}>
                    <FormControl><SelectTrigger><SelectValue placeholder={selectedClass ? "Select teacher" : "Select class first"} /></SelectTrigger></FormControl>
                    <SelectContent>
                      {filteredTeachers.length > 0 ? (
                        filteredTeachers.map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)
                      ) : (
                        <SelectItem value="_none" disabled>No teachers for {selectedSection}</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="room" render={({ field }) => (<FormItem><FormLabel>Room</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{rooms.filter(r => r.status === 'available').map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateSlot.isPending} className="bg-primary hover:bg-primary/90">{updateSlot.isPending ? "Saving..." : "SAVE CHANGES"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
