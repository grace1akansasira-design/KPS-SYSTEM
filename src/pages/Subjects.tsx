import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubjects, useAddSubject, useTeachers, useDeleteSubject, type Subject } from "@/hooks/useSupabaseData";
import { useAuth } from "@/contexts/AuthContext";
import {
  Search, Filter, MoreHorizontal, BookOpen, Users, Clock, Loader2,
  ChevronRight, GraduationCap, Zap, PlusSquare
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { EditSubjectDialog } from "@/components/dialogs/EditSubjectDialog";
import { DeleteConfirmDialog } from "@/components/dialogs/DeleteConfirmDialog";
import { toast } from "@/hooks/use-toast";
import { AddSubjectForm } from "@/components/forms/AddSubjectForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const Subjects = () => {
  const { data: subjectsFromQuery = [], isLoading } = useSubjects();
  
  const DEFAULT_SUBJECTS: Subject[] = [
    { 
      id: 'def-1', 
      code: 'NUR-01', 
      name: 'Play & Discovery', 
      class: 'Baby', 
      section: 'Nursery', 
      periods_per_week: 5, 
      pupils: 20, 
      teacher: 'Mrs. Musisi Sarah', 
      term: 'Term 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'def-2', 
      code: 'NUR-02', 
      name: 'Numbers & Shapes', 
      class: 'Middle', 
      section: 'Nursery', 
      periods_per_week: 5, 
      pupils: 25, 
      teacher: 'Teacher Monica', 
      term: 'Term 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'def-3', 
      code: 'NUR-03', 
      name: 'Reading Readiness', 
      class: 'Top', 
      section: 'Nursery', 
      periods_per_week: 5, 
      pupils: 30, 
      teacher: 'Teacher Grace', 
      term: 'Term 1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    { 
      id: 'def-4', 
      code: 'P1-MAT', 
      name: 'Mathematics', 
      class: 'Primary 1', 
      section: 'Primary', 
      periods_per_week: 6, 
      pupils: 40, 
      teacher: 'Mr. Robert Mukasa', 
      term: 'Term 1 2025',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
  ];

  const subjects = subjectsFromQuery.length > 0 ? subjectsFromQuery : DEFAULT_SUBJECTS;
  
  const deleteSubject = useDeleteSubject();
  const addSubject = useAddSubject();
  const { data: teachers = [] } = useTeachers();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [editSubject, setEditSubject] = useState<Subject | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Subject | null>(null);
  const [search, setSearch] = useState("");

  const totalPupils = subjects.reduce((sum, s) => sum + s.pupils, 0);
  const totalPeriods = subjects.reduce((sum, s) => sum + s.periods_per_week, 0);
  const uniqueClasses = new Set(subjects.map(s => s.class)).size;

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase()) ||
    s.teacher.toLowerCase().includes(search.toLowerCase()) ||
    s.class.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubject.mutateAsync(deleteTarget.id);
      toast({ title: "Subject Deleted", description: `${deleteTarget.name} has been removed.` });
      setDeleteTarget(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };


  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Subjects Dashboard">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10"><BookOpen className="w-5 h-5 text-primary" /></div>
            <div><p className="text-2xl font-black">{subjects.length}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Subjects</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10"><Users className="w-5 h-5 text-success" /></div>
            <div><p className="text-2xl font-black">{totalPupils}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Enrolled Pupils</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-warning/10"><Clock className="w-5 h-5 text-warning" /></div>
            <div><p className="text-2xl font-black">{totalPeriods}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Periods/Week</p></div>
          </CardContent>
        </Card>
        <Card className="border-border/40 bg-card/60 backdrop-blur-md shadow-xl">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-accent/20"><GraduationCap className="w-5 h-5 text-accent-foreground" /></div>
            <div><p className="text-2xl font-black">{uniqueClasses}</p><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Classes</p></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList className="bg-muted/30 p-1 rounded-2xl border border-border/20 shadow-sm">
          <TabsTrigger value="list" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all">
            <BookOpen className="w-4 h-4 mr-2" /> Subject Roster
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="add" className="rounded-xl px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all">
              <PlusSquare className="w-4 h-4 mr-2" /> Add New Subject
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="list" className="animate-in fade-in-50 duration-500 outline-none space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search subjects, teachers, classes..."
                className="pl-10 h-11 border-border/40 bg-card/60 backdrop-blur-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-11 border-border/40">
              <Filter className="w-4 h-4 mr-2" />Filter
            </Button>
          </div>

          <Card className="border-border/40 shadow-2xl overflow-hidden rounded-[1.5rem] bg-card/40 backdrop-blur-md">
            <CardHeader className="bg-muted/30 border-b border-border/10 p-5">
              <div className="flex flex-col gap-1">
                <CardTitle className="text-base font-black uppercase tracking-tighter flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Academic Curriculum
                </CardTitle>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-6">
                  <span>{filtered.length} subjects</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 border-b border-border/20">
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest">Code</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest">Subject</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest">Class</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest">Teacher</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest text-center">Periods</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest text-center">Pupils</TableHead>
                      <TableHead className="px-5 py-3 font-black uppercase text-[10px] tracking-widest">Term</TableHead>
                      {isAdmin && <TableHead className="w-10" />}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={isAdmin ? 8 : 7} className="text-center py-10 text-muted-foreground bg-muted/5">
                          <p className="font-black uppercase tracking-widest text-[10px]">No subjects found</p>
                        </TableCell>
                      </TableRow>
                    ) : filtered.map(subject => (
                      <TableRow key={subject.id} className="hover:bg-primary/[0.02] transition-colors border-b border-border/10 last:border-0">
                        <TableCell className="px-5 py-4">
                          <Badge variant="outline" className="font-mono font-black text-[10px] px-2 py-0.5 bg-primary/5 text-primary border-primary/20">{subject.code}</Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 font-black text-sm text-blue-600 dark:text-blue-400 capitalize">{subject.name}</TableCell>
                        <TableCell className="px-5 py-4 font-black text-xs uppercase tracking-tight text-muted-foreground">{subject.class}</TableCell>
                        <TableCell className="px-5 py-4 text-sm">{subject.teacher}</TableCell>
                        <TableCell className="px-5 py-4 text-center">
                          <Badge variant="secondary" className="text-[10px] font-black">{subject.periods_per_week}×</Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-center font-black text-sm">{subject.pupils}</TableCell>
                        <TableCell className="px-5 py-4">
                          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-black text-[9px] uppercase tracking-widest">{subject.term}</Badge>
                        </TableCell>
                        {isAdmin && (
                          <TableCell className="px-5 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl hover:bg-primary/10">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl shadow-xl p-1">
                                <DropdownMenuItem className="rounded-lg text-xs font-bold" onClick={() => setEditSubject(subject)}>Edit Subject</DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive rounded-lg text-xs font-bold" onClick={() => setDeleteTarget(subject)}>Delete</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {isAdmin && (
          <TabsContent value="add" className="animate-in slide-in-from-right-4 fade-in-50 duration-500 outline-none">
            <Card className="border-primary/20 overflow-hidden rounded-[2rem] shadow-2xl bg-card/80 backdrop-blur-md relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-10 p-12">
                <CardTitle className="text-primary flex items-center gap-4 text-3xl font-black uppercase tracking-tight">
                  <span className="p-3.5 bg-primary/10 rounded-2xl shadow-xl"><PlusSquare className="w-8 h-8 text-primary" /></span>
                  Subject Registration
                </CardTitle>
                <CardDescription className="text-base font-medium text-muted-foreground/80 ml-[4.5rem] uppercase tracking-[0.2em] text-[10px]">
                  Register a new academic module and define learning objectives.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-12">
                <AddSubjectForm onSuccess={() => {
                  toast({ title: "Subject Added", description: "The subject has been added to the curriculum." });
                }} />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <EditSubjectDialog open={!!editSubject} onOpenChange={o => !o && setEditSubject(null)} subject={editSubject} />
      <DeleteConfirmDialog
        open={!!deleteTarget}
        onOpenChange={o => !o && setDeleteTarget(null)}
        title="Delete Subject"
        description={`Are you sure you want to delete ${deleteTarget?.name}? This cannot be undone.`}
        onConfirm={handleDelete}
        isPending={deleteSubject.isPending}
      />
    </DashboardLayout>
  );
};

export default Subjects;
