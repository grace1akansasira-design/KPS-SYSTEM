import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GraduationCap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useUpdatePupil, type Pupil } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

import { SECTIONS, CLASSES_BY_SECTION, Section } from "@/lib/school-constants";

const formSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  pupil_id: z.string().min(5),
  section: z.enum(SECTIONS),
  class: z.string().min(1),
  age: z.coerce.number().min(3).max(20),
  status: z.enum(["active", "suspended", "transferred"]),
});

interface Props { open: boolean; onOpenChange: (open: boolean) => void; pupil: Pupil | null; }

export function EditPupilDialog({ open, onOpenChange, pupil }: Props) {
  const updatePupil = useUpdatePupil();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (pupil) {
      form.reset({
        name: pupil.name,
        email: pupil.email,
        pupil_id: pupil.pupil_id,
        section: (pupil.section as Section) || "Primary",
        class: pupil.class,
        age: pupil.age,
        status: pupil.status as any
      });
    }
  }, [pupil]);

  const selectedSection = form.watch("section") as Section;
  const availableClasses = CLASSES_BY_SECTION[selectedSection] || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!pupil) return;
    try {
      await updatePupil.mutateAsync({ 
        id: pupil.id, 
        ...data,
        // @ts-ignore
        section: data.section
      });
      toast({ title: "Pupil Updated", description: `${data.name} has been updated.` });
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] border-t-8 border-t-primary rounded-[2rem]">
        <DialogHeader className="pb-8 border-b border-border/50 flex flex-col items-center">
          <div className="p-4 rounded-[1.5rem] bg-primary/10 ring-4 ring-primary/5 mb-4 animate-in zoom-in duration-500">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-black uppercase tracking-[0.2em] text-primary text-center">
            EDIT PUPIL
          </DialogTitle>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-2">Pupil Admission</p>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pupil_id" render={({ field }) => (<FormItem><FormLabel>Pupil ID</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
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
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="transferred">Transferred</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updatePupil.isPending} className="bg-primary hover:bg-primary/90">{updatePupil.isPending ? "Saving..." : "SAVE CHANGES"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
