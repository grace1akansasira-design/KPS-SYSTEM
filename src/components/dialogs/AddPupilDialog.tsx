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
import { useAddPupil } from "@/hooks/useSupabaseData";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid parent/guardian email"),
  pupilId: z.string().min(5, "Pupil ID must be at least 5 characters"),
  class: z.string().min(1, "Please select a class"),
  age: z.string().min(1, "Please select age"),
  status: z.enum(["active", "suspended", "transferred"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddPupilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const classes = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Primary 7"];

export function AddPupilDialog({ open, onOpenChange }: AddPupilDialogProps) {
  const addPupil = useAddPupil();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", pupilId: "", class: "", age: "", status: "active" },
  });

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
      });
      toast({ title: "Pupil Added Successfully", description: `${data.name} has been enrolled in ${data.class}.` });
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
            <div className="p-2.5 rounded-xl bg-primary/10 ring-2 ring-primary/20"><GraduationCap className="w-5 h-5 text-primary" /></div>
            <div>
              <DialogTitle className="text-2xl uppercase tracking-wide text-primary">ADD NEW PUPIL</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Enroll a new pupil into the school</p>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Parent/Guardian Email</FormLabel><FormControl><Input type="email" placeholder="parent@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="pupilId" render={({ field }) => (<FormItem><FormLabel>Pupil ID</FormLabel><FormControl><Input placeholder="KPS2025001" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="class" render={({ field }) => (<FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl><SelectContent>{classes.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="age" render={({ field }) => (<FormItem><FormLabel>Age</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select age" /></SelectTrigger></FormControl><SelectContent>{[5,6,7,8,9,10,11,12,13,14].map((age) => (<SelectItem key={age} value={age.toString()}>{age} years</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="suspended">Suspended</SelectItem><SelectItem value="transferred">Transferred</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">Cancel</Button>
              <Button type="submit" disabled={addPupil.isPending} className="bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">{addPupil.isPending ? "Adding..." : "ADD PUPIL"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
