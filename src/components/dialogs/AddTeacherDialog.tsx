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
import { useAddTeacher } from "@/hooks/useSupabaseData";

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  class: z.string().min(1, "Please select a class"),
  status: z.enum(["active", "on-leave", "inactive"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const classes = ["Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Primary 7"];

export function AddTeacherDialog({ open, onOpenChange }: AddTeacherDialogProps) {
  const addTeacher = useAddTeacher();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", class: "", status: "active" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await addTeacher.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        class: data.class,
        status: data.status,
        subjects: [],
      });
      toast({ title: "Teacher Added Successfully", description: `${data.name} has been added to ${data.class}.` });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-t-success">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10 ring-2 ring-success/20"><Users className="w-5 h-5 text-success" /></div>
            <div>
              <DialogTitle className="text-2xl uppercase tracking-wide text-primary">ADD NEW TEACHER</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Fill in the details below to add a teacher</p>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Full Name</FormLabel><FormControl><Input placeholder="Mrs. Jane Smith" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="email" render={({ field }) => (<FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" placeholder="j.smith@kps.ac.ug" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="phone" render={({ field }) => (<FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input placeholder="+256 700 000 000" {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="class" render={({ field }) => (<FormItem><FormLabel>Class</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger></FormControl><SelectContent>{classes.map((cls) => (<SelectItem key={cls} value={cls}>{cls}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="on-leave">On Leave</SelectItem><SelectItem value="inactive">Inactive</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">Cancel</Button>
              <Button type="submit" disabled={addTeacher.isPending} className="bg-success hover:bg-success/90 shadow-md shadow-success/20">{addTeacher.isPending ? "Adding..." : "ADD TEACHER"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
