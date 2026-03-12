import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePupils, useAddPupil, useDeletePupil, type Pupil } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, MoreHorizontal, GraduationCap, CheckCircle, BookOpen, Loader2, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditPupilDialog } from "@/components/dialogs/EditPupilDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddPupilForm } from "@/components/forms/AddPupilForm";

const Pupils = () => {
  const { data: pupilsFromQuery = [], isLoading } = usePupils();
  
  const DEFAULT_PUPILS: Pupil[] = [
    { 
      id: 'p-def-1', 
      pupil_id: 'KPS-2025-001', 
      name: 'David Okello', 
      email: 'david@example.com', 
      age: 6, 
      class: 'Primary 1', 
      section: 'Primary', 
      status: 'active', 
      subjects: ['Mathematics', 'English'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'p-def-2', 
      pupil_id: 'KPS-2025-002', 
      name: 'Sarah Namono', 
      email: 'sarah@example.com', 
      age: 3, 
      class: 'Baby', 
      section: 'Nursery', 
      status: 'active', 
      subjects: ['Literacy', 'Numbers'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const pupils = pupilsFromQuery.length > 0 ? pupilsFromQuery : DEFAULT_PUPILS;
  
  const deletePupil = useDeletePupil();
  const addPupil = useAddPupil();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editPupil, setEditPupil] = useState<Pupil | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Pupil | null>(null);

  const activeCount = pupils.filter(p => p.status === 'active').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-success/10 text-success border-success/20 border font-bold uppercase text-[9px] tracking-widest"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'suspended': return <Badge className="bg-destructive/10 text-destructive border-destructive/20 border font-bold uppercase text-[9px] tracking-widest">Suspended</Badge>;
      case 'transferred': return <Badge className="bg-warning/10 text-warning border-warning/20 border font-bold uppercase text-[9px] tracking-widest">Transferred</Badge>;
      default: return null;
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deletePupil.mutateAsync(deleteTarget.id);
      toast({ title: "Pupil Deleted", description: `${deleteTarget.name} has been removed.` });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Pupils Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 shadow-inner"><GraduationCap className="w-6 h-6 text-primary" /></div>
            <div>
              <p className="text-2xl font-black tracking-tight">{pupils.length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Pupils</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-success/10 shadow-inner"><CheckCircle className="w-6 h-6 text-success" /></div>
            <div>
              <p className="text-2xl font-black tracking-tight">{activeCount}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Active Pupils</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-warning/10 shadow-inner"><BookOpen className="w-6 h-6 text-warning" /></div>
            <div>
              <p className="text-2xl font-black tracking-tight">{pupils.filter(p => p.section === 'Primary').length} | {pupils.filter(p => p.section === 'Nursery').length}</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Primary | Nursery</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/20 shadow-inner"><GraduationCap className="w-6 h-6 text-accent-foreground" /></div>
            <div>
              <p className="text-2xl font-black tracking-tight">N-P7</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Range</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/20 shadow-sm">
          <TabsTrigger value="list" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
            <GraduationCap className="w-4 h-4 mr-2" /> Pupil Roster
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <UserPlus className="w-4 h-4 mr-2" /> Add New Pupil
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="animate-in fade-in-50 duration-500 outline-none">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search records..." className="pl-10 h-11 border-border/40 bg-card/50 backdrop-blur-sm" /></div>
            <div className="flex gap-2"><Button variant="outline" className="h-11 border-border/40"><Filter className="w-4 h-4 mr-2" />Sort & Filter</Button></div>
          </div>

          <Tabs defaultValue="primary" className="space-y-6">
            <TabsList className="bg-muted/20 p-1 rounded-xl border border-border/10">
              <TabsTrigger value="primary" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest">Primary Section</TabsTrigger>
              <TabsTrigger value="nursery" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest">Nursery Section</TabsTrigger>
            </TabsList>

            {["primary", "nursery"].map((section) => {
              const displaySection = section === "primary" ? "Primary" : "Nursery";
              const filteredPupils = pupils.filter(p => (p.section || 'Primary') === displaySection);
              
              return (
                <TabsContent key={section} value={section} className="animate-in slide-in-from-left-2 duration-300">
                  <Card className="data-table border-border/40 shadow-2xl overflow-hidden rounded-[2rem] bg-card/40 backdrop-blur-md">
                    <CardHeader className="bg-muted/30 border-b border-border/10 p-6">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter">{displaySection} Academic Records</CardTitle>
                        <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                          {filteredPupils.length} pupils
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50 border-b border-border/20">
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Pupil</TableHead>
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Pupil ID</TableHead>
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Class</TableHead>
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest text-center">Age</TableHead>
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Subjects</TableHead>
                            <TableHead className="px-6 py-4 font-black uppercase text-[10px] tracking-widest">Status</TableHead>
                            <TableHead className="w-12"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredPupils.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-10 bg-muted/5">
                                <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">No {displaySection} records found</p>
                              </TableCell>
                            </TableRow>
                          ) : filteredPupils.map((pupil) => (
                            <TableRow key={pupil.id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/10 last:border-0">
                              <TableCell className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform hover:scale-110 shadow-lg shadow-black/5">
                                    <AvatarFallback className="bg-primary/10 text-primary font-black">
                                      {pupil.name.split(' ').map(n => n[0]).join('')}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-bold text-sm tracking-tight">{pupil.name}</p>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-wider">{pupil.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-5 font-mono text-xs">
                                <Badge variant="outline" className="border-border/30 px-3 py-1 font-mono text-[10px] tracking-tighter">{pupil.pupil_id}</Badge>
                              </TableCell>
                              <TableCell className="px-6 py-5 font-black text-xs uppercase tracking-tighter text-primary/80">{pupil.class}</TableCell>
                              <TableCell className="px-6 py-5 text-center">
                                <Badge variant="secondary" className="bg-muted/50 text-[10px] font-black uppercase tracking-widest px-3">{pupil.age} yrs</Badge>
                              </TableCell>
                              <TableCell className="px-6 py-5">
                                <div className="flex gap-2 flex-wrap max-w-[250px]">
                                  {pupil.subjects.map(subject => (
                                    <Badge 
                                      key={subject} 
                                      variant="outline" 
                                      className="bg-blue-50 text-blue-700 border-blue-600/30 font-black text-[10px] uppercase px-2.5 py-1 shadow-sm hover:bg-blue-100 transition-colors"
                                    >
                                      {subject}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-5">{getStatusBadge(pupil.status)}</TableCell>
                              <TableCell className="px-6 py-5">
                                {isAdmin && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10 transition-all">
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="bg-popover border-border/40 shadow-2xl rounded-2xl p-2 animate-in slide-in-from-top-1">
                                      <DropdownMenuItem className="rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setEditPupil(pupil)}>Edit Record</DropdownMenuItem>
                                      <DropdownMenuItem className="text-destructive rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest transition-colors" onClick={() => setDeleteTarget(pupil)}>Expel/Remove</DropdownMenuItem>
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
              );
            })}
          </Tabs>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add" className="animate-in slide-in-from-right-4 fade-in-50 duration-500 outline-none">
            <Card className="border-primary/20 overflow-hidden rounded-[2rem] shadow-2xl bg-card/80 backdrop-blur-md relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 p-12">
                <CardTitle className="text-primary flex items-center gap-4 text-3xl font-black uppercase tracking-tight">
                  <span className="p-3.5 bg-primary/10 rounded-2xl shadow-xl"><UserPlus className="w-8 h-8 text-primary" /></span>
                  Pupil Admission
                </CardTitle>
                <CardDescription className="text-base font-medium text-muted-foreground/80 ml-[4.5rem] uppercase tracking-[0.2em] text-[10px]">
                  Official pupil enrollment system for all preparatory levels.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <AddPupilForm onSuccess={() => toast({ title: "Success", description: "Pupil added successfully." })} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <EditPupilDialog open={!!editPupil} onOpenChange={(o) => !o && setEditPupil(null)} pupil={editPupil} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Pupil" description={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`} onConfirm={handleDelete} isPending={deletePupil.isPending} />
    </DashboardLayout>
  );
};

export default Pupils;
