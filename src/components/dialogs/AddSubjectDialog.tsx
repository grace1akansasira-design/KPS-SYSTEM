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
import { useAddSubject, useTeachers } from "@/hooks/useSupabaseData";

const formSchema = z.object({
  code: z.string().min(2, "Subject code must be at least 2 characters"),
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  class: z.string().min(1, "Please select a class"),
  periodsPerWeek: z.coerce.number().min(1).max(10),
  teacher: z.string().min(1, "Please select a teacher"),
  pupils: z.coerce.number().min(1),
  term: z.string().min(1, "Please enter term"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const classes = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Primary 7"];

export function AddSubjectDialog({ open, onOpenChange }: AddSubjectDialogProps) {
  const addSubject = useAddSubject();
  const { data: teachers = [] } = useTeachers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { code: "", name: "", class: "", periodsPerWeek: 4, teacher: "", pupils: 40, term: "Term 1 2025" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await addSubject.mutateAsync({
        code: data.code,
        name: data.name,
        class: data.class,
        periods_per_week: data.periodsPerWeek,
        teacher: data.teacher,
        pupils: data.pupils,
        term: data.term,
      });
      toast({ title: "Subject Added Successfully", description: `${data.code} - ${data.name} has been added.` });
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
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20"><BookOpen className="w-5 h-5 text-primary" /></div>
            <div>
              <DialogTitle className="text-2xl uppercase tracking-wide text-primary">ADD NEW SUBJECT</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Create a new subject for the curriculum</p>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>Subject Code</FormLabel><FormControl><Input placeholder="MATH" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="periodsPerWeek" render={({ field }) => (<FormItem><FormLabel>Periods/Week</FormLabel><FormControl><Input type="number" min={1} max={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Subject Name</FormLabel><FormControl><Input placeholder="Mathematics" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="class" render={({ field }) => (<FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl><SelectContent>{classes.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="teacher" render={({ field }) => (<FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.filter(t => t.status === 'active').map((teacher) => (<SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="pupils" render={({ field }) => (<FormItem><FormLabel>Expected Pupils</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="term" render={({ field }) => (<FormItem><FormLabel>Term</FormLabel><FormControl><Input placeholder="Term 1 2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">Cancel</Button>
              <Button type="submit" disabled={addSubject.isPending} className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">{addSubject.isPending ? "Adding..." : "ADD SUBJECT"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
