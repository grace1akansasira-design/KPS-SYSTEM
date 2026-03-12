import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRooms, useAddRoom, useDeleteRoom, type Room } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, MoreHorizontal, Building2, CheckCircle, Wrench, Users, Loader2, PlusSquare } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditRoomDialog } from "@/components/dialogs/EditRoomDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddRoomForm } from "@/components/forms/AddRoomForm";

const Rooms = () => {
  const { data: roomsFromQuery = [], isLoading } = useRooms();
  
  const DEFAULT_ROOMS: Room[] = [
    { 
      id: 'r-def-1', 
      name: 'Class A1', 
      building: 'Main Block', 
      capacity: 40, 
      type: 'classroom', 
      facilities: ['Whiteboard', 'Desks'], 
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'r-def-2', 
      name: 'Class B2', 
      building: 'Nursery Block', 
      capacity: 30, 
      type: 'classroom', 
      facilities: ['Toys', 'Mats'], 
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'r-def-3', 
      name: 'Science Lab', 
      building: 'Lab Block', 
      capacity: 25, 
      type: 'lab', 
      facilities: ['Microscope', 'Burners'], 
      status: 'available',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const rooms = roomsFromQuery.length > 0 ? roomsFromQuery : DEFAULT_ROOMS;
  
  const deleteRoom = useDeleteRoom();
  const addRoom = useAddRoom();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editRoom, setEditRoom] = useState<Room | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Room | null>(null);

  const availableCount = rooms.filter(r => r.status === 'available').length;
  const maintenanceCount = rooms.filter(r => r.status === 'maintenance').length;
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'available': return <Badge className="bg-success/10 text-success border-success/20 border font-bold uppercase text-[9px] tracking-widest px-3 py-1 scale-90"><CheckCircle className="w-3 h-3 mr-1" />Available</Badge>;
      case 'maintenance': return <Badge className="bg-warning/10 text-warning border-warning/20 border font-bold uppercase text-[9px] tracking-widest px-3 py-1 scale-90"><Wrench className="w-3 h-3 mr-1" />Maintenance</Badge>;
      case 'occupied': return <Badge className="bg-primary/10 text-primary border-primary/20 border font-bold uppercase text-[9px] tracking-widest px-3 py-1 scale-90">In Use</Badge>;
      default: return null;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      'classroom': 'bg-primary/10 text-primary border-primary/20',
      'lab': 'bg-success/10 text-success border-success/20',
      'library': 'bg-warning/10 text-warning border-warning/20',
      'hall': 'bg-accent/20 text-accent-foreground border-accent/30',
    };
    return <Badge variant="outline" className={`font-black uppercase text-[8px] tracking-[0.2em] px-2 py-0.5 ${colors[type] || ''}`}>{type}</Badge>;
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteRoom.mutateAsync(deleteTarget.id);
      toast({ title: "Class Deleted", description: `${deleteTarget.name} has been removed.` });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Classes Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10 shadow-inner"><Building2 className="w-6 h-6 text-primary" /></div><div><p className="text-2xl font-black tracking-tight">{rooms.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Classes</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10 shadow-inner"><CheckCircle className="w-6 h-6 text-success" /></div><div><p className="text-2xl font-black tracking-tight">{availableCount}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Available</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-warning/10 shadow-inner"><Wrench className="w-6 h-6 text-warning" /></div><div><p className="text-2xl font-black tracking-tight">{maintenanceCount}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Maintenance</p></div></CardContent></Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl"><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-accent/20 shadow-inner"><Users className="w-6 h-6 text-accent-foreground" /></div><div><p className="text-2xl font-black tracking-tight">{totalCapacity}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Capacities</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/20 shadow-sm">
          <TabsTrigger value="list" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
            <Building2 className="w-4 h-4 mr-2" /> Space Directory
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <PlusSquare className="w-4 h-4 mr-2" /> Add New Class
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="animate-in fade-in-50 duration-500 outline-none">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search spaces..." className="pl-10 h-11 border-border/40 bg-card/60 backdrop-blur-sm" /></div>
            <div className="flex gap-2"><Button variant="outline" className="h-11 border-border/40"><Filter className="w-4 h-4 mr-2" />Filter</Button></div>
          </div>

          <Card className="data-table border-border/40 shadow-2xl overflow-hidden rounded-[2rem] bg-card/40 backdrop-blur-md">
            <CardHeader className="bg-muted/30 border-b border-border/10 p-6">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-black uppercase tracking-tighter">Physical Infrastructure</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {rooms.length} classes
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b border-border-20 transition-colors">
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Class</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Building</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Type</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-center">Capacity</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Facilities</TableHead>
                    <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10 bg-muted/5">
                        <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">No physical spaces found in the system</p>
                      </TableCell>
                    </TableRow>
                  ) : rooms.map((room) => (
                    <TableRow key={room.id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/10 last:border-0">
                      <TableCell className="px-6 py-5 cursor-help"><Badge variant="outline" className="font-mono font-black text-xs px-3 py-1 bg-primary/5 border-primary/20 shadow-sm">{room.name}</Badge></TableCell>
                      <TableCell className="px-6 py-5 font-bold text-sm tracking-tight">{room.building}</TableCell>
                      <TableCell className="px-6 py-5">{getTypeBadge(room.type)}</TableCell>
                      <TableCell className="px-6 py-5 text-center"><div className="flex items-center justify-center gap-1.5"><Users className="w-4 h-4 text-primary/40" /><span className="font-black text-sm">{room.capacity}</span></div></TableCell>
                      <TableCell className="px-6 py-5">
                        <div className="flex gap-1.5 flex-wrap max-w-xs">
                          {room.facilities.slice(0, 3).map(facility => (<Badge key={facility} variant="secondary" className="text-[9px] font-black uppercase tracking-wider bg-muted/60 px-2 py-0.5">{facility}</Badge>))}
                          {room.facilities.length > 3 && <Badge variant="secondary" className="text-[9px] font-black uppercase px-2 py-0.5 border-dashed border">+{room.facilities.length - 3}</Badge>}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-5">{getStatusBadge(room.status)}</TableCell>
                      <TableCell className="px-6 py-5">
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-all"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/40 shadow-2xl rounded-2xl p-2 animate-in slide-in-from-top-1">
                              <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setEditRoom(room)}>Edit Class</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setDeleteTarget(room)}>Decommission</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add" className="animate-in slide-in-from-right-4 fade-in-50 duration-500 outline-none">
            <Card className="border-warning/20 overflow-hidden rounded-[2rem] shadow-2xl bg-card/80 backdrop-blur-md relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-warning/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <CardHeader className="bg-warning/5 border-b border-warning/10 pb-10 p-12">
                <CardTitle className="text-warning-foreground flex items-center gap-3 text-3xl font-black uppercase tracking-tight">
                  <span className="p-3.5 bg-warning/10 rounded-2xl shadow-xl"><PlusSquare className="w-8 h-8 text-warning" /></span>
                  Space Registration
                </CardTitle>
                <CardDescription className="text-base font-medium text-muted-foreground/80 ml-[4.5rem] uppercase tracking-[0.2em] text-[10px]">
                  Define and classify physical learning environments for the school hub.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <AddRoomForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <EditRoomDialog open={!!editRoom} onOpenChange={(o) => !o && setEditRoom(null)} room={editRoom} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Class" description={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`} onConfirm={handleDelete} isPending={deleteRoom.isPending} />
    </DashboardLayout>
  );
};

export default Rooms;
