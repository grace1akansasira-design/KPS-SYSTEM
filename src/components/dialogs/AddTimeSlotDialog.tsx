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
import { useAddTimeSlot, useTeachers, useSubjects, useRooms } from "@/hooks/useSupabaseData";

const formSchema = z.object({
  day: z.string().min(1),
  start_time: z.string().min(1),
  end_time: z.string().min(1),
  subject: z.string().min(1),
  teacher: z.string().min(1),
  room: z.string().min(1),
  type: z.enum(["lesson", "practical", "games"]),
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface Props { open: boolean; onOpenChange: (open: boolean) => void; }

export function AddTimeSlotDialog({ open, onOpenChange }: Props) {
  const addSlot = useAddTimeSlot();
  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();
  const { data: rooms = [] } = useRooms();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { day: "", start_time: "", end_time: "", subject: "", teacher: "", room: "", type: "lesson" },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await addSlot.mutateAsync({
        day: data.day,
        start_time: data.start_time,
        end_time: data.end_time,
        subject: data.subject,
        teacher: data.teacher,
        room: data.room,
        type: data.type,
      });
      toast({ title: "Time Slot Added", description: `${data.subject} on ${data.day} has been scheduled.` });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-t-primary">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20"><Clock className="w-5 h-5 text-primary" /></div>
            <div>
              <DialogTitle className="text-2xl uppercase tracking-wide text-primary">ADD TIME SLOT</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Schedule a new lesson or activity</p>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="day" render={({ field }) => (<FormItem><FormLabel>Day</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select day" /></SelectTrigger></FormControl><SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="start_time" render={({ field }) => (<FormItem><FormLabel>Start Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="end_time" render={({ field }) => (<FormItem><FormLabel>End Time</FormLabel><FormControl><Input type="time" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="subject" render={({ field }) => (<FormItem><FormLabel>Subject</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl><SelectContent>{[...new Set(subjects.map(s => s.name))].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="teacher" render={({ field }) => (<FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.filter(t => t.status === 'active').map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="room" render={({ field }) => (<FormItem><FormLabel>Room</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger></FormControl><SelectContent>{rooms.filter(r => r.status === 'available').map(r => <SelectItem key={r.id} value={r.name}>{r.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="lesson">Lesson</SelectItem><SelectItem value="practical">Practical</SelectItem><SelectItem value="games">Games</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={addSlot.isPending} className="bg-primary hover:bg-primary/90">{addSlot.isPending ? "Adding..." : "ADD TIME SLOT"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
