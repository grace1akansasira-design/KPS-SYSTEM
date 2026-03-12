import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAddSubject, useTeachers } from "@/hooks/useSupabaseData";
import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  code: z.string().min(2, "Subject code must be at least 2 characters"),
  name: z.string().min(3, "Subject name must be at least 3 characters"),
  section: z.enum(SECTIONS),
  class: z.string().min(1, "Please select a class"),
  periodsPerWeek: z.coerce.number().min(1).max(10),
  teacher: z.string().min(1, "Please select a teacher"),
  pupils: z.coerce.number().min(1),
  term: z.string().min(1, "Please enter term"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSubjectFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultSection?: Section;
}

export function AddSubjectForm({ onSuccess, onCancel, defaultSection = "Primary" }: AddSubjectFormProps) {
  const addSubject = useAddSubject();
  const { data: teachers = [] } = useTeachers();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      code: defaultSection === "Nursery" ? "N-" : "", 
      name: "", 
      section: defaultSection, 
      class: "", 
      periodsPerWeek: 5, 
      teacher: "", 
      pupils: 40, 
      term: "Term 1 2026" 
    },
  });

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: FormValues) => {
    try {
      await addSubject.mutateAsync({
        code: data.code,
        name: data.name,
        class: data.class,
        section: data.section,
        periods_per_week: data.periodsPerWeek,
        teacher: data.teacher,
        pupils: data.pupils,
        term: data.term,
      } as any);
      toast({ title: "Subject Added Successfully", description: `${data.code} - ${data.name} has been added to ${data.section} - ${data.class}.` });
      form.reset({
        code: defaultSection === "Nursery" ? "N-" : "",
        name: "",
        section: defaultSection,
        class: "",
        periodsPerWeek: 5,
        teacher: "",
        pupils: 40,
        term: "Term 1 2026"
      });
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="code" render={({ field }) => (<FormItem><FormLabel>Subject Code</FormLabel><FormControl><Input placeholder="MATH" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="periodsPerWeek" render={({ field }) => (<FormItem><FormLabel>Periods/Week</FormLabel><FormControl><Input type="number" min={1} max={10} {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Subject Name</FormLabel><FormControl><Input placeholder="Mathematics" {...field} /></FormControl><FormMessage /></FormItem>)} />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="section" render={({ field }) => (
            <FormItem>
              <FormLabel>Section</FormLabel>
              <Select onValueChange={(value) => { field.onChange(value); form.setValue("class", ""); }} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select section" /></SelectTrigger></FormControl>
                <SelectContent>{SECTIONS.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="class" render={({ field }) => (
            <FormItem>
              <FormLabel>Class</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl>
                <SelectContent>{availableClasses.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="teacher" render={({ field }) => (<FormItem><FormLabel>Teacher</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger></FormControl><SelectContent>{teachers.filter(t => t.status === 'active').map((teacher) => (<SelectItem key={teacher.id} value={teacher.name}>{teacher.name}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="pupils" render={({ field }) => (<FormItem><FormLabel>Expected Pupils</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        
        <FormField control={form.control} name="term" render={({ field }) => (<FormItem><FormLabel>Term</FormLabel><FormControl><Input placeholder="Term 1 2025" {...field} /></FormControl><FormMessage /></FormItem>)} />
        
        <div className="pt-4 flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-muted">Cancel</Button>}
          <Button type="submit" disabled={addSubject.isPending} className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 w-full sm:w-auto px-8">{addSubject.isPending ? "Adding..." : "ADD SUBJECT"}</Button>
        </div>
      </form>
    </Form>
  );
}
