import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTeachers, useAddTeacher, useDeleteTeacher, type Teacher } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Filter, MoreHorizontal, Users, CheckCircle, Clock, XCircle, Loader2, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditTeacherDialog } from "@/components/dialogs/EditTeacherDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";

const Teachers = () => {
  const { data: teachersFromQuery = [], isLoading } = useTeachers();
  
  const DEFAULT_TEACHERS: Teacher[] = [
    { 
      id: 't-def-1', 
      name: 'Mrs. Musisi Sarah', 
      email: 'musisi@kps.ac.ug', 
      phone: '0701112223', 
      class: 'Baby', 
      section: 'Nursery', 
      status: 'active', 
      subjects: ['Literacy', 'Numbers'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 't-def-2', 
      name: 'Teacher Monica', 
      email: 'monica@kps.ac.ug', 
      phone: '+256702222222', 
      class: 'Middle', 
      section: 'Nursery', 
      status: 'active', 
      subjects: ['Songs', 'Play'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 't-def-3', 
      name: 'Teacher Grace', 
      email: 'grace@kps.ac.ug', 
      phone: '+256703333333', 
      class: 'Top', 
      section: 'Nursery', 
      status: 'active', 
      subjects: ['Writing', 'Drawing'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 't-def-4', 
      name: 'Mr. Robert Mukasa', 
      email: 'robert@kps.ac.ug', 
      phone: '0704445556', 
      class: 'Primary 1', 
      section: 'Primary', 
      status: 'active', 
      subjects: ['Mathematics', 'English'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 't-def-5', 
      name: 'Mr. Kato John', 
      email: 'kato@kps.ac.ug', 
      phone: '0702223334', 
      class: 'Middle', 
      section: 'Nursery', 
      status: 'active', 
      subjects: ['Songs', 'Play'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  const teachers = teachersFromQuery.length > 0 ? teachersFromQuery : DEFAULT_TEACHERS;
  
  const deleteTeacher = useDeleteTeacher();
  const addTeacher = useAddTeacher();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge className="bg-success/10 text-success border-success/20 border"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'on-leave': return <Badge className="bg-warning/10 text-warning border-warning/20 border"><Clock className="w-3 h-3 mr-1" />On Leave</Badge>;
      case 'inactive': return <Badge className="bg-destructive/10 text-destructive border-destructive/20 border"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      default: return null;
    }
  };

  const activeCount = teachers.filter(t => t.status === 'active').length;
  const onLeaveCount = teachers.filter(t => t.status === 'on-leave').length;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteTeacher.mutateAsync(deleteTarget.id);
      toast({ title: "Teacher Deleted", description: `${deleteTarget.name} has been removed.` });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Teachers Dashboard">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-primary/10"><Users className="w-6 h-6 text-primary" /></div><div><p className="text-2xl font-bold">{teachers.length}</p><p className="text-sm text-muted-foreground">Total Teachers</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-success/10"><CheckCircle className="w-6 h-6 text-success" /></div><div><p className="text-2xl font-bold">{activeCount}</p><p className="text-sm text-muted-foreground">Active</p></div></CardContent></Card>
        <Card><CardContent className="p-4 flex items-center gap-4"><div className="p-3 rounded-xl bg-warning/10"><Clock className="w-6 h-6 text-warning" /></div><div><p className="text-2xl font-bold">{onLeaveCount}</p><p className="text-sm text-muted-foreground">On Leave</p></div></CardContent></Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/20 shadow-sm">
          <TabsTrigger value="list" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest">
            <Users className="w-4 h-4 mr-2" /> Teachers List
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <UserPlus className="w-4 h-4 mr-2" /> Add New Teacher
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="animate-in fade-in-50 duration-500 outline-none">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1"><Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" /><Input placeholder="Search teachers..." className="pl-10" /></div>
            <div className="flex gap-2"><Button variant="outline"><Filter className="w-4 h-4 mr-2" />Filter</Button></div>
          </div>

          <Card className="data-table border-border/40 shadow-xl overflow-hidden rounded-3xl">
            <CardHeader className="bg-muted/30 border-b border-border/10">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-lg uppercase tracking-tight font-black">All Faculty Members</CardTitle>
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  {teachers.length} teachers
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 transition-colors">
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Teacher</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Class</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Contact</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Subjects</TableHead>
                    <TableHead className="font-black uppercase text-[10px] tracking-widest px-6 py-4">Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-10 bg-muted/5">
                        <p className="font-black uppercase tracking-widest text-[10px] text-muted-foreground">No teachers found in the system</p>
                      </TableCell>
                    </TableRow>
                  ) : teachers.map((teacher) => (
                    <TableRow key={teacher.id} className="hover:bg-primary/[0.02] transition-colors">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-primary/10 transition-transform hover:scale-110"><AvatarImage src="" /><AvatarFallback className="bg-primary/10 text-primary font-bold">{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback></Avatar>
                          <div><p className="font-bold text-sm tracking-tight">{teacher.name}</p><p className="text-xs text-muted-foreground font-medium">{teacher.email}</p></div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 font-medium text-sm">{teacher.class}</TableCell>
                      <TableCell className="px-6 py-4 text-xs font-mono text-muted-foreground">{teacher.phone}</TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap">
                          {teacher.subjects.map(subject => (<Badge key={subject} variant="secondary" className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 border border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">{subject}</Badge>))}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">{getStatusBadge(teacher.status)}</TableCell>
                      <TableCell className="px-6 py-4">
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/10"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-popover border-border/40 shadow-2xl rounded-2xl p-2 animate-in zoom-in-95">
                              <DropdownMenuItem className="rounded-xl px-4 py-2 text-xs font-bold uppercase transition-colors" onClick={() => setEditTeacher(teacher)}>Edit Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive rounded-xl px-4 py-2 text-xs font-bold uppercase transition-colors" onClick={() => setDeleteTarget(teacher)}>Remove</DropdownMenuItem>
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
            <Card className="border-success/20 overflow-hidden rounded-3xl shadow-2xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-success/5 border-b border-success/10 pb-8 p-10">
                <CardTitle className="text-success-foreground flex items-center gap-3 text-3xl font-black uppercase tracking-tight">
                  <span className="p-3 bg-success/10 rounded-2xl"><UserPlus className="w-8 h-8 text-success" /></span>
                  Faculty Registration
                </CardTitle>
                <CardDescription className="text-base font-medium text-muted-foreground/80 ml-16 uppercase tracking-widest text-[10px]">
                  Onboard professional teaching staff and define academic qualifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <AddTeacherForm />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <EditTeacherDialog open={!!editTeacher} onOpenChange={(o) => !o && setEditTeacher(null)} teacher={editTeacher} />
      <DeleteConfirmDialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)} title="Delete Teacher" description={`Are you sure you want to remove ${deleteTarget?.name}? This action cannot be undone.`} onConfirm={handleDelete} isPending={deleteTeacher.isPending} />
    </DashboardLayout>
  );
};

export default Teachers;
