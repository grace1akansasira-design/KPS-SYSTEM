import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useAddRoom } from "@/hooks/useSupabaseData";
import { Section, CLASSES_BY_SECTION } from "@/lib/school-constants";

const formSchema = z.object({
  name: z.string().min(1, "Please select a class"),
  building: z.string().min(2, "Building name must be at least 2 characters"),
  capacity: z.coerce.number().min(1, "Capacity must be at least 1"),
  type: z.enum(["classroom", "lab", "library", "hall"]),
  facilities: z.array(z.string()).min(1, "Select at least one facility"),
  status: z.enum(["available", "maintenance", "occupied"]),
});

type FormValues = z.infer<typeof formSchema>;

interface AddRoomFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  defaultSection?: Section;
}

const facilityOptions = [
  { id: "Chalkboard", label: "Chalkboard" },
  { id: "Desks", label: "Desks" },
  { id: "Projector", label: "Projector" },
  { id: "Computers", label: "Computers" },
  { id: "Lab Equipment", label: "Lab Equipment" },
  { id: "Books", label: "Books" },
];

const buildings = ["Main Block", "Science Block", "Admin Block", "Nursery Block"];

export function AddRoomForm({ onSuccess, onCancel, defaultSection = "Primary" }: AddRoomFormProps) {
  const addRoom = useAddRoom();
  const availableClasses = CLASSES_BY_SECTION[defaultSection] || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "", 
      building: defaultSection === "Nursery" ? "Nursery Block" : "Main Block", 
      capacity: 40, 
      type: "classroom", 
      facilities: ["Chalkboard", "Desks"], 
      status: "available" 
    },
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
      } as any);
      toast({ title: "Class Added Successfully", description: `${data.name} in ${data.building} has been added.` });
      form.reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Select Class</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {availableClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="capacity" render={({ field }) => (<FormItem><FormLabel>Capacity</FormLabel><FormControl><Input type="number" min={1} {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField control={form.control} name="building" render={({ field }) => (<FormItem><FormLabel>Building</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select building" /></SelectTrigger></FormControl><SelectContent>{buildings.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem>)} />
        <FormField control={form.control} name="type" render={({ field }) => (<FormItem><FormLabel>Class Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent><SelectItem value="classroom">Classroom</SelectItem><SelectItem value="lab">Laboratory</SelectItem><SelectItem value="library">Library</SelectItem><SelectItem value="hall">Hall</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
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
        <div className="pt-4 flex justify-end gap-2">
          {onCancel && <Button type="button" variant="outline" onClick={onCancel} className="hover:bg-muted">Cancel</Button>}
          <Button type="submit" disabled={addRoom.isPending} className="bg-warning text-warning-foreground hover:bg-warning/90 shadow-md shadow-warning/20 w-full sm:w-auto px-8">{addRoom.isPending ? "Adding..." : "ADD CLASS"}</Button>
        </div>
      </form>
    </Form>
  );
}
