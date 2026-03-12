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
import { useUpdateRoom, type Room } from "@/hooks/useSupabaseData";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2),
  building: z.string().min(2),
  capacity: z.coerce.number().min(1),
  type: z.enum(["classroom", "lab", "library", "hall"]),
  facilities: z.array(z.string()),
  status: z.enum(["available", "maintenance", "occupied"]),
});

const facilityOptions = ["Chalkboard", "Desks", "Projector", "Computers", "Lab Equipment", "Books"];
const buildings = ["Main Block", "Science Block", "Admin Block"];

interface Props { open: boolean; onOpenChange: (open: boolean) => void; room: Room | null; }

export function EditRoomDialog({ open, onOpenChange, room }: Props) {
  const updateRoom = useUpdateRoom();
  const form = useForm<z.infer<typeof formSchema>>({ resolver: zodResolver(formSchema) });

  useEffect(() => {
    if (room) form.reset({ name: room.name, building: room.building, capacity: room.capacity, type: room.type as any, facilities: room.facilities, status: room.status as any });
  }, [room]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!room) return;
    try {
      await updateRoom.mutateAsync({ id: room.id, ...data });
      toast({ title: "Class Updated", description: `${data.name} has been updated.` });
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
            <DialogTitle className="text-2xl uppercase tracking-wide text-primary">EDIT CLASS</DialogTitle>
          </div>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Class Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="capacity" render={({ field }) => (<FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <FormField control={form.control} name="building" render={({ field }) => (<FormItem><FormLabel>Building</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent>{buildings.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="classroom">Classroom</SelectItem><SelectItem value="lab">Laboratory</SelectItem><SelectItem value="library">Library</SelectItem><SelectItem value="hall">Hall</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <FormField control={form.control} name="facilities" render={() => (
              <FormItem>
                <FormLabel>Facilities</FormLabel>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {facilityOptions.map((f) => (
                    <FormField key={f} control={form.control} name="facilities" render={({ field }) => (
                      <FormItem className="flex items-center space-x-2 space-y-0">
                        <Checkbox checked={field.value?.includes(f)} onCheckedChange={(checked) => checked ? field.onChange([...field.value, f]) : field.onChange(field.value?.filter(v => v !== f))} />
                        <FormLabel className="text-sm font-normal">{f}</FormLabel>
                      </FormItem>
                    )} />
                  ))}
                </div>
              </FormItem>
            )} />
            <FormField control={form.control} name="status" render={({ field }) => (<FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="available">Available</SelectItem><SelectItem value="maintenance">Maintenance</SelectItem><SelectItem value="occupied">Occupied</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            <DialogFooter className="pt-4 border-t border-border/50">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={updateRoom.isPending} className="bg-accent text-accent-foreground hover:bg-accent/90">{updateRoom.isPending ? "Saving..." : "SAVE CHANGES"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
