import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/dashboard/StatCard";
import { 
  GraduationCap, Users, BookOpen, Building2, 
  Calendar, Clock, LayoutDashboard 
} from "lucide-react";
import { useDashboardStats, useRecentActivity } from "@/hooks/useSupabaseData";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SECTIONS, Section } from "@/lib/school-constants";
import { useAuth } from "@/contexts/AuthContext";

// Components
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";

// Inline Forms
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";
import { AddSubjectForm } from "@/components/forms/AddSubjectForm";
import { AddRoomForm } from "@/components/forms/AddRoomForm";
import { AddPupilForm } from "@/components/forms/AddPupilForm";
import { AddTimeSlotForm } from "@/components/forms/AddTimeSlotForm";
import { GenerateTimetableDialog } from "@/components/dialogs/GenerateTimetableDialog";


const Index = () => {
  const { user } = useAuth();
  const { data: stats } = useDashboardStats();
  const recentActivityQuery = useRecentActivity();
  const [showGenerateTimetable, setShowGenerateTimetable] = useState(false);

  const isAdmin = user?.role === 'admin';

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Administrator",
      department_head: "Head Teacher",
      lecturer: "Teacher",
      student: "Pupil",
    };
    return roleMap[role] || role;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DashboardLayout>
      <div className="dashboard-content max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10 py-6">
        
        {/* Header Section */}
        <section className="text-center space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-6 drop-shadow-2xl">
              <img src="/school%20budge.png.png" alt="KPS Logo" className="w-full h-full object-contain" />
            </div>
            <div className="inline-block">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-blue-600 uppercase leading-tight drop-shadow-sm">
                WELCOME TO KABALE PREPARATORY SCHOOL
              </h1>
              <div className="h-1.5 w-32 bg-gradient-to-r from-blue-600 via-blue-400 to-blue-600 mt-6 rounded-full mx-auto" />
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-700 border border-border/50">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary-foreground/20" />
          <div className="relative z-10 p-12 md:p-16 lg:p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-5 rounded-[2rem] bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl mb-4">
              <Calendar className="w-12 h-12 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-primary-foreground tracking-tighter uppercase max-w-4xl mx-auto">
              KABALE PREPARATORY SCHOOL TIMETABLE MANAGEMENT SYSTEM
            </h2>
            <div className="px-6 py-2.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-[10px] font-black uppercase tracking-[0.3em] mt-8 shadow-inner">
              Professional Academy Management
            </div>
          </div>
        </section>



        {/* Stats Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          <StatCard title="Classes / Rooms" value={stats?.totalRooms ?? "..."} icon={Building2} variant="default" />
          <StatCard title="Teaching Staff" value={stats?.totalTeachers ?? "..."} icon={Users} variant="success" />
          <StatCard title="Enrolled Pupils" value={stats?.totalPupils?.toLocaleString() ?? "..."} icon={GraduationCap} variant="primary" />
          <StatCard title="Active Lessons" value={stats?.totalSubjects ?? "..."} icon={BookOpen} variant="accent" />
        </section>

        {/* Main Operational Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <div className="lg:col-span-8 space-y-8">
            <TodaySchedule />
            
            {isAdmin && (
              <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] p-8 lg:p-10 shadow-lg">
                <div className="flex items-center gap-4 mb-8">
                  <div className="relative">
                    <Avatar className="w-16 h-16 shadow-2xl border-2 border-primary/20 ring-4 ring-primary/5">
                      <AvatarImage src={user?.avatar_url} className="object-cover" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-black">
                        {user?.name ? getInitials(user.name) : "A"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-card" title="Logged in as Admin" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-blue-600 uppercase tracking-tight">Management Console</h3>
                    <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Admin Level Control</p>
                  </div>
                </div>

                <Tabs defaultValue="classes" className="space-y-8">
                <TabsList className="flex flex-wrap h-auto gap-3 bg-muted/30 p-2 rounded-3xl border border-border/20 shadow-inner max-w-fit">
                  <TabsTrigger value="classes" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all">
                    <Building2 className="w-4 h-4 mr-2" /> Classes
                  </TabsTrigger>
                  <TabsTrigger value="teachers" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all">
                    <Users className="w-4 h-4 mr-2" /> Teachers
                  </TabsTrigger>
                  <TabsTrigger value="pupils" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all">
                    <GraduationCap className="w-4 h-4 mr-2" /> Pupils
                  </TabsTrigger>
                  <TabsTrigger value="lessons" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-widest transition-all">
                    <BookOpen className="w-4 h-4 mr-2" /> Lessons
                  </TabsTrigger>
                  <TabsTrigger value="timetable" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground rounded-2xl px-6 py-3 text-xs font-black uppercase tracking-[0.15em] transition-all bg-secondary/10">
                    <Calendar className="w-4 h-4 mr-2" /> KABALE PREPARATORY TIMETABLE
                  </TabsTrigger>
                </TabsList>

                <div className="mt-8">
                  <TabsContent value="classes" className="animate-in fade-in-50 duration-500 outline-none">
                    <Card className="border-warning/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
                      <CardHeader className="bg-warning/10 border-b border-warning/10 pb-8 p-10">
                        <CardTitle className="text-blue-600 flex items-center gap-3 text-3xl font-black">
                          <span className="p-3 bg-warning/20 rounded-2xl"><Building2 className="w-8 h-8 text-warning" /></span>
                          Class Management
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10">
                        <Tabs defaultValue="Primary" className="space-y-6">
                          <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10">
                            <TabsTrigger value="Primary" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest transition-all">Primary</TabsTrigger>
                            <TabsTrigger value="Nursery" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest transition-all">Nursery</TabsTrigger>
                          </TabsList>
                          <TabsContent value="Primary" className="animate-in slide-in-from-left-2 duration-300">
                            <AddRoomForm defaultSection="Primary" />
                          </TabsContent>
                          <TabsContent value="Nursery" className="animate-in slide-in-from-left-2 duration-300">
                            <AddRoomForm defaultSection="Nursery" />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="teachers" className="animate-in fade-in-50 duration-500 outline-none">
                    <Card className="border-success/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
                      <CardHeader className="bg-success/5 border-b border-success/10 pb-8 p-10">
                        <CardTitle className="text-blue-600 flex items-center gap-3 text-3xl font-black">
                          <span className="p-3 bg-success/10 rounded-2xl"><Users className="w-8 h-8 text-success" /></span>
                          Faculty Registration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10">
                        <Tabs defaultValue="Primary" className="space-y-6">
                          <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10">
                            <TabsTrigger value="Primary" className="px-8 py-2 text-xs font-black uppercase tracking-widest">Primary Faculty</TabsTrigger>
                            <TabsTrigger value="Nursery" className="px-8 py-2 text-xs font-black uppercase tracking-widest">Nursery Faculty</TabsTrigger>
                          </TabsList>
                          <TabsContent value="Primary" className="animate-in slide-in-from-left-2 duration-300">
                            <AddTeacherForm defaultSection="Primary" />
                          </TabsContent>
                          <TabsContent value="Nursery" className="animate-in slide-in-from-left-2 duration-300">
                            <AddTeacherForm defaultSection="Nursery" />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="pupils" className="animate-in fade-in-50 duration-500 outline-none">
                    <Card className="border-primary/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
                      <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8 p-10">
                        <CardTitle className="text-blue-600 flex items-center gap-3 text-3xl font-black">
                          <span className="p-3 bg-primary/10 rounded-2xl"><GraduationCap className="w-8 h-8 text-primary" /></span>
                          Pupil Admission
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10">
                        <Tabs defaultValue="Primary" className="space-y-6">
                          <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10">
                            <TabsTrigger value="Primary" className="px-8 py-2 text-xs font-black uppercase tracking-widest transition-all">Primary Pupils</TabsTrigger>
                            <TabsTrigger value="Nursery" className="px-8 py-2 text-xs font-black uppercase tracking-widest transition-all">Nursery Pupils</TabsTrigger>
                          </TabsList>
                          <TabsContent value="Primary" className="animate-in slide-in-from-left-2 duration-300">
                            <AddPupilForm defaultSection="Primary" />
                          </TabsContent>
                          <TabsContent value="Nursery" className="animate-in slide-in-from-left-2 duration-300">
                            <AddPupilForm defaultSection="Nursery" />
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="lessons" className="animate-in fade-in-50 duration-500 outline-none">
                    <Card className="border-accent/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
                      <CardHeader className="bg-accent/5 border-b border-accent/10 pb-8 p-10">
                        <CardTitle className="text-blue-600 flex items-center gap-3 text-3xl font-black">
                          <span className="p-3 bg-accent/20 rounded-2xl"><BookOpen className="w-8 h-8 text-accent-foreground" /></span>
                          Subject Repository
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-10">
                        <Tabs defaultValue="Primary" className="space-y-6">
                          <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10">
                            {SECTIONS.map(s => (
                              <TabsTrigger key={s} value={s} className="px-8 py-2 text-xs font-black uppercase tracking-widest">{s} Section</TabsTrigger>
                            ))}
                          </TabsList>
                          {SECTIONS.map(s => (
                            <TabsContent key={s} value={s} className="animate-in slide-in-from-left-2 duration-300">
                              <AddSubjectForm defaultSection={s as any} />
                            </TabsContent>
                          ))}
                        </Tabs>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timetable" className="animate-in fade-in-50 duration-500 outline-none">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
                      <Card className="border-primary/20 rounded-3xl shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden h-fit">
                        <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                          <CardTitle className="text-blue-600 flex items-center gap-3 uppercase tracking-tight font-black">
                            <span className="p-2.5 bg-primary/10 rounded-xl"><Clock className="w-6 h-6" /></span>
                            Manual Slot Entry
                          </CardTitle>
                          <p className="font-medium text-muted-foreground/80">Insert specific periods into the live schedule.</p>
                        </CardHeader>
                        <CardContent className="p-8">
                          <Tabs defaultValue="Primary" className="space-y-6">
                            <TabsList className="bg-muted/30 p-1 rounded-xl border border-border-10">
                              <TabsTrigger value="Primary" className="px-8 py-2 text-xs font-black uppercase tracking-widest transition-all">Primary</TabsTrigger>
                              <TabsTrigger value="Nursery" className="px-8 py-2 text-xs font-black uppercase tracking-widest transition-all">Nursery</TabsTrigger>
                            </TabsList>
                            <TabsContent value="Primary">
                              <AddTimeSlotForm defaultSection="Primary" />
                            </TabsContent>
                            <TabsContent value="Nursery">
                              <AddTimeSlotForm defaultSection="Nursery" />
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>

                      <Card className="border-secondary/30 bg-secondary/[0.03] rounded-3xl shadow-xl h-fit border-dashed border-2 relative overflow-hidden group">
                        <CardHeader className="border-b border-secondary/20 p-8 relative z-10">
                          <CardTitle className="text-blue-600 flex items-center gap-3 uppercase tracking-tight font-black">
                            <span className="p-2.5 bg-secondary/10 rounded-xl"><Calendar className="w-6 h-6 text-secondary-foreground" /></span>
                            Automated Master Grid
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 text-center flex flex-col items-center relative z-10">
                          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 shadow-inner">
                            <Calendar className="w-10 h-10 text-secondary-foreground" />
                          </div>
                          <h4 className="text-xl font-black text-blue-600 mb-4 uppercase tracking-tight">Generate Master Schedule</h4>
                          <p className="text-sm text-muted-foreground font-medium mb-8 max-w-xs leading-relaxed">
                            Use the system's core orchestration engine to automatically generate a collision-free academic timetable for the entire school.
                          </p>
                          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl h-14 rounded-2xl px-10 text-xs font-black uppercase tracking-widest w-full" onClick={() => setShowGenerateTimetable(true)}>
                            <Calendar className="w-4 h-4 mr-2" /> Initialize Master Engine
                          </Button>
                        </CardContent>
                      </Card>
                    </div>


                  </TabsContent>
                </div>
                </Tabs>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8 h-full">
            <RecentActivity activities={recentActivityQuery.data || []} />

            <Card className="bg-primary border-none rounded-[2.5rem] p-12 shadow-2xl text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              <div className="flex flex-col items-center space-y-8 relative z-10">
                <div className="w-32 h-32 rounded-full bg-white/15 p-6 shadow-2xl ring-4 ring-white/10">
                  <img src="/school%20budge.png.png" alt="KPS Badge" className="w-full h-full object-contain filter drop-shadow-xl" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-black text-white tracking-tight uppercase">KPS Timetable Hub</h4>
                  <p className="text-blue-200 text-[11px] font-black uppercase tracking-[0.4em] mt-3">Excellence in Organization</p>
                </div>
                <div className="pt-6 border-t border-white/15 w-full text-white/50 text-[10px] font-bold uppercase tracking-[0.5em]">
                  Academic Year 2027
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <GenerateTimetableDialog open={showGenerateTimetable} onOpenChange={setShowGenerateTimetable} />
    </DashboardLayout>
  );
};

export default Index;
