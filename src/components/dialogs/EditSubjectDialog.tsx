import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUpdateSubject, useTeachers, type Subject } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  code: z.string().min(2),
  name: z.string().min(3),
  section: z.enum(SECTIONS),
  class: z.string().min(1),
  periods_per_week: z.coerce.number().min(1).max(10),
  teacher: z.string().min(1),
  pupils: z.coerce.number().min(0),
  term: z.string().min(1),
});

interface Props { open: boolean; onOpenChange: (open: boolean) => void; subject: Subject | null; }

export function EditSubjectDialog({ open, onOpenChange, subject }: Props) {
  const updateSubject = useUpdateSubject();
  const { data: teachers = [] } = useTeachers();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (subject) {
      form.reset({
        code: subject.code,
        name: subject.name,
        section: (subject.section as Section) || "Primary",
        class: subject.class,
        periods_per_week: subject.periods_per_week,
        teacher: subject.teacher,
        pupils: subject.pupils,
        term: subject.term
      });
    }
  }, [subject]);

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!subject) return;
    try {
      await updateSubject.mutateAsync({ 
        id: subject.id, 
        ...data,
        // @ts-ignore
        section: data.section
      });
      toast({ title: "Subject Updated", description: `${data.name} has been updated.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] border-t-8 border-t-accent rounded-[2rem]">
        <DialogHeader className="pb-8 border-b border-border/50 flex flex-col items-center">
          <div className="p-4 rounded-[1.5rem] bg-accent/10 ring-4 ring-accent/5 mb-4 animate-in zoom-in duration-500">
            <BookOpen className="w-6 h-6 text-accent" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-[0.2em] text-primary text-center">
            EDIT SUBJECT
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-2">Academic Repository</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="periods_per_week" render={({ field }) => (<FormItem><FormLabel>Periods/Week</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Subject Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="section" render={({ field }) => (
                <FormItem>
                  <FormLabel>Section</FormLabel>
                  <Select onValueChange={(val) => { field.onChange(val); form.setValue("class", ""); }} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger></FormControl>
                    <SelectContent>{SECTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="class" render={({ field }) => (
                <FormItem>
                  <FormLabel>Class</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                    <SelectContent>{availableClasses.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
            </div>
            <FormField control={form.control} name="teacher" render={({ field }) => (<FormItem><FormLabel>Teacher (Assign)</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{teachers.filter(t => t.status === 'active').map(t => <SelectItem key={t.id} value={t.name}>{t.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="pupils" render={({ field }) => (<FormItem><FormLabel>Pupils</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="term" render={({ field }) => (<FormItem><FormLabel>Term</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateSubject.isPending} className="bg-primary hover:bg-primary/90">{updateSubject.isPending ? "Saving..." : "SAVE CHANGES"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
