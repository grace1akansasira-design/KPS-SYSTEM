import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTimeSlots } from "@/hooks/useSupabaseData";
import { Download, Printer, ChevronLeft, ChevronRight, Calendar, Loader2, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { CLASSES_BY_SECTION } from "@/lib/school-constants";
import { useRef, useState, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { SECTIONS, Section } from "@/lib/school-constants";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AddTimeSlotForm } from "@/components/forms/AddTimeSlotForm";

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

const Timetable = () => {
  const { user } = useAuth();
  const { data: timeSlots = [], isLoading } = useTimeSlots();
  const [currentWeek, setCurrentWeek] = useState(8);
  const [selectedSection, setSelectedSection] = useState<Section>("Primary");

  const isAdmin = user?.role === 'admin';
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCell, setSelectedCell] = useState<{ day: string; hour: string } | null>(null);
  const timetableRef = useRef<HTMLDivElement>(null);

  const nurseryCls = CLASSES_BY_SECTION.Nursery;

  const filteredSlots = useMemo(() => {
    return timeSlots.filter(slot => {
      // Prioritize explicit section check if available
      if (slot.section) {
        return slot.section === selectedSection;
      }
      
      const cls = slot.class as string | null;
      if (selectedSection === "Nursery") {
        return cls ? nurseryCls.includes(cls) : false;
      }
      return !cls || !nurseryCls.includes(cls);
    });
  }, [timeSlots, selectedSection]);

  const getSlotForCell = (day: string, hour: string) => {
    return filteredSlots.find(slot => {
      if (!slot?.start_time) return false;
      const slotStart = parseInt(slot.start_time.split(':')[0]);
      const cellHour = parseInt(hour.split(':')[0]);
      return slot.day === day && slotStart === cellHour;
    });
  };

  const getSlotDuration = (slot: typeof timeSlots[0]) => {
    if (!slot?.start_time || !slot?.end_time) return 1;
    const start = parseInt(slot.start_time.split(':')[0]);
    const end = parseInt(slot.end_time.split(':')[0]);
    return Math.max(1, end - start);
  };

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'lesson': return 'bg-primary/10 border-primary/30 text-primary ';
      case 'practical': return 'bg-success/10 border-success/30 text-success ';
      case 'games': return 'bg-warning/10 border-warning/30 text-warning ';
      case 'break': return 'bg-blue-100 border-blue-300 text-blue-800 font-bold';
      case 'lunch': return 'bg-orange-100 border-orange-300 text-orange-800 font-bold';
      case 'assembly': return 'bg-purple-100 border-purple-300 text-purple-800 font-bold';
      default: return 'bg-muted';
    }
  };

  const handlePrint = useCallback(() => { window.print(); }, []);

  const handleDownloadPDF = useCallback(async () => {
    if (!timetableRef.current) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(timetableRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const imgX = (pdfWidth - canvas.width * ratio) / 2;
      pdf.setFontSize(16);
      pdf.text(`${selectedSection} Timetable - Week ${currentWeek}`, pdfWidth / 2, 8, { align: 'center' });
      pdf.addImage(imgData, 'PNG', imgX, 10, canvas.width * ratio, canvas.height * ratio);
      pdf.save(`${selectedSection.toLowerCase()}-timetable-week-${currentWeek}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF generation failed:', error);
      toast.error('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [currentWeek, selectedSection]);

  const handleCellClick = (day: string, hour: string) => {
    if (!isAdmin) return;
    setSelectedCell({ day, hour });
    setIsAddDialogOpen(true);
  };

  if (isLoading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  return (
    <DashboardLayout title="Timetable Dashboard" description="Displays the full school timetable — view, print, or download weekly class schedules for Primary and Nursery sections.">

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl bg-card border-none shadow-2xl rounded-3xl backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary flex items-center gap-2">
              <Plus className="w-6 h-6" />
              Schedule New Session
            </DialogTitle>
          </DialogHeader>
          {selectedCell && (
            <AddTimeSlotForm
              onSuccess={() => setIsAddDialogOpen(false)}
              onCancel={() => setIsAddDialogOpen(false)}
              initialValues={{
                day: selectedCell.day,
                section: selectedSection,
                start_time: selectedCell.hour,
                end_time: `${String(parseInt(selectedCell.hour.split(':')[0]) + 1).padStart(2, '0')}:00`
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8 mt-2 print:hidden bg-card/30 backdrop-blur-md p-6 rounded-2xl border border-white/10 shadow-xl">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(w => w - 1)} className="rounded-full"><ChevronLeft className="w-4 h-4" /></Button>
            <div className="flex items-center gap-3 bg-primary/10 px-4 py-2 rounded-full border border-primary/20">
              <Calendar className="w-5 h-5 text-primary" />
              <div className="flex flex-col">
                <span className="font-bold text-sm leading-none">Week {currentWeek}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Academic Term</span>
              </div>
            </div>
            <Button variant="outline" size="icon" onClick={() => setCurrentWeek(w => w + 1)} className="rounded-full"><ChevronRight className="w-4 h-4" /></Button>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 p-1 bg-muted/50 rounded-lg w-fit">
            {SECTIONS.map((section) => (
              <Button
                key={section}
                variant={selectedSection === section ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  setSelectedSection(section);
                  // Default to first class of section? Or keep 'All'
                }}
                className={cn(
                  "px-6 rounded-md transition-all duration-300",
                  selectedSection === section ? "shadow-lg scale-105" : "hover:bg-primary/10"
                )}
              >
                {section}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={handlePrint} className="rounded-xl border-white/20 hover:bg-primary/10"><Printer className="w-4 h-4 mr-2" />Print</Button>
          <Button onClick={handleDownloadPDF} disabled={isDownloading} className="rounded-xl bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
            {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {isDownloading ? 'Generating...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 mb-6 px-2">
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/30" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lesson</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-success shadow-sm shadow-success/30" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Practical</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-warning shadow-sm shadow-warning/30" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Games/PE</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-400 shadow-sm" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Break</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-400 shadow-sm" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Lunch</span></div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-purple-400 shadow-sm" /><span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Assembly</span></div>
      </div>

      <Card className="overflow-hidden border-white/10 shadow-2xl rounded-3xl bg-card/60 backdrop-blur-xl" ref={timetableRef}>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-6 border-b border-white/10 bg-blue-600/90 backdrop-blur-md">
                <div className="p-6 font-bold text-xs uppercase tracking-widest text-white border-l-4 border-blue-800">Schedule Time</div>
                {days.map(day => (<div key={day} className="p-6 font-bold text-center border-l border-blue-200/20 uppercase tracking-widest text-xs text-blue-50">{day}</div>))}
              </div>
              {hours.map((hour) => (
                <div key={hour} className="grid grid-cols-6 border-b border-white/5 last:border-b-0 group">
                  <div className="p-6 font-mono text-xs font-semibold text-blue-700 border-r border-blue-100 border-l-4 border-blue-600 bg-blue-50/50 flex items-center justify-center transition-colors group-hover:bg-blue-100/50">{hour}</div>
                  {days.map(day => {
                    const slot = getSlotForCell(day, hour);
                    if (slot) {
                      const duration = getSlotDuration(slot);
                      return (
                        <div key={`${day}-${hour}`} className={cn("p-3 border-l border-blue-100/20 relative m-1 rounded-xl transition-all duration-300 hover:scale-[1.02] hover:z-10 shadow-sm print:shadow-none print:border-current print:border-[0.5px]", getSlotColor(slot.type))} style={{ gridRow: `span ${duration}`, minHeight: `${duration * 70}px`, WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
                          <div className="space-y-1.5">
                            <Badge variant="outline" className="font-bold text-[10px] uppercase tracking-wider bg-white/20 border-white/30 backdrop-blur-sm print:border-current print:bg-transparent">{slot.subject || "Unknown"}</Badge>
                            <p className="text-sm font-bold truncate leading-tight print:text-black">{slot.teacher?.split(' ').slice(-1)[0] || ""}</p>
                            <div className="flex items-center gap-1.5 mt-2 overflow-hidden">
                              <div className="w-1.5 h-1.5 rounded-full bg-current opacity-40 shrink-0 print:opacity-100" />
                              <p className="text-[10px] uppercase font-bold tracking-tight opacity-70 truncate print:opacity-100 print:text-black">{slot.room || ""}</p>
                            </div>
                            <p className="text-[10px] font-mono opacity-50 absolute bottom-3 right-3 print:opacity-100 print:text-black">{slot.start_time || ""} - {slot.end_time || ""}</p>
                          </div>
                        </div>
                      );
                    }
                    const isPartOfSlot = filteredSlots.some(s => {
                      if (s.day !== day || !s?.start_time || !s?.end_time) return false;
                      const slotStart = parseInt(s.start_time.split(':')[0]);
                      const slotEnd = parseInt(s.end_time.split(':')[0]);
                      const cellHour = parseInt(hour.split(':')[0]);
                      return cellHour > slotStart && cellHour < slotEnd;
                    });
                    if (isPartOfSlot) return null;
                    return (
                      <div 
                        key={`${day}-${hour}`} 
                        onClick={() => isAdmin && handleCellClick(day, hour)} 
                        className={cn(
                          "p-2 border-l border-blue-100/20 min-h-[70px] transition-all duration-300 border-dashed flex items-center justify-center group/cell",
                          isAdmin ? "hover:bg-primary/5 cursor-pointer" : "cursor-default"
                        )}
                      >
                        {isAdmin && <Plus className="w-4 h-4 text-primary opacity-0 group-hover/cell:opacity-100 transition-opacity" />}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Timetable;
