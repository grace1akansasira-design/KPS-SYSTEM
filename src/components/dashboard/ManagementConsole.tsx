import { useState } from "react";
import { 
  Building2, Users, GraduationCap, BookOpen, 
  Calendar, Clock, LayoutDashboard 
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Inline Forms
import { AddTeacherForm } from "@/components/forms/AddTeacherForm";
import { AddSubjectForm } from "@/components/forms/AddSubjectForm";
import { AddRoomForm } from "@/components/forms/AddRoomForm";
import { AddPupilForm } from "@/components/forms/AddPupilForm";
import { AddTimeSlotForm } from "@/components/forms/AddTimeSlotForm";
import { GenerateTimetableDialog } from "@/components/dialogs/GenerateTimetableDialog";
import { RestorationTool } from "@/components/admin/RestorationTool";

export function ManagementConsole() {
  const [showGenerateTimetable, setShowGenerateTimetable] = useState(false);

  return (
    <div className="bg-card/40 backdrop-blur-md border border-border/40 rounded-[2rem] p-8 lg:p-10 shadow-lg">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-20 h-20 rounded-2xl bg-primary/5 p-3 shadow-inner border border-primary/10">
          <img src="/school%20budge.png.png" alt="KPS Badge" className="w-full h-full object-contain filter drop-shadow-md" />
        </div>
        <div>
          <h3 className="text-2xl font-black text-blue-600 uppercase tracking-tight text-left">Management Console</h3>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-0.5 text-left text-[10px]">Academic Operations & Administration</p>
        </div>
      </div>

      <Tabs defaultValue="classes" className="space-y-8">
        <TabsList className="justify-start flex flex-wrap h-auto gap-3 bg-muted/30 p-2 rounded-3xl border border-border/20 shadow-inner max-w-fit overflow-x-auto no-scrollbar">
          <TabsTrigger value="classes" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
            <Building2 className="w-4 h-4 mr-2" /> Classes
          </TabsTrigger>
          <TabsTrigger value="teachers" className="data-[state=active]:bg-success data-[state=active]:text-success-foreground rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
            <Users className="w-4 h-4 mr-2" /> Teachers
          </TabsTrigger>
          <TabsTrigger value="pupils" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
            <GraduationCap className="w-4 h-4 mr-2" /> Pupils
          </TabsTrigger>
          <TabsTrigger value="lessons" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all">
            <BookOpen className="w-4 h-4 mr-2" /> Lessons
          </TabsTrigger>
          <TabsTrigger value="timetable" className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-[0.15em] transition-all bg-secondary/10">
            <Calendar className="w-4 h-4 mr-2" /> KABALE PREPARATORY TIMETABLE
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="classes" className="animate-in fade-in-50 duration-500 outline-none">
            <Card className="border-warning/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-warning/10 border-b border-warning/10 pb-8 p-10">
                <CardTitle className="text-primary flex items-center gap-3 text-2xl font-black text-left uppercase tracking-tight">
                  <span className="p-3 bg-warning/20 rounded-2xl"><Building2 className="w-8 h-8 text-warning" /></span>
                  Class Management
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground/80 ml-16 text-left uppercase tracking-widest text-[9px]">
                  Define physical space and structural learning environments.
                </p>
              </CardHeader>
              <CardContent className="p-10">
                <AddRoomForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="teachers" className="animate-in fade-in-50 duration-500 outline-none">
            <Card className="border-success/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-success/5 border-b border-success/10 pb-8 p-10">
                <CardTitle className="text-success-foreground flex items-center gap-3 text-2xl font-black text-left uppercase tracking-tight">
                  <span className="p-3 bg-success/10 rounded-2xl"><Users className="w-8 h-8 text-success" /></span>
                  Faculty Registration
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground/80 ml-16 text-left uppercase tracking-widest text-[9px]">
                  Onboard professional teaching staff and define qualifications.
                </p>
              </CardHeader>
              <CardContent className="p-10">
                <AddTeacherForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pupils" className="animate-in fade-in-50 duration-500 outline-none">
            <Card className="border-primary/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-primary/5 border-b border-primary/10 pb-8 p-10">
                <CardTitle className="text-primary flex items-center gap-3 text-2xl font-black text-left uppercase tracking-tight">
                  <span className="p-3 bg-primary/10 rounded-2xl"><GraduationCap className="w-8 h-8 text-primary" /></span>
                  Pupil Admission
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground/80 ml-16 text-left uppercase tracking-widest text-[9px]">
                  Official pupil enrollment system for all preparatory levels.
                </p>
              </CardHeader>
              <CardContent className="p-10">
                <AddPupilForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lessons" className="animate-in fade-in-50 duration-500 outline-none">
            <Card className="border-accent/20 overflow-hidden rounded-3xl shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader className="bg-accent/5 border-b border-accent/10 pb-8 p-10">
                <CardTitle className="text-primary flex items-center gap-3 text-2xl font-black text-left uppercase tracking-tight">
                  <span className="p-3 bg-accent/20 rounded-2xl"><BookOpen className="w-8 h-8 text-accent-foreground" /></span>
                  Subject Repository
                </CardTitle>
                <p className="text-sm font-medium text-muted-foreground/80 ml-16 text-left uppercase tracking-widest text-[9px]">
                  Register curricula and academic requirements for both Primary and Nursery.
                </p>
              </CardHeader>
              <CardContent className="p-10">
                <Tabs defaultValue="Primary" className="space-y-6">
                  <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10">
                    <TabsTrigger value="Primary" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest transition-all">Primary</TabsTrigger>
                    <TabsTrigger value="Nursery" className="px-8 py-2 text-[10px] font-black uppercase tracking-widest transition-all">Nursery</TabsTrigger>
                  </TabsList>
                  <TabsContent value="Primary" className="animate-in slide-in-from-left-2 duration-300">
                    <AddSubjectForm defaultSection="Primary" />
                  </TabsContent>
                  <TabsContent value="Nursery" className="animate-in slide-in-from-left-2 duration-300">
                    <AddSubjectForm defaultSection="Nursery" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="timetable" className="animate-in fade-in-50 duration-500 outline-none">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
              <RestorationTool />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <Card className="border-primary/20 rounded-3xl shadow-xl bg-card/60 backdrop-blur-sm overflow-hidden h-fit">
                <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                  <CardTitle className="text-primary flex items-center gap-3 uppercase tracking-tight font-black text-left text-lg">
                    <span className="p-2.5 bg-primary/10 rounded-xl"><Clock className="w-6 h-6" /></span>
                    Manual Slot Entry
                  </CardTitle>
                  <p className="font-medium text-muted-foreground/80 text-left text-[10px] uppercase tracking-widest">Insert specific periods into the schedule.</p>
                </CardHeader>
                <CardContent className="p-8">
                   <Tabs defaultValue="Primary" className="space-y-6">
                    <TabsList className="bg-muted/30 p-1 rounded-xl border border-border-10">
                      <TabsTrigger value="Primary" className="px-6 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all">Primary</TabsTrigger>
                      <TabsTrigger value="Nursery" className="px-6 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all">Nursery</TabsTrigger>
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
                  <CardTitle className="text-secondary-foreground flex items-center gap-3 uppercase tracking-tight font-black text-left text-lg">
                    <span className="p-2.5 bg-secondary/10 rounded-xl"><Calendar className="w-6 h-6 text-secondary-foreground" /></span>
                    Automated Master Grid
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 text-center flex flex-col items-center relative z-10">
                  <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mb-6 shadow-inner transition-transform group-hover:scale-110 duration-500">
                    <Calendar className="w-10 h-10 text-secondary-foreground" />
                  </div>
                  <h4 className="text-xl font-black text-foreground mb-4 uppercase tracking-tight">Generate Master Schedule</h4>
                  <p className="text-sm text-muted-foreground font-medium mb-8 max-w-xs leading-relaxed uppercase tracking-widest text-[9px]">
                    Use the system's core orchestration engine to automatically generate a collision-free academic timetable for the entire school.
                  </p>
                  <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-xl h-14 rounded-2xl px-10 text-[10px] font-black uppercase tracking-widest w-full" onClick={() => setShowGenerateTimetable(true)}>
                    <Calendar className="w-4 h-4 mr-2" /> Initialize Master Engine
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <GenerateTimetableDialog open={showGenerateTimetable} onOpenChange={setShowGenerateTimetable} />
    </div>
  );
}
