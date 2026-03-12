import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useAddTeacher } from "@/hooks/useSupabaseData";
import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  section: z.enum(SECTIONS),
  class: z.string().min(1, "Please select a class"),
  status: z.enum(["active", "on-leave", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeacherFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultSection?: Section;
}

export function AddTeacherForm({ onSuccess, onCancel, defaultSection = "Primary" }: AddTeacherFormProps) {
  const addTeacher = useAddTeacher();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", section: defaultSection, class: "", status: "active" },
  });

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: FormValues) => {
    try {
      await addTeacher.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        class: data.class,
        section: data.section,
        status: data.status,
        subjects: [],
      } as any);
      toast({ title: "Teacher Added Successfully", description: `${data.name} has been added to ${data.section} - ${data.class}.` });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Mrs. Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="j.smith@kps.ac.ug" {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+256 700 000 000" {...field} /></FormControl><FormMessage /></FormItem>)} />
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
        <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on-leave">On Leave</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
        <div className="pt-4 flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-muted">Cancel</Button>}
          <Button type="submit" disabled={addTeacher.isPending} className="bg-success text-success-foreground hover:bg-success/90 shadow-md shadow-success/20 w-full sm:w-auto px-8">{addTeacher.isPending ? "Adding..." : "ADD TEACHER"}</Button>
        </div>
      </form>
    </Form>
  );
}
