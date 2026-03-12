import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Building2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAddRoom } from "@/hooks/useSupabaseData";

const formSchema = z.object({
  name: z.string().min(2, "Room name must be at least 2 characters"),
  building: z.string().min(2, "Building name must be at least 2 characters"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  type: z.enum(["classroom", "lab", "library", "hall"]),
  facilities: z.array(z.string()).min(1, "Select at least one facility"),
  status: z.enum(["available", "maintenance", "occupied"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddRoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const facilityOptions = [
  { id: "Chalkboard", label: "Chalkboard" },
  { id: "Desks", label: "Desks" },
  { id: "Projector", label: "Projector" },
  { id: "Computers", label: "Computers" },
  { id: "Lab Equipment", label: "Lab Equipment" },
  { id: "Books", label: "Books" },
];

const buildings = ["Main Block", "Science Block", "Admin Block"];

export function AddRoomDialog({ open, onOpenChange }: AddRoomDialogProps) {
  const addRoom = useAddRoom();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", building: "", capacity: 30, type: "classroom", facilities: [], status: "available" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await addRoom.mutateAsync({
        name: data.name,
        building: data.building,
        capacity: data.capacity,
        type: data.type,
        facilities: data.facilities,
        status: data.status,
      });
      toast({ title: "Room Added Successfully", description: `${data.name} in ${data.building} has been added.` });
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-t-4 border-t-accent">
        <DialogHeader className="pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/10 ring-2 ring-accent/20"><Building2 className="w-5 h-5 text-accent-foreground" /></div>
            <div>
              <DialogTitle className="text-2xl uppercase tracking-wide text-primary">ADD NEW ROOM</DialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Configure a new classroom or facility</p>
            </div>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Room Name</FormLabel><FormControl><Input placeholder="P1A Classroom" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="capacity" render={({ field }) => (<FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="building" render={({ field }) => (<FormItem><FormLabel>Building</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select building" /></SelectTrigger></FormControl><SelectContent>{buildings.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Room Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="classroom">Classroom</SelectItem><SelectItem value="lab">Laboratory</SelectItem><SelectItem value="library">Library</SelectItem><SelectItem value="hall">Hall</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="facilities" render={() => (
              <FormItem>
                <FormLabel>Facilities</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {facilityOptions.map((facility) => (
                    <FormField key={facility.id} control={form.control} name="facilities" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value?.includes(facility.id)} onCheckedChange={(checked) => checked ? field.onChange([...field.value, facility.id]) : field.onChange(field.value?.filter((v) => v !== facility.id))} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">{facility.label}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="available">Available</SelectItem><SelectItem value="maintenance">Under Maintenance</SelectItem><SelectItem value="occupied">Occupied</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="hover:bg-muted">Cancel</Button>
              <Button type="submit" disabled={addRoom.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20">{addRoom.isPending ? "Adding..." : "ADD ROOM"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
