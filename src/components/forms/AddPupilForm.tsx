import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAddPupil } from "@/hooks/useSupabaseData";
import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid parent/guardian email"),
  pupilId: z.string().min(5, "Pupil ID must be at least 5 characters"),
  section: z.enum(SECTIONS),
  class: z.string().min(1, "Please select a class"),
  age: z.string().min(1, "Please select age"),
  status: z.enum(["active", "suspended", "transferred"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPupilFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultSection?: Section;
}

export function AddPupilForm({ onSuccess, onCancel, defaultSection = "Primary" }: AddPupilFormProps) {
  const addPupil = useAddPupil();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", pupilId: "", section: defaultSection, class: "", age: "", status: "active" },
  });

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: FormValues) => {
    try {
      await addPupil.mutateAsync({
        name: data.name,
        email: data.email,
        pupil_id: data.pupilId,
        class: data.class,
        age: parseInt(data.age),
        status: data.status,
        subjects: [],
        section: data.section,
      } as any);
      toast({ title: "Pupil Added Successfully", description: `${data.name} has been enrolled in ${data.section} - ${data.class}.` });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Parent/Guardian Email</FormLabel><FormControl><Input type="email" placeholder="parent@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="pupilId" render={({ field }) => (<FormItem><FormLabel>Pupil ID</FormLabel><FormControl><Input placeholder="KPS2025001" {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        
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
          <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger></FormControl><SelectContent>{[3,4,5,6,7,8,9,10,11,12,13,14].map((age) => (<SelectItem key={age} value={age.toString()}>{age} years</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="transferred">Transferred</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        </div>
        <div className="pt-4 flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-muted">Cancel</Button>}
          <Button type="submit" disabled={addPupil.isPending} className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20 w-full sm:w-auto px-8">{addPupil.isPending ? "Adding..." : "ADD PUPIL"}</Button>
        </div>
      </form>
    </Form>
  );
}
