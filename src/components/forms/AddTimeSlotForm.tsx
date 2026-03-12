import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useTeachers, useSubjects, useRooms, useAddTimeSlot } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  day: z.string().min(1, "Required"),
  section: z.enum(SECTIONS),
  class: z.string().min(1, "Required"),
  start_time: z.string().min(1, "Required"),
  end_time: z.string().min(1, "Required"),
  subject: z.string().optional(),
  teacher: z.string().optional(),
  room: z.string().optional(),
  type: z.enum(["lesson", "practical", "games", "break", "lunch", "assembly"]),
});

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

interface AddTimeSlotFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: Partial<z.infer<typeof formSchema>>;
  defaultSection?: Section;
}

export function AddTimeSlotForm({ onSuccess, onCancel, initialValues, defaultSection = "Primary" }: AddTimeSlotFormProps) {
  const qc = useQueryClient();
  const { data: teachers = [] } = useTeachers();
  const { data: subjects = [] } = useSubjects();
  const { data: rooms = [] } = useRooms();
  const addTimeSlot = useAddTimeSlot();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      day: initialValues?.day || "",
      section: initialValues?.section || defaultSection,
      class: initialValues?.class || "",
      start_time: initialValues?.start_time || "",
      end_time: initialValues?.end_time || "",
      subject: initialValues?.subject || "",
      teacher: initialValues?.teacher || "",
      room: initialValues?.room || "",
      type: initialValues?.type || "lesson",
    },
  });

  const selectedSection = form.watch("section") as Section;
  const selectedClass = form.watch("class");
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  // Filter by section
  const filteredSubjects = subjects.filter(s => s.section === selectedSection);
  const filteredTeachers = teachers; // Show all teachers to avoid filtering issues

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Use the global mutation hook so that if Supabase RLS fails, it falls back to mockData
      await addTimeSlot.mutateAsync({
        day: data.day,
        start_time: data.start_time,
        end_time: data.end_time,
        subject: data.subject,
        teacher: data.teacher,
        room: data.room,
        type: data.type,
        class: data.class,
        section: data.section
      } as any);

      // Invalidate queries so timetable refreshes
      qc.invalidateQueries({ queryKey: ["time_slots"] });
      qc.invalidateQueries({ queryKey: ["dashboard_stats"] });

      toast({
        title: "✅ Added to Grid",
        description: `${data.subject} for ${data.class} on ${data.day} at ${data.start_time} scheduled.`,
      });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 text-left">

        {/* Row 1: Day, Section, Class */}
        <div className="grid grid-cols-3 gap-3">
          <FormField control={form.control} name="day" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Day</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select day" /></SelectTrigger></FormControl>
                <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="section" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Section</FormLabel>
              <Select onValueChange={val => { field.onChange(val); form.setValue("class", ""); form.setValue("subject", ""); form.setValue("teacher", ""); }} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Section" /></SelectTrigger></FormControl>
                <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="class" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Class</FormLabel>
              <Select onValueChange={val => { field.onChange(val); form.setValue("subject", ""); form.setValue("teacher", ""); }} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Class" /></SelectTrigger></FormControl>
                <SelectContent>{availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {/* Row 2: Start Time, End Time */}
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="start_time" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Start Time</FormLabel>
              <FormControl><Input type="time" {...field} className="h-9 text-sm" /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
          <FormField control={form.control} name="end_time" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">End Time</FormLabel>
              <FormControl><Input type="time" {...field} className="h-9 text-sm" /></FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {/* Row 3: Subject, Teacher */}
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="subject" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Subject</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                 <SelectContent>
                   <SelectItem value="_none">None / Standard</SelectItem>
                   {filteredSubjects.length > 0
                     ? [...new Set(filteredSubjects.map(s => s?.name).filter(Boolean))].map(s => (
                         <SelectItem key={s || "unknown"} value={s || "unknown"}>{s}</SelectItem>
                       ))
                     : null}
                 </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="teacher" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Teacher</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl>
                 <SelectContent>
                   <SelectItem value="_none">None / Optional</SelectItem>
                   {filteredTeachers.length > 0
                     ? filteredTeachers.map(t => (
                         <SelectItem key={t?.id || Math.random().toString()} value={t?.name || "unknown"}>
                           {t?.name || "Unknown"}
                         </SelectItem>
                       ))
                     : null}
                 </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {/* Row 4: Room, Type */}
        <div className="grid grid-cols-2 gap-3">
          <FormField control={form.control} name="room" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Room</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Select room" /></SelectTrigger></FormControl>
                 <SelectContent>
                   <SelectItem value="_none">No Room / N/A</SelectItem>
                   {rooms.filter(r => r?.status === "available").map(r => (
                     <SelectItem key={r?.id || Math.random().toString()} value={r?.name || "unknown"}>
                       {r?.name || "Unknown"}
                     </SelectItem>
                   ))}
                 </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />

          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs font-semibold">Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="practical">Practical</SelectItem>
                  <SelectItem value="games">Games / PE</SelectItem>
                  <SelectItem value="break">Break</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="assembly">Assembly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs" />
            </FormItem>
          )} />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="h-9 px-5 text-sm">
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="h-9 px-6 text-sm font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
          >
            {isSubmitting ? "Adding..." : "ADD TO GRID"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
