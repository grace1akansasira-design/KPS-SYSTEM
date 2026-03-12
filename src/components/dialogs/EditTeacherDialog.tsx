import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUpdateTeacher, type Teacher } from "@/hooks/useSupabaseData";
import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(10),
  section: z.enum(SECTIONS),
  class: z.string().min(1),
  status: z.enum(["active", "on-leave", "inactive"]),
});

interface Props { open: boolean; onOpenChange: (open: boolean) => void; teacher: Teacher | null; }

export function EditTeacherDialog({ open, onOpenChange, teacher }: Props) {
  const updateTeacher = useUpdateTeacher();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (teacher) {
      form.reset({
        name: teacher.name,
        email: teacher.email,
        phone: teacher.phone,
        section: (teacher.section as Section) || "Primary",
        class: teacher.class,
        status: teacher.status as any
      });
    }
  }, [teacher]);

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!teacher) return;
    try {
      await updateTeacher.mutateAsync({ 
        id: teacher.id, 
        ...data,
        // @ts-ignore
        section: data.section 
      });
      toast({ title: "Teacher Updated", description: `${data.name} has been updated.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] border-t-8 border-t-success rounded-[2rem]">
        <DialogHeader className="pb-8 border-b border-border/50 flex flex-col items-center">
          <div className="p-4 rounded-[1.5rem] bg-success/10 ring-4 ring-success/5 mb-4 animate-in zoom-in duration-500">
            <Users className="w-6 h-6 text-success" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-[0.2em] text-primary text-center">
            EDIT TEACHER
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-2">Faculty Management</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
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
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on-leave">On Leave</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateTeacher.isPending} className="bg-success hover:bg-success/90">{updateTeacher.isPending ? "Saving..." : "SAVE CHANGES"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
